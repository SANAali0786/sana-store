import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser, cartCount }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Logout karna chahti hain?")) {
      try {
        const response = await fetch("http://localhost:5000/auth/logout", { credentials: "include" });
        if (response.ok) {
          setUser(null);
          navigate("/login");
        }
      } catch (err) {
        console.error("Logout failed", err);
      }
    }
  };

  // --- PREMIUM INLINE STYLES ---
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 5%',
    height: '80px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Poppins', sans-serif" // Professional Font
  };

  const logoStyle = {
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '2px', // Letters ke beech space
    textTransform: 'uppercase' // Saare capital letters
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#4a4a4a',
    fontWeight: '500',
    fontSize: '14px',
    margin: '0 15px',
    transition: '0.3s',
    textTransform: 'capitalize' // Sirf pehla letter capital
  };

  const cartBadgeStyle = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '50%',
    marginLeft: '5px',
    verticalAlign: 'top'
  };

  return (
    <nav style={navStyle}>
      <div className="nav-logo">
        <Link to="/" style={logoStyle}>Sana Store</Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ 
                ...linkStyle, 
                color: '#ff4d4d', 
                border: '1.5px solid #ff4d4d', 
                padding: '6px 15px', 
                borderRadius: '5px',
                fontWeight: '600'
              }}>
                Admin Panel
              </Link>
            )}
            
            <Link to="/cart" style={linkStyle}>
              Cart <span style={cartBadgeStyle}>{cartCount}</span>
            </Link>
            
            <Link to="/orders" style={linkStyle}>Orders</Link>
            
            <div style={{ borderLeft: '1px solid #eee', marginLeft: '10px', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '600', fontSize: '13px', color: '#666' }}>
                Hi, {user.name}
              </span>
              <button 
                onClick={handleLogout} 
                style={{ 
                  backgroundColor: '#ff4d4d', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '8px 20px', 
                  borderRadius: '25px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '13px',
                  boxShadow: '0 4px 10px rgba(255, 77, 77, 0.2)'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ ...linkStyle, color: '#1a1a1a', fontWeight: '700' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;