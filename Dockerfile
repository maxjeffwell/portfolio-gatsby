# Multi-stage Dockerfile for Gatsby Portfolio
# Build static site and serve with nginx

# ============================================
# Build Stage
# ============================================
FROM node:20-alpine AS build

# Install build dependencies (Python, make, g++ for native modules)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Set build environment variables (matching Netlify config)
ENV NODE_ENV=production \
    GATSBY_CPU_COUNT=4 \
    NODE_OPTIONS="--max-old-space-size=8192" \
    GATSBY_PARALLEL_BUILD_COUNT=2 \
    GATSBY_TELEMETRY_DISABLED=1 \
    CI=true

# Copy application files
COPY package.json ./
COPY . .

# Install dependencies and build in one step
# Use --include=dev to explicitly install devDependencies despite NODE_ENV=production
# This is required because webpack and other build tools are devDependencies
RUN npm install --legacy-peer-deps --include=dev && npm run build

# ============================================
# Production Stage
# ============================================
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Gatsby site from build stage
COPY --from=build /app/public /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/share/nginx/html && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nodejs:nodejs /var/run/nginx.pid

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================
# Development Stage
# ============================================
FROM node:20-alpine AS development

# Install build dependencies and image processing libraries
RUN apk add --no-cache python3 make g++ automake autoconf libtool nasm && \
    apk add vips-dev fftw-dev --update-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    rm -rf /var/cache/apk/*

# Install Gatsby CLI globally
RUN npm install -g gatsby-cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose Gatsby development server port
EXPOSE 8000

# Expose VSCode debug ports
EXPOSE 9929 9230

# Set development environment
ENV NODE_ENV=development

# Start Gatsby development server on all interfaces
CMD ["gatsby", "develop", "-H", "0.0.0.0"]
