---
title: "GitOps with ArgoCD: Declarative Deployments"
date: "2025-12-09"
tags: ["kubernetes", "argocd", "gitops", "traefik", "ingress"]
excerpt: "Setting up ArgoCD for GitOps-style deployments and configuring Traefik ingress with TLS for all applications."
---

Manual `kubectl apply` doesn't scale. Today I set up ArgoCD for GitOps - the cluster state now matches what's in Git, automatically.

## Why GitOps?

The traditional deployment flow:

1. Build image
2. Push to registry
3. SSH to server
4. Run `kubectl apply`
5. Hope nothing breaks

The GitOps flow:

1. Build image
2. Push to registry
3. Update image tag in Git
4. ArgoCD syncs automatically

Git becomes the single source of truth. Every change is auditable. Rollbacks are just `git revert`.

## Installing ArgoCD

```bash
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Get the initial admin password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

## Exposing ArgoCD

I created an Ingress to access the ArgoCD UI:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    traefik.ingress.kubernetes.io/router.tls: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - argocd.el-jefe.me
      secretName: argocd-tls
  rules:
    - host: argocd.el-jefe.me
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server
                port:
                  number: 443
```

## Application Configuration

Each application gets an ArgoCD Application manifest:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: bookmarked
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/maxjeffwell/devops-portfolio-manager
    targetRevision: HEAD
    path: helm-charts/bookmarked
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Key settings:

- **`automated.prune`**: Delete resources removed from Git
- **`automated.selfHeal`**: Revert manual cluster changes
- **`targetRevision: HEAD`**: Always sync to latest commit

## Traefik Ingress Configuration

k3s comes with Traefik as the default ingress controller. I configured it to handle all my application subdomains:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-apps-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.tls: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - bookmarked-k8s.el-jefe.me
        - code-talk-k8s.el-jefe.me
        - educationelly-k8s.el-jefe.me
        - intervalai-k8s.el-jefe.me
        - firebook-k8s.el-jefe.me
      secretName: portfolio-apps-tls
  rules:
    - host: bookmarked-k8s.el-jefe.me
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: bookmarked-client
                port:
                  number: 80
    # ... similar rules for other apps
```

## The Deployment Flow Now

1. **GitHub Actions** builds and pushes Docker image
2. **Workflow** updates image tag in Helm values.yaml
3. **Git push** triggers ArgoCD sync
4. **ArgoCD** applies the changes to the cluster
5. **Traefik** routes traffic to the new pods

The entire flow is visible in ArgoCD's UI:

```
Application: bookmarked
Status: Synced ✓
Health: Healthy ✓
Last Sync: 2 minutes ago
```

## Handling Multiple Apps

With 6 applications, I structured the ArgoCD apps using an App of Apps pattern:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: portfolio-apps
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/maxjeffwell/devops-portfolio-manager
    path: argocd-apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
```

The `argocd-apps/` directory contains Application manifests for each portfolio app. Adding a new app is just creating a new YAML file.

## Debugging Sync Issues

ArgoCD's diff view saved me hours of debugging. When a sync fails:

```bash
argocd app diff bookmarked
```

Shows exactly what's different between Git and the cluster.

Common issues I hit:

1. **Immutable field changes** - Can't change certain fields on existing resources
2. **Missing CRDs** - External Secrets CRDs needed to be installed first
3. **Namespace mismatches** - Helm release namespace vs. ArgoCD destination

## Current Ingress Layout

| Subdomain | Application |
|-----------|-------------|
| argocd.el-jefe.me | ArgoCD UI |
| grafana.el-jefe.me | Grafana dashboards |
| bookmarked-k8s.el-jefe.me | Bookmarked app |
| code-talk-k8s.el-jefe.me | Code Talk app |
| educationelly-k8s.el-jefe.me | EducationELLy app |
| intervalai-k8s.el-jefe.me | IntervalAI app |
| firebook-k8s.el-jefe.me | FireBook app |

All with automatic TLS via cert-manager and Let's Encrypt.

## What's Next

The GitOps foundation is solid. Next I'm planning to:

1. Add Keel for automatic image updates
2. Set up Velero for cluster backups
3. Add a GPU node for AI workloads

---

*Documenting the evolution of my homelab infrastructure.*
