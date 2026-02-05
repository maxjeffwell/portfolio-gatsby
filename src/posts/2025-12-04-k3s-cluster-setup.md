---
title: "Day 1: Setting Up k3s on My VPS"
date: "2025-12-04"
tags: ["kubernetes", "k3s", "homelab", "devops"]
excerpt: "Initial cluster setup with k3s - bootstrapping a production-grade Kubernetes cluster on a single VPS node."
---

Today marks the beginning of my Kubernetes homelab journey. I've decided to document the setup and evolution of my k3s cluster running on a VPS.

## Why k3s?

After considering various options (minikube, kind, full kubeadm), I chose [k3s](https://k3s.io/) for several reasons:

- **Lightweight**: Single binary under 100MB
- **Production-ready**: CNCF-certified Kubernetes distribution
- **Built-in essentials**: Traefik ingress, CoreDNS, local-path provisioner
- **Easy HA**: Simple to add nodes later

## Initial Setup

The installation was straightforward:

```bash
curl -sfL https://get.k3s.io | sh -
```

After a minute or so, I had a running cluster:

```bash
sudo kubectl get nodes
NAME         STATUS   ROLES                  AGE   VERSION
vmi2951245   Ready    control-plane,master   1m    v1.34.3+k3s1
```

## First Namespaces

I immediately set up the foundational infrastructure:

```yaml
# monitoring namespace for Prometheus/Grafana
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
---
# microservices namespace for shared infrastructure
apiVersion: v1
kind: Namespace
metadata:
  name: microservices
```

## What's Next

Over the coming days, I'll be:

1. Setting up **ArgoCD** for GitOps deployments
2. Configuring **cert-manager** for TLS certificates
3. Adding **Prometheus and Grafana** for observability
4. Deploying my first applications

This is just the beginning. The goal is to build a production-grade platform for running my portfolio projects and experimenting with cloud-native technologies.

---

*This post is part of my K8s Cluster Journal - documenting the evolution of my homelab infrastructure.*
