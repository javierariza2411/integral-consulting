# 🔧 Solución de Problemas - Integral Consulting

Guía completa para resolver problemas comunes en local y producción.

## 📋 Tabla de Contenidos

1. [Problemas Locales](#problemas-locales)
2. [Problemas de Despliegue](#problemas-de-despliegue)
3. [Problemas en Producción](#problemas-en-producción)
4. [Errores de Variables de Entorno](#errores-de-variables-de-entorno)

---

## 🖥️ Problemas Locales

### API no inicia (port 4000)

**Error:** `Error: listen EADDRINUSE :::4000`

**Solución:**
```bash
# Opción 1: Usar puerto diferente
PORT=5000 npm run start:dev

# Opción 2: Ver qué usa puerto 4000
lsof -i :4000          # macOS/Linux
netstat -ano | grep 4000  # Windows
# Luego termina el proceso
```

---

### Web no inicia (port 3000)

**Error:** `Error: listen EADDRINUSE :::3000`

**Solución:**
```bash
# Opción 1: Usar puerto diferente
npm run dev -- -p 3001

# Opción 2: Verificar qué usa puerto 3000 y terminar proceso
```

---

### Módulos no encontrados en API

**Error:** `Cannot find module '@nestjs/common'` o similar

**Causa:** Dependencias no instaladas

**Solución:**
```bash
cd apps/api
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

---

### TypeScript compilation error en Web

**Error:** `error TS2307: Cannot find module` o `Type '...' is missing`

**Solución:**
```bash
cd apps/web
rm -rf .next node_modules
npm install
npm run build
npm run dev
```

---

### Indicadores muestran "—" en localhost

**Causa:** La API no alcanza internet (datos.gov.co, open.er-api.com)

**Síntoma:** Los indicadores automáticos (TRM, Euro) aparecen vacíos

**Solución:**
1. Verifica que tienes conexión a internet
2. Abre en navegador: `http://localhost:4000/indicators`
   - Si traen valores: el problema es en la web
   - Si están nulos: la API no alcanza las fuentes

3. Revisa logs de la API:
```bash
# En la terminal de API, busca mensajes como:
# [TRM] Error fetching TRM: ...
# [EUR] Error fetching EUR: ...
```

4. **Problema usual:** datos.gov.co requiere cambio de header o autenticación
   - Edita `apps/api/src/indicators/indicators.service.ts`
   - Verifica URLs y headers

---

### Formulario de contacto no envía correos en local

**Esperado:** Con `SMTP_HOST` vacío, solo se registra en logs (sin error)

**Solución:**
```bash
# Ver logs de API:
cd apps/api
npm run start:dev

# Envía formulario desde http://localhost:3000/contacto
# En la terminal de API debe aparecer:
# [Mailer] Contact form received: { name: '...', email: '...', ... }
```

Si ves error:
- Verifica `CONTACT_TO` en `.env`
- Verifica que el formulario envía datos válidos

---

### Admin requiere token pero no funciona

**Error:** `/admin` dice "Token inválido"

**Solución:**
1. Verifica el token en `apps/api/.env`
   ```bash
   ADMIN_TOKEN=cambia-por-token-largo-y-aleatorio
   ```

2. El token debe tener ≥ 8 caracteres

3. Asegúrate que la API está corriendo:
   ```bash
   curl http://localhost:4000/health
   # Debe responder: {"status":"ok"}
   ```

4. Intenta ingresando el token exactamente como en `.env`

---

## 🚀 Problemas de Despliegue

### Railway: Build falla con "Root directory not found"

**Error:** `Error: Cannot find root directory`

**Solución:**
1. Abre Railway dashboard
2. Servicio → **Settings** → **Source**
3. Verifica **Root Directory** = `apps/api` ✅

---

### Vercel: Build falla con "Module not found"

**Error:** `error TS2307: Cannot find module` o `error: Module not found`

**Solución:**
1. Vercel → Project → **Settings** → **General**
2. Verifica:
   - **Root Directory** = `apps/web` ✅
   - **Framework** = Next.js ✅
   - **Node Version** = 20.x ✅

3. Revisa **Environment Variables**:
   - `API_URL` debe estar presente ✅
   - Sin `/` al final ✅

4. Si aún falla, haz Redeploy:
   - Vercel Dashboard → Deployments → última versión → **Redeploy**

---

### Railway: API se reinicia constantemente

**Error:** Deploy crea el servicio pero se reinicia en bucle

**Causa:** Error en código o variables de entorno faltantes

**Solución:**
1. Railway → Servicio → **Deployments** → Última versión
2. Abre **Logs** y busca:
   - `Error: ADMIN_TOKEN is required`
   - `Error: listening on port undefined`
   - Otros errores

3. Verifica en **Variables**:
   - `ADMIN_TOKEN` debe existir y tener ≥ 8 caracteres
   - `DATA_DIR` = `/data`
   - `WEB_ORIGIN` debe ser una URL válida

4. Después de actualizar variables, **Redeploy**:
   - Railway → Deployments → **Redeploy**

---

### Railway: Volume montado pero datos se pierden

**Causa:** Volume no está correctamente conectado

**Solución:**
1. Railway → Canvas (lienzo)
2. Busca el **Volume** creado (rectángulo azul)
3. Haz click y verifica:
   - **Mount path** = `/data` ✅
   - **Connected to** = `integral-api` ✅
4. Si no está conectado, desconecta y reconecta

---

## 🌐 Problemas en Producción

### Indicadores muestran "—" en Vercel

**Causa:** La API no alcanza datos.gov.co o está caída

**Verificar:**
```bash
# 1. ¿La API está corriendo?
curl https://tu-api.railway.app/health
# Esperado: {"status":"ok"}

# 2. ¿Traen indicadores?
curl https://tu-api.railway.app/indicators
# Esperado: { "trm": 4.523, "euro": 4.890, ... }
# Si son null, revisar logs
```

**Soluciones:**

**A) API caída:**
- Railway → Servicio → Deployments → ver qué salió mal
- Leer Logs (busca error)
- Redeploy: Deployments → última versión → **Redeploy**

**B) Conexión a datos.gov.co fallida:**
- Revisa en Railway → Logs → busca: `[TRM] Error fetching`
- Posibles causas:
  - datos.gov.co cambió URL o requiere autenticación
  - Bloqueo de IP de Railway
  - Timeout de conexión

**Solución:** Contactar a tu equipo técnico para actualizar `indicators.service.ts`

**C) Vercel no actualiza:**
- Haz **Redeploy** en Vercel
- Si sigue sin actualizar, el cache de Vercel puede estar viejo
- Espera 60 segundos y actualiza navegador (Ctrl+Shift+R)

---

### `/admin` dice "Token inválido" en Vercel

**Verificar:**
```bash
# Token en Railway
curl -H "Authorization: Bearer tu-admin-token" \
  https://tu-api.railway.app/health
```

**Soluciones:**

1. **Token incorrecto:**
   - Verifica en Railway → Variables → `ADMIN_TOKEN`
   - Cópialo exactamente
   - Intenta en `/admin`

2. **Token cambió recientemente:**
   - Railway debe hacer Redeploy automático
   - Si no, haz Redeploy manual
   - Espera 1–2 minutos

3. **Token enviado incorrectamente desde web:**
   - Abre DevTools → Console
   - Copia el formulario de login e inspecciona la solicitud
   - Verifica que se envía en header `Authorization`

---

### Formulario de contacto no envía correos en producción

**Verificar:**
```bash
# 1. ¿Está configurado SMTP?
# Railway → Variables → SMTP_HOST debe tener valor

# 2. ¿Alcanza el servidor SMTP?
# Ver en Railway → Logs → busca: [Mailer] Error
```

**Soluciones:**

**A) Sin SMTP configurado:**
- Railway → Variables → Agrega:
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=tu-email@gmail.com
  SMTP_PASS=contraseña-de-aplicacion
  CONTACT_FROM="Integral Consulting <noreply@dominio.com>"
  ```
- Redeploy

**B) Errores de conexión SMTP:**
- Posible causa: Tu plan de Railway bloquea SMTP saliente
- Solución: Cambiar a proveedor API (Resend, SendGrid)
  - Editar `apps/api/src/contact/contact.service.ts`
  - Usar endpoint del proveedor en lugar de nodemailer

**C) Correos en spam:**
- Configura SPF, DKIM y DMARC en tu dominio
- Usa contraseña de aplicación en Gmail (no password normal)
- Entra en `CONTACT_FROM` el email real del dominio

---

### Dominio no carga, error de DNS

**Verificar:**
```bash
# macOS/Linux
dig www.tudominio.com

