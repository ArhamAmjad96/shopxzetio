import productsData from '../../js/products-data.js';

// Normalize product image paths to always have leading slash for Vite
export const PRODUCTS = productsData.map(p => ({
  ...p,
  mainImage: p.mainImage && !p.mainImage.startsWith('/') && !p.mainImage.startsWith('http') ? '/' + p.mainImage : p.mainImage,
  images: (p.images || []).map(img => img && !img.startsWith('/') && !img.startsWith('http') ? '/' + img : img)
}));

export default PRODUCTS;
