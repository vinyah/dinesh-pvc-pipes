import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ReviewOrderPage.css";

const ReviewOrderPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // 🔹 Safely read address from localStorage
  let address = null;
  try {
    const stored = localStorage.getItem("userAddress");
    address = stored ? JSON.parse(stored) : null;
  } catch {
    address = null;
  }

  // 🔹 Subtotal (uses quantity if available)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 1);
    return sum + price * qty;
  }, 0);

  const handlePlaceOrder = () => {
    if (!cartItems.length) {
      alert("Your cart is empty. Add items before placing an order.");
      navigate("/items");
      return;
    }

    if (!address) {
      alert("Please add a delivery address before placing the order.");
      navigate("/add-address");
      return;
    }

    alert("✅ Order placed successfully!");
    navigate("/");
  };

  // 🔹 If cart is empty, show simple state
  if (!cartItems.length) {
    return (
      <div className="review-page empty-state">
        <h1 className="review-heading">Review Your Order</h1>
        <p className="empty-text">Your cart is empty.</p>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/items")}
        >
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
          {cartItems.map((item, i) => (
            <div key={i} className="review-item">
              <img
                src={require(`../assets/${item.image}`)}
                alt={item.name}
                className="review-img"
                loading="lazy"
              />
              <div className="review-item-info">
                <h3 className="review-item-name">{item.name}</h3>
                {item.size && <p className="review-meta">Size: {item.size}</p>}
                {item.color && (
                  <p className="review-meta">Color: {item.color}</p>
                )}
                {item.thickness && (
                  <p className="review-meta">
                    Thickness: {item.thickness}
                  </p>
                )}
                {item.quantity && (
                  <p className="review-meta">Qty: {item.quantity}</p>
                )}
                <p className="review-price">Price: ₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="review-summary">
          <h3 className="summary-title">Delivery Address</h3>

          {address ? (
            <>
              <p className="summary-address-line">{address.address}</p>
              <p className="summary-address-line">
                {address.city} - {address.pincode}
              </p>
            </>
          ) : (
            <p className="summary-address-missing">
              No address added yet.
            </p>
          )}

          <button
            type="button"
            className="back-btn edit-address-btn"
            onClick={() => navigate("/add-address")}
          >
            ← {address ? "Edit Address" : "Add Address"}
          </button>

          <hr />

          <h3 className="summary-total">
            Total: <span>₹{subtotal}</span>
          </h3>

          <button
            type="button"
            className="place-btn"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
