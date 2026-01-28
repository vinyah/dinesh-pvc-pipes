import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageLoader";
import { Trash2 } from "lucide-react";

const CURRENT_USER_KEY = "currentUser";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponValue, setCouponValue] = useState(0);

  /* ---------- helpers ---------- */
  const getPrice = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^\d.]/g, "");
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const getQty = (value) => {
    const num = Number(value);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  /* ---------- calculations ---------- */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + getPrice(item.price) * getQty(item.quantity),
    0
  );

  const discount = 0;
  const total = subtotal - couponValue - discount;

  /* ---------- coupon ---------- */
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "DINESH10") {
      setCouponValue(subtotal * 0.1);
      alert("🎉 Coupon applied: 10% OFF");
    } else {
      setCouponValue(0);
      alert("❌ Invalid coupon code");
    }
  };

  /* ---------- 🚨 CHECKOUT AUTH GATE ---------- */
  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    if (!user) {
      navigate("/checkout-auth"); // ❌ not logged in
    } else {
      navigate("/add-address"); // ✅ logged in
    }
  };

  return (
    <div className="w-full min-h-screen bg-white py-8 px-4 max-md:pt-32 md:pt-28">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty 🛒</h2>
          <button
            className="px-6 py-3 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
            onClick={() => navigate("/items")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const price = getPrice(item.price);
              const qty = getQty(item.quantity);
              const lineTotal = price * qty;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 relative"
                >
                  {/* Trash Icon - Top Right */}
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#b30000] transition-colors"
                    onClick={() => removeFromCart(index)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-1">
                        <strong>Price:</strong> ₹{price}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 mb-1">
                        <strong>Quantity:</strong> {qty}
                      </p>
                      <p className="text-base md:text-lg font-bold text-[#b30000] mt-2">
                        Line Total: ₹{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h3>

              {/* Subtotal */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Coupon Input */}
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors text-sm whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Coupon Discount */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Coupon</span>
                <span className="text-gray-800 font-medium">
                  -₹{couponValue.toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-[#b30000]">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full py-3 px-4 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>

                <button
                  className="w-full py-3 px-4 bg-white border-2 border-[#b30000] text-[#b30000] rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
                  onClick={() => navigate("/items")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

