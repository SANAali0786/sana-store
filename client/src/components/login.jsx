import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" // Yeh session ke liye zaroori hai
      });
      
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        alert("Login Successful! Welcome " + data.user.name);
        navigate("/");
      } else {
        alert("Login Failed: " + (data.msg || "Invalid Credentials"));
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Backend server se connection nahi ho paa raha. Please check if server is running on port 5000.");
    }
  };

  const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: "'Poppins', sans-serif" };
  const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' };
  const inputStyle = { width: '100%', padding: '12px 20px', margin: '10px 0', borderRadius: '25px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', marginTop: '20px', borderRadius: '25px', border: 'none', backgroundColor: '#1a1a1a', color: '#fff', fontWeight: '700', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>WELCOME BACK</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={btnStyle}>LOG IN</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '13px' }}>New here? <Link to="/register" style={{ color: '#ff4d4d', textDecoration: 'none' }}>Register</Link></p>
      </div>
    </div>
  );
}

export default Login;