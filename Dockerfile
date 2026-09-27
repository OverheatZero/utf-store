# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package*.json ./
COPY app-front ./app-front
COPY app-api ./app-api
COPY shared ./shared

# Install and build
RUN npm install
RUN npm run build:shared
RUN npm run build --workspace=app-front

# Runtime stage with Caddy
FROM caddy:2-alpine

WORKDIR /app

# Copy built frontend from builder
COPY --from=builder /app/app-front/dist ./dist

# Copy Caddyfile
COPY app-front/Caddyfile ./Caddyfile

# Expose port 3000
EXPOSE 3000

# Start Caddy
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]

