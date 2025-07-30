
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import CartModal from '@/components/CartModal';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import FloatingNotificationButton from '@/components/FloatingNotificationButton';
import TelegramNotificationModal from '@/components/TelegramNotificationModal';
import useProducts from '@/hooks/useProducts';
import useDebounce from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuthContext';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFromTelegramConfig, setIsFromTelegramConfig] = useState(false);

  // Hook de autenticação
  const { user } = useAuth();

  // Debounce da busca para evitar muitas chamadas à API
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Buscar produtos da API com filtros
  const { products, loading, error } = useProducts({
    categoryId: selectedCategory,
    search: debouncedSearchTerm
  });

  // Abrir modal do Telegram automaticamente após login se veio da configuração
  useEffect(() => {
    if (user && isFromTelegramConfig && !isLoginOpen) {
      setIsNotificationOpen(true);
      setIsFromTelegramConfig(false);
    }
  }, [user, isFromTelegramConfig, isLoginOpen]);

  const handleLoginRequired = () => {
    setIsCartOpen(false);
    setIsLoginOpen(true);
  };

  // Função para verificar login antes de configurar Telegram
  const handleTelegramConfig = () => {
    if (!user) {
      // Se não estiver logado, abre o modal de login com mensagem específica
      setIsFromTelegramConfig(true);
      setIsLoginOpen(true);
    } else {
      // Se estiver logado, abre o modal de configuração do Telegram
      setIsNotificationOpen(true);
    }
  };

  // Função para fechar modal de login e resetar flag
  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setIsFromTelegramConfig(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        onNotificationClick={() => setIsNotificationOpen(true)}
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
      <main id="cardapio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Telegram Promotion Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mx-4 rounded-2xl mb-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Oferta Especial Telegram! 🎉</h2>
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold inline-block mt-2">
                15% OFF na primeira compra
              </div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Configure nosso bot do Telegram e ganhe <strong>15% de desconto</strong> no seu primeiro pedido!
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-semibold">Configurar Bot</div>
              <div className="opacity-80">Escaneie o QR Code</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🍔</div>
              <div className="font-semibold">Faça o Pedido</div>
              <div className="opacity-80">Escolha seus favoritos</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold">Ganhe Desconto</div>
              <div className="opacity-80">15% OFF automático</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTelegramConfig}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
            >
              📱 Configurar Agora
            </button>
            <button
              onClick={() => {
                document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              🍔 Ver Cardápio
            </button>
          </div>
          
          <p className="text-xs opacity-70 mt-4">
            * Oferta válida apenas para novos usuários do bot. Desconto aplicado automaticamente no checkout.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Logo e Descrição */}
            <div>
              <div className="gradient-primary text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
                FastTech Foods
              </div>
              <p className="text-gray-400">
                Sabor em alta velocidade! 🚀
              </p>
            </div>

            {/* Links Úteis */}
            <div>
              <h3 className="font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/orders" className="hover:text-white transition-colors">Meus Pedidos</a></li>
                <li><a href="#cardapio" className="hover:text-white transition-colors">Cardápio</a></li>
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
              </ul>
            </div>

            {/* Notificações */}
            <div>
              <h3 className="font-semibold mb-4">🔔 Notificações</h3>
              <div className="space-y-2 text-gray-400">
                <button 
                  onClick={handleTelegramConfig}
                  className="hover:text-white transition-colors flex items-center gap-2 text-left"
                >
                  📱 Bot do Telegram
                </button>
                <p className="text-sm">
                  Receba atualizações dos seus pedidos em tempo real
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 FastTech Foods. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        customMessage={isFromTelegramConfig ? "Para configurar as notificações do Telegram, você precisa fazer login primeiro." : undefined}
      />
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onLoginRequired={handleLoginRequired}
      />

      <TelegramNotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Floating Notification Button */}
      <FloatingNotificationButton />
    </div>
  );
};

export default Index;
