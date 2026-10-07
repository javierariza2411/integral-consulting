# 📋 Guía de Despliegue - Integral Consulting

> **⚠️ Importante:** Lee [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) antes de desplegar a producción.

## Flujo General

```
GitHub → Railway (API) → Vercel (Web) → Tu Dominio
```

---

## 0️⃣ Preparación Inicial

### 0.1 Requisitos previos

```bash
# Verifica Node.js versión
node --version    # ≥ 18.18, recomendado 20.x

# Verifica Git
git --version
```

### 0.2 Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. **Repository name:** `integral-consulting`
3. **Visibility:** Private (recomendado) o Public
4. **Crear sin README ni .gitignore** (ya los tenemos)

### 0.3 Conectar código a GitHub

```bash
cd /ruta/a/integral-consulting

git init
git add .
git commit -m "Initial commit: Integral Consulting website"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/integral-consulting.git
git push -u origin main
```

**Verifica:** 
```bash
git remote -v
# origin    https://github.com/TU_USUARIO/integral-consulting.git (fetch)
```

---

## 1️⃣ Desplegar API en Railway

### 1.1 Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión o regístrate
3. Dashboard → **New Project**
4. **Deploy from GitHub repo**
5. Selecciona `integral-consulting`
6. Elige rama `main`

### 1.2 Configurar el servicio

Una vez credo el proyecto:

1. **Abre el servicio de API** que se creó
2. **Settings** → **Source**
   - **Root Directory:** `apps/api` ✅
   - **Watch Paths:** (dejar en blanco o `apps/api/**`)

### 1.3 Variables de entorno

En la pestaña **Variables** (o **Environment**), agrega cada una:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NODE_ENV` | `production` | Railway lo puede agregar automáticamente |
| `PORT` | `4000` | Puerto interno (Railway expone automáticamente) |
| `ADMIN_TOKEN` | `generar-token-largo-aleatorio-aqui` | **Guarda este valor** para `/admin` |
| `WEB_ORIGIN` | `https://integral-consulting-production.up.railway.app` | Luego tu dominio. Importante: SIN `/` final |
| `DATA_DIR` | `/data` | Donde se guardan valores manuales |
| `CONTACT_TO` | `tu-email@tudominio.com` | Email que recibe los contactos |
| `CONTACT_FROM` | `"Integral Consulting <noreply@tudominio.com>"` | Email remitente |
| `SMTP_HOST` | (opcional) | Ver sección 7 del README |
| `SMTP_PORT` | `587` | (si usas SMTP) |
| `SMTP_USER` | (opcional) | (si usas SMTP) |
| `SMTP_PASS` | (opcional) | (si usas SMTP) |

**⚠️ Copia el `ADMIN_TOKEN` en un lugar seguro**

### 1.4 Crear volumen para datos persistentes

En el lienzo de Railway (canvas):

1. **Click derecho** en el servicio
2. **Add Volume**
3. **Mount path:** `/data`
4. **Conectar al servicio de API**

Esto garantiza que los valores manuales (IVA, UVT, etc.) persistan aunque reinicie.

### 1.5 Generar dominio público

1. **Settings** → **Networking**
2. **Generate Domain** (o **Custom Domain** si ya tienes tu propio dominio)
3. Copia la URL, ej: `https://integral-api-production.up.railway.app`

### 1.6 Verificar despliegue

```bash
# Salud del servicio
curl https://TU-API.up.railway.app/health
# Esperado: {"status":"ok"}

# Indicadores (debe traer TRM)
curl https://TU-API.up.railway.app/indicators
# Esperado: { "trm": 4.523, "euro": 4.890, ... }
```

Si ves `"trm": null` o similar, revisa **Logs** en Railway → busca "TRM falló" o "error de conexión".

---

## 2️⃣ Desplegar Web en Vercel

### 2.1 Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión o regístrate
3. **Add New** → **Project**
4. Importa el repositorio `integral-consulting`

### 2.2 Configurar el proyecto

En la pantalla de importación:

1. **Framework Preset:** Next.js (se detecta automáticamente)
2. **Root Directory:** `apps/web` ✅
3. **Build Command:** `npm run build` (Vercel lo auto-completa)
4. **Output Directory:** `.next` (Vercel lo auto-completa)
5. **Install Command:** `npm install` (automático)

### 2.3 Variables de entorno (¡IMPORTANTE!)

**Antes de hacer Deploy**, en la sección **Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `API_URL` | `https://integral-api-production.up.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://integral-consulting.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP` | `573214946748` |

