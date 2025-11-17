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

  // ✅ Calculate price based on size & length
  const price = product.rates[selectedSize][selectedLength];

  // 🛒 Handle Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price: price,
      size: selectedSize,
      length: selectedLength,
      color: null,
      thickness: null,
    };

    addToCart(cartItem);
    alert(`${product.name} (${selectedSize}, ${selectedLength}) added to cart 🛒`);
  };

  return (
    <div>
      {/* === PRODUCT DETAILS SECTION === */}
      <div className="zebra-page">
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

          {/* PRICE */}
          <h2 className="price">₹{price}</h2>

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

export default ZebraHosePage;

