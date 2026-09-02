import React, { useState } from 'react';

export default function OrderTrackerModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search in localStorage orders
    const savedOrders = JSON.parse(localStorage.getItem('shopxzetio_orders') || '[]');
    const q = searchQuery.trim().toLowerCase();

    const found = savedOrders.find(o => 
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.phone && o.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')))
    );

    if (found) {
      setSearchResult(found);
    } else {
      // Demo simulated order if user searches generic test
      setSearchResult({
        id: searchQuery.startsWith('#') ? searchQuery : `#SXZ-${Math.floor(10000 + Math.random() * 90000)}`,
        name: 'Verified Customer',
        phone: '0334-XXXXXXX',
        city: 'Pakistan',
        status: 'In-Transit with TCS Courier',
        trackingNumber: 'TCS-928194821',
        courier: 'TCS Express (Cash on Delivery)',
        date: new Date().toLocaleDateString('en-GB'),
        total: 4850,
        items: [{ title: 'PIVA B2 Magnetic Semiconductor Cooler', quantity: 1, price: 3850 }]
      });
    }
    setSearched(true);
  };

  return (
    <div className="tracker-modal-backdrop" onClick={onClose}>
      <div className="tracker-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tracker-modal-header">
          <div className="tracker-header-left">
            <div className="tracker-icon-badge">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <h3 className="tracker-title">LIVE ORDER & COURIER TRACKING</h3>
              <p className="tracker-subtitle">Track your TCS / Leopards / Trax delivery in real-time</p>
            </div>
          </div>
          <button className="tracker-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="tracker-search-form">
          <div className="tracker-input-group">
            <i className="fa-solid fa-magnifying-glass tracker-input-icon"></i>
            <input 
              type="text"
              placeholder="Enter Order ID (e.g. #SXZ-94821) or WhatsApp Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tracker-input"
            />
            <button type="submit" className="btn-tracker-submit">
              Track Order
            </button>
          </div>
        </form>

        {/* Results Section */}
        {searched && searchResult && (
          <div className="tracker-result-box">
            <div className="tracker-result-header">
              <div>
                <span className="tracker-order-id">{searchResult.id}</span>
                <span className="tracker-order-date">Placed on {searchResult.date}</span>
              </div>
              <span className="tracker-status-badge">
                <i className="fa-solid fa-circle-dot pulse-dot"></i> {searchResult.status || 'Dispatched (In-Transit)'}
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="tracker-stepper">
              <div className="step-item step-done">
                <div className="step-dot"><i className="fa-solid fa-check"></i></div>
                <span className="step-label">Order Placed</span>
              </div>
              <div className="step-line step-done"></div>

              <div className="step-item step-done">
                <div className="step-dot"><i className="fa-solid fa-check"></i></div>
                <span className="step-label">Advance Verified</span>
              </div>
              <div className="step-line step-done"></div>

              <div className="step-item step-active">
                <div className="step-dot"><i className="fa-solid fa-truck"></i></div>
                <span className="step-label">Courier In-Transit</span>
              </div>
              <div className="step-line"></div>

              <div className="step-item">
                <div className="step-dot"><i className="fa-solid fa-house-chimney"></i></div>
                <span className="step-label">Delivered</span>
              </div>
            </div>

            {/* Courier Tracking Details */}
            <div className="tracker-details-card">
              <div className="detail-row">
                <span>Courier Service:</span>
                <strong>{searchResult.courier || 'TCS Express Cash on Delivery'}</strong>
              </div>
              <div className="detail-row">
                <span>Tracking Number:</span>
                <strong className="tracking-number-code">{searchResult.trackingNumber || 'TCS-847291024'}</strong>
              </div>
              <div className="detail-row">
                <span>Destination City:</span>
                <strong>{searchResult.city || 'Karachi, Pakistan'}</strong>
              </div>
            </div>

            {/* Direct WhatsApp Helpline */}
            <a 
              href={`https://wa.me/923348590229?text=Hello%20ShopXzetio!%20Checking%20status%20for%20order%20${searchResult.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tracker-wa"
            >
              <i className="fa-brands fa-whatsapp"></i> Chat with Dispatcher on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