**Notas:**
- `API_URL` se usa en **build time** (para revalidación de datos)
- Sin esta variable, el build fallará
- Sin `/` al final en `API_URL`

### 2.4 Deploy

1. Revisa que todo esté listo
2. Haz click en **Deploy**
3. Espera el build (2-3 minutos)

### 2.5 Verificar despliegue

1. Abre `https://integral-consulting.vercel.app`
2. Debe cargar el sitio sin errores
3. Revisa la franja de indicadores (TRM, Euro) → deben mostrar valores reales

**Si hay error:** Vercel → **Deployments** → última versión → **Logs** → busca el error

---

## 3️⃣ Cargar Datos Reales

### 3.1 Ingresar al panel `/admin`

1. Abre `https://integral-consulting.vercel.app/admin`
2. Ingresa el `ADMIN_TOKEN` que guardaste en paso 1.3

### 3.2 Actualizar indicadores manuales

Para cada indicador manual (según tabla en README):

1. **Ingresa el valor** (ej: 29.5 para IPC)
2. **Período:** formato `YYYY-MM` (ej: `2026-09`) o `YYYY`
3. **Desmarcar** "Dato de ejemplo"
4. **Guardar**

**Indicadores a actualizar (antes de mostrar al cliente):**
- [ ] IPC mensual
- [ ] Inflación anual
- [ ] Tasa de intervención
- [ ] DTF
- [ ] IVA (normalmente 19%)
- [ ] UVT
- [ ] SMMLV

---

## 4️⃣ Conectar Dominio Propio (Opcional)

### 4.1 En Vercel

1. Proyecto → **Settings** → **Domains**
2. Agrega: `www.tudominio.com` y `tudominio.com`
3. Copia los registros DNS que Vercel muestra

### 4.2 En tu proveedor de DNS

1. Ve al panel de tu registrador (GoDaddy, Namecheap, etc.)
2. Zona DNS del dominio
3. Agrega los registros `CNAME` que te mostró Vercel

### 4.3 Actualizar variables

En Vercel → **Settings** → **Environment Variables:**
- `NEXT_PUBLIC_SITE_URL` = `https://tudominio.com`

En Railway → **Variables:**
- `WEB_ORIGIN` = `https://tudominio.com`

**Redeploy** ambos servicios.

---

## 5️⃣ Configurar Correos (Opcional)

Si quieres recibir correos del formulario de contacto en lugar de solo logs:

### 5.1 Opción A: Gmail

1. Crea una [Contraseña de Aplicación](https://myaccount.google.com/apppasswords)
2. En Railway → **Variables:**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=<contraseña-de-aplicacion>
CONTACT_FROM="Integral Consulting <tu-email@gmail.com>"
```

### 5.2 Opción B: Dominio propio o Resend

Modifica `apps/api/src/contact/contact.service.ts` para usar tu proveedor preferido.

---

## 6️⃣ Monitoreo Post-Despliegue

### Checklist diario (primeros 7 días)

- [ ] Revisar Logs de Railway (indicadores, contactos)
- [ ] Revisar Logs de Vercel (errores de build o runtime)
- [ ] Probar `/admin` → actualizar un valor manual → verificar cambio
- [ ] Revisar formulario de contacto en `tudominio.com/contacto`
- [ ] Verificar TRM en la franja de indicadores (debe cambiar cada 30 min en horas de mercado)

### Checklist mensual

- [ ] Actualizar IPC e inflación (DANE publica mensualmente)
- [ ] Revisar logs de errores en Railway
- [ ] Verificar uptime (Vercel y Railway tienen dashboards)

---

## 7️⃣ Solución de Problemas

Ver archivo [README.md](README.md#9-solución-de-problemas) sección 9, o:

```bash
# API no responde
curl -v https://TU-API.up.railway.app/health

# Revisar logs en Railway
# Railway Dashboard → Servicio → Logs

# Revisar logs en Vercel
# Vercel Dashboard → Project → Deployments → Logs

# Probar API localmente
cd apps/api
npm install
npm run start:dev
# http://localhost:4000/health

# Probar Web localmente
cd apps/web
npm install
npm run dev
# http://localhost:3000
```

---

## 📚 Archivos de Referencia

- [README.md](README.md) - Overview del proyecto
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist pre-producción
- [SETUP.md](SETUP.md) - Setup local detallado
- [apps/api/.env.example](apps/api/.env.example) - Variables API
- [apps/web/.env.example](apps/web/.env.example) - Variables Web
