---
sidebar_position: 3
title: Alerting
---

# Alerting

AlertManager routes alerts from Prometheus to **Gotify** for push notifications, with inhibition rules to suppress noise and silences for known false-positives.

## Alert Flow

```mermaid
graph LR
    PM[Prometheus<br/>PrometheusRules] -->|firing alerts| AM[AlertManager]
    AM -->|critical + warning| GB[Gotify Bridge]
    GB -->|HTTP webhook| GOT[Gotify Server]
    GOT -->|push| PHONE[Mobile / Desktop]
    AM -->|silenced| NULL[/dev/null]
```

## AlertManager Configuration

### Routing

Alerts are grouped by namespace with escalation-based routing:

```yaml
route:
  group_by: ['namespace']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: 'null'
  routes:
    # Critical and warning alerts → Gotify push notifications
    - matchers:
        - severity = "critical"
      receiver: 'gotify'
    - matchers:
        - severity = "warning"
      receiver: 'gotify'
```

### Silenced Alerts

These alerts are routed to the null receiver to avoid noise:

| Alert | Reason |
|-------|--------|
| `Watchdog` | Always-firing health check, not actionable |
| `KubeDaemonSetMisScheduled` (gpu-operator) | False-positive from GPU operator DaemonSet |
| `KubeDaemonSetRolloutStuck` (gpu-operator) | False-positive from GPU operator DaemonSet |
| `KubeControllerManagerDown` | K3s bundles control plane into the binary |
| `KubeSchedulerDown` | K3s bundles control plane into the binary |
| `KubeProxyDown` | K3s bundles control plane into the binary |

### Inhibition Rules

Higher-severity alerts suppress lower-severity duplicates within the same namespace:

- **Critical** inhibits warning and info
- **Warning** inhibits info
- **InfoInhibitor** suppresses info-level alerts

### Gotify Bridge

The [alertmanager_gotify_bridge](https://github.com/druggeri/alertmanager_gotify_bridge) (v2.3.2) converts AlertManager webhooks to Gotify API calls:

```yaml
gotifyBridge:
  enabled: true
  image:
    repository: ghcr.io/druggeri/alertmanager_gotify_bridge
    tag: "2.3.2"
  gotifyEndpoint: "http://gotify.monitoring.svc.cluster.local"
  defaultPriority: "5"
```

The bridge has its own ServiceMonitor for self-monitoring metrics.

## Alert Rules

### Velero Backup Alerts

Five PrometheusRule alerts monitor backup health:

| Alert | Severity | Condition |
|-------|----------|-----------|
| `VeleroBackupStorageLocationUnavailable` | critical | Storage location unavailable for 5m |
| `VeleroBackupFailed` | critical | Any backup failure in 24h |
| `VeleroNoRecentBackup` | warning | No successful backup in 24h |
| `VeleroBackupPartiallyFailed` | warning | Backup completed with errors in 24h |
| `VeleroRestoreFailed` | critical | Any restore failure in 1h |

Example rule:

```yaml
- alert: VeleroBackupStorageLocationUnavailable
  expr: velero_backup_storage_location_status{status="Unavailable"} == 1
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Velero BackupStorageLocation unavailable"
    description: "BackupStorageLocation {{ $labels.name }} has been unavailable for 5 minutes."
    priority: "8"
```

### kube-prometheus-stack Default Rules

The Helm chart includes built-in PrometheusRules covering:

- **KubernetesSystem** — API server, etcd, kubelet health
- **Node** — CPU, memory, disk, network anomalies
- **Pod** — CrashLoopBackOff, OOMKilled, pending pods
- **Deployment** — Replica mismatch, rollout stuck
- **PersistentVolume** — Capacity warnings

## AlertManager Storage

AlertManager persists its silence and notification state:

```yaml
alertmanagerSpec:
  storage:
    volumeClaimTemplate:
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 2Gi
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 256Mi
```
