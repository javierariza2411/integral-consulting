# Integral Consulting SAS · Sitio Web

Monorepo moderno con dos aplicaciones integradas: sitio web responsive (Next.js) + API en tiempo real (NestJS).

| Componente | Stack | Despliegue |
|-----------|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind | Vercel |
| **Backend** | NestJS 10 + Express | Docker en VPS |

**Arquitectura:** Frontend llama a `/backend/*` (mismo dominio) → Next reenvía a la API. **Sin CORS.** API actualiza automáticamente indicadores económicos cada 30 min desde fuentes oficiales.

## Características

- **Páginas públicas:** Inicio, Servicios (+ detalle), Sectores, Indicadores, Nosotros, Experiencia, Contacto, Legal
- **Panel de indicadores en vivo:** TRM, Euro, IPC, inflación, tasas, DTF, IVA, UVT, SMMLV (con fuente, frecuencia y fecha de actualización)
- **Herramientas:** Gráfica histórica TRM (7d/30d/12m), conversor USD/EUR ↔ COP, calculadora de IVA
- **SEO listo para producción:** Sitemap, robots.txt, JSON-LD, metadatos dinámicos
- **Accesibilidad:** WCAG 2.1 nivel AA, soporte lector de pantalla
- **Integración WhatsApp:** Botón flotante con número configurable
- **Panel admin protegido:** Cargar datos manuales sin redeploy

## Indicadores: Automáticos vs Manuales

| Indicador | Origen | Actualización |
|-----------|--------|--------------|
| **TRM** | datos.gov.co (Superfinanciera) | Automática c/30 min |
| **Euro** | open.er-api.com | Automática c/30 min |
| IPC, Inflación, Tasa intervención, DTF | Manual desde `/admin` | Cuando publica DANE/Banco Rep. |
| IVA, UVT, SMMLV | Manual desde `/admin` | Una vez al año (por ley) |

