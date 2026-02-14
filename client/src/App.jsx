import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/navBar'; // Aapka naya wala Navbar
import ProductList from './components/productList';
import Login from './components/login';
import Register from './components/register';
import Cart from './components/cart'
import Orders from './components/orders';
import AdminPanel from './components/adminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/user", { credentials: "include" });
      const data = await response.json();
      if (data.loggedIn) setUser(data.user);
    } catch (err) { console.error(err.message); }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/cart/count", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.count || 0);
        }
      } catch (err) { console.log("Cart fetch failed"); }
    }
    checkLoginStatus();
    fetchCartCount();
  }, []);

  return (
    <Router>
      {/* 1. Ab hum sirf aapka banaya hua Navbar use karenge */}
      <Navbar user={user} setUser={setUser} cartCount={cartCount} />

      {/* 2. Search aur Sort ko ek saaf container mein dala hai */}
      <div style={{ 
        padding: '20px 5%', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee' 
      }}>
        <select 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', cursor: 'pointer' }}
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>

        <input 
          type="text" 
          placeholder="Search cozy styles..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', backgroundColor: '#f9f9f9' }}
        />
      </div>

      <div style={{ padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<ProductList searchTerm={searchTerm} sortBy={sortBy} setCartCount={setCartCount} setSearchTerm={setSearchTerm} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;