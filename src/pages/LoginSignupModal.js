import React, { useState } from "react";
import "./LoginSignupModal.css";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const LoginSignupModal = ({
  type = "login",
  onClose,
  onAuthSuccess, // 🔥 ONLY ADDITION
}) => {
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

  const [message, setMessage] = useState(null);

  /* ================= helpers ================= */
  const loadUsers = () => {
    const saved = localStorage.getItem(USERS_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const saveCurrentUser = (user) => {
    const safeUser = {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  };

  /* ================= SIGN UP ================= */
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
      password: signupData.password,
      phone: "",
      address: "",
    };

    saveUsers([...users, newUser]);
    const safeUser = saveCurrentUser(newUser);

    // 🔥 INSTANT UPDATE
    onAuthSuccess?.(safeUser);

    setMessage({ type: "success", text: "✅ Signed up successfully!" });
    setTimeout(onClose, 1000);
  };

  /* ================= LOGIN ================= */
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

    if (!user) {
      setMessage({ type: "error", text: "❌ Invalid email or password!" });
      return;
    }

    const safeUser = saveCurrentUser(user);

    // 🔥 INSTANT UPDATE
    onAuthSuccess?.(safeUser);

    setMessage({ type: "success", text: `✅ Welcome ${user.name}!` });
    setTimeout(onClose, 1000);
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="lsm-overlay">
      <div className="lsm-card" role="dialog" aria-modal="true">
        <button className="lsm-close" onClick={onClose}>×</button>

        <div className="lsm-content">
          <div className="lsm-avatar">
            <span className="lsm-avatar-icon">👤</span>
          </div>

          <h2 className="lsm-title">
            {activeTab === "login" ? "Welcome Back!" : "Create an Account"}
          </h2>

          <div className="lsm-tabs">
            <button
              className={activeTab === "login" ? "lsm-tab lsm-tab-active" : "lsm-tab"}
              onClick={() => {
                setActiveTab("login");
                setMessage(null);
              }}
            >
              Login
            </button>
            <button
              className={activeTab === "signup" ? "lsm-tab lsm-tab-active" : "lsm-tab"}
              onClick={() => {
                setActiveTab("signup");
                setMessage(null);
              }}
            >
              Sign Up
            </button>
          </div>

          {message && (
            <div
              className={`lsm-message ${
                message.type === "success" ? "lsm-success" : "lsm-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* LOGIN */}
          {activeTab === "login" && (
            <div className="lsm-form">
              <label className="lsm-label">Email</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">✉️</span>
                <input
                  type="email"
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
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>

              <button className="lsm-primary-btn" onClick={handleLogin}>
                Login
              </button>
            </div>
          )}

          {/* SIGNUP */}
          {activeTab === "signup" && (
            <div className="lsm-form">
              <label className="lsm-label">Full Name</label>
              <div className="lsm-input-wrapper">
                <span className="lsm-input-icon">👤</span>
                <input
                  type="text"
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
                  value={signupData.confirm}
                  onChange={(e) =>
                    setSignupData({ ...signupData, confirm: e.target.value })
                  }
                />
              </div>

              <button className="lsm-secondary-btn" onClick={handleSignup}>
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;
