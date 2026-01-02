import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderProcessingPage.css";

const OrderProcessingPage = () => {
  const navigate = useNavigate();

  // ⏱ Auto move to success page
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order-success");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="order-processing-page">
      {/* 🚚 CENTERED TRUCK ANIMATION */}
      <div className="truck-track">
        <span className="package"></span>
        <span className="truck">🚚</span>
      </div>

      <h2>Placing your order...</h2>
      <p>Please wait while we confirm your order</p>
    </div>
  );
};

export default OrderProcessingPage;
