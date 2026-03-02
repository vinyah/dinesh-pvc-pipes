import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../utils/wishlist";
import { getImageUrl } from "../utils/imageLoader";

export default function WishListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getWishlist());
  }, []);

  const handleRemove = (e, link) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(link);
    setItems(getWishlist());
  };

  return (
    <div className="w-full bg-white py-8 px-4 md:px-8 min-h-screen max-md:pt-24 md:pt-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Wish List
        </h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Your wish list is empty.</p>
            <p className="text-sm text-gray-500 mb-6">
              Like products with the heart icon to add them here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/items")}
              className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.link} className="relative group">
                <Link
                  to={item.link}
                  className="block no-underline"
                >
                  <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 pt-4 pb-3">
                      <div className="w-40 h-40 flex items-center justify-center">
                        <img
                          src={
                            typeof item.image === "string" && item.image.startsWith("data:")
                              ? item.image
                              : getImageUrl(item.image)
                          }
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="bg-white px-5 pt-4 pb-5">
                      <h3 className="text-base font-semibold text-gray-900 truncate text-center">
                        {item.name}
                      </h3>
                      <div className="flex justify-center mt-2">
                        <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-[#b30000] text-[#b30000] text-xs font-semibold bg-white">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, item.link)}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-[#b30000] hover:bg-red-50 transition-colors"
                  aria-label="Remove from wish list"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
