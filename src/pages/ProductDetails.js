import React, { useState } from "react";
import { useParams, Link } from "react-router-dom"; // ✅ Link added
import { useCart } from "../context/CartContext";
import productData from "../data/productdetails.json";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = productData.find((item) => item.id === Number(id));

  const [activeImage, setActiveImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(0);
  const [selectedColor, setSelectedColor] = useState("GREEN");
  const [selectedSize, setSelectedSize] = useState("19mm");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back to Products
        </button>
      </div>
    );
  }

  /* 🔗 FIXED ROUTES FOR RECOMMENDATIONS (NO JSON) */
  const recommendationRoutes = [
    "/pipefitting", // Pipe Fitting
    "/boxes/a",     // Round Junction Box
    "/boxes/d",     // Deep Junction Box
    "/boxes/c",     // Fan Box
  ];

  const rawPrice =
    product?.thicknessOptions?.[selectedThickness]?.rates?.[selectedSize] ??
    product?.rates?.[selectedSize] ??
    0;

  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : Number(String(rawPrice).replace(/[^\d.]/g, "")) || 0;

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      code: product.code,
      image: product.images[activeImage],
      price,
      displayPrice: rawPrice,
      color: product.thicknessOptions ? selectedColor : null,
      thickness: product.thicknessOptions
        ? product.thicknessOptions[selectedThickness]?.label
        : null,
      size: selectedSize,
      length: product.length || null,
      quantity: qty,
    });

    alert(`${product.name} x ${qty} added to cart 🛒`);
  };

  return (
    <div className="flexible-page">
      {/* ================= PRODUCT SECTION ================= */}
      <div className="product-page">
        {/* LEFT – IMAGES */}
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

        {/* RIGHT – DETAILS */}
        <div className="right-info">
          <h1>{product.name}</h1>

          <p className="code">
            <strong>Code:</strong> {product.code}
          </p>

          <p className="length">
            <strong>Length:</strong> {product.length}
          </p>

          {product.thicknessOptions && (
            <>
              <h4>Select Color</h4>
              <div className="sizes">
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
              <div className="sizes">
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

          <h4>Select Size</h4>
          <div className="sizes">
            {Object.keys(
              product.rates ||
                product.thicknessOptions[selectedThickness].rates
            ).map((size) => (
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
          <img src={require("../assets/nonreturn.png")} alt="Non Returnable" />
          <span>Non Returnable</span>
        </div>
      </div>

      {/* ================= RECOMMENDED ================= */}
      <div className="recommend-section">
        <h2>Recommended Products</h2>

        <div className="recommend-grid">
          {product.recommendations.map((rec, i) => (
            <Link
              key={i}
              to={recommendationRoutes[i]}   // ✅ FIXED ROUTING
              className="recommend-link"
            >
              <div className="recommend-card">
                <img
                  src={require(`../assets/${rec.image}`)}
                  alt={rec.name}
                />
                <p className="rec-code">Code: {rec.code}</p>
                <h4>{rec.name}</h4>
                <p className="rec-price">{rec.price}</p>
                <p className="rec-save">Additional Saving {rec.save}</p>
              </div>
            </Link>
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
