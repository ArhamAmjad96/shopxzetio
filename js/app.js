/**
 * ShopXzetio Esports Main Application Controller
 * Dynamic Catalog, Filtering, Search, Product Detail Modal, Reels Player & Slider
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initHeader();
  initPartnershipSlider();
  initCatalog();
  initProductDetailModal();
  initReelsPlayer();
}

/* ==========================================================================
   Header & Navigation
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileClose = document.getElementById('mobileNavClose');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  // Close mobile drawer when clicking a link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  });
}

/* ==========================================================================
   Below-Hero Esports Partnerships Slider
   ========================================================================== */
function initPartnershipSlider() {
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  if (slides.length === 0) return;

  let currentSlide = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });
  }

  function startTimer() {
    autoTimer = setInterval(nextSlide, 4500);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    startTimer();
  }

  startTimer();
}

/* ==========================================================================
   Product Catalog, Filtering & Instant Search
   ========================================================================== */
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';

function initCatalog() {
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const sortSelect = document.getElementById('sortSelect');
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCountDisplay = document.getElementById('catalogCountDisplay');

  function render() {
    const products = window.SHOPXZETIO_PRODUCTS || [];
    let filtered = products.filter(product => {
      // Category filter
      if (activeCategory !== 'all') {
        const matchesCategory = product.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSubCategory = product.subCategory && product.subCategory.toLowerCase() === activeCategory.toLowerCase();
        if (!matchesCategory && !matchesSubCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(q);
        const catMatch = product.category.toLowerCase().includes(q);
        const subCatMatch = product.subCategory && product.subCategory.toLowerCase().includes(q);
        const descMatch = product.description && product.description.toLowerCase().includes(q);
        const tagsMatch = product.tags && product.tags.some(t => t.toLowerCase().includes(q));
        if (!nameMatch && !catMatch && !subCatMatch && !descMatch && !tagsMatch) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (productCountDisplay) {
      productCountDisplay.textContent = `Showing ${filtered.length} of ${products.length} Products`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(8,18,32,0.5); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <i class="fa-solid fa-crosshairs" style="font-size: 3rem; color: var(--border-cyan); margin-bottom: 16px;"></i>
          <h3 style="font-family: var(--font-display); color: #fff; margin-bottom: 8px;">NO GEAR MATCHED YOUR SEARCH</h3>
          <p style="color: var(--text-dim); max-width: 440px; margin: 0 auto 20px auto; font-size: 0.9rem;">Try adjusting your keywords or clearing the category filter to explore the full arsenal.</p>
          <button id="resetSearchFilterBtn" class="btn-cyber-primary" style="height: 42px; font-size: 0.85rem;">RESET FILTERS</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetSearchFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          filterPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
          render();
        });
      }
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const isHot = product.badge && (product.badge.includes('PRO') || product.badge.includes('ULTRA') || product.badge.includes('LEGENDARY'));
      const badgeClass = isHot ? 'card-badge hot' : 'card-badge';
      const mainImg = product.mainImage || (product.images && product.images[0]) || 'assets/brand/LOGO.png';

      return `
        <article class="product-card" data-product-id="${product.id}">
          ${product.badge ? `<div class="${badgeClass}">${product.badge}</div>` : ''}
          <div class="card-image-area" onclick="window.openProductDetail('${product.id}')">
            <img src="${mainImg}" alt="${product.name}" class="card-product-img" loading="lazy" onerror="this.src='assets/brand/LOGO.png'">
            <div class="card-quick-view-overlay">
              <button class="btn-quick-view" type="button">
                <i class="fa-solid fa-eye"></i> QUICK INSPECT
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="card-category-row">
              <span class="card-category">${product.subCategory || product.category}</span>
              <span class="card-rating"><i class="fa-solid fa-star"></i> ${product.rating || '5.0'}</span>
            </div>
            <h3 class="card-product-title" onclick="window.openProductDetail('${product.id}')">
              ${product.name}
            </h3>
            <div class="card-price-row">
              <div class="price-current">
                <span>Rs.</span> ${(product.price).toLocaleString()}
              </div>
              ${product.originalPrice ? `<div class="price-original">Rs. ${product.originalPrice.toLocaleString()}</div>` : ''}
            </div>
            <div class="card-actions-row">
              <button class="btn-card-cart" onclick="window.shopCart.addItem('${product.id}', 1)" title="Add to Cart">
                <i class="fa-solid fa-plus"></i> EQUIP GEAR
              </button>
              <button class="btn-card-whatsapp" onclick="window.orderSingleViaWhatsApp('${product.id}')" title="Buy via WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Filter Pill clicks
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      render();
    });
  });

  // Search input typing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      render();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      searchClearBtn.style.display = 'none';
      render();
    });
  }

  // Sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      render();
    });
  }

  render();
}

/* ==========================================================================
   Product Detail Modal
   ========================================================================== */
function initProductDetailModal() {
  const modal = document.getElementById('productDetailModal');
  const closeBtn = document.getElementById('detailCloseBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  window.openProductDetail = function(productId) {
    const products = window.SHOPXZETIO_PRODUCTS || [];
    const product = products.find(p => p.id === productId);
    if (!product || !modal) return;

    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalOriginalPrice = document.getElementById('modalOriginalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalSpecsTable = document.getElementById('modalSpecsTable');
    const mainImg = document.getElementById('detailMainImg');
    const thumbTrack = document.getElementById('detailThumbTrack');
    const addCartBtn = document.getElementById('modalAddCartBtn');
    const buyWABtn = document.getElementById('modalBuyWABtn');

    if (modalCategory) modalCategory.textContent = product.subCategory || product.category;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalPrice) modalPrice.innerHTML = `<span>Rs.</span> ${(product.price).toLocaleString()}`;
    if (modalOriginalPrice) {
      if (product.originalPrice) {
        modalOriginalPrice.textContent = 'Rs. ' + product.originalPrice.toLocaleString();
        modalOriginalPrice.style.display = 'inline';
      } else {
        modalOriginalPrice.style.display = 'none';
      }
    }
    if (modalDescription) modalDescription.textContent = product.description;

    // Features
    if (modalFeatures) {
      modalFeatures.innerHTML = (product.features || []).map(f => `
        <li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>
      `).join('');
    }

    // Technical Specs
    if (modalSpecsTable) {
      const specEntries = Object.entries(product.specs || {});
      modalSpecsTable.innerHTML = specEntries.map(([k, v]) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 8px 12px; color: var(--text-dim); font-size: 0.8rem; text-transform: uppercase;">${k}</td>
          <td style="padding: 8px 12px; color: var(--text-white); font-weight: 600; font-size: 0.85rem;">${v}</td>
        </tr>
      `).join('');
    }

    // Images gallery
    const images = product.images && product.images.length > 0 ? product.images : [product.mainImage];
    if (mainImg) {
      mainImg.src = images[0];
      mainImg.alt = product.name;
    }

    if (thumbTrack) {
      thumbTrack.innerHTML = images.map((img, idx) => `
        <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchGalleryImage('${img}', this)">
          <img src="${img}" alt="${product.name} ${idx + 1}" loading="lazy">
        </div>
      `).join('');
    }

    // What's in the box
    const modalInTheBox = document.getElementById('modalInTheBox');
    if (modalInTheBox) {
      if (product.inTheBox && product.inTheBox.length > 0) {
        modalInTheBox.innerHTML = `
          <h4 style="font-family: var(--font-heading); font-size: 0.85rem; color: var(--cyan); text-transform: uppercase; letter-spacing: 1px; margin-top: 14px; margin-bottom: 8px;">
            WHAT'S IN THE BOX
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px;">
            ${product.inTheBox.map(item => `
              <span style="background: rgba(0, 240, 255, 0.06); border: 1px solid var(--border-subtle); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; color: var(--text-soft);">
                <i class="fa-solid fa-box-archive" style="color: var(--cyan); font-size: 0.75rem; margin-right: 4px;"></i> ${item}
              </span>
            `).join('')}
          </div>
        `;
        modalInTheBox.style.display = 'block';
      } else {
        modalInTheBox.style.display = 'none';
      }
    }

    // Modal Quantity Controls
    let modalSelectedQty = 1;
    const qtyDisplay = document.getElementById('modalQtyDisplay');
    const qtyMinus = document.getElementById('modalQtyMinus');
    const qtyPlus = document.getElementById('modalQtyPlus');

    if (qtyDisplay) qtyDisplay.textContent = '1';

    if (qtyMinus) {
      qtyMinus.onclick = () => {
        if (modalSelectedQty > 1) {
          modalSelectedQty--;
          if (qtyDisplay) qtyDisplay.textContent = modalSelectedQty;
        }
      };
    }

    if (qtyPlus) {
      qtyPlus.onclick = () => {
        modalSelectedQty++;
        if (qtyDisplay) qtyDisplay.textContent = modalSelectedQty;
      };
    }

    // Modal Actions
    if (addCartBtn) {
      addCartBtn.onclick = () => {
        window.shopCart.addItem(product.id, modalSelectedQty);
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };
    }

    if (buyWABtn) {
      buyWABtn.onclick = () => {
        window.orderSingleViaWhatsApp(product.id, modalSelectedQty);
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.switchGalleryImage = function(src, thumbEl) {
    const mainImg = document.getElementById('detailMainImg');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
  };
}

/* ==========================================================================
   Reels & Video Player Modal
   ========================================================================== */
function initReelsPlayer() {
  const videoModal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoModalPlayer');
  const videoCloseBtn = document.getElementById('videoModalClose');
  const videoTitle = document.getElementById('videoModalTitle');

  // Video hover preview (silent looping clip on hover)
  document.querySelectorAll('.reel-card').forEach(card => {
    const previewVideo = card.querySelector('video');
    if (previewVideo) {
      card.addEventListener('mouseenter', () => {
        previewVideo.muted = true;
        previewVideo.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        previewVideo.pause();
        previewVideo.currentTime = 0;
      });
    }
  });

  const reelsData = {
    crypto: {
      src: 'assets/reels/CRYPTO.mp4',
      title: 'i8 Crypto - Pro Player Gear Performance Review'
    },
    falak: {
      src: 'assets/reels/FALAK.mp4',
      title: 'i8 Falak - Tournament Equipment Verification'
    },
    packaging: {
      src: 'assets/reels/PACAKGING.mp4',
      title: 'Official ShopXzetio Secure Packaging & Dispatch'
    },
    why_gear: {
      src: 'assets/reels/WHY GOOD EQIUPMENT.mp4',
      title: 'Why Tournament Grade Equipment Matters in Competitive Esports'
    }
  };

  window.openReel = function(key) {
    const data = reelsData[key];
    if (!data || !videoModal || !videoPlayer) return;

    videoPlayer.src = data.src;
    if (videoTitle) videoTitle.textContent = data.title;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    videoPlayer.play().catch(e => console.log('Autoplay handled', e));
  };

  function closeVideo() {
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
      videoPlayer.src = '';
    }
    if (videoModal) {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', closeVideo);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideo();
    });
  }
}

/* ==========================================================================
   Global Helper: Order Single Product via WhatsApp
   ========================================================================== */
window.orderSingleViaWhatsApp = function(productId, qty = 1) {
  const products = window.SHOPXZETIO_PRODUCTS || [];
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const quantity = Math.max(1, qty || 1);
  const totalPrice = product.price * quantity;

  let text = `*NEW ORDER INQUIRY - SHOPXZETIO PAKISTAN*\n` +
             `--------------------------------------\n` +
             `*Product:* ${product.name}\n` +
             `*Quantity:* ${quantity}\n` +
             `*Unit Price:* Rs. ${product.price.toLocaleString()}\n` +
             `*Total Amount:* Rs. ${totalPrice.toLocaleString()}\n` +
             `*Category:* ${product.category} (${product.subCategory || ''})\n` +
             `--------------------------------------\n` +
             `Hello! I would like to order this item. Please confirm stock availability and courier delivery to my city.`;

  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/923348590229?text=${encoded}`, '_blank');
};
