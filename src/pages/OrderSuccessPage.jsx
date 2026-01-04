import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-md w-full text-center">
        {/* Success Icon - Green Square with White Checkmark */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
            <FaCheck className="text-white text-3xl" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Your order has been confirmed and is being processed.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="w-full px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
            onClick={() => navigate("/orders")}
          >
            Go to My Orders
          </button>

          <button
            className="w-full px-6 py-3 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
            onClick={() => navigate("/items")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
