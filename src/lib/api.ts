import { getAuthHeaders } from '@/lib/auth';

// Tipos para as opções de requisição
interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// Função utilitária para fazer requisições autenticadas
export const apiRequest = async (url: string, options: ApiRequestOptions = {}): Promise<Response> => {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
    ...(requireAuth ? getAuthHeaders() : {}),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  return response;
};

// Funções de conveniência para diferentes métodos HTTP
export const apiGet = (url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
  apiRequest(url, { ...options, method: 'GET' });

export const apiPost = (url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
  apiRequest(url, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined });

export const apiPut = (url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
  apiRequest(url, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined });

export const apiPatch = (url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
  apiRequest(url, { ...options, method: 'PATCH', body: data ? JSON.stringify(data) : undefined });

export const apiDelete = (url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
  apiRequest(url, { ...options, method: 'DELETE' });
