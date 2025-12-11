import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ Import global Cart Context
import braidedData from "../data/braidedHose.json";
import "./BraidedHosePage.css";

const BraidedHosePage = () => {
  const { addToCart } = useCart(); // ✅ Get addToCart from global context
  const product = braidedData[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("25mm");
  const [selectedLength, setSelectedLength] = useState("15m");
  const [qty, setQty] = useState(1); // ✅ quantity starts from 1

  // ✅ Safely get price based on size & length
  const rawPrice =
    product?.rates?.[selectedSize]?.[selectedLength] ?? 0;

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
      price: price,           // ✅ numeric price for calculations
      displayPrice: rawPrice, // (optional) original price string
      size: selectedSize,
      length: selectedLength,
      color: null,
      thickness: null,
      quantity: qty,          // ✅ send quantity to cart
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
    <div>
      {/* === PRODUCT DETAILS SECTION === */}
      <div className="braided-page">
        {/* LEFT IMAGE GALLERY */}
        <div className="left-images">
          <div className="thumb-row">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={require(`../assets/${img}`)}
                alt="thumbnail"
                className={i === activeImage ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>

          <img
            src={require(`../assets/${product.images[activeImage]}`)}
            alt="main"
            className="main-img"
          />
        </div>

        {/* RIGHT PRODUCT DETAILS */}
        <div className="right-info">
          <h2>{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          {/* SELECT LENGTH */}
          <h4>Select Length</h4>
          <div className="options">
            {["15m", "30m"].map((length) => (
              <button
                key={length}
                className={selectedLength === length ? "active" : ""}
                onClick={() => setSelectedLength(length)}
              >
                {length}
              </button>
            ))}
          </div>

          {/* SELECT SIZE */}
          <h4>Select Size</h4>
          <div className="options">
            {["25mm", "32mm"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active" : ""}
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
          <button className="add-cart" onClick={handleAddToCart}>
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
              <img src={require(`../assets/${rec.image}`)} alt={rec.name} />
              <p className="rec-code">Code: {rec.code}</p>
              <h4 className="rec-name">{rec.name}</h4>
              <p className="rec-price">{rec.price}</p>
              <p className="rec-save">Additional Saving {rec.save}</p>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back To Products
        </button>
      </div>
    </div>
  );
};

export default BraidedHosePage;
