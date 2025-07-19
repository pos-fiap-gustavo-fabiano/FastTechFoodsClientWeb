export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'lanche' | 'sobremesa' | 'bebida' | 'acompanhamento';
  availability: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  observations?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  deliveryMethod: 'balcao' | 'drive-thru' | 'delivery';
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  address?: string;
}

export interface Notification {
  id: string;
  orderId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export type DeliveryMethod = 'balcao' | 'drive-thru' | 'delivery';

// DTOs para integração com API
export interface CreateOrderDto {
  customerId: string;
  deliveryMethod: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}
