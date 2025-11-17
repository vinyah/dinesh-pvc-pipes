import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import "./ProfilePage.css";


const ProfilePage = () => {
  const [name, setName] = useState("Rehman");
  const [phone, setPhone] = useState("**********");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState({ name: false, phone: false, email: false });
  const [showPhone, setShowPhone] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [oldProfiles, setOldProfiles] = useState([]);

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "phone") setPhone(value);
    if (field === "email") setEmail(value);
  };

  const handleLogout = () => {
    setOldProfiles((prev) => [...prev, { name, phone, email }]);
    setName("");
    setPhone("");
    setEmail("");
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="profile-container">
      {isLoggedIn ? (
        <div className="profile-card">
          <h2 className="profile-title">
            <FaUser className="profile-icon" /> Profile
          </h2>

          <div className="profile-item">
            <span className="label">Name</span>
            {isEditing.name ? (
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="edit-input"
              />
            ) : (
              <span className="value">{name}</span>
            )}
            <button className="edit-btn" onClick={() => handleEdit("name")}>
              {isEditing.name ? "Save" : "Edit"}
            </button>
          </div>

          <div className="profile-item">
            <span className="label">Phone no</span>
            {isEditing.phone ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="edit-input"
              />
            ) : (
              <span className="value">
                {showPhone ? phone : "**********"}
              </span>
            )}
            <button className="icon-btn" onClick={() => setShowPhone(!showPhone)}>
              {showPhone ? <FaEyeSlash /> : <FaEye />}
            </button>
            <button className="edit-btn" onClick={() => handleEdit("phone")}>
              {isEditing.phone ? "Save" : "Edit"}
            </button>
          </div>

          <div className="profile-item">
            <span className="label">Email</span>
            {isEditing.email ? (
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="edit-input"
              />
            ) : (
              <span className="value">{email || "Not Provided"}</span>
            )}
            <button className="edit-btn" onClick={() => handleEdit("email")}>
              {isEditing.email ? "Save" : "Edit"}
            </button>
          </div>

          <div className="profile-actions">
            <button className="orders-btn" onClick={() => alert(JSON.stringify(oldProfiles, null, 2))}>
              Orders History
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <div className="logged-out">
          <h2>You are logged out</h2>
          <button className="login-btn" onClick={handleLogin}>Log In</button>

          {oldProfiles.length > 0 && (
            <div className="old-profiles">
              <h3>Old Profiles:</h3>
              <ul>
                {oldProfiles.map((p, index) => (
                  <li key={index}>
                    {p.name} – {p.email || "No email"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
