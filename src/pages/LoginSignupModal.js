import React, { useState } from "react";
import "./LoginSignupModal.css";

const LoginSignupModal = ({ type, onClose }) => {
  const [userType, setUserType] = useState("user");
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
  const [message, setMessage] = useState(null); // ✅ To display messages

  // === SIGNUP ===
  const handleSignup = async () => {
    if (signupData.password !== signupData.confirm) {
      setMessage({ type: "error", text: "❌ Passwords do not match!" });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();

      const exists = users.find((u) => u.email === signupData.email);
      if (exists) {
        setMessage({ type: "error", text: "⚠️ User already exists!" });
        return;
      }

      const newUser = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      };

      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      setMessage({
  type: "success",
  text: "✅ Signup successful!",
});

// ✅ Close modal after success
setTimeout(() => {
  onClose();
}, 1200);

    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "❌ Unable to connect to server!" });
    }
  };

  // === LOGIN ===
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();

      const user = users.find(
        (u) =>
          u.email === loginData.email && u.password === loginData.password
      );

     if (user) {
  setMessage({
    type: "success",
    text: `✅ Welcome ${user.name}!`,
  });

  // ✅ Close the popup after 1.2 seconds
  setTimeout(() => {
    onClose();
  }, 1200);

} else {
  setMessage({ type: "error", text: "❌ Invalid email or password!" });
}

    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "❌ Unable to connect to server!" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <span className="close-btn" onClick={onClose}>
          ✖
        </span>

        {/* ✅ Message display inside modal */}
        {message && (
          <div
            className={`popup-message ${
              message.type === "success" ? "success" : "error"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* === LOGIN MODAL === */}
        {type === "login" && (
          <div className="modal-content">
            <div className="tabs">
              <button
                className={userType === "user" ? "active" : ""}
                onClick={() => setUserType("user")}
              >
                User
              </button>
              <button
                className={userType === "admin" ? "active" : ""}
                onClick={() => setUserType("admin")}
              >
                Admin
              </button>
            </div>

            <h2>{userType === "user" ? "User Login" : "Admin Login"}</h2>
            <input
              type="email"
              placeholder="Your registered email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button type="button" onClick={handleLogin}>Login</button>

          </div>
        )}

        {/* === SIGNUP MODAL === */}
        {type === "signup" && (
          <div className="modal-content">
            <h2>Create Account</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email Address"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Create Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupData.confirm}
              onChange={(e) =>
                setSignupData({ ...signupData, confirm: e.target.value })
              }
            />
            <button type="button" onClick={handleSignup}>Sign Up</button>

          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignupModal;






