import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo.png";

function Footer({ setShowModal }) {
  return (
    <footer className="w-full bg-[#b30000] text-white relative m-0 p-0">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-12">
        {/* Main Footer Content - Multiple Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Products Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-base mb-2">Products</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/items" className="text-white/80 hover:text-white hover:underline text-sm">
                  PVC Pipes
                </Link>
              </li>
              <li>
                <Link to="/pipefitting" className="text-white/80 hover:text-white hover:underline text-sm">
                  Pipe Fittings
                </Link>
              </li>
              <li>
                <Link to="/boxes" className="text-white/80 hover:text-white hover:underline text-sm">
                  Junction Boxes
                </Link>
              </li>
              <li>
                <Link to="/items" className="text-white/80 hover:text-white hover:underline text-sm">
                  Flexible Pipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Your Account Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-base mb-2">Your Account</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  className="text-white/80 hover:text-white hover:underline text-sm text-left"
                  onClick={() => setShowModal("login")}
                >
                  Log In
                </button>
              </li>
              <li>
                <button
                  className="text-white/80 hover:text-white hover:underline text-sm text-left"
                  onClick={() => setShowModal("signup")}
                >
                  Create Account
                </button>
              </li>
              <li>
                <Link to="/orders" className="text-white/80 hover:text-white hover:underline text-sm">
                  Orders History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white/80 hover:text-white hover:underline text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-base mb-2">Help</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/services" className="text-white/80 hover:text-white hover:underline text-sm">
                  Customer Care
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/80 hover:text-white hover:underline text-sm">
                  Home Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/80 hover:text-white hover:underline text-sm">
                  Installation
                </Link>
              </li>
              <li>
                <p className="text-white/80 text-sm">1800 564 657</p>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-base mb-2">About Us</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white hover:underline text-sm">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/80 hover:text-white hover:underline text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/80 hover:text-white hover:underline text-sm">
                  Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <a 
            href="#" 
            className="w-10 h-10 border border-white/30 rounded flex items-center justify-center hover:border-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-white" strokeWidth={1.5} />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 border border-white/30 rounded flex items-center justify-center hover:border-white transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 text-white" strokeWidth={1.5} />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 border border-white/30 rounded flex items-center justify-center hover:border-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5 text-white" strokeWidth={1.5} />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Footer Bottom - Copyright and Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/80 text-sm">
            © 2025 Dinesh PVC Pipes | All rights reserved
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/sitemap" className="text-white/80 hover:text-white hover:underline">
              Sitemap
            </Link>
            <span className="text-white/50">|</span>
            <Link to="/privacy" className="text-white/80 hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <span className="text-white/50">|</span>
            <Link to="/terms" className="text-white/80 hover:text-white hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

