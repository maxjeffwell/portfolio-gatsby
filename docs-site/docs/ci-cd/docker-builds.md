---
sidebar_position: 2
title: Docker Builds
---

# Docker Build Strategy

All applications use multi-stage Dockerfiles to produce minimal production images.

## Multi-Stage Pattern

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Why Multi-Stage?

- **Smaller images**: The final image contains only the built artifacts and Nginx — no `node_modules`, no source code, no build tools
- **Security**: Fewer packages in the final image means a smaller attack surface
- **Caching**: Docker layer caching makes rebuilds fast when only source code changes

## Client vs Server Images

| Type | Base Image | Contents |
|------|-----------|----------|
| **Client** | `nginx:alpine` | Static build output (HTML/CSS/JS) |
| **Server** | `node:22-alpine` | Node.js runtime + compiled server code |

## Build Flow

```mermaid
graph LR
    SRC[Source Code] --> B1[npm ci]
    B1 --> B2[npm run build]
    B2 --> B3[COPY to nginx:alpine]
    B3 --> IMG[Final Image<br/>~25-40MB]
```
