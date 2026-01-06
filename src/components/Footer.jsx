import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo.png";

function Footer({ setShowModal }) {
  return (
    <footer className="w-full bg-[#b30000] text-white relative m-0 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="mt-32 md:mt-0 md:ml-48">
          {/* Left Section - Logo + Follow Us + Social Icons - Mobile: Top Left, Desktop: Absolute Left Corner */}
          <div className="absolute top-2 left-2 md:top-8 md:-left-12 md:sm:-left-16 lg:-left-20 flex flex-col gap-2 z-10">
            <img 
              src={logo} 
              alt="Dinesh PVC Pipes Logo" 
              className="h-28 md:h-36 w-auto object-contain filter brightness-0 invert"
            />
            <h3 className="text-base md:text-lg font-semibold">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Mobile: Centered Sections Stacked Vertically, Desktop: Grid Layout */}
          <div className="flex flex-col items-center gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:items-start md:gap-8">
            {/* Your Account Section */}
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h3 className="text-lg font-semibold">Your Account</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    className="text-white hover:underline text-left"
                    onClick={() => setShowModal("login")}
                  >
                    Log In
                  </button>
                </li>
                <li>
                  <button
                    className="text-white hover:underline text-left"
                    onClick={() => setShowModal("signup")}
                  >
                    Create Account
                  </button>
                </li>
                <li>
                  <Link to="/orders" className="text-white hover:underline">
                    Orders History
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-white hover:underline">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payments Section */}
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h3 className="text-lg font-semibold">Payments</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/payments" className="text-white hover:underline">
                    Debit Card
                  </Link>
                </li>
                <li>
                  <Link to="/payments" className="text-white hover:underline">
                    Credit Card
                  </Link>
                </li>
                <li>
                  <Link to="/payments" className="text-white hover:underline">
                    Net Banking
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Section */}
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/services" className="text-white hover:underline">
                    Home Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-white hover:underline">
                    Installation
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-white hover:underline">
                    24/7 Customer Care
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Help & Support Section - Mobile: Top Right, Desktop: Right Bottom Corner */}
          <div className="flex flex-col gap-2 absolute top-4 right-4 md:relative md:top-auto md:right-auto lg:absolute lg:bottom-12 lg:right-8">
            <h3 className="text-sm font-semibold">Help &amp; Support</h3>
            <p className="text-yellow-300 font-semibold text-sm">1800 564 657</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Copyright Bar */}
      <div className="border-t border-white bg-[#b30000] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-white">
            © 2025 Dinesh PVC Pipes | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

