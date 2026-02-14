import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (response.ok) {
        alert("Registration Successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- REUSING STYLES FOR CONSISTENCY ---
  const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: "'Poppins', sans-serif" };
  const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' };
  const inputStyle = { width: '100%', padding: '12px 20px', margin: '10px 0', borderRadius: '25px', border: '1px solid #eee', backgroundColor: '#f9f9f9', outline: 'none', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', marginTop: '20px', borderRadius: '25px', border: 'none', backgroundColor: '#ff4d4d', color: '#fff', fontWeight: '700', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>CREATE ACCOUNT</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>Join the Sana Store family</p>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={btnStyle}>REGISTER</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#1a1a1a', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;