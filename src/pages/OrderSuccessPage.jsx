import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h1>Order Placed Successfully!</h1>
        <p>Your order has been confirmed and is being processed.</p>

        <button
          className="my-orders-btn"
          onClick={() => navigate("/orders")}
        >
          Go to My Orders
        </button>

        <button
          className="continue-btn"
          onClick={() => navigate("/items")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;


