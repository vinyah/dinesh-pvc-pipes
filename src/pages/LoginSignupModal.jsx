import React, { useState } from "react";

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

  /* ================= UI ================= */
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
        role="dialog" 
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>

        <div className="p-8 pt-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {activeTab === "login" ? "Welcome Back!" : "Create an Account"}
          </h2>

          <div className="flex gap-2 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "login" 
                  ? "bg-[#b30000] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setActiveTab("login");
                setMessage(null);
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "signup" 
                  ? "bg-[#b30000] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
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
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === "success" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* LOGIN */}
          {activeTab === "login" && (
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">✉️</span>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">🔒</span>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button 
                className="w-full py-3 px-4 bg-white border-2 border-[#b30000] text-[#b30000] rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-all duration-300 mt-6"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          )}

          {/* SIGNUP */}
          {activeTab === "signup" && (
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">👤</span>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">✉️</span>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">🔒</span>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">🔒</span>
                  <input
                    type="password"
                    value={signupData.confirm}
                    onChange={(e) =>
                      setSignupData({ ...signupData, confirm: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button 
                className="w-full py-3 px-4 bg-white border-2 border-[#b30000] text-[#b30000] rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-all duration-300 mt-6"
                onClick={handleSignup}
              >
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

