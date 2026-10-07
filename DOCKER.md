# 🐳 Docker - Integral Consulting

Guía completa para usar Docker en desarrollo y producción.

---

## ¿Por qué Docker?

✅ **Consistencia:** mismo entorno dev, staging y producción  
✅ **Versionado:** imagen = código + dependencias + versión de runtime  
✅ **Despliegue simple:** `docker run` en cualquier servidor  
✅ **Escalabilidad:** orquestar múltiples instancias fácilmente  
✅ **CI/CD:** build automático y testing en pipelines  
✅ **Aislamientos:** la app no interfiere con el sistema host

---

## 📋 Requisitos

- **Docker** ≥ 20.10 ([descargar](https://docker.com/products/docker-desktop))
- **Docker Compose** ≥ 2.0 (incluido en Docker Desktop)

**Verificar instalación:**
```bash
docker --version
docker compose --version
```

---

## 🚀 Desarrollo Local con Docker

### Opción 1: Docker Compose (Recomendado)

**Setup automático:** ambas apps en contenedores + networking

```bash
cd integral-consulting

# Iniciar (descarga, build, inicia)
docker compose up --build

# En otra terminal, ver logs
docker compose logs -f api
docker compose logs -f web

# Parar
docker compose down

# Parar y eliminar volúmenes (limpia datos)
docker compose down -v
```

**Verificar:**
- API: http://localhost:4000/health → `{"status":"ok"}`
- Web: http://localhost:3000
- Admin: http://localhost:3000/admin (token: `dev-token-cambiar-en-prod`)

**Variables de desarrollo** están en `docker-compose.yml` → puedes editarlas

### Opción 2: Build Individual (sin Compose)

```bash
# Build API
cd apps/api
docker build -t integral-api:latest .

# Run API
docker run -d \
  --name integral-api \
  -p 4000:4000 \
  -e ADMIN_TOKEN=my-token \
  -e DATA_DIR=/data \
  -e WEB_ORIGIN=http://localhost:3000 \
  -v integral-data:/data \
  integral-api:latest

# Build Web
cd ../web
docker build -t integral-web:latest .

# Run Web
docker run -d \
  --name integral-web \
  -p 3000:3000 \
  -e API_URL=http://localhost:4000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  integral-web:latest

# Ver logs
docker logs -f integral-api
docker logs -f integral-web

# Parar
docker stop integral-api integral-web
docker rm integral-api integral-web
```

---

## 🔧 Comandos Docker Útiles

```bash
# Build
docker compose build                    # Build todas las imágenes
docker compose build --no-cache         # Sin cache (rebuild completo)

# Run
docker compose up                       # Iniciar en foreground
docker compose up -d                    # Iniciar en background
docker compose up --build              # Build + run

# Ver estado
docker compose ps                       # Contenedores corriendo
docker compose logs                     # Todos los logs
docker compose logs -f api              # Logs en tiempo real (API)
docker compose logs --tail=50 web       # Últimas 50 líneas (Web)

# Exec (ejecutar comando dentro del contenedor)
docker compose exec api sh              # Shell en API
docker compose exec web sh              # Shell en Web
docker compose exec api npm run build   # Build dentro de API

# Restart
docker compose restart                  # Reiniciar todas
docker compose restart api              # Reiniciar solo API

# Stop/Remove
docker compose stop                     # Parar (datos persisten)
docker compose down                     # Parar y eliminar (datos persisten en volumes)
docker compose down -v                  # Parar y eliminar TODO (incluye volúmenes)

# Clean
docker system prune                     # Eliminar imágenes/containers sin usar
docker system prune -a                  # Eliminar TODO sin usar (cuidado)
```

---

## 📦 Estructura Docker

```
integral-consulting/
├── apps/
│   ├── api/
│   │   ├── Dockerfile                 # Build de API
│   │   ├── .dockerignore
│   │   └── ...
│   └── web/
│       ├── Dockerfile                 # Build de Web
│       ├── .dockerignore
│       └── ...
├── docker-compose.yml                 # Dev (con hot-reload)
├── docker-compose.prod.yml            # Prod (build estático)
└── README.md
```

---

## 🏗️ Dockerfiles

### API (Dockerfile)

```dockerfile
# Multi-stage: builder + runtime
FROM node:20-alpine AS builder
# ... compila código ...

FROM node:20-alpine
# ... solo runtime, sin código fuente ...
```

**Ventajas:**
- ✅ Build layer separada (no se envía código fuente)
- ✅ Imagen final pequeña (~200MB)
- ✅ Seguridad: sin herramientas de dev en producción
- ✅ Health check automático

### Web (Dockerfile)

```dockerfile
FROM node:20-alpine AS builder
# ... npm run build genera .next/ ...

FROM node:20-alpine
# ... copia .next/ optimizado ...
```

**Diferencia con API:** Next.js usa `next start` en lugar de `node dist/main.js`

---

## 📝 Variables de Entorno en Docker

### Desarrollo (`docker-compose.yml`)

Las variables están hardcoded para desarrollo:

```yaml
environment:
  API_URL: http://localhost:4000
  ADMIN_TOKEN: dev-token-cambiar-en-prod
```

**Para cambiar:** edita `docker-compose.yml` → `docker compose up`

### Producción (`docker-compose.prod.yml`)

Las variables vienen de `.env`:

```yaml
environment:
  API_URL: ${API_URL}
  ADMIN_TOKEN: ${ADMIN_TOKEN}
```

**Usar:**
```bash
# Crear .env
cp .env.example .env
# Editar .env con valores reales

# Ejecutar con variables
docker compose -f docker-compose.prod.yml up --build
```

O pasar variables directamente:

```bash
docker run -e ADMIN_TOKEN=abc123 integral-api:latest
```

---

## 🚀 Desplegar en Producción

### Opción A: VPS Propio (DigitalOcean, Linode, AWS, etc.)

```bash
# 1. SSH a tu servidor
ssh root@tu-servidor.com

# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Clonar repo
git clone https://github.com/TU_USUARIO/integral-consulting.git
cd integral-consulting

# 4. Crear .env con valores de producción
nano .env
# ADMIN_TOKEN=token-largo-aleatorio
# WEB_ORIGIN=https://tu-sitio.com
# API_URL=https://api.tu-sitio.com
# etc.

# 5. Ejecutar con Docker Compose
docker compose -f docker-compose.prod.yml up -d

# 6. Ver estado
docker compose ps
docker compose logs -f

# 7. Configurar reverse proxy (nginx/caddy) para HTTPS
# (ver sección Nginx más abajo)
```

**Monitoreo:**
```bash
# Ver métricas de contenedores
docker stats

# Ver logs en tiempo real
docker compose logs -f

# Restart automático si falla
# docker-compose.prod.yml ya tiene: restart: unless-stopped
```

---

### Opción B: Railway con Docker

Railway detecta automáticamente `Dockerfile` en root o en carpetas:

1. **Conectar repo en Railway**
2. **Railway lee `apps/api/Dockerfile`** y `apps/web/Dockerfile`
3. **Variables:** Railway Dashboard → Variables (igual que antes)
4. **Deploy automático** cada push a `main`

```bash
# Localmente, confirma que Docker funciona
docker compose build
docker compose up
# Si funciona, push a GitHub y Railway hace el resto
```

---

### Opción C: Vercel + Container Registry

Vercel soporta imágenes Docker pero es más complicado. **Recomendación:** usar Railway o VPS.

---

## 🔐 Seguridad

### Best Practices Implementadas

✅ **Multi-stage builds:** no incluye código fuente ni node_modules de build  
✅ **Usuario no-root:** `USER nextjs` / `USER nestjs`  
✅ **Minimal base image:** `alpine` (18MB vs 900MB de `ubuntu`)  
✅ **Health checks:** Docker reinicia si la app falla  
✅ **dumb-init:** maneja señales correctamente  
✅ **No secrets en imagen:** variables via environment

### Secrets en Producción

**❌ Evita:**
```bash
# Nunca en Dockerfile
ENV ADMIN_TOKEN=abc123
```

**✅ Usa:**
```bash
# En docker-compose.prod.yml (desde .env)
ADMIN_TOKEN: ${ADMIN_TOKEN}

# O via Railway/Docker Secrets
docker run -e ADMIN_TOKEN=abc123 ...
```

---

## 🐛 Troubleshooting Docker

### Contenedor no inicia

```bash
docker compose logs api
# Busca el error

# Opción: conectarse y debuggear
docker compose exec api sh
```

### Puerto ocupado

```bash
# Error: bind: address already in use
docker compose down  # Parar todo
docker ps -a         # Ver qué está corriendo
docker kill <id>     # Terminar

# O usar puerto diferente
docker compose --file docker-compose.yml -p 5000:4000 up
```

### Build lento

```bash
# Usar BuildKit (más rápido)
export DOCKER_BUILDKIT=1
docker compose build --no-cache

# O especificar en docker-compose.yml
DOCKER_BUILDKIT: 1
```

### Volúmenes sin persistir

```bash
# Verificar volúmenes
docker volume ls
docker volume inspect integral-consulting_api_data

# Si el volume no existe:
docker compose down -v
docker compose up  # Recreará volúmenes
```

### Memory leak / alto uso de CPU

```bash
docker stats          # Ver en tiempo real

# Limitar memoria en docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

---

## 📊 Comparación: Docker vs Sin Docker

| Aspecto | Docker | Sin Docker |
|--------|--------|-----------|
| **Setup local** | `docker compose up` (1 min) | npm install x2 + setup manual (10 min) |
| **Consistencia** | Dev = Prod ✅ | Puede variar ❌ |
| **Versionado** | Imagen tagged | Solo código |
| **Escalabilidad** | K8s, Swarm, ECS fácil | Complicado |
| **CI/CD** | Automático | Manual |
| **Curva aprendizaje** | Media | Ninguna |

---

## 🔗 Referencias

- [Docker Docs](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose)
- [Best Practices Node.js](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Alpine Linux](https://alpinelinux.org)

---

**Última actualización:** Oct 2026  
**Versión:** v1.0
