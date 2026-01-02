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
    navigate("/");
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

  /* ================= NOT LOGGED IN ================= */
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

  /* ================= LOGGED IN ================= */
  return (
    <div className="profile-page-wrapper">
      {/* Mobile header */}
      <header className="profile-header-mobile">
        <div className="profile-header-user">
          <div className="profile-avatar-circle">
            <FaUser />
          </div>
          <div>
            <div className="profile-header-name">{user.name}</div>
            <div className="profile-header-email">{user.email}</div>
          </div>
        </div>
      </header>

      <h1 className="profile-page-title">My Account</h1>

      <div className="profile-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-header">
            <div className="profile-avatar-circle">
              <FaUser />
            </div>
            <div>
              <div className="profile-sidebar-name">{user.name}</div>
              <div className="profile-sidebar-email">{user.email}</div>
            </div>
          </div>

          <hr className="profile-divider" />

          <nav className="profile-menu">
            <button className="profile-menu-item" onClick={goHome}>
              <FaHome /> <span>Home</span>
            </button>

            <button className="profile-menu-item" onClick={goItems}>
              <FaBoxOpen /> <span>Items</span>
            </button>

            <button className="profile-menu-item" onClick={goCart}>
              <FaShoppingCart /> <span>Cart</span>
            </button>

            <button
              className="profile-menu-item logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="profile-main">
          <section className="profile-overview-card">
            <h2>Account Overview</h2>

            <div className="overview-grid">
              {["name", "email", "phone", "address"].map((field) => (
                <div key={field} className="overview-field">
                  <span className="overview-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>

                  {isEditing ? (
                    <input
                      className="overview-input"
                      value={formData[field]}
                      onChange={(e) =>
                        handleChange(field, e.target.value)
                      }
                    />
                  ) : (
                    <span className="overview-value">
                      {user[field] || "Not set"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="overview-footer">
              {isEditing ? (
                <button
                  className="profile-primary-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className="profile-ghost-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
