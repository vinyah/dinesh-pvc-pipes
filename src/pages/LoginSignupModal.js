import React, { useState } from "react";
import "./LoginSignupModal.css";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const LoginSignupModal = ({ type = "login", onClose }) => {
  // which tab is active: "login" or "signup"
  const [activeTab, setActiveTab] = useState(
    type === "signup" ? "signup" : "login"
  );

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null); // success / error message

  /* ============ helpers for localStorage ============ */
  const loadUsers = () => {
    const saved = localStorage.getItem(USERS_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const saveCurrentUser = (user) => {
    // only store safe fields
    const safeUser = {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  };

  /* ===================== SIGN UP ===================== */
  const handleSignup = () => {
    if (!signupData.name || !signupData.email || !signupData.password) {
      setMessage({ type: "error", text: "❌ All fields are required." });
      return;
    }

    if (signupData.password !== signupData.confirm) {
      setMessage({ type: "error", text: "❌ Passwords do not match!" });
      return;
    }

    const users = loadUsers();

    const exists = users.find(
      (u) => u.email.toLowerCase() === signupData.email.toLowerCase()
    );
    if (exists) {
      setMessage({ type: "error", text: "⚠️ User already exists!" });
      return;
    }

    const newUser = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password, // stored simple for demo only
      phone: "",
      address: "",
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);

    setMessage({ type: "success", text: "✅ Signed up successfully!" });

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  /* ===================== LOGIN ===================== */
  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      setMessage({ type: "error", text: "❌ Enter email and password." });
      return;
    }

    const users = loadUsers();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === loginData.email.toLowerCase() &&
        u.password === loginData.password
    );

    if (user) {
      saveCurrentUser(user);
      setMessage({
        type: "success",
        text: `✅ Welcome ${user.name}!`,
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setMessage({ type: "error", text: "❌ Invalid email or password!" });
    }
  };

  return (
    <div className="lsm-overlay">
      {/* card is what you’ll make responsive with CSS (max-width, width: 90% etc.) */}
      <div
        className="lsm-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lsm-title"
      >
        {/* Close button */}
        <button className="lsm-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="lsm-content">
          {/* Avatar */}
          <div className="lsm-avatar">
            <span className="lsm-avatar-icon">👤</span>
          </div>

          {/* Title changes with tab (optional but nice) */}
          <h2 id="lsm-title" className="lsm-title">
            {activeTab === "login" ? "Welcome Back!" : "Create an Account"}
          </h2>

          {/* Tabs */}
          <div className="lsm-tabs">
            <button
              className={
                activeTab === "login" ? "lsm-tab lsm-tab-active" : "lsm-tab"
              }
              type="button"
              onClick={() => {
                setActiveTab("login");
                setMessage(null);
              }}
            >
              Login
            </button>
            <button
              className={
                activeTab === "signup" ? "lsm-tab lsm-tab-active" : "lsm-tab"
              }
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setMessage(null);
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`lsm-message ${
                message.type === "success" ? "lsm-success" : "lsm-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {activeTab === "login" && (
            <div className="lsm-form">
              <label className="lsm-label">Email</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>

              <label className="lsm-label">Password</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>

              <div className="lsm-row">
                <label className="lsm-remember">
                  <input type="checkbox" /> Remember me
                </label>
                <button
                  type="button"
                  className="lsm-link-btn"
                  onClick={() =>
                    setMessage({
                      type: "error",
                      text: "Password reset not implemented yet.",
                    })
                  }
                >
                  
                </button>
              </div>

              <button
                type="button"
                className="lsm-primary-btn"
                onClick={handleLogin}
              >
                Login
              </button>

              <p className="lsm-alt-text">Or login with OTP (coming soon)</p>
            </div>
          )}

          {/* ================= SIGNUP FORM ================= */}
          {activeTab === "signup" && (
            <div className="lsm-form">
              <label className="lsm-label">Full Name</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                />
              </div>

              <label className="lsm-label">Email</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                />
              </div>

              <label className="lsm-label">Password</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                />
              </div>

              <label className="lsm-label">Confirm Password</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={signupData.confirm}
                  onChange={(e) =>
                    setSignupData({ ...signupData, confirm: e.target.value })
                  }
                />
              </div>

              <button
                type="button"
                className="lsm-secondary-btn"
                onClick={handleSignup}
              >
                Create Account
              </button>

              <p className="lsm-terms">
                By signing up, you agree to our{" "}
                <span>Terms &amp; Privacy Policy</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;



