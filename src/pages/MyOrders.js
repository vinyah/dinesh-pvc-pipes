import React, { useEffect, useState } from "react";
import "./MyOrders.css";

const CURRENT_USER_KEY = "currentUser";
const ORDERS_KEY = "myOrders"; // ✅ FIXED

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    if (!user) {
      setOrders([]);
      return;
    }

    const userOrders = allOrders.filter(
      (order) => order.userEmail === user.email
    );

    setOrders(userOrders);
  }, []);

  const tabs = ["Placed"];

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-heading">My Orders</h2>

        <div className="orders-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? "active-tab" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-main">
        {filteredOrders.length === 0 ? (
          <p className="no-orders-text">No orders placed yet.</p>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className={`status-tag ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="order-info">
                    {order.date} | Order ID: {order.orderId}
                  </span>
                </div>

                {order.items.map((item, idx) => (
                  <div className="order-body" key={idx}>
                    <div className="order-img-wrap">
                      <img
                        src={require(`../assets/${item.image}`)}
                        alt={item.productName}
                        className="order-img"
                      />
                    </div>

                    <div className="order-details">
                      <h3 className="order-name">{item.productName}</h3>
                      <p className="price">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
