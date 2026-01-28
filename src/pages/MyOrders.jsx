import React, { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageLoader";

const CURRENT_USER_KEY = "currentUser";
const ORDERS_KEY = "myOrders";

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("Placed");
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
      : orders.filter((o) => o.status === activeTab || activeTab === "Placed");

  return (
    <div className="w-full bg-white py-8 px-4 max-md:pt-32 md:pt-28">
      {/* Light Gray Panel */}
      <div className={`max-w-6xl mx-auto bg-gray-100 rounded-lg ${
        filteredOrders.length === 0 ? "p-6 md:p-8" : "p-6 md:p-8 min-h-[500px]"
      }`}>
        {/* Header Section */}
        <div className={filteredOrders.length === 0 ? "mb-4" : "mb-6"}>
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
            My Orders
          </h2>
          <div className="flex items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`text-sm md:text-base font-medium transition-colors ${
                  activeTab === tab
                    ? "text-gray-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center mt-2">
            <p className="text-gray-500 text-base md:text-lg">
              No orders placed yet.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id || order.orderId}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="mb-2 md:mb-0 flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-[#b30000] text-white text-xs md:text-sm font-semibold rounded">
                        {order.status || "Placed"}
                      </span>
                      {/* Item Count */}
                      {order.items && order.items.length > 0 && (
                        <span className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.date && (
                        <span className="mr-4">{order.date}</span>
                      )}
                      {order.orderId && (
                        <span>Order ID: {order.orderId}</span>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.productName || item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
                              {item.productName || item.name}
                            </h3>
                            {item.code && (
                              <p className="text-sm text-gray-600 mb-2">
                                Code: {item.code}
                              </p>
                            )}
                            <p className="text-base font-semibold text-[#b30000]">
                              ₹{item.price || item.unitPrice} × {item.quantity}
                            </p>
                            {item.size && (
                              <p className="text-sm text-gray-600 mt-1">
                                Size: {item.size}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
                            {order.item || "Order Item"}
                          </h3>
                          <p className="text-base font-semibold text-[#b30000]">
                            Quantity: {order.quantity || 1}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Estimated Delivery Date - Bottom Left */}
                    <div className="text-sm text-gray-600">
                      {(() => {
                        // Calculate estimated delivery date
                        let orderDate = new Date();
                        if (order.date) {
                          // Try to parse the date (handle different formats)
                          const parsed = new Date(order.date);
                          if (!isNaN(parsed.getTime())) {
                            orderDate = parsed;
                          }
                        }
                        
                        const deliveryOption = order.delivery || { id: "standard" };
                        
                        let daysToAdd = 7; // Default to Standard (5-7 days, use 7)
                        if (deliveryOption.id === "express") {
                          daysToAdd = 3; // 2-3 days, use 3
                        } else if (deliveryOption.id === "premium") {
                          daysToAdd = 1; // 1 day
                        }
                        
                        const estimatedDate = new Date(orderDate);
                        estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
                        
                        const formattedDate = estimatedDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        
                        return `Estimated Delivery: ${formattedDate}`;
                      })()}
                    </div>
                    
                    {/* Order Total - Bottom Right */}
                    {order.total && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-xl font-bold text-[#b30000]">
                          ₹{order.total}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

