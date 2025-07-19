import { useState, useEffect } from 'react';
import { config } from '@/lib/config';
import { getAuthHeaders } from '@/lib/auth';

// Tipos para a resposta da API
export interface ApiOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ApiOrderStatusHistory {
  status: string;
  statusDate: string;
  updatedBy: string;
}

export interface ApiOrder {
  id: string;
  customerId: string;
  orderDate: string;
  status: string;
  deliveryMethod: string;
  cancelReason: string | null;
  total: number;
  items: ApiOrderItem[];
  statusHistory: ApiOrderStatusHistory[];
}

interface UseOrdersApiParams {
  customerId?: string;
}

const useOrdersApi = ({ customerId }: UseOrdersApiParams = {}) => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = `${config.orderApiBaseUrl}/api/orders?customerId=${customerId}`;
        const response = await fetch(url, {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
        console.error('Erro ao buscar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  return { orders, loading, error };
};

export default useOrdersApi;
