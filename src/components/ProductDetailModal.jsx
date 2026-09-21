import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { handleImageError, normalizeAssetUrl } from '../lib/assets';

export default function ProductDetailModal() {
  const { activeDetailProduct, closeDetail, addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);

  const product = activeDetailProduct;
  const images = (product?.images && product.images.length > 0 
    ? product.images 
    : [product?.mainImage]
  ).filter(Boolean).map(normalizeAssetUrl);

  useEffect(() => {
    if (activeDetailProduct) {
      setCurrentIndex(0);
    }
  }, [activeDetailProduct]);

  useEffect(() => {
    if (!activeDetailProduct) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDetail();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDetailProduct, images.length, closeDetail]);

  if (!activeDetailProduct) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleWhatsAppBuy = (e) => {
    e.stopPropagation();
    const text = `*NEW ORDER INQUIRY - SHOPXZETIO PAKISTAN*\n` +
                 `--------------------------------------\n` +
                 `*Product:* ${product.name}\n` +
                 `*Unit Price:* Rs. ${product.price.toLocaleString()}\n` +
                 `*Category:* ${product.category} (${product.subCategory || ''})\n` +
                 `--------------------------------------\n` +
                 `Hello! I would like to order this item. Please confirm stock availability and courier delivery to my city.`;
    window.open(`https://wa.me/923348590229?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    closeDetail();
  };

  return (
    <div 
      className="modal-backdrop active" 
      onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) closeDetail(); }}
    >
      <div className="image-preview-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="preview-modal-header">
          <div className="preview-modal-title-wrap">
            <h3 className="preview-modal-title" title={product.name}>
              {product.name}
            </h3>
            {images.length > 1 && (
              <span className="preview-modal-counter">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          <button 
            className="preview-modal-close-btn" 
            onClick={closeDetail} 
            title="Close Preview (Esc)" 
            aria-label="Close Preview"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Stage & Navigation Arrows */}
        <div className="preview-stage-container">
          {images.length > 1 && (
            <button 
              type="button" 
              className="preview-nav-btn prev" 
              onClick={handlePrev}
              title="Previous Image (←)"
              aria-label="Previous Image"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <img 
            key={currentImage}
            src={currentImage} 
            alt={`${product.name} - View ${currentIndex + 1}`} 
            className="preview-main-img" 
            onError={handleImageError}
          />

          {images.length > 1 && (
            <button 
              type="button" 
              className="preview-nav-btn next" 
              onClick={handleNext}
              title="Next Image (→)"
              aria-label="Next Image"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>

        {/* All Thumbnails Bar */}
        {images.length > 1 && (
          <div className="preview-thumbnails-bar">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                type="button"
                className={`preview-thumb-item ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                title={`View image ${idx + 1}`}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} thumbnail ${idx + 1}`} 
                  loading="lazy" 
                  onError={handleImageError} 
                />
              </button>
            ))}
          </div>
        )}

        {/* Compact Bottom Action Bar */}
        <div className="preview-modal-footer">
          <div className="preview-footer-price">
            <span className="preview-footer-current-price">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="preview-footer-orig-price">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="preview-footer-actions">
            <button 
              type="button"
              className="preview-footer-btn-cart" 
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button 
              type="button"
              className="preview-footer-btn-wa" 
              onClick={handleWhatsAppBuy}
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>Order WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
