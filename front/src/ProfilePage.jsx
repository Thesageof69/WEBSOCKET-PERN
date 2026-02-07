import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authed = localStorage.getItem("isAuthenticated") === "true";
    if (!authed) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
        setFirstname(res.data.first_name);
        setLastname(res.data.last_name);
        setEmail(res.data.email);
      } catch (err) {
       
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:4000/profile",
        { firstname, lastname, email },
        { withCredentials: true }
      );
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );
    } catch {
        alert("Logout failed");
    }
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <h2>Your Profile</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="First name"
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Last name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">Save changes</button>
      </form>

      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;
