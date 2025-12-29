import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import fittingData from "../data/pipefittingB.json";
import "./PipeFittingPageB.css";

const PipeFittingPageB = () => {
  const { addToCart } = useCart();
  const product = fittingData[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("19mm");
  const [qty, setQty] = useState(1);

  /* ===== PRICE ===== */
  const rawPrice = product.rates[selectedSize];
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : Number(String(rawPrice).replace(/[^\d.]/g, "")) || 0;

  /* ===== ADD TO CART ===== */
  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price,
      displayPrice: rawPrice,
      size: selectedSize,
      quantity: qty,
    });

    alert(`${product.name} (${selectedSize}) x ${qty} added to cart 🛒`);
  };

  const handleIncrease = () => setQty((q) => q + 1);
  const handleDecrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleQtyInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) setQty(val);
  };

  return (
    /* 🔥 TRUE FULL WIDTH PAGE (NO CONTAINER) */
    <div className="pipefittingC-page-wrapper">

      {/* ================= PRODUCT SECTION ================= */}
      <section className="product-page">

        {/* LEFT IMAGES */}
        <div className="left-images">
          <div className="thumb-row">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={require(`../assets/${img}`)}
                alt="thumbnail"
                className={`thumb ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>

          <img
            src={require(`../assets/${product.images[activeImage]}`)}
            alt={product.name}
            className="main-img"
          />
        </div>

        {/* RIGHT INFO */}
        <div className="right-info">
          <h2>{product.name}</h2>

          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          <h4>Select Size</h4>
          <div className="options">
            {["19mm", "25mm"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="price">₹{price}</div>

          {/* QUANTITY */}
          <div className="qty-row">
            <button className="qty-btn" onClick={handleDecrease}>−</button>

            <input
              type="number"
              className="qty-input"
              value={qty}
              min="1"
              onChange={handleQtyInputChange}
            />

            <button className="qty-btn" onClick={handleIncrease}>+</button>
          </div>

          <button className="add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <p className="save">Additional Saving 2.1%</p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-row">
        <div className="feature-box">
          <img src={require("../assets/genuine.png")} alt="Genuine" />
          <span className="feature-main">Genuine Products</span>
        </div>

        <div className="feature-box">
          <img src={require("../assets/support.png")} alt="Support" />
          <span className="feature-main">Customer Support</span>
        </div>

        <div className="feature-box">
          <img src={require("../assets/nonreturn.png")} alt="Non Returnable" />
          <span className="feature-main">Non Returnable</span>
        </div>
      </section>

      {/* ================= RECOMMENDED ================= */}
      <section className="recommend-section">
        <h2>Recommended Products</h2>

        <div className="recommend-grid">
          {product.recommendations.map((rec, i) => (
            <div key={i} className="recommend-card">
              <img
                src={require(`../assets/${rec.image}`)}
                alt={rec.name}
              />
              <p className="rec-code">Code: {rec.code}</p>
              <h4 className="rec-name">{rec.name}</h4>
              <p className="rec-price">{rec.price}</p>
              <p className="rec-save">Additional Saving {rec.save}</p>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back To Pipe Fittings
        </button>
      </section>
    </div>
  );
};

export default PipeFittingPageB;
