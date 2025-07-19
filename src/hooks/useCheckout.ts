import { useState } from 'react';
import { CreateOrderDto, CreateOrderItemDto, CartItem, DeliveryMethod } from '@/types';
import { config } from '@/lib/config';
import { getAuthHeaders } from '@/lib/auth';

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

      const response = await fetch(`${config.orderApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: JSON.stringify(createOrderDto)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro ao criar pedido: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      const orderId = result.id || result.orderId || Date.now().toString();
      
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
