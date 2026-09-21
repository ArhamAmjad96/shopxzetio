import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { handleImageError, normalizeAssetUrl } from '../lib/assets';

export default function ProductDetailModal() {
  const { activeDetailProduct, closeDetail } = useCart();
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

  return (
    <div 
      className="modal-backdrop active image-lightbox-backdrop" 
      onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) closeDetail(); }}
    >
      <div className="pure-image-preview-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button 
          type="button"
          className="pure-preview-close-btn" 
          onClick={closeDetail} 
          title="Close (Esc)" 
          aria-label="Close Preview"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Counter Badge if multiple images */}
        {images.length > 1 && (
          <div className="pure-preview-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Main Stage with Image & Nav Buttons */}
        <div className="pure-preview-stage">
          {images.length > 1 && (
            <button 
              type="button" 
              className="pure-preview-arrow prev" 
              onClick={handlePrev}
              title="Previous (←)"
              aria-label="Previous image"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <img 
            key={currentImage}
            src={currentImage} 
            alt={`Product view ${currentIndex + 1}`} 
            className="pure-preview-main-img" 
            onError={handleImageError}
          />

          {images.length > 1 && (
            <button 
              type="button" 
              className="pure-preview-arrow next" 
              onClick={handleNext}
              title="Next (→)"
              aria-label="Next image"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="pure-preview-thumbs">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                type="button"
                className={`pure-preview-thumb ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  loading="lazy" 
                  onError={handleImageError} 
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
