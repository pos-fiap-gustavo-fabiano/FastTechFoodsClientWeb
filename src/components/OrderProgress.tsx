
import React from 'react';
import { Order } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, ChefHat, Package, Truck } from 'lucide-react';

interface OrderProgressProps {
  status: Order['status'];
  deliveryMethod: Order['deliveryMethod'];
}

const OrderProgress: React.FC<OrderProgressProps> = ({ status, deliveryMethod }) => {
  const steps = [
    { key: 'pending', label: 'Pedido Recebido', icon: Clock },
    { key: 'accepted', label: 'Confirmado', icon: CheckCircle },
    { key: 'preparing', label: 'Preparando', icon: ChefHat },
    { key: 'ready', label: deliveryMethod === 'delivery' ? 'Saiu para Entrega' : 'Pronto', icon: deliveryMethod === 'delivery' ? Truck : Package },
    { key: 'completed', label: 'Finalizado', icon: CheckCircle },
  ];

  const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'completed'];
  const currentIndex = statusOrder.indexOf(status);
  const progress = ((currentIndex + 1) / statusOrder.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Progresso do Pedido</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex flex-col items-center space-y-1">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isActive 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                  ${isCurrent && status === 'preparing' ? 'animate-pulse' : ''}
                `}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-xs text-center max-w-16 ${isActive ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
