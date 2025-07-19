# Azure Container Apps Infrastructure

Este diretório contém os scripts e templates para configurar a infraestrutura necessária no Azure.

## Pré-requisitos

1. Azure CLI instalado
2. Subscription ativa do Azure
3. Permissões de Contributor na subscription

## Setup da Infraestrutura

Execute o script `setup-infrastructure.sh` para criar todos os recursos necessários:

```bash
chmod +x infrastructure/setup-infrastructure.sh
./infrastructure/setup-infrastructure.sh
```

## Recursos Criados

- **Resource Group**: rg-fasttech-foods
- **Container Registry**: fasttechregistry
- **Container App Environment**: cae-fasttech-foods
- **Log Analytics Workspace**: law-fasttech-foods

## Variáveis de Ambiente

Configure as seguintes variáveis no seu pipeline:

### GitHub Actions Secrets
- `AZURE_CREDENTIALS`: Service Principal credentials
- `ACR_USERNAME`: Container Registry username
- `ACR_PASSWORD`: Container Registry password
- `VITE_ORDER_API_BASE_URL`: URL da API de pedidos
- `VITE_MENU_API_BASE_URL`: URL da API de menu
- `VITE_AUTH_API_BASE_URL`: URL da API de autenticação

### Azure DevOps Variables
- `VITE_ORDER_API_BASE_URL`: URL da API de pedidos
- `VITE_MENU_API_BASE_URL`: URL da API de menu
- `VITE_AUTH_API_BASE_URL`: URL da API de autenticação

## Service Connections (Azure DevOps)

Crie as seguintes service connections:
1. `fasttech-service-connection`: Azure Resource Manager
2. `fasttech-acr-connection`: Docker Registry
