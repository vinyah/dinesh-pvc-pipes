import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { Package, FileText, ShoppingCart, User, Search } from "lucide-react";

function Header() {
  return (
    <header className="header">
      {/* Left Section: Company name linked to home */}
      <div className="header-left">
        <Link to="/" className="home-link">
          <h1>Dinesh PVC Pipes</h1>
        </Link>
      </div>

      {/* Right Section: Search + Navigation */}
      <div className="header-right">
        <div className="search-container">
          <Search className="icon" style={{ color: '#b30000', marginRight: '8px' }} />
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>

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
      </div>
    </header>
  );
}

export default Header;


