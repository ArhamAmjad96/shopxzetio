import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export function AdminCustomers({ triggerToast }) {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    const [profileResult, orderResult] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email, phone, role, created_at').order('created_at', { ascending: false }),
      supabase.from('orders').select('id, customer_id, total_amount, order_status, created_at'),
    ]);
    const error = profileResult.error || orderResult.error;
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    setCustomers((profileResult.data || []).filter((profile) => profile.role !== 'admin').map((profile) => ({
      ...profile,
      orders: (orderResult.data || []).filter((order) => order.customer_id === profile.id),
    })));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => customers.filter((customer) => {
    const needle = query.toLowerCase().trim();
    return !needle || [customer.full_name, customer.email, customer.phone].some((value) => String(value || '').toLowerCase().includes(needle));
  }), [customers, query]);

  return (
    <section className="admin-products-panel">
      <div className="admin-products-head">
        <div>
          <p className="auth-kicker">// CUSTOMER INTELLIGENCE</p>
          <h2>CUSTOMERS</h2>
          <span>{customers.length} registered customer accounts</span>
        </div>
      </div>
      <div className="admin-search-wrapper admin-products-search">
        <i className="fa-solid fa-magnifying-glass"/>
        <input className="admin-search-input" placeholder="Search name, email or phone…" value={query} onChange={(e) => setQuery(e.target.value)}/>
      </div>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Total Spending</th>
              <th>Latest Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => {
              const orders = customer.orders || [];
              const spend = orders.filter((order) => order.order_status !== 'cancelled').reduce((sum, order) => sum + Number(order.total_amount), 0);
              const latest = [...orders].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
              return (
                <tr key={customer.id}>
                  <td><strong>{customer.full_name || 'Unnamed customer'}</strong><small className="admin-block-small">{customer.id.slice(0,8)}…</small></td>
                  <td>{customer.email || 'No email'}<small className="admin-block-small">{customer.phone || 'No phone'}</small></td>
                  <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                  <td>{orders.length}</td>
                  <td><strong>Rs. {spend.toLocaleString()}</strong></td>
                  <td>{latest ? <><strong>{latest.order_status}</strong><small className="admin-block-small">{new Date(latest.created_at).toLocaleDateString()}</small></> : 'No orders'}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan="6" className="table-empty-state">No matching customers.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const initialReviewState = {
  display_name: '',
  product_id: '',
  rating: 5,
  review_text: '',
  media_path: '',
  is_featured: false,
  approval_status: 'approved',
};

const darkSelectStyle = {
  backgroundColor: '#050a14',
  background: '#050a14',
  color: '#ffffff',
  borderColor: 'rgba(0, 240, 255, 0.4)',
};

const darkOptionStyle = {
  backgroundColor: '#071224',
  background: '#071224',
  color: '#ffffff',
  padding: '10px 14px',
};

export function AdminReviews({ triggerToast }) {
  const [reviews, setReviews] = useState([]);
  const [productList, setProductList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewForm, setReviewForm] = useState(initialReviewState);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from('reviews').select('*, products(name)').order('created_at', { ascending: false });
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    setReviews(data || []);
  };

  useEffect(() => {
    load();
    supabase.from('products').select('id, name').order('name').then(({ data }) => {
      if (data) setProductList(data);
    });
  }, []);

  const closeModal = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview('');
    setReviewForm(initialReviewState);
    setShowAddModal(false);
  };

  const updateReview = async (review, patch) => {
    const { error } = await supabase.from('reviews').update(patch).eq('id', review.id);
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    await load();
    triggerToast('Review moderation updated.');
  };

  const deleteReview = async (review) => {
    if (!window.confirm(`Permanently remove review by "${review.display_name || 'Customer'}"?`)) return;
    const { error } = await supabase.from('reviews').delete().eq('id', review.id);
    if (error) return triggerToast(error.message, 'fa-triangle-exclamation', 'danger');
    await load();
    triggerToast('Review permanently deleted.', 'fa-trash', 'info');
  };

  const attachMediaFile = (file) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      return triggerToast('Please upload an image (JPG, PNG, WebP) or video (MP4, WebM).', 'fa-triangle-exclamation', 'danger');
    }
    const maxBytes = isVideo ? 60 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      return triggerToast(`File is too large. Max size is ${isVideo ? '60MB' : '20MB'}.`, 'fa-triangle-exclamation', 'danger');
    }

    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(file);
    setMediaType(isVideo ? 'video' : 'image');
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) attachMediaFile(file);
    e.target.value = '';
  };

  const handleDropMedia = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) attachMediaFile(file);
  };

  const removeMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview('');
    setReviewForm((prev) => ({ ...prev, media_path: '' }));
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.display_name.trim()) {
      return triggerToast('Please enter the reviewer name.', 'fa-triangle-exclamation', 'danger');
    }
    if (!reviewForm.review_text.trim()) {
      return triggerToast('Please write the review text.', 'fa-triangle-exclamation', 'danger');
    }

    setSubmitting(true);
    try {
      let finalMediaPath = reviewForm.media_path?.trim() || null;
      let finalMediaType = mediaType;

      // Handle direct file upload to Supabase Storage
      if (mediaFile) {
        const safeName = mediaFile.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        let uploadBucket = 'product-images';
        let storagePath = `reviews/${fileName}`;

        let uploadRes = await supabase.storage.from(uploadBucket).upload(storagePath, mediaFile, {
          cacheControl: '31536000',
          contentType: mediaFile.type,
          upsert: false,
        });

        if (uploadRes.error) {
          uploadBucket = 'review-images';
          storagePath = `${fileName}`;
          const retryUpload = await supabase.storage.from(uploadBucket).upload(storagePath, mediaFile, {
            cacheControl: '31536000',
            contentType: mediaFile.type,
            upsert: false,
          });
          if (retryUpload.error) throw new Error(`Media upload failed: ${uploadRes.error.message || retryUpload.error.message}`);
        }

        const { data: publicData } = supabase.storage.from(uploadBucket).getPublicUrl(storagePath);
        finalMediaPath = publicData.publicUrl;
        finalMediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
      }

      const userRes = await supabase.auth.getUser();
      const currentUserId = userRes?.data?.user?.id || null;

      const payload = {
        user_id: currentUserId,
        product_id: reviewForm.product_id ? reviewForm.product_id : null,
        display_name: reviewForm.display_name.trim(),
        review_text: reviewForm.review_text.trim(),
        rating: Number(reviewForm.rating) || 5,
        media_type: finalMediaPath ? finalMediaType : null,
        media_path: finalMediaPath,
        is_featured: Boolean(reviewForm.is_featured),
        approval_status: reviewForm.approval_status || 'approved',
      };

      // Direct insert
      let res = await supabase.from('reviews').insert(payload).select().single();
      
      // If RLS blocked insert because approval_status is not 'pending', insert with pending and then update to approved
      if (res.error && currentUserId) {
        const pendingPayload = { ...payload, approval_status: 'pending', is_featured: false };
        const retryRes = await supabase.from('reviews').insert(pendingPayload).select().single();
        if (retryRes.error) throw retryRes.error;
        if (payload.approval_status !== 'pending' || payload.is_featured) {
          await supabase.from('reviews').update({
            approval_status: payload.approval_status,
            is_featured: payload.is_featured,
          }).eq('id', retryRes.data.id);
        }
      } else if (res.error) {
        throw res.error;
      }

      closeModal();
      await load();
      triggerToast('Review successfully added to ShopXzetio!', 'fa-circle-check');
    } catch (err) {
      triggerToast(err.message || 'Could not add review.', 'fa-triangle-exclamation', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-products-panel">
      <div className="admin-products-head">
        <div>
          <p className="auth-kicker">// COMMUNITY MODERATION</p>
          <h2>CUSTOMER REVIEWS</h2>
          <span>{reviews.length} customer reviews · {reviews.filter((r) => r.approval_status === 'pending').length} awaiting moderation</span>
        </div>
        <div className="admin-products-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-plus"/> Add a Review
          </button>
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Review & Media</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>
                  <strong>{review.display_name || 'Customer'}</strong>
                  <small className="admin-block-small">{new Date(review.created_at).toLocaleDateString()}</small>
                </td>
                <td>{review.products?.name || 'Store review'}</td>
                <td>
                  <span style={{ color: '#ffd75e' }}>{'★'.repeat(review.rating || 0)}</span>
                </td>
                <td>
                  <div style={{ maxWidth: 320, whiteSpace: 'normal' }}>
                    <div>{review.review_text || 'Media review'}</div>
                    {review.media_path && (
                      <div style={{ marginTop: 6 }}>
                        {review.media_type === 'video' ? (
                          <a
                            href={review.media_path}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '3px 8px',
                              background: 'rgba(0, 240, 255, 0.12)',
                              border: '1px solid rgba(0, 240, 255, 0.35)',
                              color: '#00f0ff',
                              borderRadius: 4,
                              fontSize: '0.74rem',
                              textDecoration: 'none',
                              fontWeight: 600,
                            }}
                          >
                            <i className="fa-solid fa-video"/> View Attached Video
                          </a>
                        ) : (
                          <a href={review.media_path} target="_blank" rel="noreferrer">
                            <img
                              src={review.media_path}
                              alt="Review attachment"
                              style={{
                                width: 48,
                                height: 48,
                                objectFit: 'cover',
                                borderRadius: 4,
                                border: '1px solid rgba(0, 240, 255, 0.35)',
                                display: 'block',
                              }}
                            />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`visibility-pill ${review.approval_status === 'approved' ? 'live' : ''}`}>
                    {review.approval_status}
                  </span>
                  {review.is_featured && <span className="visibility-pill featured">Featured</span>}
                </td>
                <td>
                  <div className="table-actions-cell">
                    {review.approval_status !== 'approved' && (
                      <button className="btn-action-chat" onClick={() => updateReview(review, { approval_status: 'approved' })}>
                        <i className="fa-solid fa-check"/><span>Approve</span>
                      </button>
                    )}
                    {review.approval_status === 'approved' && (
                      <button className="btn-action-delete" title="Hide review" onClick={() => updateReview(review, { approval_status: 'hidden' })}>
                        <i className="fa-solid fa-eye-slash"/>
                      </button>
                    )}
                    <button
                      className={`btn-action-chat ${review.is_featured ? 'active' : ''}`}
                      title="Toggle Featured Review"
                      onClick={() => updateReview(review, { is_featured: !review.is_featured })}
                    >
                      <i className="fa-solid fa-star"/>
                    </button>
                    <button
                      className="btn-action-delete"
                      title="Delete review permanently"
                      onClick={() => deleteReview(review)}
                    >
                      <i className="fa-solid fa-trash"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" className="table-empty-state">No customer reviews yet. Click “Add a Review” to add one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="cyber-confirm-backdrop" onClick={(e) => e.target.classList.contains('cyber-confirm-backdrop') && closeModal()}>
          <form className="admin-product-editor admin-review-editor" onSubmit={handleCreateReview}>
            <div className="ss-lightbox-header">
              <h3><i className="fa-solid fa-star" style={{ color: '#ffd75e', marginRight: 8 }}/> ADD CUSTOMER REVIEW</h3>
              <button type="button" className="admin-editor-close-btn" onClick={closeModal} aria-label="Close modal">
                <i className="fa-solid fa-xmark"/>
              </button>
            </div>
            
            <div className="admin-product-form-grid">
              <label>
                Customer / Reviewer Name
                <input
                  required
                  placeholder="e.g. Daniyal Khan, GamerBoy_99"
                  value={reviewForm.display_name}
                  onChange={(e) => setReviewForm({ ...reviewForm, display_name: e.target.value })}
                />
              </label>

              <label>
                Product Reviewed
                <select
                  style={darkSelectStyle}
                  value={reviewForm.product_id}
                  onChange={(e) => setReviewForm({ ...reviewForm, product_id: e.target.value })}
                >
                  <option style={darkOptionStyle} value="">General Store Review (ShopXzetio)</option>
                  {productList.map((p) => (
                    <option style={darkOptionStyle} key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Rating (1 - 5 Stars)
                <select
                  style={darkSelectStyle}
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  <option style={darkOptionStyle} value={5}>★★★★★ (5 Stars - Excellent)</option>
                  <option style={darkOptionStyle} value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option style={darkOptionStyle} value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option style={darkOptionStyle} value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                  <option style={darkOptionStyle} value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </label>

              <label>
                Moderation Status
                <select
                  style={darkSelectStyle}
                  value={reviewForm.approval_status}
                  onChange={(e) => setReviewForm({ ...reviewForm, approval_status: e.target.value })}
                >
                  <option style={darkOptionStyle} value="approved">Approved & Live</option>
                  <option style={darkOptionStyle} value="pending">Pending Moderation</option>
                </select>
              </label>

              <label className="admin-wide-field">
                Review Text
                <textarea
                  required
                  rows="4"
                  placeholder="Share customer's actual feedback, e.g. Amazing thumb sleeves, ultra responsive touch and premium breathable material..."
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                />
              </label>

              {/* Upload Image / Video Section */}
              <div className="admin-wide-field review-media-manager">
                <div className="review-media-header">
                  <label>REVIEW MEDIA (PHOTO OR VIDEO)</label>
                  <span>JPG, PNG, WebP, MP4, WebM · Up to 60 MB</span>
                </div>

                {!mediaPreview && !reviewForm.media_path && (
                  <label className="review-media-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDropMedia}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
                      onChange={handleFileSelected}
                      disabled={submitting}
                      style={{ display: 'none' }}
                    />
                    <i className="fa-solid fa-cloud-arrow-up"/>
                    <strong>Click to Upload Image or Video</strong>
                    <span>Upload customer setup photo, unboxing video or gameplay reaction</span>
                  </label>
                )}

                {(mediaPreview || reviewForm.media_path) && (
                  <div className="review-media-preview-card">
                    {mediaType === 'video' ? (
                      <video src={mediaPreview || reviewForm.media_path} controls className="review-media-preview-player" />
                    ) : (
                      <img src={mediaPreview || reviewForm.media_path} alt="Review attachment preview" className="review-media-preview-img" />
                    )}
                    <div className="review-media-preview-meta">
                      <strong>{mediaFile?.name || (reviewForm.media_path ? 'External Media Link' : 'Attached Media')}</strong>
                      <span>{mediaType.toUpperCase()} {mediaFile ? `· ${(mediaFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}</span>
                      <button type="button" className="btn-remove-media" onClick={removeMedia}>
                        <i className="fa-solid fa-trash"/> Remove Media
                      </button>
                    </div>
                  </div>
                )}

                <details className="review-media-external">
                  <summary>Or paste an external Image / Video URL</summary>
                  <div className="review-media-external-input">
                    <input
                      type="url"
                      placeholder="https://example.com/customer-review-media.webp"
                      value={reviewForm.media_path}
                      onChange={(e) => {
                        const url = e.target.value;
                        setReviewForm({ ...reviewForm, media_path: url });
                        if (url.match(/\.(mp4|webm|mov|mkv)$/i)) {
                          setMediaType('video');
                        } else {
                          setMediaType('image');
                        }
                      }}
                    />
                  </div>
                </details>
              </div>
            </div>

            <div className="admin-editor-flags">
              <label>
                <input
                  type="checkbox"
                  checked={reviewForm.is_featured}
                  onChange={(e) => setReviewForm({ ...reviewForm, is_featured: e.target.checked })}
                />
                ★ Pin to Featured Reviews / Testimonials
              </label>
            </div>

            <div className="confirm-actions">
              <button type="button" className="confirm-btn-cancel" onClick={closeModal}>
                CANCEL
              </button>
              <button disabled={submitting} className="admin-btn admin-btn-primary">
                {submitting ? 'UPLOADING & SAVING…' : 'POST REVIEW'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
