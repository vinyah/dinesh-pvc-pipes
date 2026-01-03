// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Background images
import heroBgDesktop from "../assets/hero-bg.png";
import heroBgMobile from "../assets/hero-bg-mobile.png";

import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";

// Safe access to home data
const homeData = db?.pages?.home || {
  about: {
    introText: "Explore our wide range of high-performance piping solutions.",
    descText: "Quality PVC pipes for all your needs.",
    buttonText: "See Products"
  },
  products: [],
  apart: {
    images: []
  },
  accountSection: {
    signupText: "Don't have an Account?",
    signupButton: "Sign Up",
    loginText: "Got an Account?",
    loginButton: "Login"
  }
};

// Changing words for the hero section
const words = [
  "हर घर में",
  "In Every House",
  "ప్రతి ఇంటిలో",
  "ഓരോ വീട്ടിലും",
  "ஒவ்வொரு வீட்டிலும்",
  "ಪ್ರತಿಯೊಂದು ಮನೆಯಲ್ಲಿ",
];

function Home({ setShowModal }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  // Initialize with mobile check
  const [heroBg, setHeroBg] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768 
      ? heroBgMobile 
      : heroBgDesktop
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  // Change language text every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Switch hero background for mobile vs laptop
  useEffect(() => {
    const updateBg = () => {
      const mobile = window.innerWidth <= 768;
      setHeroBg(mobile ? heroBgMobile : heroBgDesktop);
      setIsMobile(mobile);
    };
    // Set initial background
    updateBg();
    // Update on resize
    window.addEventListener("resize", updateBg);
    return () => window.removeEventListener("resize", updateBg);
  }, []);

  // Helper function to get route based on product code
  const getProductRoute = (code) => {
    const routeMap = {
      "9201": "/flexiblepipe",      // Flexible Pipe
      "9103": "/pipefitting/c",     // PVC Reducer
      "9004": "/product/1"          // PVC Pipe
    };
    return routeMap[code] || "/items";
  };

  return (
    <div className="w-full min-h-screen">
      {/* === Section 1: Hero Banner === */}
      <section 
        className="relative w-full min-h-[700px] max-md:min-h-[500px] flex flex-col items-center md:justify-center max-md:justify-start overflow-hidden max-md:bg-contain md:bg-cover bg-center bg-no-repeat max-md:mt-0 max-md:pt-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          ...(isMobile && { backgroundSize: '110%' }),
        }}
      >
        {/* Central Branding Text - exact positioning */}
        <div className="relative z-10 text-center px-4 flex flex-col items-center md:justify-center max-md:justify-center w-full md:min-h-[700px] max-md:min-h-[500px] max-md:absolute max-md:inset-0">
          {/* Center Content - Changing Words and Brand Name */}
          <div className="flex flex-col items-center max-md:justify-center max-md:-mt-8 max-md:translate-x-6">
            {/* Top Text - Changing Words - reduced size, moved up and right on mobile */}
            <h3 className="text-white text-lg md:text-3xl font-semibold mb-3 md:mb-6 max-md:mb-2 max-md:-mt-8 md:mt-8">
              {words[index]}
            </h3>

            {/* Main Brand Name - moved up */}
            <h1 className="text-white text-4xl md:text-7xl font-semibold mb-2 max-md:mb-1">
              DINESH
            </h1>

            {/* Sub Brand Name - moved up */}
            <p className="text-white text-2xl md:text-4xl font-normal mb-4 md:mb-auto -mt-2 max-md:-mt-1">
              PVC PIPES
            </p>
          </div>

          {/* Bottom Slogan - moved up on mobile */}
          <p className="text-white text-base md:text-xl font-medium italic max-md:absolute max-md:bottom-16 max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-full max-md:px-4 md:mt-auto md:-mt-6 md:mb-4">
            "Where Durability Meets Innovation"
          </p>
        </div>
      </section>

      {/* === Section 2: About === */}
      <section 
        className="relative w-full py-16 md:py-24 px-4 md:px-8 bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("pipe-background.png")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Headline - Large, bold, black, centered, spans 4 lines */}
          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 md:mb-8 text-black leading-tight px-2">
            {homeData.about.introText || "Explore our wide range of high-performance piping solutions designed for strength, reliability, and durability."}
          </h2>
          
          {/* Sub-headline - Smaller, grey, centered, spans 3 lines */}
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
            {homeData.about.descText?.replace("Million Plast", "Dinesh PVC Pipes") || "From plumbing and agriculture to industrial infrastructure, Dinesh PVC Pipes offers comprehensive piping solutions that meet the highest standards of quality and performance."}
          </p>

          {/* CTA Button - White background, black text, red border, centered, clickable */}
          <button 
            className="px-8 md:px-12 py-3 md:py-4 bg-white border-2 border-[#b30000] text-black rounded-lg font-semibold text-sm md:text-base lg:text-lg hover:bg-[#b30000] hover:text-white transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/items")}
          >
            {homeData.about.buttonText || "See What We Offer"}
          </button>
        </div>
      </section>

      {/* === Section 3: Products === */}
      <section className="w-full py-16 px-4 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Our Products
        </h1>

        {/* Show only first 3 products, centered */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          {(homeData.products || []).slice(0, 3).map((product, i) => (
            <Link
              key={i}
              to={getProductRoute(product.code)}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:-translate-y-2 hover:border-2 hover:border-[#b30000] transition-all duration-300 cursor-pointer w-full md:w-auto md:flex-1 max-w-sm ${
                i === 1 ? "md:-mt-8" : ""
              }`}
            >
              <img
                src={getImageUrl(product.image)}
                alt={product.desc}
                className="w-full h-48 object-contain mb-4"
              />

              <p className="text-sm text-gray-600 mb-2">Code: {product.code}</p>
              <p className="text-lg font-semibold mb-2 text-gray-800">{product.desc}</p>
              <p className="text-sm text-gray-600 mb-2">{product.qty}</p>
              <p className="text-xl font-bold text-[#b30000]">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* === Section 4: What Sets Us Apart === */}
      <section className="w-full py-16 px-4 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          What Sets Us Apart
        </h1>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {(homeData.apart?.images || []).map((img, i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg shadow-md p-4 md:p-6 aspect-[3/2] md:aspect-[3/2] flex items-center justify-center hover:shadow-lg hover:scale-105 hover:border-2 hover:border-[#b30000] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <img src={getImageUrl(img)} alt="Apart" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* === Section 5: Sign Up / Login === */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="text-center">
            <p className="text-lg mb-4 text-gray-800">{homeData.accountSection.signupText}</p>
            <button
              className="px-8 py-3 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
              onClick={() => setShowModal("signup")}
            >
              {homeData.accountSection.signupButton}
            </button>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4 text-gray-800">{homeData.accountSection.loginText}</p>
            <button
              className="px-8 py-3 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
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

