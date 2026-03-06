import React, { useState, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";
import { getWishlist, toggleWishlist } from "../utils/wishlist";

const categoryDataMap = {
  items: {
    key: "items",
    heading: "Explore Our Wide Range of Products",
    subheading: "Discover our comprehensive collection of high-quality PVC pipes and electrical fittings.",
    highlight: "Wide Range",
    emphasis: "comprehensive collection",
  },
  boxes: {
    key: "boxes",
    heading: "Explore Our Junction Boxes",
    subheading: "Discover our range of durable and high-quality electrical boxes suitable for every type of installation.",
    highlight: "Junction Boxes",
    emphasis: "durable and high-quality",
  },
  pipefitting: {
    key: "pipefitting",
    heading: "Explore Our Pipe Fittings",
    subheading: "Choose from our high-quality and durable pipe fittings.",
    highlight: "Pipe Fittings",
    emphasis: "high-quality",
  },
};

const legacyCategoryRouteMap = {
  "/items": "items",
  "/boxes": "boxes",
  "/pipefitting": "pipefitting",
};

/* Full-image card — image fills entire card, name centered on top with dark gradient overlay */
const FullImageCard = ({ src, alt, name, code }) => (
  <div className="relative w-full rounded-3xl overflow-hidden cursor-pointer" style={{ height: "280px" }}>
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    {/* Centered product name */}
    <div className="absolute inset-0 flex items-center justify-center">
      <h3 className="text-white text-lg font-bold text-center px-4 drop-shadow-lg">{name}</h3>
    </div>
  </div>
);

const CategoryPage = ({ setShowModal }) => {
  const { categoryType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistLinks, setWishlistLinks] = useState(() => getWishlist().map((p) => p.link));

  const handleToggleWishlist = useCallback((e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setWishlistLinks(getWishlist().map((p) => p.link));
  }, []);

  let actualCategoryType = categoryType?.toLowerCase();
  if (!actualCategoryType && location.pathname) {
    actualCategoryType = legacyCategoryRouteMap[location.pathname];
  }

  const categoryConfig = categoryDataMap[actualCategoryType];

  if (!categoryConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-2xl font-semibold mb-4">Category Not Found</h2>
        <button
          className="mt-4 px-5 py-2.5 bg-[#b30000] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const categoryData = db.pages[categoryConfig.key];

  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="w-full bg-white py-8 px-4 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          No {categoryConfig.highlight} Available
        </h2>
        <button
          className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#8b0000] transition-colors"
          onClick={() => navigate(actualCategoryType === "items" ? "/" : "/items")}
        >
          ← Back {actualCategoryType === "items" ? "to Home" : "to Products"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-8 px-4 md:px-8 min-h-screen max-md:pt-24 md:pt-20">
      {/* Header */}
      {actualCategoryType === "items" ? (
        <div className="w-full bg-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-black">Explore Our </span>
              <span className="text-[#b30000]">Wide Range</span>
              <span className="text-black"> of Products</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Discover our comprehensive collection of high-quality PVC pipes and electrical fittings.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-black">Explore Our </span>
            <span className="text-[#b30000]">{categoryConfig.highlight}</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600">{categoryConfig.subheading}</p>
        </div>
      )}

      {/* Product Grid */}
      {actualCategoryType === "items" ? (
        <div className="w-full bg-white py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryData.map((item) => (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, { id: item.id, name: item.name, link: item.link, image: item.image })}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-400 hover:text-[#b30000] transition-colors"
                >
                  <Heart className={`w-5 h-5 ${wishlistLinks.includes(item.link) ? "fill-[#b30000] text-[#b30000]" : ""}`} />
                </button>
                <Link to={item.link} className="block no-underline">
                  <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:outline hover:outline-2 hover:outline-[#b30000] transition-all duration-300 cursor-pointer">
                    <FullImageCard src={getImageUrl(item.image)} alt={item.name} name={item.name} code={item.code} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`mx-auto ${actualCategoryType === "pipefitting" ? "max-w-6xl" : "max-w-4xl"}`}>
          <div className={`grid ${actualCategoryType === "pipefitting" ? "grid-cols-1 md:grid-cols-3 gap-6" : "grid-cols-1 sm:grid-cols-2 gap-6"}`}>
            {categoryData.map((item) => (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, { id: item.id, name: item.name, link: item.link, image: item.image })}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-400 hover:text-[#b30000] transition-colors"
                >
                  <Heart className={`w-5 h-5 ${wishlistLinks.includes(item.link) ? "fill-[#b30000] text-[#b30000]" : ""}`} />
                </button>
                <Link to={item.link} className="block no-underline">
                  <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:outline hover:outline-2 hover:outline-[#b30000] transition-all duration-300 cursor-pointer">
                    <FullImageCard
                      src={typeof item.image === "string" && item.image.startsWith("data:") ? item.image : getImageUrl(item.image)}
                      alt={item.name}
                      name={item.name}
                      code={item.code}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {actualCategoryType !== "items" && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            className="px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
            onClick={() => navigate("/items")}
          >
            ← Back To Products
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;