import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import flexibleData from "../data/flexiblepipe.json";
import "./FlexiblePipePage.css";

const FlexiblePipePage = () => {
  const { addToCart } = useCart();
  const product = flexibleData[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("16mm");
  const [qty, setQty] = useState(1);

  // ✅ Get numeric price
  const getUnitPrice = () => {
    const raw = product.rates[selectedSize];
    if (typeof raw === "number") return raw;
    const num = Number(String(raw).replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const price = getUnitPrice();

  // 🛒 Add to cart
  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price,
      displayPrice: product.rates[selectedSize],
      size: selectedSize,
      length: product.length,
      quantity: qty,
    });

    alert(`${product.name} (${selectedSize}) x ${qty} added to cart 🛒`);
  };

  return (
    <div className="flexible-page">
      {/* ================= PRODUCT SECTION ================= */}
      <div className="product-page">
        {/* 🔥 LEFT – IMAGE DOMINANT */}
        <div className="product-images">
          <div className="thumbs">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={require(`../assets/${img}`)}
                alt="thumb"
                className={i === activeImage ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>

          <div className="main-image">
            <img
              src={require(`../assets/${product.images[activeImage]}`)}
              alt={product.name}
            />
          </div>
        </div>

        {/* 👉 RIGHT – COMPACT DETAILS */}
        <div className="right-info">
          <h1>{product.name}</h1>

          <p className="code">
            <strong>Code:</strong> {product.code}
          </p>

          <p className="length">
            <strong>Length:</strong> {product.length}
          </p>

          <h3>Select Size</h3>
          <div className="sizes">
            {Object.keys(product.rates).map((size) => (
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

          {/* QTY */}
          <div className="qty">
            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          <button className="add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <p className="saving">Additional Saving 2.1%</p>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="features-row">
        <div className="feature-box">
          <img src={require("../assets/genuine.png")} alt="Genuine" />
          <span>Genuine Products</span>
        </div>

        <div className="feature-box">
          <img src={require("../assets/support.png")} alt="Support" />
          <span>Customer Support</span>
        </div>

        <div className="feature-box">
          <img src={require("../assets/nonreturn.png")} alt="Non Return" />
          <span>Non Returnable</span>
        </div>
      </div>

      {/* ================= RECOMMENDED ================= */}
      <div className="recommend-section">
        <h2>Recommended Products</h2>

        <div className="recommend-grid">
          {product.recommendations.map((rec, i) => (
            <div key={i} className="recommend-card">
              <img
                src={require(`../assets/${rec.image}`)}
                alt={rec.name}
              />
              <p className="rec-code">Code: {rec.code}</p>
              <h4>{rec.name}</h4>
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

export default FlexiblePipePage;
