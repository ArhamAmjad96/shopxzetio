import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import STATIC_PRODUCTS from '../data/products';
import { supabase } from '../lib/supabase';
import { normalizeAssetUrl } from '../lib/assets';

const CatalogContext = createContext({ 
  products: STATIC_PRODUCTS, 
  source: 'static', 
  loading: false,
  refreshCatalog: async () => {} 
});

function normalizeDatabaseProduct(product) {
  const isHero = Boolean(
    product.is_hero || 
    product.specs?.is_hero || 
    product.badge === 'HERO_SPOTLIGHT'
  );

  return {
    id: product.legacy_id,
    databaseId: product.id,
    folder: product.folder,
    name: product.name,
    shortName: product.short_name,
    price: Number(product.price),
    originalPrice: product.original_price === null ? null : Number(product.original_price),
    category: product.category,
    subCategory: product.sub_category,
    badge: product.badge,
    featured: Boolean(product.featured),
    isHero,
    active: Boolean(product.active),
    stockQuantity: product.stock_quantity,
    rating: product.rating === null ? null : Number(product.rating),
    reviewCount: product.review_count,
    description: product.description,
    features: product.features || [],
    specs: product.specs || {},
    inTheBox: product.in_the_box || product.inTheBox || [],
    images: (product.images || []).map((image) => normalizeAssetUrl(image)),
    mainImage: normalizeAssetUrl(product.main_image || product.images?.[0]),
  };
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [source, setSource] = useState('static');
  const [loading, setLoading] = useState(Boolean(supabase));

  const fetchCatalog = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name');

    if (!error && data?.length) {
      setProducts(data.map(normalizeDatabaseProduct));
      setSource('supabase');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();

    // Listen for custom catalog refresh events dispatched from Admin
    const handleCatalogUpdate = () => {
      fetchCatalog();
    };
    window.addEventListener('shopxzetio:catalog-updated', handleCatalogUpdate);

    return () => {
      window.removeEventListener('shopxzetio:catalog-updated', handleCatalogUpdate);
    };
  }, []);

  const value = useMemo(() => ({ 
    products, 
    source, 
    loading, 
    refreshCatalog: fetchCatalog 
  }), [products, source, loading]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
