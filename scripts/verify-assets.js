import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import products from '../js/products-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const assetDir = path.join(publicDir, 'assets');
const supportedAsset = /\.(?:avif|jpe?g|png|webp|mp4)$/i;
const externalUrl = /^(?:https?:|data:|blob:)/i;
let failed = false;
let checked = 0;

function resolveWebAsset(webPath) {
  if (!webPath || externalUrl.test(webPath)) return null;
  const normalized = decodeURI(String(webPath)).replace(/^\/+/, '').replaceAll('/', path.sep);
  return path.join(publicDir, normalized);
}

function verifyAsset(webPath, label) {
  const fullPath = resolveWebAsset(webPath);
  if (!fullPath) return;
  checked += 1;
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] ${label}: ${webPath}`);
    failed = true;
    return;
  }
  if (fs.statSync(fullPath).size === 0) {
    console.error(`[FAIL] Empty asset: ${webPath}`);
    failed = true;
  }
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

console.log('--- ASSET & CATALOG VERIFICATION ---');

for (const product of products) {
  if (!product.id || !product.name || !Number.isFinite(Number(product.price))) {
    console.error(`[FAIL] Product metadata is incomplete: ${product.id || product.name || 'unknown'}`);
    failed = true;
  }
  verifyAsset(product.mainImage, `Product ${product.id} cover missing`);
  for (const image of product.images || []) verifyAsset(image, `Product ${product.id} gallery image missing`);
}

for (const webPath of [
  '/assets/brand/LOGO.png',
  '/assets/brand/HERO.png',
  '/assets/brand/PUBG.png',
  '/assets/brand/ASI8.png',
  '/assets/reels/CRYPTO.mp4',
  '/assets/reels/FALAK.mp4',
  '/assets/reels/PACAKGING.mp4',
  '/assets/reels/WHY GOOD EQIUPMENT.mp4',
]) verifyAsset(webPath, 'Required storefront asset missing');

const sourceFiles = [
  path.join(rootDir, 'index.html'),
  ...walk(path.join(rootDir, 'css')).filter((file) => /\.css$/i.test(file)),
  ...walk(path.join(rootDir, 'src')).filter((file) => /\.(?:js|jsx|css)$/i.test(file)),
];
const literalAssetPattern = /["'`](\/?assets\/[^"'`$]+?\.(?:avif|jpe?g|png|webp|mp4))["'`]/gi;
for (const sourceFile of sourceFiles) {
  const source = fs.readFileSync(sourceFile, 'utf8');
  for (const match of source.matchAll(literalAssetPattern)) {
    verifyAsset(match[1], `${path.relative(rootDir, sourceFile)} references a missing asset`);
  }
}

const allAssets = walk(assetDir).filter((file) => supportedAsset.test(file));
const totalBytes = allAssets.reduce((sum, file) => sum + fs.statSync(file).size, 0);
const largeImages = allAssets.filter((file) => !/\.mp4$/i.test(file) && fs.statSync(file).size > 2 * 1024 * 1024);
for (const file of largeImages) {
  console.warn(`[WARN] Large image (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB): ${path.relative(publicDir, file)}`);
}

console.log(`Checked ${checked} referenced assets.`);
console.log(`Managed asset library: ${allAssets.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB.`);

if (failed) {
  console.error('--- ASSET VERIFICATION FAILED ---');
  process.exit(1);
}

console.log('--- ALL REFERENCED ASSETS ARE DEPLOYABLE ---');
