# CI/CD Documentation

This document explains the continuous integration and deployment workflows for the portfolio-gatsby project.

## Overview

The project uses **GitHub Actions** for automated CI/CD with two main workflows:

1. **CI Workflow** - Tests, builds, and validates the Gatsby site
2. **Docker Build & Push** - Builds multi-platform Docker images and publishes to Docker Hub

Both workflows run on every push and pull request to `master`/`main` branches.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Purpose**: Ensure code quality, successful builds, and Docker image functionality.

**Triggers**:
- Push to `master` or `main` branch
- Pull requests to `master` or `main` branch

**Jobs**:

#### Job 1: Test
- **Environment**: ubuntu-latest with Node.js 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js with npm caching
  3. Install dependencies with `npm install --legacy-peer-deps`
  4. Build Gatsby site with production settings:
     - `NODE_ENV=production`
     - `GATSBY_CPU_COUNT=4`
     - `NODE_OPTIONS=--max-old-space-size=8192`
     - `GATSBY_PARALLEL_BUILD_COUNT=2`
     - `GATSBY_TELEMETRY_DISABLED=1`
     - `CI=true`
  5. Verify build output (check for `public/` directory and `index.html`)
  6. Upload build artifacts (retained for 7 days)

#### Job 2: Docker Build Test
- **Environment**: ubuntu-latest
- **Dependencies**: Requires `test` job to pass first
- **Steps**:
  1. Checkout code
  2. Setup Docker Buildx
  3. Build Docker image (no push)
  4. Run container on port 8080
  5. Test HTTP response with curl
  6. View logs and clean up

**Duration**: ~5-8 minutes

### 2. Docker Build & Push Workflow (`.github/workflows/docker-build-push.yml`)

**Purpose**: Build multi-platform Docker images and publish to Docker Hub.

**Triggers**:
- Push to `master` or `main` branch
- Tags matching `v*` (semantic versioning)
- Pull requests to `master` or `main` branch

**Environment Variables**:
- `DOCKER_IMAGE`: `maxjeffwell/portfolio-gatsby`

**Steps**:
1. **Checkout code** - Clone repository
2. **Set up QEMU** - Enable multi-platform builds
3. **Set up Docker Buildx** - Advanced Docker build features
4. **Log in to Docker Hub** - Authenticate (only for non-PR events)
5. **Extract metadata** - Generate tags and labels:
   - Branch name (e.g., `master`)
   - PR number (e.g., `pr-123`)
   - Semantic version tags (e.g., `v1.2.3`, `1.2`, `1`)
   - `latest` tag for default branch
6. **Build and push** - Multi-platform build:
   - Platforms: `linux/amd64`, `linux/arm64`
   - Target: `production` stage
   - Push: Only on non-PR events
   - Uses GitHub Actions cache for layers
7. **Trivy security scan** - Vulnerability scanning:
   - Scans the `latest` image
   - Outputs SARIF format
   - Continues on error (non-blocking)
8. **Upload to GitHub Security** - Security tab integration
9. **Output image digest** - Show published image digest

**Duration**: ~8-12 minutes (multi-platform builds are slower)

**Image Tags**:
- `maxjeffwell/portfolio-gatsby:latest` - Latest from default branch
- `maxjeffwell/portfolio-gatsby:master` - Latest from master branch
- `maxjeffwell/portfolio-gatsby:v1.2.3` - Specific version tag
- `maxjeffwell/portfolio-gatsby:1.2` - Major.minor version
- `maxjeffwell/portfolio-gatsby:1` - Major version
- `maxjeffwell/portfolio-gatsby:pr-123` - Pull request builds

