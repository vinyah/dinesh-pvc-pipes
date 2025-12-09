import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ Import global Cart Context
import boxBData from "../data/boxB.json";
import "./BoxPageB.css";

const BoxPageB = () => {
  const { addToCart } = useCart(); // ✅ Access global addToCart
  const product = boxBData[0]; // Only one product

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1); // ✅ quantity starts from 1

  // 🧮 Helper: ensure numeric unit price
  const getUnitPrice = () => {
    const rawPrice = product.price;

    if (typeof rawPrice === "number") return rawPrice;

    if (typeof rawPrice === "string") {
      // remove everything except digits and decimal point
      const cleaned = rawPrice.replace(/[^\d.]/g, "");
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }

    return 0;
  };

  // 🛒 Handle Add to Cart
  const handleAddToCart = () => {
    const unitPrice = getUnitPrice();

    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price: unitPrice,              // ✅ numeric price for calculations
      displayPrice: product.price,   // (optional) original display string
      size: null,
      color: null,
      thickness: null,
      length: null,
      quantity: qty,                 // ✅ send quantity to cart
    };

    addToCart(cartItem);
    alert(`${product.name} x ${qty} added to cart 🛒`);
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
      <div className="boxB-page">
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

          {/* PRICE (per unit – show original from JSON) */}
          <h2 className="price">₹{product.price}</h2>

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

export default BoxPageB;
