import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import products from '../js/products-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('--- STARTING ASSET & CATALOG VERIFICATION ---');

let passed = true;
let totalImagesChecked = 0;

// 1. Verify all products and their images
console.log(`Checking ${products.length} products in catalog...`);

products.forEach(p => {
  if (!p.id || !p.name || !p.price) {
    console.error(`[FAIL] Product missing mandatory fields: ${JSON.stringify(p)}`);
    passed = false;
  }

  // Verify main image
  const mainPath = path.join(rootDir, p.mainImage);
  if (!fs.existsSync(mainPath)) {
    console.error(`[FAIL] Product ${p.id} main image missing: ${p.mainImage}`);
    passed = false;
  } else {
    totalImagesChecked++;
  }

  // Verify all images in gallery
  p.images.forEach(img => {
    const full = path.join(rootDir, img);
    if (!fs.existsSync(full)) {
      console.error(`[FAIL] Product ${p.id} gallery image missing: ${img}`);
      passed = false;
    } else {
      totalImagesChecked++;
    }
  });
});

console.log(`Verified ${totalImagesChecked} product images on disk.`);

// 2. Verify brand assets
const brandAssets = [
  'assets/brand/LOGO.png',
  'assets/brand/HERO.png',
  'assets/brand/PUBG.png',
  'assets/brand/ASI8.png'
];

brandAssets.forEach(b => {
  const full = path.join(rootDir, b);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Brand asset missing: ${b}`);
    passed = false;
  } else {
    const size = fs.statSync(full).size;
    console.log(`[PASS] Brand asset ${b} (${size} bytes)`);
  }
});

// 3. Verify reels
const reels = [
  'assets/reels/CRYPTO.mp4',
  'assets/reels/FALAK.mp4',
  'assets/reels/PACAKGING.mp4',
  'assets/reels/WHY GOOD EQIUPMENT.mp4'
];

reels.forEach(r => {
  const full = path.join(rootDir, r);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Reel missing: ${r}`);
    passed = false;
  } else {
    const size = fs.statSync(full).size;
    console.log(`[PASS] Reel video ${r} (${(size / (1024 * 1024)).toFixed(2)} MB)`);
  }
});

// 4. Verify core website and admin files
const coreFiles = [
  'index.html',
  'admin.html',
  'css/style.css',
  'css/admin.css',
  'js/products-data.js',
  'js/cart.js',
  'js/checkout.js',
  'js/app.js',
  'js/admin.js'
];

coreFiles.forEach(f => {
  const full = path.join(rootDir, f);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Core file missing: ${f}`);
    passed = false;
  } else {
    console.log(`[PASS] Core file ${f}`);
  }
});

if (passed) {
  console.log('--- ALL ASSET & CATALOG VERIFICATIONS PASSED SUCCESSFULLY (100%) ---');
} else {
  console.error('--- SOME ASSET VERIFICATIONS FAILED ---');
  process.exit(1);
}
