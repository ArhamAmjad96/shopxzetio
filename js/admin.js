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
    const pendingReceipts = this.orders.filter(o => o.hasReceipt && o.status === 'Receipt Submitted').length;
    const dispatchedCount = this.orders.filter(o => o.status === 'Dispatched' || o.status === 'Delivered').length;

    if (this.totalRevenueEl) this.totalRevenueEl.textContent = 'Rs. ' + totalRev.toLocaleString();
    if (this.totalOrdersEl) this.totalOrdersEl.textContent = totalCount;
    if (this.pendingReceiptsEl) this.pendingReceiptsEl.textContent = pendingReceipts;
    if (this.dispatchedOrdersEl) this.dispatchedOrdersEl.textContent = dispatchedCount;
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
          <td colspan="7" style="text-align: center; padding: 50px 20px; color: var(--admin-text-dim);">
            <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: var(--admin-border); margin-bottom: 12px; display: block;"></i>
            <h4 style="color: #fff; margin-bottom: 6px;">NO ORDERS FOUND</h4>
            <p style="font-size: 0.85rem;">No customer orders match the selected filters or query.</p>
          </td>
        </tr>
      `;
      return;
    }

    this.ordersTbody.innerHTML = filtered.map(order => {
      const dateStr = new Date(order.date).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const itemsSummary = (order.items || []).map(it => `${it.quantity}x ${it.name}`).join('<br>');
      const hasSS = !!order.receiptDataUrl;

      // Status class
      let statusColor = '#CBD5E1';
      if (order.status === 'Receipt Submitted') statusColor = 'var(--admin-amber)';
      else if (order.status === 'Advance Verified') statusColor = 'var(--admin-green)';
      else if (order.status === 'Dispatched') statusColor = 'var(--admin-blue)';
      else if (order.status === 'Delivered') statusColor = '#00FF9D';
      else if (order.status === 'Cancelled') statusColor = 'var(--admin-red)';

      return `
        <tr>
          <!-- 1. Order ID & Date -->
          <td>
            <span class="order-ref-cell">#${order.orderRef}</span>
            <span class="order-date-sub">${dateStr}</span>
            <span style="display: inline-block; font-size: 0.7rem; color: var(--admin-cyan); margin-top: 4px;">
              ${order.paymentMethod}
            </span>
          </td>

          <!-- 2. Customer Info -->
          <td>
            <div class="customer-name">${order.customer.fullName}</div>
            <a href="https://wa.me/92${order.customer.whatsapp.replace(/^0+/, '')}" target="_blank" class="customer-phone-link">
              <i class="fa-brands fa-whatsapp"></i> ${order.customer.whatsapp}
            </a>
            <div class="customer-address-sub" title="${order.customer.address}, ${order.customer.city}">
              <i class="fa-solid fa-location-dot"></i> ${order.customer.city}: ${order.customer.address}
            </div>
          </td>

          <!-- 3. Items -->
          <td style="font-size: 0.8rem; line-height: 1.4; color: var(--admin-text-soft);">
            ${itemsSummary}
          </td>

          <!-- 4. Financials -->
          <td>
            <div style="font-family: var(--admin-font-digital); font-size: 1.1rem; font-weight: 700; color: #fff;">
              Rs. ${(order.total || 0).toLocaleString()}
            </div>
            ${order.paymentCode === 'cod_advance' ? `
              <div style="font-size: 0.7rem; color: var(--admin-green);">Advance: Rs. 500</div>
              <div style="font-size: 0.7rem; color: var(--admin-cyan);">COD Bal: Rs. ${(order.total - 500).toLocaleString()}</div>
            ` : ''}
          </td>

          <!-- 5. Screenshot (SS) Column -->
          <td>
            ${hasSS ? `
              <button class="ss-badge-btn" onclick="window.shopAdmin.openScreenshot('${order.orderRef}')">
                <img src="${order.receiptDataUrl}" class="ss-thumb-img" alt="SS">
                <span>View SS</span>
              </button>
            ` : `
              <span class="no-ss-badge">No SS (COD)</span>
            `}
          </td>

          <!-- 6. Status & Tracking -->
          <td>
            <select class="status-select" onchange="window.shopAdmin.updateStatus('${order.orderRef}', this.value)" style="border-color: ${statusColor}; color: ${statusColor};">
              <option value="Receipt Submitted" ${order.status === 'Receipt Submitted' ? 'selected' : ''}>Receipt Submitted</option>
              <option value="Advance Verified" ${order.status === 'Advance Verified' ? 'selected' : ''}>Advance Verified</option>
              <option value="Confirmed (COD)" ${order.status === 'Confirmed (COD)' ? 'selected' : ''}>Confirmed (COD)</option>
              <option value="Dispatched" ${order.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
            <div style="margin-top: 6px;">
              <input type="text" value="${order.trackingNumber || ''}" placeholder="Tracking #" 
                onchange="window.shopAdmin.updateTracking('${order.orderRef}', this.value)"
                style="width: 110px; height: 26px; font-size: 0.75rem; background: rgba(0,0,0,0.5); border: 1px solid var(--admin-border); border-radius: 3px; color: #fff; padding: 0 6px;">
            </div>
          </td>

          <!-- 7. Actions -->
          <td style="white-space: nowrap;">
            <button class="admin-btn admin-btn-secondary" style="height: 32px; padding: 0 10px; font-size: 0.75rem;" 
              onclick="window.shopAdmin.whatsappCustomer('${order.orderRef}')" title="Message Customer on WhatsApp">
              <i class="fa-brands fa-whatsapp" style="color: var(--admin-green);"></i> Chat
            </button>
            <button class="admin-btn admin-btn-danger" style="height: 32px; width: 32px; padding: 0; justify-content: center; margin-left: 6px;" 
              onclick="window.shopAdmin.deleteOrder('${order.orderRef}')" title="Delete Order">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  openScreenshot(orderRef) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (!order || !order.receiptDataUrl) {
      alert('No screenshot found for this order.');
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
  }

  updateStatus(orderRef, newStatus) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (order) {
      order.status = newStatus;
      this.saveOrders();
    }
  }

  updateTracking(orderRef, trackingCode) {
    const order = this.orders.find(o => o.orderRef === orderRef);
    if (order) {
      order.trackingNumber = trackingCode.trim();
      this.saveOrders();
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
    if (confirm(`Are you sure you want to delete order #${orderRef}?`)) {
      this.orders = this.orders.filter(o => o.orderRef !== orderRef);
      this.saveOrders();
    }
  }

  addManualTestOrder() {
    const randomId = 'SXZ-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      orderRef: randomId,
      date: new Date().toISOString(),
      customer: {
        fullName: 'Test Customer (Manual)',
        email: 'test@gamer.pk',
        whatsapp: '03348590229',
        address: 'Sector F-7/2, Islamabad',
        city: 'Islamabad',
        notes: 'Manual phone order entered by admin.'
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
    alert(`Order #${randomId} added to dashboard!`);
  }

  exportToCSV() {
    if (this.orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    let csv = 'Order Ref,Date,Customer Name,Phone,Email,City,Address,Total (PKR),Payment Method,Status,Has Receipt,Tracking Number\n';
    this.orders.forEach(o => {
      const cleanAddress = (o.customer.address || '').replace(/"/g, '""');
      const cleanNotes = (o.customer.notes || '').replace(/"/g, '""');
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
  }
}

// Instantiate global admin
document.addEventListener('DOMContentLoaded', () => {
  window.shopAdmin = new ShopAdmin();
});
