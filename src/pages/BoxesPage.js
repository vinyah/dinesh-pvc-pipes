import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BoxesPage.css";
import boxesData from "../data/boxes.json";

const BoxesPage = () => {
  const navigate = useNavigate();

  // 🧩 Handle missing or empty JSON data
  if (!boxesData || boxesData.length === 0) {
    return (
      <div className="boxes-page">
        <h2>No Box Products Available</h2>
        <button className="back-btn" onClick={() => navigate("/items")}>
          ← Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="boxes-page">
      {/* ===== HEADING ===== */}
      <h1 className="boxes-heading">
        Explore Our <span className="highlight">Junction Boxes</span>
      </h1>

      <p className="boxes-subtext">
        Discover our range of{" "}
        <span className="emphasis">durable and high-quality</span> electrical
        boxes suitable for every type of installation.
      </p>

      {/* ===== BOXES GRID ===== */}
      <div className="boxes-grid">
        {boxesData.map((item) => (
          <Link key={item.id} to={item.link} className="boxes-card-link">
            <div className="boxes-card">
              <div className="boxes-img">
                <img
                  src={require(`../assets/${item.image}`)}
                  alt={item.name}
                  loading="lazy"
                />
              </div>
              <div className="boxes-info">
                <h3>{item.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ===== BACK BUTTON ===== */}
      <button className="back-btn" onClick={() => navigate("/items")}>
        ← Back to Products
      </button>
    </div>
  );
};

export default BoxesPage;
