import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Hlogo.png";
import { Package, FileText, ShoppingCart, User, Search, Heart } from "lucide-react";
import db from "../../db.json";

function Header({ currentUser, openAuthModal, setCurrentUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemsHover, setItemsHover] = useState(false);
  const [ordersHover, setOrdersHover] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [wishlistHover, setWishlistHover] = useState(false);
  const [loggedInMenuHover, setLoggedInMenuHover] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerHover, setHeaderHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Active nav highlighting
  const path = location.pathname;
  const isProductsActive =
    path === "/items" ||
    path === "/boxes" ||
    path === "/pipefitting" ||
    path.startsWith("/category") ||
    path.startsWith("/product");
  const isOffersActive = path === "/offers";
  const isOrdersActive = path.startsWith("/orders");
  const isWishlistActive = path === "/wishlist";
  const isCartActive = path === "/cart";
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                            ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect "scrolled past top": use both scroll position AND IntersectionObserver so it works no matter what scrolls
  const SCROLL_THRESHOLD = 50;
  useEffect(() => {
    const getScrollTop = () => {
      if (typeof window === "undefined") return 0;
      return Math.max(
        window.scrollY ?? 0,
        window.pageYOffset ?? 0,
        document.documentElement.scrollTop ?? 0,
        document.body.scrollTop ?? 0
      );
    };
    const updateFromScroll = () => setIsScrolled(getScrollTop() > SCROLL_THRESHOLD);
    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    // Also observe a sentinel at top of main – when it leaves viewport, we've scrolled (works even if window isn't the scroll container)
    let observer;
    const attachObserver = () => {
      const sentinel = document.getElementById("header-scroll-sentinel");
      if (sentinel && !observer) {
        observer = new IntersectionObserver(
          ([entry]) => setIsScrolled(!entry.isIntersecting),
          { threshold: 0, rootMargin: "0px" }
        );
        observer.observe(sentinel);
      }
    };
    attachObserver();
    const t = setTimeout(attachObserver, 100);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  // Get items from db.json
  const items = db?.pages?.items || [];
  
  // Get all products for search - use items from pages.items as they have correct links
  const allProducts = items.map(item => ({
    name: item.name,
    link: item.link
  }));
  
  // Filter products based on search query
  const filteredProducts = searchQuery.trim() 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Handle search navigation
  const handleSearch = (product) => {
    navigate(product.link);
    setSearchQuery("");
    setSearchOpen(false);
  };
  
  // Handle Enter key in search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && filteredProducts.length > 0) {
      handleSearch(filteredProducts[0]);
    }
  };

  // Home page: at top = transparent (hover for background); when scrolled = fixed background.
  // All other pages: always fixed solid background, including while scrolling (no change on scroll).
  const isAtTop = !isScrolled;
  const forceFixedBackground = !isHomePage;
  const shouldShowBackground = forceFixedBackground
    ? true
    : isScrolled
      ? true
      : isAtTop
        ? headerHover
        : false;
  // Use same background strength as scroll state (0.4) so inner pages match scrolled home header
  // iPhone-style dark background color (deep slate instead of pure black)
  const bgOpacity = forceFixedBackground ? 0.4 : isScrolled ? 0.4 : headerHover ? 0.5 : 0;

  // Always use inline position:fixed so header stays at top while scrolling (not overridden by CSS)
  const headerStyle = forceFixedBackground
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900ish, iPhone-like dark
        boxShadow: "0 2px 12px rgba(15,23,42,0.6)",
      }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: shouldShowBackground ? `rgba(15, 23, 42, ${bgOpacity})` : "transparent",
        boxShadow: shouldShowBackground ? "0 2px 12px rgba(15,23,42,0.6)" : "none",
      };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-[9999] ${forceFixedBackground ? "" : "transition-all duration-300"} ${shouldShowBackground ? "header-with-bg" : ""}`}
      data-scrolled={isScrolled ? "true" : "false"}
      style={headerStyle}
      onMouseEnter={() => setHeaderHover(true)}
      onMouseLeave={() => setHeaderHover(false)}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Section: Logo + Company name */}
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <img 
              src={logo} 
              alt="Dinesh PVC Pipes Logo" 
              className="h-14 md:h-28 w-auto object-contain"
            />
            <h1 className="text-lg md:text-3xl font-bold text-white whitespace-nowrap">
              Dinesh PVC Pipes
            </h1>
          </Link>

          {/* Right Section: Nav words + Search + Sign up / Login at far right */}
          <div className="flex items-center justify-end gap-4 flex-1">
            {/* Desktop: Products, Offers, Orders, Wish List, Cart (centered using absolute positioning) */}
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              
              {/* Products with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setItemsHover(true)}
                onMouseLeave={() => setItemsHover(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate("/items")}
                  className={`${isProductsActive ? "text-[#b30000]" : "text-white hover:text-[#b30000]"} transition-colors font-medium text-sm uppercase tracking-wide`}
                >
                  Products
                </button>
                
                {/* Dropdown Menu */}
                {itemsHover && (
                  <div 
                    className="absolute top-full right-0 pt-2 w-96 z-50"
                    onMouseEnter={() => setItemsHover(true)}
                    onMouseLeave={() => setItemsHover(false)}
                  >
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm">
                      <div className="px-5 pb-4 border-b-2 border-gray-300 mb-3">
                        <h3 className="text-xl font-bold text-[#b30000] flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Product Categories
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            to={item.link}
                            className="block px-5 py-3 text-sm text-gray-800 hover:bg-[#b30000] hover:text-white transition-all duration-200 font-semibold cursor-pointer whitespace-nowrap mx-2 mb-1"
                            onClick={() => setItemsHover(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Offers - simple nav link */}
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/offers")}
                  className={`${isOffersActive ? "text-[#b30000]" : "text-white hover:text-[#b30000]"} transition-colors font-medium text-sm uppercase tracking-wide`}
                >
                  Offers
                </button>
              </div>

              {/* Orders with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOrdersHover(true)}
                onMouseLeave={() => setOrdersHover(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className={`${isOrdersActive ? "text-[#b30000]" : "text-white hover:text-[#b30000]"} transition-colors font-medium text-sm uppercase tracking-wide`}
                >
                  Orders
                </button>
                
                {/* Orders Dropdown Menu */}
                {ordersHover && (
                  <div 
                    className="absolute top-full right-0 pt-2 w-96 z-50"
                    onMouseEnter={() => setOrdersHover(true)}
                    onMouseLeave={() => setOrdersHover(false)}
                  >
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm">
                      <div className="px-5 pb-4 border-b-2 border-gray-300 mb-3">
                        <h3 className="text-xl font-bold text-[#b30000] flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          My Orders
                        </h3>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-normal font-medium">
                          View and track all your product orders here. Check order status, delivery details, and order history.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wish List - between Orders and Cart */}
              <div 
                className="relative"
                onMouseEnter={() => setWishlistHover(true)}
                onMouseLeave={() => setWishlistHover(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate("/wishlist")}
                  className={`${isWishlistActive ? "text-[#b30000]" : "text-white hover:text-[#b30000]"} transition-colors font-medium text-sm uppercase tracking-wide`}
                >
                  Wish List
                </button>
                
                {wishlistHover && (
                  <div 
                    className="absolute top-full right-0 pt-2 w-96 z-50"
                    onMouseEnter={() => setWishlistHover(true)}
                    onMouseLeave={() => setWishlistHover(false)}
                  >
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm">
                      <div className="px-5 pb-4 border-b-2 border-gray-300 mb-3">
                        <h3 className="text-xl font-bold text-[#b30000] flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Wish List
                        </h3>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-normal font-medium">
                          View and manage your saved products. Click Wish List to see all items you liked.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCartHover(true)}
                onMouseLeave={() => setCartHover(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className={`${isCartActive ? "text-[#b30000]" : "text-white hover:text-[#b30000]"} transition-colors font-medium text-sm uppercase tracking-wide`}
                >
                  Cart
                </button>
                
                {/* Cart Dropdown Menu */}
                {cartHover && (
                  <div 
                    className="absolute top-full right-0 pt-2 w-96 z-50"
                    onMouseEnter={() => setCartHover(true)}
                    onMouseLeave={() => setCartHover(false)}
                  >
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm">
                      <div className="px-5 pb-4 border-b-2 border-gray-300 mb-3">
                        <h3 className="text-xl font-bold text-[#b30000] flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Shopping Cart
                        </h3>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-normal font-medium">
                          View your selected products here. Review items, quantities, and proceed to checkout when ready.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Search bar (separate, near right side) */}
            <div className="hidden md:flex items-center relative w-64">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-9 pr-3 py-2 border border-white/80 rounded-full focus:outline-none focus:border-white text-sm text-white placeholder:text-white/60 font-medium bg-white/10"
                  placeholder="Search products..."
                />
              </div>
              {/* Search results dropdown below input */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 mt-1 z-50 w-full">
                  <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-3 slide-down backdrop-blur-sm">
                    <div className="max-h-60 overflow-y-auto border-t-2 border-gray-300">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                          <div
                            key={index}
                            onClick={() => handleSearch(product)}
                            className="px-4 py-2 text-sm text-gray-800 hover:bg-[#b30000] hover:text-white transition-all duration-200 font-semibold cursor-pointer mx-2 mb-1"
                          >
                            {product.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 font-medium">
                          No products found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Top right: when logged out = Sign up / Login; when logged in = avatar + user label with details dropdown */}
            {currentUser ? (
              <div
                className="hidden md:flex md:items-center md:gap-2 relative shrink-0"
                onMouseEnter={() => setLoggedInMenuHover(true)}
                onMouseLeave={() => setLoggedInMenuHover(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate("/account")}
                  className="flex items-center gap-2 text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
                >
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white/50">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" aria-hidden />
                    )}
                  </span>
                  {currentUser?.name?.trim() || currentUser?.email?.split("@")[0] || "Account"}
                </button>
                {loggedInMenuHover && (
                  <div className="absolute top-full right-0 pt-2 w-96 z-50">
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm rounded-lg border border-gray-200">
                      <div className="px-5 pb-4 border-b-2 border-gray-300 mb-3">
                        <h3 className="text-xl font-bold text-[#b30000] flex items-center gap-2">
                          <User className="w-5 h-5" />
                          My Account
                        </h3>
                      </div>
                      <div className="px-5 py-2 space-y-1">
                        {currentUser?.name && (
                          <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                        )}
                        {currentUser?.email && (
                          <p className="text-sm text-gray-600">{currentUser.email}</p>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed mt-2">
                          Manage your account settings, profile information, and personal details here.
                        </p>
                      </div>
                      <div className="px-5 pt-3">
                        <button
                          type="button"
                          onClick={() => { navigate("/account"); setLoggedInMenuHover(false); }}
                          className="w-full py-2 text-sm font-semibold text-[#b30000] hover:bg-[#b30000] hover:text-white rounded-lg transition-colors"
                        >
                          View profile
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : openAuthModal ? (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-[#f3e8ff] text-[#7c3aed] shadow-sm hover:bg-[#e9d5ff] transition-colors shrink-0"
                aria-label="Account"
              >
                <User className="w-4 h-4" />
              </button>
            ) : null}

            {/* Mobile: Search word + Hamburger */}
            <div className="md:hidden flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  Search
                </button>
                
                {/* Mobile Search Bar Dropdown */}
                {searchOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 w-72 slide-down backdrop-blur-sm">
                      <div className="px-4 pb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b30000] w-4 h-4" />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            className="w-full pl-10 pr-4 py-3 border-[1px] border-[#b30000] focus:outline-none focus:border-[#b30000] text-sm text-[#b30000] placeholder:text-red-300 font-medium bg-white"
                            placeholder="Search products..." 
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Mobile Search Results */}
                      {searchQuery.trim() && (
                        <div className="max-h-64 overflow-y-auto border-t-2 border-gray-300 mt-3">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                              <div
                                key={index}
                                onClick={() => handleSearch(product)}
                                className="px-4 py-3 text-sm text-gray-800 hover:bg-[#b30000] hover:text-white transition-all duration-200 font-semibold cursor-pointer mx-2 mb-1"
                              >
                                {product.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 font-medium">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Button with Fullscreen Overlay Menu */}
              <div className="relative">
                <button
                  className="flex flex-col gap-1.5 p-2"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                >
                  <span className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
                {/* Mobile Fullscreen Menu */}
                {menuOpen && (
                  <div className="fixed inset-0 z-[9998] bg-black/80">
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-white"
                        aria-label="Close menu"
                      >
                        ✕
                      </button>
                    </div>
                    <nav className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                      >
                        Home
                      </Link>
                      <Link
                        to="/items"
                        onClick={() => setMenuOpen(false)}
                        className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                      >
                        Products
                      </Link>
                      <Link
                        to="/offers"
                        onClick={() => setMenuOpen(false)}
                        className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                      >
                        Offers
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setMenuOpen(false)}
                        className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                      >
                        Wish List
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setMenuOpen(false)}
                        className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                      >
                        Cart
                      </Link>
                      {currentUser && (
                        <Link
                          to="/account"
                          onClick={() => setMenuOpen(false)}
                          className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                        >
                          Account
                        </Link>
                      )}
                      {!currentUser && openAuthModal && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              openAuthModal("signup");
                              setMenuOpen(false);
                            }}
                            className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                          >
                            Sign Up
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              openAuthModal("login");
                              setMenuOpen(false);
                            }}
                            className="text-white text-sm font-semibold tracking-[0.25em] uppercase py-2"
                          >
                            Login
                          </button>
                        </>
                      )}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;