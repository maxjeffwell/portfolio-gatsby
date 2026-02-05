---
title: "From Metabase to Prometheus: Cluster Monitoring Done Right"
date: "2025-12-03"
tags: ["kubernetes", "prometheus", "grafana", "monitoring", "observability"]
excerpt: "Replacing Metabase with Prometheus for cluster monitoring - lessons learned from OOMKilled pods and building a proper observability stack."
---

I initially tried using Metabase for cluster analytics. It didn't work out. Today I ripped it out and replaced it with a proper Prometheus + Grafana stack.

## The Metabase Experiment

My first attempt at cluster visibility was embedding Metabase dashboards into my portfolio orchestration dashboard. The idea was to have business analytics alongside infrastructure metrics.

```javascript
// What I tried - Metabase React SDK
import { MetabaseProvider, StaticQuestion } from "@metabase/embedding-sdk-react";

<MetabaseProvider config={metabaseConfig}>
  <StaticQuestion questionId={42} />
</MetabaseProvider>
```

Problems quickly emerged:

1. **Authentication complexity** - Metabase's embedding auth didn't play well with my JWT setup
2. **Resource hungry** - Metabase needs a database backend and significant memory
3. **Wrong tool** - I needed infrastructure metrics, not business intelligence

After two days of wrestling with SDK authentication issues, I made the call to switch.

## Enter Prometheus

Prometheus is purpose-built for infrastructure monitoring. The kube-prometheus-stack Helm chart bundles everything:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f prometheus-values.yaml
```

### Initial Values

```yaml
prometheus:
  prometheusSpec:
    retention: 15d
    resources:
      requests:
        cpu: 200m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

grafana:
  enabled: true
  adminPassword: ${GRAFANA_ADMIN_PASSWORD}
  ingress:
    enabled: true
    hosts:
      - grafana.el-jefe.me

alertmanager:
  enabled: true
```

## The OOMKilled Incident

Within hours of deploying, Prometheus crashed:

```bash
$ kubectl get pods -n monitoring
NAME                                    READY   STATUS      RESTARTS
prometheus-prometheus-kube-prometheus-0  0/2    OOMKilled   3
```

Checking the events:

```bash
$ kubectl describe pod prometheus-prometheus-kube-prometheus-0 -n monitoring
...
Last State:     Terminated
  Reason:       OOMKilled
  Exit Code:    137
```

**Root cause**: With 6 applications, multiple databases, and system components, Prometheus was scraping hundreds of metrics. The default 2Gi memory limit wasn't enough.

### The Fix

```yaml
prometheus:
  prometheusSpec:
    resources:
      limits:
        memory: 4Gi  # Doubled from 2Gi
      requests:
        memory: 2Gi

    # Also tuned scrape intervals
    scrapeInterval: 30s  # Default was 15s
    evaluationInterval: 30s
```

After applying the new limits:

```bash
$ kubectl get pods -n monitoring
NAME                                     READY   STATUS    RESTARTS
prometheus-prometheus-kube-prometheus-0   2/2    Running   0
```

## Custom Metrics in the Dashboard

With Prometheus running, I updated my portfolio dashboard to query it directly:

```javascript
// API endpoint for Prometheus queries
app.get('/api/metrics/pods', async (req, res) => {
  const query = 'sum(kube_pod_status_phase{phase="Running"}) by (namespace)';
  const result = await prometheus.query(query);
  res.json(result);
});
```

The dashboard now shows:

- Pod counts by namespace
- CPU/Memory utilization
- Network I/O
- Request latency percentiles

## Grafana Dashboards

Grafana came pre-configured with excellent dashboards:

- **Kubernetes / Compute Resources / Cluster** - Overall cluster health
- **Kubernetes / Compute Resources / Namespace (Pods)** - Per-namespace breakdown
- **Node Exporter Full** - Host-level metrics

I added custom dashboards for my applications using PromQL:

```promql
# Request rate per application
sum(rate(http_requests_total{namespace="default"}[5m])) by (app)

# 95th percentile latency
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, app)
)
```

## Lessons Learned

1. **Right tool for the job** - Metabase is great for business analytics, not infrastructure monitoring
2. **Memory matters** - Always check resource requirements and monitor for OOMKilled
3. **Start with defaults, then tune** - kube-prometheus-stack's defaults are good, but every cluster is different
4. **Scrape interval tradeoffs** - Shorter intervals = more data = more memory

## Current Stack

| Component | Purpose |
|-----------|---------|
| Prometheus | Metrics collection and storage |
| Grafana | Visualization and dashboards |
| Alertmanager | Alert routing and notifications |
| Node Exporter | Host-level metrics |
| kube-state-metrics | Kubernetes object metrics |

The monitoring namespace now gives me full visibility into cluster health. Next up: adding GPU metrics once I add the GPU node.

---

*Part of my K8s Cluster Journal - documenting the evolution of my homelab infrastructure.*
