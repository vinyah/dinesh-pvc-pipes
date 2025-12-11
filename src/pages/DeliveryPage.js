// src/pages/DeliveryPage.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./DeliveryPage.css";

/*
  Delivery page:
  - left: selectable delivery options
  - right: live order summary (subtotal, coupon, discount, delivery, total)
  - saves selection to sessionStorage.checkoutDelivery
  - Continue -> /review-order
*/

const DELIVERY_OPTIONS = [
  { id: "standard", title: "Standard Delivery", desc: "5-7 business days", price: 0, label: "FREE" },
  { id: "express", title: "Express Delivery", desc: "2-3 business days", price: 500, label: "₹500" },
  { id: "premium", title: "Premium Delivery", desc: "1 business day", price: 1000, label: "₹1000" },
];

function DeliveryPage() {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart(); // safe: fallback to [] if undefined

  // selected delivery id
  const [selected, setSelected] = useState("standard");

  // load previous selection if present
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("checkoutDelivery");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) setSelected(parsed.id);
        else if (parsed && parsed.id === undefined && parsed.title) {
          // in case full option object was saved without id
          const found = DELIVERY_OPTIONS.find((o) => o.title === parsed.title);
          if (found) setSelected(found.id);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // compute subtotal (prefer sessionStorage.checkoutCart if exists)
  const checkoutCart = useMemo(() => {
    try {
      const s = sessionStorage.getItem("checkoutCart");
      if (s) return JSON.parse(s);
    } catch (e) {
      // ignore parse
    }
    return null;
  }, []);

  const subtotal = useMemo(() => {
    if (checkoutCart && typeof checkoutCart.subtotal === "number") {
      return Number(checkoutCart.subtotal);
    }
    // fallback compute from cartItems
    return cartItems.reduce((sum, it) => {
      const price = Number(it.price || 0);
      const qty = Number(it.quantity || it.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [checkoutCart, cartItems]);

  // Determine coupon / discount values: prefer checkoutCart.discount or checkoutCart.couponAmount
  const couponAmount = useMemo(() => {
    // try checkoutCart keys
    if (checkoutCart) {
      if (typeof checkoutCart.discount === "number" && checkoutCart.discount > 0) {
        return Number(checkoutCart.discount);
      }
      if (typeof checkoutCart.couponAmount === "number" && checkoutCart.couponAmount > 0) {
        return Number(checkoutCart.couponAmount);
      }
    }

    // try common session/local keys from cart page (robust heuristics)
    try {
      const applied = sessionStorage.getItem("appliedCoupon") || sessionStorage.getItem("cartCoupon") || localStorage.getItem("appliedCoupon") || localStorage.getItem("cartCoupon");
      if (applied) {
        const parsed = JSON.parse(applied);
        // parsed could be an object {code, amount} or a number
        if (typeof parsed === "number") return parsed;
        if (parsed && typeof parsed.amount === "number") return parsed.amount;
        if (parsed && typeof parsed.value === "number") return parsed.value;
      }
    } catch (e) {
      // ignore
    }

    // no coupon found
    return 0;
  }, [checkoutCart]);

  // discount displayed — treat couponAmount as discount to subtract
  const discount = couponAmount > 0 ? couponAmount : 0;
  const couponAppliedLabel = couponAmount > 0 ? `₹${couponAmount}` : "—";

  // find selected option object
  const selectedOption = useMemo(() => {
    return DELIVERY_OPTIONS.find((o) => o.id === selected) || DELIVERY_OPTIONS[0];
  }, [selected]);

  const deliveryPrice = Number(selectedOption.price || 0);

  // compute GST/taxes placeholder: you can replace with real logic if needed
  // For now assume 0 (Review page may compute taxes separately).
  const gst = checkoutCart && checkoutCart.gst ? Number(checkoutCart.gst) : 0;

  const total = subtotal - discount + gst + deliveryPrice;

  // when user changes selected option, immediately save to session so review page sees it live
  useEffect(() => {
    try {
      const option = DELIVERY_OPTIONS.find((o) => o.id === selected) || DELIVERY_OPTIONS[0];
      sessionStorage.setItem("checkoutDelivery", JSON.stringify(option));
    } catch (e) {
      // ignore
    }
  }, [selected]);

  const onContinue = () => {
    // ensure selection saved
    try {
      const option = DELIVERY_OPTIONS.find((o) => o.id === selected) || DELIVERY_OPTIONS[0];
      sessionStorage.setItem("checkoutDelivery", JSON.stringify(option));
    } catch (e) {}
    navigate("/review-order");
  };

  const onBack = () => {
    // go back to address page
    navigate("/add-address");
  };

  return (
    <div className="page delivery-page">
      <div className="delivery-container">
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
                  value={opt.id}
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

          <div className="delivery-actions">
            <button className="btn btn-ghost" onClick={onBack}>Back</button>
            <button className="btn btn-primary" onClick={onContinue}>
              Continue to Review
            </button>
          </div>
        </div>

        <aside className="delivery-summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Coupon Applied</span>
            <span>{couponAmount > 0 ? `₹${couponAmount}` : "—"}</span>
          </div>

          <div className="price-row">
            <span>Discount</span>
            <span>{discount > 0 ? `- ₹${discount}` : "—"}</span>
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
        </aside>
      </div>
    </div>
  );
}

export default DeliveryPage;
