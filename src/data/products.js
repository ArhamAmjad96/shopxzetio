import productsData from '../../js/products-data.js';
import { normalizeAssetUrl } from '../lib/assets';

// Normalize product image paths to always have leading slash for Vite
export const PRODUCTS = productsData.map(p => ({
  ...p,
  mainImage: normalizeAssetUrl(p.mainImage),
  images: (p.images || []).map((image) => normalizeAssetUrl(image))
}));

export default PRODUCTS;
