import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageLoader";
import { FaArrowLeft } from "react-icons/fa";

const ReviewOrderPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [checkoutCart, setCheckoutCart] = useState(null);

  /* ================= LOAD CHECKOUT DATA ================= */
  useEffect(() => {
    try {
      const sCart = sessionStorage.getItem("checkoutCart");
      const sAddr = sessionStorage.getItem("checkoutAddress");
      const sDel = sessionStorage.getItem("checkoutDelivery");

      if (sCart) {
        setCheckoutCart(JSON.parse(sCart));
      } else {
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

      if (sAddr) setAddress(JSON.parse(sAddr));
      if (sDel) setDelivery(JSON.parse(sDel));
    } catch (e) {
      console.warn("Checkout parse error", e);
    }
  }, [cartItems]);

  const cart =
    checkoutCart || { items: cartItems || [], subtotal: 0, discount: 0, gst: 0 };

  const deliveryPrice = delivery?.price ? Number(delivery.price) : 0;
  const subtotal = Number(cart.subtotal || 0);
  const discount = Number(cart.discount || 0);
  const gst = Number(cart.gst || 0);
  const total = subtotal - discount + gst + deliveryPrice;

  /* ================= SAVE ORDER ================= */
  const saveOrderToMyOrders = () => {
    const existingOrders =
      JSON.parse(localStorage.getItem("myOrders")) || [];

    const normalizedItems = cart.items.map((item) => ({
      name: item.name,
      image: item.image,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
      code: item.code || "",
      size: item.size || "",
      color: item.color || "",
      thickness: item.thickness || "",
    }));

    const newOrder = {
      id: Date.now(),
      orderId: "ORD" + Date.now(),
      status: "Placed",
      date: new Date().toLocaleDateString(),
      items: normalizedItems,
      total,
      address,
      delivery,
    };

    // Get current user email
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userEmail = currentUser.email || "";

    // Filter orders by user email
    const userOrders = existingOrders.filter(
      (order) => order.userEmail === userEmail
    );
    const otherOrders = existingOrders.filter(
      (order) => order.userEmail !== userEmail
    );

    const newOrderWithEmail = { ...newOrder, userEmail };

    localStorage.setItem(
      "myOrders",
      JSON.stringify([newOrderWithEmail, ...userOrders, ...otherOrders])
    );
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = () => {
    if (!cart.items.length) {
      alert("Your cart is empty.");
      navigate("/items");
      return;
    }

    if (!address) {
      alert("Please add a delivery address.");
      navigate("/add-address");
      return;
    }

    saveOrderToMyOrders();
    clearCart();

    sessionStorage.removeItem("checkoutCart");
    sessionStorage.removeItem("checkoutAddress");
    sessionStorage.removeItem("checkoutDelivery");

    navigate("/order-processing");
  };

  /* ================= EMPTY STATE ================= */
  if (!cart.items.length) {
    return (
      <div className="w-full bg-white py-8 px-4 md:px-8 min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Review Your Order
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <button
            type="button"
            className="px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
            onClick={() => navigate("/items")}
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="w-full bg-gray-50 py-8 px-4 md:px-8 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        Review Your Order
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — PRODUCT DETAILS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, i) => {
            let imgSrc = "";
            try {
              imgSrc = item.image ? getImageUrl(item.image) : "";
            } catch {
              imgSrc = item.image || "";
            }

            const qty = Number(item.quantity || item.qty || 1);
            const price = Number(item.price || 0);
            const itemTotal = price * qty;

            return (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {item.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                      {item.thickness && <p>Thickness: {item.thickness}</p>}
                      <p>Qty: {qty}</p>
                      <p>Price: ₹{price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#b30000]">
                      ₹{itemTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — DELIVERY ADDRESS & ORDER SUMMARY */}
        <div className="lg:col-span-1 space-y-6">
          {/* Delivery Address Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Delivery Address
            </h3>

            {address ? (
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p className="font-semibold">{address.name}</p>
                <p>{address.city}</p>
                <p>
                  {address.line1 || address.address}, {address.state} -{" "}
                  {address.pin || address.pincode}
                </p>
                <p>{address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No address set</p>
            )}

            <button
              type="button"
              className="w-full px-4 py-2 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors flex items-center justify-center gap-2"
              onClick={() => navigate("/add-address")}
            >
              <FaArrowLeft />
              Edit Address
            </button>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>GST</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span>
                  {deliveryPrice > 0 ? `₹${deliveryPrice.toFixed(2)}` : "FREE"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-[#b30000]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="w-full px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
