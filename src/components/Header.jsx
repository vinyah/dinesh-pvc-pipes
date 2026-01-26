import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Hlogo.png";
import { Package, FileText, ShoppingCart, User, Search } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileState, setIsMobileState] = useState(false);
  const lastScrollYRef = React.useRef(0);
  const mouseYRef = React.useRef(0);
  const hideTimeoutRef = React.useRef(null);
  const isMobileRef = React.useRef(false);

  useEffect(() => {
    // Detect if device is mobile - more comprehensive detection
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const isMobile = (hasTouch && isSmallScreen) || isMobileUA;
      isMobileRef.current = isMobile;
      setIsMobileState(isMobile);
      return isMobile;
    };

    const isMobile = checkDevice();
    
    // Handle window resize to re-detect device type
    const handleResize = () => {
      const wasMobile = isMobileRef.current;
      const nowMobile = checkDevice();
      
      // If device type changed, remove old listeners and add new ones
      if (wasMobile !== nowMobile) {
        window.removeEventListener("scroll", handleScrollMobile);
        window.removeEventListener("scroll", handleScrollDesktop);
        window.removeEventListener("mousemove", handleMouseMove);
        
        // Update visibility state when switching between mobile/desktop
        if (nowMobile) {
          setIsVisible(true); // Always visible on mobile
          window.addEventListener("scroll", handleScrollMobile, { passive: true });
        } else {
          setIsVisible(false); // Start hidden on desktop
          window.addEventListener("scroll", handleScrollDesktop, { passive: true });
          window.addEventListener("mousemove", handleMouseMove, { passive: true });
        }
      }
    };

    // Desktop/Laptop/Tablet behavior: Cursor-based + scroll
    const handleScrollDesktop = () => {
      // Only handle scroll if mouse is away from top (mouse handler takes priority when near top)
      if (mouseYRef.current > 150) {
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        const lastScrollY = lastScrollYRef.current;
        
        // Scrolling up - show header (slide down from top)
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
        // Scrolling down - hide header (slide up and hide)
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        }
        
        lastScrollYRef.current = currentScrollY;
      }
    };

    // Mobile behavior: Header is always fixed and visible
    const handleScrollMobile = () => {
      // On mobile, header is always visible - no scroll behavior needed
      setIsVisible(true);
    };

    const handleMouseMove = (e) => {
      // Only handle mouse events on desktop/tablet (not mobile)
      if (isMobileRef.current) return;
      
      const mouseY = e.clientY;
      mouseYRef.current = mouseY;
      
      // Mouse handler takes priority - show/hide based on cursor position
      if (mouseY <= 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Set initial scroll position
    lastScrollYRef.current = window.scrollY || window.pageYOffset || 0;
    mouseYRef.current = window.innerHeight; // Start with mouse at bottom
    
    // Start hidden on desktop, always visible on mobile
    setIsVisible(isMobile);
    
    // Add event listeners based on device type
    if (isMobile) {
      window.addEventListener("scroll", handleScrollMobile, { passive: true });
    } else {
      window.addEventListener("scroll", handleScrollDesktop, { passive: true });
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScrollDesktop);
      window.removeEventListener("scroll", handleScrollMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 right-0 w-full bg-white border-b-2 border-[#b30000] z-50 transition-transform duration-300"
      style={{ 
        transform: isMobileState ? 'translateY(0)' : (isVisible ? 'translateY(0)' : 'translateY(-100%)'),
        backgroundColor: 'white'
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex items-center justify-between h-20 bg-white">
          {/* Left Section: Logo + Company name */}
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <img 
              src={logo} 
              alt="Dinesh PVC Pipes Logo" 
              className="h-20 md:h-28 w-auto object-contain"
            />
            <h1 className="text-xl md:text-3xl font-bold text-[#b30000] whitespace-nowrap">
              Dinesh PVC Pipes
            </h1>
          </Link>

          {/* Right Section: Search + Navigation */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="absolute left-3 text-[#b30000] w-5 h-5 z-10" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border-2 border-[#b30000] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:ring-offset-1 text-sm text-[#b30000] placeholder:text-red-300"
                style={{ backgroundColor: 'transparent' }}
                placeholder="Search..." 
              />
            </div>

            {/* Desktop Navigation Icons - Square buttons with red borders */}
            <nav className="hidden md:flex items-center gap-2">
              <Link 
                to="/items" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-transparent hover:bg-red-50 transition-all group"
                style={{ backgroundColor: 'transparent' }}
              >
                <Package className="w-5 h-5 text-[#b30000] group-hover:text-[#b30000] transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-[#b30000] transition-colors mt-1">Items</span>
              </Link>

              <Link 
                to="/orders" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-transparent hover:bg-red-50 transition-all group"
                style={{ backgroundColor: 'transparent' }}
              >
                <FileText className="w-5 h-5 text-[#b30000] group-hover:text-[#b30000] transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-[#b30000] transition-colors mt-1">Orders</span>
              </Link>

              <Link 
                to="/cart" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-transparent hover:bg-red-50 transition-all group"
                style={{ backgroundColor: 'transparent' }}
              >
                <ShoppingCart className="w-5 h-5 text-[#b30000] group-hover:text-[#b30000] transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-[#b30000] transition-colors mt-1">Cart</span>
              </Link>

              <Link 
                to="/account" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-transparent hover:bg-red-50 transition-all group"
                style={{ backgroundColor: 'transparent' }}
              >
                <User className="w-5 h-5 text-[#b30000] group-hover:text-[#b30000] transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-[#b30000] transition-colors mt-1">Account</span>
              </Link>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-[#b30000] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#b30000] transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#b30000] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center relative">
            <Search className="absolute left-3 text-[#b30000] w-5 h-5 z-10" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 border-2 border-[#b30000] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b30000] text-sm text-[#b30000] placeholder:text-red-300"
              style={{ backgroundColor: 'transparent' }}
              placeholder="Search..." 
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64 pb-4' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-2">
            <Link
              to="/items"
              className="flex items-center gap-2 px-4 py-2 text-[#b30000] hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Package className="w-5 h-5" />
              <span>Items</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 px-4 py-2 text-[#b30000] hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <FileText className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 text-[#b30000] hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </Link>
            <Link
              to="/account"
              className="flex items-center gap-2 px-4 py-2 text-[#b30000] hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>Account</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;