#!/bin/bash

# Script para deploy manual da aplicação
# Útil para testes ou deploys de emergência

set -e

# Carregar variáveis de ambiente
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Variáveis
RESOURCE_GROUP="${RESOURCE_GROUP:-rg-fasttech-foods}"
ACR_NAME="${ACR_NAME:-fasttechregistry}"
CONTAINER_APP_NAME="${CONTAINER_APP_NAME:-ca-fasttech-frontend}"
IMAGE_TAG="${IMAGE_TAG:-$(date +%s)}"

echo "🚀 Iniciando deploy manual..."
echo "Resource Group: $RESOURCE_GROUP"
echo "Container Registry: $ACR_NAME"
echo "Container App: $CONTAINER_APP_NAME"
echo "Image Tag: $IMAGE_TAG"

# Verificar se está logado no Azure
if ! az account show &> /dev/null; then
    echo "❌ Você não está logado no Azure. Execute 'az login' primeiro."
    exit 1
fi

# Fazer login no ACR
echo "🔐 Fazendo login no Container Registry..."
az acr login --name $ACR_NAME

# Build e push da imagem
echo "🐳 Construindo e enviando imagem Docker..."
docker build -t $ACR_NAME.azurecr.io/fasttech-frontend:$IMAGE_TAG .
docker tag $ACR_NAME.azurecr.io/fasttech-frontend:$IMAGE_TAG $ACR_NAME.azurecr.io/fasttech-frontend:latest
docker push $ACR_NAME.azurecr.io/fasttech-frontend:$IMAGE_TAG
docker push $ACR_NAME.azurecr.io/fasttech-frontend:latest

# Atualizar Container App
echo "📦 Atualizando Container App..."
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/fasttech-frontend:$IMAGE_TAG

# Obter URL da aplicação
APP_URL=$(az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Aplicação disponível em: https://$APP_URL"

# Health check simples
echo "🔍 Fazendo health check..."
sleep 30
if curl -f "https://$APP_URL" > /dev/null 2>&1; then
    echo "✅ Health check passou! Aplicação está funcionando."
else
    echo "⚠️  Health check falhou. Verifique os logs da aplicação."
fi
