import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ProfilePage.css";

const CURRENT_USER_KEY = "currentUser";

// 🔹 Accept openAuthModal from parent (App) so we can open the signup popup
const ProfilePage = ({ openAuthModal }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // edit whole form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  /* 🔹 Load current user from localStorage on mount */
  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = {
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
        };
        setUser(normalized);
        setFormData(normalized);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  /* 🔹 Save to localStorage */
  const persistUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
  };

  /* 🔹 Navigation handlers */
  const goHome = () => navigate("/");
  const goItems = () => navigate("/items");
  const goCart = () => navigate("/cart");

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    navigate("/"); // back to home
  };

  /* 🔹 Edit / Save */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    persistUser(formData);
    setIsEditing(false);
  };

  /* 🔹 Open signup popup (or fallback to Home if no modal handler) */
  const handleOpenSignup = () => {
    if (typeof openAuthModal === "function") {
      openAuthModal("signup"); // opens the same modal as Home
    } else {
      navigate("/"); // fallback
    }
  };

  /* ================= Not logged in view ================= */
  if (!user) {
    return (
      <div className="profile-page-wrapper profile-page-empty">
        <div className="profile-empty-card">
          <h2>You’re not logged in</h2>
          <p>
            Log in or create an account to see your profile details and orders.
          </p>
          <button
            type="button"
            className="profile-primary-btn"
            onClick={handleOpenSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  /* ================= Logged in layout ================= */
  return (
    <div className="profile-page-wrapper">
      {/* Mobile header (you can hide on desktop via CSS) */}
      <header className="profile-header-mobile">
        <div className="profile-header-user">
          <div className="profile-avatar-circle">
            <FaUser />
          </div>
          <div>
            <div className="profile-header-name">{user.name || "User"}</div>
            <div className="profile-header-email">
              {user.email || "No email"}
            </div>
          </div>
        </div>
      </header>

      <h1 className="profile-page-title">My Account</h1>

      <div className="profile-layout">
        {/* ========== LEFT SIDEBAR (desktop / tablet) ========== */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-header">
            <div className="profile-avatar-circle">
              <FaUser />
            </div>
            <div>
              <div className="profile-sidebar-name">
                {user.name || "User"}
              </div>
              <div className="profile-sidebar-email">
                {user.email || "No email"}
              </div>
            </div>
          </div>

          <hr className="profile-divider" />

          <nav className="profile-menu">
            <button
              type="button"
              className="profile-menu-item"
              onClick={goHome}
            >
              <FaHome className="profile-menu-icon" />
              <span>Home</span>
            </button>

            <button
              type="button"
              className="profile-menu-item"
              onClick={goItems}
            >
              <FaBoxOpen className="profile-menu-icon" />
              <span>Items</span>
            </button>

            <button
              type="button"
              className="profile-menu-item"
              onClick={goCart}
            >
              <FaShoppingCart className="profile-menu-icon" />
              <span>Cart</span>
            </button>

            <button
              type="button"
              className="profile-menu-item logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="profile-menu-icon" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* ========== RIGHT CONTENT ========== */}
        <main className="profile-main">
          <section className="profile-overview-card">
            <h2 className="overview-title">Account Overview</h2>

            <div className="overview-grid">
              <div className="overview-field">
                <span className="overview-label">Full Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="overview-input"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                ) : (
                  <span className="overview-value">
                    {user.name || "Not set"}
                  </span>
                )}
              </div>

              <div className="overview-field">
                <span className="overview-label">Email</span>
                {isEditing ? (
                  <input
                    type="email"
                    className="overview-input"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                ) : (
                  <span className="overview-value">
                    {user.email || "Not set"}
                  </span>
                )}
              </div>

              <div className="overview-field">
                <span className="overview-label">Phone</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="overview-input"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                ) : (
                  <span className="overview-value">
                    {user.phone || "Not set"}
                  </span>
                )}
              </div>

              <div className="overview-field">
                <span className="overview-label">Address</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="overview-input"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                ) : (
                  <span className="overview-value">
                    {user.address || "Not set"}
                  </span>
                )}
              </div>
            </div>

            <div className="overview-footer">
              {isEditing ? (
                <button
                  type="button"
                  className="profile-primary-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  className="profile-ghost-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          {/* Later: add a "Recent Orders" section here */}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
