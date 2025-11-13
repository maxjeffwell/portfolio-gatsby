# Docker Deployment Guide for Portfolio

This guide explains how to deploy the Gatsby portfolio using Docker, alongside the existing Netlify deployment.

## Overview

The portfolio can be deployed in two ways:
1. **Netlify** (existing deployment) - Serverless edge deployment with global CDN
2. **Docker** (new option) - Self-hosted containerized deployment

Both deployments serve the same static Gatsby site with identical configuration.

## Architecture

### Docker Setup
- **Static Site Container**: Built Gatsby site served with nginx
- **Configuration**: nginx configured to match Netlify headers and caching
- **Build Environment**: Matches Netlify build settings (Node 20, memory limits, etc.)

### Why Docker?
- Self-hosting capability alongside Netlify
- Local development environment matching production
- Cloud deployment flexibility (AWS, GCP, Azure, etc.)
- Backup deployment option
- Corporate/enterprise deployment behind firewalls

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 8GB+ RAM (Gatsby builds are memory-intensive)

## Quick Start

### 1. Build and Run

```bash
cd /home/maxjeffwell/GitHub_Projects/portfolio-gatsby

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### 2. Access the Application

Open your browser to: **http://localhost:8080**

## Configuration

### Environment Variables

Create a `.env.docker` file (optional, has defaults):

```env
NODE_ENV=production
PORT=8080
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Application port | `8080` |

### Build Environment

The Dockerfile matches Netlify build configuration:
- **Node Version**: 20
- **Memory**: 8192MB
- **CPU Count**: 4 cores
- **Parallel Build Count**: 2
- **Gatsby Telemetry**: Disabled
- **CI Mode**: Enabled

These settings are hardcoded in the Dockerfile to match `netlify.toml`.

## Building Images

### Build Production Image

```bash
docker build -t portfolio-gatsby:latest .
```

### Build Development Image

```bash
docker build --target development -t portfolio-gatsby:dev .
```

### Multi-stage Builds

The Dockerfile includes separate stages:
- **build**: Compiles Gatsby site with optimizations
- **production**: Serves with nginx
- **development**: Gatsby development server with hot-reload

## Running Containers

### Using Docker Compose (Recommended)

```bash
# Start service
docker-compose up -d

# View logs
docker-compose logs -f portfolio

# Rebuild and restart
docker-compose up -d --build

# Stop service
docker-compose down
```

### Using Docker CLI

```bash
# Build image
docker build -t portfolio-gatsby:latest .

# Run container
docker run -d \
  --name portfolio \
  -p 8080:80 \
  portfolio-gatsby:latest

# View logs
docker logs -f portfolio

# Stop container
docker stop portfolio
docker rm portfolio
```

## Deployment Scenarios

### Local Development

Use Docker for local testing:

```bash
docker-compose up -d
```

Access at: http://localhost:8080

### Production Self-Hosting

1. Build the production image:
```bash
docker-compose build
```

2. Deploy to your server:
```bash
docker-compose up -d
```

3. Configure reverse proxy (nginx, Caddy, Traefik) for HTTPS

### Cloud Deployment

**Push to Docker Hub:**
```bash
docker tag portfolio-gatsby:latest username/portfolio-gatsby:latest
docker push username/portfolio-gatsby:latest
```

**Deploy to container platforms:**
- AWS Elastic Container Service (ECS)
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Linode Kubernetes Engine (LKE)

## nginx Configuration

The included `nginx.conf` replicates Netlify behavior:

