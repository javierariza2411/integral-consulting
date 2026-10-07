# 📋 Checklist de Despliegue: Integral Consulting

Sigue estos pasos **en orden** para desplegar el proyecto en producción.

---

## ✅ Fase 0: Preparación Local (5 min)

- [ ] Node.js ≥ 18.18 instalado (`node -v`)
- [ ] Cuentas creadas: [GitHub](https://github.com), [Railway](https://railway.app), [Vercel](https://vercel.com)
- [ ] Repositorio local clonado o inicializado

**Comando:**
```bash
# Probar localmente (opcional pero recomendado)
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

---

## ✅ Fase 1: Subir a GitHub (2 min)

- [ ] Crear repositorio vacío en GitHub (privado o público)
- [ ] Código versionado en `main`

**Comandos:**
```bash
cd integral-consulting
git init
git add .
git commit -m "Initial commit: Integral Consulting monorepo"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/integral-consulting.git
git push -u origin main
```

---

## ✅ Fase 2: Desplegar API en Railway (10 min)

### 2.1 Crear proyecto
- [ ] Railway: **New Project** → **Deploy from GitHub repo**
- [ ] Seleccionar repositorio `integral-consulting`
- [ ] Confirmar despliegue automático

### 2.2 Configurar servicio
- [ ] Abre el servicio creado → **Settings** → **Source**
  - [ ] Root Directory: `apps/api`
  - [ ] Verificar que Node ≥ 18.18 está seleccionado

### 2.3 Variables de entorno
En **Railway Variables**, añade estas variables:

| Variable | Valor | Obligatorio |
|----------|-------|-------------|
| `ADMIN_TOKEN` | Texto largo y aleatorio (≥ 12 caracteres). **Guárdalo** | ✅ |
| `DATA_DIR` | `/data` | ✅ |
| `WEB_ORIGIN` | Se actualiza después (por ahora: `https://placeholder.vercel.app`) | ✅ |
| `CONTACT_TO` | Email destino de formularios | ✅ |
| `CONTACT_FROM` | `"Sitio web <noreply@dominio.com>"` | ✅ |
| `SMTP_HOST` | (vacío por ahora, ver [sección 7](../README.md#7-formulario-de-contacto-correo)) | ❌ |
| `SMTP_PORT` | 587 | ❌ |
| `SMTP_USER` | (vacío) | ❌ |
| `SMTP_PASS` | (vacío) | ❌ |

### 2.4 Volumen para datos persistentes
- [ ] Clic derecho en el lienzo → **Volume**
- [ ] Conectarlo al servicio con **Mount path**: `/data`
- [ ] Esto evita que los indicadores manuales se pierdan al reiniciar

### 2.5 Networking
- [ ] **Settings** → **Networking** → **Generate Domain**
- [ ] Copiar dominio generado (ej: `https://integral-api-production.up.railway.app`)
- [ ] **Guardar en documento seguro** (se necesita en Vercel)

### 2.6 Verificar despliegue
- [ ] Esperar a que el build termine (ve en **Deployments**)
- [ ] Abre en navegador: `https://TU-API-RAILWAY.up.railway.app/health`
  - [ ] Debe responder: `{"status":"ok"}`
- [ ] Abre: `https://TU-API-RAILWAY.up.railway.app/indicators`
  - [ ] Debe traer indicadores con TRM real

---

## ✅ Fase 3: Desplegar Web en Vercel (8 min)

### 3.1 Crear proyecto
- [ ] Vercel: **Add New** → **Project**
- [ ] Importar repositorio `integral-consulting`
- [ ] Framework: **Next.js** (auto-detectado)

### 3.2 Configurar
- [ ] **Root Directory**: `apps/web`

### 3.3 Variables de entorno (⚠️ ANTES de Deploy)
En **Environment Variables**, añade:

| Variable | Valor |
|----------|-------|
| `API_URL` | URL de Railway del paso 2.5, **sin `/` final** |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-sitio.vercel.app` (se actualizará después) |
| `NEXT_PUBLIC_WHATSAPP` | `573214946748` (o el número del cliente) |

### 3.4 Deploy
- [ ] Pulsa **Deploy**
- [ ] Esperar a que termine (ve en **Deployments**)

### 3.5 Verificar
- [ ] Abre la URL de Vercel en navegador
- [ ] Indicadores deben mostrar TRM real (no "—")
- [ ] Si muestran "—": revisar logs de Railway (`TRM falló: …`)

---

## ✅ Fase 4: Cargar Datos Reales (5 min)

### 4.1 Acceder a admin
- [ ] Abre: `https://tu-sitio.vercel.app/admin`
- [ ] Ingresa `ADMIN_TOKEN` del paso 2.3

### 4.2 Actualizar indicadores manuales
Para **cada uno** de estos indicadores:
- IPC mensual
- Inflación anual
- Tasa de intervención
- DTF
- UVT
- SMMLV
- IVA

Realiza:
1. Ingresa el valor vigente (consulta DANE, Banco de la República)
2. Ingresa el periodo (ej: `2026-09`, `2026`)
3. **Desmarca** "Dato de ejemplo"
4. Guarda

**Nota:** TRM y Euro se actualizan automáticos cada 30 min.

---

## ✅ Fase 5: Configurar Dominio Propio (opcional, 10 min)

### 5.1 DNS
- [ ] Vercel: **Project Settings** → **Domains** → Añadir dominio
- [ ] Copiar registros DNS indicados
- [ ] Añadir registros en tu registrador (Namecheap, Route 53, etc.)
- [ ] Esperar propagación DNS (5–48 horas)

### 5.2 Actualizar variables
- [ ] **Vercel**: actualizar `NEXT_PUBLIC_SITE_URL` a `https://www.tudominio.com`
- [ ] **Railway**: actualizar `WEB_ORIGIN` a `https://www.tudominio.com`
- [ ] **Vercel**: Redeploy
- [ ] **Railway**: Redeploy automático o manual

---

## ✅ Fase 6: SMTP para Formulario (opcional, 5 min)

Si quieres que los correos del formulario se envíen realmente:

### 6.1 Obtener credenciales SMTP
- **Gmail con contraseña de aplicación**: [Tutorial](https://support.google.com/accounts/answer/185833)
- **Dominio propio**: usar SMTP de tu proveedor

### 6.2 En Railway
- [ ] Actualizar en **Variables**:
  - `SMTP_HOST` = `smtp.gmail.com` (o tu proveedor)
  - `SMTP_PORT` = `587`
  - `SMTP_USER` = email
  - `SMTP_PASS` = contraseña de aplicación
  - `CONTACT_FROM` = email corporativo

- [ ] Redeploy

### 6.3 Probar
- [ ] Ir a `/contacto` en el sitio
- [ ] Enviar formulario
- [ ] Verificar que el correo llega a `CONTACT_TO`

---

## ✅ Fase 7: Auditoría Final (10 min)

### 7.1 SEO y Metadatos
- [ ] Abre `https://www.tudominio.com/sitemap.xml`
  - [ ] Debe listar todas las rutas
- [ ] Abre `https://www.tudominio.com/robots.txt`
  - [ ] Debe permitir indexación

### 7.2 Seguridad
- [ ] `/admin` protegido con `ADMIN_TOKEN` único y fuerte
- [ ] No hay `.env` versionado en Git (en `.gitignore`)
- [ ] HTTPS habilitado (automático en Vercel y Railway)

### 7.3 Performance
- [ ] Vercel Analytics: mira métricas de Web Vitals
- [ ] Indicadores cargan en < 2 segundos
- [ ] Gráfica de TRM carga en < 1 segundo

### 7.4 Accesibilidad
- [ ] Probar con lector de pantalla (NVDA, JAWS)
- [ ] Ratios de contraste OK en toda la web

---

## ✅ Fase 8: Post-Lanzamiento

### Mantenimiento recurrente

| Tarea | Frecuencia | Instrucciones |
|-------|-----------|---|
| Actualizar IPC e inflación | Mensual (DANE publica el día 5) | Ir a `/admin`, cambiar valores, desmarcar "ejemplo" |
| Revisar UVT y SMMLV | Anual (enero) | Idem anterior |
| Revisar TRM automática | Diaria (logs Railway) | Si hay "TRM falló", revisar conexión a datos.gov.co |
| Backups de datos | Semanal | Railway → Settings → Backups (gratuito) |

### Alertas y monitoreo
- [ ] Activar notificaciones de Railway (erores de build/deploy)
- [ ] Activar notificaciones de Vercel (builds fallidos)

---

## 🆘 Solución de Problemas Rápida

| Error | Causa | Solución |
|-------|-------|----------|
| "Indicadores no disponibles" en web | `API_URL` mal, o API caída | Revisar `/health` de Railway. Redeploy en Vercel |
| TRM muestra "—" | API no alcanza datos.gov.co | Ver logs Railway: `docker logs` o **Deployments** → últimas líneas |
| `/admin` dice "Token inválido" | `ADMIN_TOKEN` no coincide o < 8 caracteres | Cambiar en Railway y Redeploy |
| Build de Vercel falla | Root Directory no es `apps/web` | Vercel → Project Settings → Source |
| Build de Railway falla | Node < 18.18 o Root Directory no es `apps/api` | Railway → Settings → Source |
| Correos no llegan | SMTP vacío, o plan de Railway bloquea salida | Configurar SMTP o usar API (Resend, SendGrid) |

---

## 📞 Soporte

- **Railway docs**: https://docs.railway.app
- **Vercel docs**: https://vercel.com/docs
- **Next.js docs**: https://nextjs.org/docs
- **NestJS docs**: https://docs.nestjs.com

---

**Última actualización:** Oct 2026  
**Versión:** v1.0
