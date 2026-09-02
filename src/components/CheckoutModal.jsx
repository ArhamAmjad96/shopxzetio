import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, subtotal, shipping, total, clearCart, openSuccess } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: ''
  });
  const [receiptUrl, setReceiptUrl] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.address.trim()) {
      alert('Please fill in all required fields (Full Name, WhatsApp Number, City, and Delivery Address).');
      return;
    }

    const orderRef = 'SXZ-' + Math.floor(10000 + Math.random() * 90000);
    const paymentMethodLabel = paymentMethod === 'cod'
      ? 'Cash on Delivery (COD)'
      : paymentMethod === 'cod_advance'
        ? 'COD + Rs. 500 Advance'
        : 'Full Online Payment';

    const initialStatus = (paymentMethod === 'cod_advance' || paymentMethod === 'full_advance')
      ? (receiptUrl ? 'Receipt Submitted' : 'Pending Advance')
      : 'Confirmed (COD)';

    const orderData = {
      orderRef,
      date: new Date().toISOString(),
      customer: {
        fullName: formData.name.trim(),
        whatsapp: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim()
      },
      paymentMethod: paymentMethodLabel,
      paymentCode: paymentMethod,
      items: [...items],
      subtotal,
      shipping,
      total,
      hasReceipt: !!receiptUrl,
      receiptDataUrl: receiptUrl || null,
      status: initialStatus,
      trackingNumber: '',
      courier: 'TCS Pakistan'
    };

    // Save in localStorage
    try {
      const history = JSON.parse(localStorage.getItem('shopxzetio_order_history') || '[]');
      history.unshift(orderData);
      localStorage.setItem('shopxzetio_order_history', JSON.stringify(history));
    } catch (err) {
      console.error(err);
    }

    // Build WhatsApp URL
    let waText = `*CONFIRMED ORDER: #${orderRef}*\n`;
    waText += `*Store:* ShopXzetio Pakistan Esports\n`;
    waText += `--------------------------------\n`;
    waText += `*Customer:* ${orderData.customer.fullName}\n`;
    waText += `*Phone/WhatsApp:* ${orderData.customer.whatsapp}\n`;
    waText += `*Email:* ${orderData.customer.email || 'N/A'}\n`;
    waText += `*Shipping Address:* ${orderData.customer.address}, ${orderData.customer.city}\n`;
    if (orderData.customer.notes) waText += `*Delivery Notes:* ${orderData.customer.notes}\n`;
    waText += `--------------------------------\n`;
    waText += `*Order Items:*\n`;
    orderData.items.forEach((item, i) => {
      waText += `${i + 1}. ${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    waText += `--------------------------------\n`;
    waText += `*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
    waText += `*Shipping:* ${shipping === 0 ? 'FREE' : 'Rs. ' + shipping.toLocaleString()}\n`;
    waText += `*Grand Total:* Rs. ${total.toLocaleString()}\n`;
    waText += `*Payment Mode:* ${paymentMethodLabel}\n`;
    if (paymentMethod === 'cod_advance') {
      waText += `*Advance Paid:* Rs. 500\n`;
      waText += `*Remaining on COD:* Rs. ${(total - 500).toLocaleString()}\n`;
    }
    if (receiptUrl) {
      waText += `*Payment Receipt:* Attached / Uploaded\n`;
    }
    waText += `--------------------------------\n`;
    waText += `Please dispatch my package as soon as possible! Thank you.`;

    const whatsappUrl = `https://wa.me/923348590229?text=${encodeURIComponent(waText)}`;

    // Reset & open success modal
    clearCart();
    closeCheckout();
    openSuccess({ ...orderData, whatsappUrl });
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) closeCheckout(); }}>
      <div className="modal-content-cyber checkout-modal-content">
        <button className="modal-close-btn" onClick={closeCheckout} aria-label="Close Checkout">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="checkout-grid">
          {/* Form Side */}
          <div>
            <h3 className="checkout-section-title">
              <i className="fa-solid fa-user-shield" style={{ color: 'var(--cyan)' }}></i> DISPATCH DETAILS
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Asad Khan"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">WhatsApp / Mobile *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="form-input" 
                    required 
                    placeholder="e.g. 03348590229"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-input" 
                    placeholder="e.g. asad@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">City *</label>
                <input 
                  type="text" 
                  id="city" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Karachi, Lahore, Islamabad..."
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">Delivery Address *</label>
                <textarea 
                  id="address" 
                  className="form-textarea" 
                  required 
                  placeholder="House/Flat number, Street, Sector/Area, Landmark..."
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">Special Instructions (Optional)</label>
                <input 
                  type="text" 
                  id="notes" 
                  className="form-input" 
                  placeholder="e.g. Call before arrival, leave with security"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              {/* Payment Methods */}
              <h3 className="checkout-section-title" style={{ marginTop: '26px' }}>
                <i className="fa-solid fa-credit-card" style={{ color: 'var(--cyan)' }}></i> PAYMENT METHOD
              </h3>

              <div className="payment-methods-group">
                <label className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-option-info">
                    <h5>Cash On Delivery (COD)</h5>
                    <p>Pay 100% in cash to the delivery rider when package arrives.</p>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod === 'cod_advance' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod_advance" 
                    checked={paymentMethod === 'cod_advance'}
                    onChange={() => setPaymentMethod('cod_advance')}
                  />
                  <div className="payment-option-info">
                    <h5>COD + Rs. 500 Advance</h5>
                    <p>Pay Rs. 500 security deposit in advance; pay remaining balance on delivery.</p>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod === 'full_advance' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="full_advance" 
                    checked={paymentMethod === 'full_advance'}
                    onChange={() => setPaymentMethod('full_advance')}
                  />
                  <div className="payment-option-info">
                    <h5>Full Online Payment</h5>
                    <p>100% advance transfer via JazzCash, EasyPaisa, or Bank Alfalah.</p>
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Breakdown & Credentials */}
              <div style={{ marginTop: '14px' }}>
                {paymentMethod === 'cod' && (
                  <div style={{ padding: '12px 14px', background: 'rgba(0, 240, 255, 0.04)', borderLeft: '3px solid var(--cyan)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#fff' }}>100% Cash On Delivery:</strong>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>
                      You will pay the full amount of <strong style={{ color: 'var(--cyan)' }}>Rs. {total.toLocaleString()}</strong> in cash to the courier rider upon delivery.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod_advance' && (
                  <div style={{ padding: '12px 14px', background: 'rgba(0, 255, 157, 0.05)', borderLeft: '3px solid var(--green-tourney)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#fff' }}>COD + Rs. 500 Security Advance:</strong>
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Advance Payment: <strong style={{ color: 'var(--green-tourney)' }}>Rs. 500</strong> (Transfer via JazzCash / EasyPaisa)</div>
                      <div>Remaining on Delivery: <strong style={{ color: 'var(--cyan)' }}>Rs. {Math.max(0, total - 500).toLocaleString()}</strong></div>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '4px' }}>
                      <div><strong>Account Title:</strong> ShopXzetio Gaming Hub</div>
                      <div><strong>JazzCash / EasyPaisa:</strong> 0334-8590229</div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'full_advance' && (
                  <div style={{ padding: '12px 14px', background: 'rgba(10, 132, 255, 0.08)', borderLeft: '3px solid var(--blue-electric)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#fff' }}>Full Online Payment:</strong>
                    <p style={{ color: 'var(--text-soft)', marginTop: '4px' }}>
                      Total Payable: <strong style={{ color: 'var(--cyan)' }}>Rs. {total.toLocaleString()}</strong>
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '4px' }}>
                      <div><strong>Account Title:</strong> ShopXzetio Gaming Hub</div>
                      <div><strong>JazzCash / EasyPaisa:</strong> 0334-8590229</div>
                      <div><strong>Bank Alfalah:</strong> 0142-1008928192</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Receipt Upload Section */}
              {paymentMethod !== 'cod' && (
                <div className="payment-receipt-upload-box">
                  <label className="form-label" style={{ color: 'var(--cyan)', cursor: 'pointer' }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}></i>
                    Upload Payment Screenshot / Receipt (Optional)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'block', margin: '8px auto', fontSize: '0.8rem' }}
                  />
                  {receiptUrl && (
                    <img 
                      src={receiptUrl} 
                      alt="Payment Receipt Preview" 
                      className="upload-preview-img"
                      style={{ display: 'block' }}
                    />
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-cyber-primary cyber-cut-sm" 
                style={{ width: '100%', height: '50px', marginTop: '24px' }}
              >
                <i className="fa-solid fa-circle-check"></i> PLACE ESPORTS ORDER
              </button>
            </form>
          </div>

          {/* Summary Side */}
          <div>
            <div className="order-summary-box">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', marginBottom: '16px' }}>
                ORDER SUMMARY
              </h4>

              <div className="summary-items-list">
                {items.map(item => (
                  <div key={item.id} className="summary-item-row">
                    <span className="summary-item-name">{item.quantity}x {item.name}</span>
                    <span className="summary-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                <div className="cart-summary-row">
                  <span style={{ color: 'var(--text-dim)' }}>Subtotal:</span>
                  <span style={{ fontFamily: 'var(--font-digital)', color: '#fff' }}>
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span style={{ color: 'var(--text-dim)' }}>Delivery Fee:</span>
                  <span style={{ fontFamily: 'var(--font-digital)', color: shipping === 0 ? 'var(--green-tourney)' : '#fff' }}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="cart-summary-row total" style={{ marginBottom: '16px' }}>
                  <span>Total Amount:</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 240, 255, 0.04)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--green-tourney)', marginBottom: '4px', fontWeight: 700 }}>
                  <i className="fa-solid fa-lock"></i> SHOPXZETIO ORDER GUARANTEE
                </div>
                7 Days checking warranty. Verified serial numbers. Direct WhatsApp dispatcher for real-time tracking updates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
