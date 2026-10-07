#!/bin/bash
# Deploy con Docker en VPS

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 Deploy Docker - Integral Consulting                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Variables
REPO_URL=${1:-"https://github.com/TU_USUARIO/integral-consulting.git"}
APP_DIR="/opt/integral-consulting"
ENV_FILE="$APP_DIR/.env"

echo "Repositorio: $REPO_URL"
echo "Directorio: $APP_DIR"
echo ""

# Crear directorio
echo "📁 Creando directorio de aplicación..."
sudo mkdir -p "$APP_DIR"
sudo chown -R $USER:$USER "$APP_DIR"

# Clonar repo
echo "📥 Clonando repositorio..."
if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR"
    git pull origin main
else
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# Crear .env si no existe
if [ ! -f "$ENV_FILE" ]; then
    echo "⚙️  Creando .env..."
    cp .env.example "$ENV_FILE"
    echo ""
    echo "⚠️  ACCIÓN REQUERIDA: Edita $ENV_FILE con tus valores:"
    echo "   sudo nano $ENV_FILE"
    echo ""
    exit 1
fi

# Verificar Docker
echo "🐳 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo ""
    echo "Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    echo "Agregando usuario al grupo docker..."
    sudo usermod -aG docker $USER
    echo "⚠️  Ejecuta: newgrp docker"
fi

# Build y start
echo ""
echo "🏗️  Building imágenes..."
docker compose -f docker-compose.prod.yml build

echo ""
echo "🚀 Iniciando contenedores..."
docker compose -f docker-compose.prod.yml up -d

# Esperar a que estén listos
echo ""
echo "⏳ Esperando que los servicios estén listos..."
sleep 5

# Verificar
echo ""
echo "✅ Verificando salud de servicios..."
docker compose ps

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Deploy completado                                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1️⃣  Ver logs:"
echo "   docker compose logs -f"
echo ""
echo "2️⃣  Verificar salud:"
echo "   curl http://localhost:4000/health"
echo "   curl http://localhost:3000"
echo ""
echo "3️⃣  Configurar nginx/caddy para HTTPS (ver DOCKER.md)"
echo ""
echo "4️⃣  Monitoreo continuo:"
echo "   docker compose logs -f api"
echo "   docker compose logs -f web"
echo ""
echo "🔐 Variables guardadas en: $ENV_FILE"
echo ""
