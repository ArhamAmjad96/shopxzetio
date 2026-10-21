export const ASSET_PATHS = Object.freeze({
  logo: '/assets/brand/LOGO.png',
  hero: '/assets/brand/HERO.png',
  pubg: '/assets/brand/PUBG.png',
  teamI8: '/assets/brand/ASI8.png',
});

const ABSOLUTE_ASSET = /^(?:https?:|data:|blob:)/i;

export function normalizeAssetUrl(value, fallback = ASSET_PATHS.logo) {
  if (!value) return fallback;
  let url = String(value).trim();
  if (!url) return fallback;
  // Convert Windows backslashes to standard forward slashes
  url = url.replace(/\\/g, '/');
  if (ABSOLUTE_ASSET.test(url)) return url;
  if (!url.startsWith('/')) {
    url = `/${url.replace(/^\.\//, '')}`;
  }
  try {
    // Decode first to avoid double encoding, then encode each path segment
    const decoded = decodeURIComponent(url);
    return decoded
      .split('/')
      .map(part => (part ? encodeURIComponent(part) : ''))
      .join('/');
  } catch {
    try {
      return encodeURI(decodeURI(url));
    } catch {
      return url;
    }
  }
}

export function handleImageError(event, fallback = ASSET_PATHS.logo) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') {
    image.hidden = true;
    return;
  }
  image.dataset.fallbackApplied = 'true';
  image.src = fallback;
}
