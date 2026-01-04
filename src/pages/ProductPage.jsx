import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";

// Route to db.json key mapping
const productDataMap = {
  boxa: { key: "boxA", type: "array" },
  boxb: { key: "boxB", type: "array" },
  boxc: { key: "boxC", type: "array" },
  boxd: { key: "boxD", type: "array" },
  braidedhose: { key: "braidedHose", type: "array" },
  flexiblepipe: { key: "flexiblepipe", type: "array" },
  pipebend: { key: "pipebend", type: "array" },
  pipefittinga: { key: "pipefittingA", type: "array" },
  pipefittingb: { key: "pipefittingB", type: "array" },
  pipefittingc: { key: "pipefittingC", type: "array" },
  productdetails: { key: "productdetails", type: "id" },
  zebrahose: { key: "zebraHose", type: "array" },
};

// Recommendation routes mapping
const recommendationRoutesMap = {
  boxa: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  boxb: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  boxc: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  boxd: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  braidedhose: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  flexiblepipe: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  pipebend: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  pipefittinga: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  pipefittingb: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  pipefittingc: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  productdetails: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
  zebrahose: ["/pipefitting", "/boxes/a", "/boxes/d", "/boxes/c"],
};

// Legacy route to product type mapping
const legacyRouteMap = {
  "/boxes/a": "boxa",
  "/boxes/b": "boxb",
  "/boxes/c": "boxc",
  "/boxes/d": "boxd",
  "/pipefitting/a": "pipefittinga",
  "/pipefitting/b": "pipefittingb",
  "/pipefitting/c": "pipefittingc",
  "/flexiblepipe": "flexiblepipe",
  "/braidedhose": "braidedhose",
  "/zebrahose": "zebrahose",
  "/pipebend": "pipebend",
};

