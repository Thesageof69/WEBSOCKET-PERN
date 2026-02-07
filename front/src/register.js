import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/register", {
      firstname,
      lastname,
      email,
      password,
    });
    alert("Registration successful!");
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login now</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
