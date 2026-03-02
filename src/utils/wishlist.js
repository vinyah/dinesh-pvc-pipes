const WISHLIST_KEY = "wishlist";

export function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

/** @param {{ id?: string|number, name: string, link: string, image?: string }} product */
export function addToWishlist(product) {
  const list = getWishlist();
  if (list.some((p) => p.link === product.link)) return;
  list.push({
    id: product.id ?? product.link,
    name: product.name,
    link: product.link,
    image: product.image,
  });
  saveWishlist(list);
}

export function removeFromWishlist(link) {
  const list = getWishlist().filter((p) => p.link !== link);
  saveWishlist(list);
}

export function isInWishlist(link) {
  return getWishlist().some((p) => p.link === link);
}

export function toggleWishlist(product) {
  if (isInWishlist(product.link)) {
    removeFromWishlist(product.link);
    return false;
  }
  addToWishlist(product);
  return true;
}
