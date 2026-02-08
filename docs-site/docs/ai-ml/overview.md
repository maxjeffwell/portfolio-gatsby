---
sidebar_position: 1
title: Overview
---

# AI / ML Infrastructure

The platform includes a self-hosted AI inference stack that provides embedding generation, text generation, and LLM observability across all portfolio applications.

## Architecture

```mermaid
graph TB
    subgraph Portfolio Apps
        BK[Bookmarked]
        ED[educationELLy]
        CT[Code Talk]
        POP[DevOps Portfolio]
    end

    subgraph AI Gateway Layer
        GW[Shared AI Gateway<br/>Node.js, port 8002]
        REDIS[Redis Cache]
    end

    subgraph Inference Backends
        HF[HuggingFace API<br/>Mistral 7B]
        VPS[VPS CPU Triton<br/>Llama 3.2 3B]
        RP[RunPod GPU<br/>Llama 3.1 8B]
        ANT[Anthropic Claude]
        GRQ[Groq API<br/>Llama 3.3 70B]
    end

    subgraph Embedding & Search
        TRI[Triton Inference Server<br/>GPU: GTX 1080]
        PG[(PostgreSQL + pgvector)]
    end

    subgraph Observability
        LF[Langfuse<br/>LLM tracing]
        LIT[LiteLLM Proxy]
    end

    BK & ED & CT & POP --> GW
    GW --> REDIS
    GW -->|Tier 1| HF
    GW -->|Tier 2| VPS
    GW -->|Tier 3| RP
    GW -->|Premium| ANT
    GW -->|Free tier| GRQ
    GW -->|Embeddings| TRI
    TRI --> PG
    GW --> LIT
    LIT --> LF
    LIT --> ANT
    LIT --> GRQ
```

## Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| [**Shared AI Gateway**](./shared-ai-gateway) | Unified API for all AI features | Node.js/Express with multi-tier fallback |
| [**Triton Semantic Search**](./triton-semantic-search) | GPU-accelerated embeddings and code search | NVIDIA Triton + ONNX + pgvector |
| [**Langfuse**](./langfuse) | LLM observability and tracing | Langfuse + ClickHouse + LiteLLM |

## Design Principles

- **Cost optimization** — Free/cheap backends first (HuggingFace, Groq), expensive only when needed (Anthropic, RunPod)
- **Reliability** — Multi-tier fallback ensures AI features never go down
- **Observability** — Every LLM call is traced through Langfuse via LiteLLM
- **Self-hosted where possible** — Triton on local GPU, llama.cpp on VPS, reduces external dependencies
- **Shared infrastructure** — One gateway serves all portfolio apps instead of duplicating AI logic per app
