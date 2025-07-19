// Tipagem para o objeto ENV do window
declare global {
  interface Window {
    ENV?: {
      [key: string]: string;
    };
  }
}

// Função para acessar variáveis de ambiente em runtime
export const getEnvVar = (key: string): string => {
  // Tentar pegar da configuração runtime primeiro
  const runtimeValue = window.ENV?.[key];
  if (runtimeValue && runtimeValue !== `__${key}__`) {
    return runtimeValue;
  }
  
  // Fallback para variáveis de ambiente do Vite (desenvolvimento)
  return import.meta.env[key] || '';
};

// Objeto com as configurações
export const config = {
  orderApiBaseUrl: getEnvVar('VITE_ORDER_API_BASE_URL'),
  menuApiBaseUrl: getEnvVar('VITE_MENU_API_BASE_URL')
};
