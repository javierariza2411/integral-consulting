#!/bin/bash
# Setup local rápido para Integral Consulting
# Uso: bash scripts/setup-local.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 Setup Local - Integral Consulting                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
echo "📋 Verificando Node.js..."
NODE_VERSION=$(node -v)
echo "   ✓ Instalado: $NODE_VERSION"
if ! node -v | grep -qE 'v(18|19|20|21|22)'; then
  echo "   ⚠️  Recomendado Node 18.18 o superior"
fi
echo ""

# Setup API
echo "📦 API - Integral Consulting (NestJS)"
echo "   Carpeta: apps/api"
cd apps/api

if [ ! -f .env ]; then
  echo "   → Creando .env desde .env.example..."
  cp .env.example .env
  echo "   ⚠️  ACCIÓN REQUERIDA: Edita .env y cambia ADMIN_TOKEN"
else
  echo "   ✓ .env ya existe"
fi

echo "   → npm install..."
npm install > /dev/null 2>&1

echo "   ✓ API setup completado"
echo ""

# Setup Web
echo "📦 Web - Integral Consulting (Next.js)"
echo "   Carpeta: apps/web"
cd ../../apps/web

if [ ! -f .env.local ]; then
  echo "   → Creando .env.local desde .env.example..."
  cp .env.example .env.local
  echo "   ⚠️  ACCIÓN REQUERIDA: Edita .env.local y actualiza API_URL"
else
  echo "   ✓ .env.local ya existe"
fi

echo "   → npm install..."
npm install > /dev/null 2>&1

echo "   ✓ Web setup completado"
echo ""

# Resumen
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup completado                                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "   1️⃣  Edita variables de entorno:"
echo "       • apps/api/.env (ADMIN_TOKEN)"
echo "       • apps/web/.env.local (API_URL)"
echo ""
echo "   2️⃣  Inicia la API (terminal 1):"
echo "       cd apps/api && npm run start:dev"
echo ""
echo "   3️⃣  Inicia el sitio (terminal 2):"
echo "       cd apps/web && npm run dev"
echo ""
echo "   4️⃣  Abre en navegador:"
echo "       • API:     http://localhost:4000/health"
echo "       • Sitio:   http://localhost:3000"
echo "       • Indicadores: http://localhost:3000 (franja superior)"
echo ""
echo "📚 Consulta DEPLOYMENT.md para desplegar a producción."
echo ""
