// Server-side slug generation utilities for products

import { Product } from "@shared/models";

/**
 * Generate a URL-friendly slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Generate a unique slug for a product, checking against existing products in database
 */
export async function generateUniqueProductSlug(productName: string, excludeProductId?: string): Promise<string> {
  const baseSlug = createSlug(productName);
  
  // Check if base slug is unique
  const existingProduct = await Product.findOne({ 
    slug: baseSlug,
    ...(excludeProductId && { _id: { $ne: excludeProductId } })
  });

  if (!existingProduct) {
    return baseSlug;
  }

  // Find next available number suffix
  let counter = 1;
  let uniqueSlug: string;
  let foundUnique = false;

  while (!foundUnique && counter <= 1000) { // Prevent infinite loops
    uniqueSlug = `${baseSlug}-${counter}`;
    
    const conflictingProduct = await Product.findOne({ 
      slug: uniqueSlug,
      ...(excludeProductId && { _id: { $ne: excludeProductId } })
    });

    if (!conflictingProduct) {
      foundUnique = true;
      return uniqueSlug;
    }
    
    counter++;
  }

  // Fallback: use timestamp if we somehow can't find a unique slug
  return `${baseSlug}-${Date.now()}`;
}

/**
 * Find product by slug
 */
export async function findProductBySlug(slug: string) {
  return await Product.findOne({ slug, isActive: true });
}

/**
 * Update all existing products to have slugs (migration utility)
 */
export async function migrateProductSlugs(): Promise<void> {
  console.log('Starting product slug migration...');
  
  const productsWithoutSlug = await Product.find({ 
    $or: [
      { slug: { $exists: false } },
      { slug: null },
      { slug: "" }
    ]
  });

  console.log(`Found ${productsWithoutSlug.length} products without slugs`);

  for (const product of productsWithoutSlug) {
    try {
      const uniqueSlug = await generateUniqueProductSlug(product.name, product._id.toString());
      await Product.updateOne(
        { _id: product._id },
        { $set: { slug: uniqueSlug } }
      );
      console.log(`Updated product "${product.name}" with slug: ${uniqueSlug}`);
    } catch (error) {
      console.error(`Failed to update slug for product "${product.name}":`, error);
    }
  }

  console.log('Product slug migration completed');
}