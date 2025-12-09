// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

// 🖼️ Desktop & Mobile hero images
import heroBgDesktop from "../assets/hero-bg.png";
import heroBgMobile from "../assets/hero-bg-mobile.png";

import homeData from "../data/home.json";

// 🔤 Texts for the changing hero line
const words = [
  "In Every House",
  "ప్రతి ఇంటిలో",
  "ഓരോ വീട്ടിലും",
  "ஒவ்வொரு வீட்டிலும்",
  "ಪ್ರತಿಯೊಂದು ಮನೆಯಲ್ಲಿ",
  "हर घर में",
  "In Every House",
];

function Home({ setShowModal }) {
  const [index, setIndex] = useState(0);
  const [heroBg, setHeroBg] = useState(heroBgDesktop); // 👈 current bg image
  const navigate = useNavigate();

  // 🔁 Change language text
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 📱💻 Switch hero background for mobile vs laptop
  useEffect(() => {
    const updateBg = () => {
      const isMobile = window.innerWidth <= 768;
      setHeroBg(isMobile ? heroBgMobile : heroBgDesktop);
    };

    updateBg(); // run once on mount
    window.addEventListener("resize", updateBg);

    return () => window.removeEventListener("resize", updateBg);
  }, []);

  return (
    <div className="page home">
      {/* === Section 1: Hero === */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="hero-overlay">
          <h3 className="changing-text">{words[index]}</h3>

          <h1 className="hero-title">
            <span className="hero-title-main">Dinesh</span>
            <br />
            <span className="hero-title-sub">PVC Pipes</span>
          </h1>
        </div>

        <p className="hero-subtext">"Where Durability Meets Innovation"</p>
      </section>
      {/* === Section 2: About === */}
      <section className="about">
        <div className="about-content">
          <p className="intro-text">{homeData.about.introText}</p>
          <p className="desc-text">{homeData.about.descText}</p>

          <button className="offer-btn" onClick={() => navigate("/items")}>
            {homeData.about.buttonText || "See Products"}
          </button>
        </div>
      </section>

      {/* === Section 3: Products === */}
      <section className="products">
        <h1>Our Products</h1>
        <div className="product-container">
          {homeData.products.map((product, i) => (
            <div key={i} className="product-card">
              <img
                src={require(`../assets/${product.image}`)}
                alt={product.desc}
              />
              <p className="code">Code: {product.code}</p>
              <p className="desc">{product.desc}</p>
              <p className="qty">{product.qty}</p>
              <p className="price">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Section 4: What Sets Us Apart === */}
      <section className="apart">
        <h1>What Sets Us Apart</h1>
        <div className="apart-container">
          {homeData.apart.images.map((img, i) => (
            <div key={i} className="apart-card">
              <img src={require(`../assets/${img}`)} alt="Apart" />
            </div>
          ))}
        </div>
      </section>

      {/* === Section 5: Sign Up / Login === */}
      <section className="account-section">
        <div className="signup-login">
          <div className="signup">
            <p>{homeData.accountSection.signupText}</p>
            <button
              className="signup-btn"
              onClick={() => setShowModal("signup")}
            >
              {homeData.accountSection.signupButton}
            </button>
          </div>

          <div className="login">
            <p>{homeData.accountSection.loginText}</p>
            <button
              className="login-btn"
              onClick={() => setShowModal("login")}
            >
              {homeData.accountSection.loginButton}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
