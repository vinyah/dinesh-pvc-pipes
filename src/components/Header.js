import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/Hlogo.png";
import { Package, FileText, ShoppingCart, User, Search } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Left Section: Logo + Company name */}
      <div className="header-left">
        <Link to="/" className="home-link" onClick={() => setMenuOpen(false)}>
          <div className="header-logo-title">
            <img src={logo} alt="Logo" className="header-logo" />
            <h1>Dinesh PVC Pipes</h1>
          </div>
        </Link>
      </div>

      {/* Right Section: Search + Navigation */}
      <div className="header-right">
        <div className="search-container">
          <Search className="icon" />
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>

        {/* Desktop / tablet nav icons */}
        <nav className="nav-icons">
          <Link to="/items" className="icon-box">
            <Package className="icon" />
            <span className="label">Items</span>
          </Link>

          <Link to="/orders" className="icon-box">
            <FileText className="icon" />
            <span className="label">Orders</span>
          </Link>

          <Link to="/cart" className="icon-box">
            <ShoppingCart className="icon" />
            <span className="label">Cart</span>
          </Link>

          <Link to="/account" className="icon-box">
            <User className="icon" />
            <span className="label">Account</span>
          </Link>
        </nav>

        {/* Hamburger button – visible only on mobile via CSS */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile menu – hidden on desktop via CSS */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <Link
          to="/items"
          className="mobile-menu-item"
          onClick={() => setMenuOpen(false)}
        >
          Items
        </Link>
        <Link
          to="/orders"
          className="mobile-menu-item"
          onClick={() => setMenuOpen(false)}
        >
          Orders
        </Link>
        <Link
          to="/cart"
          className="mobile-menu-item"
          onClick={() => setMenuOpen(false)}
        >
          Cart
        </Link>
        <Link
          to="/account"
          className="mobile-menu-item"
          onClick={() => setMenuOpen(false)}
        >
          Account
        </Link>
      </div>
    </header>
  );
}

export default Header;
