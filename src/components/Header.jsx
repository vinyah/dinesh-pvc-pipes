import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Hlogo.png";
import { Package, FileText, ShoppingCart, User, Search } from "lucide-react";
import db from "../../db.json";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemsHover, setItemsHover] = useState(false);
  const [ordersHover, setOrdersHover] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [accountHover, setAccountHover] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerHover, setHeaderHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
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

  // Determine background color: always white on mobile, hover-based on desktop
  const shouldShowBackground = isMobile ? true : headerHover;
  
  return (
    <header 
      className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300"
      style={{ 
        backgroundColor: shouldShowBackground ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        boxShadow: shouldShowBackground ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
      }}
      onMouseEnter={() => setHeaderHover(true)}
      onMouseLeave={() => setHeaderHover(false)}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
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

          {/* Right Section: Search + Navigation */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation Icons - Search first, then others */}
            <nav className="hidden md:flex items-center gap-2">
              {/* Search Icon with Dropdown */}
              <div 
                className="relative"
                onMouseLeave={() => {
                  // Close search when mouse leaves, but only if not typing
                  if (!searchQuery) {
                    setSearchOpen(false);
                  }
                }}
              >
                <div 
                  className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="w-6 h-6 text-white" />
                </div>
                
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
              {/* Items with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setItemsHover(true)}
                onMouseLeave={() => setItemsHover(false)}
              >
                <div
                  onClick={() => navigate("/items")}
                  className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Package className="w-6 h-6 text-white" />
                </div>
                
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
                          All Products
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

              {/* Orders with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOrdersHover(true)}
                onMouseLeave={() => setOrdersHover(false)}
              >
                <div
                  onClick={() => navigate("/orders")}
                  className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                
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

              {/* Cart with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCartHover(true)}
                onMouseLeave={() => setCartHover(false)}
              >
                <div
                  onClick={() => navigate("/cart")}
                  className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                
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

              {/* Account with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setAccountHover(true)}
                onMouseLeave={() => setAccountHover(false)}
              >
                <div
                  onClick={() => navigate("/account")}
                  className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                
                {/* Account Dropdown Menu */}
                {accountHover && (
                  <div 
                    className="absolute top-full right-0 pt-2 w-96 z-50"
                    onMouseEnter={() => setAccountHover(true)}
                    onMouseLeave={() => setAccountHover(false)}
                  >
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-5 slide-down backdrop-blur-sm">
                      <div className="px-5 pb-4 border-b-2 border-gray-300 mb-3">
                        <h3 className="text-xl font-bold text-[#b30000] flex items-center gap-2">
                          <User className="w-5 h-5" />
                          My Account
                        </h3>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-normal font-medium">
                          Manage your account settings, profile information, and personal details here.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile: Search Icon + Hamburger Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Search Icon */}
              <div className="relative">
                <div 
                  className="flex items-center justify-center w-10 h-10 cursor-pointer"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="w-5 h-5 text-white" />
                </div>
                
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
                
                {/* Mobile Menu Dropdown - Icons Stacked Vertically */}
                {menuOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-gradient-to-br from-white to-red-50 shadow-2xl py-4 min-w-[140px] slide-down backdrop-blur-sm">
                      <nav className="flex flex-col">
                        <Link
                          to="/items"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#b30000] hover:text-white transition-all duration-200 mx-2 mb-1"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Package className="w-5 h-5 text-[#b30000] group-hover:text-white" />
                          <span className="text-sm text-gray-800 font-semibold">Items</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#b30000] hover:text-white transition-all duration-200 mx-2 mb-1"
                          onClick={() => setMenuOpen(false)}
                        >
                          <FileText className="w-5 h-5 text-[#b30000] group-hover:text-white" />
                          <span className="text-sm text-gray-800 font-semibold">Orders</span>
                        </Link>
                        <Link
                          to="/cart"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#b30000] hover:text-white transition-all duration-200 mx-2 mb-1"
                          onClick={() => setMenuOpen(false)}
                        >
                          <ShoppingCart className="w-5 h-5 text-[#b30000] group-hover:text-white" />
                          <span className="text-sm text-gray-800 font-semibold">Cart</span>
                        </Link>
                        <Link
                          to="/account"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#b30000] hover:text-white transition-all duration-200 mx-2 mb-1"
                          onClick={() => setMenuOpen(false)}
                        >
                          <User className="w-5 h-5 text-[#b30000] group-hover:text-white" />
                          <span className="text-sm text-gray-800 font-semibold">Account</span>
                        </Link>
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