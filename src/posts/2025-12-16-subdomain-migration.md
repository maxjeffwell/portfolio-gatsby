---
title: "Migrating from Path-Based to Subdomain Routing"
date: "2025-12-16"
tags: ["kubernetes", "traefik", "ingress", "networking", "architecture"]
excerpt: "A major architectural change - moving all portfolio applications from path-based routing to dedicated subdomains with proper API routing."
---

Today was a big refactoring day. I migrated all 6 portfolio applications from path-based routing (`el-jefe.me/bookmarked`) to subdomain routing (`bookmarked-k8s.el-jefe.me`). Here's why and how.

## The Problem with Path-Based Routing

My initial ingress configuration used path prefixes:

```yaml
rules:
  - host: pop-portfolio.el-jefe.me
    http:
      paths:
        - path: /bookmarked
          backend:
            service:
              name: bookmarked-client
        - path: /firebook
          backend:
            service:
              name: firebook-client
        # ... more apps
```

This caused several issues:

1. **Client-side routing conflicts** - React Router expected to own `/`, not `/bookmarked`
2. **API path confusion** - Frontend calling `/api` vs `/bookmarked/api`
3. **Asset loading** - Relative paths broke when served from subpaths
4. **stripPrefix middleware complexity** - Lots of middleware to strip prefixes

## The Solution: One Subdomain Per App

Each application now gets its own subdomain:

| App | Old Path | New Subdomain |
|-----|----------|---------------|
| Bookmarked | /bookmarked | bookmarked-k8s.el-jefe.me |
| Code Talk | /code-talk | code-talk-k8s.el-jefe.me |
| EducationELLy | /educationelly | educationelly-k8s.el-jefe.me |
| EducationELLy GraphQL | /educationelly-graphql | educationelly-graphql-k8s.el-jefe.me |
| FireBook | /firebook | firebook-k8s.el-jefe.me |
| IntervalAI | /intervalai | intervalai-k8s.el-jefe.me |

## Ingress Configuration

Each app now has a dedicated ingress resource. Here's the pattern:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bookmarked-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.tls: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - bookmarked-k8s.el-jefe.me
      secretName: bookmarked-tls
  rules:
    - host: bookmarked-k8s.el-jefe.me
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: bookmarked-client
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: bookmarked-server
                port:
                  number: 3000
```

## The API Routing Challenge

The trickiest part was handling API routes. Each full-stack app has:

- **Client** - React frontend serving static files
- **Server** - Node.js/Express API backend

With path-based routing, I needed stripPrefix middleware. With subdomains, routing is cleaner:

```
bookmarked-k8s.el-jefe.me/          → bookmarked-client:80
bookmarked-k8s.el-jefe.me/api/*     → bookmarked-server:3000
```

For some apps, I needed to split into separate ingress resources to get path priority right:

```yaml
# API ingress (higher priority)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: educationelly-api-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.priority: "100"
spec:
  rules:
    - host: educationelly-k8s.el-jefe.me
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: educationelly-server
                port:
                  number: 5000
---
# Client ingress (lower priority, catch-all)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: educationelly-client-ingress
spec:
  rules:
    - host: educationelly-k8s.el-jefe.me
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: educationelly-client
                port:
                  number: 80
```

## CORS Configuration

Moving to subdomains meant updating CORS on every backend:

```javascript
// Before (permissive, bad)
app.use(cors());

// After (explicit allowed origins)
app.use(cors({
  origin: [
    'https://educationelly-k8s.el-jefe.me',
    'http://localhost:3000'  // development
  ],
  credentials: true
}));
```

I added `ALLOWED_ORIGINS` environment variables to each deployment:

```yaml
env:
  - name: ALLOWED_ORIGINS
    value: "https://educationelly-k8s.el-jefe.me"
```

## Dashboard Updates

The portfolio dashboard needed updates to reflect the new URLs:

```javascript
const APP_URLS = {
  bookmarked: 'https://bookmarked-k8s.el-jefe.me',
  codetalk: 'https://code-talk-k8s.el-jefe.me',
  educationelly: 'https://educationelly-k8s.el-jefe.me',
  educationellyGraphql: 'https://educationelly-graphql-k8s.el-jefe.me',
  firebook: 'https://firebook-k8s.el-jefe.me',
  intervalai: 'https://intervalai-k8s.el-jefe.me',
};
```

## DNS Configuration

In Cloudflare, I added wildcard CNAME records:

```
*-k8s.el-jefe.me → vmi2951245.contaboserver.net
```

This means any new `*-k8s.el-jefe.me` subdomain automatically resolves to my cluster.

## Results

After the migration:

- ✅ React Router works correctly (owns `/`)
- ✅ API calls are straightforward (`/api/*`)
- ✅ Assets load without path issues
- ✅ Each app is isolated and independently deployable
- ✅ Cleaner ingress configuration
- ✅ Easier debugging (one app per domain)

## Lessons Learned

1. **Plan subdomain structure early** - Retrofitting is painful
2. **Split API and client ingresses** - Gives more control over routing priority
3. **Don't forget CORS** - Subdomains are different origins
4. **Wildcard DNS is your friend** - Makes adding new apps trivial

---

*Documenting the evolution of my homelab infrastructure.*
