/**
 * ShopXzetio Esports Checkout System
 * 3-Tier Payment Processing: Cash On Delivery, COD + Rs. 500 Advance, Full Advance Payment
 * Automatic WhatsApp order dispatcher with receipt preview
 */

class ShopCheckout {
  constructor() {
    this.selectedPaymentMethod = 'cod'; // 'cod', 'cod_advance', 'full_advance'
    this.receiptDataUrl = null;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.checkoutModal = document.getElementById('checkoutModal');
    this.checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
    this.checkoutForm = document.getElementById('checkoutForm');
    this.orderSummaryItems = document.getElementById('checkoutSummaryItems');
    this.subtotalEl = document.getElementById('checkoutSubtotal');
    this.shippingEl = document.getElementById('checkoutShipping');
    this.totalEl = document.getElementById('checkoutTotal');
    this.paymentBreakdownEl = document.getElementById('paymentBreakdownBox');
    this.paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    this.receiptUploadSection = document.getElementById('receiptUploadSection');
    this.receiptInput = document.getElementById('paymentReceiptInput');
    this.receiptPreview = document.getElementById('receiptPreviewImg');

    // Confirmation Modal
    this.successModal = document.getElementById('orderSuccessModal');
    this.successCloseBtn = document.getElementById('successCloseBtn');
    this.successOrderRef = document.getElementById('successOrderRef');
    this.successSummaryText = document.getElementById('successSummaryText');
    this.successWhatsAppBtn = document.getElementById('successWhatsAppBtn');
  }

  bindEvents() {
    if (this.checkoutCloseBtn) {
      this.checkoutCloseBtn.addEventListener('click', () => this.closeCheckout());
    }

    if (this.checkoutModal) {
      this.checkoutModal.addEventListener('click', (e) => {
        if (e.target === this.checkoutModal) this.closeCheckout();
      });
    }

    if (this.successCloseBtn) {
      this.successCloseBtn.addEventListener('click', () => {
        if (this.successModal) this.successModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    this.paymentMethods.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedPaymentMethod = e.target.value;
        this.updatePaymentDetails();
      });
    });

