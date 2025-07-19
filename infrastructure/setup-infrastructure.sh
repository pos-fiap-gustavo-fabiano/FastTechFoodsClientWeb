#!/bin/bash

# Script para configurar a infraestrutura do Azure Container Apps
# Executa: chmod +x setup-infrastructure.sh && ./setup-infrastructure.sh

set -e

# Variáveis
RESOURCE_GROUP="rg-fasttech-foods"
LOCATION="eastus2"
ACR_NAME="fasttechregistry"
CONTAINER_APP_ENV="cae-fasttech-foods"
LOG_ANALYTICS_WORKSPACE="law-fasttech-foods"

echo "🚀 Iniciando setup da infraestrutura Azure..."

# Verificar se está logado no Azure
echo "📋 Verificando login do Azure..."
if ! az account show &> /dev/null; then
    echo "❌ Você não está logado no Azure. Execute 'az login' primeiro."
    exit 1
fi

SUBSCRIPTION_ID=$(az account show --query id --output tsv)
echo "✅ Logado na subscription: $SUBSCRIPTION_ID"

# Registrar providers necessários
echo "📦 Registrando providers necessários..."
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
az provider register --namespace Microsoft.ContainerRegistry --wait

# Instalar extensão do Container Apps
echo "🔧 Instalando extensão do Container Apps..."
az extension add --name containerapp --upgrade

# Criar Resource Group
echo "🏗️  Criando Resource Group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Criar Container Registry
echo "🐳 Criando Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Obter credenciais do ACR
echo "🔑 Obtendo credenciais do ACR..."
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

# Criar Log Analytics Workspace
echo "📊 Criando Log Analytics Workspace..."
az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $LOG_ANALYTICS_WORKSPACE \
  --location $LOCATION

# Obter ID do workspace
LOG_ANALYTICS_ID=$(az monitor log-analytics workspace show \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $LOG_ANALYTICS_WORKSPACE \
  --query customerId \
  --output tsv)

LOG_ANALYTICS_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $LOG_ANALYTICS_WORKSPACE \
  --query primarySharedKey \
  --output tsv)

# Criar Container App Environment
echo "🌍 Criando Container App Environment..."
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --logs-workspace-id $LOG_ANALYTICS_ID \
  --logs-workspace-key $LOG_ANALYTICS_KEY

# Criar Service Principal para GitHub Actions
echo "🔐 Criando Service Principal para automação..."
SP_NAME="sp-fasttech-github-actions"
SP_JSON=$(az ad sp create-for-rbac \
  --name $SP_NAME \
  --role Contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth)

echo ""
echo "✅ Infraestrutura criada com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "========================================"
echo "Resource Group: $RESOURCE_GROUP"
echo "Container Registry: $ACR_NAME.azurecr.io"
echo "Container App Environment: $CONTAINER_APP_ENV"
echo "Log Analytics Workspace: $LOG_ANALYTICS_WORKSPACE"
echo ""
echo "🔑 Credenciais para GitHub Actions:"
echo "========================================"
echo "AZURE_CREDENTIALS (GitHub Secret):"
echo "$SP_JSON"
echo ""
echo "ACR_USERNAME (GitHub Secret):"
echo "$ACR_USERNAME"
echo ""
echo "ACR_PASSWORD (GitHub Secret):"
echo "$ACR_PASSWORD"
echo ""
echo "⚠️  IMPORTANTE: Salve essas informações em local seguro!"
echo "⚠️  Configure os secrets no GitHub: Settings > Secrets and variables > Actions"
echo ""
echo "🚀 Próximos passos:"
echo "1. Configure os secrets no GitHub/Azure DevOps"
echo "2. Configure as variáveis de ambiente das APIs"
echo "3. Execute o pipeline para deploy da aplicação"
