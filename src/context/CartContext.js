import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 🧠 Load saved cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Error reading cartItems from localStorage:", e);
      return [];
    }
  });

  // 💾 Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cartItems to localStorage:", e);
    }
  }, [cartItems]);

  // ➕ Add product to cart (from any page)
  const addToCart = (product) => {
    // use quantity coming from the page (BoxPageA, etc.)
    let qtyToAdd = product.quantity ?? 1;
    qtyToAdd = Number(qtyToAdd);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) qtyToAdd = 1;

    setCartItems((prev) => {
      // Check if item with same name + size + color + thickness + length already exists
      const existing = prev.find(
        (item) =>
          item.name === product.name &&
          item.size === product.size &&
          item.color === product.color &&
          item.thickness === product.thickness &&
          item.length === product.length
      );

      if (existing) {
        // If found, INCREASE by qtyToAdd (not just +1)
        return prev.map((item) =>
          item === existing
            ? {
                ...item,
                quantity: (Number(item.quantity) || 0) + qtyToAdd,
              }
            : item
        );
      } else {
        // Else, add new item with that quantity
        return [
          ...prev,
          {
            ...product,
            quantity: qtyToAdd,
          },
        ];
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

  // 🧾 Calculate total price (simple numeric, Cart.js does extra parsing if needed)
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

// 🪄 Custom hook for easy access
export const useCart = () => useContext(CartContext);
