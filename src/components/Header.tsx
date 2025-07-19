
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, ClipboardList, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  onOrdersClick?: () => void; // Made optional since we're using navigation now
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onLoginClick }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="gradient-primary text-white px-4 py-2 rounded-lg font-bold text-xl hover:opacity-90 transition-opacity">
                FastTech Foods
              </div>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Olá, {user.name.split(' ')[0]}</span>
                </div>

                {/* Notifications */}
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {/* Orders Button */}
                <Button
                  onClick={() => navigate('/orders')}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 hover:bg-primary hover:text-white transition-colors"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Pedidos</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <Button onClick={onLoginClick} variant="outline">
                <User className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            )}

            {/* Cart Button */}
            <Button
              onClick={onCartClick}
              variant="outline"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-subtle">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
