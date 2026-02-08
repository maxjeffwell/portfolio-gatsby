---
title: "Building a Long-Term Metrics Stack with Mimir (and Debugging a Kafka OOM)"
date: "2026-02-08"
tags: ["kubernetes", "mimir", "prometheus", "kafka", "monitoring", "observability", "helm"]
excerpt: "Extending the monitoring stack with Grafana Mimir for long-term metric storage - and debugging a Kafka message size mismatch that crash-looped the distributor."
---

Prometheus with a 15-day retention is fine for dashboards, but useless for capacity planning. I needed long-term metric storage. Today I'll walk through adding Grafana Mimir to the stack and the OOMKilled crash loop that came with it.

## Why Mimir?

Prometheus stores metrics locally on disk with a fixed retention period. Once that window closes, the data is gone. For a portfolio cluster running six applications, I wanted:

- **Months of metric history** for trend analysis
- **S3-backed storage** so metrics survive node failures
- **Prometheus-compatible queries** without learning a new query language

Grafana Mimir fits all three. It accepts Prometheus remote-write, stores blocks in S3 (MinIO in my case), and speaks PromQL natively.

## The Architecture

The full monitoring stack is deployed as an umbrella Helm chart with five components:

| Component | Purpose |
|-----------|---------|
| kube-prometheus-stack | Prometheus, Grafana, Alertmanager, node-exporter |
| mimir-distributed | Long-term metric storage (distributor, ingester, compactor, store-gateway, querier) |
| Loki | Log aggregation |
| Alloy | Unified telemetry collector |
| MinIO | S3-compatible object storage for Mimir and Loki |

Prometheus scrapes all cluster targets and remote-writes to Mimir via the gateway:

```yaml
prometheus:
  prometheusSpec:
    remoteWrite:
      - url: http://prometheus-mimir-gateway.monitoring.svc.cluster.local/api/v1/push
        name: mimir
        remoteTimeout: 30s
```

Mimir breaks the write path into microservices: the **distributor** receives writes, pushes them to **Kafka** (ingest storage), which the **ingester** consumes and compacts into blocks stored in **MinIO**.

## Mimir Configuration

The key structural config for a single-node deployment:

```yaml
mimir-distributed:
  mimir:
    structuredConfig:
      common:
        storage:
          backend: s3
          s3:
            endpoint: prometheus-minio.monitoring.svc.cluster.local:9000
            access_key_id: ${rootUser}
            secret_access_key: ${rootPassword}
            insecure: true
      blocks_storage:
        s3:
          bucket_name: mimir-blocks
      limits:
        max_global_series_per_user: 500000
        ingestion_rate: 100000
        ingestion_burst_size: 2000000
        compactor_blocks_retention_period: 2160h  # 90 days
```

With replication factor 1 everywhere (single node), each component runs as one replica. The compactor merges blocks and enforces the 90-day retention against MinIO.

## The Crash Loop

Within hours of deploying, the Mimir distributor started crash-looping:

```bash
$ kubectl get pods -n monitoring -l app.kubernetes.io/component=distributor
NAME                                           READY   STATUS             RESTARTS
prometheus-mimir-distributor-d96c97bb4-sdjn6   0/1     CrashLoopBackOff   20
```

The describe output told the story:

```
Last State:     Terminated
  Reason:       OOMKilled
  Exit Code:    137
```

20 OOMKilled restarts in under 3 hours with a 1Gi memory limit.

## Finding the Root Cause

The distributor logs were flooded with two distinct errors.

**Error 1 - Oversized write request items:**

```
level=error msg="detected an error while ingesting Prometheus remote-write request"
  err="the write request contains a timeseries or metadata item which is larger
  that the maximum allowed size of 15983616 bytes"
```

**Error 2 - Kafka connection failures:**

```
level=warn msg="random error while producing, requeueing unattempted request"
  err="broker closed the connection immediately after a request was issued,
  which happens when SASL is required but not provided: is SASL missing?"
```

And in the Kafka pod logs:

```
ERROR Exception while processing request
org.apache.kafka.common.errors.InvalidRequestException:
  Error getting request for apiKey: PRODUCE
Caused by: java.nio.BufferUnderflowException
```

The misleading "is SASL missing?" message is a red herring. The real problem was a **message size mismatch**.

## The Kafka Message Size Mismatch

Here's what mimir-distributed v6.0.5 does by default:

