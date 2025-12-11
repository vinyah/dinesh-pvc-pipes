import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ Import global cart context
import zebraData from "../data/zebraHose.json";
import "./ZebraHosePage.css";

const ZebraHosePage = () => {
  const { addToCart } = useCart(); // ✅ Get addToCart function from context
  const product = zebraData[0];

  // 🧠 State hooks
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("25mm");
  const [selectedLength, setSelectedLength] = useState("15m");
  const [qty, setQty] = useState(1); // ✅ quantity starts from 1

  // ✅ Calculate price based on size & length
  const rawPrice = product.rates[selectedSize][selectedLength];
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : Number(String(rawPrice).replace(/[^\d.]/g, "")) || 0;

  // 🛒 Handle Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price: price,              // ✅ numeric price for cart
      displayPrice: rawPrice,    // (optional) original string
      size: selectedSize,
      length: selectedLength,
      color: null,
      thickness: null,
      quantity: qty,             // ✅ send quantity to cart
    };

    addToCart(cartItem);
    alert(
      `${product.name} (${selectedSize}, ${selectedLength}) x ${qty} added to cart 🛒`
    );
  };

  const handleIncrease = () => {
    setQty((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1)); // minimum 1
  };

  const handleQtyInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setQty(1);
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) {
      setQty(num);
    }
  };

  return (
    <div className="zebra-page-wrapper">
      {/* === PRODUCT DETAILS SECTION === */}
      <div className="zebra-page">
        {/* LEFT IMAGE GALLERY */}
        <div className="left-images">
          <div className="thumb-row">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={require(`../assets/${img}`)}
                alt={`${product.name} thumbnail ${i + 1}`}
                className={i === activeImage ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(i)}
                loading="lazy"
              />
            ))}
          </div>

          <div className="main-img-wrapper">
            <img
              src={require(`../assets/${product.images[activeImage]}`)}
              alt={product.name}
              className="main-img"
            />
          </div>
        </div>

        {/* RIGHT PRODUCT DETAILS */}
        <div className="right-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          {/* SELECT LENGTH */}
          <h4 className="section-label">Select Length</h4>
          <div className="options">
            {["15m", "30m"].map((length) => (
              <button
                key={length}
                type="button"
                className={
                  selectedLength === length ? "option-btn active" : "option-btn"
                }
                onClick={() => setSelectedLength(length)}
              >
                {length}
              </button>
            ))}
          </div>

          {/* SELECT SIZE */}
          <h4 className="section-label">Select Size</h4>
          <div className="options">
            {["25mm", "32mm"].map((size) => (
              <button
                key={size}
                type="button"
                className={
                  selectedSize === size ? "option-btn active" : "option-btn"
                }
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* PRICE (per unit) */}
          <h2 className="price">₹{price}</h2>

          {/* ✅ QUANTITY ROW ABOVE ADD TO CART */}
          <div className="qty-row">
            <button
              type="button"
              className="qty-btn qty-minus"
              onClick={handleDecrease}
            >
              −
            </button>

            <input
              type="number"
              className="qty-input"
              value={qty}
              onChange={handleQtyInputChange}
              min="1"
            />

            <button
              type="button"
              className="qty-btn qty-plus"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          {/* ✅ ADD TO CART BUTTON */}
          <button
            type="button"
            className="add-cart"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <p className="save">Additional Saving {product.save}</p>
        </div>
      </div>

      {/* === FEATURES SECTION === */}
      <div className="features-row">
  <div className="feature-box">
    <img src={require("../assets/genuine.png")} alt="Genuine" />
    <div className="feature-text">
      <span className="feature-main">Genuine Products</span>
    </div>
  </div>

  <div className="feature-box">
    <img src={require("../assets/support.png")} alt="Support" />
    <div className="feature-text">
      <span className="feature-main">Customer Support</span>
      </div>
  </div>

  <div className="feature-box">
    <img src={require("../assets/nonreturn.png")} alt="Non Returnable" />
    <div className="feature-text">
      <span className="feature-main">Non Returnable</span>
      </div>
  </div>
</div>
      {/* === RECOMMENDATION SECTION === */}
      <div className="recommend-section">
        <h2>Recommended Products</h2>

        <div className="recommend-grid">
          {product.recommendations.map((rec, i) => (
            <div key={i} className="recommend-card">
              <img
                src={require(`../assets/${rec.image}`)}
                alt={rec.name}
                className="recommend-img"
                loading="lazy"
              />
              <p className="rec-code">Code: {rec.code}</p>
              <h4 className="rec-name">{rec.name}</h4>
              <p className="rec-price">{rec.price}</p>
              <p className="rec-save">Additional Saving {rec.save}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => window.history.back()}
        >
          ← Back To Products
        </button>
      </div>
    </div>
  );
};

export default ZebraHosePage;
