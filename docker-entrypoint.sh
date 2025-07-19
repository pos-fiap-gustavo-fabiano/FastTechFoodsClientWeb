#!/bin/sh

# Script para substituir placeholders por variáveis de ambiente em runtime
# Usado no container Docker/Kubernetes

echo "Configurando variáveis de ambiente..."

# Usar variáveis de ambiente fornecidas no runtime (sem prefixo VITE_)
# Se não foram fornecidas, usar as variáveis com prefixo VITE_ como fallback
ORDER_API_URL="${ORDER_API_BASE_URL:-${VITE_ORDER_API_BASE_URL}}"
MENU_API_URL="${MENU_API_BASE_URL:-${VITE_MENU_API_BASE_URL}}"
AUTH_API_URL="${AUTH_API_BASE_URL:-${VITE_AUTH_API_BASE_URL}}"

# Substituir placeholders no config.js
sed -i "s|__VITE_ORDER_API_BASE_URL__|${ORDER_API_URL}|g" /usr/share/nginx/html/config.js
sed -i "s|__VITE_MENU_API_BASE_URL__|${MENU_API_URL}|g" /usr/share/nginx/html/config.js
sed -i "s|__VITE_AUTH_API_BASE_URL__|${AUTH_API_URL}|g" /usr/share/nginx/html/config.js

echo "Configuração concluída:"
echo "ORDER_API_BASE_URL: ${ORDER_API_URL}"
echo "MENU_API_BASE_URL: ${MENU_API_URL}"
echo "AUTH_API_BASE_URL: ${AUTH_API_URL}"

# Executar o comando original (nginx)
exec "$@"
