import React, { useState } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import TelegramConfigModal from './TelegramConfigModal';
import { useAuth } from '../hooks/useAuthContext';

const FloatingNotificationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  // Só mostra o botão se o usuário estiver logado
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group relative"
        >
          <div className="relative">
            <Bell className="w-6 h-6" />
            {/* Pulse animation ring */}
            <div className="absolute -inset-1 bg-blue-400 rounded-full animate-ping opacity-30"></div>
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
        </button>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transform transition-all duration-200 animate-fade-in">
            Receber notificações do pedido 📱
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Modal */}
      <TelegramConfigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FloatingNotificationButton;
