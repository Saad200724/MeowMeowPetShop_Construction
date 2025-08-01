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
  // Cat Food Products
  {
    id: 'cat-1',
    name: 'Royal Canin Adult Cat Food',
    category: 'Adult Food',
    brand: 'Royal Canin',
    price: '৳1,850',
    page: 'Cat Food',
    route: '/cat-food',
    keywords: ['royal', 'canin', 'adult', 'cat', 'food', 'dry', 'premium']
  },
  {
    id: 'cat-2',
    name: 'Whiskas Cat Pouches Variety Pack',
    category: 'Cat Pouches',
    brand: 'Whiskas',
    price: '৳450',
    page: 'Cat Food',
    route: '/cat-food',
    keywords: ['whiskas', 'pouches', 'wet', 'variety', 'pack']
  },
  {
    id: 'cat-3',
    name: 'Hills Science Diet Kitten Food',
    category: 'Kitten Food',
    brand: 'Hills',
    price: '৳2,200',
    page: 'Cat Food',
    route: '/cat-food',
    keywords: ['hills', 'science', 'diet', 'kitten', 'food', 'premium']
  },
  {
    id: 'cat-4',
    name: 'Felix As Good As It Looks',
    category: 'Wet Food',
    brand: 'Felix',
    price: '৳320',
    page: 'Cat Food',
    route: '/cat-food',
    keywords: ['felix', 'wet', 'food', 'good', 'looks']
  },
  {
    id: 'cat-5',
    name: 'Me-O Cat Treats Tuna',
    category: 'Cat Treats',
    brand: 'Me-O',
    price: '৳180',
    page: 'Cat Food',
    route: '/cat-food',
    keywords: ['me-o', 'treats', 'tuna', 'snack']
  },
  {
    id: 'cat-6',
    name: 'Purina Pro Plan Premium Dry',
    category: 'Premium Dry',
    brand: 'Purina',
    price: '৳3,200',
    page: 'Cat Food',
    route: '/cat-food',
    keywords: ['purina', 'pro', 'plan', 'premium', 'dry']
  },

  // Dog Food Products
  {
    id: 'dog-1',
    name: 'Royal Canin Medium Adult Dog Food',
    category: 'Dog Adult Food',
    brand: 'Royal Canin',
    price: '৳2,250',
    page: 'Dog Food',
    route: '/dog-food',
    keywords: ['royal', 'canin', 'medium', 'adult', 'dog', 'food']
  },
  {
    id: 'dog-2',
    name: 'Pedigree Puppy Dry Food Chicken',
    category: 'Puppy Dry Food',
    brand: 'Pedigree',
    price: '৳850',
    page: 'Dog Food',
    route: '/dog-food',
    keywords: ['pedigree', 'puppy', 'dry', 'chicken', 'food']
  },
  {
    id: 'dog-3',
    name: 'Hills Science Diet Puppy Food',
    category: 'Puppy Food',
    brand: 'Hills',
    price: '৳1,850',
    page: 'Dog Food',
    route: '/dog-food',
    keywords: ['hills', 'science', 'diet', 'puppy', 'food']
  },
  {
    id: 'dog-4',
    name: 'Cesar Adult Dog Treats',
    category: 'Adult Treats',
    brand: 'Cesar',
    price: '৳420',
    page: 'Dog Food',
    route: '/dog-food',
    keywords: ['cesar', 'adult', 'dog', 'treats', 'snack']
  },
  {
    id: 'dog-5',
    name: 'Nutro Max Adult Dry Food',
    category: 'Adult Dry Food',
    brand: 'Nutro',
    price: '৳3,200',
    page: 'Dog Food',
    route: '/dog-food',
    keywords: ['nutro', 'max', 'adult', 'dry', 'food']
  },
  {
    id: 'dog-6',
    name: 'Cosequin Dog Joint Health',
    category: 'Health Supplements',
    brand: 'Cosequin',
    price: '৳1,850',
    page: 'Dog Food',
    route: '/dog-food',
    keywords: ['cosequin', 'joint', 'health', 'supplements', 'vitamins']
  },

  // Cat Toys Products
  {
    id: 'toy-1',
    name: 'Interactive Feather Wand Toy',
    category: 'Feather Toys',
    brand: 'PetSafe',
    price: '৳650',
    page: 'Cat Toys',
    route: '/cat-toys',
    keywords: ['interactive', 'feather', 'wand', 'toy', 'play']
  },
  {
    id: 'toy-2',
    name: 'Catnip Filled Mouse Toys Set',
    category: 'Catnip Toys',
    brand: 'Kong',
    price: '৳350',
    page: 'Cat Toys',
    route: '/cat-toys',
    keywords: ['catnip', 'mouse', 'toys', 'set', 'play']
  },
  {
    id: 'toy-3',
    name: 'Automatic Laser Pointer',
    category: 'Laser Pointers',
    brand: 'PetLibro',
    price: '৳1,200',
    page: 'Cat Toys',
    route: '/cat-toys',
    keywords: ['automatic', 'laser', 'pointer', 'electronic']
  },
  {
    id: 'toy-4',
    name: 'Multi-Level Cat Tree Tower',
    category: 'Cat Trees',
    brand: 'Armarkat',
    price: '৳8,500',
    page: 'Cat Toys',
    route: '/cat-toys',
    keywords: ['multi', 'level', 'cat', 'tree', 'tower', 'scratching']
  },
  {
    id: 'toy-5',
    name: 'Cat Tunnel Play System',
    category: 'Cat Tunnels',
    brand: 'Pawaboo',
    price: '৳1,850',
    page: 'Cat Toys',
    route: '/cat-toys',
    keywords: ['cat', 'tunnel', 'play', 'system', 'collapsible']
  },
  {
    id: 'toy-6',
    name: 'Electronic Motion Fish Toy',
    category: 'Electronic Toys',
    brand: 'Potaroma',
    price: '৳950',
    page: 'Cat Toys',
    route: '/cat-toys',
    keywords: ['electronic', 'motion', 'fish', 'toy', 'rechargeable']
  },

  // Cat Litter Products
  {
    id: 'litter-1',
    name: 'Tidy Cats Clumping Litter',
    category: 'Clumping Cat Litter',
    brand: 'Tidy Cats',
    price: '৳1,250',
    page: 'Cat Litter',
    route: '/cat-litter',
    keywords: ['tidy', 'cats', 'clumping', 'litter', 'clay']
  },
  {
    id: 'litter-2',
    name: 'Ever Clean Scented Multi-Cat',
    category: 'Scented Litter',
    brand: 'Ever Clean',
    price: '৳1,850',
    page: 'Cat Litter',
    route: '/cat-litter',
    keywords: ['ever', 'clean', 'scented', 'multi', 'cat', 'litter']
  },
  {
    id: 'litter-3',
    name: 'Stainless Steel Litter Scoop',
    category: 'Litter Scoop',
    brand: 'iPrimio',
    price: '৳450',
    page: 'Cat Litter',
    route: '/cat-litter',
    keywords: ['stainless', 'steel', 'litter', 'scoop', 'tool']
  },
  {
    id: 'litter-4',
    name: 'Covered Cat Litter Box Large',
    category: 'Covered Litter Box',
    brand: 'Petmate',
    price: '৳2,200',
    page: 'Cat Litter',
    route: '/cat-litter',
    keywords: ['covered', 'cat', 'litter', 'box', 'large', 'enclosed']
  },
  {
    id: 'litter-5',
    name: 'Washable Litter Mat',
    category: 'Litter Mat',
    brand: 'Gorilla Grip',
    price: '৳850',
    page: 'Cat Litter',
    route: '/cat-litter',
    keywords: ['washable', 'litter', 'mat', 'gorilla', 'grip']
  },
  {
    id: 'litter-6',
    name: 'PetSafe ScoopFree Self-Cleaning',
    category: 'Self-Cleaning Box',
    brand: 'PetSafe',
    price: '৳15,000',
    page: 'Cat Litter',
    route: '/cat-litter',
    keywords: ['petsafe', 'scoopfree', 'self', 'cleaning', 'automatic']
  },

  // Reflex Products
  {
    id: 'reflex-1',
    name: 'Reflex Plus Adult Cat Food Chicken',
    category: 'Cat Food',
    brand: 'Reflex',
    price: '৳1,850',
    page: 'Reflex',
    route: '/reflex',
    keywords: ['reflex', 'plus', 'adult', 'cat', 'food', 'chicken', 'premium']
  },
  {
    id: 'reflex-2',
    name: 'Reflex Plus Puppy Food Lamb & Rice',
    category: 'Puppy Food',
    brand: 'Reflex',
    price: '৳2,200',
    page: 'Reflex',
    route: '/reflex',
    keywords: ['reflex', 'plus', 'puppy', 'food', 'lamb', 'rice']
  },
  {
    id: 'reflex-3',
    name: 'Reflex Plus Kitten Food Salmon',
    category: 'Kitten Food',
    brand: 'Reflex',
    price: '৳1,650',
    page: 'Reflex',
    route: '/reflex',
    keywords: ['reflex', 'plus', 'kitten', 'food', 'salmon', 'dha']
  },
  {
    id: 'reflex-4',
    name: 'Reflex Plus Adult Dog Food Beef',
    category: 'Dog Food',
    brand: 'Reflex',
    price: '৳2,450',
    page: 'Reflex',
    route: '/reflex',
    keywords: ['reflex', 'plus', 'adult', 'dog', 'food', 'beef']
  },
  {
    id: 'reflex-5',
    name: 'Reflex Grain-Free Cat Food Turkey',
    category: 'Grain-Free',
    brand: 'Reflex',
    price: '৳2,800',
    page: 'Reflex',
    route: '/reflex',
    keywords: ['reflex', 'grain', 'free', 'cat', 'food', 'turkey']
  },
  {
    id: 'reflex-6',
    name: 'Reflex Senior Dog Food Formula',
    category: 'Senior Pet Food',
    brand: 'Reflex',
    price: '৳2,600',
    page: 'Reflex',
    route: '/reflex',
    keywords: ['reflex', 'senior', 'dog', 'food', 'formula', 'joint']
  }
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