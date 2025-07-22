
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuth } from '@/hooks/useAuthContext';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderProgress from '@/components/OrderProgress';
import CancelOrderModal from '@/components/CancelOrderModal';
import useOrdersApi from '@/hooks/useOrdersApi';
import useCancelOrder from '@/hooks/useCancelOrder';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Clock, Car, Store, ArrowLeft, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const Orders = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  
  // Buscar pedidos da API
  const { orders, loading, error, refetch } = useOrdersApi({ 
    customerId: user?.id 
  });

  // Hook para cancelar pedidos
  const { cancelOrder, isLoading: isCancelling } = useCancelOrder();

  // Funções para controlar o modal de cancelamento
  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!user?.id || !selectedOrderId) return;
    
    const success = await cancelOrder(selectedOrderId, reason, user.id);
    if (success) {
      setCancelModalOpen(false);
      setSelectedOrderId('');
      // Recarregar os pedidos
      refetch();
    }
  };

  const handleCancelModalClose = () => {
    setCancelModalOpen(false);
    setSelectedOrderId('');
  };

  // Verificar se o pedido pode ser cancelado
  const canCancelOrder = (status: string): boolean => {
    const mappedStatus = mapStatus(status);
    return mappedStatus === 'pending' || mappedStatus === 'accepted';
  };

  // Mapear status da API para os status do componente
  const mapStatus = (apiStatus: string): 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled' => {
    const statusMap: Record<string, 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'> = {
      'received': 'pending',
      'accepted': 'accepted',
      'preparing': 'preparing',
      'ready': 'ready',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[apiStatus] || 'pending';
  };

  // Mapear delivery method da API
  const mapDeliveryMethod = (apiMethod: string): 'balcao' | 'drive-thru' | 'delivery' => {
    const methodMap: Record<string, 'balcao' | 'drive-thru' | 'delivery'> = {
      'balcao': 'balcao',
      'drive-thru': 'drive-thru',
      'delivery': 'delivery'
    };
    return methodMap[apiMethod] || 'balcao';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você precisa estar logado para ver seus pedidos.</p>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
            </div>
            <div className="gradient-primary text-white px-4 py-2 rounded-lg font-bold text-lg">
              FastTech Foods
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Acompanhe todos os seus pedidos em tempo real
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-xl text-gray-500">Carregando seus pedidos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <p className="text-xl text-red-500 mb-4">Erro ao carregar pedidos 😔</p>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <p className="text-xl text-gray-500 mb-4">Nenhum pedido encontrado 😔</p>
              <p className="text-gray-400 mb-6">
                Faça seu primeiro pedido para acompanhar aqui!
              </p>
              <Link to="/">
                <Button>Fazer Pedido</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {paginatedOrders.map((order) => {
                const DeliveryIcon = deliveryIcons[mapDeliveryMethod(order.deliveryMethod)];
                
                return (
                  <Card key={order.id} className="animate-fade-in hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Pedido #{order.id}
                          </CardTitle>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(new Date(order.orderDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DeliveryIcon className="h-4 w-4" />
                              <span>{deliveryLabels[mapDeliveryMethod(order.deliveryMethod)]}</span>
                            </div>
                          </div>
                        </div>
                        <OrderStatusBadge status={mapStatus(order.status)} />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <OrderProgress 
                        status={mapStatus(order.status)} 
                        deliveryMethod={mapDeliveryMethod(order.deliveryMethod)}
                      />

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{item.quantity}x {item.name}</span>
                              </div>
                              <span className="font-medium">
                                R$ {(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-lg text-primary">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </div>

                      {canCancelOrder(order.status) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleCancelClick(order.id)}
                          disabled={isCancelling}
                        >
                          {isCancelling && selectedOrderId === order.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelando...
                            </>
                          ) : (
                            'Cancelar Pedido'
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Cancelamento */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        orderId={selectedOrderId}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default Orders;
