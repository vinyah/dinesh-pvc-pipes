import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  /* 🧠 Load saved cart from localStorage */
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Error reading cartItems from localStorage:", e);
      return [];
    }
  });

  /* 💾 Persist cart to localStorage */
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cartItems:", e);
    }
  }, [cartItems]);

  /* ➕ Add to cart */
  const addToCart = (product) => {
    let qtyToAdd = Number(product.quantity ?? 1);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) qtyToAdd = 1;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.name === product.name &&
          item.size === product.size &&
          item.color === product.color &&
          item.thickness === product.thickness &&
          item.length === product.length
      );

      if (existing) {
        return prev.map((item) =>
          item === existing
            ? {
                ...item,
                quantity: (Number(item.quantity) || 0) + qtyToAdd,
              }
            : item
        );
      }

      return [...prev, { ...product, quantity: qtyToAdd }];
    });
  };

  /* ❌ Remove single item */
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* 🧹 CLEAR CART — FIXED */
  const clearCart = () => {
    setCartItems([]);                     // clear React state
    localStorage.removeItem("cartItems"); // 🔥 clear storage immediately
  };

  /* 🧾 Total price */
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return total + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* 🪄 Custom hook */
export const useCart = () => useContext(CartContext);


