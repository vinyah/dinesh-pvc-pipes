// src/pages/DeliveryPage.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./DeliveryPage.css";

const DELIVERY_OPTIONS = [
  { id: "standard", title: "Standard Delivery", desc: "5-7 business days", price: 0, label: "FREE" },
  { id: "express", title: "Express Delivery", desc: "2-3 business days", price: 500, label: "₹500" },
  { id: "premium", title: "Premium Delivery", desc: "1 business day", price: 1000, label: "₹1000" },
];

function DeliveryPage() {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();

  const [selected, setSelected] = useState("standard");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("checkoutDelivery");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) setSelected(parsed.id);
      }
    } catch {}
  }, []);

  const checkoutCart = useMemo(() => {
    try {
      const s = sessionStorage.getItem("checkoutCart");
      if (s) return JSON.parse(s);
    } catch {}
    return null;
  }, []);

  const subtotal = useMemo(() => {
    if (checkoutCart?.subtotal) return Number(checkoutCart.subtotal);
    return cartItems.reduce((sum, it) => {
      const price = Number(it.price || 0);
      const qty = Number(it.quantity || it.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [checkoutCart, cartItems]);

  const couponAmount = useMemo(() => {
    try {
      const applied =
        sessionStorage.getItem("appliedCoupon") ||
        localStorage.getItem("appliedCoupon");
      if (applied) {
        const parsed = JSON.parse(applied);
        return parsed?.amount || parsed || 0;
      }
    } catch {}
    return 0;
  }, []);

  const discount = couponAmount > 0 ? couponAmount : 0;

  const selectedOption = useMemo(
    () => DELIVERY_OPTIONS.find((o) => o.id === selected) || DELIVERY_OPTIONS[0],
    [selected]
  );

  const deliveryPrice = Number(selectedOption.price || 0);
  const gst = checkoutCart?.gst ? Number(checkoutCart.gst) : 0;
  const total = subtotal - discount + gst + deliveryPrice;

  useEffect(() => {
    try {
      sessionStorage.setItem("checkoutDelivery", JSON.stringify(selectedOption));
    } catch {}
  }, [selectedOption]);

  const onContinue = () => navigate("/review-order");
  const onBack = () => navigate("/add-address");

  return (
    <div className="page delivery-page">
      <div className="delivery-container">

        {/* LEFT — DELIVERY OPTIONS */}
        <div className="delivery-left">
          <h1 className="page-title">Choose Delivery Option</h1>

          <div className="delivery-options">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`delivery-card ${selected === opt.id ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                />
                <div className="delivery-info">
                  <div className="delivery-title-row">
                    <div className="delivery-title">{opt.title}</div>
                    <div className="delivery-price">{opt.label}</div>
                  </div>
                  <div className="delivery-desc">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <aside className="delivery-summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Discount</span>
            <span>{discount > 0 ? `-₹${discount}` : "—"}</span>
          </div>

          <div className="price-row">
            <span>Delivery</span>
            <span>{deliveryPrice > 0 ? `₹${deliveryPrice}` : "FREE"}</span>
          </div>

          <div className="divider" />

          <div className="price-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <ul className="summary-features">
            <li>✓ Secure checkout</li>
            <li>✓ Certified products</li>
            <li>✓ 30-day return policy</li>
          </ul>

          {/* ✅ BUTTONS – LIKE 2ND IMAGE */}
          <div className="checkout-actions">
            <button className="checkout-btn primary" onClick={onContinue}>
              Proceed to Checkout
            </button>

            <button className="checkout-btn secondary" onClick={onBack}>
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DeliveryPage;
