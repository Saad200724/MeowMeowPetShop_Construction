import { 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Brand,
  type InsertBrand,
  type Product,
  type InsertProduct,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Products
  getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    isNew?: boolean;
    isBestseller?: boolean;
    isOnSale?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Blog Posts
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Testimonials
  getTestimonials(approved?: boolean): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private brands: Map<string, Brand>;
  private products: Map<string, Product>;
  private blogPosts: Map<string, BlogPost>;
  private testimonials: Map<string, Testimonial>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.products = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample categories
    const catFoodCategory: Category = {
      id: randomUUID(),
      name: "Cat Food",
      slug: "cat-food",
      description: "Premium food for cats of all ages",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      parentId: null
    };
    
    const dogFoodCategory: Category = {
      id: randomUUID(),
      name: "Dog Food", 
      slug: "dog-food",
      description: "Nutritious food for dogs of all sizes",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      parentId: null
    };
    
    this.categories.set(catFoodCategory.id, catFoodCategory);
    this.categories.set(dogFoodCategory.id, dogFoodCategory);

    // Sample brands
    const royalCanin: Brand = {
      id: randomUUID(),
      name: "Royal Canin",
      slug: "royal-canin",
      description: "Premium pet nutrition brand",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      logo: null
    };
    
    this.brands.set(royalCanin.id, royalCanin);

    // Sample products
    const premiumCatFood: Product = {
      id: randomUUID(),
      name: "Premium Dry Cat Food (5kg)",
      description: "High-quality dry cat food with real chicken and essential nutrients",
      price: "2400.00",
      categoryId: catFoodCategory.id,
      brandId: royalCanin.id,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      rating: "5.00",
      reviews: 124,
      stockStatus: "In Stock",
      stockQuantity: 50,
      tags: ["premium", "bestseller", "chicken"],
      isBestseller: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      originalPrice: null,
      images: null,
      features: null,
      specifications: null,
      isNew: false,
      isOnSale: false,
      discount: 0
    };
    
    this.products.set(premiumCatFood.id, premiumCatFood);

    // Sample blog posts
    const blogPost1: BlogPost = {
      id: randomUUID(),
      title: "10 Essential Tips for New Pet Owners",
      slug: "essential-tips-new-pet-owners",
      excerpt: "Starting your journey as a pet parent? Here are the essential tips every new pet owner should know.",
      content: "Full blog content here...",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      author: "Dr. Sarah Ahmed",
      publishedAt: new Date("2024-03-15"),
      tags: ["tips", "new-owners", "pets"],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.blogPosts.set(blogPost1.id, blogPost1);

    // Sample testimonials
    const testimonial1: Testimonial = {
      id: randomUUID(),
      name: "Sarah Rahman",
      role: "Cat Parent",
      location: "Savar",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      text: "Meow Meow Pet Shop has the best quality pet food in Savar! My cat Luna loves their premium kibble and the delivery is always on time. Highly recommended!",
      rating: 5,
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.testimonials.set(testimonial1.id, testimonial1);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  // Brand methods
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values()).filter(brand => brand.isActive);
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const brand: Brand = {
      ...insertBrand,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.brands.set(id, brand);
    return brand;
  }

  // Product methods
  async getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    isNew?: boolean;
    isBestseller?: boolean;
    isOnSale?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (filters) {
      if (filters.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters.brandId) {
        products = products.filter(p => p.brandId === filters.brandId);
      }
      if (filters.isNew !== undefined) {
        products = products.filter(p => p.isNew === filters.isNew);
      }
      if (filters.isBestseller !== undefined) {
        products = products.filter(p => p.isBestseller === filters.isBestseller);
      }
      if (filters.isOnSale !== undefined) {
        products = products.filter(p => p.isOnSale === filters.isOnSale);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.offset) {
        products = products.slice(filters.offset);
      }
      if (filters.limit) {
        products = products.slice(0, filters.limit);
      }
    }

    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...updates,
      id, // ensure id doesn't change
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Blog post methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    if (published !== undefined) {
      posts = posts.filter(p => p.isPublished === published);
    }
    return posts.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.blogPosts.set(id, post);
    return post;
  }

  // Testimonial methods
  async getTestimonials(approved?: boolean): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());
    if (approved !== undefined) {
      testimonials = testimonials.filter(t => t.isApproved === approved);
    }
    return testimonials.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
