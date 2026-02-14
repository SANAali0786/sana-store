import { useState, useEffect } from 'react';

function ProductList({ searchTerm, setSearchTerm, sortBy, setCartCount }) {
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        setNotification("Item added to cart! 🛍️");
        setCartCount(prevCount => prevCount + 1);
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    return 0;
  });

  useEffect(() => {
    getProducts();
  }, []);

  // --- Inline Styles ---
  const containerStyle = { padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' };
  
  const categoryBtnStyle = (cat) => ({
    padding: '10px 25px',
    borderRadius: '25px',
    border: '1px solid #333',
    backgroundColor: activeCategory === cat ? '#333' : '#fff',
    color: activeCategory === cat ? '#fff' : '#333',
    cursor: 'pointer',
    fontSize: '14px',
    transition: '0.3s',
    marginRight: '10px'
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '15px',
    border: '1px solid #eee',
    overflow: 'hidden',
    textAlign: 'center',
    paddingBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: '0.3s'
  };

  const btnStyle = {
    marginTop: '15px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  };

  const notificationStyle = {
    position: 'fixed',
    top: '90px',
    right: '20px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '12px 25px',
    borderRadius: '8px',
    zIndex: 1000,
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>Product Catalog</h1>
      
      {/* Category Selection */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {["All", "Hoodies", "T-Shirts", "Accessories"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={categoryBtnStyle(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {notification && <div style={notificationStyle}>{notification}</div>}

      {/* Product Grid */}
      <div style={gridStyle}>
        {sortedProducts.map(product => (
          <div key={product.id} style={cardStyle}>
            <img 
              src={product.image_url || 'https://via.placeholder.com/150'} 
              alt={product.name} 
              style={{ width: '100%', height: '280px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '15px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{product.name}</h3>
              <p style={{ color: '#ff4d4d', fontWeight: '700', fontSize: '1.1rem' }}>${product.price}</p>
              <button onClick={() => addToCart(product.id)} style={btnStyle}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#888' }}>No products found matching "<strong>{searchTerm}</strong>"</h2>
          <button onClick={() => setSearchTerm("")} style={{ ...btnStyle, marginTop: '20px' }}>
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;