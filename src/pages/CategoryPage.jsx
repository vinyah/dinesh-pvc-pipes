import React, { useState, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";
import { getWishlist, toggleWishlist } from "../utils/wishlist";

// Route to db.json key mapping and page configuration
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

// Legacy route to category type mapping
const legacyCategoryRouteMap = {
  "/items": "items",
  "/boxes": "boxes",
  "/pipefitting": "pipefitting",
};

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

  // Handle legacy routes by checking pathname
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

  // Handle missing or empty data
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
      {/* Header Section - Special styling for items page */}
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
          <p className="text-base md:text-lg text-gray-600">
            {categoryConfig.subheading}
          </p>
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
                  aria-label={wishlistLinks.includes(item.link) ? "Remove from wish list" : "Add to wish list"}
                >
                  <Heart className={`w-5 h-5 ${wishlistLinks.includes(item.link) ? "fill-[#b30000] text-[#b30000]" : ""}`} />
                </button>
                <Link to={item.link} className="block no-underline">
                  <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 pt-4 pb-3">
                      <div className="w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 flex items-center justify-center">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="bg-white px-5 pt-4 pb-5 flex flex-col gap-2">
                      <div className="text-center">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {item.code && (
                          <p className="text-xs md:text-sm text-gray-500 mt-1">
                            {item.code}
                          </p>
                        )}
                      </div>
                      <div className="h-px w-full bg-gray-200 mt-1 mb-2" />
                      <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-[#b30000] text-[#b30000] text-xs md:text-sm font-semibold bg-white hover:bg-[#b30000] hover:text-white transition-colors">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`mx-auto ${
          actualCategoryType === "pipefitting" 
            ? "max-w-6xl" 
            : "max-w-4xl"
        }`}>
          {/* Pipefitting: 3 cards in a row, Boxes: 2x2 grid */}
          <div className={`grid ${
            actualCategoryType === "pipefitting" 
              ? "grid-cols-1 md:grid-cols-3 gap-6" 
              : "grid-cols-1 sm:grid-cols-2 gap-6"
          }`}>
            {categoryData.map((item) => (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, { id: item.id, name: item.name, link: item.link, image: item.image })}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-400 hover:text-[#b30000] transition-colors"
                  aria-label={wishlistLinks.includes(item.link) ? "Remove from wish list" : "Add to wish list"}
                >
                  <Heart className={`w-5 h-5 ${wishlistLinks.includes(item.link) ? "fill-[#b30000] text-[#b30000]" : ""}`} />
                </button>
                <Link to={item.link} className="block no-underline">
                  <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 pt-4 pb-3">
                      <div className="w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 flex items-center justify-center">
                        <img
                          src={
                            typeof item.image === "string" && item.image.startsWith("data:")
                              ? item.image
                              : getImageUrl(item.image)
                          }
                          alt={item.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="bg-white px-5 pt-4 pb-5 flex flex-col gap-2">
                      <div className="text-center">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {item.code && (
                          <p className="text-xs md:text-sm text-gray-500 mt-1">
                            {item.code}
                          </p>
                        )}
                      </div>
                      <div className="h-px w-full bg-gray-200 mt-1 mb-2" />
                      <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-[#b30000] text-[#b30000] text-xs md:text-sm font-semibold bg-white hover:bg-[#b30000] hover:text-white transition-colors">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button - Centered at bottom */}
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
