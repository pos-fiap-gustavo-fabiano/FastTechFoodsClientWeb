
import React, { useState } from 'react';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import CartModal from '@/components/CartModal';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import useProducts from '@/hooks/useProducts';
import useDebounce from '@/hooks/useDebounce';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce da busca para evitar muitas chamadas à API
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Buscar produtos da API com filtros
  const { products, loading, error } = useProducts({
    categoryId: selectedCategory,
    search: debouncedSearchTerm
  });

  const handleLoginRequired = () => {
    setIsCartOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* Hero Section */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            FastTech Foods
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Sabor em alta velocidade! 🚀
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-lg font-medium">
              Peça agora e receba em minutos
            </p>
            <p className="opacity-75">
              Delivery • Drive-Thru • Balcão
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Nosso Cardápio
          </h2>
          
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-500">
              Erro ao carregar produtos 😔
            </p>
            <p className="text-gray-400 mt-2">
              {error}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              Nenhum produto encontrado 😔
            </p>
            <p className="text-gray-400 mt-2">
              Tente ajustar os filtros ou busca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-primary text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
            FastTech Foods
          </div>
          <p className="text-gray-400">
            © 2024 FastTech Foods. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 mt-2">
            Sabor em alta velocidade! 🚀
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onLoginRequired={handleLoginRequired}
      />
    </div>
  );
};

export default Index;
