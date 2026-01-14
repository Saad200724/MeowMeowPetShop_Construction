export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  description?: string
  tags: string[]
  stock: number
  isBestSeller?: boolean
  isNew?: boolean
  isLowStock?: boolean
}

export const categories = [
  { id: 'Kitten Dry Food', name: 'Kitten Dry Food', icon: '🐱' },
  { id: 'Adult Dry Food', name: 'Adult Dry Food', icon: '🐱' },
  { id: 'Kitten Wet Food', name: 'Kitten Wet Food', icon: '🥘' },
  { id: 'Adult Wet Food', name: 'Adult Wet Food', icon: '🥘' },
  { id: 'Litter Box', name: 'Litter Box', icon: '🧽' },
  { id: 'Accessories', name: 'Accessories', icon: '🦮' },
  { id: 'Medicine', name: 'Medicine', icon: '💊' },
  { id: 'Toys', name: 'Toys', icon: '🎾' },
  { id: 'Shampoo', name: 'Shampoo', icon: '🧴' },
]

export const subcategories = [
  "Kitten Dry Food",
  "Adult Dry Food",
  "Kitten Wet Food",
  "Adult Wet Food",
  "Litter Box",
  "Accessories",
  "Medicine",
  "Toys",
  "Shampoo"
];

// Mock data - MongoDB-ready structure
export const productsData: Record<string, Product[]> = {
  'adult-food': [],
  'kitten-food': [],
  'collar': [],
  'clumping-cat-litter': [],
  'cat-litter-accessories': [],
  'harness': [],
  'cat-tick-flea-control': [],
  'deworming-tablet': [],
  'cat-pouches': [],
  'sunglass': [],
  // Brand categories
  'nekko': [],
  'purina': [],
  'one': [],
  'reflex-plus': [],
  'royal-canin': [],
  'sheba': [],
  'toys-treats': [
    {
      id: 'tt001',
      name: 'Interactive Cat Wand Toy',
      price: 450,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.6,
      reviews: 156,
      category: 'toys-treats',
      description: 'Fun interactive wand toy to keep cats active and engaged.',
      tags: ['Interactive', 'Cat'],
      stock: 89,
      isBestSeller: true,
    },
    {
      id: 'tt002',
      name: 'Kong Classic Dog Toy',
      price: 850,
      image: 'https://images.unsplash.com/photo-1605043204319-d14e5ba4719e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.8,
      reviews: 234,
      category: 'toys-treats',
      description: 'Durable rubber toy perfect for stuffing with treats.',
      tags: ['Durable', 'Dog'],
      stock: 67,
    },
    {
      id: 'tt003',
      name: 'Catnip Mice Toys (Pack of 6)',
      price: 320,
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.5,
      reviews: 189,
      category: 'toys-treats',
      description: 'Soft mice toys filled with premium catnip.',
      tags: ['Catnip', 'Pack'],
      stock: 45,
      isNew: true,
    },
    {
      id: 'tt004',
      name: 'Dog Training Treats',
      price: 650,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.7,
      reviews: 145,
      category: 'toys-treats',
      description: 'High-value treats perfect for training sessions.',
      tags: ['Training', 'Treats'],
      stock: 7,
      isLowStock: true,
    },
  ],
  'grooming': [
    {
      id: 'gr001',
      name: 'Professional Pet Grooming Kit',
      price: 2800,
      originalPrice: 3200,
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.7,
      reviews: 98,
      category: 'grooming',
      description: 'Complete grooming kit with brushes, clippers, and accessories.',
      tags: ['Professional', 'Complete Kit'],
      stock: 23,
      isBestSeller: true,
    },
    {
      id: 'gr002',
      name: 'Pet Shampoo & Conditioner Set',
      price: 950,
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.5,
      reviews: 167,
      category: 'grooming',
      description: 'Gentle shampoo and conditioner for sensitive pet skin.',
      tags: ['Gentle', 'Set'],
      stock: 54,
    },
    {
      id: 'gr003',
      name: 'Nail Clippers for Dogs & Cats',
      price: 450,
      image: 'https://images.unsplash.com/photo-1606316321469-4d5b7d0e21c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.6,
      reviews: 234,
      category: 'grooming',
      description: 'Safe and easy-to-use nail clippers for all pet sizes.',
      tags: ['Safety', 'Universal'],
      stock: 78,
      isNew: true,
    },
    {
      id: 'gr004',
      name: 'De-shedding Brush',
      price: 750,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.8,
      reviews: 156,
      category: 'grooming',
      description: 'Reduces shedding by up to 90% with gentle bristles.',
      tags: ['De-shedding', 'Gentle'],
      stock: 3,
      isLowStock: true,
    },
  ],
  'health-care': [
    {
      id: 'hc001',
      name: 'Pet Multivitamin Supplements',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.6,
      reviews: 123,
      category: 'health-care',
      description: 'Daily multivitamin for optimal pet health and immunity.',
      tags: ['Multivitamin', 'Daily'],
      stock: 67,
      isBestSeller: true,
    },
    {
      id: 'hc002',
      name: 'Flea & Tick Prevention Collar',
      price: 850,
      image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.5,
      reviews: 189,
      category: 'health-care',
      description: '8-month protection against fleas and ticks.',
      tags: ['Prevention', '8-month'],
      stock: 45,
    },
    {
      id: 'hc003',
      name: 'Digestive Health Probiotics',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1552053628-0dcb5a60e3de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.8,
      reviews: 87,
      category: 'health-care',
      description: 'Supports digestive health with beneficial probiotics.',
      tags: ['Probiotics', 'Digestive'],
      stock: 34,
      isNew: true,
    },
    {
      id: 'hc004',
      name: 'Ear Cleaning Solution',
      price: 650,
      image: 'https://images.unsplash.com/photo-1605043204319-d14e5ba4719e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.4,
      reviews: 156,
      category: 'health-care',
      description: 'Gentle ear cleaning solution for regular maintenance.',
      tags: ['Gentle', 'Maintenance'],
      stock: 9,
      isLowStock: true,
    },
  ],
  'accessories': [
    {
      id: 'ac001',
      name: 'Adjustable Pet Harness',
      price: 950,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.7,
      reviews: 234,
      category: 'accessories',
      description: 'Comfortable and secure harness for daily walks.',
      tags: ['Adjustable', 'Comfortable'],
      stock: 56,
      isBestSeller: true,
    },
    {
      id: 'ac002',
      name: 'Stainless Steel Food Bowls',
      price: 750,
      image: 'https://images.unsplash.com/photo-1606316321469-4d5b7d0e21c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.6,
      reviews: 189,
      category: 'accessories',
      description: 'Durable stainless steel bowls, set of 2.',
      tags: ['Stainless Steel', 'Set of 2'],
      stock: 78,
    },
    {
      id: 'ac003',
      name: 'Orthopedic Pet Bed',
      price: 2400,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.8,
      reviews: 167,
      category: 'accessories',
      description: 'Memory foam pet bed for joint support and comfort.',
      tags: ['Orthopedic', 'Memory Foam'],
      stock: 23,
      isNew: true,
    },
    {
      id: 'ac004',
      name: 'Retractable Dog Leash',
      price: 650,
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      rating: 4.5,
      reviews: 145,
      category: 'accessories',
      description: '16ft retractable leash with ergonomic handle.',
      tags: ['Retractable', '16ft'],
      stock: 4,
      isLowStock: true,
    },
  ],
  'cat-toys': [],
  'cat-litter': [],
  'reflex': [],
}

// API-based product fetching function
let cachedProducts: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export async function fetchProductsFromAPI(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return [];
  }
}

export function getProductsByCategory(categoryId: string): Product[] {
  // For now, return mock data but we'll replace this with a hook
  return productsData[categoryId] || []
}

export function getCategoryAnalytics(categoryId: string) {
  const products = getProductsByCategory(categoryId)
  
  if (products.length === 0) {
    return {
      lowestPriced: null,
      highestPriced: null,
      highestRated: null,
      bestSeller: null,
    }
  }

  const lowestPriced = products.reduce((min, product) => 
    product.price < min.price ? product : min
  )
  
  const highestPriced = products.reduce((max, product) => 
    product.price > max.price ? product : max
  )
  
  const highestRated = products.reduce((max, product) => 
    product.rating > max.rating ? product : max
  )
  
  const bestSeller = products.find(product => product.isBestSeller) || products[0]

  return {
    lowestPriced,
    highestPriced,
    highestRated,
    bestSeller,
  }
}