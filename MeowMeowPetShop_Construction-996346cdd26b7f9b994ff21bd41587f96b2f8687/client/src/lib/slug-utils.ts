// Utility functions for working with product slugs
// Slugs are now persisted server-side, so we just work with the stored values

/**
 * Get the product slug - products should always have a slug field now
 * This is a simple accessor function that validates the slug exists
 */
export function getProductSlug(product: any): string {
  // Products should always have a slug field from the server
  if (product.slug) {
    return product.slug;
  }
  
  // Fallback for legacy products or edge cases
  // This should not happen in normal operation as backend generates slugs
  console.warn('Product missing slug field:', product.name);
  return createSlugFallback(product.name || 'product');
}

/**
 * Find a product by its slug from a list of products
 * Products should have their slugs populated from the server
 */
export function findProductBySlug(slug: string, products: any[]): any {
  return products.find(product => product.slug === slug);
}

/**
 * Fallback slug creation for edge cases only
 * The server should handle all slug generation now
 */
function createSlugFallback(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

// Legacy functions kept for backwards compatibility but should not be used
// The server now handles all slug generation and persistence

/**
 * @deprecated Use server-side slug generation instead
 */
export function createSlug(text: string): string {
  console.warn('createSlug is deprecated. Use server-side slug generation instead.');
  return createSlugFallback(text);
}

/**
 * @deprecated Use server-side slug generation instead
 */
export function generateUniqueSlug(productName: string, allProducts: any[] = []): string {
  console.warn('generateUniqueSlug is deprecated. Use server-side slug generation instead.');
  return createSlugFallback(productName);
}