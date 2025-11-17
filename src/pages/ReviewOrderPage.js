import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./ReviewOrderPage.css";

const ReviewOrderPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const address = JSON.parse(localStorage.getItem("userAddress"));

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="review-page">
      <h1 className="review-heading">Review Your Order</h1>

      <div className="review-content">
        <div className="review-items">
          {cartItems.map((item, i) => (
            <div key={i} className="review-item">
              <img
                src={require(`../assets/${item.image}`)}
                alt={item.name}
                className="review-img"
              />
              <div>
                <h3>{item.name}</h3>
                {item.size && <p>Size: {item.size}</p>}
                {item.color && <p>Color: {item.color}</p>}
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="review-summary">
          <h3>Delivery Address</h3>
          <p>{address.address}</p>
          <p>{address.city} - {address.pincode}</p>
          <hr />
          <h3>Total: ₹{subtotal}</h3>

          <button className="place-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
          <button
            className="back-btn"
            onClick={() => navigate("/add-address")}
          >
            ← Edit Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
