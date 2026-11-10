import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContextBase';

const STORAGE_KEY = 'twirlandflora_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product) return;
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id || item.name === product.name
      );

      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: (next[existingIndex].quantity || 1) + 1,
        };
        return next;
      }

      const numericPrice =
        typeof product.numericPrice === 'number'
          ? product.numericPrice
          : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;

      return [
        ...prevItems,
        {
          id: product.id || `item-${Date.now()}`,
          name: product.name,
          price: product.price || `₹${numericPrice}`,
          numericPrice,
          image: product.image || '/hero_floral.jpg',
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = (item.quantity || 1) + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Fallback listener for global twirl:cart-add events
  useEffect(() => {
    const handleGlobalAdd = (event) => {
      if (event.detail?.product) {
        addToCart(event.detail.product);
      }
    };

    window.addEventListener('twirl:cart-add', handleGlobalAdd);
    return () => window.removeEventListener('twirl:cart-add', handleGlobalAdd);
  }, []);

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartTotal = cartItems.reduce((total, item) => {
    const price =
      typeof item.numericPrice === 'number'
        ? item.numericPrice
        : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    return total + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
