---
sidebar_position: 2
title: Helm Charts
---

# Helm Charts

All applications use Helm for templating Kubernetes manifests. A shared **library chart** (`portfolio-common`) provides base templates, while each application has a thin wrapper chart.

## Chart Structure

```
devops-portfolio-manager/
├── portfolio-common/          # Library chart (shared templates)
│   ├── Chart.yaml
│   └── templates/
│       ├── _deployment.tpl
│       ├── _service.tpl
│       ├── _ingress.tpl
│       ├── _hpa.tpl
│       └── _servicemonitor.tpl
├── bookmarked/
│   ├── Chart.yaml             # depends on portfolio-common
│   ├── values.yaml            # app-specific config
│   └── templates/
│       ├── deployment.yaml    # one-liner include
│       └── service.yaml       # one-liner include
├── educationelly/
│   └── ...
└── ... (one directory per app)
```

## Library Chart Pattern

Application templates are one-liners that delegate to the library chart:

```yaml
# bookmarked/templates/deployment.yaml
{{- include "portfolio-common.deployment" (dict "component" "client" "context" $) }}
```

The library chart template reads values from the app's `values.yaml` and generates a complete Deployment manifest with standardized labels, resource limits, health checks, and image pull configuration.

## Values Structure

Each app's `values.yaml` follows a consistent structure:

```yaml
replicaCount: 1

client:
  image:
    repository: maxjeffwell/bookmarked-client
    tag: "20250205-143022-a1b2c3d"
  port: 80

server:
  image:
    repository: maxjeffwell/bookmarked-server
    tag: "20250205-143022-a1b2c3d"
  port: 8080

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 70

ingress:
  host: bookmarked.el-jefe.me
```

## Dependency Resolution

Each app chart declares `portfolio-common` as a file dependency:

```yaml
# bookmarked/Chart.yaml
dependencies:
  - name: portfolio-common
    version: "0.1.0"
    repository: "file://../portfolio-common"
```

This means `helm dependency update` resolves the library chart from the local filesystem — no chart registry needed.
