# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiar código y public assets
COPY . .

# Build (genera .next/)
RUN npm run build

# Stage 2: Runtime (minimal)
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Instalar dumb-init
RUN apk add --no-cache dumb-init

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar dependencias de runtime y build desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node_modules/.bin/next", "start"]

LABEL org.opencontainers.image.title="Integral Consulting Web"
LABEL org.opencontainers.image.description="Next.js 14 sitio web de Integral Consulting"
LABEL org.opencontainers.image.version="1.0.0"
