import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link

function Signup() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    full_name: "",
    phone_number: "",
    bio: "",
    location: "",
    interests: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", userData);
      alert("Account created successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <div>
          <label>Full Name:</label>
          <input type="text" name="full_name" onChange={handleChange} />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" name="phone_number" onChange={handleChange} />
        </div>
        <div>
          <label>Bio:</label>
          <textarea name="bio" onChange={handleChange} />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" onChange={handleChange} />
        </div>
        <div>
          <label>Interests:</label>
          <input type="text" name="interests" placeholder="e.g., Tech, Music, Sports" onChange={handleChange} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link> {/* Fixed here */}
      </p>
    </div>
  );
}

export default Signup;
