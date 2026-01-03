import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageLoader";

const CURRENT_USER_KEY = "currentUser";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponValue, setCouponValue] = useState(0);

  /* ---------- helpers ---------- */
  const getPrice = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^\d.]/g, "");
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const getQty = (value) => {
    const num = Number(value);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  /* ---------- calculations ---------- */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + getPrice(item.price) * getQty(item.quantity),
    0
  );

  const discount = 0;
  const total = subtotal - couponValue - discount;

  /* ---------- coupon ---------- */
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "DINESH10") {
      setCouponValue(subtotal * 0.1);
      alert("🎉 Coupon applied: 10% OFF");
    } else {
      setCouponValue(0);
      alert("❌ Invalid coupon code");
    }
  };

  /* ---------- 🚨 CHECKOUT AUTH GATE ---------- */
  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    if (!user) {
      navigate("/checkout-auth"); // ❌ not logged in
    } else {
      navigate("/add-address"); // ✅ logged in
    }
  };

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
          {/* LEFT - ITEMS */}
          <div className="cart-items-section">
            {cartItems.map((item, index) => {
              const price = getPrice(item.price);
              const qty = getQty(item.quantity);

              return (
                <div key={index} className="cart-item-box">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="cart-item-img"
                  />

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p><strong>Price:</strong> ₹{price}</p>
                    <p><strong>Quantity:</strong> {qty}</p>
                    <p>
                      <strong>Line Total:</strong> ₹{(price * qty).toFixed(2)}
                    </p>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(index)}
                  >
                    🗑
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="coupon-box">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            <div className="summary-row">
              <span>Coupon</span>
              <span>-₹{couponValue.toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* ✅ UPDATED BUTTON */}
            <button
              className="add-address-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <button
              className="continue-btn"
              onClick={() => navigate("/items")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

