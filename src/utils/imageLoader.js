// Vite-compatible image loader
// Use this function instead of require() for dynamic image imports
export const getImageUrl = (imageName) => {
  try {
    // Vite handles dynamic imports using import.meta.url
    // This creates a proper URL for the asset
    return new URL(`../assets/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error(`Error loading image: ${imageName}`, error);
    // Fallback: return the path directly
    return `/src/assets/${imageName}`;
  }
};

