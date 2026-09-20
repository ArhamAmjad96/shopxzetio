export const ASSET_PATHS = Object.freeze({
  logo: '/assets/brand/LOGO.png',
  hero: '/assets/brand/HERO.png',
  pubg: '/assets/brand/PUBG.png',
  teamI8: '/assets/brand/ASI8.png',
});

const ABSOLUTE_ASSET = /^(?:https?:|data:|blob:)/i;

export function normalizeAssetUrl(value, fallback = ASSET_PATHS.logo) {
  const url = String(value || '').trim();
  if (!url) return fallback;
  if (ABSOLUTE_ASSET.test(url) || url.startsWith('/')) return url;
  return `/${url.replace(/^\.\//, '')}`;
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
