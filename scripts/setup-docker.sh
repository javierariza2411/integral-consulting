#!/bin/bash
# Setup rápido con Docker

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🐳 Docker Setup - Integral Consulting                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Docker
echo "📋 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo "   Descarga desde: https://docker.com/products/docker-desktop"
    exit 1
fi
docker_version=$(docker --version)
echo "   ✓ $docker_version"
echo ""

# Verificar Docker Compose
echo "📋 Verificando Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose no está disponible"
    exit 1
fi
echo "   ✓ Docker Compose disponible"
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml no encontrado"
    echo "   Ejecuta este script desde la raíz del proyecto"
    exit 1
fi
echo ""

# Build
echo "📦 Build de imágenes Docker..."
docker compose build

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup completado                                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Para iniciar los contenedores:"
echo ""
echo "   docker compose up"
echo ""
echo "📝 URL de desarrollo:"
echo "   • API:   http://localhost:4000"
echo "   • Web:   http://localhost:3000"
echo "   • Admin: http://localhost:3000/admin"
echo ""
echo "🔑 Token de admin (dev): dev-token-cambiar-en-prod"
echo ""
echo "📚 Para más info, lee: DOCKER.md"
echo ""
