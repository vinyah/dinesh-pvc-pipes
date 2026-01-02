// src/pages/ReviewOrderPage.js
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ReviewOrderPage.css";

const ReviewOrderPage = () => {
  const { cartItems, clearCart } = useCart(); // ✅ get clearCart
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
    }));

    const newOrder = {
      id: Date.now(),
      orderId: "ORD" + Date.now(),
      status: "Placed",
      date: new Date().toLocaleDateString(),
      items: normalizedItems,
      total,
    };

    localStorage.setItem(
      "myOrders",
      JSON.stringify([newOrder, ...existingOrders])
    );
  };

  /* ================= PLACE ORDER (NO POPUP) ================= */
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

    // ✅ DIRECTLY PLACE ORDER
    saveOrderToMyOrders();
    clearCart();

    sessionStorage.removeItem("checkoutCart");
    sessionStorage.removeItem("checkoutAddress");
    sessionStorage.removeItem("checkoutDelivery");

    // 🚚 Go to animation page
    navigate("/order-processing");
  };

  /* ================= EMPTY STATE ================= */
  if (!cart.items.length) {
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

  /* ================= UI ================= */
  return (
    <div className="review-page">
      <h1 className="review-heading">Review Your Order</h1>

      <div className="review-content">
        <div className="review-items">
          {cart.items.map((item, i) => {
            let imgSrc = "";
            try {
              imgSrc = item.image ? require(`../assets/${item.image}`) : "";
            } catch {
              imgSrc = item.image || "";
            }

            const qty = Number(item.quantity || item.qty || 1);
            const price = Number(item.price || 0);

            return (
              <div key={i} className="review-item">
                {imgSrc ? (
                  <img src={imgSrc} alt={item.name} className="review-img" />
                ) : (
                  <div className="review-img placeholder" />
                )}

                <div className="review-item-info">
                  <h3 className="review-item-name">{item.name}</h3>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                  {item.thickness && <p>Thickness: {item.thickness}</p>}
                  <p>Qty: {qty}</p>
                  <p>Price: ₹{price}</p>
                </div>

                <div className="review-line-total">₹{price * qty}</div>
              </div>
            );
          })}
        </div>

        <div className="review-summary">
          <h3 className="summary-title">Delivery Address</h3>

          {address && (
            <>
              <p>{address.name}</p>
              <p>{address.line1 || address.address}</p>
              <p>
                {address.city}, {address.state} -{" "}
                {address.pin || address.pincode}
              </p>
              <p>{address.phone}</p>
            </>
          )}

          <button
            type="button"
            className="back-btn edit-address-btn"
            onClick={() => navigate("/add-address")}
          >
            ← Edit Address
          </button>

          <hr />

          <div className="price-breakdown">
            <div><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div><span>Discount</span><span>- ₹{discount}</span></div>
            <div><span>GST</span><span>₹{gst}</span></div>
            <div>
              <span>Delivery</span>
              <span>{deliveryPrice ? `₹${deliveryPrice}` : "FREE"}</span>
            </div>
            <div className="divider" />
            <div className="total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button className="place-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
