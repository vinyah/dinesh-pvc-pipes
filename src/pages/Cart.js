import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // 🔹 Coupon state
  const [coupon, setCoupon] = useState("");
  const [couponValue, setCouponValue] = useState(0);

  // 🔹 Safely convert price to number
  const getPrice = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^\d.]/g, ""); // remove ₹, spaces, etc.
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // 🔹 Safely convert quantity to number (default 1)
  const getQty = (value) => {
    if (value == null) return 1;
    const num = Number(value);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  // 🧮 Calculate subtotal: sum of (price * quantity)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = getPrice(item.price);
    const qty = getQty(item.quantity);
    return sum + price * qty;
  }, 0);

  // 🔹 Static discount (if any other promotion)
  const discount = 0.0;

  // 🏷️ Apply coupon
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setCouponValue(0);
      alert("Please enter a coupon code.");
      return;
    }

    // Example coupon logic – adjust as you like
    if (code === "DINESH10") {
      const value = subtotal * 0.1; // 10% off
      setCouponValue(value);
      alert("🎉 Coupon applied: 10% OFF");
    } else if (code === "SAVE50") {
      setCouponValue(50); // flat ₹50 off
      alert("🎉 Coupon applied: ₹50 OFF");
    } else {
      setCouponValue(0);
      alert("❌ Invalid coupon code");
    }
  };

  // 🔹 Final total after discount + coupon
  const total = subtotal - discount - couponValue;

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
            {cartItems.map((item, index) => {
              const price = getPrice(item.price);
              const qty = getQty(item.quantity);
              const lineTotal = price * qty;

              return (
                <div key={index} className="cart-item-box">
                  {/* Product image */}
                  <img
                    src={require(`../assets/${item.image}`)}
                    alt={item.name}
                    className="cart-item-img"
                  />

                  {/* Product details */}
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
                    {item.length && (
                      <p>
                        <strong>Length:</strong> {item.length}
                      </p>
                    )}
                    {item.bend && (
                      <p>
                        <strong>Bend:</strong> {item.bend}
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

                    {/* Unit price */}
                    <p>
                      <strong>Price:</strong> ₹{price}
                    </p>

                    {/* Quantity and line total */}
                    <p>
                      <strong>Quantity:</strong> {qty}
                    </p>
                    <p>
                      <strong>Line Total:</strong> {qty} × ₹{price} = ₹
                      {lineTotal.toFixed(2)}
                    </p>
                  </div>

                  {/* Delete button */}
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

          {/* 📦 RIGHT SIDE - ORDER SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* 💸 COUPON SECTION */}
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button type="button" onClick={applyCoupon}>
                Apply
              </button>
            </div>

            <div className="summary-row coupon">
              <span>Coupon</span>
              <span>-₹{couponValue.toFixed(2)}</span>
            </div>

            <div className="summary-row discount">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Buttons */}
            <button
              className="add-address-btn"
              onClick={() => navigate("/add-address")}
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
