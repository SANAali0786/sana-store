import React, { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders", { credentials: "include" });
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Orders fetch failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- PREMIUM INLINE STYLES ---
  const containerStyle = {
    padding: '40px 5%',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: "'Poppins', sans-serif"
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '30px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const orderCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #f0f0f0'
  };

  const statusBadge = (status) => {
    const colors = {
      pending: '#f39c12',
      shipped: '#3498db',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return {
      backgroundColor: colors[status.toLowerCase()] || '#95a5a6',
      color: 'white',
      padding: '5px 15px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    };
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins' }}>Loading your orders...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>My Order History</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '15px' }}>
          <p style={{ color: '#888', fontSize: '18px' }}>No orders found.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={orderCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <div>
                <span style={{ color: '#888', fontSize: '12px' }}>ORDER ID</span>
                <h4 style={{ margin: 0, fontWeight: '700' }}>#{order.order_id}</h4>
              </div>
              <span style={statusBadge(order.status)}>{order.status}</span>
            </div>

            {/* ERROR FIX: Items ko sahi se loop karna */}
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Items Purchased:</p>
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>
                {Array.isArray(order.items) ? (
                  order.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                      <span style={{ color: '#333' }}>• {item.name} <small style={{color: '#888'}}>(x{item.qty || item.quantity})</small></span>
                      <span style={{ fontWeight: '600' }}>${(item.price * (item.qty || item.quantity)).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  /* Fallback agar items string ke roop mein aayein */
                  <span style={{ fontSize: '14px' }}>{String(order.items)}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px' }}>
              <div>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>TOTAL PAID</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#ff4d4d', margin: 0 }}>
                  ${parseFloat(order.total_amount).toFixed(2)}
                </p>
              </div>
              <p style={{ fontSize: '12px', color: '#aaa' }}>
                {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;