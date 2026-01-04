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
} from "react-icons/fa";

const CURRENT_USER_KEY = "currentUser";

const ProfilePage = ({ currentUser, openAuthModal, setCurrentUser }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  /* 🔥 SYNC WITH APP AUTH STATE */
  useEffect(() => {
    if (currentUser) {
      const normalized = {
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      };
      setUser(normalized);
      setFormData(normalized);
    } else {
      setUser(null);
    }
  }, [currentUser]); // 🔥 IMPORTANT

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

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setCurrentUser(null); // 🔥 APP STATE
    // Don't navigate - let the component show the "not logged in" message
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
      navigate("/");
    }
  };

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">You haven't logged in yet</h2>
          <p className="text-gray-600 mb-6">
            Please login to access your account and view your profile details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
              onClick={handleOpenLogin}
            >
              Log In
            </button>
            <button
              type="button"
              className="px-6 py-3 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
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
    <div className="w-full bg-white py-8 px-4 md:px-8">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {/* Avatar and User Info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-[#b30000] rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-white text-2xl" />
              </div>
              <div className="text-center">
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

