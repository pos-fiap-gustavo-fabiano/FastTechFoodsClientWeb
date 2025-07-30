import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, AlertCircle, MessageCircle, Unlink } from 'lucide-react';
import { useTelegramIntegration } from '../hooks/useTelegramIntegration';

interface TelegramConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TelegramConfigModal: React.FC<TelegramConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<'status' | 'request' | 'verify'>('status');
  const [inputCode, setInputCode] = useState('');
  const [isLinked, setIsLinked] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const {
    requestVerificationCode,
    linkTelegramAccount,
    checkIntegrationStatus,
    unlinkTelegramAccount,
    isLoading,
    error
  } = useTelegramIntegration();

  // Verificar status ao abrir o modal
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkIntegrationStatus();
      if (status) {
        setIsLinked(status.isLinked);
        setChatId(status.chatId || null);
        setStep(status.isLinked ? 'status' : 'request');
      }
    };

    if (isOpen) {
      checkStatus();
    }
  }, [isOpen, checkIntegrationStatus]);

  const handleCheckStatus = async () => {
    const status = await checkIntegrationStatus();
    if (status) {
      setIsLinked(status.isLinked);
      setChatId(status.chatId || null);
      setStep(status.isLinked ? 'status' : 'request');
    }
  };

  const handleRequestCode = async () => {
    const success = await requestVerificationCode();
    if (success) {
      setStep('verify');
    }
  };

  const handleVerifyCode = async () => {
    if (!inputCode.trim()) {
      return;
    }

    const success = await linkTelegramAccount(inputCode.trim());
    if (success) {
      setIsLinked(true);
      setStep('status');
      setInputCode('');
      // Recarregar status para obter o chat_id
      await handleCheckStatus();
    }
  };

  const handleUnlink = async () => {
    const success = await unlinkTelegramAccount();
    if (success) {
      setIsLinked(false);
      setChatId(null);
      setStep('request');
    }
  };

  const handleClose = () => {
    setInputCode('');
    setStep('status');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Configurar Notificações Telegram
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status da Integração */}
          {step === 'status' && isLinked && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Sua conta está vinculada ao Telegram! Você receberá notificações dos seus pedidos.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Status da Vinculação</p>
                  <p className="text-sm text-green-600">Ativo</p>
                  {chatId && (
                    <p className="text-xs text-green-500 font-mono">Chat ID: {chatId}</p>
                  )}
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Vinculado
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleUnlink}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Desvincular
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          )}

          {/* Solicitar Código */}
          {step === 'request' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Para receber notificações via Telegram, você precisa vincular sua conta.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Clique em "Solicitar Código" abaixo</li>
                    <li>Acesse nosso bot no Telegram: <strong>@FastTechFoodsBot</strong></li>
                    <li>Você receberá um código de verificação</li>
                    <li>Digite o código aqui para vincular sua conta</li>
                  </ol>
                </div>

                <Button 
                  onClick={handleRequestCode}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Solicitando código...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Solicitar Código de Verificação
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Verificar Código */}
          {step === 'verify' && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Código solicitado! Verifique o bot do Telegram e digite o código recebido abaixo.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="verificationCode">Código de Verificação</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Digite o código recebido no Telegram"
                    maxLength={10}
                    className="font-mono text-center text-lg tracking-widest"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('request')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleVerifyCode}
                    disabled={isLoading || !inputCode.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar Código'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramConfigModal;
