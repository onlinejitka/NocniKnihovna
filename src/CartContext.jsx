import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nocni_knihovna_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Načtení uloženého VIP e-mailu z paměti prohlížeče
  const [vipEmail, setVipEmail] = useState(() => {
    return localStorage.getItem('nocni_knihovna_vip_email') || 
           localStorage.getItem('sl_premium_code') || 
           localStorage.getItem('premium_code') || '';
  });

  useEffect(() => {
    localStorage.setItem('nocni_knihovna_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (vipEmail) {
      localStorage.setItem('nocni_knihovna_vip_email', vipEmail.trim().toLowerCase());
    }
  }, [vipEmail]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isVip = Boolean(vipEmail);

  // Výpočet ceny (při VIP automaticky odečte 10 %)
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const finalPrice = isVip ? Math.round(price * 0.9) : price;
    return sum + finalPrice;
  }, 0);

  const totalCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, totalCount, vipEmail, setVipEmail, isVip }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