const ProductPage = () => {
  const { productType, id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle legacy routes by checking pathname
  let actualProductType = productType?.toLowerCase();
  if (!actualProductType && location.pathname) {
    actualProductType = legacyRouteMap[location.pathname];
  }
  
  // Handle /product/:id route (ProductDetails)
  if (!actualProductType && id) {
    actualProductType = "productdetails";
  }

  // Get product data based on route
  const productConfig = productDataMap[actualProductType];
  
  if (!productConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-2xl font-semibold mb-4">Product Type Not Found</h2>
        <button 
          className="mt-4 px-5 py-2.5 bg-[#b30000] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
          onClick={() => navigate("/items")}
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  // ✅ Hooks must be called before any conditional returns
  const [activeImage, setActiveImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(0);
  const [selectedColor, setSelectedColor] = useState("GREEN");
  const [selectedSize, setSelectedSize] = useState("19mm");
  const [qty, setQty] = useState(1);

  const productData = db?.products?.[productConfig.key];
  let product = null;

  if (!productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-2xl font-semibold mb-4">Product Data Not Found</h2>
        <button 
          className="mt-4 px-5 py-2.5 bg-[#b30000] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
          onClick={() => navigate("/items")}
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  if (productConfig.type === "id" && id) {
    product = productData.find((item) => item.id === Number(id));
  } else if (productConfig.type === "array") {
    product = productData && productData.length > 0 ? productData[0] : null;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <button 
          className="mt-4 px-5 py-2.5 bg-[#b30000] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
          onClick={() => navigate("/items")}
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const recommendationRoutes = recommendationRoutesMap[actualProductType] || [];

  // Handle different price structures
  const getPrice = () => {
    if (product.thicknessOptions) {
      return product.thicknessOptions[selectedThickness]?.rates?.[selectedSize] ?? 
             product.rates?.[selectedSize] ?? 0;
    }
    if (product.rates) {
      return product.rates[selectedSize] ?? 0;
    }
    if (product.price) {
      if (typeof product.price === "number") return product.price;
      if (typeof product.price === "string") {
        const cleaned = product.price.replace(/[^\d.]/g, "");
        return Number(cleaned) || 0;
      }
    }
    return 0;
  };

  const rawPrice = getPrice();
  const price = typeof rawPrice === "number" 
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
      thickness: product.thicknessOptions ? product.thicknessOptions[selectedThickness]?.label : null,
      size: product.rates || product.thicknessOptions ? selectedSize : null,
      length: product.length || null,
      quantity: qty,
    });

    alert(`${product.name} x ${qty} added to cart 🛒`);
  };

  const handlePreviousImage = () => {
    setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full m-0 py-6 px-14 box-border font-['Poppins',sans-serif] bg-white max-md:py-4 max-md:px-1.5 max-md:overflow-x-hidden max-md:w-full max-md:max-w-screen">
      {/* Back Button (if needed) */}
      {actualProductType === "boxa" && (
        <button 
          className="mb-4 px-5 py-2.5 bg-[#b30000] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
          onClick={() => navigate("/boxes")}
        >
          ← Back
        </button>
      )}

      {/* ================= PRODUCT SECTION ================= */}
      <div className="grid grid-cols-2 gap-11 w-full items-start content-start max-md:grid-cols-1 max-md:w-full max-md:max-w-full max-md:gap-5">
        {/* LEFT – IMAGES */}
        <div className="flex flex-col gap-4.5 max-md:-mt-2.5 md:-mt-2.5">
          <div className="relative flex items-center gap-2.5 max-md:gap-1.5">
            <button 
              className="bg-white/90 border-2 border-[#b30000] text-[#b30000] w-10 h-10 rounded-full text-2xl font-bold cursor-pointer flex items-center justify-center transition-all z-10 flex-shrink-0 leading-none hover:bg-[#b30000] hover:text-white hover:scale-110 active:scale-95 max-md:w-9 max-md:h-9 max-md:text-[22px]"
              onClick={handlePreviousImage}
            >
              &lt;
            </button>
            <div className="h-[410px] rounded-2xl border border-gray-200 p-3.5 flex-1 relative max-md:h-[300px]">
              <img
                src={getImageUrl(product.images[activeImage])}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <button 
              className="bg-white/90 border-2 border-[#b30000] text-[#b30000] w-10 h-10 rounded-full text-2xl font-bold cursor-pointer flex items-center justify-center transition-all z-10 flex-shrink-0 leading-none hover:bg-[#b30000] hover:text-white hover:scale-110 active:scale-95 max-md:w-9 max-md:h-9 max-md:text-[22px]"
              onClick={handleNextImage}
            >
              &gt;
            </button>
          </div>

          <div className="flex flex-row gap-2.5 justify-center flex-nowrap items-center w-full max-md:gap-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt="thumb"
                className={`w-[68px] h-[68px] rounded-lg cursor-pointer border transition-opacity max-md:w-[60px] max-md:h-[60px] ${
                  i === activeImage 
                    ? "opacity-100 border-2 border-[#b30000]" 
                    : "opacity-60 border border-gray-300 hover:opacity-100 hover:border-2 hover:border-[#b30000]"
                }`}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <div className="flex flex-col items-start pt-0 -mt-2.5 self-start max-md:w-full max-md:px-1.5 max-md:box-border max-md:flex max-md:flex-col max-md:visible max-md:overflow-visible max-md:max-w-full max-md:min-w-0 md:-mt-2.5">
          <h1 className="text-[23px] font-semibold mb-0.5 text-black mt-0 pt-0">{product.name}</h1>

          <p className="text-base my-0.5 text-black font-normal w-full">
            <strong>Code:</strong> {product.code}
          </p>

          {product.length && (
            <p className="text-base my-0.5 text-black font-normal w-full">
              <strong>Length:</strong> {product.length}
            </p>
          )}

          {product.thicknessOptions && (
            <>
              <h4 className="text-base my-1 mb-0.5">Select Color</h4>
              <div className="flex flex-wrap gap-2.5">
                {["GREEN", "BLUE", "BLACK", "RED GOLD", "GOLD"].map((color) => (
                  <button
                    key={color}
                    className={`px-3 py-1 h-8 rounded-lg border text-sm cursor-pointer transition-colors ${
                      selectedColor === color
                        ? "bg-[#b30000] text-white border-[#b30000]"
                        : "bg-white border-gray-400 text-black hover:border-[#b30000]"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>

              <h4 className="text-base my-1 mb-0.5">Select Thickness</h4>
              <div className="flex flex-wrap gap-2.5">
                {product.thicknessOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 h-8 rounded-lg border text-sm cursor-pointer transition-colors ${
                      selectedThickness === i
                        ? "bg-[#b30000] text-white border-[#b30000]"
                        : "bg-white border-gray-400 text-black hover:border-[#b30000]"
                    }`}
                    onClick={() => setSelectedThickness(i)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {(product.rates || product.thicknessOptions) && (
            <>
              <h4 className="text-base my-1 mb-0.5">Select Size</h4>
              <div className="flex flex-wrap gap-2.5">
                {Object.keys(
                  product.rates || product.thicknessOptions[selectedThickness].rates
                ).map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 h-8 rounded-lg border text-sm cursor-pointer transition-colors ${
                      selectedSize === size
                        ? "bg-[#b30000] text-white border-[#b30000]"
                        : "bg-white border-gray-400 text-black hover:border-[#b30000]"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="text-[#b30000] text-[22px] font-bold my-1">₹{price}</div>

          <div className="flex gap-2.5 my-1">
            <button 
              className="w-[30px] h-[30px] rounded-md border-2 border-[#b30000] bg-white text-[#b30000] hover:bg-[#b30000] hover:text-white transition-colors"
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            >
              −
            </button>
            <span className="flex items-center">{qty}</span>
            <button 
              className="w-[30px] h-[30px] rounded-md border-2 border-[#b30000] bg-white text-[#b30000] hover:bg-[#b30000] hover:text-white transition-colors"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>

          <button 
            className="w-full py-2.5 px-2.5 bg-[#b30000] text-white rounded-lg border-none mt-1 hover:bg-[#8b0000] transition-colors max-md:w-full max-md:max-w-full max-md:my-3 max-md:mt-3 max-md:block max-md:box-border max-md:py-2.5 max-md:px-3 max-md:text-[15px] max-md:overflow-hidden max-md:whitespace-nowrap"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <p className="text-green-600 text-xs mt-1">
            Additional Saving {product.save || "2.1%"}
          </p>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-2.5 py-2 mt-10">
        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <img src={getImageUrl("genuine.png")} alt="Genuine" className="w-12 h-12" />
          <span className="text-base font-semibold whitespace-nowrap">Genuine Products</span>
        </div>

        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <img src={getImageUrl("support.png")} alt="Support" className="w-12 h-12" />
          <span className="text-base font-semibold whitespace-nowrap">Customer Support</span>
        </div>

        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <img src={getImageUrl("nonreturn.png")} alt="Non Returnable" className="w-12 h-12" />
          <span className="text-base font-semibold whitespace-nowrap">Non Returnable</span>
        </div>
      </div>

      {/* ================= RECOMMENDED ================= */}
      {product.recommendations && product.recommendations.length > 0 && (
        <div className="mt-8 pb-5 w-full overflow-visible max-md:flex max-md:flex-col max-md:items-center max-md:w-full max-md:px-3.5 max-md:box-border">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#b30000] text-center max-md:text-center max-md:w-full max-md:mx-auto max-md:mb-4">Recommended Products</h2>

          <div className="grid grid-cols-4 gap-6 w-full max-w-6xl mx-auto box-border max-md:grid-cols-2 max-md:gap-4 max-md:justify-items-stretch max-md:items-stretch max-md:mx-auto max-md:max-w-full max-md:px-3.5 max-md:box-border max-[420px]:grid-cols-1">
            {product.recommendations.map((rec, i) => (
              <Link
                key={i}
                to={recommendationRoutes[i] || "#"}
                className="no-underline text-inherit block hover:no-underline"
              >
                <div className="border border-gray-300 rounded-xl p-4 flex flex-col justify-between h-full min-h-[350px] bg-white box-border max-md:h-full max-md:min-h-[350px] max-md:w-full max-md:max-w-full max-md:flex max-md:flex-col max-md:box-border">
                  <img
                    src={getImageUrl(rec.image)}
                    alt={rec.name}
                    className="w-full h-[180px] object-contain"
                  />
                  <p className="text-base text-black mt-2">Code: {rec.code}</p>
                  <h4 className="text-lg my-2 text-black no-underline font-semibold">{rec.name}</h4>
                  <p className="text-lg font-semibold text-[#b30000]">{rec.price}</p>
                  <p className="text-sm text-green-600 mt-1">Additional Saving {rec.save || "2.1%"}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button 
              className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg border-none cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
              onClick={() => navigate("/items")}
            >
              ← Back To Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

