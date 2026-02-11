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

## Init Containers

The library chart conditionally renders init containers when defined in an app's `values.yaml`:

```yaml
# In portfolio-common/_deployment.tpl
{{- if $.Values.initContainers }}
initContainers:
  {{- toYaml $.Values.initContainers | nindent 8 }}
{{- end }}
```

This is used by apps that depend on external services being available at startup. For example, the AI gateway and GraphQL gateway use an init container to wait for Kafka:

```yaml
# gateway/values.yaml
initContainers:
  - name: wait-for-kafka
    image: busybox:1.37
    command: ['sh', '-c', 'until nc -z kafka-bootstrap.microservices.svc 9092; do sleep 5; done']
```

The init container blocks pod startup until the dependency is reachable, preventing race conditions where the application tries to connect before the dependency is ready.

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
