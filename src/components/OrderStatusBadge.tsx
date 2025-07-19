
import React from 'react';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ChefHat, Package, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: Order['status'];
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: {
      label: 'Pendente',
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      animation: 'animate-pulse',
    },
    accepted: {
      label: 'Aceito',
      icon: CheckCircle,
      className: 'bg-blue-100 text-blue-800 border-blue-300',
      animation: '',
    },
    preparing: {
      label: 'Preparando',
      icon: ChefHat,
      className: 'bg-orange-100 text-orange-800 border-orange-300',
      animation: 'animate-bounce',
    },
    ready: {
      label: 'Pronto',
      icon: Package,
      className: 'bg-green-100 text-green-800 border-green-300',
      animation: 'animate-pulse',
    },
    completed: {
      label: 'Finalizado',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-300',
      animation: '',
    },
    cancelled: {
      label: 'Cancelado',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-300',
      animation: '',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${config.animation} ${className} flex items-center space-x-1`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default OrderStatusBadge;
