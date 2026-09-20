import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { handleImageError, normalizeAssetUrl } from '../lib/assets';

export default function ProductCard({ product }) {
  const { addToCart, openDetail, showToast } = useCart();
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();

  const mainImg = normalizeAssetUrl(product.mainImage || product.images?.[0]);

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

  const addToWishlist = async () => {
    if (!isCustomer) {
      navigate(`/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!product.databaseId) {
      showToast('Wishlist becomes available after the database catalog is synchronized.');
      return;
    }
    const { error } = await supabase.from('wishlist').upsert({ user_id: user.id, product_id: product.databaseId });
    showToast(error ? error.message : `${product.shortName || product.name} saved to wishlist`);
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
        {product.stockQuantity === 0 && <span className="daraz-feature-badge" style={{ background:'#9f1239' }}>OUT OF STOCK</span>}
        <img 
          src={mainImg} 
          alt={product.name} 
          className="daraz-card-img" 
          loading="lazy" 
          onError={handleImageError}
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
            ({product.reviewCount || 0} reviews)
          </span>
          <span className="daraz-tag-cod">COD</span>
        </div>

        {/* Action Buttons */}
        <div className="daraz-card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="daraz-btn-cart" 
            onClick={() => addToCart(product, 1)}
            disabled={product.stockQuantity === 0}
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
          <button className="daraz-btn-wishlist" onClick={addToWishlist} title="Save to Wishlist" aria-label="Save to Wishlist">
            <i className="fa-regular fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
