// Utility functions for generating URL-friendly slugs from product names

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function generateUniqueSlug(productName: string, allProducts: any[]): string {
  const baseSlug = createSlug(productName);
  
  // Get all existing slugs for duplicate checking
  const existingSlugs = allProducts.map(product => {
    if (product.slug) {
      return product.slug;
    }
    // Generate slug if not exists
    return createSlug(product.name);
  });

  // If base slug is unique, return it
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // Find next available number suffix
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

export function getProductSlug(product: any, allProducts: any[] = []): string {
  // If product already has a slug, use it
  if (product.slug) {
    return product.slug;
  }
  
  // Generate unique slug
  return generateUniqueSlug(product.name, allProducts);
}

export function findProductBySlug(slug: string, products: any[]): any {
  return products.find(product => {
    const productSlug = getProductSlug(product, products);
    return productSlug === slug;
  });
}