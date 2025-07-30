// Configurações de suporte e contato
export const supportConfig = {
  telegram: {
    botUrl: 'https://t.me/FastechFoodsBot', // Substitua pelo seu bot real
    botUsername: '@FastechFoodsBot',
    groupUrl: 'https://t.me/+ABC123DEF456', // Substitua pelo seu grupo
    deepLinkStart: 'https://t.me/FastechFoodsBot?start=notifications'
  },
  whatsapp: {
    number: '5511999999999',
    message: 'Olá! Gostaria de receber notificações dos meus pedidos FastTech Foods'
  },
  email: 'suporte@fasttechfoods.com',
  phone: '+55 (11) 99999-9999',
  website: 'https://fasttechfoods.com'
};

// URLs de acesso direto
export const getTelegramBotUrl = (startParam?: string) => {
  const baseUrl = supportConfig.telegram.botUrl;
  return startParam ? `${baseUrl}?start=${startParam}` : baseUrl;
};

export const getWhatsAppUrl = (customMessage?: string) => {
  const message = customMessage || supportConfig.whatsapp.message;
  return `https://wa.me/${supportConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
};

// Tipos de notificações disponíveis
export const notificationTypes = {
  ORDER_RECEIVED: 'Pedido recebido',
  ORDER_ACCEPTED: 'Pedido aceito',
  ORDER_PREPARING: 'Pedido em preparo',
  ORDER_READY: 'Pedido pronto',
  ORDER_OUT_FOR_DELIVERY: 'Pedido saiu para entrega',
  ORDER_DELIVERED: 'Pedido entregue',
  ORDER_CANCELLED: 'Pedido cancelado',
  PROMOTION: 'Promoções especiais'
} as const;

// Configurações de promoções
export const promotions = {
  telegram: {
    firstOrder: {
      discount: 15,
      code: 'TELEGRAM15',
      description: 'Desconto de 15% na primeira compra para usuários que configurarem o bot',
      terms: 'Válido apenas para novos usuários do bot. Desconto aplicado automaticamente.',
      minOrder: 20.00,
      maxDiscount: 50.00
    }
  }
};

// Verificar se usuário é elegível para promoção
export const isEligibleForTelegramPromotion = (isNewUser: boolean, hasTelegramBot: boolean): boolean => {
  return isNewUser && hasTelegramBot;
};

// Calcular desconto da promoção
export const calculateTelegramDiscount = (orderTotal: number): number => {
  if (orderTotal < promotions.telegram.firstOrder.minOrder) {
    return 0;
  }
  
  const discount = (orderTotal * promotions.telegram.firstOrder.discount) / 100;
  return Math.min(discount, promotions.telegram.firstOrder.maxDiscount);
};
