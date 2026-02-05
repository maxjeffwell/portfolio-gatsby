---
title: "Automatic TLS with cert-manager and Let's Encrypt"
date: "2025-12-21"
tags: ["kubernetes", "cert-manager", "tls", "letsencrypt", "security"]
excerpt: "Setting up cert-manager for automatic TLS certificate provisioning - no more manual certificate management."
---

With 6+ subdomains serving production traffic, manual certificate management isn't viable. Today I set up cert-manager with Let's Encrypt for automatic TLS.

## Installing cert-manager

cert-manager is the standard for Kubernetes certificate management:

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

Verify the installation:

```bash
$ kubectl get pods -n cert-manager
NAME                                       READY   STATUS    RESTARTS
cert-manager-776494b6cf-tlc6z              1/1     Running   0
cert-manager-cainjector-6cf76fc759-7vwhl   1/1     Running   0
cert-manager-webhook-7bfbfdc97c-2wtcn      1/1     Running   0
```

## ClusterIssuer Configuration

I created a ClusterIssuer for Let's Encrypt production:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: maxjeffwell@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - http01:
          ingress:
            class: traefik
```

The HTTP-01 challenge works by:

1. cert-manager creates a temporary ingress
2. Let's Encrypt requests `/.well-known/acme-challenge/<token>`
3. cert-manager responds with the challenge response
4. Certificate is issued

## Annotating Ingresses

To request a certificate, I just add annotations to my ingresses:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bookmarked-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod  # This triggers cert-manager
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - bookmarked-k8s.el-jefe.me
      secretName: bookmarked-tls  # cert-manager creates this
  rules:
    - host: bookmarked-k8s.el-jefe.me
      # ...
```

## Watching Certificates

Check certificate status:

```bash
$ kubectl get certificates
NAME             READY   SECRET           AGE
bookmarked-tls   True    bookmarked-tls   5m
codetalk-tls     True    codetalk-tls     5m
argocd-tls       True    argocd-tls       5m
grafana-tls      True    grafana-tls      5m
```

For debugging, check the Certificate and CertificateRequest resources:

```bash
$ kubectl describe certificate bookmarked-tls
Events:
  Type    Reason     Age   Message
  ----    ------     ----  -------
  Normal  Issuing    5m    Issuing certificate
  Normal  Generated  5m    Generated new private key
  Normal  Requested  5m    Created CertificateRequest "bookmarked-tls-xxxxx"
  Normal  Issued     4m    Certificate issued successfully
```

## Handling Webhook Restarts

I hit an issue where the webhook kept restarting:

```bash
$ kubectl get pods -n cert-manager
cert-manager-webhook-7bfbfdc97c-2wtcn   0/1   CrashLoopBackOff   18
```

The fix was to ensure the webhook had enough time to start before health checks kicked in:

```yaml
# In webhook deployment
readinessProbe:
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  initialDelaySeconds: 30
  periodSeconds: 10
```

## All TLS Endpoints

After setup, all my services have valid TLS:

| Subdomain | Certificate |
|-----------|-------------|
| argocd.el-jefe.me | ✅ Valid |
| grafana.el-jefe.me | ✅ Valid |
| prometheus.el-jefe.me | ✅ Valid |
| bookmarked-k8s.el-jefe.me | ✅ Valid |
| code-talk-k8s.el-jefe.me | ✅ Valid |
| educationelly-k8s.el-jefe.me | ✅ Valid |
| educationelly-graphql-k8s.el-jefe.me | ✅ Valid |
| firebook-k8s.el-jefe.me | ✅ Valid |
| intervalai-k8s.el-jefe.me | ✅ Valid |

Certificates auto-renew 30 days before expiry. No more calendar reminders.

## Rate Limits

Let's Encrypt has rate limits to be aware of:

- **50 certificates per domain per week**
- **5 duplicate certificates per week**
- **Failed validation limit: 5 per hour**

During initial setup, I used the staging server to avoid hitting limits:

```yaml
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory  # staging
```

Once everything worked, I switched to production.

## Wildcard Certificates (Future)

For wildcard certificates (`*.el-jefe.me`), I'll need DNS-01 challenges instead of HTTP-01. That requires a DNS provider integration (Cloudflare in my case). Something for a future iteration.

---

*Part of my K8s Cluster Journal - documenting the evolution of my homelab infrastructure.*
