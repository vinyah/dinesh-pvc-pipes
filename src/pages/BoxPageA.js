import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import boxAData from "../data/boxA.json";
import "./BoxPageA.css";

const BoxPageA = () => {
  const { addToCart } = useCart();

  const product = boxAData && boxAData.length > 0 ? boxAData[0] : null;

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="boxA-wrapper">
        <h2>Product not available</h2>
      </div>
    );
  }

  const getUnitPrice = (rawPrice) => {
    if (typeof rawPrice === "number") return rawPrice;
    if (typeof rawPrice === "string") {
      const cleaned = rawPrice.replace(/[^\d.]/g, "");
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const unitPrice = getUnitPrice(product.price);

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price: unitPrice,
      quantity: qty,
    });

    alert(`${product.name} x ${qty} added to cart 🛒`);
  };

  return (
    <div className="boxA-wrapper">
      {/* ================= PRODUCT SECTION ================= */}
      <div className="boxA-page">
        {/* LEFT SIDE – IMAGES */}
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
            alt={product.name}
            className="main-img"
          />
        </div>

        {/* RIGHT SIDE – DETAILS (TOP ALIGNED) */}
        <div className="right-info">
          <h2>{product.name}</h2>

          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>

          <h2 className="price">₹{unitPrice}</h2>

          {/* QUANTITY */}
          <div className="qty-row">
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            >
              −
            </button>

            <span>{qty}</span>

            <button
              type="button"
              className="qty-btn"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button className="add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <p className="save">Additional Saving {product.save}</p>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="features-row">
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
      </div>

      {/* ================= RECOMMENDED ================= */}
      <div className="recommend-section">
        <h2>Recommended Products</h2>

        <div className="recommend-grid">
          {product.recommendations.map((rec, i) => (
            <div key={i} className="recommend-card">
              <img src={require(`../assets/${rec.image}`)} alt={rec.name} />
              <p className="rec-code">Code: {rec.code}</p>
              <h4>{rec.name}</h4>
              <p className="rec-price">{rec.price}</p>
              <p className="rec-save">Additional Saving {rec.save}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxPageA;
