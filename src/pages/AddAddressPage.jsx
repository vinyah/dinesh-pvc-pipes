// src/pages/AddAddressPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const AddAddressPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // If user already selected an address earlier in the flow, prefill it
    const saved = sessionStorage.getItem("checkoutAddress") || localStorage.getItem("userAddress");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setName(obj.name || "");
        setAddress(obj.line1 || obj.address || "");
        setCity(obj.city || "");
        setStateVal(obj.state || "");
        setPincode(obj.pin || obj.pincode || "");
        setPhone(obj.phone || "");
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const handleContinue = () => {
    // Basic validation
    if (!name.trim()) {
      alert("Please enter a name for the delivery address.");
      return;
    }
    if (!address.trim()) {
      alert("Please enter the address line.");
      return;
    }
    if (!city.trim()) {
      alert("Please enter the city.");
      return;
    }
    if (!stateVal.trim()) {
      alert("Please enter the state.");
      return;
    }
    if (!pincode.trim()) {
      alert("Please enter the pincode.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter a contact phone number.");
      return;
    }

    // Build consistent address object for checkout
    const checkoutAddress = {
      name: name.trim(),
      line1: address.trim(),
      city: city.trim(),
      state: stateVal.trim(),
      pin: pincode.trim(),
      phone: phone.trim(),
    };

    // Save to sessionStorage so the Delivery and Review steps can read it
    sessionStorage.setItem("checkoutAddress", JSON.stringify(checkoutAddress));

    // Also keep legacy localStorage key for backward compatibility if you used it elsewhere
    localStorage.setItem("userAddress", JSON.stringify(checkoutAddress));

    // Navigate to Delivery Options step
    navigate("/delivery");
  };

  return (
    <div className="address-page">
      <h1 className="address-heading">Select Delivery Address</h1>

      <div className="address-card">
        <div className="address-form">
          <label className="address-label">Full name</label>
          <input
            type="text"
            className="address-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipient name (e.g. John Doe)"
          />

          <label className="address-label">Address</label>
          <textarea
            className="address-input address-textarea"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House no, street, landmark, etc."
          />

          <div className="row-two">
            <div className="col">
              <label className="address-label">City</label>
              <input
                type="text"
                className="address-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>

            <div className="col">
              <label className="address-label">State</label>
              <input
                type="text"
                className="address-input"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="row-two">
            <div className="col">
              <label className="address-label">Pincode</label>
              <input
                type="text"
                className="address-input"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
              />
            </div>

            <div className="col">
              <label className="address-label">Phone</label>
              <input
                type="tel"
                className="address-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
              />
            </div>
          </div>

          <div className="actions-row">
            <button className="back-btn" onClick={() => navigate("/cart")}>
              Back to Cart
            </button>

            <button className="continue-btn" onClick={handleContinue}>
              Continue to Delivery Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressPage;

