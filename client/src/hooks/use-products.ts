import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  category: string;
  categoryName?: string;
  subcategory?: string;
  brandId?: string;
  brandName?: string;
  brandSlug?: string;
  description?: string;
  tags: string[];
  features?: string[];
  specifications?: any;
  stock: number;
  stockStatus?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  discount?: number;
  isLowStock?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products', {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (categoryId: string) => {
    // Include all products including repack products in category listings
    // Repack products will appear in both their category page and the repack section
    if (categoryId === 'all' || !categoryId) return products;
    return products.filter(product => 
      product.category === categoryId || product.subcategory === categoryId
    );
  };

  const getProductsByBrand = (brandSlug: string) => {
    return products.filter(product => {
      // Include repack products in brand listings too

      // Brand mapping for proper filtering
      const brandMappings: { [key: string]: string[] } = {
        'nekko': ['nekko'],
        'purina': ['purina'],
        'one': ['purina-one', 'purina one', 'one'],
        'reflex': ['reflex'],
        'reflex-plus': ['reflex-plus', 'reflex plus'],
        'royal-canin': ['royal-canin', 'royal canin'],
        'sheba': ['sheba'],
        'default-brand': ['default-brand', 'default brand']
      };

      // Get valid brand identifiers for this brand slug
      const validBrandIdentifiers = brandMappings[brandSlug.toLowerCase()] || [brandSlug];

      // Match by brand name, slug, or brandId
      const brandMatches = validBrandIdentifiers.some(identifier => 
        product.brandName?.toLowerCase() === identifier.toLowerCase() ||
        product.brandSlug?.toLowerCase() === identifier.toLowerCase() ||
        product.brandId?.toLowerCase() === identifier.toLowerCase()
      );

      // Also check tags for brand matches
      const tagMatches = product.tags?.some(tag => 
        validBrandIdentifiers.some(identifier => 
          tag.toLowerCase().includes(identifier.toLowerCase())
        )
      );

      // Check product name for brand matches
      const nameMatches = validBrandIdentifiers.some(identifier =>
        product.name.toLowerCase().includes(identifier.toLowerCase())
      );

      return brandMatches || tagMatches || nameMatches;
    });
  };

  const searchProducts = (query: string) => {
    return products.filter(product => {
      // Exclude bulk/repack products from search results
      const isBulkProduct = product.tags?.some(tag => 
        ['repack-food', 'repack', 'bulk-save', 'bulk'].includes(tag.toLowerCase())
      );

      if (isBulkProduct) return false;

      return product.name.toLowerCase().includes(query.toLowerCase()) ||
             product.description?.toLowerCase().includes(query.toLowerCase()) ||
             product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    });
  };

  return {
    products,
    loading,
    error,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    refetch: () => window.location.reload() // Simple refetch
  };
}

export const useProductsByCategory = (category?: string, brand?: string, searchTerm?: string, subcategory?: string) => {
  return useQuery({
    queryKey: ['/api/products', category, brand, searchTerm, subcategory],
    select: (data: any[]) => {
      return data.filter((product: any) => {
        // Filter by subcategory first if specified (takes priority)
        if (subcategory && subcategory !== 'all') {
          const productSubcategory = product.subcategory || '';
          if (productSubcategory !== subcategory) {
            return false;
          }
        }
        // Filter by category if specified and no subcategory filter
        else if (category && category !== 'all') {
          const productCategory = product.category || product.categoryId;
          // Handle category mapping for the 10 specific categories
          const categoryMappings: { [key: string]: string[] } = {
            'cat-food': ['cat-food'],
            'dog-food': ['dog-food'],
            'cat-toys': ['cat-toys'],
            'cat-litter': ['cat-litter'],
            'cat-care-health': ['cat-care-health', 'cat-care'],
            'clothing-beds-carrier': ['clothing-beds-carrier'],
            'cat-accessories': ['cat-accessories'],
            'dog-health-accessories': ['dog-health-accessories', 'dog-accessories'],
            'rabbit-food-accessories': ['rabbit-food-accessories', 'rabbit'],
            'bird-food-accessories': ['bird-food-accessories', 'bird']
          };

          const validCategories = categoryMappings[category] || [category];
          if (!validCategories.includes(productCategory)) {
            return false;
          }
        }

        // Filter by brand if specified
        if (brand && brand !== 'all') {
          const productBrand = product.brandSlug || product.brandId || product.brand;
          if (productBrand !== brand) {
            return false;
          }
        }

        // Filter by search term if specified
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesName = product.name?.toLowerCase().includes(searchLower);
          const matchesDescription = product.description?.toLowerCase().includes(searchLower);
          const matchesTags = product.tags?.some((tag: string) => 
            tag.toLowerCase().includes(searchLower)
          );

          if (!matchesName && !matchesDescription && !matchesTags) {
            return false;
          }
        }

        return true;
      });
    },
  });
};