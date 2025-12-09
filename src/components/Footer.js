import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo.png";

function Footer({ setShowModal }) {
  return (
    <footer className="footer">

      {/* Logo + Social */}
      <div className="footer-section logo-section">
        <img src={logo} alt="Company Logo" className="footer-logo" />

        <h3 className="follow-title">Follow Us</h3>
        <div className="social-icons">
          <a href="#"><Instagram /></a>
          <a href="#"><Twitter /></a>
          <a href="#"><Facebook /></a>
        </div>
      </div>

      {/* Account Section */}
      <div className="footer-section">
        <h3>Your Account</h3>
        <ul>
          <li>
            <button
              className="footer-auth-btn"
              onClick={() => setShowModal("login")}
            >
              Log In
            </button>
          </li>

          <li>
            <button
              className="footer-auth-btn"
              onClick={() => setShowModal("signup")}
            >
              Create Account
            </button>
          </li>

          <li><Link to="/orders">Orders History</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>
      </div>

      {/* Payments Section */}
      <div className="footer-section">
        <h3>Payments</h3>
        <ul>
          <li><Link to="/payments">Debit Card</Link></li>
          <li><Link to="/payments">Credit Card</Link></li>
          <li><Link to="/payments">Net Banking</Link></li>
        </ul>
      </div>

      {/* Services Section */}
      <div className="footer-section">
        <h3>Services</h3>
        <ul>
          <li><Link to="/services">Home Delivery</Link></li>
          <li><Link to="/services">Installation</Link></li>
          <li><Link to="/services">24/7 Customer Care</Link></li>
        </ul>
      </div>

      {/* Help & Support */}
      <div className="footer-support">
        <h4>Help & Support</h4>
        <p>1800 564 657</p>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2025 Dinesh PVC Pipes | All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
