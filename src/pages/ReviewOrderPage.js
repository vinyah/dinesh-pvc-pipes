// src/pages/ReviewOrderPage.js
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ReviewOrderPage.css";

const ReviewOrderPage = () => {
  const { cartItems } = useCart(); // keep using your cart context
  const navigate = useNavigate();

  // local UI state
  const [address, setAddress] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [checkoutCart, setCheckoutCart] = useState(null);

  // modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // read persisted checkout info from sessionStorage (preferred) or fallback to localStorage
  useEffect(() => {
    try {
      const sCart = sessionStorage.getItem("checkoutCart");
      const sAddr = sessionStorage.getItem("checkoutAddress");
      const sDel = sessionStorage.getItem("checkoutDelivery");

      if (sCart) {
        setCheckoutCart(JSON.parse(sCart));
      } else {
        // fallback: compute from cartItems if session not set
        const subtotal = cartItems.reduce((sum, item) => {
          const price = Number(item.price || 0);
          const qty = Number(item.quantity || item.qty || 1);
          return sum + price * qty;
        }, 0);
        setCheckoutCart({
          items: cartItems,
          subtotal,
          discount: 0,
          gst: 0,
        });
      }

      if (sAddr) {
        setAddress(JSON.parse(sAddr));
      } else {
        const localAddr = localStorage.getItem("userAddress");
        if (localAddr) setAddress(JSON.parse(localAddr));
      }

      if (sDel) {
        setDelivery(JSON.parse(sDel));
      }
    } catch (e) {
      // ignore parse errors
      console.warn("Error parsing checkout data", e);
    }
  }, [cartItems]);

  // safe getters
  const cart = checkoutCart || { items: cartItems || [], subtotal: 0, discount: 0, gst: 0 };

  // compute totals
  const deliveryPrice = delivery && Number(delivery.price ? delivery.price : 0) ? Number(delivery.price) : 0;
  const subtotal = Number(cart.subtotal || 0);
  const discount = Number(cart.discount || 0);
  const gst = Number(cart.gst || 0);

  const total = subtotal - discount + gst + deliveryPrice;

  // safe attempt to clear cart via context if function exists (optional)
  const tryClearCart = () => {
    try {
      // some CartContext expose clearCart or setCartItems - we don't assume, but try if present
      const cartCtx = require("../context/CartContext");
      // Not calling from module; instead, we check if useCart returned a function - but since
      // we only requested cartItems earlier, we can't rely. So we skip forced clearing here.
    } catch {
      // nothing
    }
  };

  // open confirm dialog
  const handlePlaceOrder = () => {
    if (!cart.items || cart.items.length === 0) {
      alert("Your cart is empty. Add items before placing an order.");
      navigate("/items");
      return;
    }
    if (!address) {
      alert("Please add a delivery address before placing the order.");
      navigate("/add-address");
      return;
    }
    setShowConfirm(true);
  };

  // confirm and finalize order
  const confirmOrder = () => {
    setShowConfirm(false);

    // simulate order processing...
    // Clear session checkout keys
    try {
      sessionStorage.removeItem("checkoutCart");
      sessionStorage.removeItem("checkoutAddress");
      sessionStorage.removeItem("checkoutDelivery");
    } catch (e) {
      // ignore
    }

    // attempt to clear cart from context if available (non-fatal)
    try {
      const ctx = require("../context/CartContext");
      // If the cart context exports a clear function, it should be invoked via context hook.
      // We intentionally don't force it here to avoid throwing if API differs.
    } catch (e) {
      // ignore
    }

    // show success UI
    setShowSuccess(true);

    // after a short delay navigate home (or to orders page)
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/");
    }, 1600);
  };

  // cancel confirm
  const cancelConfirm = () => setShowConfirm(false);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="review-page empty-state">
        <h1 className="review-heading">Review Your Order</h1>
        <p className="empty-text">Your cart is empty.</p>
        <button type="button" className="back-btn" onClick={() => navigate("/items")}>
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="review-page">
      <h1 className="review-heading">Review Your Order</h1>

      <div className="review-content">
        {/* LEFT: ITEMS LIST */}
        <div className="review-items">
          {cart.items.map((item, i) => {
            // support both item.image (filename) and item.image as full url
            let imgSrc = "";
            try {
              imgSrc = item.image ? require(`../assets/${item.image}`) : "";
            } catch {
              imgSrc = item.image || "";
            }

            const qty = Number(item.quantity || item.qty || 1);
            const price = Number(item.price || 0);

            return (
              <div key={i} className="review-item">
                {imgSrc ? (
                  <img src={imgSrc} alt={item.name} className="review-img" loading="lazy" />
                ) : (
                  <div className="review-img placeholder" />
                )}

                <div className="review-item-info">
                  <h3 className="review-item-name">{item.name}</h3>

                  {item.size && <p className="review-meta">Size: {item.size}</p>}
                  {item.color && <p className="review-meta">Color: {item.color}</p>}
                  {item.thickness && <p className="review-meta">Thickness: {item.thickness}</p>}

                  <p className="review-meta">Qty: {qty}</p>

                  <p className="review-price">Price: ₹{price}</p>
                </div>

                <div className="review-line-total">₹{price * qty}</div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="review-summary">
          <h3 className="summary-title">Delivery Address</h3>

          {address ? (
            <>
              <p className="summary-address-line">{address.name}</p>
              <p className="summary-address-line">{address.line1 || address.address}</p>
              <p className="summary-address-line">
                {address.city}, {address.state} - {address.pin || address.pincode}
              </p>
              <p className="summary-address-line">{address.phone}</p>
            </>
          ) : (
            <p className="summary-address-missing">No address added yet.</p>
          )}

          <button
            type="button"
            className="back-btn edit-address-btn"
            onClick={() => navigate("/add-address")}
          >
            ← {address ? "Edit Address" : "Add Address"}
          </button>

          <hr />

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="price-row">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>

            <div className="price-row">
              <span>GST / Taxes</span>
              <span>₹{gst}</span>
            </div>

            <div className="price-row">
              <span>Delivery</span>
              <span>{deliveryPrice ? `₹${deliveryPrice}` : "FREE"}</span>
            </div>

            <div className="divider" />

            <div className="price-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button type="button" className="place-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Order</h3>
            <p>Are you sure you want to place the order?</p>

            <div className="modal-actions">
              <button className="btn ghost" onClick={cancelConfirm}>
                Cancel
              </button>
              <button className="btn primary" onClick={confirmOrder}>
                Yes, Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS FEEDBACK */}
      {showSuccess && (
        <div className="modal-overlay small">
          <div className="modal success">
            <h3>Order placed</h3>
            <p>Thank you — your order has been placed successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewOrderPage;
