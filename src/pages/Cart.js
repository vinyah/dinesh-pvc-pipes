import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // 🧮 Calculate total price
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );
  const discount = 0.0;
  const total = subtotal - discount;

  return (
    <div className="cart-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty 🛒</h2>
          <button className="continue-btn" onClick={() => navigate("/items")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          {/* 🛍️ LEFT SIDE - CART ITEMS */}
          <div className="cart-items-section">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item-box">
                <img
                  src={require(`../assets/${item.image}`)}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {item.code && (
                    <p>
                      <strong>Code:</strong> {item.code}
                    </p>
                  )}
                  {item.size && (
                    <p>
                      <strong>Size:</strong> {item.size}
                    </p>
                  )}
                  {item.thickness && (
                    <p>
                      <strong>Thickness:</strong> {item.thickness}
                    </p>
                  )}
                  {item.color && (
                    <p>
                      <strong>Color:</strong> {item.color}
                    </p>
                  )}
                  <p>
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => removeFromCart(index)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          {/* 📦 RIGHT SIDE - ORDER SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(1)}</span>
            </div>
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-₹{discount.toFixed(1)}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(1)}</span>
            </div>

            {/* BUTTONS */}
            <button
              className="add-address-btn"
              onClick={() => navigate("/add-address")}
            >
              Add Address
            </button>

            <button className="continue-btn" onClick={() => navigate("/items")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