# Windows PowerShell
Resolve-DnsName www.tudominio.com

# Esperado: Debe resolver a IP de Vercel
```

**Soluciones:**

1. **Registros DNS no están propagados:**
   - Espera 24–48 horas
   - Usa: https://dnschecker.org

2. **Registros DNS incorrectos:**
   - Vercel → Project → Settings → Domains
   - Copia los registros que Vercel muestra
   - Verifica en tu registrador que coinciden exactamente

3. **Dominio apunta a IP vieja:**
   - Elimina y vuelve a añadir en Vercel
   - Espera a que se regenere

---

### Performance lento (web tarda > 3s en cargar)

**Verificar:**
1. Vercel Analytics → Web Vitals
2. Abre DevTools → Network
3. Mira cuál recurso es lento

**Soluciones por causa:**

**A) API lenta:**
- Railway → Metrics → CPU/Memory
- Si está al 100%, escala el servicio
- Revisa Logs: ¿hay errores o loops infinitos?

**B) JavaScript lento:**
- Vercel → Deployments → última versión → Logs → busca warnings
- Posibles: componentes no optimizados, muchos renders

**C) Imagen lenta:**
- Vercel → Analytics → web vitals → LCP
- Si es imagen, optimizar: usar WebP, lazy load

---

## 🔐 Errores de Variables de Entorno

### API no inicia: "ADMIN_TOKEN is required"

**Solución:**
```bash
# Railway
Variables → Agregar:
ADMIN_TOKEN=algo-largo-y-aleatorio-min-8-chars

