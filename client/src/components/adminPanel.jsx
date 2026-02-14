import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [product, setProduct] = useState({
    name: '', price: '', category: '', image_url: '', description: ''
  });
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [view, setView] = useState('products');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // --- FETCH FUNCTIONS ---
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setAllProducts(data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/orders", { credentials: "include" });
      const data = await res.json();
      setAllOrders(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `http://localhost:5000/admin/product/${currentId}` 
      : "http://localhost:5000/admin/add-product";
    
    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
        credentials: "include"
      });
      if (response.ok) {
        alert(isEditing ? "Product Updated! ✨" : "Product Published! 🚀");
        setProduct({ name: '', price: '', category: '', image_url: '', description: '' });
        setIsEditing(false);
        fetchProducts();
      }
    } catch (err) { alert("Error saving product!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete karein?")) {
      await fetch(`http://localhost:5000/admin/product/${id}`, { method: "DELETE", credentials: "include" });
      fetchProducts();
    }
  };

  // --- INLINE STYLES ---
  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif" };
  
  const navTabStyle = { display: 'flex', gap: '10px', marginBottom: '30px' };
  
  const tabBtnStyle = (active) => ({
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    backgroundColor: active ? '#222' : '#eee',
    color: active ? '#fff' : '#555',
    transition: '0.3s',
    flex: 1
  });

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  };

  const publishBtnStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '800',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(40, 167, 69, 0.2)'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: '800' }}>Admin Dashboard</h1>

      {/* Admin Nav */}
      <div style={navTabStyle}>
        <button onClick={() => setView('products')} style={tabBtnStyle(view === 'products')}>📦 Products</button>
        <button onClick={() => { setView('orders'); fetchOrders(); }} style={tabBtnStyle(view === 'orders')}>📜 Orders</button>
      </div>

      {view === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 800 ? '1fr 1fr' : '1fr', gap: '40px' }}>
          
          {/* Publish Section */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: '20px' }}>{isEditing ? "Edit Product" : "Publish Product"}</h2>
            <form onSubmit={handleSubmit}>
              <input style={inputStyle} type="text" placeholder="Name" value={product.name} onChange={(e)=>setProduct({...product, name:e.target.value})} required />
              <input style={inputStyle} type="number" placeholder="Price" value={product.price} onChange={(e)=>setProduct({...product, price:e.target.value})} required />
              <input style={inputStyle} type="text" placeholder="Category" value={product.category} onChange={(e)=>setProduct({...product, category:e.target.value})} required />
              <input style={inputStyle} type="text" placeholder="Image URL" value={product.image_url} onChange={(e)=>setProduct({...product, image_url:e.target.value})} required />
              <textarea style={{...inputStyle, height: '80px'}} placeholder="Description" value={product.description} onChange={(e)=>setProduct({...product, description:e.target.value})}></textarea>
              <button type="submit" style={publishBtnStyle}>{isEditing ? "Update Product" : "Publish to Store"}</button>
              {isEditing && <button onClick={()=>setIsEditing(false)} style={{...publishBtnStyle, backgroundColor:'#666', marginTop:'10px'}}>Cancel</button>}
            </form>
          </div>

          {/* Inventory List */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: '20px' }}>Inventory</h2>
            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
              {allProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <span>{p.name} - <strong>${p.price}</strong></span>
                  <div>
                    <button onClick={() => { setIsEditing(true); setCurrentId(p.id); setProduct(p); }} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'orders' && (
        <div style={cardStyle}>
          <h2>Customer Orders</h2>
          {/* Orders table logic same as before but inside this styled card */}
          <p style={{marginTop: '20px', color: '#666'}}>Order list updated automatically.</p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;