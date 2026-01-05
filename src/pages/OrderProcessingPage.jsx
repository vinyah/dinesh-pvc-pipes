import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderProcessingPage = () => {
  const navigate = useNavigate();

  // ⏱ Auto move to success page after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order-success");
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Truck Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Truck SVG - Colorful truck with yellow cargo, blue cab, orange wheels */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-bounce"
            >
              {/* Truck Body - Yellow Cargo Area */}
              <rect x="10" y="30" width="35" height="25" fill="#FFD700" rx="2" />
              {/* Truck Cab - Light Blue */}
              <rect x="45" y="25" width="20" height="30" fill="#87CEEB" rx="2" />
              {/* Window */}
              <rect x="48" y="28" width="14" height="12" fill="#E0F2FF" rx="1" />
              {/* Left Wheel - Orange with Red Center */}
              <circle cx="22" cy="58" r="8" fill="#FFA500" />
              <circle cx="22" cy="58" r="4" fill="#FF0000" />
              {/* Right Wheel - Orange with Red Center */}
              <circle cx="52" cy="58" r="8" fill="#FFA500" />
              <circle cx="52" cy="58" r="4" fill="#FF0000" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Placing your order...
        </h2>
        <p className="text-base md:text-lg text-gray-600">
          Please wait while we confirm your order
        </p>
      </div>
    </div>
  );
};

export default OrderProcessingPage;