### Caching Strategy (matching Netlify)
- **Static assets** (/static/*, JS, CSS, fonts, images): 1 year cache (immutable)
- **HTML files**: No cache (must-revalidate)
- **Page data** (/page-data/*, app-data.json): No cache (Gatsby specific)

### Security Headers (matching Netlify)
- `Strict-Transport-Security`: HSTS with preload
- `X-Content-Type-Options`: nosniff
- `X-Frame-Options`: SAMEORIGIN
- `X-XSS-Protection`: 1; mode=block
- `Referrer-Policy`: no-referrer-when-downgrade
- `Permissions-Policy`: Limited permissions (camera, microphone, geolocation, payment disabled)

### Gatsby Specifics
- Trailing slash handling (Gatsby convention)
- 404.html fallback
- Page data and app data caching
- Static asset optimization

## Integration with Netlify

### Coexistence

Docker and Netlify deployments coexist perfectly:

1. **Build Process**: Both use `npm run build` (same command)
2. **Static Output**: Both serve files from `public/` directory
3. **Headers**: Docker nginx config matches Netlify headers
4. **Caching**: Identical caching strategies
5. **No Conflicts**: Different hosting, same static files

### Comparison

| Feature | Netlify | Docker Self-Hosting |
|---------|---------|---------------------|
| **Setup** | Git push | `docker-compose up` |
| **SSL** | Automatic | Manual (reverse proxy) |
| **CDN** | Global (100+ locations) | Single location |
| **Edge Functions** | Yes | No (static only) |
| **Build Time** | ~4-6 minutes | ~4-6 minutes |
| **Scaling** | Automatic | Manual |
| **Cost** | Free tier + bandwidth | Infrastructure cost |
| **Control** | Limited | Full control |
| **Downtime** | Netlify SLA | Your responsibility |

## Monitoring and Maintenance

### View Logs

```bash
# Container logs
docker logs -f portfolio

# nginx access logs
docker exec portfolio tail -f /var/log/nginx/access.log

# nginx error logs
docker exec portfolio tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Check container health
docker ps

# Inspect health status
docker inspect --format='{{.State.Health.Status}}' portfolio

# Manual health check
curl -f http://localhost:8080 || echo "Health check failed"
```

### Resource Usage

```bash
# Monitor resources
docker stats portfolio

# View container details
docker inspect portfolio
```

## Troubleshooting

### Build Failures

**Issue: Out of memory during build**
```bash
# Increase Docker memory limit
# Docker Desktop: Settings → Resources → Memory → 8GB+

# Or build with lower parallelization
docker build --build-arg GATSBY_PARALLEL_BUILD_COUNT=1 -t portfolio-gatsby:latest .
```

**Issue: npm install fails**
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**Issue: Gatsby build fails**
```bash
# Check build locally first
npm install --legacy-peer-deps
npm run build

# If builds locally, check Docker logs
docker-compose build
```

### Runtime Issues

**Issue: Port already in use**
```bash
# Change port in .env.docker or docker-compose.yml
PORT=8081

# Or stop conflicting service
sudo lsof -ti:8080 | xargs kill -9
```

**Issue: 404 errors**
- Check that `public/` directory exists in container
- Verify nginx config is correct
- Check Gatsby build completed successfully

**Issue: Assets not loading**
- Clear browser cache
- Check nginx logs for 404s
- Verify file paths match Gatsby output

### Gatsby-Specific Issues

**Issue: Page data not found**
- Gatsby requires `/page-data/` directory
- Check that build completed successfully
- Verify nginx serves `/page-data/*` correctly

**Issue: Trailing slash issues**
- Gatsby uses trailing slashes by convention
- nginx.conf is configured to handle this
- Check `try_files` directive in nginx.conf

## Performance Optimization

### nginx Optimizations

The configuration includes:
- Gzip compression for all text assets
- Long-term caching for static assets (1 year)
- TCP optimizations (tcp_nopush, tcp_nodelay)
- Connection pooling
- Worker process auto-scaling

### Gatsby Optimizations

Build-time optimizations (already configured):
- CPU count: 4
- Parallel builds: 2
- Memory: 8GB
- Production build with minification

### Multi-platform Builds

Build for multiple architectures:

```bash
# Setup buildx
docker buildx create --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t portfolio-gatsby:latest \
  --push .
```

## Security

### Container Security

✅ **Implemented:**
- Non-root user (nodejs:1001)
- Read-only root filesystem possible
- Security headers configured
- Minimal base image (Alpine)
- No sensitive data in image

### SSL/TLS for Self-Hosting

For production deployment, use a reverse proxy with SSL:

**nginx reverse proxy:**
```nginx
server {
    listen 443 ssl http2;
    server_name el-jefe.me www.el-jefe.me;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Redirect www to non-www
    if ($host = www.el-jefe.me) {
        return 301 https://el-jefe.me$request_uri;
    }

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Caddy (automatic HTTPS):**
```
el-jefe.me {
    reverse_proxy localhost:8080
}

www.el-jefe.me {
    redir https://el-jefe.me{uri} permanent
}
```

## Comparison: Docker vs Netlify

| Aspect | Netlify | Docker |
|--------|---------|--------|
| **Deployment** | git push | docker-compose up |
| **Build Location** | Netlify servers | Local or CI/CD |
| **Hosting** | Netlify CDN | Self-hosted |
| **SSL** | Automatic Let's Encrypt | Manual (reverse proxy) |
| **CDN** | Built-in (global) | Optional (Cloudflare, etc.) |
| **Forms** | Netlify Forms | Not available |
| **Functions** | Netlify Functions | Not available |
| **Analytics** | Netlify Analytics | Manual (Google Analytics, etc.) |
| **Plugins** | Netlify Plugins | Not available |
| **Cost** | Free tier generous | Infrastructure only |
| **Control** | Limited | Full control |

## Coexistence Strategy

Use both deployments for different purposes:

1. **Primary (Netlify)**: Production deployment with CDN
   - Main domain: https://el-jefe.me
   - Automatic builds from git
   - Global edge network
   - Netlify features (forms, analytics)

2. **Backup (Docker)**: Self-hosted alternative
   - Alternative domain or internal use
   - Manual deployment
   - Full control
   - Custom infrastructure

3. **Development (Docker)**: Local testing
   - Test before deploying to Netlify
   - Match production environment
   - No internet required

## Testing Before Netlify Deployment

Use Docker to test changes locally:

```bash
# Make changes to your code
nano src/pages/index.js

# Test with Docker
docker-compose up -d --build

# Access at http://localhost:8080

# If satisfied, push to git (triggers Netlify)
git add .
git commit -m "Update homepage"
git push origin master
```

## CI/CD Integration

Docker builds can be added to CI/CD:

### GitHub Actions Example

```yaml
name: Docker Build

on:
  push:
    branches: [master, main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t portfolio-gatsby:latest .
      - name: Test image
        run: |
          docker run -d -p 8080:80 portfolio-gatsby:latest
          sleep 10
          curl -f http://localhost:8080 || exit 1
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [Netlify Documentation](https://docs.netlify.com/)

## Support

For issues with:
- **Docker setup**: Check this guide and Docker logs
- **Gatsby**: See main [README.md](README.md) and Gatsby docs
- **Netlify**: Check Netlify dashboard and build logs

---

**Note**: Docker files are NOT gitignored. They coexist with Netlify configuration. Both deployments can run simultaneously without conflicts.

## Quick Reference

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Health check
curl http://localhost:8080
```

---

**Portfolio** - Built with Gatsby, Deployed everywhere
