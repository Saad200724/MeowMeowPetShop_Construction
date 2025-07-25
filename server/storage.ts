import { type Category, type Product, type Review, type CartItem, type InsertCategory, type InsertProduct, type InsertReview, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getFeaturedCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getFlashSaleProducts(): Promise<Product[]>;
  getBestSellerProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Reviews
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private reviews: Map<string, Review>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoriesData: Category[] = [
      {
        id: "cat-food",
        name: "Cat Food",
        slug: "cat-food",
        description: "Premium cat food for all ages",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/01/category-image-cat-1735681137.jpg",
        parentId: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "adult-food",
        name: "Adult Food",
        slug: "adult-food",
        description: "Nutritious food for adult cats",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/adult-food-2-1747499026.png",
        parentId: "cat-food",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "kitten-food",
        name: "Kitten Food",
        slug: "kitten-food",
        description: "Special nutrition for kittens",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/kitten-food-2-1747508016.png",
        parentId: "cat-food",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "cat-accessories",
        name: "Cat Accessories",
        slug: "cat-accessories",
        description: "Essential accessories for your cat",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/05/collar-1747508281.png",
        parentId: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "cat-litter",
        name: "Cat Litter",
        slug: "cat-litter",
        description: "High-quality cat litter products",
        image: "https://mewmewshopbd.com/uploads/category/2024/1718325625.png",
        parentId: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "cat-toys",
        name: "Cat Toys",
        slug: "cat-toys",
        description: "Fun toys to keep your cat entertained",
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        parentId: null,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    categoriesData.forEach(category => this.categories.set(category.id, category));

    // Initialize products
    const productsData: Product[] = [
      // Flash Sale Products
      {
        id: "bioline-chicken-treat",
        name: "Bioline Smooth Paté Chicken Recipe Cat Treat",
        slug: "bioline-chicken-treat",
        description: "Premium chicken recipe cat treat with smooth paté texture",
        shortDescription: "Delicious chicken flavored treat for cats",
        price: "190",
        originalPrice: "220",
        discountAmount: "30",
        categoryId: "cat-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/04/biolin-chicken-recipe-treat-1745864348.jpg",
        images: [],
        inStock: true,
        stockQuantity: 50,
        rating: "4.5",
        reviewCount: 28,
        isFeatured: false,
        isFlashSale: true,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "bioline-tuna-treat",
        name: "Bioline Smooth Paté Tuna Flavor Cat Treat",
        slug: "bioline-tuna-treat",
        description: "Premium tuna flavor cat treat with smooth paté texture",
        shortDescription: "Delicious tuna flavored treat for cats",
        price: "190",
        originalPrice: "220",
        discountAmount: "30",
        categoryId: "cat-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2025/04/biolin-tuna-treat-1745863912.jpg",
        images: [],
        inStock: true,
        stockQuantity: 45,
        rating: "4.7",
        reviewCount: 32,
        isFeatured: false,
        isFlashSale: true,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "cat-playing-ball",
        name: "Cats Toys Playing ball with bell-(1Pcs)",
        slug: "cat-playing-ball",
        description: "Colorful playing ball with bell for cats entertainment",
        shortDescription: "Fun ball toy with bell for cats",
        price: "40",
        originalPrice: "45",
        discountAmount: "5",
        categoryId: "cat-toys",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2021/08/20210816183234Capture-1732701343.jpg",
        images: [],
        inStock: true,
        stockQuantity: 100,
        rating: "4.2",
        reviewCount: 15,
        isFeatured: false,
        isFlashSale: true,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "proline-adult-cat-food",
        name: "Proline Adult Cat Food Chicken Tavuklu",
        slug: "proline-adult-cat-food",
        description: "Premium adult cat food with chicken flavor",
        shortDescription: "Nutritious chicken flavored cat food for adults",
        price: "560",
        originalPrice: "720",
        discountAmount: "160",
        categoryId: "adult-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2024/09/1726894624_proline-adult-cat-food-chicken-tavuklu-1732701400.jpg",
        images: [],
        inStock: true,
        stockQuantity: 25,
        rating: "4.6",
        reviewCount: 45,
        isFeatured: false,
        isFlashSale: true,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      // Best Seller Products
      {
        id: "smartheart-kitten-tuna-jelly",
        name: "Smartheart Pouch Kitten Food Tuna In Jelly 85g",
        slug: "smartheart-kitten-tuna-jelly",
        description: "Premium kitten food with tuna in jelly",
        shortDescription: "Nutritious tuna in jelly for kittens",
        price: "85",
        originalPrice: null,
        discountAmount: null,
        categoryId: "kitten-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2021/08/20210816183310Tuna-with-Chicken-In-Jelly-Kitten-e1605692024952-1732701344.png",
        images: [],
        inStock: true,
        stockQuantity: 75,
        rating: "4.5",
        reviewCount: 68,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: true,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "whiskas-junior-mackerel",
        name: "Whiskas Pouch Cat Food Junior Mackerel 80g",
        slug: "whiskas-junior-mackerel",
        description: "Premium junior cat food with mackerel flavor",
        shortDescription: "Delicious mackerel flavored food for junior cats",
        price: "85",
        originalPrice: null,
        discountAmount: null,
        categoryId: "kitten-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2021/08/1718979891_whiskas-pouch-cat-food-junior-mackerel-80g-1732701344.jpg",
        images: [],
        inStock: true,
        stockQuantity: 80,
        rating: "5.0",
        reviewCount: 92,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: true,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "nekko-kitten-tuna-mousse",
        name: "NEKKO Kitten Pouch Tuna Mousse 70gm",
        slug: "nekko-kitten-tuna-mousse",
        description: "Premium kitten food with tuna mousse texture",
        shortDescription: "Smooth tuna mousse for kittens",
        price: "85",
        originalPrice: null,
        discountAmount: null,
        categoryId: "kitten-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2021/08/20210816183317Nekko-...-Tuna-Mouse--e1605691935623-1732701344.png",
        images: [],
        inStock: true,
        stockQuantity: 60,
        rating: "4.0",
        reviewCount: 34,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: true,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "smartheart-sardine-chicken-rice",
        name: "SmartHeart Cat Pouch Sardine With Chicken & Rice Flavour 85g",
        slug: "smartheart-sardine-chicken-rice",
        description: "Premium cat food with sardine, chicken and rice",
        shortDescription: "Nutritious multi-flavor cat food",
        price: "85",
        originalPrice: null,
        discountAmount: null,
        categoryId: "cat-food",
        image: "https://media.mewmewshopbd.com/uploads/media-manager/2023/12/202312242014251-10-1732701373.jpg",
        images: [],
        inStock: true,
        stockQuantity: 55,
        rating: "4.5",
        reviewCount: 41,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: true,
        isActive: true,
        createdAt: new Date(),
      },
      // Additional Products for Grid Display
      {
        id: "royal-canin-persian-adult",
        name: "Royal Canin Persian Adult Cat Food 2kg",
        slug: "royal-canin-persian-adult",
        description: "Specialized nutrition for Persian cats aged 12 months and over",
        shortDescription: "Premium Persian cat food",
        price: "2800",
        originalPrice: null,
        discountAmount: null,
        categoryId: "adult-food",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 20,
        rating: "4.8",
        reviewCount: 156,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "hills-kitten-dry-food",
        name: "Hill's Science Diet Kitten Dry Food 1.5kg",
        slug: "hills-kitten-dry-food",
        description: "Complete nutrition for growing kittens",
        shortDescription: "Hill's kitten nutrition",
        price: "1950",
        originalPrice: "2100",
        discountAmount: "150",
        categoryId: "kitten-food",
        image: "https://images.unsplash.com/photo-1606476636718-e9e6b808e9d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 35,
        rating: "4.6",
        reviewCount: 89,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "purina-pro-plan-adult",
        name: "Purina Pro Plan Adult Cat Food Chicken 1.5kg",
        slug: "purina-pro-plan-adult",
        description: "High protein adult cat food with real chicken",
        shortDescription: "Pro Plan chicken formula",
        price: "1680",
        originalPrice: null,
        discountAmount: null,
        categoryId: "adult-food",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 42,
        rating: "4.4",
        reviewCount: 67,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "felix-wet-food-variety",
        name: "Felix Wet Food Variety Pack 12x85g",
        slug: "felix-wet-food-variety",
        description: "Delicious variety pack of wet cat food",
        shortDescription: "Felix variety pack",
        price: "890",
        originalPrice: "950",
        discountAmount: "60",
        categoryId: "cat-food",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 88,
        rating: "4.3",
        reviewCount: 124,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "interactive-cat-toy-mouse",
        name: "Interactive Electronic Mouse Cat Toy",
        slug: "interactive-cat-toy-mouse",
        description: "Motion activated electronic mouse toy for cats",
        shortDescription: "Electronic mouse toy",
        price: "650",
        originalPrice: null,
        discountAmount: null,
        categoryId: "cat-toys",
        image: "https://images.unsplash.com/photo-1582725342632-89ba4fa4b556?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 25,
        rating: "4.1",
        reviewCount: 34,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "cat-scratch-post-large",
        name: "Large Cat Scratch Post with Platforms",
        slug: "cat-scratch-post-large",
        description: "Multi-level scratching post with play platforms",
        shortDescription: "Large scratch post",
        price: "3200",
        originalPrice: "3600",
        discountAmount: "400",
        categoryId: "cat-accessories",
        image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 12,
        rating: "4.7",
        reviewCount: 78,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "premium-cat-litter-10kg",
        name: "Premium Clumping Cat Litter 10kg",
        slug: "premium-cat-litter-10kg",
        description: "Ultra-absorbent clumping cat litter with odor control",
        shortDescription: "Premium clumping litter",
        price: "1450",
        originalPrice: null,
        discountAmount: null,
        categoryId: "cat-litter",
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 60,
        rating: "4.5",
        reviewCount: 92,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "cat-carrier-travel",
        name: "Portable Cat Travel Carrier",
        slug: "cat-carrier-travel",
        description: "Comfortable and secure travel carrier for cats",
        shortDescription: "Travel carrier",
        price: "2100",
        originalPrice: "2400",
        discountAmount: "300",
        categoryId: "cat-accessories",
        image: "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 18,
        rating: "4.6",
        reviewCount: 45,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "omega-3-cat-supplements",
        name: "Omega-3 Cat Health Supplements 60 Capsules",
        slug: "omega-3-cat-supplements",
        description: "Essential omega-3 supplements for cat health",
        shortDescription: "Omega-3 supplements",
        price: "780",
        originalPrice: null,
        discountAmount: null,
        categoryId: "cat-food",
        image: "https://images.unsplash.com/photo-1628191081161-5e6d1c67ad94?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 75,
        rating: "4.2",
        reviewCount: 58,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "catnip-spray-200ml",
        name: "Natural Catnip Spray 200ml",
        slug: "catnip-spray-200ml",
        description: "100% natural catnip spray to attract and stimulate cats",
        shortDescription: "Natural catnip spray",
        price: "420",
        originalPrice: "480",
        discountAmount: "60",
        categoryId: "cat-toys",
        image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 95,
        rating: "4.0",
        reviewCount: 37,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "automatic-feeder-smart",
        name: "Smart Automatic Cat Feeder with Timer",
        slug: "automatic-feeder-smart",
        description: "Programmable automatic feeder with portion control",
        shortDescription: "Smart auto feeder",
        price: "4500",
        originalPrice: null,
        discountAmount: null,
        categoryId: "cat-accessories",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 8,
        rating: "4.8",
        reviewCount: 123,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "grooming-brush-deshedding",
        name: "Professional De-shedding Grooming Brush",
        slug: "grooming-brush-deshedding",
        description: "Effective de-shedding brush for all cat breeds",
        shortDescription: "De-shedding brush",
        price: "890",
        originalPrice: "1050",
        discountAmount: "160",
        categoryId: "cat-accessories",
        image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        stockQuantity: 42,
        rating: "4.4",
        reviewCount: 67,
        isFeatured: true,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    productsData.forEach(product => this.products.set(product.id, product));

    // Initialize reviews
    const reviewsData: Review[] = [
      {
        id: "review-1",
        customerName: "Rahul Ahmed",
        customerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        petName: "Whiskers",
        rating: 5,
        comment: "Amazing quality products! My cat Whiskers absolutely loves the Smartheart food. Fast delivery and excellent customer service.",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        id: "review-2",
        customerName: "Fatima Khan",
        customerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        petName: "Bella",
        rating: 5,
        comment: "Best pet shop in Bangladesh! The variety of products is incredible and the prices are very reasonable. Highly recommended!",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        id: "review-3",
        customerName: "Karim Hassan",
        customerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        petName: "Max",
        rating: 5,
        comment: "Exceptional quality and service! My dog Max is healthier and happier since we started shopping here. Will definitely order again!",
        isVerified: true,
        createdAt: new Date(),
      },
    ];

    reviewsData.forEach(review => this.reviews.set(review.id, review));
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.isActive);
  }

  async getFeaturedCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.isActive && !c.parentId);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug && c.isActive);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id, createdAt: new Date() };
    this.categories.set(id, category);
    return category;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId && p.isActive);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isFeatured && p.isActive);
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isFlashSale && p.isActive);
  }

  async getBestSellerProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isBestSeller && p.isActive);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug && p.isActive);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    return review;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt: new Date() };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
  }
}

export const storage = new MemStorage();
