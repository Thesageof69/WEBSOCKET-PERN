import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/login",
        { email, password },
        { withCredentials: true }
      );

      
      localStorage.setItem("isAuthenticated", "true");

      
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don&apos;t have an account?{" "}
        <Link to="/register">Register now</Link>
        
      </p>
    </div>
  );
}

export default LoginPage;

