#!/bin/sh
set -e

# Logging function
log() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S')] $1"
}

log "Starting full build pipeline..."
log "Environment: NODE_VERSION=$NODE_VERSION, NODE_ENV=$NODE_ENV"

# 1. Build Gatsby Site
log "Step 1: Building Gatsby site..."
npm run build

# 2. Build Storybook
log "Step 2: Building Storybook..."
if [ -d "public/storybook" ]; then
  log "Cleaning existing storybook directory..."
  rm -rf public/storybook
fi
npm run build-storybook -- -o public/storybook

# 3. Build Documentation Site
log "Step 3: Building Documentation site..."
if [ -d "docs-site" ]; then
  cd docs-site
  log "Installing documentation dependencies..."
  npm install --legacy-peer-deps
  log "Running docusaurus build..."
  npm run build
  cd ..
else
  log "WARNING: docs-site directory not found, skipping..."
fi

# 4. Copy Documentation Site to Public
log "Step 4: Integrating documentation into public directory..."
if [ -d "docs-site/build" ]; then
  mkdir -p public/docs
  log "Copying documentation assets..."
  cp -rv docs-site/build/. public/docs/
else
  log "WARNING: docs-site/build not found, skipping copy..."
fi

log "Build pipeline completed successfully!"
