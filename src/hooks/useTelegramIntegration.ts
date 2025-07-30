import { useState } from 'react';
import { getEnvVar } from '@/lib/config';
import { getAuthHeaders } from '@/lib/auth';

interface TelegramIntegrationStatus {
  isLinked: boolean;
  chatId?: string;
}

interface LinkRequest {
  verificationCode: string;
}

interface LinkResponse {
  success: boolean;
  message: string;
  chatId?: string;
}

export const useTelegramIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  // Solicitar código de verificação via Telegram bot
  const requestVerificationCode = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = getEnvVar('VITE_API_URL');
      const response = await fetch(`${apiUrl}/telegram/request-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao solicitar código de verificação');
      }

      const data = await response.json();
      setVerificationCode(data.code);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código e vincular conta
  const linkTelegramAccount = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = getEnvVar('VITE_API_URL');
      const response = await fetch(`${apiUrl}/telegram/link-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ verificationCode: code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Código de verificação inválido');
      }

      const data: LinkResponse = await response.json();
      return data.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar status da integração
  const checkIntegrationStatus = async (): Promise<TelegramIntegrationStatus | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = getEnvVar('VITE_API_URL');
      const response = await fetch(`${apiUrl}/telegram/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao verificar status');
      }

      const data: TelegramIntegrationStatus = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Desvincular conta do Telegram
  const unlinkTelegramAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = getEnvVar('VITE_API_URL');
      const response = await fetch(`${apiUrl}/telegram/unlink-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao desvincular conta');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestVerificationCode,
    linkTelegramAccount,
    checkIntegrationStatus,
    unlinkTelegramAccount,
    isLoading,
    error,
    verificationCode
  };
};
