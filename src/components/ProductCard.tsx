
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideIn">
      <div className="aspect-video overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-600">
            {formatPrice(product.price)}
          </span>
          {!product.availability && (
            <span className="text-sm text-red-500 font-medium">Indisponível</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={!product.availability}
          className="w-full gradient-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