1. Enables **ingest storage** with Kafka as a write-ahead log between distributor and ingester
2. Configures the Mimir Kafka producer to send records up to ~16MB (`max_write_request_data_item_size`)
3. Deploys Kafka with **default settings**, including `message.max.bytes` of **1MB**

So the distributor happily tries to push 5-15MB records to a Kafka broker that only accepts 1MB. Kafka can't parse the oversized messages (`BufferUnderflowException`), the distributor retries and buffers in memory, and eventually OOMs.

A quick check of what Prometheus was scraping confirmed the payload sizes:

```bash
$ # Top scrape targets by sample count
apiserver    97912 samples   10.0.0.1:6443
kubelet      97892 samples   86.48.29.183:10250
kubelet      97892 samples   10.0.0.1:10250
```

Nearly 100k samples from the apiserver alone. When Prometheus batches these into remote-write requests, the per-partition Kafka messages easily exceed 1MB.

## The Three-Part Fix

### 1. Align Kafka Message Size with Mimir

The critical fix: tell Kafka to accept the same message sizes the Mimir producer sends.

```yaml
mimir-distributed:
  kafka:
    extraEnv:
      - name: KAFKA_MESSAGE_MAX_BYTES
        value: "16777216"
      - name: KAFKA_REPLICA_FETCH_MAX_BYTES
        value: "16777216"
```

`REPLICA_FETCH_MAX_BYTES` must match so Kafka can replicate messages internally (even with replication factor 1, the setting is still validated).

### 2. Bump Distributor Memory

Even with correct message sizes, the distributor needs headroom to process large write batches from ~300k total samples per scrape cycle:

```yaml
  distributor:
    resources:
      requests:
        memory: 512Mi   # was 256Mi
      limits:
        memory: 2Gi     # was 1Gi
```

### 3. Drop High-Cardinality Histogram Buckets

The apiserver produces massive histogram metrics that provide minimal value for a portfolio cluster. Dropping them before remote-write reduces payload sizes significantly:

```yaml
prometheus:
  prometheusSpec:
    remoteWrite:
      - url: http://prometheus-mimir-gateway.monitoring.svc.cluster.local/api/v1/push
        writeRelabelConfigs:
          - sourceLabels: [__name__]
            regex: "apiserver_request_duration_seconds_bucket|apiserver_request_body_size_bytes_bucket|apiserver_response_body_size_bytes_bucket|apiserver_watch_events_sizes_bucket"
            action: drop
```

These four `_bucket` metrics were the worst offenders - each has dozens of `le` label values multiplied across every API endpoint and verb.

## After the Fix

```bash
$ kubectl get pods -n monitoring -l app.kubernetes.io/component=distributor
NAME                                           READY   STATUS    RESTARTS
prometheus-mimir-distributor-6bfd964d7-cnqpg   1/1     Running   2 (startup only)
```

Zero errors. The distributor ingests remote-write data, pushes to Kafka without issue, and the ingester consumes it into blocks stored in MinIO.

## Lessons Learned

1. **Chart defaults can conflict with themselves** - mimir-distributed v6.0.5 enables Kafka ingest storage by default but doesn't configure Kafka's message size to match the producer. Always check both sides of a producer-consumer pair.

2. **"Is SASL missing?" usually isn't about SASL** - When Kafka can't parse a message (because it's too large), the connection drops and the client assumes authentication failed. The real error is in the Kafka pod logs, not the producer.

3. **API server metrics are enormous** - The Kubernetes apiserver produces ~98k samples per scrape. Most of that is histogram buckets you'll never query. Use `writeRelabelConfigs` to filter before remote-write.

4. **Ingest storage adds complexity** - Kafka between the distributor and ingester is designed for large multi-tenant deployments. On a single-node cluster it adds a failure mode (message size mismatches) and an extra pod. Worth understanding the tradeoff.

## Current Stack

| Component | Purpose | Retention |
|-----------|---------|-----------|
| Prometheus | Metric collection and short-term queries | 15 days (local) |
| Mimir | Long-term metric storage | 90 days (S3/MinIO) |
| Loki | Log aggregation | Configured per-tenant |
| Grafana | Visualization | N/A |
| Alertmanager + Gotify | Alert routing to mobile | N/A |

Grafana queries both Prometheus (for recent data) and Mimir (for historical) seamlessly. Capacity planning dashboards that need months of data finally work.

---

*Documenting the evolution of my homelab infrastructure.*
