# Deploy FastTech Foods Frontend para Azure Container Apps
# Script PowerShell para Windows

param(
    [string]$ResourceGroup = "rg-fasttech-foods",
    [string]$AcrName = "fasttechregistry",
    [string]$ContainerAppName = "ca-fasttech-frontend",
    [string]$ImageTag = (Get-Date -Format "yyyyMMddHHmmss")
)

Write-Host "🚀 Iniciando deploy manual..." -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Cyan
Write-Host "Container Registry: $AcrName" -ForegroundColor Cyan
Write-Host "Container App: $ContainerAppName" -ForegroundColor Cyan
Write-Host "Image Tag: $ImageTag" -ForegroundColor Cyan

# Verificar se está logado no Azure
try {
    $account = az account show --output json | ConvertFrom-Json
    Write-Host "✅ Logado na subscription: $($account.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Você não está logado no Azure. Execute 'az login' primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o Docker está rodando
try {
    docker version | Out-Null
    Write-Host "✅ Docker está funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Fazer login no ACR
Write-Host "🔐 Fazendo login no Container Registry..." -ForegroundColor Yellow
az acr login --name $AcrName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha ao fazer login no ACR" -ForegroundColor Red
    exit 1
}

# Build e push da imagem
Write-Host "🐳 Construindo e enviando imagem Docker..." -ForegroundColor Yellow
$imageWithTag = "$AcrName.azurecr.io/fasttech-frontend:$ImageTag"
$imageLatest = "$AcrName.azurecr.io/fasttech-frontend:latest"

docker build -t $imageWithTag .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build da imagem" -ForegroundColor Red
    exit 1
}

docker tag $imageWithTag $imageLatest
docker push $imageWithTag
docker push $imageLatest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha ao enviar imagem" -ForegroundColor Red
    exit 1
}

# Atualizar Container App
Write-Host "📦 Atualizando Container App..." -ForegroundColor Yellow

# Verificar se existe variáveis de ambiente
$viteOrderApi = $env:VITE_ORDER_API_BASE_URL
$viteMenuApi = $env:VITE_MENU_API_BASE_URL
$viteAuthApi = $env:VITE_AUTH_API_BASE_URL

if (-not $viteOrderApi) { $viteOrderApi = "https://api.fasttech.com" }
if (-not $viteMenuApi) { $viteMenuApi = "https://menu.fasttech.com" }
if (-not $viteAuthApi) { $viteAuthApi = "https://auth.fasttech.com" }

az containerapp update `
  --name $ContainerAppName `
  --resource-group $ResourceGroup `
  --image $imageWithTag `
  --set-env-vars `
    "VITE_ORDER_API_BASE_URL=$viteOrderApi" `
    "VITE_MENU_API_BASE_URL=$viteMenuApi" `
    "VITE_AUTH_API_BASE_URL=$viteAuthApi"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha ao atualizar Container App" -ForegroundColor Red
    exit 1
}

# Obter URL da aplicação
Write-Host "🔍 Obtendo URL da aplicação..." -ForegroundColor Yellow
$appUrl = az containerapp show --name $ContainerAppName --resource-group $ResourceGroup --query properties.configuration.ingress.fqdn -o tsv
$fullUrl = "https://$appUrl"

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "🌐 Aplicação disponível em: $fullUrl" -ForegroundColor Cyan

# Health check simples
Write-Host "🔍 Fazendo health check..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

try {
    $response = Invoke-WebRequest -Uri $fullUrl -Method GET -TimeoutSec 30 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passou! Aplicação está funcionando." -ForegroundColor Green
    } else {
        Write-Host "⚠️  Health check retornou status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Health check falhou. Verifique os logs da aplicação." -ForegroundColor Yellow
    Write-Host "💡 Execute: az containerapp logs show --name $ContainerAppName --resource-group $ResourceGroup --follow" -ForegroundColor Cyan
}

Write-Host "`n🎉 Deploy finalizado!" -ForegroundColor Green
Write-Host "📱 Acesse: $fullUrl" -ForegroundColor Cyan
