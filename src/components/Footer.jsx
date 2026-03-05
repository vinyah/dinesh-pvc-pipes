import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo.png";

function Footer({ setShowModal }) {
  // Footer: red background with white text everywhere
  const bgClass = "bg-[#b30000]";
  const textClass = "text-white";
  const textOpacityClass = "text-white/80";
  const borderClass = "border-white/20";
  const borderIconClass = "border-white/30";
  const hoverTextClass = "hover:text-white";
  const hoverBorderClass = "hover:border-white";
  
  return (
    <footer className={`w-full ${bgClass} ${textClass} relative m-0 p-0`}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8">
        {/* Main Footer Content - Multiple Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Products Column */}
          <div className="flex flex-col gap-3">
            <h3 className={`${textClass} font-semibold text-base mb-2`}>Products</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/items" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  PVC Pipes
                </Link>
              </li>
              <li>
                <Link to="/pipefitting" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Pipe Fittings
                </Link>
              </li>
              <li>
                <Link to="/boxes" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Junction Boxes
                </Link>
              </li>
              <li>
                <Link to="/items" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Flexible Pipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Your Account Column */}
          <div className="flex flex-col gap-3">
            <h3 className={`${textClass} font-semibold text-base mb-2`}>Your Account</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium text-left`}
                  onClick={() => setShowModal("login")}
                >
                  Log In
                </button>
              </li>
              <li>
                <button
                  className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium text-left`}
                  onClick={() => setShowModal("signup")}
                >
                  Create Account
                </button>
              </li>
              <li>
                <Link to="/orders" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Orders History
                </Link>
              </li>
              <li>
                <Link to="/cart" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="flex flex-col gap-3">
            <h3 className={`${textClass} font-semibold text-base mb-2`}>Help</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/services" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Customer Care
                </Link>
              </li>
              <li>
                <Link to="/services" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Home Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Installation
                </Link>
              </li>
              <li>
                <p className={textOpacityClass + " text-sm font-medium"}>1800 564 657</p>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div className="flex flex-col gap-3">
            <h3 className={`${textClass} font-semibold text-base mb-2`}>About Us</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className={`${textOpacityClass} ${hoverTextClass} hover:underline text-sm font-medium`}>
                  Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${borderClass} my-4`}></div>

        {/* Footer Bottom - single compact row: left text, center socials, right links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
          {/* Left: copyright */}
          <p className={textOpacityClass + " text-xs md:text-sm text-center md:text-left"}>
            © 2025 Dinesh PVC Pipes | All rights reserved
          </p>

          {/* Center: social icons */}
          <div className="flex items-center justify-center gap-3">
            <a 
              href="#"
              className={`w-8 h-8 border ${borderIconClass} rounded flex items-center justify-center ${hoverBorderClass} transition-colors`}
              aria-label="Instagram"
            >
              <Instagram className={`w-4 h-4 ${textClass}`} strokeWidth={1.5} />
            </a>
            <a 
              href="#"
              className={`w-8 h-8 border ${borderIconClass} rounded flex items-center justify-center ${hoverBorderClass} transition-colors`}
              aria-label="Facebook"
            >
              <Facebook className={`w-4 h-4 ${textClass}`} strokeWidth={1.5} />
            </a>
            <a 
              href="#"
              className={`w-8 h-8 border ${borderIconClass} rounded flex items-center justify-center ${hoverBorderClass} transition-colors`}
              aria-label="Twitter"
            >
              <Twitter className={`w-4 h-4 ${textClass}`} strokeWidth={1.5} />
            </a>
          </div>

          {/* Right: legal links */}
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <Link to="/privacy" className={`${textOpacityClass} ${hoverTextClass} hover:underline`}>
              Privacy Policy
            </Link>
            <span className="text-white/50 hidden md:inline-block">|</span>
            <Link to="/terms" className={`${textOpacityClass} ${hoverTextClass} hover:underline`}>
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

