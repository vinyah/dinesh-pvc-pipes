import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAddressPage.css";

const AddAddressPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const handleReview = () => {
    if (!address.trim() || !city.trim() || !pincode.trim()) {
      alert("⚠️ Please fill all address fields before proceeding.");
      return;
    }

    // ✅ Store the address so ReviewOrderPage can use it
    localStorage.setItem(
      "userAddress",
      JSON.stringify({ address, city, pincode })
    );

    navigate("/review-order");
  };

  return (
    <div className="address-page">
      <h1 className="address-heading">Add Delivery Address</h1>

      <div className="address-card">
        <div className="address-form">
          <label className="address-label">Address</label>
          <textarea
            className="address-input address-textarea"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address..."
          />

          <label className="address-label">City</label>
          <input
            type="text"
            className="address-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city..."
          />

          <label className="address-label">Pincode</label>
          <input
            type="text"
            className="address-input"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter your pincode..."
          />

          <button className="review-btn" onClick={handleReview}>
            Review Order
          </button>

          <button className="back-btn" onClick={() => navigate("/cart")}>
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressPage;
