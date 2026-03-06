import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Package,
  User,
  Search,
  X,
} from "lucide-react";
import logo from "../assets/logo.png";
import db from "../../db.json";

const Header = ({ currentUser, setCurrentUser, openAuthModal, forceFixedBackground = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedInMenuHover, setLoggedInMenuHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerHover, setHeaderHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const products = db.products || [];

  // Returns true if the current path matches this nav item
  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  // Class helpers
  const desktopLinkClass = (to) =>
    `transition-colors font-medium text-sm uppercase ${
      isActive(to) ? "text-[#b30000]" : "text-white hover:text-[#b30000]"
    }`;

  const tabletLinkClass = (to) =>
    `py-3 md:py-3.5 text-xl md:text-2xl font-extrabold uppercase tracking-[0.12em] border-b border-white/15 transition-colors ${
      isActive(to) ? "text-[#b30000]" : "text-white hover:text-[#b30000]"
    }`;

  const mobileLinkClass = (to) =>
    `menu-mobile-item text-2xl font-extrabold uppercase tracking-widest py-3 px-8 transition-colors text-center ${
      isActive(to) ? "text-[#b30000]" : "text-white hover:text-[#b30000]"
    }`;

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/items" },
    { label: "Offers", to: "/offers" },
    { label: "Orders", to: "/orders" },
    { label: "Wish List", to: "/wishlist" },
    { label: "My Cart", to: "/cart" },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleSearch = (product) => {
    setSearchQuery("");
    setSearchOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        handleSearch(filtered[0]);
      }
    }
  };

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const isHomePage = location.pathname === "/";
  const shouldForceBackground = forceFixedBackground || !isHomePage;
  const shouldShowBackground = shouldForceBackground || isScrolled || headerHover || menuOpen || searchOpen;

  const headerStyle = {
    backgroundColor: shouldShowBackground ? "rgba(0, 0, 0, 0.72)" : "transparent",
    backdropFilter: shouldShowBackground ? "blur(12px)" : "none",
    borderBottom: shouldShowBackground ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
    boxShadow: shouldShowBackground ? "0 10px 30px -10px rgba(0, 0, 0, 0.5)" : "none",
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInCenter {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInItem {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-tablet-slide {
          animation: slideInRight 0.28s ease-out forwards;
        }
        .menu-mobile-center {
          animation: fadeInCenter 0.22s ease-out forwards;
        }
        .menu-mobile-item {
          animation: fadeInItem 0.3s ease-out both;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 w-full z-[9999] ${forceFixedBackground ? "" : "transition-all duration-300"} ${shouldShowBackground ? "header-with-bg" : ""}`}
        data-scrolled={isScrolled ? "true" : "false"}
        style={headerStyle}
        onMouseEnter={() => setHeaderHover(true)}
        onMouseLeave={() => setHeaderHover(false)}
      >
        <div className="w-full relative">
          <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity shrink-0"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src={logo}
                alt="Dinesh PVC Pipes Logo"
                className="h-20 xl:h-28 w-auto object-contain"
              />
              <h1 className="hidden md:block text-lg md:text-2xl font-bold text-white whitespace-nowrap">
                Dinesh PVC Pipes
              </h1>
            </Link>

            <div className="flex items-center justify-end gap-4 lg:gap-8 flex-1">

              {/* Desktop nav */}
              <nav className="hidden xl:flex items-center gap-6 lg:gap-8 mx-auto">
                {navItems.map((item) => (
                  <Link key={item.to} to={item.to} className={desktopLinkClass(item.to)}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden xl:flex items-center relative w-64 search-container">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-9 pr-10 py-2 border border-white/80 rounded-full focus:outline-none focus:border-white text-sm text-white placeholder:text-white/60 font-medium bg-white/10"
                    placeholder="Search products..."
                  />
                  <button
                    type="button"
                    onClick={() => filteredProducts.length > 0 && handleSearch(filteredProducts[0])}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-[#b30000] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {searchQuery.trim() && (
                  <div className="absolute top-full left-0 mt-1 z-50 w-full">
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-3 slide-down backdrop-blur-sm rounded-lg overflow-hidden">
                      <div className="max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product, index) => (
                            <div
                              key={index}
                              onClick={() => handleSearch(product)}
                              className="px-4 py-2 text-sm text-gray-800 hover:bg-[#b30000] hover:text-white transition-all duration-200 font-semibold cursor-pointer"
                            >
                              {product.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500 font-medium text-center">No products found</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:hidden relative search-container" ref={searchRef}>
                <button
                  type="button"
                  className={`p-2 transition-colors hover:text-[#b30000] ${searchOpen ? "text-[#b30000]" : "text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchOpen(!searchOpen);
                    setMenuOpen(false);
                  }}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {searchOpen && !menuOpen && (
                  <div className="fixed top-20 right-4 z-[9999] search-container">
                    <div className="bg-white shadow-2xl p-2 w-[280px] slide-down rounded-md border-2 border-[#b30000]">
                      <div className="relative flex items-center">
                        <Search className="absolute left-3 text-[#b30000] w-5 h-5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleSearchKeyPress}
                          className="w-full pl-10 pr-4 py-2 focus:outline-none text-base text-[#b30000] placeholder:text-red-300 font-medium bg-white"
                          placeholder="Search products..."
                          autoFocus
                        />
                      </div>
                      {searchQuery.trim() && (
                        <div className="max-h-64 overflow-y-auto mt-2 border-t border-gray-100">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                              <div
                                key={index}
                                onClick={() => handleSearch(product)}
                                className="px-4 py-3 text-sm text-gray-800 hover:bg-[#b30000] hover:text-white transition-all duration-200 font-semibold cursor-pointer"
                              >
                                {product.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center italic">No products found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {currentUser ? (
                <div
                  className="hidden xl:flex items-center gap-2 relative shrink-0"
                  onMouseEnter={() => setLoggedInMenuHover(true)}
                  onMouseLeave={() => setLoggedInMenuHover(false)}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/account")}
                    className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-2 ring-white/50 hover:ring-[#b30000] transition-all"
                  >
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </button>
                  {loggedInMenuHover && (
                    <div className="absolute top-full right-0 pt-2 w-64 z-50">
                      <div className="bg-white shadow-2xl py-3 slide-down rounded-lg border border-gray-100">
                        <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                          <p className="text-xs font-bold text-[#b30000] uppercase tracking-wider">Account</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name || currentUser.email}</p>
                        </div>
                        <button
                          onClick={() => navigate("/account")}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <User className="w-4 h-4 text-[#b30000]" />
                          <span>Profile Settings</span>
                        </button>
                        <button
                          onClick={() => setCurrentUser(null)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors mt-1"
                        >
                          <Package className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal && openAuthModal("login")}
                  className="hidden xl:flex items-center justify-center w-9 h-9 rounded-full bg-white/20 text-white hover:bg-[#b30000] transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              <div className="xl:hidden">
                <button
                  className="flex flex-col gap-1.5 p-2 hover:scale-110 transition-transform"
                  onClick={() => {
                    setSearchOpen(false);
                    setMenuOpen((prev) => !prev);
                  }}
                  aria-label="Toggle menu"
                >
                  <div className={`w-7 h-0.5 bg-white rounded-full transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                  <div className={`w-7 h-0.5 bg-white rounded-full transition-all ${menuOpen ? "opacity-0" : ""}`}></div>
                  <div className={`w-7 h-0.5 bg-white rounded-full transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE MENU: full-screen centered overlay (< 640px) ─── */}
      {menuOpen && isMobile && (
        <div className="fixed inset-0 z-[10000] xl:hidden" style={{ backgroundColor: "rgba(0,0,0,0.82)" }}>
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu backdrop"
          />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:border-[#b30000] hover:text-[#b30000] transition-colors z-10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          <nav
            className="menu-mobile-center absolute inset-0 flex flex-col items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(item.to)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
            <button
              className={`menu-mobile-item text-2xl font-extrabold uppercase tracking-widest py-3 px-8 transition-colors ${isActive("/account") ? "text-[#b30000]" : "text-white hover:text-[#b30000]"}`}
              style={{ animationDelay: `${navItems.length * 60}ms` }}
              onClick={() => {
                setMenuOpen(false);
                if (currentUser) navigate("/account");
                else openAuthModal && openAuthModal("login");
              }}
            >
              {currentUser ? "ACCOUNT" : "LOGIN"}
            </button>
          </nav>
        </div>
      )}

      {/* ─── TABLET MENU: slide in from right (640px – 1279px) ─── */}
      {menuOpen && !isMobile && (
        <div className="fixed inset-0 z-[10000] xl:hidden" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu backdrop"
          />

          <aside
            className="menu-tablet-slide absolute top-0 right-0 h-full w-[min(420px,84vw)] border-l border-white/15 shadow-2xl"
            style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
          >
            <div className="h-16 md:h-20 px-4 md:px-6 border-b border-white/10 flex items-center justify-between">
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:border-[#b30000] hover:text-[#b30000] transition-colors"
                aria-label="Search"
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  setMenuOpen(false);
                }}
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:border-[#b30000] hover:text-[#b30000] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="px-5 md:px-8 py-3 md:py-4 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={tabletLinkClass(item.to)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (currentUser) navigate("/account");
                  else openAuthModal && openAuthModal("login");
                }}
                className={`py-3 md:py-3.5 text-left text-xl md:text-2xl font-extrabold uppercase tracking-[0.12em] border-b border-white/15 transition-colors ${isActive("/account") ? "text-[#b30000]" : "text-white hover:text-[#b30000]"}`}
              >
                {currentUser ? "Account" : "Login"}
              </button>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;