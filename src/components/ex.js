import React, { useEffect, useState } from "react";

function App() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/profiles")
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile Data from Backend</h2>
      {profiles.length > 0 ? (
        profiles.map((profile) => (
          <div key={profile.id} style={{ marginBottom: "10px" }}>
            <strong>{profile.name}</strong> <br />
            📞 {profile.phone} <br />
            ✉️ {profile.email}
            <hr />
          </div>
        ))
      ) : (
        <p>Loading or no data found...</p>
      )}
    </div>
  );
}

export default App;
