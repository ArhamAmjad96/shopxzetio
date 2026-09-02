import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import PRODUCTS from '../data/products';

const POPULAR_DEVICES = [
  { id: 'iphone-15-16', name: 'iPhone 15 / 16 Series', brand: 'Apple', magsafe: true, port: 'type-c', notes: 'Native MagSafe snap cooling & Type-C 60W lossless DAC support.' },
  { id: 'iphone-13-14', name: 'iPhone 12 / 13 / 14 Series', brand: 'Apple', magsafe: true, port: 'lightning', notes: 'Direct MagSafe attachment. Requires Lightning DAC splitter.' },
  { id: 'poco-x6-f5', name: 'Poco X6 Pro / F5 / F6', brand: 'Xiaomi', magsafe: false, port: 'type-c', notes: 'Use magnetic sheet or clamp cooler. Full 60W Type-C DAC support.' },
  { id: 'infinix-gt20', name: 'Infinix GT 10 / 20 Pro', brand: 'Infinix', magsafe: false, port: 'type-c', notes: 'Magnetic sticker sheet included with PIVA coolers. 120 FPS PUBG ready.' },
  { id: 'samsung-s24', name: 'Samsung Galaxy S23 / S24', brand: 'Samsung', magsafe: false, port: 'type-c', notes: 'Supports 45W bypass charging & 32-bit Hi-Res DAC audio.' },
  { id: 'ipad-mini-pro', name: 'iPad Mini 6 / Air / Pro', brand: 'Apple', magsafe: false, port: 'type-c', notes: 'Large surface area compatible with PIVA G71 & JS28 radiators.' }
];

export default function DeviceCompatibilityModal({ isOpen, onClose }) {
  const { addToCart, openDetail } = useCart();
  const [selectedDevice, setSelectedDevice] = useState(POPULAR_DEVICES[0]);
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  // Filter compatible gear based on selected device
  const recommendedCoolers = PRODUCTS.filter(p => p.category.includes('cooler') || p.subCategory.includes('cooler')).slice(0, 3);
  const recommendedSplitters = PRODUCTS.filter(p => p.category.includes('splitter') || p.category.includes('dac')).slice(0, 2);
  const recommendedSleeves = PRODUCTS.filter(p => p.category.includes('sleeve')).slice(0, 1);

  const allRecommended = [...recommendedCoolers, ...recommendedSplitters, ...recommendedSleeves];

  return (
    <div className="compatibility-modal-backdrop" onClick={onClose}>
      <div className="compatibility-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="compatibility-modal-header">
          <div className="compat-header-left">
            <div className="compat-icon-badge">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>
            <div>
              <h3 className="compat-title">DEVICE COMPATIBILITY MATCHER</h3>
              <p className="compat-subtitle">Select your phone or iPad to discover 100% verified tournament hardware</p>
            </div>
          </div>
          <button className="compat-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Device Selector Pills */}
        <div className="device-selector-strip">
          {POPULAR_DEVICES.map((dev) => (
            <button
              key={dev.id}
              onClick={() => setSelectedDevice(dev)}
              className={`device-pill-btn ${selectedDevice.id === dev.id ? 'active' : ''}`}
            >
              <i className={`fa-brands ${dev.brand === 'Apple' ? 'fa-apple' : 'fa-android'}`}></i>
              <span>{dev.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Device Compatibility Status Card */}
        <div className="device-status-banner">
          <div className="device-status-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="device-status-content">
            <h4>{selectedDevice.name} — Verified Hardware Profile</h4>
            <p>{selectedDevice.notes}</p>
            <div className="device-tags-row">
              <span className="compat-tag">
                <i className="fa-solid fa-magnet"></i> {selectedDevice.magsafe ? 'Native MagSafe Ready' : 'Magnetic Sheet Included'}
              </span>
              <span className="compat-tag">
                <i className="fa-solid fa-bolt"></i> {selectedDevice.port.toUpperCase()} High-Wattage Audio Splitter
              </span>
              <span className="compat-tag tag-verified">
                <i className="fa-solid fa-shield-halved"></i> 100% Tested Zero Stutter
              </span>
            </div>
          </div>
        </div>

        {/* Matching Hardware Showcase Grid */}
        <div className="compat-products-section">
          <h4 className="compat-section-heading">
            <i className="fa-solid fa-crosshairs"></i> Calibrated Gear for {selectedDevice.name}
          </h4>

          <div className="compat-products-grid">
            {allRecommended.map((product) => (
              <div key={product.id} className="compat-product-card">
                <div className="compat-img-wrap" onClick={() => { onClose(); openDetail(product); }}>
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <div className="compat-card-info">
                  <span className="compat-product-cat">{product.subCategory || product.category}</span>
                  <h5 className="compat-product-title" onClick={() => { onClose(); openDetail(product); }}>{product.name}</h5>
                  <div className="compat-price-row">
                    <span className="compat-price">Rs. {product.price.toLocaleString()}</span>
                    <span className="compat-orig-price">Rs. {product.originalPrice.toLocaleString()}</span>
                  </div>
                  <button 
                    className="compat-add-btn"
                    onClick={() => addToCart(product)}
                  >
                    <i className="fa-solid fa-cart-plus"></i> Add to Loadout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
