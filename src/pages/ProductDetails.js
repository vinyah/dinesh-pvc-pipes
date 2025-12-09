import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ Cart context import
import productData from "../data/productdetails.json";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart(); // ✅ Access global addToCart function

  // 🔹 Hooks
  const [activeImage, setActiveImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(0);
  const [selectedColor, setSelectedColor] = useState("GREEN");
  const [selectedSize, setSelectedSize] = useState("19mm");
  const [qty, setQty] = useState(1); // ✅ quantity starts from 1

  // 🔹 Find product based on ID
  const product = productData.find((item) => item.id === Number(id));

  // 🔹 Handle missing product
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <button
          className="back-btn"
          onClick={() => window.history.back()}
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  // 🔹 Get raw price (supports both thicknessOptions and simple rates)
  const rawPrice =
    product?.thicknessOptions?.[selectedThickness]?.rates?.[selectedSize] ??
    product?.rates?.[selectedSize] ??
    0;

  // 🔹 Ensure numeric price
  const pricePerUnit =
    typeof rawPrice === "number"
      ? rawPrice
      : Number(String(rawPrice).replace(/[^\d.]/g, "")) || 0;

  // ➕ quantity handlers
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

  // 🧩 Build cart item (used by Add to Cart button)
  const handleAddToCart = () => {
    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images?.[activeImage],
      price: pricePerUnit, // ✅ numeric price
      displayPrice: rawPrice, // optional original format
      color: product.thicknessOptions ? selectedColor : null,
      size: selectedSize || null,
      thickness: product.thicknessOptions
        ? product.thicknessOptions?.[selectedThickness]?.label || null
        : null,
      length: product.length || null,
      quantity: qty, // ✅ send quantity to cart
    };

    addToCart(cartItem);
    alert(`${product.name} x ${qty} added to cart 🛒`);
  };

  return (
    <div className="product-details-wrapper">
      {/* === SECTION 1: PRODUCT DETAILS === */}
      <div className="product-page">
        {/* LEFT IMAGES */}
        <div className="left-images">
          <div className="thumb-row">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={require(`../assets/${img}`)}
                alt={`thumbnail-${i}`}
                className={i === activeImage ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(i)}
                loading="lazy"
              />
            ))}
          </div>

          <div className="main-img-wrapper">
            <img
              src={require(`../assets/${product.images[activeImage]}`)}
              alt="main-product"
              className="main-img"
            />
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="right-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>
          <p className="product-length">
            <strong>Length:</strong> {product.length}
          </p>

          {/* Optional Color + Thickness */}
          {product.thicknessOptions && (
            <>
              <h4 className="section-label">Select Color</h4>
              <div className="options">
                {["GREEN", "BLUE", "BLACK", "RED GOLD", "GOLD"].map(
                  (color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        selectedColor === color
                          ? "option-btn active"
                          : "option-btn"
                      }
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  )
                )}
              </div>

              <h4 className="section-label">Select Thickness</h4>
              <div className="options">
                {product.thicknessOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={
                      selectedThickness === i
                        ? "option-btn active"
                        : "option-btn"
                    }
                    onClick={() => setSelectedThickness(i)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* SIZE SELECTION */}
          <h4 className="section-label">Select Size</h4>
          <div className="options">
            <button
              type="button"
              className={
                selectedSize === "19mm" ? "option-btn active" : "option-btn"
              }
              onClick={() => setSelectedSize("19mm")}
            >
              19MM
            </button>
            <button
              type="button"
              className={
                selectedSize === "25mm" ? "option-btn active" : "option-btn"
              }
              onClick={() => setSelectedSize("25mm")}
            >
              25MM
            </button>
          </div>

          {/* PRICE (per unit) */}
          <h2 className="price">₹{pricePerUnit}</h2>

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

          {/* ADD TO CART */}
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

      {/* === SECTION 2: FEATURES === */}
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

      {/* === SECTION 3: RECOMMENDATIONS === */}
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

export default ProductDetails;
