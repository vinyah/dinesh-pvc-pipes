// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";
import { getWishlist, toggleWishlist } from "../utils/wishlist";

// Sliding background images for hero section
const heroImages = ["p1c.png", "bg1.jpg", "bg2.webp", "bg4.webp", "bg5.avif"];

const ADMIN_PRODUCTS_KEY = "adminProducts";

// Normalize product link for dedupe: lowercase, no trailing slash, no query/hash, trim
function normalizeProductLink(url) {
  if (typeof url !== "string") return "";
  const u = url.trim().toLowerCase().replace(/\?.*$/, "").replace(/#.*$/, "").replace(/\/+$/, "");
  return u || "";
}

// Build featured categories from db: every single product (items + boxes + pipe fittings), no duplicates by link
function buildFeaturedCategories(dbData) {
  const seen = new Set();
  const list = [];
  const add = (item) => {
    const raw = item.to || item.link;
    const link = normalizeProductLink(raw);
    if (!link || seen.has(link)) return;
    seen.add(link);
    list.push({ ...item, to: raw });
  };

  const items = dbData?.pages?.items || [];
  const boxes = dbData?.pages?.boxes || [];
  const pipefitting = dbData?.pages?.pipefitting || [];

  items.forEach((item) => {
    if (item.name === "Boxes" || item.name === "Pipe Fittings") return;
    add({ id: `item-${item.id}`, title: item.name, image: item.image, to: item.link });
  });

  pipefitting.forEach((pf) => {
    add({ id: `pf-${pf.id}`, title: pf.name, image: pf.image, to: pf.link });
  });

  const boxImages = { 1: "boxA1.png", 2: "boxB1.png", 3: "boxC1.png", 4: "boxD1.png" };
  boxes.forEach((box) => {
    add({ id: `box-${box.id}`, title: box.name, image: boxImages[box.id] || box.image || "boxA1.png", to: box.link });
  });

  return list;
}

// Safe access to home data
const homeData = db?.pages?.home || {
  about: {
    introText: "Explore our wide range of high-performance piping solutions.",
    descText: "Quality PVC pipes for all your needs.",
    buttonText: "See Products"
  },
  products: [],
  apart: {
    images: []
  },
  accountSection: {
    signupText: "Don't have an Account?",
    signupButton: "Sign Up",
    loginText: "Got an Account?",
    loginButton: "Login"
  }
};

function Home({ setShowModal }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredVisibleCount, setFeaturedVisibleCount] = useState(4);
  const baseFeaturedCategories = React.useMemo(() => buildFeaturedCategories(db), []);
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOffers, setAdminOffers] = useState([]);
  const [wishlistLinks, setWishlistLinks] = useState(() => getWishlist().map((p) => p.link));
  const [clickedProduct, setClickedProduct] = useState(null);

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setWishlistLinks(getWishlist().map((p) => p.link));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (clickedProduct && !e.target.closest(".flagship-product")) {
        setClickedProduct(null);
      }
    };
    if (clickedProduct) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [clickedProduct]);

  // Change hero background image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Responsive visible count for featured categories carousel
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // Show 3 at a time on large screens so arrows are useful
        setFeaturedVisibleCount(3);
      } else if (width >= 768) {
        setFeaturedVisibleCount(2);
      } else {
        setFeaturedVisibleCount(1);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Load admin-created products so new products appear in featured categories
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setAdminProducts(parsed);
      }
    } catch {
      // ignore storage / JSON errors
    }
  }, []);

  // Load active promotions created from Admin/Superadmin for Offers section
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("adminPromotions");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const active = parsed.filter((p) => p && p.status !== "inactive");
      setAdminOffers(active);
    } catch {
      // ignore parse/storage errors
    }
  }, []);

  // Featured categories = each product exactly once. Map by normalized link so no repeats; dots use this length.
  const featuredCategories = React.useMemo(() => {
    const combined = [...baseFeaturedCategories];
    adminProducts.forEach((p, idx) => {
      const to = p.link || p.productLink || `/product/admin-${p.id ?? idx}`;
      combined.push({
        id: `admin-${p.id ?? idx}`,
        title: p.name || p.sku || "Product",
        image: p.image || "p1a.png",
        to,
      });
    });
    const byLink = new Map();
    combined.forEach((c) => {
      const link = normalizeProductLink(c.to);
      if (!link) return;
      if (!byLink.has(link)) byLink.set(link, c);
    });
    return Array.from(byLink.values());
  }, [adminProducts, baseFeaturedCategories]);

  // Helper function to get route based on product code
  const getProductRoute = (code) => {
    const routeMap = {
      "9201": "/flexiblepipe",      // Flexible Pipe
      "9103": "/pipefitting/c",     // PVC Reducer
      "9004": "/product/1"          // PVC Pipe
    };
    return routeMap[code] || "/items";
  };

  return (
    <div className="w-full min-h-screen">
      {/* === Section 1: Hero Banner === */}
      <section 
        className="relative w-full min-h-[700px] max-md:min-h-[500px] flex flex-col items-center md:justify-center max-md:justify-start overflow-hidden max-md:mt-0 max-md:pt-24 bg-black"
      >
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${getImageUrl(img)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'transparent',
              }}
            />
          ))}
        </div>
        
        {/* Left Bottom Corner Content */}
        <div className="absolute left-4 bottom-16 md:left-12 md:bottom-20 z-20 flex flex-col items-start">
          <button
            onClick={() => navigate("/items")}
            className="px-8 py-4 bg-[#b30000] text-white rounded-lg font-semibold text-lg md:text-xl hover:bg-[#8b0000] transition-colors shadow-lg"
          >
            Explore Products
          </button>
        </div>

        {/* Carousel dots - small circles at bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentImageIndex(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentImageIndex
                  ? "w-3 h-3 bg-white shadow-md scale-110"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* === Section 2: About === */}
      <section 
        className="relative w-full py-16 md:py-24 px-4 md:px-8 bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("pipe-background.png")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Headline - Large, bold, black, centered, spans 4 lines */}
          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 md:mb-8 text-black leading-tight px-2">
            {homeData.about.introText || "Explore our wide range of high-performance piping solutions designed for strength, reliability, and durability."}
          </h2>
          
          {/* Sub-headline - Smaller, grey, centered, spans 3 lines */}
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
            {homeData.about.descText?.replace("Million Plast", "Dinesh PVC Pipes") || "From plumbing and agriculture to industrial infrastructure, Dinesh PVC Pipes offers comprehensive piping solutions that meet the highest standards of quality and performance."}
          </p>

          {/* CTA Button - White background, black text, red border, centered, clickable */}
          <button 
            className="px-8 md:px-12 py-3 md:py-4 bg-white border-2 border-[#b30000] text-black rounded-lg font-semibold text-sm md:text-base lg:text-lg hover:bg-[#b30000] hover:text-white transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/items")}
          >
            {homeData.about.buttonText || "See What We Offer"}
          </button>
        </div>
      </section>

      {/* === Section 3: Featured Categories === */}
      <section 
        className="relative w-full py-16 px-4 bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("BGred.png")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Featured Categories
          </h1>

          {/* Descriptive Text */}
          <p className="text-center mb-12 text-xl md:text-2xl text-white italic font-serif font-light tracking-wider leading-relaxed">
            Quality piping products across essential categories
          </p>

          {/* Featured Categories Carousel */}
          <div className="relative max-w-sm md:max-w-7xl mx-auto">
            {/* Left Arrow */}
            {featuredIndex > 0 && (
              <button
                type="button"
                onClick={() => setFeaturedIndex((prev) => Math.max(0, prev - 1))}
                className="flex absolute -left-4 md:left-[-3rem] top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 text-[#b30000] shadow-md items-center justify-center hover:bg-white transition-colors z-10"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Arrow */}
            {featuredIndex < Math.max(0, featuredCategories.length - featuredVisibleCount) && (
              <button
                type="button"
                onClick={() =>
                  setFeaturedIndex((prev) =>
                    Math.min(
                      Math.max(0, featuredCategories.length - featuredVisibleCount),
                      prev + 1
                    )
                  )
                }
                className="flex absolute -right-4 md:right-[-3rem] top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 text-[#b30000] shadow-md items-center justify-center hover:bg-white transition-colors z-10"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Cards grid - equal spacing between all containers */}
            <div
              className={`grid gap-6 md:gap-8 ${
                featuredVisibleCount === 1
                  ? "grid-cols-1"
                  : featuredVisibleCount === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {featuredCategories
                .slice(
                  featuredIndex,
                  featuredIndex + featuredVisibleCount
                )
                .map((cat, i) => (
                  <div key={`${normalizeProductLink(cat.to)}-${i}`} className="relative max-w-xs mx-auto w-full">
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, { id: cat.id, name: cat.title, link: cat.to, image: cat.image })}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-400 hover:text-[#b30000] transition-colors"
                      aria-label={wishlistLinks.includes(cat.to) ? "Remove from wish list" : "Add to wish list"}
                    >
                      <Heart className={`w-5 h-5 ${wishlistLinks.includes(cat.to) ? "fill-[#b30000] text-[#b30000]" : ""}`} />
                    </button>
                    <Link to={cat.to} className="block no-underline">
                      <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                        <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 pt-6 pb-4">
                          <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 flex items-center justify-center">
                            <img
                              src={
                                typeof cat.image === "string" && cat.image.startsWith("data:")
                                  ? cat.image
                                  : getImageUrl(cat.image)
                              }
                              alt={cat.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="bg-white px-5 pt-4 pb-5 flex flex-col gap-2">
                          <div className="text-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                              {cat.title}
                            </h3>
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

            {/* Dot indicators - only when more than one page (can be 5, 6, or any number); no fixed count */}
            {(() => {
              const totalPages = Math.max(
                1,
                Math.ceil(featuredCategories.length / featuredVisibleCount)
              );
              const currentPage = Math.min(
                Math.floor(featuredIndex / featuredVisibleCount),
                totalPages - 1
              );
              if (totalPages <= 1) return null;
              return (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() =>
                        setFeaturedIndex(
                          Math.min(
                            i * featuredVisibleCount,
                            Math.max(
                              0,
                              featuredCategories.length - featuredVisibleCount
                            )
                          )
                        )
                      }
                      className={`rounded-full transition-all duration-300 ${
                        i === currentPage
                          ? "w-3 h-3 bg-white shadow-md scale-110"
                          : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* === Section 4: Flagship Products === */}
      <section className="w-full py-16 px-4 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
          Flagship Products
        </h1>

        {/* Descriptive Text */}
        <p className="text-center mb-12 text-xl md:text-2xl text-black italic font-serif font-light tracking-wider leading-relaxed">
          Showcasing our most trusted essentials
        </p>

        <style>{`
          .flagship-outer { perspective: 1000px; }
          .flagship-card-inner {
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .flagship-card-inner.flipped {
            transform: rotateY(180deg);
          }
          .flagship-face {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .flagship-back {
            transform: rotateY(180deg);
          }
        `}</style>
        <div className="max-w-4xl lg:max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* PVC Pipe - only inner container rotates; outer dark frame stays fixed */}
          <div className="flagship-product aspect-square cursor-pointer relative" onClick={() => setClickedProduct(clickedProduct === "pvc" ? null : "pvc")}>
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#273038] p-4 pointer-events-none" aria-hidden="true" />
            <div className="flagship-outer absolute inset-0 p-4">
              <div className={`flagship-card-inner relative w-full h-full ${clickedProduct === "pvc" ? "flipped" : ""}`}>
                <div className="flagship-face absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <img src={getImageUrl("p1a.png")} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flagship-face flagship-back absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <img src={getImageUrl("p1a.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center p-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">PVC Pipe</h3>
                    <p className="text-white text-base md:text-lg mb-4">Reliable PVC pipes for every project</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate("/product/1"); }}>EXPLORE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reducer Fitting */}
          <div className="flagship-product aspect-square cursor-pointer relative" onClick={() => setClickedProduct(clickedProduct === "reducer" ? null : "reducer")}>
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#273038] p-4 pointer-events-none" aria-hidden="true" />
            <div className="flagship-outer absolute inset-0 p-4">
              <div className={`flagship-card-inner relative w-full h-full ${clickedProduct === "reducer" ? "flipped" : ""}`}>
                <div className="flagship-face absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <img src={getImageUrl("pf3a.png")} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flagship-face flagship-back absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <img src={getImageUrl("pf3a.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center p-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Reducer Fitting</h3>
                    <p className="text-white text-base md:text-lg mb-4">Seamless pipe size reduction solutions</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate("/pipefitting/c"); }}>EXPLORE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Round Junction Box */}
          <div className="flagship-product aspect-square cursor-pointer relative" onClick={() => setClickedProduct(clickedProduct === "box" ? null : "box")}>
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#273038] p-4 pointer-events-none" aria-hidden="true" />
            <div className="flagship-outer absolute inset-0 p-4">
              <div className={`flagship-card-inner relative w-full h-full ${clickedProduct === "box" ? "flipped" : ""}`}>
                <div className="flagship-face absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <img src={getImageUrl("boxA1.png")} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flagship-face flagship-back absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <img src={getImageUrl("boxA1.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center p-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Round Junction Box</h3>
                    <p className="text-white text-base md:text-lg mb-4">Secure and neat wiring solutions</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate("/boxes/a"); }}>EXPLORE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flexible Pipe */}
          <div className="flagship-product aspect-square cursor-pointer relative" onClick={() => setClickedProduct(clickedProduct === "flexible" ? null : "flexible")}>
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#273038] p-4 pointer-events-none" aria-hidden="true" />
            <div className="flagship-outer absolute inset-0 p-4">
              <div className={`flagship-card-inner relative w-full h-full ${clickedProduct === "flexible" ? "flipped" : ""}`}>
                <div className="flagship-face absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <img src={getImageUrl("fp1a.png")} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flagship-face flagship-back absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <img src={getImageUrl("fp1a.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center p-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Flexible Pipe</h3>
                    <p className="text-white text-base md:text-lg mb-4">Flexible piping for easy installation</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate("/flexiblepipe"); }}>EXPLORE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipe Bend */}
          <div className="flagship-product aspect-square cursor-pointer relative" onClick={() => setClickedProduct(clickedProduct === "pipebend" ? null : "pipebend")}>
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#273038] p-4 pointer-events-none" aria-hidden="true" />
            <div className="flagship-outer absolute inset-0 p-4">
              <div className={`flagship-card-inner relative w-full h-full ${clickedProduct === "pipebend" ? "flipped" : ""}`}>
                <div className="flagship-face absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <img src={getImageUrl("pb1.png")} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flagship-face flagship-back absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <img src={getImageUrl("pb1.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center p-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Pipe Bend</h3>
                    <p className="text-white text-base md:text-lg mb-4">Smooth directional changes with reliable bends</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate("/pipebend"); }}>EXPLORE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fan Box */}
          <div className="flagship-product aspect-square cursor-pointer relative" onClick={() => setClickedProduct(clickedProduct === "fanbox" ? null : "fanbox")}>
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#273038] p-4 pointer-events-none" aria-hidden="true" />
            <div className="flagship-outer absolute inset-0 p-4">
              <div className={`flagship-card-inner relative w-full h-full ${clickedProduct === "fanbox" ? "flipped" : ""}`}>
                <div className="flagship-face absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  <img src={getImageUrl("boxC1.png")} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flagship-face flagship-back absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <img src={getImageUrl("boxC1.png")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center p-4">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Fan Box</h3>
                    <p className="text-white text-base md:text-lg mb-4">Durable fan box for safe ceiling mounting</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); navigate("/boxes/c"); }}>EXPLORE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Section 5: Offers === */}
      <section 
        className="w-full py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("BGred.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-white">
            Offers
          </h2>
          <p className="text-center mb-10 text-base md:text-lg text-white italic">
            Special prices on selected Dinesh PVC Pipes products
          </p>

          {(() => {
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

            const mappedAdminOffers = adminOffers
              .slice(0, 4)
              .map((p, idx) => ({
                id: `admin-${p.id ?? idx}`,
                image: p.image || defaultOffers[idx % defaultOffers.length].image,
                badge: p.category || "Offer",
                title: p.title || "Promotion",
                subtitle: p.description || "",
                priceLabel: p.reach ? `Reach: ${p.reach}` : "",
                oldPriceLabel: "",
              }));

            const offersToShow =
              mappedAdminOffers.length > 0 ? mappedAdminOffers : defaultOffers;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {offersToShow.map((offer) => (
                  <Link
                    key={offer.id}
                    to={`/offers?highlight=${encodeURIComponent(offer.id)}`}
                    className="block no-underline"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer h-full flex flex-col">
                      <div className="relative w-full h-52 bg-gray-50 flex items-center justify-center">
                        <img
                          src={getImageUrl(offer.image)}
                          alt={offer.title}
                          className="w-full h-full object-contain"
                        />
                        {offer.badge && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#b30000] text-white shadow">
                            {offer.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-1 flex-1 flex flex-col">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {offer.title}
                        </h3>
                        {offer.subtitle && (
                          <p className="text-xs text-gray-500">
                            {offer.subtitle}
                          </p>
                        )}
                        {(offer.priceLabel || offer.oldPriceLabel) && (
                          <div className="flex items-baseline gap-2 mt-2 mt-auto">
                            {offer.priceLabel && (
                              <span className="text-lg font-bold text-[#b30000]">
                                {offer.priceLabel}
                              </span>
                            )}
                            {offer.oldPriceLabel && (
                              <span className="text-xs text-gray-400 line-through">
                                {offer.oldPriceLabel}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()}

          <div className="mt-10 flex justify-center">
            <Link
              to="/offers"
              className="inline-flex items-center px-6 py-2.5 rounded-full border-2 border-white text-white font-semibold text-sm md:text-base hover:bg-white hover:text-[#b30000] transition-colors"
            >
              Explore Offers
            </Link>
          </div>
        </div>
      </section>

      {/* === Section 6: What Sets Us Apart === */}
      <section className="relative w-full py-16 px-4 overflow-hidden bg-white">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            What Sets Us Apart
          </h1>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {(homeData.apart?.images || []).map((img, i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg shadow-md p-4 md:p-6 aspect-[3/2] md:aspect-[3/2] flex items-center justify-center hover:shadow-lg hover:border-2 hover:border-[#b30000] hover:-translate-y-2 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <img src={getImageUrl(img)} alt="Apart" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
        </div>
      </section>

    </div>
  );
}

export default Home;

