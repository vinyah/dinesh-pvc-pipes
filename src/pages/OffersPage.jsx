import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageLoader";

// Same default offers structure so content stays consistent
const defaultOffers = [
  {
    id: "default-1",
    image: "p1a.png",
    badge: "10%",
    title: "PVC Pipe Combo",
    subtitle: "Ideal for home and small commercial projects",
    priceLabel: "₹6,300",
    oldPriceLabel: "₹7,000",
  },
  {
    id: "default-2",
    image: "pf3a.png",
    badge: "7%",
    title: "Reducer Fitting Pack",
    subtitle: "Bulk pack pricing for contractors",
    priceLabel: "₹3,200",
    oldPriceLabel: "₹3,600",
  },
  {
    id: "default-3",
    image: "boxA1.png",
    badge: "5%",
    title: "Round Junction Box (Pack of 10)",
    subtitle: "Save when you buy full box quantities",
    priceLabel: "₹1,800",
    oldPriceLabel: "₹2,000",
  },
  {
    id: "default-4",
    image: "fp1a.png",
    badge: "3%",
    title: "Flexible Pipe Roll",
    subtitle: "Introductory offer on selected sizes",
    priceLabel: "₹2,499",
    oldPriceLabel: "₹2,800",
  },
];

// Extra info to show like product details (code, length)
const offerMeta = {
  "default-1": { code: "9004", length: "100 mm" },
  "default-2": { code: "9103", length: "—" },
  "default-3": { code: "BX1001", length: "—" },
  "default-4": { code: "9201", length: "30 m" },
};

const parsePrice = (label) => {
  if (!label) return 0;
  const num = parseInt(String(label).replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
};

const OffersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [offers, setOffers] = useState(defaultOffers);
  const [highlightId, setHighlightId] = useState("");
  const [offerQuantities, setOfferQuantities] = useState({});

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

      if (mappedAdminOffers.length > 0) {
        setOffers(mappedAdminOffers);
      } else {
        setOffers(defaultOffers);
      }
    } catch {
      setOffers(defaultOffers);
    }
  }, []);

  // Determine which offer (if any) should be highlighted based on ?highlight=... in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("highlight") || "";
    setHighlightId(id);
  }, [location.search]);

  const handleAddOfferToCart = (offer) => {
    const meta = offerMeta[offer.id] || {};
    const price = parsePrice(offer.priceLabel);
     const qty = Number(offerQuantities[offer.id]) > 0 ? Number(offerQuantities[offer.id]) : 1;

    addToCart({
      name: offer.title,
      code: meta.code || "",
      length: meta.length || "",
      image: offer.image,
      price,
      size: "",
      color: "",
      thickness: "",
      quantity: qty,
      isOffer: true,
    });

    alert(`${offer.title} x ${qty} added to cart 🛒`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 pt-24 md:pt-28 pb-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Offers
        </h1>
        <p className="text-center text-gray-600 mb-10 text-sm md:text-base">
          Choose from our current offers. Prices shown below already include the
          special offer discount.
        </p>

        <div className="space-y-6">
          {offers.map((offer) => {
            const meta = offerMeta[offer.id] || {};
            const offerPrice = parsePrice(offer.priceLabel);
            const originalPrice = parsePrice(offer.oldPriceLabel);

            const isHighlighted = highlightId && highlightId === offer.id;
            const qty = Number(offerQuantities[offer.id]) > 0 ? Number(offerQuantities[offer.id]) : 1;

            return (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl shadow-sm px-5 py-4 md:px-8 md:py-6 flex flex-col md:flex-row items-start gap-5 md:gap-8 border-2 ${
                  isHighlighted ? "border-[#b30000]" : "border-gray-300"
                }`}
              >
                {/* Left: image */}
                <div className="w-full md:w-56 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl p-4 relative">
                  <img
                    src={getImageUrl(offer.image)}
                    alt={offer.title}
                    className="w-full h-full object-contain max-h-40"
                  />
                  {offer.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#b30000] text-white shadow">
                      {offer.badge}
                    </div>
                  )}
                </div>

                {/* Right: content */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {offer.title}
                    </h2>
                    {offer.subtitle && (
                      <p className="text-xs md:text-sm text-gray-600">
                        {offer.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Meta like product details */}
                  <div className="text-xs md:text-sm text-gray-700 space-y-1">
                    {meta.code && (
                      <p>
                        <span className="font-semibold">Code:</span>{" "}
                        {meta.code}
                      </p>
                    )}
                    {meta.length && (
                      <p>
                        <span className="font-semibold">Length:</span>{" "}
                        {meta.length}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Offer includes:</span>{" "}
                      1 unit (combo / pack as shown in the image)
                    </p>
                  </div>

                  {/* Prices row */}
                  {(offerPrice || originalPrice) && (
                    <div className="flex items-baseline gap-3 mt-2">
                      {offerPrice > 0 && (
                        <span className="text-xl md:text-2xl font-extrabold text-[#b30000]">
                          {offer.priceLabel}
                        </span>
                      )}
                      {originalPrice > 0 && (
                        <span className="text-sm md:text-base text-gray-400 line-through">
                          {offer.oldPriceLabel}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quantity selector */}
                  <div className="flex gap-2.5 my-1 items-center">
                    <button
                      type="button"
                      className="w-[30px] h-[30px] rounded-md border-2 border-[#b30000] bg-white text-[#b30000] hover:bg-[#b30000] hover:text-white transition-colors"
                      onClick={() =>
                        setOfferQuantities((prev) => {
                          const current = Number(prev[offer.id]) || 1;
                          const next = current > 1 ? current - 1 : 1;
                          return { ...prev, [offer.id]: next };
                        })
                      }
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setOfferQuantities((prev) => ({
                          ...prev,
                          [offer.id]: !Number.isNaN(val) && val > 0 ? val : 1,
                        }));
                      }}
                      className="w-12 h-7 text-center border-2 border-[#b30000] rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#b30000]"
                    />
                    <button
                      type="button"
                      className="w-[30px] h-[30px] rounded-md border-2 border-[#b30000] bg-white text-[#b30000] hover:bg-[#b30000] hover:text-white transition-colors"
                      onClick={() =>
                        setOfferQuantities((prev) => {
                          const current = Number(prev[offer.id]) || 1;
                          return { ...prev, [offer.id]: current + 1 };
                        })
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Bottom-right Add to Cart */}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddOfferToCart(offer)}
                      className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8c0000] transition-colors text-sm md:text-base"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-white text-[#b30000] border-2 border-[#b30000] rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm md:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;

