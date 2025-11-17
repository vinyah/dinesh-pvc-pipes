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

  // 🔹 Find product based on ID
  const product = productData.find((item) => item.id === Number(id));

  // 🔹 Handle missing product
  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>Product Not Found</h2>
        <button
          className="back-btn"
          onClick={() => window.history.back()}
          style={{ marginTop: "20px" }}
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  // 🔹 Calculate price safely
  const pricePerUnit =
    product?.thicknessOptions?.[selectedThickness]?.rates?.[selectedSize] || 0;

  // 🧩 Build cart item (used by Add to Cart button)
  const handleAddToCart = () => {
    const cartItem = {
      name: product.name,
      code: product.code,
      image: product.images?.[activeImage],
      price: pricePerUnit,
      color: product.thicknessOptions ? selectedColor : null,
      size: selectedSize || null,
      thickness:
        product.thicknessOptions?.[selectedThickness]?.label || null,
      length: product.length || null,
    };

    addToCart(cartItem);
    alert(`${product.name} added to cart 🛒`);
  };

  return (
    <div>
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
              />
            ))}
          </div>

          <img
            src={require(`../assets/${product.images[activeImage]}`)}
            alt="main-product"
            className="main-img"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="right-info">
          <h2>{product.name}</h2>
          <p className="product-code">
            <strong>Code:</strong> {product.code}
          </p>
          <p className="product-length">
            <strong>Length:</strong> {product.length}
          </p>

          {/* Optional Color + Thickness */}
          {product.thicknessOptions && (
            <>
              <h4>Select Color</h4>
              <div className="options">
                {["GREEN", "BLUE", "BLACK", "RED GOLD", "GOLD"].map((color) => (
                  <button
                    key={color}
                    className={selectedColor === color ? "active" : ""}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>

              <h4>Select Thickness</h4>
              <div className="options">
                {product.thicknessOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={selectedThickness === i ? "active" : ""}
                    onClick={() => setSelectedThickness(i)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* SIZE SELECTION */}
          <h4>Select Size</h4>
          <div className="options">
            <button
              className={selectedSize === "19mm" ? "active" : ""}
              onClick={() => setSelectedSize("19mm")}
            >
              19MM
            </button>
            <button
              className={selectedSize === "25mm" ? "active" : ""}
              onClick={() => setSelectedSize("25mm")}
            >
              25MM
            </button>
          </div>

          {/* PRICE */}
          <h2 className="price">₹{pricePerUnit}</h2>

          {/* ADD TO CART */}
          <button className="add-cart" onClick={handleAddToCart}>
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

export default ProductDetails;
