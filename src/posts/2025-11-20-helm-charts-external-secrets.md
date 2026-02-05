---
title: "Helm Charts and External Secrets for Production-Ready Deployments"
date: "2025-11-20"
tags: ["kubernetes", "helm", "external-secrets", "gitops", "security"]
excerpt: "Setting up Helm charts for all portfolio applications and configuring External Secrets Operator for secure secret management."
---

With the cluster running, it's time to make deployments repeatable and secure. Today I set up Helm charts for all my portfolio applications and configured External Secrets Operator for production-grade secret management.

## Why Helm?

Raw Kubernetes manifests work, but they become unwieldy fast. For each application I need:

- Deployment
- Service
- Ingress
- ConfigMap
- Secret
- HorizontalPodAutoscaler

That's 6+ YAML files per app, and I have 6 applications. Helm lets me template these and manage them as packages.

## Chart Structure

I created a standard chart structure for each application:

```
helm-charts/
├── bookmarked/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── _helpers.tpl
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       ├── hpa.yaml
│       └── external-secret.yaml
├── code-talk/
├── educationelly/
├── educationelly-graphql/
├── firebook/
└── intervalai/
```

The `_helpers.tpl` file contains reusable template definitions:

```yaml
{{- define "bookmarked.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "bookmarked.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

## External Secrets Operator

Hardcoding secrets in values.yaml is a non-starter. I installed [External Secrets Operator](https://external-secrets.io/) to sync secrets from external providers.

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets \
  -n external-secrets --create-namespace
```

### SecretStore Configuration

I set up SecretStores for different backends. For my Doppler secrets:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: doppler-secret-store
  namespace: default
spec:
  provider:
    doppler:
      auth:
        secretRef:
          dopplerToken:
            name: doppler-token-auth
            key: dopplerToken
```

### ExternalSecret Resources

Each application gets an ExternalSecret that syncs credentials:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: bookmarked-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: doppler-secret-store
    kind: SecretStore
  target:
    name: bookmarked-secrets
    creationPolicy: Owner
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: BOOKMARKED_DATABASE_URL
    - secretKey: JWT_SECRET
      remoteRef:
        key: BOOKMARKED_JWT_SECRET
```

## Lessons Learned

### Template Reference Debugging

I hit several issues with Helm template references. The error messages aren't always helpful:

```
Error: template: bookmarked/templates/deployment.yaml:15:24:
executing "bookmarked/templates/deployment.yaml" at <include "bookmarked.fullname" .>:
error calling include: template: no template "bookmarked.fullname" associated with template
```

The fix: ensure `_helpers.tpl` is properly formatted and the define blocks have matching names.

### Values Structure

I standardized the values.yaml structure across all charts:

```yaml
replicaCount: 1

image:
  repository: maxjeffwell/bookmarked-client
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  host: bookmarked-k8s.el-jefe.me

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

externalSecrets:
  enabled: true
  secretStoreName: doppler-secret-store
```

## What's Next

With Helm charts in place, I can now:

1. Deploy any app with a single `helm install` command
2. Upgrade applications by bumping image tags
3. Roll back failed deployments
4. Manage configuration across environments

Tomorrow I'll set up GitHub Actions workflows to automate the build → push → deploy pipeline.

---

*Part of my K8s Cluster Journal - documenting the evolution of my homelab infrastructure.*