> 🔴 **ANTES DE MOSTRAR AL CLIENTE:** Los valores manuales vienen como "Dato de ejemplo" (visible en tarjeta). Accede a `/admin`, actualiza IPC/Inflación/Tasas/UVT/SMMLV/IVA y desmarca "ejemplo".

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Opción Docker (Recomendado):** [Docker](https://docker.com) ≥ 20.10
- **Opción Local:** Node.js ≥ 18.18
- GitHub para versionado

### 1a. Con Docker (⭐ RECOMENDADO)

```bash
chmod +x scripts/setup-docker.sh
./scripts/setup-docker.sh

# Luego
docker compose up

# URLs:
# API:   http://localhost:4000/health
# Web:   http://localhost:3000
# Admin: http://localhost:3000/admin (token: dev-token-cambiar-en-prod)
```

**Ventajas:** Mismo entorno dev/prod, hot-reload, reproducible

Ver detalles: [DOCKER.md](DOCKER.md)

### 1b. Sin Docker (Local)

```bash
# API
cd apps/api
cp .env.example .env        # edita ADMIN_TOKEN
npm install
npm run start:dev           # http://localhost:4000/health  y  /indicators

# Web (otra terminal)
cd apps/web
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

Ver detalles: [SETUP.md](SETUP.md)

---

## 🚀 Desplegar a Producción

### Opción A: Docker en VPS (Recomendado - Todo integrado)

```bash
chmod +x scripts/deploy-docker.sh
./scripts/deploy-docker.sh https://github.com/TU_USUARIO/integral-consulting.git
```

[Ver guía completa →](DOCKER.md#-desplegar-en-producción)

### Opción B: Vercel (Frontend) + VPS Docker (Backend) ⭐

Aloja el frontend en Vercel (gratis con dominio propio) y el backend en cualquier VPS con Docker.

**Paso 1: Subir código a GitHub**

```bash
git init
git add .
git commit -m "Integral Consulting - Docker ready"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/integral-consulting.git
git push -u origin main
```

**Paso 2: Desplegar Frontend en Vercel**

1. Abre [vercel.com](https://vercel.com) → **Add New → Project**
2. Importa tu repositorio de GitHub
3. **Framework:** Next.js (detectado automáticamente)
4. **Root Directory:** `apps/web`
5. **Environment Variables** (antes de Deploy):
   ```
   API_URL=https://api.tudominio.com
   NEXT_PUBLIC_SITE_URL=https://tu-sitio.vercel.app
   NEXT_PUBLIC_WHATSAPP=573214946748
   ```
6. **Deploy.** Vercel compila y publica en cada push a `main`.

**Paso 3: Desplegar Backend en VPS con Docker**

Usa `scripts/deploy-docker.sh` en cualquier VPS (DigitalOcean, Linode, Hetzner, Vultr, etc.):

```bash
chmod +x scripts/deploy-docker.sh
./scripts/deploy-docker.sh https://github.com/TU_USUARIO/integral-consulting.git
```

El script clona el repo, crea `.env` interactivamente, e inicia `docker compose -f docker-compose.prod.yml`.

[Ver guía completa →](DOCKER.md#-desplegar-en-producción)

---

## ⚙️ Configuración

### Variables de Entorno (.env)

**Desarrollo (docker-compose.yml):**
```
NODE_ENV=development
ADMIN_TOKEN=dev-token-cambiar-en-prod
PORT=4000
WEB_ORIGIN=http://localhost:3000
CONTACT_TO=dev@example.com
DATA_DIR=/data
```

**Producción (.env en VPS):**
```
ADMIN_TOKEN=<token-largo-aleatorio-min-32-chars>
DATA_DIR=/data
WEB_ORIGIN=https://tu-sitio.com
CONTACT_TO=email@tudominio.com
CONTACT_FROM="Integral Consulting <noreply@tudominio.com>"
API_URL=https://api.tu-sitio.com
SMTP_HOST=smtp.gmail.com  (opcional)
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

Ver: [.env.example](.env.example)

---

## 🔐 Cargar datos reales (5 minutos)

1. Accede a `https://tu-sitio.vercel.app/admin`
2. Escribe el `ADMIN_TOKEN` del `.env` de producción
3. Actualiza cada indicador manual con valores vigentes:
   - IPC (mensual)
   - Inflación (anual)
   - Tasa de intervención
   - DTF
   - UVT
   - SMMLV
   - IVA
4. **Desmarca "dato de ejemplo"** para cada indicador
5. Los valores se guardan en `/data/indicators.json` (persisten entre reinicios)

---

## 🌍 Dominio Propio

1. **DNS:**
   - Apunta `tu-sitio.com` a Vercel (CNAME o A record)
   - Apunta `api.tu-sitio.com` a IP de VPS (A record)

2. **Vercel:** Project → Settings → Domains → agrega `tu-sitio.com` y `www.tu-sitio.com`

3. **VPS:** Configura certificado SSL (Let's Encrypt)
   ```bash
   sudo certbot certonly -d api.tu-sitio.com
   ```

4. **Actualiza variables:**
   - Vercel: `API_URL=https://api.tu-sitio.com`
   - VPS `.env`: `WEB_ORIGIN=https://tu-sitio.com`, `API_URL=https://api.tu-sitio.com`

---

## 📧 Formulario de contacto (SMTP)

**Sin configurar SMTP:** Funciona pero solo registra en logs.

**Con SMTP:** Recibe correos directamente.

```bash
# .env del VPS
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=integralconsulting.sas@gmail.com
SMTP_PASS=<app-password-16-caracteres>
CONTACT_FROM="Integral Consulting <noreply@tudominio.com>"
```

> Nota: Usa una contraseña de aplicación (no la contraseña de Gmail). [Cómo generar →](https://myaccount.google.com/apppasswords)

---

## 🐛 Solución de Problemas

| Síntoma | Causa | Solución |
|---------|-------|----------|
| "Indicadores no disponibles" | `API_URL` incorrecto o API caída | Verifica que sea `https://api.tudominio.com` (sin `/` final). Revisa `/health` desde terminal. |
| TRM en "—" | API no alcanza datos.gov.co | Mira logs: `docker compose logs api`. Se reintenta cada 30 min. |
| `/admin` responde "Token inválido" | `ADMIN_TOKEN` no coincide | Verifica `.env` en VPS. Debe tener mínimo 12 caracteres. |
| Build Vercel falla | Root Directory mal configurado | Verifica que sea `apps/web`. Revisa variables de entorno. |
| Contenedores no arrancan | Problema en `.env` o puerto ocupado | Ejecuta `docker compose logs` para ver detalles. |
| No llegan correos | SMTP no configurado o puerto bloqueado | Verifica credenciales SMTP. Algunos proveedores bloquean puerto 587. |

Ver guía completa: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📦 Estructura

```
apps/
  api/   
    src/
      indicators/     # Fetch TRM, EUR automático
      contact/        # Formulario + SMTP
    main.ts           # Entry point
    .env.example
    Dockerfile        # Prod: optimizado, solo deps
    Dockerfile.dev    # Dev: con ts-node-dev
    railway.json      # Legacy (no se usa con Docker)

  web/
    app/              # Next.js 14 App Router (páginas)
    components/       # React components
    lib/
      content.ts      # CENTRAL: textos servicios/sectores/casos
      api.ts          # Cliente HTTP hacia API
      types.ts
      format.ts
    public/logo.png
    .env.example
    Dockerfile        # Prod: next start
    Dockerfile.dev    # Dev: npm run dev con hot-reload

docker-compose.yml         # Dev: hot-reload, logs en consola
docker-compose.prod.yml    # Prod: env vars, restart policies
.env.example               # Template de variables

scripts/
  setup-docker.sh    # Verifica Docker, compila imágenes
  deploy-docker.sh   # Deploy VPS: git clone, .env, docker-compose up
```

Los textos y contenido están centralizados en [`apps/web/lib/content.ts`](apps/web/lib/content.ts).

---

## ✅ Checklist Antes de Producción

- ✅ Docker local funciona: `docker compose up -d`
- ⬜ `package-lock.json` incluido en ambas apps (commit a git)
- ⬜ Frontend desplegado en Vercel
- ⬜ Backend corriendo en VPS con `/data` persistido
- ⬜ Dominio propio configurado (DNS + Vercel + SSL en VPS)
- ⬜ `ADMIN_TOKEN` generado (16+ caracteres aleatorios)
- ⬜ Datos manuales cargados vía `/admin`
- ⬜ Logo definitivo confimado
- ⬜ Textos revisados y ortografía validada
- ⬜ `/legal/*` revisado por abogado
- ⬜ SMTP configurado (opcional)
- ⬜ CAPTCHA y analítica (si cliente lo requiere)

---

## 📚 Documentación Completa

- [DOCKER.md](DOCKER.md) — Setup Docker local y prod, comandos, troubleshooting
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Guía de problemas comunes
- [SETUP.md](SETUP.md) — Setup local sin Docker (opcional)

---

## Referencias

- [Next.js 14 Docs](https://nextjs.org)
- [NestJS Docs](https://docs.nestjs.com)
- [Docker Compose](https://docs.docker.com/compose/)
- [Vercel Deployment](https://vercel.com/docs)
