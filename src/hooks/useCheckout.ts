import { useState } from 'react';
import { CreateOrderDto, CreateOrderItemDto, CartItem, DeliveryMethod } from '@/types';
import { config } from '@/lib/config';
import { apiPostData } from '@/lib/api';

interface UseCheckoutParams {
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const useCheckout = ({ onSuccess, onError }: UseCheckoutParams = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    customerId: string,
    items: CartItem[],
    deliveryMethod: DeliveryMethod
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Converter CartItem para CreateOrderItemDto
      const orderItems: CreateOrderItemDto[] = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price
      }));

      // Criar DTO para envio
      const createOrderDto: CreateOrderDto = {
        customerId,
        deliveryMethod,
        items: orderItems
      };

      console.log('Criando pedido com os seguintes dados:', createOrderDto);

      // Usar nossa função de API que trata erros de JSON automaticamente
      const result = await apiPostData(`${config.orderApiBaseUrl}/api/orders`, createOrderDto);
      
      // Extrair o ID do pedido da resposta
      const resultData = result as Record<string, unknown>;
      const orderId = String(resultData?.id || resultData?.orderId || Date.now());
      
      onSuccess?.(orderId);
      return orderId;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar pedido';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Erro ao criar pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

export default useCheckout;
