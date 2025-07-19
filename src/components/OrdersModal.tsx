
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/hooks/useAuthContext';
import OrderStatusBadge from './OrderStatusBadge';
import OrderProgress from './OrderProgress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Clock, Car, Store } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useOrders();
  const { user } = useAuth();

  if (!user) return null;

  const deliveryIcons = {
    balcao: Store,
    'drive-thru': Car,
    delivery: MapPin,
  };

  const deliveryLabels = {
    balcao: 'Retirar no Balcão',
    'drive-thru': 'Drive-Thru',
    delivery: 'Delivery',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meus Pedidos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Nenhum pedido encontrado 😔</p>
              <p className="text-gray-400 mt-2">
                Faça seu primeiro pedido para acompanhar aqui!
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const DeliveryIcon = deliveryIcons[order.deliveryMethod];
              
              return (
                <Card key={order.id} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Pedido #{order.id.slice(-6).toUpperCase()}
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(order.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DeliveryIcon className="h-4 w-4" />
                            <span>{deliveryLabels[order.deliveryMethod]}</span>
                          </div>
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <OrderProgress 
                      status={order.status} 
                      deliveryMethod={order.deliveryMethod}
                    />

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-medium">{item.quantity}x {item.product.name}</span>
                              {item.observations && (
                                <p className="text-gray-500 text-xs">Obs: {item.observations}</p>
                              )}
                            </div>
                            <span className="font-medium">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span className="text-lg text-primary">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>

                    {order.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          // Simulate order cancellation
                          console.log('Cancelar pedido:', order.id);
                        }}
                      >
                        Cancelar Pedido
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersModal;
