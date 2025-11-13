# Quick Setup Guide

This guide will help you set up CI/CD with GitHub Actions and Docker Hub for the portfolio-gatsby project.

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account with repository access
- [ ] Docker Hub account ([Sign up free](https://hub.docker.com/signup))
- [ ] Git installed locally
- [ ] Docker installed locally (optional, for testing)

## Setup Steps

### 1. Fork/Clone Repository

```bash
# Clone the repository
git clone https://github.com/maxjeffwell/portfolio-gatsby.git
cd portfolio-gatsby

# Or if you forked it
git clone https://github.com/YOUR_USERNAME/portfolio-gatsby.git
cd portfolio-gatsby
```

### 2. Create Docker Hub Repository

1. Go to [Docker Hub](https://hub.docker.com/)
2. Click **Repositories** → **Create Repository**
3. Name: `portfolio-gatsby`
4. Visibility: **Public** (or Private if you prefer)
5. Click **Create**

Your Docker Hub repository URL will be:
```
https://hub.docker.com/r/YOUR_USERNAME/portfolio-gatsby
```

### 3. Generate Docker Hub Access Token

1. Go to [Docker Hub Security Settings](https://hub.docker.com/settings/security)
2. Click **New Access Token**
3. Fill in:
   - **Description**: `github-actions-portfolio-gatsby`
   - **Access permissions**: **Read, Write, Delete**
4. Click **Generate**
5. **Copy the token** - you won't see it again!

### 4. Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add the following secrets**:

#### Secret 1: DOCKERHUB_USERNAME
- **Name**: `DOCKERHUB_USERNAME`
- **Value**: Your Docker Hub username (e.g., `maxjeffwell`)
- Click **Add secret**

#### Secret 2: DOCKERHUB_TOKEN
- **Name**: `DOCKERHUB_TOKEN`
- **Value**: The access token you copied in step 3
- Click **Add secret**

### 5. Update Workflow Files (If Using Different Username)

If your Docker Hub username is different from `maxjeffwell`, update the Docker image name:

**Edit `.github/workflows/docker-build-push.yml`**:

```yaml
env:
  DOCKER_IMAGE: YOUR_USERNAME/portfolio-gatsby  # Change this line
```

### 6. Test Locally (Optional but Recommended)

Before pushing to GitHub, test the build locally:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the site
npm run build

# Build Docker image
docker build -t portfolio-gatsby:test .

# Run the container
docker run -d -p 8080:80 --name portfolio-test portfolio-gatsby:test

# Test it works
curl http://localhost:8080

# Or open in browser: http://localhost:8080

# Clean up
docker stop portfolio-test
docker rm portfolio-test
```

### 7. Push to GitHub and Trigger Workflows

```bash
# Stage changes
git add .

# Commit (if you made changes)
git commit -m "Configure CI/CD with GitHub Actions and Docker Hub"

# Push to trigger workflows
git push origin master
```

### 8. Verify Workflows

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see two workflows running:
   - **CI** - Tests and builds Gatsby site
   - **Docker Build & Push** - Builds and publishes Docker image

4. Wait for workflows to complete (green checkmark ✅)

### 9. Verify Docker Hub

1. Go to [Docker Hub](https://hub.docker.com/)
2. Click **Repositories**
3. Find `portfolio-gatsby`
4. You should see:
   - **Tags**: `latest`, `master`
   - **Architectures**: `linux/amd64`, `linux/arm64`
   - **Last updated**: Recent timestamp

### 10. Pull and Run Your Image

```bash
# Pull the image
docker pull YOUR_USERNAME/portfolio-gatsby:latest

# Run it
docker run -d -p 8080:80 YOUR_USERNAME/portfolio-gatsby:latest

# Access at http://localhost:8080
```

## Verification Checklist

After setup, verify everything works:

- [ ] GitHub Actions tab shows two workflows
- [ ] CI workflow completes successfully (green checkmark)
- [ ] Docker Build & Push workflow completes successfully
- [ ] Docker Hub shows your repository with images
- [ ] `latest` and `master` tags exist
- [ ] Both `linux/amd64` and `linux/arm64` architectures present
- [ ] README badges show passing status
- [ ] Netlify deployment still works (not affected by CI/CD)

## Troubleshooting

### Workflows Don't Appear

**Problem**: No workflows in Actions tab

**Solutions**:
1. Check that `.github/workflows/` directory exists
2. Verify workflow files are committed and pushed
3. Ensure branch name matches (master vs main)

### Docker Login Failed

**Problem**: `Error: Cannot perform an interactive login from a non TTY device`

**Solutions**:
1. Verify `DOCKERHUB_USERNAME` secret is correct
2. Verify `DOCKERHUB_TOKEN` secret is correct
3. Check Docker Hub token hasn't expired
4. Ensure token has Read, Write, Delete permissions

### Build Fails with "out of memory"

**Problem**: Gatsby build fails with memory errors

**Solutions**:
1. Already configured with 8GB in workflow
2. Check GitHub Actions runner has enough memory
3. Reduce `GATSBY_PARALLEL_BUILD_COUNT` from 2 to 1

### Docker Push Failed

**Problem**: Image builds but doesn't push to Docker Hub

**Solutions**:
1. Check if repository exists on Docker Hub
2. Verify token permissions
3. Check Docker Hub rate limits
4. Ensure you're not on a pull request (PRs don't push)

### Wrong Docker Image Name

**Problem**: Image pushes to wrong repository

**Solutions**:
1. Update `DOCKER_IMAGE` in `.github/workflows/docker-build-push.yml`
2. Ensure it matches your Docker Hub username
3. Format: `username/repository-name`

## Advanced Configuration

### Change Branch Name

If your repository uses `main` instead of `master`:

**Update both workflow files**:

`.github/workflows/ci.yml`:
```yaml
on:
  push:
    branches: [main]  # Change master to main
  pull_request:
    branches: [main]  # Change master to main
```

`.github/workflows/docker-build-push.yml`:
```yaml
on:
  push:
    branches: [main]  # Change master to main
  pull_request:
    branches: [main]  # Change master to main
```

### Disable Multi-Platform Builds

If you only need `linux/amd64` (faster builds):

**Edit `.github/workflows/docker-build-push.yml`**:
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64  # Remove linux/arm64
```

### Add Additional Tags

To tag images with git commit SHA:

**Edit `.github/workflows/docker-build-push.yml`**:
```yaml
- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    tags: |
      type=ref,event=branch
      type=sha  # Add this line
```

## What Happens After Setup

### On Every Push to Master/Main

1. **Netlify** automatically deploys to production
2. **CI workflow** runs:
   - Installs dependencies
   - Builds Gatsby site
   - Tests Docker build
   - Uploads artifacts
3. **Docker Build & Push** runs:
   - Builds multi-platform images
   - Pushes to Docker Hub
   - Scans for vulnerabilities
   - Updates tags

### On Pull Requests

1. **CI workflow** runs:
   - Tests build works
   - Verifies Docker build
   - Does NOT deploy anywhere
2. **Docker Build & Push** runs:
   - Builds images
   - Does NOT push to Docker Hub
   - Only validates build process

### On Git Tags (v*)

1. Creates additional version tags on Docker Hub:
   - `v1.2.3` (full version)
   - `1.2` (major.minor)
   - `1` (major only)

## Using Your Docker Image

### Development

```bash
docker run -d -p 8080:80 YOUR_USERNAME/portfolio-gatsby:latest
```

### Production (with docker-compose)

```yaml
version: '3.8'
services:
  portfolio:
    image: YOUR_USERNAME/portfolio-gatsby:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: portfolio
        image: YOUR_USERNAME/portfolio-gatsby:latest
        ports:
        - containerPort: 80
```

## Monitoring

### Check Workflow Status

**In GitHub**:
1. Go to **Actions** tab
2. View recent runs
3. Click on run to see logs

**With Badge**:
- CI: ![CI Badge](https://img.shields.io/github/actions/workflow/status/maxjeffwell/portfolio-gatsby/ci.yml?branch=master&label=CI)
- Docker: ![Docker Badge](https://img.shields.io/github/actions/workflow/status/maxjeffwell/portfolio-gatsby/docker-build-push.yml?branch=master&label=Docker)

### Check Docker Hub

1. Go to [Docker Hub](https://hub.docker.com/)
2. View your repository
3. Check:
   - Last updated time
   - Pull count
   - Tag list
   - Architectures

### Check Security Scan Results

1. Go to GitHub repository **Security** tab
2. Click **Code scanning alerts**
3. Filter by **Trivy**
4. Review vulnerabilities

## Next Steps

After setup is complete:

1. **Customize workflows** - Edit `.github/workflows/*.yml` as needed
2. **Monitor builds** - Watch Actions tab for failures
3. **Update dependencies** - Keep packages up to date
4. **Review security** - Check Trivy scan results regularly
5. **Optimize performance** - Review build times and optimize if needed

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [CI/CD Documentation](CICD.md) - Detailed CI/CD information
- [Docker Documentation](DOCKER.md) - Docker usage guide

## Getting Help

If you encounter issues:

1. **Check workflow logs** - Actions tab → Click run → View logs
2. **Review documentation**:
   - [SETUP.md](SETUP.md) - This file
   - [CICD.md](CICD.md) - Detailed CI/CD docs
   - [DOCKER.md](DOCKER.md) - Docker usage
   - [README.md](README.md) - Main documentation
3. **Common issues** - See Troubleshooting section above
4. **Search errors** - Google the error message from workflow logs

## Summary

You now have:

✅ **Automated testing** - Every push tests build
✅ **Docker images** - Multi-platform images on Docker Hub
✅ **Security scanning** - Trivy scans for vulnerabilities
✅ **Build status badges** - Visual status in README
✅ **Deployment flexibility** - Deploy anywhere with Docker
✅ **Netlify compatibility** - Doesn't interfere with existing deployment

**Total setup time**: ~10-15 minutes

**Maintenance**: None required (automatic)

---

**Setup Complete!** 🎉

Your portfolio now has professional CI/CD with GitHub Actions and Docker Hub.