# Redeploy
```

---

### Vercel: "API_URL is required"

**Solución:**
```bash
# Vercel
Project → Settings → Environment Variables

Agregar:
API_URL=https://tu-api.railway.app  (sin / final)

# Redeploy
```

---

### Web no carga indicadores: "Invalid API_URL format"

**Causa:** `API_URL` tiene formato incorrecto

**Solución:**
```bash
# Vercel: Environment Variables
❌ Incorrecto: https://tu-api.railway.app/
❌ Incorrecto: tu-api.railway.app
✅ Correcto:   https://tu-api.railway.app
```

---

### API no alcanza formulario: "CONTACT_TO is required"

**Solución:**
```bash
# Railway
Variables → Agregar:
CONTACT_TO=email@dominio.com
```

---

## 📞 Soporte Técnico

Si el problema persiste:

1. **Recopila logs:**
   ```bash
   # Railway Logs
   # Railway Dashboard → Servicio → Logs → Copiar últimas 100 líneas

   # Vercel Logs
   # Vercel Dashboard → Project → Deployments → última → Logs
   ```

2. **Verifica URLs:**
   - `https://tu-api.railway.app/health` → responde?
   - `https://tu-sitio.vercel.app` → carga?
   - `https://tu-dominio.com` → resuelve DNS?

3. **Lee documentación oficial:**
   - Railway: https://docs.railway.app
   - Vercel: https://vercel.com/docs
   - NestJS: https://docs.nestjs.com
   - Next.js: https://nextjs.org/docs

---

**Última actualización:** Oct 2026  
**Versión:** v1.0
