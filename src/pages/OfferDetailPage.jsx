import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageLoader";

// Same default offers as Home.jsx so IDs and content match
const defaultOffers = [
  {
    id: "default-1",
    image: "p1a.png",
    badge: "10% OFF",
    title: "PVC Pipe Combo",
    subtitle: "Ideal for home and small commercial projects",
    priceLabel: "₹6,300",
    oldPriceLabel: "₹7,000",
  },
  {
    id: "default-2",
    image: "pf3a.png",
    badge: "Combo Offer",
    title: "Reducer Fitting Pack",
    subtitle: "Bulk pack pricing for contractors",
    priceLabel: "₹3,200",
    oldPriceLabel: "₹3,600",
  },
  {
    id: "default-3",
    image: "boxA1.png",
    badge: "Limited Time",
    title: "Round Junction Box (Pack of 10)",
    subtitle: "Save when you buy full box quantities",
    priceLabel: "₹1,800",
    oldPriceLabel: "₹2,000",
  },
  {
    id: "default-4",
    image: "fp1a.png",
    badge: "New",
    title: "Flexible Pipe Roll",
    subtitle: "Introductory offer on selected sizes",
    priceLabel: "₹2,499",
    oldPriceLabel: "₹2,800",
  },
];

const OfferDetailPage = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    try {
      let adminOffers = [];
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("adminPromotions");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            adminOffers = parsed.filter((p) => p && p.status !== "inactive");
          }
        }
      }

      const mappedAdminOffers = adminOffers.slice(0, 4).map((p, idx) => ({
        id: `admin-${p.id ?? idx}`,
        image: p.image || defaultOffers[idx % defaultOffers.length].image,
        badge: p.category || "Offer",
        title: p.title || "Promotion",
        subtitle: p.description || "",
        priceLabel: p.offerPrice || p.priceLabel || "",
        oldPriceLabel: p.originalPrice || p.oldPriceLabel || "",
      }));

      const offersToShow =
        mappedAdminOffers.length > 0 ? mappedAdminOffers : defaultOffers;

      const found = offersToShow.find(
        (o) => String(o.id) === String(offerId)
      );
      setOffer(found || null);
    } catch {
      setOffer(null);
    }
  }, [offerId]);

  if (!offer) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-24 md:pt-28">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            Offer not found
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This offer may have expired or been removed.
          </p>
          <button
            type="button"
            onClick={() => navigate("/#offers")}
            className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8c0000] transition-colors"
          >
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pt-24 md:pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image + badge */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="relative w-full bg-gray-50 flex items-center justify-center p-6 md:p-10">
            <img
              src={getImageUrl(offer.image)}
              alt={offer.title}
              className="w-full h-full object-contain max-h-[360px]"
            />
            {offer.badge && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#b30000] text-white shadow">
                {offer.badge}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {offer.title}
            </h1>
            {offer.subtitle && (
              <p className="text-sm md:text-base text-gray-600">
                {offer.subtitle}
              </p>
            )}
          </div>

          {/* Prices: original struck, offer highlighted */}
          {(offer.priceLabel || offer.oldPriceLabel) && (
            <div className="flex items-baseline gap-3">
              {offer.priceLabel && (
                <span className="text-2xl md:text-3xl font-extrabold text-[#b30000]">
                  {offer.priceLabel}
                </span>
              )}
              {offer.oldPriceLabel && (
                <span className="text-sm md:text-base text-gray-400 line-through">
                  {offer.oldPriceLabel}
                </span>
              )}
            </div>
          )}

          <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-2">
            <p>
              This special offer gives you the same trusted quality at an
              exclusive discounted price. Quantities may be limited and prices
              are valid only while the offer is active.
            </p>
            <p>
              For exact specifications, sizes, and compatibility, please refer
              to the product listings in the catalog or contact our sales team.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/#offers")}
              className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8c0000] transition-colors"
            >
              Back to Offers
            </button>
            <button
              type="button"
              onClick={() => navigate("/items")}
              className="px-5 py-2.5 bg-white text-[#b30000] border-2 border-[#b30000] rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailPage;

