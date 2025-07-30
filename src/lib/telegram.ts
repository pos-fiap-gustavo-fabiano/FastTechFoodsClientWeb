// Configuração do Bot Telegram
export const TELEGRAM_CONFIG = {
  // Nome do bot (será configurado pelo administrador)
  BOT_USERNAME: '@FastTechFoodsBot',
  
  // Deep link para iniciar conversa com o bot
  BOT_DEEP_LINK: 'https://t.me/FastTechFoodsBot',
  
  // Tempo de expiração do código de verificação (5 minutos)
  VERIFICATION_CODE_EXPIRY: 5 * 60 * 1000,
  
  // Mensagens padrão
  MESSAGES: {
    VERIFICATION_REQUEST: 'Olá! Para vincular seu Telegram ao sistema FastTech Foods, digite este código na plataforma:',
    LINK_SUCCESS: '✅ Sua conta foi vinculada com sucesso! Agora você receberá notificações dos seus pedidos.',
    LINK_ERROR: '❌ Houve um erro ao vincular sua conta. Tente novamente.',
    ORDER_NOTIFICATION: '🍔 Atualização do seu pedido #{orderId}:\n\nStatus: {status}\nData: {date}\n\nObrigado por escolher FastTech Foods!',
    WELCOME: 'Bem-vindo ao FastTech Foods Bot! 🚀\n\nEste bot irá te notificar sobre o status dos seus pedidos.\n\nPara começar, vincule sua conta através da nossa plataforma web.'
  }
};

// Tipos para as notificações
export interface TelegramNotification {
  chatId: string;
  message: string;
  orderId?: string;
  userId: string;
}

// Tipos para a vinculação de conta
export interface AccountLinkData {
  userId: string;
  chatId: string;
  verificationCode: string;
  expiresAt: Date;
  isUsed: boolean;
}

// Status dos pedidos que geram notificações
export const ORDER_STATUS_NOTIFICATIONS = {
  CONFIRMED: '✅ Pedido confirmado',
  PREPARING: '👨‍🍳 Preparando seu pedido',
  READY: '🎉 Pedido pronto para retirada',
  OUT_FOR_DELIVERY: '🚚 Saiu para entrega',
  DELIVERED: '✅ Pedido entregue',
  CANCELLED: '❌ Pedido cancelado'
} as const;
