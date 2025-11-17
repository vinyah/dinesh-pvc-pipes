import React from "react";
import { Link } from "react-router-dom";
import "./ItemPage.css";

import itemsData from "../data/items.json";

const Items = () => {
  return (
    <div className="item-page">
      <h1 className="item-heading">
        Explore Our <span className="highlight">Wide Range</span> of Products
      </h1>

      <p className="item-subtext">
        Discover our{" "}
        <span className="emphasis">comprehensive collection</span> of
        high-quality PVC pipes and electrical fittings.
      </p>

      <div className="product-grid">
        {itemsData.map((product) => (
          <Link
            key={product.id}
            to={product.link} // ✅ Uses each item's custom link from JSON
            className="product-card-link"
          >
            <div className="product-card">
              <div className="product-img">
                <img
                  src={require(`../assets/${product.image}`)}
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Items;

