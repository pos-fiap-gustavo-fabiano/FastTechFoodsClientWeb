import { useState } from 'react';
import { getEnvVar } from '@/lib/config';

interface LoginRequest {
  emailOrCpf: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    cpf: string;
    name: string;
    roles: string[];
  };
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const useAuthApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (emailOrCpf: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const authApiUrl = getEnvVar('VITE_AUTH_API_BASE_URL') || 'http://localhost:5271';
      const response = await fetch(`${authApiUrl}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrCpf,
          password,
        } as LoginRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro de autenticação' }));
        throw new ApiError(errorData.message || `Erro ${response.status}`, response.status);
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
