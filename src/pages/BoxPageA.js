import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ Import Cart Context
import boxAData from "../data/boxA.json";
import "./BoxPageA.css";

const BoxPageA = () => {
  const { addToCart } = useCart(); // ✅ Access global addToCart function
  const product = boxAData[0]; // Only one item
  const [activeImage, setActiveImage] = useState(0);

  // 🛒 Handle Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price: product.price,
      size: null,
      color: null,
      thickness: null,
      length: null,
    };

    addToCart(cartItem);
    alert(`${product.name} added to cart 🛒`);
  };

  return (
    <div>
      {/* === PRODUCT DETAILS SECTION === */}
      <div className="boxA-page">
        {/* LEFT IMAGES */}
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

        {/* RIGHT DETAILS */}
        <div className="right-info">
          <h2>{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          {/* PRICE */}
          <h2 className="price">₹{product.price}</h2>

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

export default BoxPageA;

