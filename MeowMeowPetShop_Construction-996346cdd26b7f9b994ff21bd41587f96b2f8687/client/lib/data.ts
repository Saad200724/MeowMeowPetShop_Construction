export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockQuantity: number;
  tags: string[];
  features?: string[];
  specifications?: { [key: string]: string };
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  isActive: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  image: string;
  text: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

// Sample data for development
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Dry Cat Food (5kg)',
    description: 'High-quality dry cat food with real chicken and essential nutrients',
    price: 2400,
    category: 'Cat Food',
    subcategory: 'Dry Food',
    brand: 'Royal Canin',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    rating: 5,
    reviews: 124,
    stockStatus: 'In Stock',
    stockQuantity: 50,
    tags: ['premium', 'bestseller', 'chicken'],
    isBestseller: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  }
];

export const sampleCategories: Category[] = [
  {
    id: 1,
    name: 'Cat Food',
    slug: 'cat-food',
    description: 'Premium food for cats of all ages',
    isActive: true
  },
  {
    id: 2,
    name: 'Dog Food',
    slug: 'dog-food', 
    description: 'Nutritious food for dogs of all sizes',
    isActive: true
  }
];

export const sampleBrands: Brand[] = [
  {
    id: 1,
    name: 'Royal Canin',
    slug: 'royal-canin',
    description: 'Premium pet nutrition brand',
    isActive: true
  },
  {
    id: 2,
    name: 'Hills',
    slug: 'hills',
    description: 'Science-based pet nutrition',
    isActive: true
  }
];
