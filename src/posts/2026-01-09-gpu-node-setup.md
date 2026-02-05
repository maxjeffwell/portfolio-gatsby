---
title: "Adding a GPU Node for AI Workloads"
date: "2026-01-09"
tags: ["kubernetes", "gpu", "nvidia", "ollama", "triton", "ai"]
excerpt: "Expanding the cluster with a dedicated GPU node running 4x NVIDIA GPUs for self-hosted AI inference with Ollama and Triton."
---

Today the cluster got serious AI capabilities. I added a second node - `marmoset` - with 4 NVIDIA GPUs for running local LLM inference.

## The Hardware

The new node specs:

| Component | Specification |
|-----------|---------------|
| Node name | marmoset |
| CPUs | 8 cores |
| RAM | 16 GB |
| GPUs | 4x NVIDIA (GTX 1080 equivalent) |
| Storage | 400 GB |

## Joining the Cluster

First, I got the join token from the control plane:

```bash
# On vmi2951245 (control plane)
sudo cat /var/lib/rancher/k3s/server/node-token
```

Then on marmoset:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://vmi2951245:6443 \
  K3S_TOKEN=<token> sh -
```

Verify the node joined:

```bash
$ sudo kubectl get nodes
NAME         STATUS   ROLES                  AGE   VERSION
marmoset     Ready    <none>                 1m    v1.34.3+k3s1
vmi2951245   Ready    control-plane,master   36d   v1.34.3+k3s1
```

## NVIDIA GPU Operator

The GPU Operator handles all NVIDIA components automatically:

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

helm install gpu-operator nvidia/gpu-operator \
  --namespace gpu-operator \
  --create-namespace \
  --set driver.enabled=false  # Using pre-installed drivers
```

The operator deploys:

- **NVIDIA device plugin** - Exposes GPUs to Kubernetes
- **DCGM exporter** - GPU metrics for Prometheus
- **Container toolkit** - NVIDIA container runtime
- **GPU feature discovery** - Labels nodes with GPU capabilities

Check GPU availability:

```bash
$ kubectl describe node marmoset | grep nvidia
  nvidia.com/gpu:     4
  nvidia.com/gpu:     4
```

## Deploying Ollama

Ollama makes running LLMs easy. I created a deployment targeting the GPU node:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-gpu
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ollama-gpu
  template:
    metadata:
      labels:
        app: ollama-gpu
    spec:
      nodeSelector:
        kubernetes.io/hostname: marmoset  # Target GPU node
      containers:
        - name: ollama
          image: ollama/ollama:latest
          ports:
            - containerPort: 11434
          resources:
            limits:
              nvidia.com/gpu: 1  # Request 1 GPU
          volumeMounts:
            - name: ollama-data
              mountPath: /root/.ollama
      volumes:
        - name: ollama-data
          persistentVolumeClaim:
            claimName: ollama-models-pvc
```

Pull a model:

```bash
kubectl exec -it ollama-gpu-xxxxx -- ollama pull llama3.2:3b
```

## Triton Inference Server

For production inference, I deployed NVIDIA Triton:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: triton-gpu
spec:
  replicas: 1
  template:
    spec:
      nodeSelector:
        kubernetes.io/hostname: marmoset
      containers:
        - name: triton
          image: nvcr.io/nvidia/tritonserver:24.01-py3
          args:
            - tritonserver
            - --model-repository=/models
            - --http-port=8000
            - --grpc-port=8001
            - --metrics-port=8002
          ports:
            - containerPort: 8000
            - containerPort: 8001
            - containerPort: 8002
          resources:
            limits:
              nvidia.com/gpu: 1
          volumeMounts:
            - name: model-repo
              mountPath: /models
```

Triton serves models via HTTP/gRPC and exposes Prometheus metrics.

## GPU Metrics in Prometheus

The DCGM exporter provides rich GPU metrics:

```promql
# GPU utilization
DCGM_FI_DEV_GPU_UTIL{gpu="0"}

# GPU memory used
DCGM_FI_DEV_FB_USED{gpu="0"}

# GPU temperature
DCGM_FI_DEV_GPU_TEMP{gpu="0"}
```

I added these to my Grafana dashboard to monitor GPU health during inference.

## LiteLLM Proxy

To provide a unified API across models, I deployed LiteLLM:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: litellm
spec:
  template:
    spec:
      containers:
        - name: litellm
          image: ghcr.io/berriai/litellm:main-latest
          env:
            - name: OLLAMA_API_BASE
              value: "http://ollama-gpu:11434"
          ports:
            - containerPort: 4000
```

Now my applications can call LiteLLM's OpenAI-compatible API, and it routes to Ollama or other backends.

## Time-Slicing for Multiple Workloads

With 4 GPUs but multiple workloads, I configured time-slicing:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: gpu-device-plugin-config
  namespace: gpu-operator
data:
  config: |
    version: v1
    sharing:
      timeSlicing:
        resources:
          - name: nvidia.com/gpu
            replicas: 2  # Each physical GPU appears as 2 virtual GPUs
```

This lets Ollama and Triton share GPUs, though with reduced performance per workload.

## Current AI Stack

| Component | Purpose | GPU |
|-----------|---------|-----|
| Ollama | LLM inference (Llama 3.2) | 1 |
| Triton GPU | Production model serving | 1 |
| Triton CPU | Embedding models | 0 |
| LiteLLM | API proxy/router | 0 |

## Performance Notes

With Llama 3.2 3B on a GTX 1080:

- **Tokens/second**: ~30-40 for generation
- **Time to first token**: ~500ms
- **Memory usage**: ~4GB VRAM

Not blazing fast, but acceptable for my portfolio apps and definitely beats paying for API calls.

---

*Documenting the evolution of my homelab kubernetes infrastructure.*
