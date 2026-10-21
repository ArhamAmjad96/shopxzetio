import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../data/products';
import { handleImageError, normalizeAssetUrl } from '../lib/assets';

const blankProduct = {
  id: null, legacy_id: '', slug: '', name: '', short_name: '', price: '', original_price: '',
  category: '', sub_category: '', badge: '', stock_quantity: '', description: '', main_image: '',
  featured: false, is_hero: false, active: true, images: [], features: [], specs: {}, in_the_box: [],
};

const PRODUCT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_PRODUCT_IMAGES = 8;
const MAX_PRODUCT_IMAGE_SIZE = 15 * 1024 * 1024;
const PRODUCT_IMAGE_MAX_DIMENSION = 1600;
const PRODUCT_IMAGE_QUALITY = 0.86;

async function optimizeProductImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, PRODUCT_IMAGE_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d', { alpha: true });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', PRODUCT_IMAGE_QUALITY));
    if (!blob || (scale === 1 && blob.size >= file.size)) return { file, saved: 0 };
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '-');
    return {
      file: new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() }),
      saved: Math.max(0, file.size - blob.size),
    };
  } catch {
    return { file, saved: 0 };
  }
}

function staticProductPayload(product) {
  return {
    legacy_id: String(product.id), slug: String(product.id), folder: product.folder || null,
    name: product.name, short_name: product.shortName || null, price: Number(product.price),
    original_price: product.originalPrice ? Number(product.originalPrice) : null,
    category: product.category, sub_category: product.subCategory || null, badge: product.badge || null,
    featured: Boolean(product.featured), active: true, rating: product.rating || null,
    review_count: product.reviewCount || 0, description: product.description || null,
    features: product.features || [], specs: product.specs || {}, in_the_box: product.inTheBox || [],
    images: product.images || [], main_image: product.mainImage || product.images?.[0] || null,
  };
}

export const isProductHero = (p) => Boolean(p.is_hero || p.specs?.is_hero || p.badge === 'HERO_SPOTLIGHT');

