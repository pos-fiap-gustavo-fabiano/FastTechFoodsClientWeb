
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import useCheckout from '@/hooks/useCheckout';
import { DeliveryMethod } from '@/types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRequired: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onLoginRequired }) => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('balcao');
  const [observations, setObservations] = useState('');

  const { createOrder, loading: checkoutLoading } = useCheckout({
    onSuccess: (orderId) => {
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido #${orderId.slice(-4)} foi enviado. Total: ${formatPrice(finalTotal)}`,
      });
      clearCart();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao processar pedido",
        description: error,
        variant: "destructive"
      });
    }
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const deliveryOptions = [
    { value: 'balcao' as DeliveryMethod, label: 'Retirar no Balcão', description: 'Grátis' },
    { value: 'drive-thru' as DeliveryMethod, label: 'Drive-Thru', description: 'Grátis' },
    { value: 'delivery' as DeliveryMethod, label: 'Delivery', description: 'Taxa: R$ 3,00' },
  ];

  const deliveryFee = deliveryMethod === 'delivery' ? 3.00 : 0;
  const finalTotal = total + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createOrder(user.id, items, deliveryMethod);
    } catch (error) {
      // Erro já tratado no hook
      console.error('Erro no checkout:', error);
    }
  };

  if (items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span>Seu Carrinho</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Carrinho vazio</h3>
            <p className="text-gray-500">Adicione alguns produtos deliciosos!</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span>Seu Carrinho</span>
            </div>
            <Badge variant="secondary">{items.length} itens</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cart Items */}
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Separator />

          {/* Delivery Method */}
          <div>
            <h3 className="font-medium mb-3">Método de Entrega</h3>
            <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}>
              {deliveryOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observations" className="font-medium">
              Observações (opcional)
            </Label>
            <Textarea
              id="observations"
              placeholder="Alguma observação especial para seu pedido..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(total)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Taxa de entrega:</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-red-600">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button 
            onClick={handleCheckout}
            disabled={checkoutLoading || !user || items.length === 0}
            className="w-full gradient-primary text-lg py-6"
          >
            {checkoutLoading ? 'Processando...' : user ? 'Finalizar Pedido' : 'Faça login para continuar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
