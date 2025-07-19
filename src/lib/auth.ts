// Utilitários para gerenciamento de autenticação
export const getAuthToken = (): string | null => {
  return localStorage.getItem('fasttech_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('fasttech_refresh_token');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
