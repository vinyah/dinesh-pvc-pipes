import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaSignOutAlt,
  FaArrowRight,
  FaDoorOpen,
  FaCamera,
} from "react-icons/fa";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const CURRENT_USER_KEY = "currentUser";

const ProfilePage = ({ currentUser, openAuthModal, setCurrentUser }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photoURL: "",
  });

  /* 🔥 SYNC WITH APP AUTH STATE */
  useEffect(() => {
    if (currentUser) {
      const normalized = {
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        photoURL: currentUser.photoURL || "",
      };
      setUser(normalized);
      setFormData(normalized);
    } else {
      setUser(null);
    }
  }, [currentUser]); // 🔥 IMPORTANT

  // Load recent orders for this user from localStorage
  useEffect(() => {
    try {
      if (!currentUser?.email) {
        setRecentOrders([]);
        return;
      }
      const raw = localStorage.getItem("myOrders");
      if (!raw) {
        setRecentOrders([]);
        return;
      }
      const allOrders = JSON.parse(raw);
      if (!Array.isArray(allOrders)) {
        setRecentOrders([]);
        return;
      }
      const userOrders = allOrders.filter(
        (order) => order && order.userEmail === currentUser.email
      );
      // take latest 3 orders (last ones), newest first
      const latest = userOrders.slice(-3).reverse();
      setRecentOrders(latest);
    } catch {
      setRecentOrders([]);
    }
  }, [currentUser]);

  /* 🔹 Persist user */
  const persistUser = (nextUser) => {
    setUser(nextUser);
    setCurrentUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
  };

  /* 🔹 Navigation */
  const goHome = () => navigate("/");
  const goItems = () => navigate("/items");
  const goCart = () => navigate("/cart");
  const goOrders = () => navigate("/orders");
  const goWishlist = () => navigate("/wishlist");
  const goAddresses = () => navigate("/add-address");

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      // onAuthStateChanged in App.jsx will set currentUser to null and clear localStorage
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setCurrentUser(null);
  };

  /* 🔹 Edit handlers */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    persistUser(formData);
    setIsEditing(false);
  };

  /* 🔹 Open auth modal */
  const handleOpenSignup = () => {
    if (typeof openAuthModal === "function") {
      openAuthModal("signup");
    } else {
      navigate("/");
    }
  };

  /* 🔹 Open login modal */
  const handleOpenLogin = () => {
    if (typeof openAuthModal === "function") {
      openAuthModal("login");
    } else {
      navigate("/?openLogin=1");
    }
  };

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 pt-24 md:pt-28">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">You haven&apos;t logged in yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please login to access your account and view your profile details.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] transition-colors"
              onClick={handleOpenLogin}
            >
              Log In
            </button>
            <button
              type="button"
              className="px-5 py-2.5 bg-white text-[#b30000] border-2 border-[#b30000] rounded-lg font-medium hover:bg-red-50 transition-colors"
              onClick={goHome}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= LOGGED IN ================= */
  return (
    <div className="w-full bg-white pt-24 md:pt-28 pb-8 px-4 md:px-8">
      {/* Page Title - below fixed header */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full flex flex-col">
            {/* Avatar and User Info - click to change photo / edit */}
            <div className="flex flex-col items-center mb-6">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex flex-col items-center focus:outline-none"
                aria-label="Change photo or edit profile"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-300 bg-[#b30000]/10 [&>img]:object-cover [&>img]:object-center">
                    {(isEditing ? formData.photoURL : user.photoURL) ? (
                      <img
                        src={isEditing ? formData.photoURL : user.photoURL}
                        alt=""
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <FaUser className="text-[#b30000] text-2xl" />
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#b30000] rounded-full flex items-center justify-center text-white border-2 border-white">
                    <FaCamera className="w-2.5 h-2.5" />
                  </span>
                </div>
                <span className="mt-1.5 text-xs font-medium text-gray-500 hover:text-[#b30000] transition-colors cursor-pointer">
                  Change photo
                </span>
              </button>
              <div className="text-center mt-1">
                <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-600 mt-1">{user.email}</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                onClick={goHome}
              >
                <FaHome className="text-gray-600" />
                <span>Home</span>
              </button>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                onClick={goItems}
              >
                <FaBoxOpen className="text-gray-600" />
                <span>Items</span>
              </button>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                onClick={goCart}
              >
                <FaShoppingCart className="text-gray-600" />
                <span>Cart</span>
              </button>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-[#b30000] hover:bg-red-50 rounded-lg transition-colors text-left"
                onClick={handleLogout}
              >
                <FaArrowRight className="text-[#b30000]" />
                <FaDoorOpen className="text-[#b30000]" />
                <span className="text-[#b30000]">Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ===== RIGHT PANEL - ACCOUNT OVERVIEW ===== */}
        <main className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Overview</h2>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  ) : (
                    <div className="text-base text-gray-800">{user.name || "Not set"}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  ) : (
                    <div className="text-base text-gray-800">{user.phone || "Not set"}</div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  ) : (
                    <div className="text-base text-gray-800">{user.email || "Not set"}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  ) : (
                    <div className="text-base text-gray-800">{user.address || "Not set"}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile photo - only in edit mode */}
            {isEditing && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile photo</label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-14 h-14 rounded-full bg-[#b30000]/10 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {formData.photoURL ? (
                      <img src={formData.photoURL} alt="" className="w-full h-full object-cover object-center" />
                    ) : (
                      <FaUser className="text-[#b30000] text-xl" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#b30000] file:text-white file:text-sm file:font-medium"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => handleChange("photoURL", reader.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleChange("photoURL", "")}
                      className="text-sm text-gray-600 hover:text-[#b30000]"
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Button - Bottom Right */}
            <div className="flex justify-end">
              {isEditing ? (
                <button
                  className="px-6 py-2.5 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className="px-6 py-2.5 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Recent Orders & Quick Links */}
          <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p className="text-sm md:text-base text-gray-700 mb-8">
                No orders yet. Start shopping to see your orders here!
              </p>
            ) : (
              <div className="mb-8 space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id || order.orderId}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-xl border border-gray-200 px-4 py-3 bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 bg-[#b30000] text-white text-xs font-semibold rounded-full">
                        {(order && order.status) || "Placed"}
                      </span>
                      {order?.orderId && (
                        <span className="text-xs md:text-sm text-gray-700 font-medium">
                          ID: {order.orderId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs md:text-sm text-gray-700">
                      {order?.date && <span>{order.date}</span>}
                      {order?.total && (
                        <span className="font-semibold text-[#b30000]">
                          ₹{order.total}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Track Orders */}
              <button
                type="button"
                onClick={goOrders}
                className="flex flex-col items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#b30000] hover:-translate-y-1 transition-transform transition-shadow px-4 py-6 text-center"
              >
                <span className="text-3xl mb-2">📦</span>
                <span className="text-base md:text-lg font-semibold text-gray-900">Track Orders</span>
                <span className="text-xs md:text-sm text-gray-600 mt-1">
                  View order status and tracking
                </span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={goWishlist}
                className="flex flex-col items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#b30000] hover:-translate-y-1 transition-transform transition-shadow px-4 py-6 text-center"
              >
                <span className="text-3xl mb-2">♡</span>
                <span className="text-base md:text-lg font-semibold text-gray-900">Wishlist</span>
                <span className="text-xs md:text-sm text-gray-600 mt-1">
                  View saved items
                </span>
              </button>

              {/* Addresses */}
              <button
                type="button"
                onClick={goAddresses}
                className="flex flex-col items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#b30000] hover:-translate-y-1 transition-transform transition-shadow px-4 py-6 text-center"
              >
                <span className="text-3xl mb-2">📍</span>
                <span className="text-base md:text-lg font-semibold text-gray-900">Addresses</span>
                <span className="text-xs md:text-sm text-gray-600 mt-1">
                  Manage delivery addresses
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

