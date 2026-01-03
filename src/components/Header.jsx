import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Hlogo.png";
import { Package, FileText, ShoppingCart, User, Search } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b-2 border-[#b30000]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Logo + Company name */}
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <img 
              src={logo} 
              alt="Dinesh PVC Pipes Logo" 
              className="h-10 md:h-14 w-auto object-contain"
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
                className="w-full pl-10 pr-4 py-2 border-2 border-[#b30000] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:ring-offset-1 text-sm placeholder:text-red-300"
                placeholder="Search..." 
              />
            </div>

            {/* Desktop Navigation Icons - Square buttons with red borders */}
            <nav className="hidden md:flex items-center gap-2">
              <Link 
                to="/items" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-white hover:bg-[#b30000] hover:text-white transition-all group"
              >
                <Package className="w-5 h-5 text-[#b30000] group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-white transition-colors mt-1">Items</span>
              </Link>

              <Link 
                to="/orders" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-white hover:bg-[#b30000] hover:text-white transition-all group"
              >
                <FileText className="w-5 h-5 text-[#b30000] group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-white transition-colors mt-1">Orders</span>
              </Link>

              <Link 
                to="/cart" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-white hover:bg-[#b30000] hover:text-white transition-all group"
              >
                <ShoppingCart className="w-5 h-5 text-[#b30000] group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-white transition-colors mt-1">Cart</span>
              </Link>

              <Link 
                to="/account" 
                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-[#b30000] rounded-lg bg-white hover:bg-[#b30000] hover:text-white transition-all group"
              >
                <User className="w-5 h-5 text-[#b30000] group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-[#b30000] group-hover:text-white transition-colors mt-1">Account</span>
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
              className="w-full pl-10 pr-4 py-2 border-2 border-[#b30000] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] text-sm placeholder:text-red-300"
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