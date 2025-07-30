import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MessageCircle, X, ExternalLink, Bell, Check, Copy, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getTelegramBotUrl, supportConfig, notificationTypes } from '@/lib/support';

interface TelegramNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

const TelegramNotificationModal: React.FC<TelegramNotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  orderId 
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'setup'>('qr');
  const { toast } = useToast();

  if (!isOpen) return null;

  // URL específica para notificações com parâmetro do pedido
  const botUrl = getTelegramBotUrl(orderId ? `order_${orderId}` : 'notifications');
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copiado!",
        description: "O link do bot foi copiado para a área de transferência",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notificações Telegram</h2>
              <p className="text-sm text-gray-500">Receba atualizações do seu pedido</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Smartphone className="w-4 h-4 inline mr-2" />
            Escanear QR
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'setup'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Como Configurar
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'qr' ? (
            // QR Code Tab
            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  📱 Escaneie com seu celular
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use a câmera do seu celular ou app do Telegram para escanear
                </p>
                
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block">
                  <QRCodeSVG
                    value={botUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.open(botUrl, '_blank')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir no Telegram
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(botUrl)}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
              </div>

              {/* Bot Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {supportConfig.telegram.botUsername}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Oficial
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800">
                    Bot oficial do FastTech Foods para notificações de pedidos
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Setup Instructions Tab
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  🔔 Como configurar as notificações
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Abra o bot do Telegram</p>
                      <p className="text-sm text-gray-600">
                        Escaneie o QR Code ou clique no link para abrir o bot
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Inicie a conversa</p>
                      <p className="text-sm text-gray-600">
                        Clique em "Iniciar" ou digite <code>/start</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Configure notificações</p>
                      <p className="text-sm text-gray-600">
                        Siga as instruções do bot para ativar as notificações
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pronto!</p>
                      <p className="text-sm text-gray-600">
                        Você receberá notificações em tempo real dos seus pedidos
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    📬 Tipos de notificações que você receberá:
                  </h4>
                  <div className="space-y-2">
                    {Object.values(notificationTypes).map((type, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">🔒 Privacidade</h4>
                <p className="text-sm text-gray-600">
                  Suas informações são seguras. O bot só enviará notificações sobre 
                  seus pedidos e você pode desativar a qualquer momento.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramNotificationModal;
