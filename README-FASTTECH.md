# FastTech Order Flow - Frontend

Interface web moderna para sistema de pedidos de delivery do FastTech Foods, construída com React, TypeScript, Vite e Tailwind CSS.

## ✨ Funcionalidades

### 🔐 **Autenticação**
- Login com email ou CPF via API externa (`http://localhost:5271/api/Auth/login`)
- Fallback para usuários mock quando API não está disponível
- Registro de novos usuários
- Gerenciamento de sessão com localStorage

### 🍔 **Catálogo de Produtos**
- Listagem de produtos com busca em tempo real (debounced)
- Filtros por categoria
- Carregamento de dados via APIs externas
- Interface responsiva com cards de produtos

### 🛒 **Carrinho de Compras**
- Adição/remoção de itens
- Persistência no localStorage
- Cálculo automático de totais
- Interface modal intuitiva

### 📦 **Gestão de Pedidos**
- Criação de pedidos via API
- Acompanhamento de status em tempo real
- Histórico completo de pedidos
- Estados: Pendente, Confirmado, Preparando, Saiu para Entrega, Entregue

## 🚀 **APIs Integradas**

### Autenticação API
- **URL**: `http://localhost:5271/api/Auth/login`
- **Payload**: 
  ```json
  {
    "emailOrCpf": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "6363705b99fb4f1a87ec622f4438a6aa",
    "user": {
      "id": "50d8bc92-7b37-4223-be29-76a286cd8b74",
      "email": "teste3@gmail.com",
      "cpf": "12345678999",
      "name": "teste",
      "roles": ["Employee"]
    }
  }
  ```
  
**Headers de Autenticação**:
- Todas as requisições autenticadas incluem: `Authorization: Bearer {token}`
- Token e refresh token são salvos automaticamente no localStorage

### Menu API
- **Base URL**: `http://localhost:5038`
- Endpoints para produtos e categorias

### Orders API  
- **Base URL**: `http://localhost:5043`
- Endpoints para criação e gestão de pedidos

## 🛠️ **Tecnologias**

- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/ui** - Componentes de UI
- **React Query** - Gerenciamento de estado servidor
- **React Router** - Roteamento
- **Sonner** - Notificações toast

## 📋 **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- APIs backend rodando nas portas configuradas

## ⚙️ **Configuração**

### 1. **Variáveis de Ambiente**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure as URLs das APIs:

```env
VITE_ORDER_API_BASE_URL=http://localhost:5043
VITE_MENU_API_BASE_URL=http://localhost:5038  
VITE_AUTH_API_BASE_URL=http://localhost:5271
```

### 2. **Instalação**

```bash
npm install
```

### 3. **Desenvolvimento**

```bash
npm run dev
```

Acesse: `http://localhost:8080`

### 4. **Build de Produção**

```bash
npm run build
```

## 🐳 **Docker**

### Build da Imagem

```bash
docker build -t fasttech-order-flow:latest .
```

### Executar Container

```bash
docker run -d -p 8080:80 \
  -e AUTH_API_BASE_URL="http://localhost:5271" \
  -e ORDER_API_BASE_URL="http://localhost:5043" \
  -e MENU_API_BASE_URL="http://localhost:5038" \
  fasttech-order-flow:latest
```

### Configuração Runtime

O container suporta configuração dinâmica de URLs via variáveis de ambiente:

- `AUTH_API_BASE_URL` ou `VITE_AUTH_API_BASE_URL`
- `ORDER_API_BASE_URL` ou `VITE_ORDER_API_BASE_URL`  
- `MENU_API_BASE_URL` ou `VITE_MENU_API_BASE_URL`

## ☸️ **Kubernetes**

### Deploy

```bash
kubectl apply -f k8s-manifest.yaml
```

### Configuração

Edite o ConfigMap no `k8s-manifest.yaml`:

```yaml
data:
  VITE_ORDER_API_BASE_URL: "https://api.orders.prod.com"
  VITE_MENU_API_BASE_URL: "https://api.menu.prod.com"
  VITE_AUTH_API_BASE_URL: "https://api.auth.prod.com"
```

## 🧪 **Teste de Login**

### Usuários Mock (Fallback)

Quando a API de autenticação não está disponível:

**Email:**
- `joao@email.com` / `123456`
- `maria@email.com` / `123456`

**CPF:**
- `12345678901` / `123456`
- `98765432109` / `123456`

### API Real

Configure a API de autenticação em `http://localhost:5271` e use credenciais válidas.

**Exemplo de teste:**
```
Email/CPF: teste3@gmail.com ou 12345678999
Password: [sua senha]
```

### Tokens de Autenticação

O sistema gerencia automaticamente:
- **JWT Token**: Usado em todas as requisições autenticadas
- **Refresh Token**: Para renovação automática (futuro)
- **Headers**: `Authorization: Bearer {token}` adicionado automaticamente

### Utilitários de Auth

```typescript
import { getAuthToken, getAuthHeaders, isAuthenticated } from '@/lib/auth';

// Verificar se está autenticado
if (isAuthenticated()) {
  // Fazer requisição autenticada
  fetch('/api/data', {
    headers: getAuthHeaders()
  });
}
```

## 📁 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Header.tsx      # Cabeçalho da aplicação
│   ├── LoginModal.tsx  # Modal de login/registro
│   ├── CartModal.tsx   # Modal do carrinho
│   └── ...
├── contexts/           # Contextos React
│   ├── AuthContext.tsx # Gerenciamento de autenticação
│   ├── CartContext.tsx # Gerenciamento do carrinho
│   └── ...
├── hooks/             # Hooks customizados
│   ├── useAuth.ts     # Hook da API de autenticação
│   ├── useProducts.ts # Hook para produtos
│   └── ...
├── lib/               # Utilitários
│   ├── config.ts      # Configuração de ambiente
│   └── utils.ts       # Funções auxiliares
├── pages/             # Páginas da aplicação
│   ├── Index.tsx      # Página principal
│   └── Orders.tsx     # Página de pedidos
└── types/             # Definições TypeScript
    └── index.ts       # Tipos da aplicação
```

## 🔧 **Scripts Disponíveis**

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run lint       # Verificação de código
```

## 🌟 **Características Técnicas**

### **Responsividade**
- Design adaptativo para desktop, tablet e mobile
- Componentes otimizados para diferentes tamanhos de tela

### **Performance**
- Lazy loading de componentes
- Debounce na busca de produtos
- Cache inteligente com React Query
- Bundle otimizado com Vite

### **Confiabilidade**
- Fallback para dados mock quando APIs falham
- Tratamento de erros robusto
- Estados de loading e erro
- Validação de formulários

### **DevOps Ready**
- Configuração Docker multi-stage
- Manifesto Kubernetes incluído
- Variáveis de ambiente dinâmicas
- Health checks configurados
- Build otimizado para produção

## 📝 **Licença**

Este projeto é parte do Hackathon FastTech Foods.
