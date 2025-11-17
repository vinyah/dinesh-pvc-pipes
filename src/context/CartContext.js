import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 🧠 Load saved cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 💾 Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add product to cart (from any page)
  const addToCart = (product) => {
    setCartItems((prev) => {
      // Check if item with same name + size + color + thickness already exists
      const existing = prev.find(
        (item) =>
          item.name === product.name &&
          item.size === product.size &&
          item.color === product.color &&
          item.thickness === product.thickness &&
          item.length === product.length
      );

      if (existing) {
        // If found, increase quantity
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Else, add new item with quantity = 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // ❌ Remove item by index
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🧹 Clear all cart items
  const clearCart = () => {
    setCartItems([]);
  };

  // 🧾 Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

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

// 🪄 Custom hook for easy access
export const useCart = () => useContext(CartContext);
