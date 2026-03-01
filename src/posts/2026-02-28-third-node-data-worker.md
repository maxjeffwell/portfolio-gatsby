---
title: "Adding a Third Node to Relieve Control Plane Pressure"
date: "2026-02-28"
tags: ["kubernetes", "k3s", "wireguard", "infrastructure", "helm", "operations"]
excerpt: "The control plane was buckling under workload pressure. Leader election timeouts, probe failures, and pod restart loops. Adding a dedicated data node and migrating stateful workloads fixed the cascading failures."
---

The cluster had been showing symptoms for weeks. Redis replicas restarting 43 times. GPU operator crash looping with 55 restarts. NFD master hitting 79 restarts. The root cause was always the same: `vmi2951245` was running the API server, etcd, controller manager, and most of the cluster's stateful workloads on 12 shared CPUs. CPU contention made everything slow. Liveness probes timed out, leader election leases expired, and pods entered CrashLoopBackOff.

Today I added a third node to the cluster, a dedicated VPS for data workloads.

## The Problem

On a two node cluster, the control plane node (`vmi2951245`) hosted everything that wasn't GPU bound. That included:

- Kafka broker, entity operator, and Strimzi operator
- Redis master and replica
- ClickHouse (for Langfuse)
- GPU operator controller and NFD master
- All portfolio application pods
- Prometheus, Grafana, Loki, Alloy, Mimir
- ArgoCD, cert-manager, Traefik

The GPU node (`marmoset`) was tainted `workload=gpu:NoSchedule`, so it only ran GPU workloads. Everything else piled onto the control plane.

The cascading failure pattern:

1. API server CPU starved by co-located workloads
2. Leader election HTTP PUTs to `10.43.0.1:443` exceed 5s timeout
3. Operator controllers lose their lease and restart
4. Kubelet probe checks time out (default 1s) against slow pods
5. Pods marked unhealthy, restarted, adding more CPU pressure
6. Cycle repeats

## The New Node

| Property | Value |
|----------|-------|
| Hostname | vmi3115606 |
| Role | Data worker |
| CPUs | 4 cores |
| RAM | 8 GB |
| WireGuard IP | 10.0.0.3 |
| Node label | `role=data` |

## Joining via WireGuard

The cluster uses WireGuard as its network overlay (`flannel-iface: wg0`). All three nodes peer over WireGuard, so inter-node traffic is encrypted regardless of the underlying network.

K3s agent config on the new node:

```yaml
# /etc/rancher/k3s/config.yaml
flannel-iface: wg0
kubelet-arg:
  - "node-status-update-frequency=20s"
```

After joining:

```bash
$ sudo kubectl get nodes
NAME         STATUS   ROLES                  AGE   VERSION
marmoset     Ready    <none>                 50d   v1.34.3+k3s1
vmi2951245   Ready    control-plane,master   86d   v1.34.3+k3s1
vmi3115606   Ready    <none>                 1m    v1.34.3+k3s1
```

Then label the node so workloads can target it:

```bash
kubectl label node vmi3115606 role=data
```

## Migrating Workloads

The strategy: use `nodeAffinity` with `requiredDuringSchedulingIgnoredDuringExecution` to pin stateful infrastructure to the data node. This is stronger than `nodeSelector` for Helm charts that template their own affinity blocks.

### Strimzi Kafka

The Kafka broker, entity operator, and Strimzi operator controller all moved to vmi3115606. The KafkaNodePool CR uses `template.pod.affinity`:

```yaml
spec:
  template:
    pod:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: role
                    operator: In
                    values:
                      - data
```

The Strimzi operator itself moved via a Helm values file with `nodeSelector: {role: data}`.

### Redis

Redis was the most visibly broken service, with 43 restarts on the replica due to liveness probe timeouts. The Bitnami chart's `ping_liveness_local_and_master.sh` script has an internal 5 second timeout for the `PING` command, but the kubelet only gave it 6 seconds total. Under CPU pressure, the script regularly exceeded that window.

The fix was a new values file with relaxed probe timeouts:

```yaml
replica:
  livenessProbe:
    enabled: true
    initialDelaySeconds: 30
    periodSeconds: 15
    timeoutSeconds: 10
    failureThreshold: 5
  readinessProbe:
    enabled: true
    initialDelaySeconds: 20
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 5
```

After the Helm upgrade, the Redis master organically scheduled onto vmi3115606.

### GPU Operator and NFD