## Configuration

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `DOCKERHUB_USERNAME` | Docker Hub username | Your Docker Hub account username |
| `DOCKERHUB_TOKEN` | Docker Hub access token | Create at [Docker Hub Security](https://hub.docker.com/settings/security) |

**To add secrets**:
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add `DOCKERHUB_USERNAME` with your Docker Hub username
4. Add `DOCKERHUB_TOKEN` with your Docker Hub access token

### Docker Hub Access Token

1. Go to [Docker Hub Security Settings](https://hub.docker.com/settings/security)
2. Click **New Access Token**
3. Name: `github-actions-portfolio-gatsby`
4. Access permissions: **Read, Write, Delete**
5. Copy the token and save it as `DOCKERHUB_TOKEN` secret in GitHub

## Build Settings

### Gatsby Build Configuration

The CI workflow uses Netlify-matching build settings:

```bash
NODE_ENV=production
GATSBY_CPU_COUNT=4
NODE_OPTIONS=--max-old-space-size=8192
GATSBY_PARALLEL_BUILD_COUNT=2
GATSBY_TELEMETRY_DISABLED=1
CI=true
```

These match the settings in:
- `netlify.toml`
- `Dockerfile`

### Docker Build Configuration

**Multi-stage Dockerfile**:
- **Stage 1: Build** - Node.js 20 Alpine, Gatsby build with 8GB memory
- **Stage 2: Production** - nginx Alpine, serves static files

**Platforms**:
- `linux/amd64` - Intel/AMD 64-bit (most servers, cloud VMs)
- `linux/arm64` - ARM 64-bit (Apple Silicon, AWS Graviton, Raspberry Pi)

**Optimizations**:
- GitHub Actions cache for Docker layers
- Node.js npm cache
- Build artifact caching
- Layer deduplication

## Monitoring & Status

### Build Status Badges

The README includes badges that show workflow status:

```markdown
[![CI](https://img.shields.io/github/actions/workflow/status/maxjeffwell/portfolio-gatsby/ci.yml?branch=master&label=CI&style=flat-square&logo=github)](https://github.com/maxjeffwell/portfolio-gatsby/actions/workflows/ci.yml)
[![Docker Build](https://img.shields.io/github/actions/workflow/status/maxjeffwell/portfolio-gatsby/docker-build-push.yml?branch=master&label=Docker%20Build&style=flat-square&logo=docker)](https://github.com/maxjeffwell/portfolio-gatsby/actions/workflows/docker-build-push.yml)
```

### Viewing Workflow Runs

1. Go to **Actions** tab in GitHub repository
2. Select workflow name (CI or Docker Build & Push)
3. View recent runs, logs, and artifacts

### Troubleshooting Failed Builds

#### CI Workflow Failures

**Build fails with "out of memory"**:
- Increase `NODE_OPTIONS=--max-old-space-size=8192` to higher value
- Reduce `GATSBY_PARALLEL_BUILD_COUNT` from 2 to 1
- Check for memory leaks in Gatsby plugins

**Build fails with "npm install" errors**:
- Ensure `--legacy-peer-deps` flag is used
- Check if `package.json` and `package-lock.json` are in sync
- Verify Node.js version is 20.x

**Docker test fails**:
- Check that nginx is serving files correctly
- Verify `public/` directory exists in Docker image
- Test locally with `docker-compose up`

#### Docker Build & Push Failures

**Authentication failed**:
- Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are set correctly
- Check that Docker Hub token has not expired
- Ensure token has Read, Write, Delete permissions

**Multi-platform build fails**:
- QEMU setup might have failed (check logs)
- Buildx might not be configured properly
- Try building single platform first to isolate issue

**Push to Docker Hub fails**:
- Check Docker Hub repository exists
- Verify token permissions
- Check Docker Hub rate limits (100 pulls/6 hours for free accounts)

**Trivy scan fails**:
- This is non-blocking (continues on error)
- Check if Trivy action version is up to date
- Review vulnerability report in workflow logs

## Security

### Vulnerability Scanning

**Trivy** scans Docker images for:
- OS package vulnerabilities (Alpine Linux)
- Node.js vulnerabilities
- npm package vulnerabilities
- Configuration issues

**Results**:
- Uploaded to GitHub Security tab
- Available as SARIF file in workflow artifacts
- Non-blocking (build continues even with vulnerabilities)

**To view results**:
1. Go to repository **Security** tab
2. Click **Code scanning alerts**
3. Filter by **Trivy**

### Secret Management

- Never commit secrets to git
- Use GitHub Secrets for sensitive data
- Rotate Docker Hub tokens regularly
- Use minimal permissions for tokens

## Integration with Other Deployments

### Netlify Deployment

- **CI/CD workflows do NOT interfere with Netlify**
- Netlify has its own build pipeline triggered by git pushes
- Docker workflows run in parallel with Netlify builds
- Both serve the same static site from `public/` directory

### Coexistence

| Deployment | Trigger | Build Command | Output |
|------------|---------|---------------|--------|
| **Netlify** | git push to master | `npm run build:netlify` | Netlify CDN |
| **GitHub Actions CI** | git push to master | `npm run build` | Artifacts |
| **GitHub Actions Docker** | git push to master | `docker build` | Docker Hub |

All three run independently and do not conflict.

## Artifacts

### CI Workflow Artifacts

**Gatsby Build** (`gatsby-build`):
- Contains entire `public/` directory
- Retention: 7 days
- Use case: Download static site for manual deployment

**To download**:
1. Go to workflow run
2. Scroll to **Artifacts** section
3. Click **gatsby-build** to download

### Docker Images

**Docker Hub Repository**: [`maxjeffwell/portfolio-gatsby`](https://hub.docker.com/r/maxjeffwell/portfolio-gatsby)

**Pull image**:
```bash
docker pull maxjeffwell/portfolio-gatsby:latest
```

**Run image**:
```bash
docker run -d -p 8080:80 maxjeffwell/portfolio-gatsby:latest
```

## Performance

### Workflow Performance

**CI Workflow** (~5-8 minutes):
- Checkout: ~5 seconds
- Setup Node.js: ~10 seconds
- Install dependencies: ~2-3 minutes
- Build Gatsby: ~3-5 minutes
- Docker test: ~30 seconds

**Docker Build & Push** (~8-12 minutes):
- Checkout: ~5 seconds
- Setup QEMU/Buildx: ~10 seconds
- Login: ~2 seconds
- Build amd64: ~4-6 minutes
- Build arm64: ~4-6 minutes (parallel)
- Push: ~30 seconds
- Trivy scan: ~30 seconds

### Optimization Tips

1. **Enable caching**:
   - npm cache: ✅ Enabled
   - Docker layer cache: ✅ Enabled
   - Gatsby cache: ⚠️ Not persistent across builds

2. **Reduce build time**:
   - Lower `GATSBY_PARALLEL_BUILD_COUNT` if builds fail
   - Build single platform for testing (remove `linux/arm64`)
   - Use `actions/cache` for Gatsby `.cache` directory

3. **Parallel execution**:
   - Both workflows run in parallel
   - Docker builds both platforms in parallel

## Manual Triggers

### Manually Trigger Workflow

You can manually trigger workflows from GitHub:

1. Go to **Actions** tab
2. Select workflow (CI or Docker Build & Push)
3. Click **Run workflow** button
4. Select branch
5. Click **Run workflow**

### Re-run Failed Jobs

1. Go to failed workflow run
2. Click **Re-run jobs** dropdown
3. Choose:
   - **Re-run failed jobs** - Only re-run failed jobs
   - **Re-run all jobs** - Re-run entire workflow

## Best Practices

### Before Pushing Code

1. Test locally:
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```

2. Test Docker build:
   ```bash
   docker-compose build
   docker-compose up -d
   curl http://localhost:8080
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin master
   ```

### Monitoring Builds

- Watch Actions tab after pushing
- Check for red X (failure) or green check (success)
- Review logs if build fails
- Test locally to reproduce issues

### Release Process

1. Make changes and test locally
2. Commit and push to master
3. Wait for CI and Docker workflows to pass
4. Tag release:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```
5. Docker workflow will build with version tags
6. Netlify deploys automatically

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)
- [Docker Hub](https://hub.docker.com/)
- [Netlify Documentation](https://docs.netlify.com/)

## Support

For issues with:
- **Workflows**: Check this documentation and GitHub Actions logs
- **Docker**: See [DOCKER.md](DOCKER.md)
- **Gatsby**: See main [README.md](README.md)
- **Netlify**: Check Netlify dashboard and build logs

---

**Last Updated**: 2025-11-13
