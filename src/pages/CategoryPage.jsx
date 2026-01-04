import React from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";

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
    <div className="w-full bg-white py-8 px-4 md:px-8 min-h-screen">
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
              <Link
                key={item.id}
                to={item.link}
                className="block no-underline"
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                  {/* Image/Icon Section */}
                  <div className="flex items-center justify-center p-6 pt-10 flex-1 bg-transparent group">
                    <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 flex items-center justify-center">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:-translate-y-2"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  {/* Red Button */}
                  <div className="px-4 pb-4">
                    <div className="w-full bg-[#b30000] text-white text-center py-3 px-4 rounded-lg font-semibold text-sm md:text-base hover:bg-[#8b0000] transition-colors">
                      {item.name}
                    </div>
                  </div>
                </div>
              </Link>
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
              <Link
                key={item.id}
                to={item.link}
                className="block no-underline"
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                  {/* Product Image */}
                  <div className="flex items-center justify-center p-6 pt-8 flex-1 bg-transparent">
                    <div className="w-full h-48 md:h-56 flex items-center justify-center">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  {/* Red Banner/Button */}
                  <div className="px-4 pb-4">
                    <div className="w-full bg-[#b30000] text-white text-center py-3 px-4 rounded-lg font-semibold text-sm md:text-base hover:bg-[#8b0000] transition-colors">
                      {item.name}
                    </div>
                  </div>
                </div>
              </Link>
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
