import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ Import the global cart context
import fittingData from "../data/pipefittingA.json";
import "./PipeFittingPageA.css";

const PipeFittingPageA = () => {
  const { addToCart } = useCart(); // ✅ Access addToCart from Cart Context
  const product = fittingData[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("19mm");

  // ✅ Get the price based on the selected size
  const price = product.rates[selectedSize];

  // 🛒 Handle Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price: price,
      size: selectedSize,
      color: null,
      thickness: null,
      length: null,
    };

    addToCart(cartItem);
    alert(`${product.name} (${selectedSize}) added to cart 🛒`);
  };

  return (
    <div>
      {/* === SECTION 1 - PRODUCT DETAILS === */}
      <div className="product-page">
        {/* LEFT IMAGE SECTION */}
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

        {/* RIGHT PRODUCT INFO */}
        <div className="right-info">
          <h2>{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          {/* SIZE OPTIONS */}
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

          {/* PRICE */}
          <h2 className="price">₹{price}</h2>

          {/* ✅ ADD TO CART BUTTON */}
          <button className="add-cart" onClick={handleAddToCart}>
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

      {/* === RECOMMENDED PRODUCTS SECTION === */}
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
          ← Back To Pipe Fittings
        </button>
      </div>
    </div>
  );
};

export default PipeFittingPageA;
