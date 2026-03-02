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
  const bgOpacity = forceFixedBackground ? 0.4 : isScrolled ? 0.4 : headerHover ? 0.5 : 0;

  // Always use inline position:fixed so header stays at top while scrolling (not overridden by CSS)
  const headerStyle = forceFixedBackground
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: shouldShowBackground ? `rgba(0, 0, 0, ${bgOpacity})` : "transparent",
        boxShadow: shouldShowBackground ? "0 2px 12px rgba(0,0,0,0.2)" : "none",
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

          {/* Right Section: Nav words + Sign up / Login at far right */}
          <div className="flex items-center justify-end gap-4 flex-1">
            {/* Desktop: Search, Products, Offers, Orders, Wish List, Cart (centered using absolute positioning) */}
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              {/* Search with Dropdown */}
              <div 
                className="relative"
                onMouseLeave={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
                >
                  Search
                </button>
                
                {/* Search Bar Dropdown */}
                {searchOpen && (
                  <div 
                    className="absolute top-full right-0 pt-2 w-96 z-50"
                    onMouseEnter={() => setSearchOpen(true)}
                    onMouseLeave={() => {
                      if (!searchQuery) {
                        setSearchOpen(false);
                      }
                    }}
                  >
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm">
                      <div className="px-5 pb-4">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b30000] w-5 h-5" />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            className="w-full pl-12 pr-4 py-3 border-[1px] border-[#b30000] focus:outline-none focus:border-[#b30000] text-sm text-[#b30000] placeholder:text-red-300 font-medium bg-white"
                            placeholder="Search products..." 
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Search Results */}
                      {searchQuery.trim() && (
                        <div className="max-h-64 overflow-y-auto border-t-2 border-gray-300 mt-3">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                              <div
                                key={index}
                                onClick={() => handleSearch(product)}
                                className="px-5 py-3 text-sm text-gray-800 hover:bg-[#b30000] hover:text-white transition-all duration-200 font-semibold cursor-pointer mx-2 mb-1"
                              >
                                {product.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-5 py-3 text-sm text-gray-500 font-medium">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Products with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setItemsHover(true)}
                onMouseLeave={() => setItemsHover(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate("/items")}
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
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
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
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
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
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
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
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
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
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
              <div className="hidden md:flex items-center gap-5 shrink-0">
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="text-white hover:text-[#b30000] transition-colors font-medium text-sm uppercase tracking-wide"
                >
                  Login
                </button>
              </div>
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
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 w-80 slide-down backdrop-blur-sm">
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

              {/* Mobile Hamburger Button with Dropdown */}
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
                
                {/* Mobile Menu - words only */}
                {menuOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-4 min-w-[160px] slide-down backdrop-blur-sm">
                      <nav className="flex flex-col">
                        <Link to="/items" className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1" onClick={() => setMenuOpen(false)}>Products</Link>
                        <Link to="/orders" className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1" onClick={() => setMenuOpen(false)}>Orders</Link>
                        <Link to="/wishlist" className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1" onClick={() => setMenuOpen(false)}>Wish List</Link>
                        <Link to="/cart" className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1" onClick={() => setMenuOpen(false)}>Cart</Link>
                        {currentUser && (
                          <Link to="/account" className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1 flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                            <span className="w-6 h-6 rounded-full bg-[#b30000] flex items-center justify-center overflow-hidden shrink-0">
                              {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-3 h-3 text-white" />
                              )}
                            </span>
                            Account
                          </Link>
                        )}
                        {!currentUser && openAuthModal && (
                          <>
                            <div className="border-t border-gray-200 my-1" />
                            <button type="button" onClick={() => { openAuthModal("signup"); setMenuOpen(false); }} className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1 text-left">Sign up</button>
                            <button type="button" onClick={() => { openAuthModal("login"); setMenuOpen(false); }} className="px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-[#b30000] hover:text-white transition-all mx-2 mb-1 text-left">Login</button>
                          </>
                        )}
                      </nav>
                    </div>
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