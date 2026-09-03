/**
 * ShopXzetio Owner Admin Panel Controller
 * Receipt screenshot verification, order tracking, WhatsApp dispatcher & sales analytics
 */

const ADMIN_STORAGE_KEY = 'shopxzetio_order_history';
const ADMIN_AUTH_KEY = 'shopxzetio_admin_session_v1';
const MASTER_PIN = 'xzetio2026';
const BACKUP_PIN = '923348';

class ShopAdmin {
  constructor() {
    this.orders = [];
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.currentZoom = 1;
    this.activeModalOrder = null;

    this.checkAuth();
  }

  checkAuth() {
    const isAuth = sessionStorage.getItem(ADMIN_AUTH_KEY);
    const lockScreen = document.getElementById('adminLockScreen');
    const mainDashboard = document.getElementById('adminMainDashboard');

    if (isAuth === 'true') {
      if (lockScreen) lockScreen.style.display = 'none';
      if (mainDashboard) mainDashboard.style.display = 'block';
      this.initDashboard();
    } else {
      if (lockScreen) lockScreen.style.display = 'flex';
      if (mainDashboard) mainDashboard.style.display = 'none';
      this.initLockScreen();
    }
  }

  initLockScreen() {
    const lockForm = document.getElementById('lockForm');
    const lockPin = document.getElementById('lockPin');
    const lockError = document.getElementById('lockError');
    const lockCard = document.querySelector('.lock-card');

    if (lockForm) {
      lockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = lockPin.value.trim();
        if (pin === MASTER_PIN || pin === BACKUP_PIN) {
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
          if (lockError) lockError.style.display = 'none';
          this.checkAuth();
        } else {
          if (lockError) lockError.style.display = 'block';
          if (lockCard) {
            lockCard.classList.remove('shake');
            void lockCard.offsetWidth; // trigger reflow
            lockCard.classList.add('shake');
          }
          lockPin.value = '';
          lockPin.focus();
        }
      });
    }
  }

  logout() {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.reload();
  }

  initDashboard() {
    this.loadOrders();
    this.initElements();
    this.bindEvents();
    this.renderStats();
    this.renderOrdersTable();
  }

  loadOrders() {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        this.orders = JSON.parse(stored);
      } else {
        // Seed initial mock orders if none exist
        this.orders = this.getSeedOrders();
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(this.orders));
      }
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
      this.orders = this.getSeedOrders();
    }
  }

  saveOrders() {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(this.orders));
      this.renderStats();
      this.renderOrdersTable();
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }

  getSeedOrders() {
    // Return sample genuine Pakistani orders for initial demonstration
    return [
      {
        orderRef: 'SXZ-84291',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        customer: {
          fullName: 'Daniyal Tariq (i8 Scrims)',
          email: 'daniyal.pubg@gmail.com',
          whatsapp: '03008492019',
          address: 'House 42, Block C, Gulberg III',
          city: 'Lahore',
          notes: 'Please dispatch urgently before PMNC tournament block.'
        },
        paymentMethod: 'COD + Rs. 500 Advance',
        paymentCode: 'cod_advance',
        items: [
          { name: 'PIVA B2 Magnetic Semiconductor Mobile Cooler', price: 3850, quantity: 1 },
          { name: 'ShopXzetio Esports Carbon-Silver Finger Sleeves (Pack of 5 Pairs)', price: 2000, quantity: 1 }
        ],
        subtotal: 5850,
        shipping: 250,
        total: 6100,
        hasReceipt: true,
        receiptDataUrl: 'assets/brand/HERO.png', // Uses genuine asset for image preview
        status: 'Receipt Submitted',
        trackingNumber: 'TCS-928174201',
        courier: 'TCS Pakistan'
      },
      {
        orderRef: 'SXZ-79102',
        date: new Date(Date.now() - 3600000 * 6).toISOString(),
        customer: {
          fullName: 'Farhan Zaidi',
          email: 'farhan.z@yahoo.com',
          whatsapp: '03219481102',
          address: 'Apartment 5B, Creek Vistas, Phase VIII, DHA',
          city: 'Karachi',
          notes: 'Call before delivery.'
        },
        paymentMethod: 'Cash on Delivery (COD)',
        paymentCode: 'cod',
        items: [
          { name: 'HyperX Cloud II Kingston Esports Headset', price: 12500, quantity: 1 }
        ],
        subtotal: 12500,
        shipping: 0,
        total: 12500,
        hasReceipt: false,
        receiptDataUrl: null,
        status: 'Confirmed (COD)',
        trackingNumber: '',
        courier: 'Leopards Courier'
      },
      {
        orderRef: 'SXZ-68430',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        customer: {
          fullName: 'Malik Shahzaib',
          email: 'shahzaib.malik@outlook.com',
          whatsapp: '03335892100',
          address: 'House 112, Street 18, F-10/2',
          city: 'Islamabad',
          notes: 'Tested with PIVA GS1 Pro splitter.'
        },
        paymentMethod: 'Full Online Payment',
        paymentCode: 'full_advance',
        items: [
          { name: 'PIVA GS1 Pro Type-C 2-in-1 Fast Charging Audio Adapter', price: 5500, quantity: 1 }
        ],
        subtotal: 5500,
        shipping: 250,
        total: 5750,
        hasReceipt: true,
        receiptDataUrl: 'assets/brand/LOGO.png',
        status: 'Advance Verified',
        trackingNumber: 'TRX-5510294',
        courier: 'Trax Logistics'
      }
    ];
  }

  initElements() {
    this.searchInput = document.getElementById('adminSearchInput');
    this.filterPills = document.querySelectorAll('.admin-pill');
    this.ordersTbody = document.getElementById('ordersTableBody');
    this.totalRevenueEl = document.getElementById('statTotalRevenue');
    this.totalOrdersEl = document.getElementById('statTotalOrders');
    this.pendingReceiptsEl = document.getElementById('statPendingReceipts');
    this.dispatchedOrdersEl = document.getElementById('statDispatched');

    // Lightbox Modal
    this.lightboxModal = document.getElementById('ssLightboxModal');
    this.lightboxCloseBtn = document.getElementById('ssLightboxClose');
    this.lightboxImg = document.getElementById('ssLightboxImg');
    this.lightboxTitle = document.getElementById('ssLightboxTitle');
    this.lightboxMeta = document.getElementById('ssLightboxMeta');
    this.lightboxVerifyBtn = document.getElementById('ssLightboxVerifyBtn');
    this.lightboxDownloadBtn = document.getElementById('ssLightboxDownloadBtn');
    this.lightboxWABtn = document.getElementById('ssLightboxWABtn');
    this.zoomInBtn = document.getElementById('ssZoomInBtn');
    this.zoomOutBtn = document.getElementById('ssZoomOutBtn');
    this.zoomResetBtn = document.getElementById('ssZoomResetBtn');

    // Logout & Export
    this.logoutBtn = document.getElementById('adminLogoutBtn');
    this.exportBtn = document.getElementById('adminExportCsvBtn');
    this.addManualBtn = document.getElementById('adminAddManualBtn');
  }

  bindEvents() {
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.logout());
    }

    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => this.exportToCSV());
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderOrdersTable();
      });
    }

    this.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeFilter = pill.dataset.filter || 'all';
        this.renderOrdersTable();
      });
    });

    if (this.lightboxCloseBtn) {
      this.lightboxCloseBtn.addEventListener('click', () => this.closeLightbox());
    }

    if (this.lightboxModal) {
      this.lightboxModal.addEventListener('click', (e) => {
        if (e.target === this.lightboxModal) this.closeLightbox();
      });
    }

    if (this.zoomInBtn) {
      this.zoomInBtn.addEventListener('click', () => {
        this.currentZoom = Math.min(3, this.currentZoom + 0.25);
        if (this.lightboxImg) this.lightboxImg.style.transform = `scale(${this.currentZoom})`;
      });
    }

    if (this.zoomOutBtn) {
      this.zoomOutBtn.addEventListener('click', () => {
        this.currentZoom = Math.max(0.5, this.currentZoom - 0.25);
        if (this.lightboxImg) this.lightboxImg.style.transform = `scale(${this.currentZoom})`;
      });
    }

    if (this.zoomResetBtn) {
      this.zoomResetBtn.addEventListener('click', () => {
        this.currentZoom = 1;
        if (this.lightboxImg) this.lightboxImg.style.transform = 'scale(1)';
      });
    }

    if (this.addManualBtn) {
      this.addManualBtn.addEventListener('click', () => this.addManualTestOrder());
    }
  }

  renderStats() {
    const totalRev = this.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalCount = this.orders.length;
    const pendingReceipts = this.orders.filter(o => o.hasReceipt && (o.status === 'Receipt Submitted' || o.paymentCode === 'cod_advance')).length;
    const advanceVerified = this.orders.filter(o => o.status === 'Advance Verified').length;
    const codCount = this.orders.filter(o => o.paymentCode === 'cod').length;
    const dispatchedCount = this.orders.filter(o => o.status === 'Dispatched').length;
    const deliveredCount = this.orders.filter(o => o.status === 'Delivered').length;

    if (this.totalRevenueEl) this.totalRevenueEl.textContent = 'Rs. ' + totalRev.toLocaleString();
    if (this.totalOrdersEl) this.totalOrdersEl.textContent = totalCount;
    if (this.pendingReceiptsEl) this.pendingReceiptsEl.textContent = pendingReceipts;
    if (this.dispatchedOrdersEl) this.dispatchedOrdersEl.textContent = (dispatchedCount + deliveredCount);

    // Update filter counts on pills
    const pillAll = document.querySelector('[data-filter="all"]');
    const pillReceipts = document.querySelector('[data-filter="receipts"]');
    const pillVerified = document.querySelector('[data-filter="verified"]');
    const pillCod = document.querySelector('[data-filter="cod"]');
    const pillDispatched = document.querySelector('[data-filter="dispatched"]');
    const pillDelivered = document.querySelector('[data-filter="delivered"]');

    if (pillAll) pillAll.innerHTML = `<i class="fa-solid fa-layer-group"></i> All Orders <span class="pill-count">${totalCount}</span>`;
    if (pillReceipts) pillReceipts.innerHTML = `<i class="fa-solid fa-receipt"></i> Receipts To Verify <span class="pill-count ${pendingReceipts > 0 ? 'badge-alert' : ''}">${pendingReceipts}</span>`;
    if (pillVerified) pillVerified.innerHTML = `<i class="fa-solid fa-circle-check"></i> Advance Verified <span class="pill-count">${advanceVerified}</span>`;
    if (pillCod) pillCod.innerHTML = `<i class="fa-solid fa-money-bill-wave"></i> Full COD <span class="pill-count">${codCount}</span>`;
    if (pillDispatched) pillDispatched.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Dispatched <span class="pill-count">${dispatchedCount}</span>`;
    if (pillDelivered) pillDelivered.innerHTML = `<i class="fa-solid fa-box-open"></i> Delivered <span class="pill-count">${deliveredCount}</span>`;
  }

  renderOrdersTable() {
    if (!this.ordersTbody) return;

    let filtered = this.orders.filter(order => {
      // Filter status
      if (this.activeFilter === 'receipts') {
        if (!order.hasReceipt || order.status === 'Advance Verified') return false;
      } else if (this.activeFilter === 'verified') {
        if (order.status !== 'Advance Verified') return false;
      } else if (this.activeFilter === 'cod') {
        if (order.paymentCode !== 'cod') return false;
      } else if (this.activeFilter === 'dispatched') {
        if (order.status !== 'Dispatched') return false;
      } else if (this.activeFilter === 'delivered') {
        if (order.status !== 'Delivered') return false;
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery;
        const refMatch = order.orderRef.toLowerCase().includes(q);
        const nameMatch = order.customer.fullName.toLowerCase().includes(q);
        const phoneMatch = order.customer.whatsapp.toLowerCase().includes(q);
        const cityMatch = order.customer.city.toLowerCase().includes(q);
        if (!refMatch && !nameMatch && !phoneMatch && !cityMatch) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      this.ordersTbody.innerHTML = `
        <tr>
          <td colspan="7" class="table-empty-state">
            <div class="empty-icon-wrap">
              <i class="fa-solid fa-folder-open"></i>
            </div>
            <h4>NO MATCHING ORDERS</h4>
            <p>No customer orders match the selected filters or query.</p>
          </td>
        </tr>
      `;
      return;
    }

    this.ordersTbody.innerHTML = filtered.map(order => {
      const dateObj = new Date(order.date);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Initials for Avatar
      const initials = (order.customer.fullName || 'User')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const itemsMarkup = (order.items || []).map(it => `
        <div class="order-item-chip">
          <span class="item-chip-qty">${it.quantity}x</span>
          <span class="item-chip-name">${it.name}</span>
        </div>
      `).join('');

      const hasSS = !!order.receiptDataUrl;

      // Status badge style
      let statusClass = 'status-pending';
      if (order.status === 'Advance Verified') statusClass = 'status-verified';
      else if (order.status === 'Dispatched') statusClass = 'status-dispatched';
      else if (order.status === 'Delivered') statusClass = 'status-delivered';
      else if (order.status === 'Cancelled') statusClass = 'status-cancelled';

      return `
        <tr class="order-row ${hasSS && order.status === 'Receipt Submitted' ? 'row-highlight-review' : ''}">
          <!-- 1. Order ID & Date -->
          <td>
            <div class="order-ref-badge">
              <i class="fa-solid fa-hashtag"></i>${order.orderRef}
            </div>
            <div class="order-time-meta">
              <span>${dateStr}</span> • <span>${timeStr}</span>
            </div>
            <div class="order-payment-pill ${order.paymentCode === 'cod_advance' ? 'pill-advance' : ''}">
              ${order.paymentMethod || 'Cash On Delivery'}
            </div>
          </td>

          <!-- 2. Customer Info -->
          <td>
            <div class="customer-info-cell">
              <div class="customer-avatar">${initials}</div>
              <div class="customer-text-meta">
                <div class="customer-name-heading">${order.customer.fullName}</div>
                <a href="https://wa.me/92${order.customer.whatsapp.replace(/^0+/, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(order.customer.fullName)}!%20This%20is%20ShopXzetio%20regarding%20your%20order%20%23${order.orderRef}." target="_blank" class="customer-wa-pill">
                  <i class="fa-brands fa-whatsapp"></i> ${order.customer.whatsapp}
                </a>
                <div class="customer-loc-pill" title="${order.customer.address}, ${order.customer.city}">
                  <i class="fa-solid fa-location-dot"></i> ${order.customer.city}
                </div>
              </div>
            </div>
          </td>

          <!-- 3. Items -->
          <td>
            <div class="order-items-wrapper">
              ${itemsMarkup}
            </div>
          </td>

          <!-- 4. Financials -->
          <td>
            <div class="order-price-display">
              Rs. ${(order.total || 0).toLocaleString()}
            </div>
            ${order.paymentCode === 'cod_advance' ? `
              <div class="finance-breakdown-row">
                <span class="badge-adv-paid">✓ Adv: Rs. 500</span>
                <span class="badge-cod-due">COD: Rs. ${(order.total - 500).toLocaleString()}</span>
              </div>
            ` : ''}
          </td>

          <!-- 5. Screenshot (SS) Column -->
          <td>
            ${hasSS ? `
              <button class="ss-preview-card ${order.status === 'Receipt Submitted' ? 'glow-amber' : 'glow-cyan'}" onclick="window.shopAdmin.openScreenshot('${order.orderRef}')">
                <div class="ss-thumb-wrapper">
                  <img src="${order.receiptDataUrl}" class="ss-thumb-img" alt="SS">
                  <div class="ss-hover-lens"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                </div>
                <span class="ss-btn-label">View Receipt</span>
              </button>
            ` : `
              <div class="no-ss-pill">
                <i class="fa-solid fa-money-bill-1"></i> No Advance
              </div>
            `}
          </td>

          <!-- 6. Status & Tracking -->
          <td>
            <div class="status-selector-wrap">
              <select class="status-select-enhanced ${statusClass}" onchange="window.shopAdmin.updateStatus('${order.orderRef}', this.value)">
                <option value="Receipt Submitted" ${order.status === 'Receipt Submitted' ? 'selected' : ''}>🟡 Review Receipt</option>
                <option value="Advance Verified" ${order.status === 'Advance Verified' ? 'selected' : ''}>🟢 Advance Verified</option>
                <option value="Confirmed (COD)" ${order.status === 'Confirmed (COD)' ? 'selected' : ''}>⚪ Confirmed (COD)</option>
                <option value="Dispatched" ${order.status === 'Dispatched' ? 'selected' : ''}>🔵 Dispatched</option>
                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>🟣 Delivered</option>
                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
              </select>

              <div class="tracking-input-group">
                <i class="fa-solid fa-truck-fast"></i>
                <input type="text" value="${order.trackingNumber || ''}" placeholder="Tracking ID..." 
                  onchange="window.shopAdmin.updateTracking('${order.orderRef}', this.value)"
                  class="tracking-code-field">
              </div>
            </div>
          </td>

          <!-- 7. Actions -->
          <td>
            <div class="table-actions-cell">
              <button class="btn-action-chat" 
                onclick="window.shopAdmin.whatsappCustomer('${order.orderRef}')" title="Dispatch WhatsApp Notification">
                <i class="fa-brands fa-whatsapp"></i>
                <span>Chat</span>
              </button>
              <button class="btn-action-delete" 
                onclick="window.shopAdmin.deleteOrder('${order.orderRef}')" title="Archive / Delete Order">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  showCyberToast(msg, icon = 'fa-circle-check', type = 'success') {
    const existing = document.querySelector('.cyber-admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cyber-admin-toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  showCyberConfirm(title, desc, onConfirm) {
    const existing = document.querySelector('.cyber-confirm-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'cyber-confirm-backdrop';
    backdrop.innerHTML = `
      <div class="cyber-confirm-card">
        <div class="confirm-icon-box">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="confirm-title">${title}</div>
        <div class="confirm-desc">${desc}</div>
        <div class="confirm-actions">
          <button class="confirm-btn-cancel" id="cyberConfirmCancel">CANCEL</button>
          <button class="confirm-btn-delete" id="cyberConfirmOk">DELETE PERMANENTLY</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    document.getElementById('cyberConfirmCancel').onclick = () => backdrop.remove();
    document.getElementById('cyberConfirmOk').onclick = () => {
      backdrop.remove();
      if (typeof onConfirm === 'function') onConfirm();
    };
    backdrop.onclick = (e) => {
      if (e.target === backdrop) backdrop.remove();
    };
  }

  openScreenshot(orderRef) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (!order || !order.receiptDataUrl) {
      this.showCyberToast('No payment receipt uploaded for this order.', 'fa-image', 'info');
      return;
    }

    this.activeModalOrder = order;
    this.currentZoom = 1;

    if (this.lightboxImg) {
      this.lightboxImg.src = order.receiptDataUrl;
      this.lightboxImg.style.transform = 'scale(1)';
    }

    if (this.lightboxTitle) {
      this.lightboxTitle.textContent = `PAYMENT SCREENSHOT #${order.orderRef}`;
    }

    if (this.lightboxMeta) {
      this.lightboxMeta.innerHTML = `
        <div><strong>Customer:</strong> ${order.customer.fullName} (${order.customer.whatsapp})</div>
        <div><strong>Total:</strong> Rs. ${order.total.toLocaleString()} | <strong>Mode:</strong> ${order.paymentMethod}</div>
        <div style="margin-top: 4px;"><strong>Status:</strong> <span style="color: var(--admin-cyan);">${order.status}</span></div>
      `;
    }

    if (this.lightboxVerifyBtn) {
      this.lightboxVerifyBtn.onclick = () => {
        this.updateStatus(order.orderRef, 'Advance Verified');
        this.closeLightbox();
        this.showCyberToast(`Order #${order.orderRef} marked Advance Verified!`, 'fa-circle-check', 'success');
      };
    }

    if (this.lightboxDownloadBtn) {
      this.lightboxDownloadBtn.onclick = () => {
        this.downloadScreenshot(order);
      };
    }

    if (this.lightboxWABtn) {
      this.lightboxWABtn.onclick = () => {
        this.whatsappCustomer(order.orderRef);
      };
    }

    if (this.lightboxModal) {
      this.lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    if (this.lightboxModal) {
      this.lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  downloadScreenshot(order) {
    const a = document.createElement('a');
    a.href = order.receiptDataUrl;
    a.download = `RECEIPT_${order.orderRef}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.showCyberToast(`Receipt #${order.orderRef} saved to device`, 'fa-download', 'info');
  }

  updateStatus(orderRef, newStatus) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (order) {
      order.status = newStatus;
      this.saveOrders();
      this.showCyberToast(`Order #${orderRef} status: ${newStatus}`, 'fa-arrows-rotate', 'info');
    }
  }

  updateTracking(orderRef, trackingCode) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (order) {
      order.trackingNumber = trackingCode.trim();
      this.saveOrders();
      this.showCyberToast(`Tracking ID saved for #${orderRef}`, 'fa-truck-fast', 'info');
    }
  }

  whatsappCustomer(orderRef) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (!order) return;

    let phone = order.customer.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '92' + phone.substring(1);
    }

    let text = `Salam ${order.customer.fullName}!\n`;
    text += `This is ShopXzetio Pakistan regarding your order #${order.orderRef}.\n\n`;
    text += `Current Order Status: *${order.status}*\n`;
    if (order.trackingNumber) {
      text += `Tracking Number: *${order.trackingNumber}* (${order.courier})\n`;
    }
    text += `Total Amount: Rs. ${order.total.toLocaleString()}\n\n`;
    text += `If you have any questions, feel free to reply directly to this message. Thank you for shopping with ShopXzetio!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  deleteOrder(orderRef) {
    this.showCyberConfirm(
      'DELETE ORDER RECORD',
      `Are you sure you want to permanently delete order #${orderRef}? This action cannot be reversed.`,
      () => {
        this.orders = this.orders.filter(o => o.orderRef !== orderRef);
        this.saveOrders();
        this.showCyberToast(`Order #${orderRef} permanently removed.`, 'fa-trash-can', 'danger');
      }
    );
  }

  addManualTestOrder() {
    const randomId = 'SXZ-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      orderRef: randomId,
      date: new Date().toISOString(),
      customer: {
        fullName: 'Daniyal Pro Gamer',
        email: 'daniyal@gamer.pk',
        whatsapp: '03348590229',
        address: 'Sector F-7/2, Islamabad',
        city: 'Islamabad',
        notes: 'Manual test booking created in admin dashboard.'
      },
      paymentMethod: 'COD + Rs. 500 Advance',
      paymentCode: 'cod_advance',
      items: [
        { name: 'PIVA B3 Extreme Semiconductor Cooler', price: 4350, quantity: 1 }
      ],
      subtotal: 4350,
      shipping: 250,
      total: 4600,
      hasReceipt: true,
      receiptDataUrl: 'assets/brand/LOGO.png',
      status: 'Receipt Submitted',
      trackingNumber: '',
      courier: 'TCS Pakistan'
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.showCyberToast(`Order #${randomId} added to pipeline!`, 'fa-circle-check', 'success');
  }

  exportToCSV() {
    if (this.orders.length === 0) {
      this.showCyberToast('No orders available to export.', 'fa-file-excel', 'info');
      return;
    }

    let csv = 'Order Ref,Date,Customer Name,Phone,Email,City,Address,Total (PKR),Payment Method,Status,Has Receipt,Tracking Number\n';
    this.orders.forEach(o => {
      const cleanAddress = (o.customer.address || '').replace(/"/g, '""');
      csv += `"${o.orderRef}","${o.date}","${o.customer.fullName}","${o.customer.whatsapp}","${o.customer.email || ''}","${o.customer.city}","${cleanAddress}",${o.total},"${o.paymentMethod}","${o.status}","${o.hasReceipt ? 'YES' : 'NO'}","${o.trackingNumber || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SHOPXZETIO_ORDERS_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showCyberToast('Order ledger exported to CSV successfully!', 'fa-file-csv', 'success');
  }
}

// Instantiate global admin
document.addEventListener('DOMContentLoaded', () => {
  window.shopAdmin = new ShopAdmin();
});
