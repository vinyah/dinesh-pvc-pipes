import React from "react";
import { useNavigate } from "react-router-dom";

const CheckoutAuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="checkout-auth-page">
      <h2>You haven’t signed up yet</h2>
      <p>Please sign in or create an account to continue checkout.</p>

      <button
        className="primary-btn"
        onClick={() => navigate("/account")}
      >
        Sign Up
      </button>

      <button
        className="secondary-btn"
        onClick={() => navigate("/cart")}
      >
        ← Back to Cart
      </button>
    </div>
  );
};

export default CheckoutAuthPage;

