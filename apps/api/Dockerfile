# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copiar código
COPY . .

# Build
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=4000

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copiar dependencias y build desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Crear directorio para datos (volumen)
RUN mkdir -p /data && chown -R nestjs:nodejs /data

# Usuario no-root
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init para ejecutar la app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

# Etiquetas
LABEL org.opencontainers.image.title="Integral Consulting API"
LABEL org.opencontainers.image.description="NestJS API para indicadores económicos"
LABEL org.opencontainers.image.version="1.0.0"
