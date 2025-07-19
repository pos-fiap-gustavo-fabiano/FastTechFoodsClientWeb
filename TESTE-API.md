# Exemplo de Teste com API Real

## 1. Configuração da API de Autenticação

Certifique-se de que sua API de autenticação está rodando em:
```
http://localhost:5271
```

## 2. Credenciais de Teste

Use as credenciais que você configurou em sua API:

```json
{
  "emailOrCpf": "teste3@gmail.com",
  "password": "sua_senha_aqui"
}
```

Ou com CPF:
```json
{
  "emailOrCpf": "12345678999", 
  "password": "sua_senha_aqui"
}
```

## 3. Resposta Esperada

Quando o login for bem-sucedido, a API deve retornar:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MGQ4YmM5Mi03YjM3LTQyMjMtYmUyOS03NmEyODZjZDhiNzQiLCJlbWFpbCI6InRlc3RlM0BnbWFpbC5jb20iLCJqdGkiOiJhY2IxNjkwZi0yYjE3LTQ0MTgtOTg5Ni05ZTA3MjZkM2MxZjEiLCJuYW1lIjoidGVzdGUiLCJyb2xlcyI6IkVtcGxveWVlIiwiZXhwIjoxNzUyMDM2ODE2LCJpc3MiOiJGYXN0VGVjaEZvb2RzQXV0aCIsImF1ZCI6IkZhc3RUZWNoRm9vZHMifQ.atvmqxv5V6YtOFkNW3Is0StU8VgTpKAhfXE0mECallE",
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

## 4. Verificação no Frontend

1. Acesse: `http://localhost:8082`
2. Clique em "Login"
3. Use suas credenciais reais
4. Verifique no console do navegador:
   - "Login realizado com sucesso via API" 
   - Token salvo no localStorage
5. Teste fazer um pedido (irá usar o token automaticamente)

## 5. Fallback Automático

Se a API não estiver disponível, o sistema automaticamente usará:
- `joao@email.com` / `123456`
- `12345678901` / `123456`

## 6. Debug

Para verificar se a integração está funcionando:

```javascript
// No console do navegador
console.log('Token:', localStorage.getItem('fasttech_token'));
console.log('User:', localStorage.getItem('fasttech_user'));
console.log('Refresh Token:', localStorage.getItem('fasttech_refresh_token'));
```

## 7. Headers de Requisição

Todas as requisições para APIs de pedidos agora incluem:
```
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json
```
