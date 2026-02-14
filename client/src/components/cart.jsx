import { useState, useEffect } from 'react';

function Cart({ setCartCount }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Cart fetch error:", err.message);
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, action) => {
    try {
      const response = await fetch("http://localhost:5000/cart/update-quantity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, action }),
        credentials: "include"
      });

      if (response.ok) {
        await getCart(); 
        setCartCount(prev => (action === 'add' ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      const response = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json();

      if (response.ok) {
        alert("Order placed! 🎉 ID: #" + data.orderId);
        setItems([]); 
        setCartCount(0); 
      } else {
        alert(data.msg || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  useEffect(() => { getCart(); }, []);

  const totalCost = items.reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0);

  // --- INLINE STYLES ---
  const containerStyle = { padding: '40px 5%', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" };
  const cardStyle = { display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'flex-start' };
  const itemsSectionStyle = { flex: '2', backgroundColor: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
  const summaryStyle = { flex: '1', backgroundColor: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'sticky', top: '100px' };
  const qtyBtnStyle = { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins' }}>Loading bag...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '30px' }}>Your Shopping Bag</h2>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '15px' }}>
          <p style={{ color: '#888' }}>Your bag is empty.</p>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px', padding: '10px 30px', borderRadius: '25px', border: 'none', backgroundColor: '#333', color: '#fff', cursor: 'pointer' }}>Shop Now</button>
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={itemsSectionStyle}>
            {items.map((item) => (
              /* Unique Key Fixed here */
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ flex: '2' }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button onClick={() => updateQuantity(item.id, 'remove')} style={qtyBtnStyle}>-</button>
                  <span style={{fontWeight: 'bold'}}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 'add')} style={qtyBtnStyle}>+</button>
                </div>
                <div style={{ flex: '1', textAlign: 'right', fontWeight: 'bold' }}>
                  ${parseFloat(item.total_price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={summaryStyle}>
            <h3 style={{ marginBottom: '20px' }}>Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Total Amount</span>
              <span style={{ fontSize: '20px', fontWeight: '800' }}>${totalCost.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} style={{ width: '100%', padding: '15px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;