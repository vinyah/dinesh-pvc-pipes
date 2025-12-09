import React, { useState } from "react";
import "./MyOrders.css";
import ordersData from "../data/orders.json"; // ✅ Using JSON

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("All");

  const orders = ordersData;

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const tabs = ["All", "Shipped", "Delivered", "Canceled"];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-heading">My Orders</h2>

        <div className="orders-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              className={`tab-item ${activeTab === tab ? "active-tab" : ""}`}
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-main">
        {filteredOrders.length === 0 ? (
          <p className="no-orders-text">No orders in this category yet.</p>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span
                    className={`status-tag ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                  <span className="order-info">
                    at {order.date} | Order ID: {order.orderId}
                  </span>
                </div>

                <div className="order-body">
                  <div className="order-img-wrap">
                    <img
                      src={require(`../assets/${order.image}`)}
                      alt={order.productName}
                      className="order-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="order-details">
                    <h3 className="order-name">{order.productName}</h3>
                    <p className="price">{order.price}</p>
                  </div>

                  <button type="button" className="details-btn">
                    Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
