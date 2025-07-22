import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/types';
import { useNotifications } from './NotificationContext';
import { useAuth } from '@/hooks/useAuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Initialize with example orders when user logs in
  const initializeExampleOrders = (userId: string) => {
    const now = new Date();
    const exampleOrders: Order[] = [
      {
        id: 'order-001',
        userId,
        items: [
          {
            product: {
              id: '1',
              name: 'Big Burger Clássico',
              description: 'Hambúrguer bovino, queijo, alface, tomate',
              price: 22.90,
              imageUrl: '/placeholder.svg',
              category: 'lanche',
              availability: true
            },
            quantity: 2,
            observations: 'Sem cebola'
          },
          {
            product: {
              id: '9',
              name: 'Coca-Cola 350ml',
              description: 'Refrigerante gelado',
              price: 4.50,
              imageUrl: '/placeholder.svg',
              category: 'bebida',
              availability: true
            },
            quantity: 1
          }
        ],
        total: 50.30,
        deliveryMethod: 'delivery',
        status: 'completed',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
      },
      {
        id: 'order-002',
        userId,
        items: [
          {
            product: {
              id: '4',
              name: 'Chicken Crispy',
              description: 'Frango empanado crocante com maionese especial',
              price: 19.90,
              imageUrl: '/placeholder.svg',
              category: 'lanche',
              availability: true
            },
            quantity: 1
          },
          {
            product: {
              id: '13',
              name: 'Batata Frita Grande',
              description: 'Porção grande de batatas fritas temperadas',
              price: 12.90,
              imageUrl: '/placeholder.svg',
              category: 'acompanhamento',
              availability: true
            },
            quantity: 1
          }
        ],
        total: 32.80,
        deliveryMethod: 'balcao',
        status: 'preparing',
        createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutos atrás
      },
      {
        id: 'order-003',
        userId,
        items: [
          {
            product: {
              id: '7',
              name: 'Açaí na Tigela',
              description: 'Açaí cremoso com granola e banana',
              price: 15.90,
              imageUrl: '/placeholder.svg',
              category: 'sobremesa',
              availability: true
            },
            quantity: 1,
            observations: 'Extra granola'
          }
        ],
        total: 15.90,
        deliveryMethod: 'drive-thru',
        status: 'ready',
        createdAt: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutos atrás
      },
      {
        id: 'order-004',
        userId,
        items: [
          {
            product: {
              id: '2',
              name: 'Mega Bacon',
              description: 'Duplo bacon, queijo cheddar e molho barbecue',
              price: 26.90,
              imageUrl: '/placeholder.svg',
              category: 'lanche',
              availability: true
            },
            quantity: 1
          }
        ],
        total: 26.90,
        deliveryMethod: 'delivery',
        status: 'accepted',
        createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutos atrás
      },
      {
        id: 'order-005',
        userId,
        items: [
          {
            product: {
              id: '3',
              name: 'Veggie Deluxe',
              description: 'Hambúrguer vegetariano com queijo e vegetais',
              price: 24.90,
              imageUrl: '/placeholder.svg',
              category: 'lanche',
              availability: true
            },
            quantity: 1
          },
          {
            product: {
              id: '11',
              name: 'Suco de Laranja Natural',
              description: 'Suco de laranja 100% natural',
              price: 7.90,
              imageUrl: '/placeholder.svg',
              category: 'bebida',
              availability: true
            },
            quantity: 1
          }
        ],
        total: 32.80,
        deliveryMethod: 'balcao',
        status: 'cancelled',
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hora atrás
      }
    ];

    setOrders(exampleOrders);
  };

  // Initialize example orders when user changes
  React.useEffect(() => {
    if (user && orders.length === 0) {
      initializeExampleOrders(user.id);
    } else if (!user) {
      setOrders([]);
    }
  }, [user]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setOrders(prev => [newOrder, ...prev]);
    
    addNotification({
      orderId: newOrder.id,
      message: `Pedido #${newOrder.id.slice(-4)} foi criado com sucesso!`,
      type: 'success',
      read: false,
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    const statusMessages = {
      pending: 'Pedido recebido e aguardando confirmação',
      accepted: 'Pedido foi aceito pela loja',
      preparing: 'Pedido está sendo preparado',
      ready: 'Pedido está pronto para retirada/entrega',
      completed: 'Pedido foi finalizado',
      cancelled: 'Pedido foi cancelado',
    };

    addNotification({
      orderId,
      message: `Pedido #${orderId.slice(-4)}: ${statusMessages[status]}`,
      type: status === 'cancelled' ? 'error' : status === 'completed' ? 'success' : 'info',
      read: false,
    });
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  // Simulate order status updates for demo
  useEffect(() => {
    if (orders.length === 0) return;

    const interval = setInterval(() => {
      const pendingOrders = orders.filter(order => 
        order.status === 'pending' || order.status === 'accepted' || order.status === 'preparing'
      );

      if (pendingOrders.length > 0) {
        const randomOrder = pendingOrders[Math.floor(Math.random() * pendingOrders.length)];
        const nextStatus = {
          pending: 'accepted',
          accepted: 'preparing',
          preparing: 'ready',
          ready: 'completed',
        }[randomOrder.status] as Order['status'];

        if (nextStatus) {
          updateOrderStatus(randomOrder.id, nextStatus);
        }
      }
    }, 1000000); 
    return () => clearInterval(interval);
  }, [orders]);

  const userOrders = orders.filter(order => order.userId === user?.id);

  return (
    <OrderContext.Provider value={{
      orders: userOrders,
      addOrder,
      updateOrderStatus,
      getOrderById,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