export default function AdminProducts({ triggerToast }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [optimizingImages, setOptimizingImages] = useState(false);
  const [editor, setEditor] = useState(null);
  const [top3Selection, setTop3Selection] = useState(['', '', '']);

  const closeEditor = () => {
    (editor?.pending_images || []).forEach((item) => URL.revokeObjectURL(item.preview));
    setEditor(null);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    setProducts(data || []);
  };

  useEffect(() => { loadProducts(); }, []);

  // Initialize Top 3 selections based on database specs.top_order or localStorage
  useEffect(() => {
    if (!products || products.length === 0) return;

    const ordered = [null, null, null];
    products.forEach((p) => {
      const order = Number(p.specs?.top_order);
      if (order >= 1 && order <= 3) {
        ordered[order - 1] = String(p.id);
      }
    });

    let localSaved = [];
    try {
      localSaved = JSON.parse(localStorage.getItem('shopxzetio_top_3_products') || '[]');
    } catch {}

    const slot1 = ordered[0] || (localSaved[0] && products.some(p => String(p.id) === String(localSaved[0])) ? String(localSaved[0]) : (products.find(isProductHero)?.id ? String(products.find(isProductHero).id) : String(products[0]?.id || '')));
    const slot2 = ordered[1] || (localSaved[1] && products.some(p => String(p.id) === String(localSaved[1])) ? String(localSaved[1]) : String(products.find(p => String(p.id) !== slot1)?.id || ''));
    const slot3 = ordered[2] || (localSaved[2] && products.some(p => String(p.id) === String(localSaved[2])) ? String(localSaved[2]) : String(products.find(p => String(p.id) !== slot1 && String(p.id) !== slot2)?.id || ''));

    setTop3Selection([slot1, slot2, slot3]);
  }, [products]);

  const saveTop3Products = async () => {
    const [id1, id2, id3] = top3Selection;
    if (!id1 || !id2 || !id3) {
      return triggerToast('Please select all 3 spotlight products.', 'fa-triangle-exclamation', 'danger');
    }
    setBusy(true);
    try {
      // 1. Clear previous top_order and hero markers from products
      for (const p of products) {
        if (p.specs?.top_order || p.specs?.is_hero || p.is_hero) {
          const cleaned = { ...(p.specs || {}) };
          delete cleaned.top_order;
          delete cleaned.is_hero;
          await supabase.from('products').update({ specs: cleaned, is_hero: false }).eq('id', p.id);
        }
      }

      // 2. Assign top_order: 1, 2, 3
      const selIds = [id1, id2, id3];
      for (let i = 0; i < selIds.length; i++) {
        const prod = products.find(p => String(p.id) === String(selIds[i]));
        if (prod) {
          const nextSpecs = { ...(prod.specs || {}), top_order: i + 1, ...(i === 0 ? { is_hero: true } : {}) };
          await supabase.from('products').update({
            specs: nextSpecs,
            is_hero: i === 0,
            active: true
          }).eq('id', prod.id);
        }
      }

      // 3. Save to localStorage for instant client rendering
      try {
        localStorage.setItem('shopxzetio_top_3_products', JSON.stringify([id1, id2, id3]));
      } catch {}

      await loadProducts();
      window.dispatchEvent(new CustomEvent('shopxzetio:catalog-updated'));
      triggerToast('★ Top 3 Frontpage products updated successfully!', 'fa-circle-check', 'success');
    } catch (err) {
      triggerToast(err.message || 'Could not save Top 3 products.', 'fa-triangle-exclamation', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const syncCatalog = async () => {
    setBusy(true);
    const { error } = await supabase.from('products')
      .upsert(PRODUCTS.map(staticProductPayload), { onConflict: 'legacy_id' });
    setBusy(false);
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    await loadProducts();
    window.dispatchEvent(new CustomEvent('shopxzetio:catalog-updated'));
    triggerToast(`${PRODUCTS.length} storefront products synchronized.`, 'fa-arrows-rotate');
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    let specs;
    try { specs = JSON.parse(editor.specs_text || '{}'); } catch { return triggerToast('Specifications must be valid JSON.', 'fa-triangle-exclamation', 'danger'); }

    setBusy(true);
    try {
      const uploaded = [];
      const folder = editor.legacy_id.trim().replace(/[^a-zA-Z0-9_-]/g, '-');
      for (const item of editor.pending_images || []) {
        const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const path = `products/${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, item.file, {
          cacheControl: '31536000', contentType: item.file.type, upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('product-images').getPublicUrl(path);
        uploaded.push({ localId: item.id, url: publicData.publicUrl });
      }

      const imageUrls = [...(editor.existing_images || []), ...uploaded.map((item) => item.url)];
      const uploadedCover = uploaded.find((item) => `local:${item.localId}` === editor.main_choice)?.url;
      const mainImage = uploadedCover || (imageUrls.includes(editor.main_choice) ? editor.main_choice : imageUrls[0]) || null;
      const orderedImages = mainImage ? [mainImage, ...imageUrls.filter((url) => url !== mainImage)] : imageUrls;
      const payload = {
        legacy_id: editor.legacy_id.trim(), slug: (editor.slug || editor.legacy_id).trim(),
        name: editor.name.trim(), short_name: editor.short_name?.trim() || null,
        price: Number(editor.price), original_price: editor.original_price ? Number(editor.original_price) : null,
        category: editor.category.trim(), sub_category: editor.sub_category?.trim() || null,
        badge: editor.badge?.trim() || null, stock_quantity: editor.stock_quantity === '' ? null : Number(editor.stock_quantity),
        description: editor.description?.trim() || null, main_image: mainImage,
        images: orderedImages,
        features: (editor.features_text || '').split('\n').map((value) => value.trim()).filter(Boolean),
        specs, in_the_box: editor.in_the_box || [], active: Boolean(editor.active),
        featured: Boolean(editor.featured),
      };
      const operation = editor.id
        ? supabase.from('products').update(payload).eq('id', editor.id)
        : supabase.from('products').insert(payload);
      const { error } = await operation;
      if (error) throw error;
      const wasEditing = Boolean(editor.id);
      closeEditor();
      await loadProducts();
      window.dispatchEvent(new CustomEvent('shopxzetio:catalog-updated'));
      triggerToast(wasEditing ? 'Product updated.' : 'Product added.');
    } catch (error) {
      triggerToast(error.message || 'Product could not be saved.', 'fa-triangle-exclamation', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const queueImages = async (files) => {
    const currentCount = (editor.existing_images?.length || 0) + (editor.pending_images?.length || 0);
    const accepted = Array.from(files || []).filter((file) => {
      if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
        triggerToast(`${file.name}: use JPG, PNG, WebP or AVIF.`, 'fa-triangle-exclamation', 'danger');
        return false;
      }
      if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
        triggerToast(`${file.name}: maximum source size is 15 MB.`, 'fa-triangle-exclamation', 'danger');
        return false;
      }
      return true;
    }).slice(0, Math.max(0, MAX_PRODUCT_IMAGES - currentCount));
    if (!accepted.length) return;
    setOptimizingImages(true);
    try {
      const prepared = await Promise.all(accepted.map(optimizeProductImage));
      const newItems = prepared.map(({ file }) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }));
      setEditor((current) => {
        if (!current) {
          newItems.forEach((item) => URL.revokeObjectURL(item.preview));
          return current;
        }
        return {
          ...current,
          pending_images: [...(current.pending_images || []), ...newItems],
          main_choice: current.main_choice || `local:${newItems[0].id}`,
        };
      });
    } finally {
      setOptimizingImages(false);
    }
  };

  const removeImage = (type, target) => {
    setEditor((current) => {
      if (!current) return current;
      const existingImages = type === 'existing'
        ? current.existing_images.filter((url) => url !== target)
        : current.existing_images;
      const pendingImages = type === 'pending'
        ? current.pending_images.filter((item) => {
          if (item.id === target) {
            URL.revokeObjectURL(item.preview);
            return false;
          }
          return true;
        })
        : current.pending_images;
      const remainingChoices = [...existingImages, ...pendingImages.map((item) => `local:${item.id}`)];
      const nextChoice = remainingChoices.includes(current.main_choice)
        ? current.main_choice
        : remainingChoices[0] || '';
      return { ...current, existing_images: existingImages, pending_images: pendingImages, main_choice: nextChoice };
    });
  };

  const addExternalUrl = () => {
    const url = editor.external_url?.trim();
    if (!url) return;
    if ((editor.existing_images.length + editor.pending_images.length) >= MAX_PRODUCT_IMAGES) return triggerToast(`Maximum ${MAX_PRODUCT_IMAGES} images per product.`, 'fa-triangle-exclamation', 'danger');
    setEditor((current) => ({ ...current, existing_images: [...current.existing_images, url], external_url: '', main_choice: current.main_choice || url }));
  };

  const toggleActive = async (product) => {
    const { error } = await supabase.from('products').update({ active: !product.active }).eq('id', product.id);
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    await loadProducts();
    window.dispatchEvent(new CustomEvent('shopxzetio:catalog-updated'));
    triggerToast(product.active ? 'Product archived.' : 'Product restored.', 'fa-box-archive', 'info');
  };

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return products.filter((product) => !needle || [product.name, product.category, product.legacy_id]
      .some((value) => String(value || '').toLowerCase().includes(needle)));
  }, [products, query]);

  const edit = (product) => setEditor({
    ...product,
    existing_images: Array.from(new Set([product.main_image, ...(product.images || [])].filter(Boolean))),
    pending_images: [],
    main_choice: product.main_image || product.images?.[0] || '',
    external_url: '',
    features_text: (product.features || []).join('\n'),
    specs_text: JSON.stringify(product.specs || {}, null, 2),
  });

  return (
    <section className="admin-products-panel">
      <div className="admin-products-head">
        <div>
          <p className="auth-kicker">// CATALOG CONTROL</p>
          <h2>PRODUCT MANAGEMENT</h2>
          <span>{products.length} database products · {products.filter((p) => p.active).length} visible on store</span>
        </div>
        <div className="admin-products-actions">
          <button className="admin-btn admin-btn-secondary" onClick={syncCatalog} disabled={busy}>
            <i className="fa-solid fa-rotate"/> Sync Existing Catalog
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => edit(blankProduct)}>
            <i className="fa-solid fa-plus"/> Add Product
          </button>
        </div>
      </div>

      {/* Clean Dedicated Top 3 Spotlight Products Control */}
      {products.length > 0 && (
        <div className="admin-showcase-bar">
          <div className="admin-showcase-header">
            <div>
              <span className="admin-showcase-badge"><i className="fa-solid fa-crown"/> FRONTPAGE TOP 3 SPOTLIGHT</span>
              <h3 style={{ margin: '6px 0 2px', fontSize: '18px', color: '#fff' }}>Homepage Rotating Products</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Select the 3 products to display on the storefront hero section. They will automatically cycle every 6 seconds.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={saveTop3Products}
              disabled={busy}
              style={{ alignSelf: 'flex-start' }}
            >
              <i className="fa-solid fa-floppy-disk"/> Save Top 3 Products
            </button>
          </div>

          <div className="admin-top3-grid">
            {[0, 1, 2].map((slotIdx) => {
              const selectedId = top3Selection[slotIdx];
              const selectedProduct = products.find((p) => String(p.id) === String(selectedId));
              return (
                <div key={slotIdx} className="admin-top3-card">
                  <div className="admin-top3-card-header">
                    <span className="admin-top3-slot-pill">
                      {slotIdx === 0 ? '👑 Product #1 (Primary Hero)' : `⚡ Product #${slotIdx + 1}`}
                    </span>
                  </div>

                  <select
                    className="admin-hero-select"
                    value={selectedId || ''}
                    onChange={(e) => {
                      const next = [...top3Selection];
                      next[slotIdx] = e.target.value;
                      setTop3Selection(next);
                    }}
                    disabled={busy}
                  >
                    <option value="" disabled>-- Select Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Rs. {Number(p.price).toLocaleString()})
                      </option>
                    ))}
                  </select>

                  {selectedProduct ? (
                    <div className="admin-top3-preview">
                      <img src={normalizeAssetUrl(selectedProduct.main_image)} alt="" onError={handleImageError}/>
                      <div className="admin-top3-preview-info">
                        <strong>{selectedProduct.name}</strong>
                        <span>Rs. {Number(selectedProduct.price).toLocaleString()} · {selectedProduct.category}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-top3-preview fallback">
                      <i className="fa-solid fa-box-open" style={{ color: '#64748b' }}/>
                      <span style={{ color: '#64748b' }}>No product chosen</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="admin-search-wrapper admin-products-search">
        <i className="fa-solid fa-magnifying-glass"/>
        <input
          className="admin-search-input"
          placeholder="Search products, categories or IDs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {products.length === 0 && (
        <div className="admin-catalog-empty">
          <i className="fa-solid fa-database"/>
          <h3>THE DATABASE CATALOG IS EMPTY</h3>
          <p>Use “Sync Existing Catalog” to copy the current ShopXzetio products without changing the storefront.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        <img src={normalizeAssetUrl(product.main_image)} alt="" onError={handleImageError}/>
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.legacy_id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {product.category}
                      <small className="admin-block-small">{product.sub_category}</small>
                    </td>
                    <td>
                      <strong>Rs. {Number(product.price).toLocaleString()}</strong>
                      {product.original_price && <small className="admin-block-small">Was Rs. {Number(product.original_price).toLocaleString()}</small>}
                    </td>
                    <td>
                      <span className={`stock-pill ${product.stock_quantity !== null && product.stock_quantity <= 5 ? 'low' : ''}`}>
                        {product.stock_quantity === null ? 'Unlimited' : product.stock_quantity}
                      </span>
                    </td>
                    <td>
                      <span className={`visibility-pill ${product.active ? 'live' : ''}`}>
                        {product.active ? 'Live' : 'Archived'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button type="button" className="btn-action-chat" onClick={() => edit(product)} title="Edit product details">
                          <i className="fa-solid fa-pen"/>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-action-delete"
                          title={product.active ? 'Archive product' : 'Restore product'}
                          onClick={() => toggleActive(product)}
                        >
                          <i className={`fa-solid ${product.active ? 'fa-box-archive' : 'fa-rotate-left'}`}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editor && (
        <div
          className="cyber-confirm-backdrop admin-modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains('cyber-confirm-backdrop') || e.target.classList.contains('admin-modal-backdrop')) {
              closeEditor();
            }
          }}
        >
          <form className="admin-product-editor admin-product-modal" onSubmit={saveProduct} onClick={(e) => e.stopPropagation()}>
            <div className="ss-lightbox-header admin-modal-head">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--admin-cyan)' }}></i>
                {editor.id ? `EDIT // ${editor.name}` : 'NEW PRODUCT'}
              </h3>
              <button type="button" className="admin-editor-close-btn admin-modal-close" onClick={closeEditor} aria-label="Close modal">
                <i className="fa-solid fa-xmark"/>
              </button>
            </div>
            <div className="admin-product-form-grid admin-product-grid">
              <label>ID<input required value={editor.legacy_id} onChange={(e) => setEditor({...editor, legacy_id:e.target.value})}/></label>
              <label>Slug<input value={editor.slug || ''} onChange={(e) => setEditor({...editor, slug:e.target.value})}/></label>
              <label className="admin-wide-field">Name<input required value={editor.name} onChange={(e) => setEditor({...editor, name:e.target.value})}/></label>
              <label>Short Name<input value={editor.short_name || ''} onChange={(e) => setEditor({...editor, short_name:e.target.value})}/></label>
              <label>Category<input required value={editor.category} onChange={(e) => setEditor({...editor, category:e.target.value})}/></label>
              <label>Subcategory<input value={editor.sub_category || ''} onChange={(e) => setEditor({...editor, sub_category:e.target.value})}/></label>
              <label>Price (PKR)<input required min="0" type="number" value={editor.price} onChange={(e) => setEditor({...editor, price:e.target.value})}/></label>
              <label>Original Price<input min="0" type="number" value={editor.original_price || ''} onChange={(e) => setEditor({...editor, original_price:e.target.value})}/></label>
              <label>Stock <small>(blank = unlimited)</small><input min="0" type="number" value={editor.stock_quantity ?? ''} onChange={(e) => setEditor({...editor, stock_quantity:e.target.value})}/></label>
              <label>Badge<input value={editor.badge || ''} onChange={(e) => setEditor({...editor, badge:e.target.value})}/></label>
              <div className="admin-wide-field product-image-manager">
                <div className="product-image-manager-head">
                  <div><strong>PRODUCT IMAGES</strong><small>Upload up to {MAX_PRODUCT_IMAGES} images. Click a preview to make it the cover.</small></div>
                  <span>{editor.existing_images.length + editor.pending_images.length}/{MAX_PRODUCT_IMAGES}</span>
                </div>
                <label className="product-image-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); queueImages(e.dataTransfer.files); }}>
                  <input disabled={optimizingImages} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { queueImages(e.target.files); e.target.value = ''; }}/>
                  <i className={`fa-solid ${optimizingImages ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}/>
                  <strong>{optimizingImages ? 'Optimizing images…' : 'Drop product images here'}</strong>
                  <span>JPG, PNG, WebP or AVIF · auto-resized to 1600px and compressed to WebP · max 15 MB source</span>
                </label>
                {(editor.existing_images.length > 0 || editor.pending_images.length > 0) && (
                  <div className="product-image-grid">
                    {editor.existing_images.map((url) => (
                      <div key={url} className={`product-image-tile ${editor.main_choice === url ? 'cover' : ''}`}>
                        <button type="button" className="product-image-preview" onClick={() => setEditor({...editor, main_choice:url})}>
                          <img src={normalizeAssetUrl(url)} alt="Product" onError={handleImageError}/>
                          <span>{editor.main_choice === url ? 'COVER IMAGE' : 'SET AS COVER'}</span>
                        </button>
                        <button type="button" className="product-image-remove" onClick={() => removeImage('existing', url)} aria-label="Remove image">
                          <i className="fa-solid fa-xmark"/>
                        </button>
                      </div>
                    ))}
                    {editor.pending_images.map((item) => (
                      <div key={item.id} className={`product-image-tile ${editor.main_choice === `local:${item.id}` ? 'cover' : ''}`}>
                        <button type="button" className="product-image-preview" onClick={() => setEditor({...editor, main_choice:`local:${item.id}`})}>
                          <img src={item.preview} alt={item.file.name}/>
                          <span>{editor.main_choice === `local:${item.id}` ? 'COVER IMAGE' : 'SET AS COVER'}</span>
                        </button>
                        <button type="button" className="product-image-remove" onClick={() => removeImage('pending', item.id)} aria-label="Remove image">
                          <i className="fa-solid fa-xmark"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <details className="product-image-advanced">
                  <summary>Advanced: add an external image URL</summary>
                  <div>
                    <input type="url" placeholder="https://example.com/product.webp" value={editor.external_url || ''} onChange={(e) => setEditor({...editor, external_url:e.target.value})}/>
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={addExternalUrl}>Add URL</button>
                  </div>
                </details>
              </div>
              <label className="admin-wide-field">Description<textarea value={editor.description || ''} onChange={(e) => setEditor({...editor, description:e.target.value})}/></label>
              <label>Features <small>(one per line)</small><textarea value={editor.features_text || ''} onChange={(e) => setEditor({...editor, features_text:e.target.value})}/></label>
              <label className="admin-wide-field">Specifications JSON<textarea className="admin-code-field" value={editor.specs_text || '{}'} onChange={(e) => setEditor({...editor, specs_text:e.target.value})}/></label>
            </div>
            <div className="admin-editor-flags">
              <label>
                <input type="checkbox" checked={editor.active} onChange={(e) => setEditor({...editor, active:e.target.checked})}/> Visible on storefront
              </label>
              <label>
                <input type="checkbox" checked={Boolean(editor.featured)} onChange={(e) => setEditor({...editor, featured:e.target.checked})}/> 🔥 Top / Featured Product
              </label>
            </div>
            <div className="confirm-actions">
              <button type="button" className="confirm-btn-cancel" onClick={closeEditor}>CANCEL</button>
              <button disabled={busy || optimizingImages} className="admin-btn admin-btn-primary">
                {optimizingImages ? 'OPTIMIZING IMAGES…' : busy ? 'UPLOADING & SAVING…' : 'SAVE PRODUCT'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
