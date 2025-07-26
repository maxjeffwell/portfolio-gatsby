#!/bin/bash

# Script to remove unnecessary dependencies that might slow down builds

echo "Removing unnecessary dependencies for production builds..."

# Remove development-only dependencies that shouldn't be in dependencies
npm uninstall --save webpack-bundle-analyzer cheerio glob gatsby-cli @gatsbyjs/reach-router

# Move gatsby-plugin-eslint to devDependencies if needed
npm uninstall --save gatsby-plugin-eslint
npm install --save-dev gatsby-plugin-eslint

echo "Dependencies optimized!"
echo "Remember to commit these changes before deploying."