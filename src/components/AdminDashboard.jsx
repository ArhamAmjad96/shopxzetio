import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';

const ADMIN_STORAGE_KEY = 'shopxzetio_order_history';
const ADMIN_AUTH_KEY = 'shopxzetio_admin_session_v1';
const MASTER_PIN = 'xzetio2026';
const BACKUP_PIN = '923348';

export default function AdminDashboard() {
  const { setCurrentView } = useCart();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox
  const [activeSSOrder, setActiveSSOrder] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load orders
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (stored) {
          setOrders(JSON.parse(stored));
        } else {
          const seeds = [
            {
              orderRef: 'SXZ-84291',
              date: new Date(Date.now() - 3600000 * 2).toISOString(),
              customer: {
                fullName: 'Daniyal Tariq (i8 Scrims)',
                email: 'daniyal.pubg@gmail.com',
                whatsapp: '03008492019',
                address: 'House 42, Block C, Gulberg III',
                city: 'Lahore',
                notes: 'Please dispatch urgently before PMNC tournament block.'
              },
              paymentMethod: 'COD + Rs. 500 Advance',
              paymentCode: 'cod_advance',
              items: [
                { name: 'PIVA B2 Magnetic Semiconductor Mobile Cooler', price: 3850, quantity: 1 },
                { name: 'ShopXzetio Esports Carbon-Silver Finger Sleeves (Pack of 5 Pairs)', price: 2000, quantity: 1 }
              ],
              subtotal: 5850,
              shipping: 250,
              total: 6100,
              hasReceipt: true,
              receiptDataUrl: '/assets/brand/HERO.png',
              status: 'Receipt Submitted',
              trackingNumber: 'TCS-928174201',
              courier: 'TCS Pakistan'
            },
            {
              orderRef: 'SXZ-79102',
              date: new Date(Date.now() - 3600000 * 6).toISOString(),
              customer: {
                fullName: 'Farhan Zaidi',
                email: 'farhan.z@yahoo.com',
                whatsapp: '03219481102',
                address: 'Apartment 5B, Creek Vistas, Phase VIII, DHA',
                city: 'Karachi',
                notes: 'Call before delivery.'
              },
              paymentMethod: 'Cash on Delivery (COD)',
              paymentCode: 'cod',
              items: [
                { name: 'HyperX Cloud II Kingston Esports Headset', price: 12500, quantity: 1 }
              ],
              subtotal: 12500,
              shipping: 0,
              total: 12500,
              hasReceipt: false,
              receiptDataUrl: null,
              status: 'Confirmed (COD)',
              trackingNumber: '',
              courier: 'Leopards Courier'
            }
          ];
          setOrders(seeds);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(seeds));
        }
      } catch (e) {
        console.error('Error loading orders', e);
      }
    }
  }, [isAuthenticated]);

  const saveOrders = (updated) => {
    setOrders(updated);
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === MASTER_PIN || pinInput.trim() === BACKUP_PIN) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  };

  const updateOrderStatus = (orderRef, newStatus) => {
    const updated = orders.map(o => o.orderRef === orderRef ? { ...o, status: newStatus } : o);
    saveOrders(updated);
  };

  const updateOrderTracking = (orderRef, tracking) => {
    const updated = orders.map(o => o.orderRef === orderRef ? { ...o, trackingNumber: tracking } : o);
    saveOrders(updated);
  };

  const deleteOrder = (orderRef) => {
    if (window.confirm(`Delete order #${orderRef}?`)) {
      const updated = orders.filter(o => o.orderRef !== orderRef);
      saveOrders(updated);
    }
  };

  const chatWhatsApp = (order) => {
    let phone = order.customer.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '92' + phone.substring(1);

    let text = `Salam ${order.customer.fullName}!\n`;
    text += `This is ShopXzetio Pakistan regarding your order #${order.orderRef}.\n\n`;
    text += `Current Order Status: *${order.status}*\n`;
    if (order.trackingNumber) {
      text += `Tracking Number: *${order.trackingNumber}* (${order.courier || 'TCS'})\n`;
    }
    text += `Total Amount: Rs. ${order.total.toLocaleString()}\n\n`;
    text += `If you have any questions, feel free to reply directly to this message. Thank you for choosing ShopXzetio!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const addManualOrder = () => {
    const randomId = 'SXZ-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      orderRef: randomId,
      date: new Date().toISOString(),
      customer: {
        fullName: 'Test Pro Gamer',
        email: 'gamer@shopxzetio.pk',
        whatsapp: '03348590229',
        address: 'F-7/2, Islamabad',
        city: 'Islamabad',
        notes: 'Manual order created in admin dashboard.'
      },
      paymentMethod: 'COD + Rs. 500 Advance',
      paymentCode: 'cod_advance',
      items: [
        { name: 'PIVA B3 Extreme Semiconductor Cooler', price: 4350, quantity: 1 }
      ],
      subtotal: 4350,
      shipping: 250,
      total: 4600,
      hasReceipt: true,
      receiptDataUrl: '/assets/brand/HERO.png',
      status: 'Receipt Submitted',
      trackingNumber: '',
      courier: 'TCS Pakistan'
    };
    saveOrders([newOrder, ...orders]);
  };

  const exportCSV = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }
    let csv = 'Order Ref,Date,Customer Name,Phone,Email,City,Address,Total (PKR),Payment Method,Status,Has Receipt,Tracking Number\n';
    orders.forEach(o => {
      const cleanAddress = (o.customer.address || '').replace(/"/g, '""');
      csv += `"${o.orderRef}","${o.date}","${o.customer.fullName}","${o.customer.whatsapp}","${o.customer.email || ''}","${o.customer.city}","${cleanAddress}",${o.total},"${o.paymentMethod}","${o.status}","${o.hasReceipt ? 'YES' : 'NO'}","${o.trackingNumber || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SHOPXZETIO_ORDERS_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (activeFilter === 'receipts' && (!o.hasReceipt || o.status === 'Advance Verified')) return false;
      if (activeFilter === 'verified' && o.status !== 'Advance Verified') return false;
      if (activeFilter === 'cod' && o.paymentCode !== 'cod') return false;
      if (activeFilter === 'dispatched' && o.status !== 'Dispatched') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const refMatch = o.orderRef.toLowerCase().includes(q);
        const nameMatch = o.customer.fullName.toLowerCase().includes(q);
        const phoneMatch = o.customer.whatsapp.toLowerCase().includes(q);
        const cityMatch = o.customer.city.toLowerCase().includes(q);
        if (!refMatch && !nameMatch && !phoneMatch && !cityMatch) return false;
      }
      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  // If locked, render Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="lock-card">
          <div className="lock-avatar">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className="lock-title">OWNER COMMAND PORTAL</h2>
          <p className="lock-desc">Enter authorization PIN to access order management & payment screenshots.</p>

          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="lock-input" 
              placeholder="••••••••" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', height: '48px', justifyContent: 'center' }}>
              <i className="fa-solid fa-unlock-keyhole"></i> AUTHENTICATE
            </button>
            {authError && (
              <div className="lock-error" style={{ display: 'block' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Access Denied: Incorrect PIN
              </div>
            )}
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>
            Default Passcode: <strong style={{ color: 'var(--admin-cyan)' }}>xzetio2026</strong> or <strong style={{ color: 'var(--admin-cyan)' }}>923348</strong>
          </div>
          <div style={{ marginTop: '12px' }}>
            <button 
              onClick={() => setCurrentView('store')}
              style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', color: 'var(--admin-text-dim)', textDecoration: 'underline', cursor: 'pointer' }}
            >
              &larr; Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingReceipts = orders.filter(o => o.hasReceipt && o.status === 'Receipt Submitted').length;
  const dispatchedCount = orders.filter(o => o.status === 'Dispatched' || o.status === 'Delivered').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg)', color: 'var(--admin-text-soft)' }}>
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-nav">
          <div className="admin-brand">
            <img src="/assets/brand/LOGO.png" alt="ShopXzetio Logo" className="admin-logo" />
            <div className="admin-title-group">
              <span className="admin-title">SHOP<span>XZETIO</span> ADMIN</span>
              <span className="admin-badge-status">Command Center Active</span>
            </div>
          </div>

          <div className="admin-top-actions">
            <button 
              onClick={() => setCurrentView('store')} 
              className="admin-btn admin-btn-secondary" 
              title="Return to Storefront"
            >
              <i className="fa-solid fa-store"></i> Storefront
            </button>
            <button 
              onClick={exportCSV} 
              className="admin-btn admin-btn-secondary" 
              title="Export Orders as CSV"
            >
              <i className="fa-solid fa-file-excel"></i> Export CSV
            </button>
            <button 
              onClick={handleLogout} 
              className="admin-btn admin-btn-danger" 
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Lock
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-container">
        {/* Stats Grid */}
        <section className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">GROSS SALES VOLUME</span>
              <div className="stat-icon cyan"><i className="fa-solid fa-coins"></i></div>
            </div>
            <div className="stat-value">Rs. {totalRevenue.toLocaleString()}</div>
            <div className="stat-subtext">All submitted orders in pipeline</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">TOTAL ORDERS</span>
              <div className="stat-icon blue"><i className="fa-solid fa-box-archive"></i></div>
            </div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-subtext">Lifetime store bookings</div>
          </div>

          <div className="stat-card" style={{ borderColor: 'rgba(255, 184, 0, 0.4)' }}>
            <div className="stat-card-header">
              <span className="stat-title" style={{ color: 'var(--admin-amber)' }}>AWAITING SS REVIEW</span>
              <div className="stat-icon amber"><i className="fa-solid fa-image"></i></div>
            </div>
            <div className="stat-value" style={{ color: 'var(--admin-amber)' }}>{pendingReceipts}</div>
            <div className="stat-subtext">Advance payment receipts to confirm</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">DISPATCHED / DELIVERED</span>
              <div className="stat-icon green"><i className="fa-solid fa-truck-fast"></i></div>
            </div>
            <div className="stat-value" style={{ color: 'var(--admin-green)' }}>{dispatchedCount}</div>
            <div className="stat-subtext">Packages in transit across Pakistan</div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="admin-toolbar">
          <div className="toolbar-top">
            <div className="admin-search-wrapper">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                className="admin-search-input" 
                placeholder="Search by customer name, phone, order ref (#SXZ-...), city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={addManualOrder} className="admin-btn admin-btn-primary" type="button">
              <i className="fa-solid fa-plus"></i> + Add Test Order
            </button>
          </div>

          <div className="toolbar-status-pills">
            <button 
              className={`admin-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <i className="fa-solid fa-list-check"></i> All Orders
            </button>
            <button 
              className={`admin-pill alert ${activeFilter === 'receipts' ? 'active' : ''}`}
              onClick={() => setActiveFilter('receipts')}
            >
              <i className="fa-solid fa-receipt"></i> Screenshots To Verify
            </button>
            <button 
              className={`admin-pill ${activeFilter === 'verified' ? 'active' : ''}`}
              onClick={() => setActiveFilter('verified')}
            >
              <i className="fa-solid fa-circle-check"></i> Advance Verified
            </button>
            <button 
              className={`admin-pill ${activeFilter === 'cod' ? 'active' : ''}`}
              onClick={() => setActiveFilter('cod')}
            >
              <i className="fa-solid fa-money-bill-wave"></i> Cash On Delivery (COD)
            </button>
            <button 
              className={`admin-pill ${activeFilter === 'dispatched' ? 'active' : ''}`}
              onClick={() => setActiveFilter('dispatched')}
            >
              <i className="fa-solid fa-truck-ramp-box"></i> Dispatched
            </button>
          </div>
        </section>

        {/* Orders Table */}
        <section className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer Information</th>
                <th>Ordered Items</th>
                <th>Total Amount</th>
                <th>Payment Screenshot (SS)</th>
                <th>Order Status & Courier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const dateStr = new Date(order.date).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <tr key={order.orderRef}>
                      {/* 1. Order ID & Date */}
                      <td>
                        <span className="order-ref-cell">#{order.orderRef}</span>
                        <span className="order-date-sub">{dateStr}</span>
                        <span style={{ display: 'inline-block', fontSize: '0.7rem', color: 'var(--admin-cyan)', marginTop: '4px' }}>
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* 2. Customer */}
                      <td>
                        <div className="customer-name">{order.customer.fullName}</div>
                        <a 
                          href={`https://wa.me/92${order.customer.whatsapp.replace(/\D/g, '').replace(/^0+/, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="customer-phone-link"
                        >
                          <i className="fa-brands fa-whatsapp"></i> {order.customer.whatsapp}
                        </a>
                        <div className="customer-address-sub" title={`${order.customer.address}, ${order.customer.city}`}>
                          <i className="fa-solid fa-location-dot"></i> {order.customer.city}: {order.customer.address}
                        </div>
                      </td>

                      {/* 3. Items */}
                      <td style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--admin-text-soft)' }}>
                        {order.items.map((it, idx) => (
                          <div key={idx}>{it.quantity}x {it.name}</div>
                        ))}
                      </td>

                      {/* 4. Financials */}
                      <td>
                        <div style={{ fontFamily: 'var(--admin-font-digital)', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                          Rs. {order.total.toLocaleString()}
                        </div>
                        {order.paymentCode === 'cod_advance' && (
                          <>
                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-green)' }}>Advance: Rs. 500</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-cyan)' }}>COD Bal: Rs. {(order.total - 500).toLocaleString()}</div>
                          </>
                        )}
                      </td>

                      {/* 5. Screenshot (SS) */}
                      <td>
                        {order.receiptDataUrl ? (
                          <button 
                            className="ss-badge-btn" 
                            onClick={() => { setActiveSSOrder(order); setZoomLevel(1); }}
                          >
                            <img src={order.receiptDataUrl} className="ss-thumb-img" alt="SS" />
                            <span>View SS</span>
                          </button>
                        ) : (
                          <span className="no-ss-badge">No SS (COD)</span>
                        )}
                      </td>

                      {/* 6. Status & Courier */}
                      <td>
                        <select 
                          className="status-select" 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderRef, e.target.value)}
                        >
                          <option value="Receipt Submitted">Receipt Submitted</option>
                          <option value="Advance Verified">Advance Verified</option>
                          <option value="Confirmed (COD)">Confirmed (COD)</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div style={{ marginTop: '6px' }}>
                          <input 
                            type="text" 
                            defaultValue={order.trackingNumber || ''} 
                            placeholder="Tracking #" 
                            onBlur={(e) => updateOrderTracking(order.orderRef, e.target.value)}
                            style={{ width: '110px', height: '26px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--admin-border)', borderRadius: '3px', color: '#fff', padding: '0 6px' }}
                          />
                        </div>
                      </td>

                      {/* 7. Actions */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button 
                          className="admin-btn admin-btn-secondary" 
                          style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem' }} 
                          onClick={() => chatWhatsApp(order)} 
                          title="Message Customer on WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp" style={{ color: 'var(--admin-green)' }}></i> Chat
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger" 
                          style={{ height: '32px', width: '32px', padding: 0, justifyContent: 'center', marginLeft: '6px' }} 
                          onClick={() => deleteOrder(order.orderRef)} 
                          title="Delete Order"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--admin-text-dim)' }}>
                    <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', color: 'var(--admin-border)', marginBottom: '12px', display: 'block' }}></i>
                    <h4 style={{ color: '#fff', marginBottom: '6px' }}>NO ORDERS FOUND</h4>
                    <p style={{ fontSize: '0.85rem' }}>No customer orders match the selected filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Screenshot Lightbox Modal */}
      {activeSSOrder && (
        <div className="ss-lightbox-backdrop active" onClick={(e) => { if (e.target.classList.contains('ss-lightbox-backdrop')) setActiveSSOrder(null); }}>
          <div className="ss-lightbox-modal">
            <div className="ss-lightbox-header">
              <h3 className="ss-lightbox-title">
                PAYMENT SCREENSHOT #{activeSSOrder.orderRef}
              </h3>
              <button 
                onClick={() => setActiveSSOrder(null)} 
                style={{ background: 'transparent', color: 'var(--admin-text-dim)', fontSize: '1.4rem', cursor: 'pointer', border: 'none' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="ss-lightbox-image-area">
              <img 
                src={activeSSOrder.receiptDataUrl} 
                alt="Payment Slip Full" 
                className="ss-full-img"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            <div className="ss-lightbox-footer">
              <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <div><strong>Customer:</strong> {activeSSOrder.customer.fullName} ({activeSSOrder.customer.whatsapp})</div>
                <div><strong>Total:</strong> Rs. {activeSSOrder.total.toLocaleString()} | <strong>Mode:</strong> {activeSSOrder.paymentMethod}</div>
                <div style={{ marginTop: '4px' }}><strong>Status:</strong> <span style={{ color: 'var(--admin-cyan)' }}>{activeSSOrder.status}</span></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginRight: '12px', background: 'rgba(0,0,0,0.4)', padding: '4px 6px', borderRadius: '4px' }}>
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    style={{ height: '30px', width: '30px', padding: 0, justifyContent: 'center' }} 
                    onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    style={{ height: '30px', padding: '0 8px', fontSize: '0.75rem' }} 
                    onClick={() => setZoomLevel(1)}
                  >
                    100%
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    style={{ height: '30px', width: '30px', padding: 0, justifyContent: 'center' }} 
                    onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>

                <button 
                  className="admin-btn admin-btn-primary" 
                  style={{ background: 'var(--admin-green)', color: '#02070D' }}
                  onClick={() => {
                    updateOrderStatus(activeSSOrder.orderRef, 'Advance Verified');
                    setActiveSSOrder(null);
                  }}
                >
                  <i className="fa-solid fa-check-double"></i> Mark Advance Verified
                </button>

                <button 
                  className="admin-btn admin-btn-secondary" 
                  style={{ color: 'var(--admin-green)', borderColor: 'rgba(37, 211, 102, 0.4)' }}
                  onClick={() => chatWhatsApp(activeSSOrder)}
                >
                  <i className="fa-brands fa-whatsapp"></i> Chat WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
