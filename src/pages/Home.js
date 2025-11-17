import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import "./Pages.css";
import pipe1 from "../assets/1.png";
import pipe2 from "../assets/2.png";
import pipe3 from "../assets/3.png";
import pipe4 from "../assets/4.png";
import pipe5 from "../assets/5.png";
import pipe6 from "../assets/6.png";
import pipe7 from "../assets/7.png";
import pipe8 from "../assets/8.png";
import LoginSignupModal from "./LoginSignupModal";
import homeData from "../data/home.json";

function Home() {
  const [showModal, setShowModal] = useState(null);
  const navigate = useNavigate(); // ✅ Create navigate function

  const words = [
    "In Every House",
    "ప్రతి ఇంటిలో",
    "ഓരോ വീട്ടിലും",
    "ஒவ்வொரு வீட்டிலும்",
    "ಪ್ರತಿಯೊಂದು ಮನೆಯಲ್ಲಿ",
    "हर घर में",
    "In Every House",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pipeImages = [
    { src: pipe1, link: "/1" },
    { src: pipe2, link: "/2" },
    { src: pipe3, link: "/3" },
    { src: pipe4, link: "/4" },
    { src: pipe5, link: "/5" },
    { src: pipe6, link: "/6" },
    { src: pipe7, link: "/7" },
    { src: pipe8, link: "/8" },
  ];

  return (
    <div className="page home">
      {/* === Section 1: Hero === */}
      <section className="hero">
        {pipeImages.map((pipe, i) => (
          <a key={i} href={pipe.link} className={`pipe-img pipe-${i + 1}`}>
            <img src={pipe.src} alt={`Pipe ${i + 1}`} />
          </a>
        ))}

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

          {/* ✅ Updated Button: Navigates to /items */}
          <button
            className="offer-btn"
            onClick={() => navigate("/items")}
          >
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

      {/* === LOGIN/SIGNUP MODAL === */}
      {showModal && (
        <LoginSignupModal
          type={showModal}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  );
}

export default Home;
