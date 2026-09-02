import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, openDetail } = useCart();

  const mainImg = product.mainImage || (product.images && product.images[0]) || '/assets/brand/LOGO.png';

  // Calculate discount percentage if originalPrice exists
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleWhatsAppBuy = (e) => {
    e.stopPropagation();
    const text = `*NEW ORDER INQUIRY - SHOPXZETIO PAKISTAN*\n` +
                 `--------------------------------------\n` +
                 `*Product:* ${product.name}\n` +
                 `*Price:* Rs. ${product.price.toLocaleString()}\n` +
                 `*Category:* ${product.category} (${product.subCategory || ''})\n` +
                 `--------------------------------------\n` +
                 `Hello! I would like to order this item. Please confirm stock availability and courier delivery to my city.`;
    window.open(`https://wa.me/923348590229?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="daraz-product-card" onClick={() => openDetail(product)}>
      {/* 1:1 Aspect Ratio Image Stage */}
      <div className="daraz-card-img-wrap">
        {discountPercent && (
          <span className="daraz-discount-badge">-{discountPercent}%</span>
        )}
        {product.badge && (
          <span className="daraz-feature-badge">{product.badge}</span>
        )}
        <img 
          src={mainImg} 
          alt={product.name} 
          className="daraz-card-img" 
          loading="lazy" 
          onError={(e) => { e.target.src = '/assets/brand/LOGO.png'; }}
        />
        <div className="daraz-hover-inspect">
          <i className="fa-solid fa-eye"></i> Quick View
        </div>
      </div>

      {/* Card Information Body */}
      <div className="daraz-card-body">
        {/* Title (2-line clamp) */}
        <h3 className="daraz-card-title" title={product.name}>
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="daraz-price-row">
          <span className="daraz-current-price">
            <span className="daraz-currency">Rs.</span>
            {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="daraz-orig-price">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating & Orders Social Proof */}
        <div className="daraz-rating-row">
          <div className="daraz-stars">
            <i className="fa-solid fa-star"></i>
            <span>{product.rating || '4.9'}</span>
          </div>
          <span className="daraz-sold-count">
            ({product.reviewsCount || Math.floor(Math.random() * 40 + 25)} sold)
          </span>
          <span className="daraz-tag-cod">COD</span>
        </div>

        {/* Action Buttons */}
        <div className="daraz-card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="daraz-btn-cart" 
            onClick={() => addToCart(product, 1)}
            title="Add to Cart"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span>Add</span>
          </button>
          <button 
            className="daraz-btn-wa" 
            onClick={handleWhatsAppBuy}
            title="1-Click WhatsApp Order"
          >
            <i className="fa-brands fa-whatsapp"></i>
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
