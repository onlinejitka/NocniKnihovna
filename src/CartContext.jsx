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

  useEffect(() => {
    localStorage.setItem('nocni_knihovna_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Přidat do košíku (u digitálních produktů nedublujeme stejné PDF)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev; // Už v košíku je
      return [...prev, product];
    });
  };

  // Odebrat z košíku
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Vyprázdnit košík (např. po úspěšném nákupu)
  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const totalCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
