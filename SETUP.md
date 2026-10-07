# Setup Local - Integral Consulting

## Windows (PowerShell)

```powershell
# 1. Instalar API
cd apps\api
Copy-Item .env.example .env
npm install
# Edita .env con tu ADMIN_TOKEN

cd ..\..

# 2. Instalar Web
cd apps\web
Copy-Item .env.example .env.local
npm install

cd ..\..

# 3. Crear carpeta data
New-Item -ItemType Directory -Force -Path apps\api\data
```

## macOS / Linux

```bash
# Ejecutar script automático
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

O manualmente:

```bash
# 1. API
cd apps/api
cp .env.example .env
npm install
# Edita .env: ADMIN_TOKEN=cambia-por-token-largo

cd ../..

# 2. Web
cd apps/web
cp .env.example .env.local
npm install

cd ../..

# 3. Crear carpeta data
mkdir -p apps/api/data
```

---

## Ejecutar en Local

### Terminal 1: Iniciar API

```bash
cd apps/api
npm run start:dev
```

Debe mostrar:
```
[Nest] 12345  - 10/07/2026, 14:30:00   LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/07/2026, 14:30:01   LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 10/07/2026, 14:30:02   LOG [RoutesResolver] IndicatorsController {/indicators}:
```

Verifica:
```bash
# En otra terminal
curl http://localhost:4000/health
# Debe responder: {"status":"ok"}

curl http://localhost:4000/indicators
# Debe responder con valores (puede ser fallida inicialmente si no hay internet)
```

### Terminal 2: Iniciar Web

```bash
cd apps/web
npm run dev
```

Abre: http://localhost:3000

Debe cargar el sitio sin errores. Los indicadores pueden mostrar "—" si la API no tiene internet, pero no debe haber errores en consola.

---

## Editar Datos Locales

El archivo `.env.local` en `apps/web` debe coincidir con `apps/api/.env` en `API_URL`:

```
# apps/web/.env.local
API_URL=http://localhost:4000
```

---

## Limpiar (opcional)

```bash
# Borrar node_modules y reinstalar
rm -rf apps/*/node_modules
npm install --workspaces

# Limpiar builds
rm -rf apps/*/dist apps/*/.next

# Limpiar datos locales (mantiene .env)
rm -rf apps/api/data
mkdir -p apps/api/data
```

---

## Troubleshooting Local

| Problema | Solución |
|----------|----------|
| `npm: command not found` | Instala Node.js desde nodejs.org |
| `Port 3000 already in use` | Cambia el puerto: `npm run dev -- -p 3001` |
| `Port 4000 already in use` | Cambia PORT en `apps/api/.env` |
| `Cannot find module '@nestjs/common'` | `cd apps/api && npm install` |
| Indicadores muestran "—" | La API necesita internet para traer TRM |
| `/admin` no funciona | Verifica `ADMIN_TOKEN` en `apps/api/.env` |
| TypeScript errors | Asegúrate que `tsconfig.json` está en ambas apps |

---

## Deploy a Producción

Una vez todo funciona en local, lee:
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Guía paso a paso
- [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) - Checklist antes de producción

---

**Última actualización:** Oct 2026
