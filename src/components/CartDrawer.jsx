import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    openCheckout
  } = useCart();

  const handleWhatsAppFastOrder = () => {
    if (items.length === 0) return;

    let text = `*NEW ORDER - SHOPXZETIO PAKISTAN*\n`;
    text += `==============================\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    text += `==============================\n`;
    text += `*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
    text += `*Shipping:* ${shipping === 0 ? 'FREE' : 'Rs. ' + shipping.toLocaleString()}\n`;
    text += `*Grand Total:* Rs. ${total.toLocaleString()}\n\n`;
    text += `Please confirm my order and share delivery details!`;

    window.open(`https://wa.me/923348590229?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <div 
        className={`cart-drawer-backdrop ${isCartOpen ? 'active' : ''}`}
        onClick={closeCart}
      />
      <aside className={`cart-drawer ${isCartOpen ? 'active' : ''}`} aria-label="Armory Cart">
        <div className="cart-drawer-header">
          <h3>
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--cyan)' }}></i> YOUR ARMORY
          </h3>
          <button 
            onClick={closeCart}
            style={{ background: 'transparent', color: 'var(--text-dim)', fontSize: '1.3rem', cursor: 'pointer', border: 'none' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
              <i className="fa-solid fa-cart-arrow-down" style={{ fontSize: '3rem', color: 'var(--border-cyan)', marginBottom: '16px' }}></i>
              <h4 style={{ fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '8px' }}>ARMORY EMPTY</h4>
              <p style={{ fontSize: '0.85rem' }}>You haven't equipped any gaming hardware yet.</p>
              <button 
                onClick={closeCart}
                className="btn-cyber-secondary" 
                style={{ marginTop: '20px', height: '42px', fontSize: '0.8rem' }}
              >
                BROWSE GEAR
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="cart-item-img"
                  onError={(e) => { e.target.src = '/assets/brand/LOGO.png'; }}
                />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">Rs. {item.price.toLocaleString()}</div>
                  <div className="cart-item-controls">
                    <div className="qty-control-box">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="qty-display">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <span style={{ fontFamily: 'var(--font-digital)', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button 
                  className="cart-item-remove-btn" 
                  title="Remove" 
                  onClick={() => removeFromCart(item.id)}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="cart-drawer-footer">
          <div className="cart-summary-row">
            <span style={{ color: 'var(--text-dim)' }}>Subtotal:</span>
            <span style={{ fontFamily: 'var(--font-digital)', color: '#fff' }}>
              Rs. {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="cart-summary-row">
            <span style={{ color: 'var(--text-dim)' }}>Shipping (Pakistan):</span>
            <span style={{ fontFamily: 'var(--font-digital)', color: shipping === 0 ? 'var(--green-tourney)' : '#fff' }}>
              {shipping === 0 ? 'FREE (Special Offer)' : `Rs. ${shipping.toLocaleString()}`}
            </span>
          </div>
          <div className="cart-summary-row total">
            <span>Grand Total:</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>

          <button 
            onClick={openCheckout}
            disabled={items.length === 0}
            className="btn-checkout-primary cyber-cut-sm"
            style={{ opacity: items.length === 0 ? 0.5 : 1, cursor: items.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            <i className="fa-solid fa-lock"></i> PROCEED TO CHECKOUT
          </button>

          <button 
            onClick={handleWhatsAppFastOrder}
            disabled={items.length === 0}
            className="btn-whatsapp-direct cyber-cut-sm"
            style={{ opacity: items.length === 0 ? 0.5 : 1, cursor: items.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            <i className="fa-brands fa-whatsapp"></i> FAST WHATSAPP ORDER
          </button>
        </div>
      </aside>
    </>
  );
}
