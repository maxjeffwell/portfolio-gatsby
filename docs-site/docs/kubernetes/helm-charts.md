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
│       ├── _pdb.tpl
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

The library chart template reads values from the app's `values.yaml` and generates a complete Deployment manifest with standardized labels, resource requests/limits, health probes, scheduling constraints, and image pull configuration.

## Values Structure

Each app's `values.yaml` follows a consistent structure:

```yaml
replicaCount: 1

client:
  image:
    repository: maxjeffwell/bookmarked-client
    tag: "20250205-143022-a1b2c3d"
  port: 80
  resources:
    requests:
      cpu: 10m
      memory: 64Mi
    limits:
      memory: 128Mi
  livenessProbe:
    httpGet:
      path: /
      port: 80
    initialDelaySeconds: 10
    periodSeconds: 30
    timeoutSeconds: 5
  readinessProbe:
    httpGet:
      path: /
      port: 80
    initialDelaySeconds: 5
    periodSeconds: 10
    timeoutSeconds: 5
  startupProbe:
    httpGet:
      path: /
      port: 80
    failureThreshold: 30
    periodSeconds: 10
    timeoutSeconds: 5

server:
  image:
    repository: maxjeffwell/bookmarked-server
    tag: "20250205-143022-a1b2c3d"
  port: 8080

priorityClassName: ""

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 70

ingress:
  host: bookmarked.el-jefe.me
```

## Health Probes

The library chart supports three probe types on each component, all configurable per-app:

- **Startup probe**: Runs during container initialization. Prevents the liveness probe from killing pods that are still starting up — critical for applications with slow init (e.g., Node.js servers connecting to databases)
- **Readiness probe**: Gates traffic to the pod. A pod that fails its readiness probe is removed from Service endpoints but not restarted
- **Liveness probe**: Restarts the container if it becomes unresponsive. Only activates after the startup probe succeeds

:::tip Why startup probes matter
Without a startup probe, a slow-starting container can be killed by the liveness probe before it finishes initializing, causing a `CrashLoopBackOff`. The startup probe gives the container time to start before liveness checking begins.
:::

## Resource Management

CPU limits are intentionally omitted from most application deployments — only memory limits are set. This avoids [CPU throttling via CFS bandwidth control](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/), which can cause latency spikes even when the node has spare CPU cycles. CPU requests are still set to inform the scheduler for bin-packing across the 3-node cluster.

Init containers also have explicit resource requests/limits to prevent unbounded resource consumption during startup.

## PriorityClasses

Each app can specify a `priorityClassName` in its `values.yaml`. Cluster-wide PriorityClass definitions live in `portfolio-orchestration-platform/k8s/priority-classes.yaml`. This ensures that under resource contention, critical workloads (databases, ingress, monitoring) are scheduled before lower-priority application pods.

## Scheduling Constraints

The `_deployment.tpl` template supports:

- **Soft node affinity**: `preferredDuringSchedulingIgnoredDuringExecution` — the scheduler prefers specific nodes but won't fail if they're unavailable
- **Topology spread constraints**: For multi-replica deployments, pods are spread across nodes with `maxSkew: 1` to ensure even distribution

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
