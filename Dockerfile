# Multi-stage Dockerfile for Gatsby Portfolio
# Build static site and serve with nginx

# ============================================
# Build Stage
# ============================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Set build environment variables (matching Netlify config)
ENV NODE_ENV=production \
    GATSBY_CPU_COUNT=4 \
    NODE_OPTIONS="--max-old-space-size=8192" \
    GATSBY_PARALLEL_BUILD_COUNT=2 \
    GATSBY_TELEMETRY_DISABLED=1 \
    CI=true

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build Gatsby site
RUN npm run build

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

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose Gatsby development port
EXPOSE 8000

# Expose Gatsby GraphQL explorer port
EXPOSE 8001

# Start Gatsby development server
CMD ["npm", "run", "develop"]
