import { useState, useEffect } from 'react';
import { promotions, calculateTelegramDiscount } from '@/lib/support';

interface TelegramPromotion {
  isEligible: boolean;
  discount: number;
  code: string;
  hasConfiguredBot: boolean;
  isFirstOrder: boolean;
}

const useTelegramPromotion = (userId?: string) => {
  const [promotion, setPromotion] = useState<TelegramPromotion>({
    isEligible: false,
    discount: 0,
    code: '',
    hasConfiguredBot: false,
    isFirstOrder: true
  });

  useEffect(() => {
    if (!userId) return;

    // Verificar se usuário já configurou o bot
    const hasConfiguredBot = localStorage.getItem(`telegram-bot-configured-${userId}`) === 'true';
    
    // Verificar se é o primeiro pedido
    const hasOrdered = localStorage.getItem(`user-has-ordered-${userId}`) === 'true';
    const isFirstOrder = !hasOrdered;

    // Verificar se já usou a promoção
    const hasUsedPromotion = localStorage.getItem(`telegram-promo-used-${userId}`) === 'true';

    const isEligible = hasConfiguredBot && isFirstOrder && !hasUsedPromotion;

    setPromotion({
      isEligible,
      discount: isEligible ? promotions.telegram.firstOrder.discount : 0,
      code: promotions.telegram.firstOrder.code,
      hasConfiguredBot,
      isFirstOrder
    });
  }, [userId]);

  const markBotAsConfigured = (userId: string) => {
    localStorage.setItem(`telegram-bot-configured-${userId}`, 'true');
    setPromotion(prev => ({ ...prev, hasConfiguredBot: true }));
  };

  const applyDiscount = (orderTotal: number, userId: string) => {
    const discountAmount = calculateTelegramDiscount(orderTotal);
    
    if (discountAmount > 0) {
      // Marcar promoção como usada
      localStorage.setItem(`telegram-promo-used-${userId}`, 'true');
      localStorage.setItem(`user-has-ordered-${userId}`, 'true');
      
      setPromotion(prev => ({ 
        ...prev, 
        isEligible: false, 
        isFirstOrder: false 
      }));
    }
    
    return discountAmount;
  };

  const calculateDiscount = (orderTotal: number): number => {
    if (!promotion.isEligible) return 0;
    return calculateTelegramDiscount(orderTotal);
  };

  return {
    promotion,
    markBotAsConfigured,
    applyDiscount,
    calculateDiscount
  };
};

export default useTelegramPromotion;
