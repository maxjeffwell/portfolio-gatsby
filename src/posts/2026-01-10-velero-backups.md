---
title: "Cluster Backups with Velero and CloudCasa"
date: "2026-01-10"
tags: ["kubernetes", "velero", "backups", "disaster-recovery", "cloudcasa"]
excerpt: "Implementing a robust backup strategy with Velero for cluster state and CloudCasa for managed backup orchestration."
---

Running production workloads without backups is asking for trouble. Today I set up Velero for Kubernetes-native backups with CloudCasa for managed orchestration.

## Why Velero?

Velero (formerly Heptio Ark) is the standard for Kubernetes backups:

- **Cluster state backups** - All resources, not just data
- **Volume snapshots** - PersistentVolume data
- **Scheduled backups** - Cron-based automation
- **Disaster recovery** - Restore to same or different cluster
- **Migration** - Move workloads between clusters

## Installing Velero

First, install the Velero CLI:

```bash
wget https://github.com/vmware-tanzu/velero/releases/download/v1.13.0/velero-v1.13.0-linux-amd64.tar.gz
tar -xvf velero-v1.13.0-linux-amd64.tar.gz
sudo mv velero-v1.13.0-linux-amd64/velero /usr/local/bin/
```

I'm using Backblaze B2 as my backup destination (S3-compatible, cheap):

```bash
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.9.0 \
  --bucket k8s-backups \
  --secret-file ./credentials-velero \
  --backup-location-config \
    region=us-west-004,s3ForcePathStyle=true,s3Url=https://s3.us-west-004.backblazeb2.com \
  --use-node-agent \
  --default-volumes-to-fs-backup
```

The credentials file:

```ini
[default]
aws_access_key_id=<backblaze-key-id>
aws_secret_access_key=<backblaze-app-key>
```

## Backup Configuration

I created scheduled backups for each critical namespace:

```yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-default-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  template:
    includedNamespaces:
      - default
    includeClusterResources: true
    storageLocation: default
    volumeSnapshotLocations:
      - default
    ttl: 720h  # Keep for 30 days
```

Similar schedules for other namespaces:

```bash
# monitoring namespace - weekly (Prometheus data is reproducible)
# argocd namespace - daily (GitOps state)
# microservices namespace - daily (Kafka, Redis, MongoDB)
```

## CloudCasa Integration

While Velero handles the heavy lifting, CloudCasa provides a management layer:

- **Dashboard** - Visual backup status across clusters
- **Alerting** - Notifications on backup failures
- **Policy management** - Centralized backup policies
- **Cross-cluster visibility** - If I add more clusters later

Install the CloudCasa agent:

```bash
kubectl apply -f https://cloudcasa.io/download/kubeagent.yaml
```

Register with CloudCasa dashboard and configure policies through their UI.

## Testing Restores

Backups are worthless if you can't restore. I tested by:

1. **Creating a test namespace** with a deployment and PVC
2. **Backing it up** with Velero
3. **Deleting everything** in the namespace
4. **Restoring from backup**

```bash
# Create backup
velero backup create test-backup --include-namespaces test-ns

# Simulate disaster
kubectl delete namespace test-ns

# Restore
velero restore create --from-backup test-backup
```

The restore brought back:

- ✅ Namespace
- ✅ Deployments
- ✅ Services
- ✅ ConfigMaps and Secrets
- ✅ PersistentVolumeClaims
- ✅ PersistentVolume data (via file system backup)

## Kopia for File-Level Backups

Velero uses Kopia under the hood for file-system backups. I see Kopia maintenance jobs running:

```bash
$ kubectl get pods -n velero | grep kopia
argocd-default-kopia-maintain-job-xxx     Completed
default-default-kopia-maintain-job-xxx    Completed
monitoring-default-kopia-maintain-job-xxx Completed
```

These handle deduplication and garbage collection of backup data.

## Database Considerations

For databases (MongoDB, PostgreSQL, Redis), I have two approaches:

1. **Velero PVC snapshots** - Captures the entire volume
2. **Application-level backups** - mongodump, pg_dump scheduled separately

Velero PVC snapshots might capture inconsistent state if the DB is writing during backup. For critical data, I run application-level dumps to a separate PVC, then Velero backs that up.

## Current Backup Schedule

| Namespace | Frequency | Retention |
|-----------|-----------|-----------|
| default | Daily 2 AM | 30 days |
| argocd | Daily 2 AM | 30 days |
| monitoring | Weekly Sunday | 90 days |
| microservices | Daily 2 AM | 30 days |
| vertex-platform | Daily 3 AM | 30 days |

Total storage used in Backblaze: ~15 GB (with deduplication)

## Monitoring Backup Health

I added Prometheus alerts for backup failures:

```yaml
groups:
  - name: velero
    rules:
      - alert: VeleroBackupFailed
        expr: velero_backup_failure_total > 0
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Velero backup failed"
```

CloudCasa also sends email alerts if backups miss their schedule.

## Lessons Learned

1. **Test restores regularly** - A backup you haven't tested isn't a backup
2. **Consider application consistency** - Volume snapshots might catch databases mid-write
3. **Monitor backup storage** - Costs can grow if retention is too long
4. **Document restore procedures** - When disaster strikes, you won't remember the commands

---

*Documenting the evolution of my homelab kubernetes infrastructure.*
