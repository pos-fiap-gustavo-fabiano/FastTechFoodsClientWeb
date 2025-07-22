import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getAuthHeaders } from '@/lib/auth';
import { config } from '@/lib/config';

interface CancelOrderData {
  status: string;
  updatedBy: string;
  cancelReason: string;
}

const useCancelOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const cancelOrder = async (orderId: string, reason: string, userId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const payload: CancelOrderData = {
        status: 'cancelled',
        updatedBy: userId,
        cancelReason: reason
      };

      const response = await fetch(`${config.orderApiBaseUrl}/api/orders/cancel/${orderId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Pedido Cancelado",
        description: `O pedido #${orderId} foi cancelado com sucesso.`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      
      toast({
        title: "Erro ao Cancelar",
        description: error instanceof Error ? error.message : 'Não foi possível cancelar o pedido. Tente novamente.',
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelOrder,
    isLoading
  };
};

export default useCancelOrder;
