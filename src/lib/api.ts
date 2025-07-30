import { getAuthHeaders } from '@/lib/auth';

// Tipos para as opções de requisição
interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// Função para tratar respostas da API
const handleApiResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type');
  
  // Se não há content-type ou não é JSON, retornar resposta vazia para sucesso
  if (!contentType || !contentType.includes('application/json')) {
    if (response.ok) {
      return {};
    } else {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // Tentar fazer o parse do JSON
  try {
    const text = await response.text();
    
    // Se a resposta está vazia, retornar objeto vazio para status de sucesso
    if (!text.trim()) {
      if (response.ok) {
        return {};
      } else {
        throw new Error(`Erro HTTP ${response.status}: Resposta vazia`);
      }
    }

    const data = JSON.parse(text);
    
    if (!response.ok) {
      // Se há uma mensagem de erro na resposta, usá-la
      const errorMessage = data.message || data.error || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Erro de parsing JSON
      console.error('Erro ao fazer parse do JSON:', error);
      throw new Error('Resposta inválida do servidor');
    }
    throw error;
  }
};

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

// Funções que fazem requisição E tratam a resposta automaticamente
export const apiRequestWithResponse = async (url: string, options: ApiRequestOptions = {}): Promise<unknown> => {
  const response = await apiRequest(url, options);
  return handleApiResponse(response);
};

// Funções de conveniência para diferentes métodos HTTP (retornam a resposta tratada)
export const apiGetData = (url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
  apiRequestWithResponse(url, { ...options, method: 'GET' });

export const apiPostData = (url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
  apiRequestWithResponse(url, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined });

export const apiPutData = (url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
  apiRequestWithResponse(url, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined });

export const apiPatchData = (url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
  apiRequestWithResponse(url, { ...options, method: 'PATCH', body: data ? JSON.stringify(data) : undefined });

export const apiDeleteData = (url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
  apiRequestWithResponse(url, { ...options, method: 'DELETE' });

// Funções originais que retornam apenas a Response (para compatibilidade)
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
