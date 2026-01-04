import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DELIVERY_OPTIONS = [
  { id: "standard", title: "Standard Delivery", desc: "5-7 business days", price: 0, label: "FREE" },
  { id: "express", title: "Express Delivery", desc: "2-3 business days", price: 500, label: "₹500" },
  { id: "premium", title: "Premium Delivery", desc: "1 business day", price: 1000, label: "₹1000" },
];

function DeliveryPage() {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();

  const [selected, setSelected] = useState("standard");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("checkoutDelivery");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) setSelected(parsed.id);
      }
    } catch {}
  }, []);

  const checkoutCart = useMemo(() => {
    try {
      const s = sessionStorage.getItem("checkoutCart");
      if (s) return JSON.parse(s);
    } catch {}
    return null;
  }, []);

  const subtotal = useMemo(() => {
    if (checkoutCart?.subtotal) return Number(checkoutCart.subtotal);
    return cartItems.reduce((sum, it) => {
      const price = Number(it.price || 0);
      const qty = Number(it.quantity || it.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [checkoutCart, cartItems]);

  const couponAmount = useMemo(() => {
    try {
      const applied =
        sessionStorage.getItem("appliedCoupon") ||
        localStorage.getItem("appliedCoupon");
      if (applied) {
        const parsed = JSON.parse(applied);
        return parsed?.amount || parsed || 0;
      }
    } catch {}
    return 0;
  }, []);

  const discount = couponAmount > 0 ? couponAmount : 0;

  const selectedOption = useMemo(
    () => DELIVERY_OPTIONS.find((o) => o.id === selected) || DELIVERY_OPTIONS[0],
    [selected]
  );

  const deliveryPrice = Number(selectedOption.price || 0);
  const gst = checkoutCart?.gst ? Number(checkoutCart.gst) : 0;
  const total = subtotal - discount + gst + deliveryPrice;

  useEffect(() => {
    try {
      sessionStorage.setItem("checkoutDelivery", JSON.stringify(selectedOption));
    } catch {}
  }, [selectedOption]);

  const onContinue = () => navigate("/review-order");
  const onContinueShopping = () => navigate("/items");

  return (
    <div className="w-full bg-white py-8 px-4 md:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — DELIVERY OPTIONS */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Choose Delivery Option
          </h1>

          <div className="space-y-4">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`block bg-white rounded-lg border-2 p-5 cursor-pointer transition-all ${
                  selected === opt.id
                    ? "border-[#b30000]"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="delivery"
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                    className="mt-1 w-5 h-5 text-[#b30000] focus:ring-[#b30000]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-semibold text-gray-800">
                        {opt.title}
                      </div>
                      <div className="text-lg font-bold text-[#b30000]">
                        {opt.label}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{opt.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Discount</span>
                <span>{discount > 0 ? `-₹${discount.toFixed(2)}` : "—"}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span>{deliveryPrice > 0 ? `₹${deliveryPrice.toFixed(2)}` : "FREE"}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-[#b30000]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                className="w-full px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
                onClick={onContinue}
              >
                Proceed to Checkout
              </button>

              <button
                className="w-full px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DeliveryPage;
