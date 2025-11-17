import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PipeFittingPage.css";
import pipeFittingData from "../data/pipefittingpage.json";

const PipeFittingPage = () => {
  const navigate = useNavigate();

  // 🧩 Handle missing or empty JSON safely
  if (!pipeFittingData || pipeFittingData.length === 0) {
    return (
      <div className="pipefitting-page">
        <h2>No Pipe Fitting Products Available</h2>
        <button className="back-btn" onClick={() => navigate("/items")}>
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="pipefitting-page">
      {/* ===== Heading ===== */}
      <h1 className="pipefitting-heading">
        Explore Our <span className="highlight">Pipe Fittings</span>
      </h1>

      <p className="pipefitting-subtext">
        Choose from our <span className="emphasis">high-quality</span> and durable pipe fittings.
      </p>

      {/* ===== Product Grid ===== */}
      <div className="pipefitting-grid">
        {pipeFittingData.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="pipefitting-card-link"
            style={{ textDecoration: "none", color: "inherit" }} // ✅ Remove blue underline
          >
            <div className="pipefitting-card">
              <div className="pipefitting-img">
                <img src={require(`../assets/${item.image}`)} alt={item.name} />
              </div>
              <div className="pipefitting-info">
                <h3>{item.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ===== Back Button ===== */}
      <button className="back-btn" onClick={() => navigate("/items")}>
        ← Back to Products
      </button>
    </div>
  );
};

export default PipeFittingPage;
