#!/bin/bash
set -e

echo "Starting full build pipeline..."

# 1. Build Gatsby Site
echo "Step 1: Building Gatsby site..."
npm run build

# 2. Build Storybook
echo "Step 2: Building Storybook..."
# Use npm run to ensure local storybook is used
npm run build-storybook -- -o public/storybook

# 3. Build Documentation Site
echo "Step 3: Building Documentation site..."
cd docs-site
echo "Installing documentation dependencies..."
npm install --legacy-peer-deps
echo "Running docusaurus build..."
npm run build
cd ..

# 4. Copy Documentation Site to Public
echo "Step 4: Integrating documentation into public directory..."
mkdir -p public/docs
# Use /. to copy contents instead of the directory itself
cp -rv docs-site/build/. public/docs/

echo "Build pipeline completed successfully!"
