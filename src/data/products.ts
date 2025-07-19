
import { Product } from '@/types';

export const mockProducts: Product[] = [
  // Lanches
  {
    id: '1',
    name: 'Big FastTech',
    description: 'Hambúrguer duplo com queijo, alface, tomate, cebola e molho especial',
    price: 18.90,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'lanche',
    availability: true
  },
  {
    id: '2',
    name: 'Chicken Deluxe',
    description: 'Peito de frango grelhado, queijo, alface, tomate e maionese',
    price: 16.50,
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e9aaff46?w=400&h=300&fit=crop',
    category: 'lanche',
    availability: true
  },
  {
    id: '3',
    name: 'Fish Burger',
    description: 'Filé de peixe empanado, queijo, alface e molho tártaro',
    price: 15.90,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    category: 'lanche',
    availability: true
  },
  {
    id: '4',
    name: 'Veggie Burger',
    description: 'Hambúrguer vegetal, queijo vegano, alface, tomate e molho especial',
    price: 17.50,
    imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop',
    category: 'lanche',
    availability: true
  },
  
  // Bebidas
  {
    id: '5',
    name: 'Coca-Cola 350ml',
    description: 'Refrigerante Coca-Cola gelado',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
    category: 'bebida',
    availability: true
  },
  {
    id: '6',
    name: 'Suco Natural Laranja',
    description: 'Suco de laranja 100% natural',
    price: 6.90,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
    category: 'bebida',
    availability: true
  },
  {
    id: '7',
    name: 'Água Mineral',
    description: 'Água mineral sem gás 500ml',
    price: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
    category: 'bebida',
    availability: true
  },
  {
    id: '8',
    name: 'Milkshake Chocolate',
    description: 'Milkshake cremoso sabor chocolate com chantilly',
    price: 8.90,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    category: 'bebida',
    availability: true
  },

  // Acompanhamentos
  {
    id: '9',
    name: 'Batata Frita Grande',
    description: 'Batatas fritas crocantes e temperadas',
    price: 7.90,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    category: 'acompanhamento',
    availability: true
  },
  {
    id: '10',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados e fritos',
    price: 6.50,
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    category: 'acompanhamento',
    availability: true
  },
  {
    id: '11',
    name: 'Nuggets (8 unidades)',
    description: 'Nuggets de frango crocantes com molho à escolha',
    price: 9.90,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    category: 'acompanhamento',
    availability: true
  },

  // Sobremesas
  {
    id: '12',
    name: 'Torta de Chocolate',
    description: 'Fatia de torta de chocolate com calda e chantilly',
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    category: 'sobremesa',
    availability: true
  },
  {
    id: '13',
    name: 'Sorvete 2 Bolas',
    description: 'Sorvete de baunilha e chocolate com cobertura',
    price: 6.90,
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    category: 'sobremesa',
    availability: true
  },
  {
    id: '14',
    name: 'Cookies & Cream',
    description: 'Sobremesa gelada com biscoito e creme',
    price: 7.50,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    category: 'sobremesa',
    availability: true
  }
];

export const categories = [
  { id: 'lanche', name: 'Lanches', icon: '🍔' },
  { id: 'bebida', name: 'Bebidas', icon: '🥤' },
  { id: 'acompanhamento', name: 'Acompanhamentos', icon: '🍟' },
  { id: 'sobremesa', name: 'Sobremesas', icon: '🍰' }
];
