import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";
import { getWishlist, toggleWishlist } from "../utils/wishlist";

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

  let actualProductType = productType?.toLowerCase();
  if (!actualProductType && location.pathname) {
    actualProductType = legacyRouteMap[location.pathname];
  }
  if (!actualProductType && id) {
    actualProductType = "productdetails";
  }

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

  const [activeImage, setActiveImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(0);
  const [selectedColor, setSelectedColor] = useState("GREEN");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [qty, setQty] = useState(1);
  const [wishlistLinks, setWishlistLinks] = useState(() => getWishlist().map((p) => p.link));

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

  useEffect(() => {
    if (product) {
      let availableSizes = [];
      let hasNestedRates = false;

      if (product.thicknessOptions && product.thicknessOptions[selectedThickness]?.rates) {
        availableSizes = Object.keys(product.thicknessOptions[selectedThickness].rates);
      } else if (product.rates) {
        availableSizes = Object.keys(product.rates);
        if (availableSizes.length > 0 && typeof product.rates[availableSizes[0]] === "object" && !Array.isArray(product.rates[availableSizes[0]])) {
          hasNestedRates = true;
        }
      }

      if (availableSizes.length > 0) {
        if (!availableSizes.includes(selectedSize) || !selectedSize || selectedSize === "") {
          setSelectedSize(availableSizes[0]);
          if (hasNestedRates && product.rates[availableSizes[0]]) {
            const availableLengths = Object.keys(product.rates[availableSizes[0]]);
            if (availableLengths.length > 0) setSelectedLength(availableLengths[0]);
          }
        } else if (hasNestedRates && product.rates[selectedSize]) {
          const availableLengths = Object.keys(product.rates[selectedSize]);
          if (availableLengths.length > 0 && !availableLengths.includes(selectedLength)) {
            setSelectedLength(availableLengths[0]);
          }
        }
      } else {
        setSelectedSize("");
        setSelectedLength("");
      }
    }
  }, [product, selectedThickness, selectedSize]);

  const getPrice = () => {
    if (product.thicknessOptions && product.thicknessOptions[selectedThickness]?.rates) {
      return product.thicknessOptions[selectedThickness].rates[selectedSize] ?? 0;
    }
    if (product.rates) {
      if (selectedSize && product.rates[selectedSize] && typeof product.rates[selectedSize] === "object" && !Array.isArray(product.rates[selectedSize])) {
        return product.rates[selectedSize][selectedLength] ?? 0;
      }
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
  const price = typeof rawPrice === "number" ? rawPrice : Number(String(rawPrice).replace(/[^\d.]/g, "")) || 0;

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
      length: selectedLength || product.length || null,
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

  const productLink = location.pathname || `/product/${product.id}`;
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      link: productLink,
      image: product.images?.[0] || product.image,
    });
    setWishlistLinks(getWishlist().map((p) => p.link));
  };

  return (
    <div className="w-full m-0 py-6 px-14 box-border font-['Poppins',sans-serif] bg-white max-md:py-4 max-md:px-1.5 max-md:overflow-x-hidden max-md:w-full max-md:max-w-screen max-md:pt-32 md:pt-28">
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
        <div className="flex flex-col gap-4.5 max-md:mt-12 md:-mt-2.5">
          <div className="relative flex items-center gap-2.5 max-md:gap-1.5">
            <button
              className="bg-white/90 border-2 border-[#b30000] text-[#b30000] w-10 h-10 rounded-full text-2xl font-bold cursor-pointer flex items-center justify-center transition-all z-10 flex-shrink-0 leading-none hover:bg-[#b30000] hover:text-white hover:scale-110 active:scale-95 max-md:w-9 max-md:h-9 max-md:text-[22px]"
              onClick={handlePreviousImage}
            >
              &lt;
            </button>
            <div className="h-[410px] rounded-2xl border border-gray-200 p-3.5 flex-1 relative max-md:h-[300px] max-md:pt-8">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-400 hover:text-[#b30000] transition-colors"
                aria-label={wishlistLinks.includes(productLink) ? "Remove from wish list" : "Add to wish list"}
              >
                <Heart className={`w-5 h-5 ${wishlistLinks.includes(productLink) ? "fill-[#b30000] text-[#b30000]" : ""}`} />
              </button>
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

          {product.rates && Object.keys(product.rates).length > 0 && typeof product.rates[Object.keys(product.rates)[0]] === "object" && !Array.isArray(product.rates[Object.keys(product.rates)[0]]) ? (
            <>
              <h4 className="text-base my-1 mb-0.5">Select Size</h4>
              <div className="flex flex-wrap gap-2.5">
                {Object.keys(product.rates).map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 h-8 rounded-lg border text-sm cursor-pointer transition-colors ${
                      selectedSize === size
                        ? "bg-[#b30000] text-white border-[#b30000]"
                        : "bg-white border-gray-400 text-black hover:border-[#b30000]"
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      const lengths = Object.keys(product.rates[size]);
                      if (lengths.length > 0) setSelectedLength(lengths[0]);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {selectedSize && product.rates[selectedSize] && (
                <>
                  <h4 className="text-base my-1 mb-0.5">Select Length</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.keys(product.rates[selectedSize]).map((length) => (
                      <button
                        key={length}
                        className={`px-3 py-1 h-8 rounded-lg border text-sm cursor-pointer transition-colors ${
                          selectedLength === length
                            ? "bg-[#b30000] text-white border-[#b30000]"
                            : "bg-white border-gray-400 text-black hover:border-[#b30000]"
                        }`}
                        onClick={() => setSelectedLength(length)}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (product.rates || product.thicknessOptions) && (
            <>
              <h4 className="text-base my-1 mb-0.5">Select Size</h4>
              <div className="flex flex-wrap gap-2.5">
                {Object.keys(product.rates || product.thicknessOptions[selectedThickness].rates).map((size) => (
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

          <div className="flex gap-2.5 my-1 items-center">
            <button
              className="w-[30px] h-[30px] rounded-md border-2 border-[#b30000] bg-white text-[#b30000] hover:bg-[#b30000] hover:text-white transition-colors"
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (Number.isNaN(val) || val <= 0) setQty(1);
                else setQty(val);
              }}
              className="w-12 h-7 text-center border-2 border-[#b30000] rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#b30000]"
            />
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
          <img src={getImageUrl("nonreturn.png")} alt="Returnable" className="w-12 h-12" />
          <span className="text-base font-semibold whitespace-nowrap">Returnable</span>
        </div>
      </div>

      {/* ================= RECOMMENDED ================= */}
      {product.recommendations && product.recommendations.length > 0 && (
        <div className="mt-8 pb-5 w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#b30000] text-center">
            Recommended Products
          </h2>

          {/* Desktop: 4-col grid | Mobile: horizontal scroll */}
          <div className="hidden md:grid grid-cols-4 gap-5 w-full max-w-6xl mx-auto">
            {product.recommendations.map((rec, i) => (
              <Link key={i} to={recommendationRoutes[i] || "#"} className="no-underline block">
                <div className="relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg hover:outline hover:outline-2 hover:outline-[#b30000] transition-all duration-300" style={{ height: "280px" }}>
                  <img src={getImageUrl(rec.image)} alt={rec.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h4 className="text-white text-base font-bold text-center px-4 drop-shadow-lg">{rec.name}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {product.recommendations.map((rec, i) => (
              <Link key={i} to={recommendationRoutes[i] || "#"} className="no-underline flex-shrink-0 w-64 snap-start block">
                <div className="relative rounded-2xl overflow-hidden cursor-pointer shadow-sm" style={{ height: "280px" }}>
                  <img src={getImageUrl(rec.image)} alt={rec.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h4 className="text-white text-base font-bold text-center px-4 drop-shadow-lg">{rec.name}</h4>
                  </div>
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

      {/* ================= REVIEWS ================= */}
      <ReviewsSection productName={product.name} />
    </div>
  );
};

/* ── Standalone Reviews Section ── */
const STARS = [1, 2, 3, 4, 5];

function StarRow({ value, onChange, size = "w-7 h-7" }) {
  const [hovered, setHovered] = React.useState(0);
  return (
    <div className="flex gap-1">
      {STARS.map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="focus:outline-none"
        >
          <svg className={size} viewBox="0 0 24 24" fill={(hovered || value) >= s ? "#b30000" : "none"} stroke="#b30000" strokeWidth="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ productName }) {
  const storageKey = `reviews_${productName?.replace(/\s+/g, "_")}`;

  const [reviews, setReviews] = React.useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [
        { id: 1, name: "Ramesh K.", rating: 5, date: "Feb 2025", comment: "Excellent quality pipes, exactly as described. Highly recommend!" },
        { id: 2, name: "Suresh M.", rating: 4, date: "Jan 2025", comment: "Good product, fast delivery. Will buy again." },
        { id: 3, name: "Priya D.", rating: 5, date: "Dec 2024", comment: "Very durable and fits perfectly. Great value for money." },
      ];
    } catch { return []; }
  });

  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!rating) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setError("");
    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating,
      date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      comment: comment.trim(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
    setName(""); setRating(0); setComment("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="mt-12 pb-10 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#b30000]">Customer Reviews</h2>
        <div className="flex items-center gap-2 md:ml-4">
          <span className="text-4xl font-bold text-gray-900">{avgRating}</span>
          <div className="flex flex-col">
            <div className="flex gap-0.5">
              {STARS.map((s) => (
                <svg key={s} className="w-5 h-5" viewBox="0 0 24 24" fill={parseFloat(avgRating) >= s ? "#b30000" : "none"} stroke="#b30000" strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Existing reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
              </div>
              <div className="flex gap-0.5">
                {STARS.map((s) => (
                  <svg key={s} className="w-4 h-4" viewBox="0 0 24 24" fill={r.rating >= s ? "#b30000" : "none"} stroke="#b30000" strokeWidth="1.5">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Write a review */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#b30000]"
          />
          <div>
            <p className="text-sm text-gray-600 mb-1.5">Your rating</p>
            <StarRow value={rating} onChange={setRating} />
          </div>
          <textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#b30000] resize-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          {submitted && <p className="text-xs text-green-600 font-medium">✓ Review submitted! Thank you.</p>}
          <button
            onClick={handleSubmit}
            className="self-start px-6 py-2.5 bg-[#b30000] text-white rounded-lg text-sm font-semibold hover:bg-[#8b0000] transition-colors"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;