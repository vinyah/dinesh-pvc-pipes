// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import db from "../../db.json";
import { getImageUrl } from "../utils/imageLoader";

// Sliding background images for hero section
const heroImages = ["p1c.png", "bg1.jpg", "bg2.webp", "bg4.webp", "bg5.avif"];

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

function Home({ setShowModal }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change hero background image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
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
        className="relative w-full min-h-[700px] max-md:min-h-[500px] flex flex-col items-center md:justify-center max-md:justify-start overflow-hidden max-md:mt-0 max-md:pt-20 bg-black"
      >
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${getImageUrl(img)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'transparent',
              }}
            />
          ))}
        </div>
        
        {/* Left Bottom Corner Content */}
        <div className="absolute left-4 bottom-16 md:left-12 md:bottom-20 z-20 flex flex-col items-start">
          <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl mb-6 drop-shadow-lg">
            Dinesh<br />PVC Pipes
          </h1>
          <button
            onClick={() => navigate("/items")}
            className="px-8 py-4 bg-[#b30000] text-white rounded-lg font-semibold text-lg md:text-xl hover:bg-[#8b0000] transition-colors shadow-lg"
          >
            Explore Products
          </button>
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

      {/* === Section 3: Featured Categories === */}
      <section 
        className="relative w-full py-16 px-4 bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("BGred.png")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Featured Categories
          </h1>

          {/* Descriptive Text */}
          <p className="text-center mb-12 text-xl md:text-2xl text-white italic font-serif font-light tracking-wider leading-relaxed">
            Quality piping products across essential categories
          </p>

          {/* 4 Category Cards */}
          <div className="max-w-sm md:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PVC Pipes */}
          <Link
            to="/product/1"
            className="bg-white rounded-lg overflow-hidden cursor-pointer block hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-full h-56 md:h-80 bg-white flex items-center justify-center overflow-hidden">
              <img
                src={getImageUrl("i1.png")}
                alt="PVC Pipes"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-white py-4 text-center">
              <h3 className="text-lg font-semibold text-black">PVC Pipes</h3>
            </div>
          </Link>

          {/* Flexible Pipes */}
          <Link
            to="/flexiblepipe"
            className="bg-white rounded-lg overflow-hidden cursor-pointer block hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-full h-56 md:h-80 bg-white flex items-center justify-center overflow-hidden">
              <img
                src={getImageUrl("i3.png")}
                alt="Flexible Pipes"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-white py-4 text-center">
              <h3 className="text-lg font-semibold text-black">Flexible Pipes</h3>
            </div>
          </Link>

          {/* Pipe Bend */}
          <Link
            to="/pipebend"
            className="bg-white rounded-lg overflow-hidden cursor-pointer block hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-full h-56 md:h-80 bg-white flex items-center justify-center overflow-hidden">
              <img
                src={getImageUrl("i7.png")}
                alt="Pipe Bend"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-white py-4 text-center">
              <h3 className="text-lg font-semibold text-black">Pipe Bend</h3>
            </div>
          </Link>

          {/* Round Junction Box */}
          <Link
            to="/boxes/a"
            className="bg-white rounded-lg overflow-hidden cursor-pointer block hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-full h-56 md:h-80 bg-white flex items-center justify-center overflow-hidden">
              <img
                src={getImageUrl("boxA1.png")}
                alt="Round Junction Box"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-white py-4 text-center">
              <h3 className="text-lg font-semibold text-black">Round Junction Box</h3>
            </div>
          </Link>
          </div>
        </div>
      </section>

      {/* === Section 4: Flagship Products === */}
      <section className="w-full py-16 px-4 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
          Flagship Products
        </h1>

        {/* Descriptive Text */}
        <p className="text-center mb-12 text-xl md:text-2xl text-black italic font-serif font-light tracking-wider leading-relaxed">
          Showcasing our most trusted essentials
        </p>

        <div className="max-w-64 md:max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PVC Pipe */}
          <Link
            to="/product/1"
            className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer"
          >
            <img
              src={getImageUrl("p1a.png")}
              alt="PVC Pipe"
              className="w-full h-full object-cover"
            />
            {/* Product Name - Always Visible */}
            <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
              <h3 className="text-black text-xl md:text-2xl font-medium">
                PVC Pipe
              </h3>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                PVC Pipe
              </h3>
              <p className="text-white text-base md:text-lg text-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Reliable PVC pipes for every project
              </p>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                EXPLORE
              </button>
            </div>
          </Link>

          {/* Reducer Fitting */}
          <Link
            to="/pipefitting/c"
            className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer"
          >
            <img
              src={getImageUrl("pf3a.png")}
              alt="Reducer Fitting"
              className="w-full h-full object-cover"
            />
            {/* Product Name - Always Visible */}
            <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
              <h3 className="text-black text-xl md:text-2xl font-medium">
                Reducer Fitting
              </h3>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Reducer Fitting
              </h3>
              <p className="text-white text-base md:text-lg text-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Seamless pipe size reduction solutions
              </p>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                EXPLORE
              </button>
            </div>
          </Link>

          {/* Round Junction Box */}
          <Link
            to="/boxes/a"
            className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer"
          >
            <img
              src={getImageUrl("boxA1.png")}
              alt="Round Junction Box"
              className="w-full h-full object-cover"
            />
            {/* Product Name - Always Visible */}
            <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
              <h3 className="text-black text-xl md:text-2xl font-medium">
                Round Junction Box
              </h3>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Round Junction Box
              </h3>
              <p className="text-white text-base md:text-lg text-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Secure and neat wiring solutions
              </p>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                EXPLORE
              </button>
            </div>
          </Link>

          {/* Flexible Pipe */}
          <Link
            to="/flexiblepipe"
            className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer"
          >
            <img
              src={getImageUrl("fp1a.png")}
              alt="Flexible Pipe"
              className="w-full h-full object-cover"
            />
            {/* Product Name - Always Visible */}
            <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
              <h3 className="text-black text-xl md:text-2xl font-medium">
                Flexible Pipe
              </h3>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Flexible Pipe
              </h3>
              <p className="text-white text-base md:text-lg text-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Flexible piping for easy installation
              </p>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                EXPLORE
              </button>
            </div>
          </Link>
        </div>
      </section>

      {/* === Section 5: What Sets Us Apart === */}
      <section 
        className="relative w-full py-16 px-4 bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("BGred.png")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            What Sets Us Apart
          </h1>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {(homeData.apart?.images || []).map((img, i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg shadow-md p-4 md:p-6 aspect-[3/2] md:aspect-[3/2] flex items-center justify-center hover:shadow-lg hover:border-2 hover:border-[#b30000] hover:-translate-y-2 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <img src={getImageUrl(img)} alt="Apart" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* === Section 6: Sign Up / Login === */}
      <section 
        className="relative w-full py-16 px-4 bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl("BGred.png")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="text-center">
            <p className="text-lg mb-4 text-white">{homeData.accountSection.signupText}</p>
            <button
              className="px-8 py-3 border-2 border-white text-white bg-transparent rounded-lg font-semibold hover:bg-white hover:text-[#b30000] transition-colors"
              onClick={() => setShowModal("signup")}
            >
              {homeData.accountSection.signupButton}
            </button>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4 text-white">{homeData.accountSection.loginText}</p>
            <button
              className="px-8 py-3 border-2 border-white text-white bg-transparent rounded-lg font-semibold hover:bg-white hover:text-[#b30000] transition-colors"
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

