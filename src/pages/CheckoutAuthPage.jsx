import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutAuthPage = ({ setShowModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Store that we're in checkout flow
  useEffect(() => {
    sessionStorage.setItem("checkoutFlow", "true");
    return () => {
      sessionStorage.removeItem("checkoutFlow");
    };
  }, []);

  const handleLogin = () => {
    if (setShowModal) {
      setShowModal("login");
    } else {
      navigate("/account");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          You haven't logged in yet
        </h2>
        <p className="text-gray-600 mb-8">
          Log in to proceed with checkout
        </p>

        <button
          className="w-full py-3 px-6 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors mb-4"
          onClick={handleLogin}
        >
          Log In
        </button>

        <button
          className="w-full py-3 px-6 bg-white border-2 border-[#b30000] text-[#b30000] rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
        </button>
      </div>
    </div>
  );
};

export default CheckoutAuthPage;

