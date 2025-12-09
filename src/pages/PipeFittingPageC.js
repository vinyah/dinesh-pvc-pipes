import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ Import Cart Context
import fittingData from "../data/pipefittingC.json";
import "./PipeFittingPageC.css";

const PipeFittingPageC = () => {
  const { addToCart } = useCart(); // ✅ Use global addToCart
  const product = fittingData[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("19x25mm");
  const [qty, setQty] = useState(1); // ✅ quantity starts from 1

  // ✅ Price for selected size (ensure numeric)
  const rawPrice = product.rates[selectedSize];
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
      price: price,            // ✅ numeric price for calculations
      displayPrice: rawPrice,  // (optional) original string
      size: selectedSize,
      color: null,
      thickness: null,
      length: null,
      quantity: qty,           // ✅ send quantity to cart
    };

    addToCart(cartItem);
    alert(`${product.name} (${selectedSize}) x ${qty} added to cart 🛒`);
  };

  const handleIncrease = () => {
    setQty((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1)); // min 1
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
    <div className="pipefittingC-page-wrapper">
      {/* === SECTION 1 - PRODUCT DETAILS === */}
      <div className="product-page">
        {/* LEFT IMAGES */}
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

        {/* RIGHT INFO */}
        <div className="right-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          {/* SELECT SIZE */}
          <h4 className="section-label">Select Size</h4>
          <div className="options">
            {Object.keys(product.rates).map((size) => (
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

          {/* ✅ ADD TO CART */}
          <button
            type="button"
            className="add-cart"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <p className="save">Additional Saving 2.1%</p>
        </div>
      </div>

      {/* === FEATURES SECTION === */}
      <div className="features-row">
        <div className="feature-box">
          <img src={require("../assets/genuine.png")} alt="Genuine" />
          <h4>Genuine</h4>
          <p>Products</p>
        </div>

        <div className="feature-box">
          <img src={require("../assets/support.png")} alt="Support" />
          <h4>Customer</h4>
          <p>Support</p>
        </div>

        <div className="feature-box">
          <img src={require("../assets/nonreturn.png")} alt="Non Returnable" />
          <h4>Non</h4>
          <p>Returnable</p>
        </div>
      </div>

      {/* === RECOMMENDED PRODUCTS === */}
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
          ← Back To Pipe Fittings
        </button>
      </div>
    </div>
  );
};

export default PipeFittingPageC;