The GPU operator controller and NFD master are cluster-wide components that don't need a GPU. But they do make frequent leader election calls to the API server. Moving them to the data node via Helm values reduced one source of load on the control plane:

```yaml
operator:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: role
                operator: In
                values:
                  - data
```

NFD worker probes also got relaxed timeouts. The defaults (1s timeout, 3 failure threshold) were causing 383+ restarts on the control plane node.

### ClickHouse (Langfuse)

ClickHouse for Langfuse moved with a simple `nodeSelector`:

```yaml
clickhouse:
  nodeSelector:
    role: data
```

## Fixing the ServiceLB

K3s ships with ServiceLB (formerly Klipper), which creates `svclb-*` DaemonSet pods on every eligible node to handle LoadBalancer type services. After adding vmi3115606, a new svclb pod appeared there for Traefik.

The problem: Traefik uses `externalTrafficPolicy: Local`, which means kube-proxy only forwards to Traefik pods on the *same node*. Since Traefik only runs on vmi2951245, any traffic hitting vmi3115606's svclb pod was silently dropped. The health check NodePort returned 503.

The fix is a node label that switches ServiceLB into allow list mode:

```bash
kubectl label node vmi2951245 svccontroller.k3s.cattle.io/enablelb=true
```

Now only vmi2951245 runs svclb pods. The DaemonSet automatically picked up the selector:

```bash
$ kubectl get ds -n kube-system | grep svclb
svclb-traefik-a3f8a5a8   1   1   1   1   1   svccontroller.k3s.cattle.io/enablelb=true
```

I also found an `auth-service` in the microservices namespace that was incorrectly typed as LoadBalancer (created via `kubectl expose` at some point). Changed it to ClusterIP since it's only consumed internally.

## GeoIP for Alloy

One unexpected issue: the Alloy (Prometheus telemetry collector) pod was stuck in ContainerCreating on vmi3115606 because its config expects a GeoIP database at `/usr/share/GeoIP/GeoLite2-City.mmdb` via a hostPath volume. The directory didn't exist on the new node.

Fixed by installing `geoipupdate` on vmi3115606 with the MaxMind credentials and setting up a weekly cron job. The Alloy pod came up 2/2 after the database was downloaded.

## Three Node Topology

After all migrations:

| Node | Role | Workloads |
|------|------|-----------|
| vmi2951245 | Control plane | API server, etcd, Traefik, ArgoCD, cert-manager, Prometheus, Grafana |
| marmoset | GPU worker | Ollama, Triton, DCGM exporter, GPU device plugin |
| vmi3115606 | Data worker | Kafka, Redis, ClickHouse, Strimzi operator, NFD master, GPU operator controller |

The control plane still runs monitoring and GitOps infrastructure, but the heavy stateful workloads that were causing CPU contention are now isolated on the data node.

## Results

Before and after restart counts for the worst offenders:

| Pod | Restarts (before) | Restarts (after) |
|-----|-------------------|-----------------|
| redis-replicas-0 | 43 | 0 |
| gpu-operator controller | 55 | Investigating* |
| nfd-master | 79 | 7 (stable) |
| nfd-worker | 383 | 0 |

*The GPU operator controller is still crash looping due to leader election lease timeouts. Moving it to the data node didn't fix the root cause because the API server is still on vmi2951245 and the HTTP round trip still times out. The next step is increasing `--leader-elect-lease-duration` and `--leader-elect-renew-deadline` beyond the chart defaults.

## Lessons Learned

1. **Control plane nodes shouldn't run stateful workloads.** It seems obvious in retrospect, but on a resource constrained cluster it's tempting to use every CPU. The cascading failure pattern (API server slow, leases expire, probes fail, restarts, more CPU pressure) is vicious once it starts.

2. **Probe defaults are tuned for well resourced clusters.** A 1 second liveness timeout with 3 retries means a pod gets killed after 3 seconds of slowness. On a CPU contended node, that's a normal Tuesday. Increase timeouts before they become a problem.

3. **ServiceLB `externalTrafficPolicy: Local` needs attention on multi-node clusters.** Without the `enablelb` node label, svclb pods run everywhere and silently black hole traffic on nodes without the target pod. The health check returns 503, but there's no external load balancer to act on it.

4. **WireGuard makes multi-site clusters simple.** Adding a node on a different VPS provider was just a matter of adding a WireGuard peer and running the K3s agent installer. Flannel handles pod networking over the encrypted tunnel transparently.

---

*Documenting the evolution of my homelab infrastructure.*
