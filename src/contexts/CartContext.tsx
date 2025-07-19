
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, DeliveryMethod } from '@/types';
import { useOrders } from './OrderContext';
import { useAuth } from '@/hooks/useAuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number, observations?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (deliveryMethod: DeliveryMethod, address?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const addItem = (product: Product, quantity = 1, observations?: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, observations: observations || item.observations }
            : item
        );
      }
      
      return [...prev, { product, quantity, observations }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkout = (deliveryMethod: DeliveryMethod, address?: string) => {
    if (!user || items.length === 0) return;

    addOrder({
      userId: user.id,
      items: [...items],
      total,
      deliveryMethod,
      status: 'pending',
      address,
    });

    clearCart();
  };

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