    if (this.receiptInput) {
      this.receiptInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.receiptDataUrl = event.target.result;
            if (this.receiptPreview) {
              this.receiptPreview.src = this.receiptDataUrl;
              this.receiptPreview.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (this.checkoutForm) {
      this.checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitOrder();
      });
    }
  }

  openCheckout() {
    if (!window.shopCart || window.shopCart.items.length === 0) {
      alert('Your cart is empty. Please select products first.');
      return;
    }

    this.renderSummary();
    this.updatePaymentDetails();
    if (this.checkoutModal) {
      this.checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCheckout() {
    if (this.checkoutModal) {
      this.checkoutModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  renderSummary() {
    if (!this.orderSummaryItems) return;
    const cart = window.shopCart;

    this.orderSummaryItems.innerHTML = cart.items.map(item => `
      <div class="summary-item-row">
        <span class="summary-item-name">${item.quantity}x ${item.name}</span>
        <span class="summary-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');

    const subtotal = cart.getSubtotal();
    const shipping = cart.getShippingFee();
    const total = cart.getTotal();

    if (this.subtotalEl) this.subtotalEl.textContent = 'Rs. ' + subtotal.toLocaleString();
    if (this.shippingEl) this.shippingEl.textContent = shipping === 0 ? 'FREE' : 'Rs. ' + shipping.toLocaleString();
    if (this.totalEl) this.totalEl.textContent = 'Rs. ' + total.toLocaleString();
  }

  updatePaymentDetails() {
    const total = window.shopCart.getTotal();
    const advanceAmount = 500;
    const remainingCOD = Math.max(0, total - advanceAmount);

    if (this.paymentBreakdownEl) {
      if (this.selectedPaymentMethod === 'cod') {
        this.paymentBreakdownEl.innerHTML = `
          <div style="padding: 12px 14px; background: rgba(0, 240, 255, 0.04); border-left: 3px solid var(--cyan); border-radius: 4px; font-size: 0.85rem;">
            <strong style="color: #fff;">100% Cash On Delivery:</strong>
            <p style="color: var(--text-dim); margin-top: 4px;">You will pay the full amount of <strong style="color: var(--cyan);">Rs. ${total.toLocaleString()}</strong> in cash to the courier rider upon delivery.</p>
          </div>
        `;
        if (this.receiptUploadSection) this.receiptUploadSection.style.display = 'none';
      } else if (this.selectedPaymentMethod === 'cod_advance') {
        this.paymentBreakdownEl.innerHTML = `
          <div style="padding: 12px 14px; background: rgba(0, 255, 157, 0.05); border-left: 3px solid var(--green-tourney); border-radius: 4px; font-size: 0.85rem;">
            <strong style="color: #fff;">COD + Rs. 500 Security Advance:</strong>
            <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
              <div>Advance Payment: <strong style="color: var(--green-tourney);">Rs. 500</strong> (Transfer now via JazzCash / EasyPaisa)</div>
              <div>Remaining on Delivery: <strong style="color: var(--cyan);">Rs. ${remainingCOD.toLocaleString()}</strong></div>
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 4px;">
              <div><strong>Account Title:</strong> ShopXzetio Gaming Hub</div>
              <div><strong>JazzCash / EasyPaisa:</strong> 0334-8590229</div>
            </div>
          </div>
        `;
        if (this.receiptUploadSection) this.receiptUploadSection.style.display = 'block';
      } else if (this.selectedPaymentMethod === 'full_advance') {
        this.paymentBreakdownEl.innerHTML = `
          <div style="padding: 12px 14px; background: rgba(10, 132, 255, 0.08); border-left: 3px solid var(--blue-electric); border-radius: 4px; font-size: 0.85rem;">
            <strong style="color: #fff;">Full Online Payment:</strong>
            <p style="color: var(--text-soft); margin-top: 4px;">Total Payable: <strong style="color: var(--cyan);">Rs. ${total.toLocaleString()}</strong></p>
            <div style="margin-top: 8px; font-size: 0.8rem; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 4px;">
              <div><strong>Account Title:</strong> ShopXzetio Gaming Hub</div>
              <div><strong>JazzCash / EasyPaisa:</strong> 0334-8590229</div>
              <div><strong>Bank Alfalah:</strong> 0142-1008928192</div>
            </div>
          </div>
        `;
        if (this.receiptUploadSection) this.receiptUploadSection.style.display = 'block';
      }
    }
  }

  submitOrder() {
    const fullName = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const whatsapp = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value.trim();
    const notes = document.getElementById('checkoutNotes').value.trim();

    if (!fullName || !whatsapp || !address || !city) {
      alert('Please fill in all required fields (Full Name, WhatsApp Number, Shipping Address, and City).');
      return;
    }

    const orderRef = 'SXZ-' + Math.floor(10000 + Math.random() * 90000);
    const cart = window.shopCart;
    const items = [...cart.items];
    const subtotal = cart.getSubtotal();
    const shipping = cart.getShippingFee();
    const total = cart.getTotal();
    const paymentMethodLabel = this.selectedPaymentMethod === 'cod' 
      ? 'Cash on Delivery (COD)' 
      : this.selectedPaymentMethod === 'cod_advance' 
        ? 'COD + Rs. 500 Advance' 
        : 'Full Online Payment';

    const initialStatus = (this.selectedPaymentMethod === 'cod_advance' || this.selectedPaymentMethod === 'full_advance')
      ? (this.receiptDataUrl ? 'Receipt Submitted' : 'Pending Advance')
      : 'Confirmed (COD)';

    const orderData = {
      orderRef,
      date: new Date().toISOString(),
      customer: { fullName, email, whatsapp, address, city, notes },
      paymentMethod: paymentMethodLabel,
      paymentCode: this.selectedPaymentMethod,
      items,
      subtotal,
      shipping,
      total,
      hasReceipt: !!this.receiptDataUrl,
      receiptDataUrl: this.receiptDataUrl || null,
      status: initialStatus,
      trackingNumber: '',
      courier: 'TCS Pakistan'
    };

    // Save order history in localStorage
    try {
      const history = JSON.parse(localStorage.getItem('shopxzetio_order_history') || '[]');
      history.unshift(orderData);
      localStorage.setItem('shopxzetio_order_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }

    // Build WhatsApp message
    let waText = `*CONFIRMED ORDER: #${orderRef}*\n`;
    waText += `*Store:* ShopXzetio Pakistan Esports\n`;
    waText += `--------------------------------\n`;
    waText += `*Customer:* ${fullName}\n`;
    waText += `*Phone/WhatsApp:* ${whatsapp}\n`;
    waText += `*Email:* ${email || 'N/A'}\n`;
    waText += `*Shipping Address:* ${address}, ${city}\n`;
    if (notes) waText += `*Delivery Notes:* ${notes}\n`;
    waText += `--------------------------------\n`;
    waText += `*Order Items:*\n`;
    items.forEach((item, i) => {
      waText += `${i + 1}. ${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    waText += `--------------------------------\n`;
    waText += `*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
    waText += `*Shipping:* ${shipping === 0 ? 'FREE' : 'Rs. ' + shipping.toLocaleString()}\n`;
    waText += `*Grand Total:* Rs. ${total.toLocaleString()}\n`;
    waText += `*Payment Mode:* ${paymentMethodLabel}\n`;
    
    if (this.selectedPaymentMethod === 'cod_advance') {
      waText += `*Advance Paid:* Rs. 500\n`;
      waText += `*Remaining on COD:* Rs. ${(total - 500).toLocaleString()}\n`;
    }

    if (this.receiptDataUrl) {
      waText += `*Payment Receipt:* Attached / Uploaded\n`;
    }
    waText += `--------------------------------\n`;
    waText += `Please dispatch my package as soon as possible! Thank you.`;

    const encodedWA = encodeURIComponent(waText);
    const whatsappUrl = `https://wa.me/923265656336?text=${encodedWA}`;

    // Close checkout and clear cart
    this.closeCheckout();
    cart.clear();
    this.receiptDataUrl = null;
    if (this.receiptPreview) {
      this.receiptPreview.src = '';
      this.receiptPreview.style.display = 'none';
    }
    if (this.receiptInput) this.receiptInput.value = '';

    // Show Success Modal
    if (this.successModal) {
      if (this.successOrderRef) this.successOrderRef.textContent = '#' + orderRef;
      if (this.successSummaryText) {
        this.successSummaryText.innerHTML = `
          <div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-soft);">
            <p>Thank you, <strong style="color:#fff;">${fullName}</strong>! Your order reference is <strong style="color:var(--cyan);">#${orderRef}</strong>.</p>
            <p style="margin-top: 6px;">Total: <strong style="color:var(--cyan);">Rs. ${total.toLocaleString()}</strong> (${paymentMethodLabel}).</p>
            <p style="margin-top: 6px;">We have prepared your instant dispatch details. Click below to verify and finalize your shipment via WhatsApp.</p>
          </div>
        `;
      }
      if (this.successWhatsAppBtn) {
        this.successWhatsAppBtn.onclick = () => {
          window.open(whatsappUrl, '_blank');
        };
      }

      const downloadBtn = document.getElementById('successDownloadInvoiceBtn');
      if (downloadBtn) {
        downloadBtn.onclick = () => {
          this.downloadInvoice(orderData);
        };
      }

      this.successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      window.open(whatsappUrl, '_blank');
    }
  }

  downloadInvoice(order) {
    let invoice = `=================================================================\n`;
    invoice += `                SHOPXZETIO PAKISTAN - OFFICIAL INVOICE          \n`;
    invoice += `          Tournament-Grade Esports Hardware & Peripherals       \n`;
    invoice += `=================================================================\n\n`;
    invoice += `ORDER REFERENCE:  #${order.orderRef}\n`;
    invoice += `ORDER DATE:       ${new Date().toLocaleString()}\n`;
    invoice += `PAYMENT METHOD:   ${order.paymentMethod}\n`;
    invoice += `SUPPORT WHATSAPP: +92 326 5656336\n`;
    invoice += `INSTAGRAM:        @shopxzetio_\n\n`;
    invoice += `-----------------------------------------------------------------\n`;
    invoice += `CUSTOMER DISPATCH DETAILS\n`;
    invoice += `-----------------------------------------------------------------\n`;
    invoice += `Name:             ${order.customer.fullName}\n`;
    invoice += `WhatsApp / Tel:   ${order.customer.whatsapp}\n`;
    invoice += `Email:            ${order.customer.email || 'N/A'}\n`;
    invoice += `Shipping Address: ${order.customer.address}, ${order.customer.city}\n`;
    if (order.customer.notes) {
      invoice += `Notes:            ${order.customer.notes}\n`;
    }
    invoice += `\n-----------------------------------------------------------------\n`;
    invoice += `ITEMIZED ORDER ARSENAL\n`;
    invoice += `-----------------------------------------------------------------\n`;
    order.items.forEach((it, i) => {
      invoice += `${i + 1}. ${it.name}\n`;
      invoice += `   Qty: ${it.quantity}  x  Rs. ${it.price.toLocaleString()}  =  Rs. ${(it.price * it.quantity).toLocaleString()}\n`;
    });
    invoice += `\n-----------------------------------------------------------------\n`;
    invoice += `FINANCIAL SUMMARY\n`;
    invoice += `-----------------------------------------------------------------\n`;
    invoice += `Subtotal:         Rs. ${order.subtotal.toLocaleString()}\n`;
    invoice += `Shipping (PK):    ${order.shipping === 0 ? 'FREE' : 'Rs. ' + order.shipping.toLocaleString()}\n`;
    invoice += `GRAND TOTAL:      Rs. ${order.total.toLocaleString()}\n`;
    if (order.paymentCode === 'cod_advance') {
      invoice += `Advance Paid:     Rs. 500\n`;
      invoice += `Balance on COD:   Rs. ${(order.total - 500).toLocaleString()}\n`;
    }
    invoice += `\n=================================================================\n`;
    invoice += `7 DAYS CHECKING WARRANTY | OFFICIAL SERIAL VERIFIED HARDWARE   \n`;
    invoice += `Thank you for choosing ShopXzetio - Pakistan's Elite Gaming Store\n`;
    invoice += `=================================================================\n`;

    const blob = new Blob([invoice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SHOPXZETIO_INVOICE_${order.orderRef}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Global instance
window.shopCheckout = new ShopCheckout();
