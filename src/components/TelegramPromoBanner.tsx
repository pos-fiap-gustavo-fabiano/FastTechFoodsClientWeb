import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TelegramPromoBannerProps {
  onConfigureTelegram: () => void;
}

const TelegramPromoBanner: React.FC<TelegramPromoBannerProps> = ({ onConfigureTelegram }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Mostrar banner após 3 segundos na página
    const timer = setTimeout(() => {
      // Verificar se o usuário já viu este banner
      const hasSeenBanner = localStorage.getItem('telegram-promo-banner-seen');
      if (!hasSeenBanner) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Marcar como visto por 24 horas
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      localStorage.setItem('telegram-promo-banner-seen', tomorrow.getTime().toString());
    }, 300);
  };

  const handleConfigure = () => {
    onConfigureTelegram();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-300 ${
      isClosing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    }`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2 animate-pulse">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">🎉 Oferta Especial!</span>
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                    15% OFF
                  </span>
                </div>
                <p className="text-sm opacity-90">
                  Configure o bot do Telegram e ganhe desconto na primeira compra!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={handleConfigure}
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium"
              >
                Configurar Agora
              </Button>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Fechar banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramPromoBanner;
