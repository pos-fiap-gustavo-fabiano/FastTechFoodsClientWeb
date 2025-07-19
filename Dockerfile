# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar apenas package files primeiro para melhor cache
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Instalar bash e curl para o script de entrada e health check
RUN apk add --no-cache bash curl

# Remover arquivos desnecessários do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar script de entrada
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Criar diretório para logs se não existir
RUN mkdir -p /var/log/nginx

# Configurar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Usar script de entrada para configuração runtime
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
