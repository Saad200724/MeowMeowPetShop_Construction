// Comprehensive search data for all products across all pages
export interface SearchableProduct {
  id: string;
  name: string;
  category: string;
  brand?: string;
  price: string;
  page: string;
  route: string;
  keywords: string[];
}

export const searchableProducts: SearchableProduct[] = [
  // Products will be added here by admin after cleaning dummy data
];

export function searchProducts(query: string): SearchableProduct[] {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return searchableProducts.filter(product => {
    const searchableText = [
      product.name,
      product.category,
      product.brand || '',
      product.page,
      ...product.keywords
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  }).slice(0, 10); // Limit to 10 results
}