import React, { useState } from "react";
import "./MyOrders.css";
import ordersData from "../data/orders.json";   // ✅ Using JSON

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("All");

  const orders = ordersData; // ✅ Loaded from JSON

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="orders-container">
      <h2 className="orders-heading">My Orders</h2>

      <div className="orders-tabs">
        {["All", "Shipped", "Delivered", "Canceled"].map((tab) => (
          <span
            key={tab}
            className={`tab-item ${activeTab === tab ? "active-tab" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className={`status-tag ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <span className="order-info">
                at {order.date} | order id : {order.orderId}
              </span>
            </div>

            <div className="order-body">
              <img
                src={require(`../assets/${order.image}`)}
                alt={order.productName}
                className="order-img"
              />

              <div className="order-details">
                <h3>{order.productName}</h3>
                <p className="price">{order.price}</p>
              </div>

              <button className="details-btn">Order Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;

