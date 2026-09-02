import React from 'react';
import { useCart } from '../context/CartContext';

export default function Footer() {
  const { currentView, setCurrentView } = useCart();

  const handleNav = (viewName) => {
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col footer-col-brand">
            <div className="brand-wrapper" style={{ marginBottom: '16px' }}>
              <img src="/assets/brand/LOGO.png" alt="ShopXzetio Logo" style={{ height: '42px' }} />
              <div className="brand-meta">
                <span className="brand-name">SHOP<span>XZETIO</span></span>
                <span className="brand-badge">Official Esports Gear</span>
              </div>
            </div>
            <p className="footer-about-text">
              ShopXzetio is Pakistan's dedicated esports gaming accessories provider. Official accessories partner for PUBG Mobile tournaments, equipping high-tier competitors with calibrated cooling, low-latency audio, and tournament-grade peripherals.
            </p>
            <div className="footer-social-row">
              <a 
                href="https://www.instagram.com/shopxzetio_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-item item-instagram" 
                title="Follow on Instagram"
              >
                <div className="social-icon-circle">
                  <i className="fa-brands fa-instagram"></i>
                </div>
                <div className="social-pill-meta">
                  <span className="social-pill-platform">Instagram</span>
                  <span className="social-pill-username">@shopxzetio_</span>
                </div>
              </a>

              <a 
                href="https://wa.me/923348590229?text=Hello%20ShopXzetio!" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-item item-whatsapp" 
                title="Direct WhatsApp Helpline"
              >
                <div className="social-icon-circle">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div className="social-pill-meta">
                  <span className="social-pill-platform">WhatsApp</span>
                  <span className="social-pill-username">0334-8590229</span>
                </div>
              </a>
            </div>
          </div>

          {/* Command Links */}
          <div className="footer-col">
            <h4 className="footer-title">COMMAND LINKS</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => handleNav('home')}>Home Base</button></li>
              <li><button onClick={() => handleNav('arsenal')}>Full 22-Piece Arsenal</button></li>
              <li><button onClick={() => handleNav('coolers')}>Mobile Coolers</button></li>
              <li><button onClick={() => handleNav('audio')}>Gaming Audio</button></li>
              <li><button onClick={() => handleNav('splitters')}>DAC Splitters</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-title">GEAR CATEGORIES</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => handleNav('audio')}>Gaming Headsets & Earbuds</button></li>
              <li><button onClick={() => handleNav('coolers')}>Magnetic Phone Coolers</button></li>
              <li><button onClick={() => handleNav('splitters')}>60W Fast Charge DAC Splitters</button></li>
              <li><button onClick={() => handleNav('accessories')}>Esports Finger Sleeves</button></li>
              <li><button onClick={() => handleNav('accessories')}>High-Speed Table Fans</button></li>
            </ul>
          </div>

          {/* Logistics & Support */}
          <div className="footer-col">
            <h4 className="footer-title">LOGISTICS & SUPPORT</h4>
            <div className="footer-contact-item">
              <i className="fa-brands fa-whatsapp contact-icon"></i>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Direct WhatsApp Helpline:</div>
                <a href="https://wa.me/923348590229" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', fontWeight: 700, fontFamily: 'var(--font-digital)', fontSize: '1rem' }}>
                  +92 334 8590229
                </a>
              </div>
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-truck-ramp-box contact-icon"></i>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Courier Delivery:</div>
                <div style={{ color: '#fff', fontSize: '0.85rem' }}>TCS, Leopards, Trax (Cash On Delivery)</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-clock-rotate-left contact-icon"></i>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Dispatch Timings:</div>
                <div style={{ color: '#fff', fontSize: '0.85rem' }}>Mon - Sat: 11:00 AM - 10:00 PM PKT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            &copy; 2026 ShopXzetio Pakistan. All rights reserved. Built for competitive gamers.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>7 Days Warranty Policy</span>
            <span>Nationwide Courier Dispatch</span>
            <span>TCS / Leopards / Trax Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
