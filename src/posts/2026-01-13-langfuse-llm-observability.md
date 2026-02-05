---
title: "LLM Observability with Langfuse"
date: "2026-01-13"
tags: ["kubernetes", "langfuse", "llm", "observability", "ai", "monitoring"]
excerpt: "Self-hosting Langfuse for LLM observability - tracking prompts, completions, costs, and latency across all AI-powered features."
---

With AI features in multiple portfolio apps, I needed visibility into LLM usage. Today I deployed Langfuse - an open-source LLM observability platform.

## Why Langfuse?

Running local LLMs and calling external APIs (OpenAI, Anthropic) without observability is flying blind:

- **What prompts are being sent?**
- **What's the latency distribution?**
- **How much is each feature costing?**
- **Are there errors or rate limits?**
- **What's the token usage per user?**

Langfuse answers all of these with tracing, analytics, and prompt management.

## Architecture

Langfuse consists of:

- **Web UI** - Dashboard for traces and analytics
- **API** - Ingestion endpoint for trace data
- **ClickHouse** - Analytics database for fast aggregations
- **PostgreSQL** - Metadata and user management
- **S3-compatible storage** - For large payloads (MinIO in my case)

## Deployment

I created a dedicated namespace and deployed via Helm values:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: langfuse
---
# Using External Secrets for sensitive config
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: langfuse-secrets
  namespace: langfuse
spec:
  secretStoreRef:
    name: doppler-secret-store
    kind: ClusterSecretStore
  target:
    name: langfuse-secrets
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: LANGFUSE_DATABASE_URL
    - secretKey: NEXTAUTH_SECRET
      remoteRef:
        key: LANGFUSE_NEXTAUTH_SECRET
    - secretKey: SALT
      remoteRef:
        key: LANGFUSE_SALT
    - secretKey: ENCRYPTION_KEY
      remoteRef:
        key: LANGFUSE_ENCRYPTION_KEY
```

The main deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langfuse-web
  namespace: langfuse
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: langfuse
          image: langfuse/langfuse:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: langfuse-secrets
                  key: DATABASE_URL
            - name: NEXTAUTH_URL
              value: "https://langfuse.el-jefe.me"
            - name: CLICKHOUSE_URL
              value: "http://langfuse-clickhouse:8123"
```

## ClickHouse for Analytics

ClickHouse handles the analytics workload:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: langfuse-clickhouse
  namespace: langfuse
spec:
  serviceName: langfuse-clickhouse
  replicas: 1
  template:
    spec:
      containers:
        - name: clickhouse
          image: clickhouse/clickhouse-server:24.1
          ports:
            - containerPort: 8123
            - containerPort: 9000
          volumeMounts:
            - name: clickhouse-data
              mountPath: /var/lib/clickhouse
  volumeClaimTemplates:
    - metadata:
        name: clickhouse-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
```

## Instrumenting Applications

I added Langfuse tracing to my AI-powered apps. For the Python backend:

```python
from langfuse import Langfuse

langfuse = Langfuse(
    public_key=os.environ["LANGFUSE_PUBLIC_KEY"],
    secret_key=os.environ["LANGFUSE_SECRET_KEY"],
    host="https://langfuse.el-jefe.me"
)

@langfuse.trace()
def generate_response(user_message: str) -> str:
    # Create a generation span
    generation = langfuse.generation(
        name="llama-3.2-response",
        model="llama3.2:3b",
        input=user_message,
    )

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[{"role": "user", "content": user_message}]
    )

    generation.end(
        output=response["message"]["content"],
        usage={
            "input_tokens": response["prompt_eval_count"],
            "output_tokens": response["eval_count"],
        }
    )

    return response["message"]["content"]
```

For JavaScript/Node.js:

```javascript
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: 'https://langfuse.el-jefe.me',
});

async function chat(message) {
  const trace = langfuse.trace({ name: 'chat-request' });

  const generation = trace.generation({
    name: 'openai-completion',
    model: 'gpt-4o-mini',
    input: message,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
  });

  generation.end({
    output: response.choices[0].message.content,
    usage: {
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
    },
  });

  await langfuse.flush();
  return response;
}
```

## What I Can See Now

The Langfuse dashboard shows:

### Traces
Every LLM interaction with full context:
- Input prompt
- Output completion
- Latency breakdown
- Token counts
- Model used
- User ID (for per-user analytics)

### Metrics
- **P50/P95/P99 latency** by model
- **Token usage** over time
- **Cost tracking** (for paid APIs)
- **Error rates** and types

### Prompt Management
I can version prompts in Langfuse and A/B test different versions without code changes.

## Integration with Dashboard

I added a Langfuse link to my portfolio dashboard's monitoring menu:

```javascript
const monitoringLinks = [
  { name: 'Grafana', url: 'https://grafana.el-jefe.me' },
  { name: 'Prometheus', url: 'https://prometheus.el-jefe.me' },
  { name: 'Langfuse', url: 'https://langfuse.el-jefe.me' },  // New!
];
```

## Sample Insights

After a week of data:

| Metric | Value |
|--------|-------|
| Total traces | 1,247 |
| Avg latency (Ollama local) | 2.3s |
| Avg latency (GPT-4o-mini) | 0.8s |
| Total tokens (local) | 892K |
| Total tokens (OpenAI) | 124K |
| Est. OpenAI cost | $0.18 |

The local Ollama inference is slower but free. For user-facing features where speed matters, I fall back to GPT-4o-mini.

## Lessons Learned

1. **Instrument early** - Adding tracing retroactively is tedious
2. **Include user context** - Per-user analytics help identify abuse
3. **Set up cost alerts** - Easy to accidentally burn through API credits
4. **Use async flush** - Don't block requests waiting for Langfuse

---

*Documenting the evolution of my homelab kubernetes infrastructure.*
