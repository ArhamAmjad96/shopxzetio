/**
 * ShopXzetio Esports Cart Module
 * Persistent local storage cart with realtime UI drawer synchronization
 */

const CART_STORAGE_KEY = 'shopxzetio_cart_v1';

class ShopCart {
  constructor() {
    this.items = this.loadCart();
    this.initElements();
    this.bindEvents();
    this.updateBadge();
    this.renderDrawer();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      this.updateBadge();
      this.renderDrawer();
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }

  initElements() {
    this.cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartSubtotalEl = document.getElementById('cartSubtotal');
    this.cartShippingEl = document.getElementById('cartShipping');
    this.cartTotalEl = document.getElementById('cartTotal');
    this.cartCountBadge = document.getElementById('cartCountBadge');
    this.cartToggleBtn = document.getElementById('cartToggleBtn');
    this.cartCloseBtn = document.getElementById('cartCloseBtn');
    this.checkoutBtn = document.getElementById('proceedCheckoutBtn');
    this.cartWhatsAppBtn = document.getElementById('cartWhatsAppBtn');
  }

  bindEvents() {
    if (this.cartToggleBtn) {
      this.cartToggleBtn.addEventListener('click', () => this.openDrawer());
    }
    if (this.cartCloseBtn) {
      this.cartCloseBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (this.cartDrawerBackdrop) {
      this.cartDrawerBackdrop.addEventListener('click', (e) => {
        if (e.target === this.cartDrawerBackdrop) this.closeDrawer();
      });
    }
    if (this.cartWhatsAppBtn) {
      this.cartWhatsAppBtn.addEventListener('click', () => this.orderCartViaWhatsApp());
    }
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        this.closeDrawer();
        if (window.shopCheckout) {
          window.shopCheckout.openCheckout();
        }
      });
    }

    // Escape key closes cart
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.closeDrawer();
      }
    });
  }

  isOpen() {
    return this.cartDrawer && this.cartDrawer.classList.contains('active');
  }

  openDrawer() {
    if (this.cartDrawer && this.cartDrawerBackdrop) {
      this.cartDrawerBackdrop.classList.add('active');
      this.cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.renderDrawer();
    }
  }

  closeDrawer() {
    if (this.cartDrawer && this.cartDrawerBackdrop) {
      this.cartDrawerBackdrop.classList.remove('active');
      this.cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  addItem(productId, qty = 1) {
    const catalog = window.SHOPXZETIO_PRODUCTS || [];
    const product = catalog.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found: ' + productId);
      return;
    }

    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.shortName || product.name,
        fullName: product.name,
        price: product.price,
        image: product.mainImage || (product.images && product.images[0]) || '',
        quantity: qty
      });
    }

    this.saveCart();
    this.showToast(`Equipped: ${product.shortName || product.name} added to cart`);
    this.openDrawer();
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCart();
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    this.showToast('Item removed from cart');
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getShippingFee() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    // Free shipping across Pakistan for orders >= Rs. 10,000, else standard Rs. 250
    return subtotal >= 10000 ? 0 : 250;
  }

  getTotal() {
    return this.getSubtotal() + this.getShippingFee();
  }

  updateBadge() {
    const count = this.getTotalCount();
    if (this.cartCountBadge) {
      this.cartCountBadge.textContent = count;
      this.cartCountBadge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  formatPrice(num) {
    return 'Rs. ' + num.toLocaleString();
  }

  renderDrawer() {
    if (!this.cartItemsList) return;

    if (this.items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-dim);">
          <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; color: var(--border-cyan); margin-bottom: 16px;"></i>
          <h4 style="font-family: var(--font-display); color: #fff; margin-bottom: 8px;">ARMORY EMPTY</h4>
          <p style="font-size: 0.85rem;">You haven't equipped any gaming hardware yet.</p>
          <button onclick="window.shopCart.closeDrawer(); window.location.href='#catalog';" class="btn-cyber-secondary" style="margin-top: 20px; height: 42px; font-size: 0.8rem;">
            BROWSE GEAR
          </button>
        </div>
      `;
      if (this.cartSubtotalEl) this.cartSubtotalEl.textContent = 'Rs. 0';
      if (this.cartShippingEl) this.cartShippingEl.textContent = 'Rs. 0';
      if (this.cartTotalEl) this.cartTotalEl.textContent = 'Rs. 0';
      if (this.checkoutBtn) this.checkoutBtn.disabled = true;
      if (this.cartWhatsAppBtn) this.cartWhatsAppBtn.disabled = true;
      return;
    }

    if (this.checkoutBtn) this.checkoutBtn.disabled = false;
    if (this.cartWhatsAppBtn) this.cartWhatsAppBtn.disabled = false;

    this.cartItemsList.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/brand/LOGO.png'">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${this.formatPrice(item.price)}</div>
          <div class="cart-item-controls">
            <div class="qty-control-box">
              <button class="qty-btn" onclick="window.shopCart.updateQuantity('${item.id}', -1)">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="window.shopCart.updateQuantity('${item.id}', 1)">+</button>
            </div>
            <span style="font-family: var(--font-digital); font-size: 0.9rem; color: var(--text-soft);">
              ${this.formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
        <button class="cart-item-remove-btn" title="Remove" onclick="window.shopCart.removeItem('${item.id}')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    const subtotal = this.getSubtotal();
    const shipping = this.getShippingFee();
    const total = this.getTotal();

    if (this.cartSubtotalEl) this.cartSubtotalEl.textContent = this.formatPrice(subtotal);
    if (this.cartShippingEl) {
      this.cartShippingEl.textContent = shipping === 0 ? 'FREE (Special Offer)' : this.formatPrice(shipping);
      if (shipping === 0) this.cartShippingEl.style.color = 'var(--green-tourney)';
      else this.cartShippingEl.style.color = '';
    }
    if (this.cartTotalEl) this.cartTotalEl.textContent = this.formatPrice(total);
  }

  orderCartViaWhatsApp() {
    if (this.items.length === 0) return;

    let text = `*NEW ORDER - SHOPXZETIO PAKISTAN*\n`;
    text += `==============================\n`;
    this.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    text += `==============================\n`;
    text += `*Subtotal:* Rs. ${this.getSubtotal().toLocaleString()}\n`;
    text += `*Shipping:* ${this.getShippingFee() === 0 ? 'FREE' : 'Rs. ' + this.getShippingFee().toLocaleString()}\n`;
    text += `*Grand Total:* Rs. ${this.getTotal().toLocaleString()}\n\n`;
    text += `Please confirm my order and share delivery details!`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/923348590229?text=${encoded}`;
    window.open(url, '_blank');
  }

  showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bolt" style="color: var(--cyan);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Global instance
window.shopCart = new ShopCart();
