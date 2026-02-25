import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Truck, Package, CheckCircle, ChevronLeft, Calendar, Hash, Clock } from "lucide-react";
import { getImageUrl } from "../utils/imageLoader";

const CURRENT_USER_KEY = "currentUser";
const ORDERS_KEY = "myOrders";
const ORDER_TRACKING_KEY = "orderTracking";

const THEME = {
  red: "#b30000",
  redDark: "#8c0000",
};

const TIMELINE_STEPS = [
  { key: "Order Placed", label: "Order Placed", desc: "Order confirmed and being prepared" },
  { key: "Picked Up", label: "Picked Up", desc: "Picked up by courier" },
  { key: "In Transit", label: "In Transit", desc: "On the way to you" },
  { key: "Out For Delivery", label: "Out for Delivery", desc: "Out for delivery today" },
  { key: "Delivered", label: "Delivered", desc: "Delivered successfully" },
];

const STATUS_TO_INDEX = {
  "Order Placed": 0,
  "Picked Up": 1,
  "In Transit": 2,
  "Out For Delivery": 3,
  "Delivered": 4,
};

function getEstimatedDeliveryFromOrder(order) {
  if (!order) return { date: "", time: "" };
  let orderDate = new Date();
  if (order.dateTime) {
    const parsed = new Date(order.dateTime);
    if (!isNaN(parsed.getTime())) orderDate = parsed;
  } else if (order.date) {
    const parsed = new Date(order.date);
    if (!isNaN(parsed.getTime())) orderDate = parsed;
  }
  const deliveryOption = order.delivery || { id: "standard" };
  let daysToAdd = 7;
  if (deliveryOption.id === "express") daysToAdd = 3;
  else if (deliveryOption.id === "premium") daysToAdd = 1;
  const estimated = new Date(orderDate);
  estimated.setDate(estimated.getDate() + daysToAdd);
  return {
    date: estimated.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: estimated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

function formatOrderDateTime(order) {
  if (!order) return "—";
  if (order.dateTime) {
    const d = new Date(order.dateTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", hour12: true });
    }
  }
  if (order.date) return `${order.date}, —`;
  return "—";
}

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { order, tracking } = useMemo(() => {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "{}");
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    const order = allOrders.find(
      (o) => (o.orderId === orderId || String(o.id) === String(orderId)) && o.userEmail === user.email
    );

    const trackingStore = JSON.parse(localStorage.getItem(ORDER_TRACKING_KEY) || "{}");
    let tracking = trackingStore[order?.orderId || orderId] || null;

    if (!tracking && order) {
      const est = getEstimatedDeliveryFromOrder(order);
      const orderPlacedStr = order.dateTime
        ? new Date(order.dateTime).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short", hour12: true })
        : order.date ? `${order.date}, —` : "Order confirmed";
      tracking = {
        orderId: order.orderId,
        status: order.status === "Delivered" ? "Delivered" : "Order Placed",
        partner: "",
        trackingId: "",
        origin: "Dinesh PVC Pipes Warehouse",
        destination: order.address
          ? [order.address.line1 || order.address.address, order.address.city, order.address.state, order.address.pin || order.address.pincode].filter(Boolean).join(", ")
          : "",
        estDelivery: est.date || "",
        estDeliveryTime: est.time || "",
        lastUpdate: orderPlacedStr + " — Order confirmed",
        progress: order.status === "Delivered" ? 100 : 20,
      };
    }

    return { order, tracking };
  }, [orderId]);

  const currentStepIndex = tracking ? (STATUS_TO_INDEX[tracking.status] ?? 0) : 0;
  const progressPercent = tracking ? (tracking.progress ?? (currentStepIndex + 1) * 20) : 20;

  if (!order) {
    return (
      <div className="w-full min-h-[calc(100vh-8rem)] bg-gray-100 flex items-center justify-center py-8 px-4 max-md:pt-32 md:pt-28">
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order not found</h1>
            <p className="text-gray-600 mb-6">This order doesn&apos;t exist or you don&apos;t have access to it.</p>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8c0000] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderItems = order.items && order.items.length > 0 ? order.items : null;

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] bg-gray-100 py-6 md:py-8 px-4 md:px-6 lg:px-10 max-md:pt-32 md:pt-28">
      {/* Full-width container: edge-to-edge with responsive padding */}
      <div className="w-full mx-auto">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#b30000] text-sm font-medium mb-4 md:mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to My Orders
        </button>

        {/* Hero header strip - full width, theme red */}
        <div
          className="w-full rounded-lg overflow-hidden mb-6"
          style={{ background: `linear-gradient(135deg, ${THEME.red} 0%, ${THEME.redDark} 100%)` }}
        >
          <div className="p-6 md:p-8 lg:p-10 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">Track your order</h1>
                <p className="text-white/90 text-sm md:text-base flex items-center gap-2 mt-1">
                  <Hash className="w-4 h-4 opacity-80" /> {order.orderId || order.id}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-sm font-semibold">
                    {tracking?.status || order.status || "Placed"}
                  </span>
                  {tracking?.estDelivery && (
                    <span className="inline-flex items-center gap-1.5 text-white/95 text-sm flex-wrap">
                      <Calendar className="w-4 h-4 shrink-0" /> Est. delivery: {tracking.estDelivery}
                      {tracking.estDeliveryTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-80" /> by {tracking.estDeliveryTime}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              {order.total != null && (
                <div className="lg:text-right">
                  <p className="text-white/80 text-sm">Total amount</p>
                  <p className="text-2xl md:text-3xl font-bold">₹{order.total}</p>
                </div>
              )}
            </div>
            {/* Progress bar - full width */}
            <div className="mt-6 lg:mt-8">
              <div className="flex justify-between text-xs font-medium text-white/80 mb-1">
                <span>Progress</span>
                <span>{Math.min(100, progressPercent)}%</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content: left = tracking + order summary (side), right = timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
          {/* Left column (side): Tracking details + Order summary + Origin + Address */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6 order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Truck className="w-5 h-5 text-[#b30000] shrink-0" /> Tracking details
              </h2>
              <dl className="space-y-3 md:space-y-4 text-sm">
                {tracking?.trackingId && (
                  <div>
                    <dt className="text-gray-500 font-medium">Tracking ID</dt>
                    <dd className="text-gray-800 font-mono mt-0.5 break-all">{tracking.trackingId}</dd>
                  </div>
                )}
                {tracking?.partner && (
                  <div>
                    <dt className="text-gray-500 font-medium">Carrier</dt>
                    <dd className="text-gray-800 mt-0.5">{tracking.partner}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500 font-medium">Order date & time</dt>
                  <dd className="text-gray-800 mt-0.5">{formatOrderDateTime(order)}</dd>
                </div>
                {tracking?.lastUpdate && (
                  <div>
                    <dt className="text-gray-500 font-medium">Last update</dt>
                    <dd className="text-gray-800 mt-0.5 text-balance">{tracking.lastUpdate}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Order summary with images - always in the side column */}
            {orderItems && orderItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                  <Package className="w-5 h-5 text-[#b30000] shrink-0" /> Order summary
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 md:gap-4 py-2 md:py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {(item.image || item.imageName) ? (
                          <img
                            src={getImageUrl(item.image || item.imageName)}
                            alt={item.productName || item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm md:text-base truncate">{item.productName || item.name}</p>
                        {item.code && <p className="text-xs md:text-sm text-gray-500">Code: {item.code}</p>}
                        <p className="text-xs md:text-sm text-[#b30000] font-semibold mt-0.5">
                          ₹{item.price ?? item.unitPrice} × {item.quantity ?? 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.total != null && (
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 flex justify-end">
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-500">Total</p>
                      <p className="text-lg md:text-xl font-bold text-[#b30000]">₹{order.total}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tracking?.origin && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <p className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#b30000] shrink-0" /> Origin
                </p>
                <p className="text-gray-800 text-sm">{tracking.origin}</p>
              </div>
            )}

            {tracking?.destination && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <p className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#b30000] shrink-0" /> Delivery address
                </p>
                <p className="text-gray-800 text-sm leading-relaxed break-words">{tracking.destination}</p>
              </div>
            )}
          </div>

          {/* Right column: Timeline only */}
          <div className="lg:col-span-8 order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
              <h2 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2 border-b border-gray-200 pb-3">
                <span className="w-8 h-8 rounded-lg bg-[#b30000] text-white flex items-center justify-center text-sm font-bold shrink-0">1</span>
                Delivery progress
              </h2>
              <div className="relative">
                {TIMELINE_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step.key} className="flex gap-3 md:gap-5 pb-6 md:pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                            isCompleted
                              ? "bg-[#b30000] border-[#b30000] text-white"
                              : "bg-white border-gray-200 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                          ) : (
                            <span className="text-xs md:text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        {index < TIMELINE_STEPS.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 min-h-[1.5rem] md:min-h-[2.5rem] mt-1 md:mt-2 rounded-full ${
                              isCompleted ? "bg-[#b30000]" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 pt-0.5 rounded-lg px-3 py-2 md:px-4 md:py-3 -ml-1 ${
                        isCurrent ? "bg-red-50 border-l-4 border-[#b30000]" : ""
                      }`}>
                        <p className={`font-semibold text-sm md:text-base ${isCurrent ? "text-[#b30000]" : "text-gray-800"}`}>
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-xs font-normal text-gray-500">(current)</span>
                          )}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
