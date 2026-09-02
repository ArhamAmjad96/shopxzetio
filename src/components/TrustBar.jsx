import React from 'react';

export default function TrustBar() {
  return (
    <section className="trust-bar-section">
      <div className="container">
        <div className="trust-ticker-strip">
          <div className="trust-item">
            <i className="fa-solid fa-shield-halved icon"></i>
            <span>7 Days Replacement Warranty</span>
          </div>
          <div className="trust-divider"></div>

          <div className="trust-item">
            <i className="fa-solid fa-truck-fast icon"></i>
            <span>Nationwide Fast Shipping</span>
          </div>
          <div className="trust-divider"></div>

          <div className="trust-item">
            <i className="fa-solid fa-money-bill-wave icon"></i>
            <span>Cash On Delivery Available</span>
          </div>
          <div className="trust-divider"></div>

          <div className="trust-item">
            <i className="fa-solid fa-trophy icon"></i>
            <span>5000+ Happy Gamers</span>
          </div>
          <div className="trust-divider"></div>

          <div className="trust-item">
            <i className="fa-solid fa-microchip icon"></i>
            <span>100% Genuine Gaming Gear</span>
          </div>
        </div>
      </div>
    </section>
  );
}
