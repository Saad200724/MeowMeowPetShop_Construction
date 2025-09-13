import { User, Category, Brand, Product, BlogPost, Order } from "@shared/models";
import type { IUser, ICategory, IBrand, IProduct, IBlogPost } from "@shared/models";
import { nanoid } from "nanoid";

// Simple storage for the pet shop
interface SimpleProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

interface SimpleCategory {
  id: string;
  name: string;
  products: SimpleProduct[];
}

interface SimpleBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
}

interface InsertUser {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: any;
  profilePicture?: string;
  role?: string;
  isActive?: boolean;
}

interface InsertBlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  publishedAt?: Date;
  tags?: string[];
  isPublished?: boolean;
}

export interface IStorage {
  getCategories(): Promise<SimpleCategory[]>;
  getBrands(): Promise<SimpleBrand[]>;
  getProducts(): Promise<SimpleProduct[]>;
  getProduct(id: string): Promise<SimpleProduct | undefined>;
  createProduct(product: Omit<SimpleProduct, 'id'>): Promise<SimpleProduct>;
  updateProduct(id: string, product: Partial<SimpleProduct>): Promise<SimpleProduct | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getUser(id: string): Promise<IUser | undefined>;
  getUserByUsername(username: string): Promise<IUser | undefined>;
  getUserByEmail(email: string): Promise<IUser | undefined>;
  createUser(insertUser: InsertUser): Promise<IUser>;
  updateUser(id: string, userData: Partial<InsertUser>): Promise<IUser | undefined>;
  getBlogPosts(): Promise<IBlogPost[]>;
  getBlogPost(id: string): Promise<IBlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<IBlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<IBlogPost>;
  updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<IBlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private categories: SimpleCategory[];

  constructor() {
    this.categories = [
      {
        id: 'cat-food',
        name: 'Cat Food',
        products: []
      },
      {
        id: 'dog-food', 
        name: 'Dog Food',
        products: []
      },
      {
        id: 'cat-toys',
        name: 'Cat Toys',
        products: []
      },
      {
        id: 'cat-litter',
        name: 'Cat Litter',
        products: []
      },
      {
        id: 'cat-care-health',
        name: 'Cat Care & Health',
        products: []
      },
      {
        id: 'clothing-beds-carrier',
        name: 'Clothing, Beds & Carrier',
        products: []
      },
      {
        id: 'cat-accessories',
        name: 'Cat Accessories',
        products: []
      },
      {
        id: 'dog-health-accessories',
        name: 'Dog Health & Accessories',
        products: []
      },
      {
        id: 'rabbit-food-accessories',
        name: 'Rabbit Food & Accessories',
        products: []
      },
      {
        id: 'bird-food-accessories',
        name: 'Bird Food & Accessories',
        products: []
      }
    ];
  }

  async getUser(id: string): Promise<IUser | undefined> {
    const user = await User.findById(id);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    const user = await User.findOne({ username });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await User.findOne({ email });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    // Prevent any new admin users from being created
    const userToInsert = { ...insertUser, role: "user" };
    
    const user = new User(userToInsert);
    await user.save();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<IUser | undefined> {
    const user = await User.findByIdAndUpdate(
      id,
      { ...userData, updatedAt: new Date() },
      { new: true }
    );
    return user || undefined;
  }

  async getProduct(id: string): Promise<SimpleProduct | undefined> {
    try {
      const product = await Product.findById(id);
      if (!product) return undefined;

      const category = await Category.findById(product.categoryId);
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: category?.name || 'uncategorized',
        image: product.image,
        rating: product.rating || 0,
        stock: product.stockQuantity || 0,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(productData: Omit<SimpleProduct, 'id'>): Promise<SimpleProduct> {
    // Find or create category
    let categoryRecord = await Category.findOne({ name: productData.category });
    if (!categoryRecord) {
      categoryRecord = new Category({
        name: productData.category,
        slug: productData.category.toLowerCase().replace(/\s+/g, '-'),
      });
      await categoryRecord.save();
    }

    // Create a default brand if needed
    let brandRecord = await Brand.findOne();
    if (!brandRecord) {
      brandRecord = new Brand({
        name: 'Default Brand',
        slug: 'default-brand',
      });
      await brandRecord.save();
    }

    const newProduct = new Product({
      name: productData.name,
      description: `High-quality ${productData.name}`,
      price: productData.price,
      categoryId: (categoryRecord._id as any).toString(),
      brandId: (brandRecord._id as any).toString(),
      image: productData.image,
      rating: productData.rating,
      stockQuantity: productData.stock,
    });

    await newProduct.save();

    return {
      id: (newProduct._id as any).toString(),
      name: newProduct.name,
      slug: newProduct.slug,
      price: newProduct.price,
      category: productData.category,
      image: newProduct.image,
      rating: newProduct.rating || 0,
      stock: newProduct.stockQuantity || 0,
    };
  }

  async updateProduct(id: string, productData: Partial<SimpleProduct>): Promise<SimpleProduct | undefined> {
    try {
      const updateData: any = {};
      
      if (productData.name) updateData.name = productData.name;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.image) updateData.image = productData.image;
      if (productData.rating !== undefined) updateData.rating = productData.rating;
      if (productData.stock !== undefined) updateData.stockQuantity = productData.stock;
      
      updateData.updatedAt = new Date();

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) return undefined;

      return this.getProduct(id);
    } catch (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async getCategories(): Promise<SimpleCategory[]> {
    try {
      // Get categories and their products from database
      const dbCategories = await Category.find({ isActive: true });
      const dbProducts = await Product.find({ isActive: true });

      const categoriesWithProducts = dbCategories.map(cat => ({
        id: cat.slug,
        name: cat.name,
        products: dbProducts
          .filter(prod => prod.categoryId.toString() === cat.id)
          .map(prod => ({
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            category: cat.slug,
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0,
          }))
      }));

      // If no categories in database, return the in-memory ones and seed the database
      if (categoriesWithProducts.length === 0) {
        await this.seedDatabase();
        return this.categories;
      }

      return categoriesWithProducts;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to in-memory data
      return this.categories;
    }
  }

  async getBrands(): Promise<SimpleBrand[]> {
    try {
      const allowedBrands = ['nekko', 'purina', 'one', 'reflex', 'reflex-plus', 'royal-canin', 'sheba'];
      const dbBrands = await Brand.find({ isActive: true, slug: { $in: allowedBrands } });
      return dbBrands.map(brand => ({
        id: brand.id.toString(),
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || '',
        description: brand.description || ''
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  async getProducts(): Promise<SimpleProduct[]> {
    try {
      const dbProducts = await Product.find({ isActive: true });

      if (dbProducts.length === 0) {
        await this.seedDatabase();
        return this.categories.flatMap(cat => cat.products);
      }

      const productsWithCategory = [];
      for (const prod of dbProducts) {
        try {
          const category = await Category.findById(prod.categoryId);
          productsWithCategory.push({
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            category: category?.slug || 'uncategorized',
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0,
          });
        } catch (categoryError) {
          // If category lookup fails, still include the product with default category
          console.warn('Failed to find category for product:', prod.name, categoryError);
          productsWithCategory.push({
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            category: 'uncategorized',
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0,
          });
        }
      }

      return productsWithCategory;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Blog CRUD operations
  async getBlogPosts(): Promise<IBlogPost[]> {
    try {
      const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
      return blogPosts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<IBlogPost | undefined> {
    try {
      const blogPost = await BlogPost.findById(id);
      return blogPost || undefined;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<IBlogPost | undefined> {
    try {
      const blogPost = await BlogPost.findOne({ slug });
      return blogPost || undefined;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return undefined;
    }
  }

  async createBlogPost(blogPostData: InsertBlogPost): Promise<IBlogPost> {
    try {
      const newBlogPost = new BlogPost(blogPostData);
      await newBlogPost.save();
      return newBlogPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id: string, blogPostData: Partial<InsertBlogPost>): Promise<IBlogPost | undefined> {
    try {
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        id,
        { ...blogPostData, updatedAt: new Date() },
        { new: true }
      );
      return updatedBlogPost || undefined;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return undefined;
    }
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const result = await BlogPost.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  private async seedDatabase(): Promise<void> {
    try {
      console.log('Seeding database with initial data...');
      
      // Create brands first
      const brandsToCreate = [
        { name: 'NEKKO', slug: 'nekko' },
        { name: 'PURINA', slug: 'purina' },
        { name: 'ONE', slug: 'one' },
        { name: 'Reflex', slug: 'reflex' },
        { name: 'Reflex Plus', slug: 'reflex-plus' },
        { name: 'ROYAL CANIN', slug: 'royal-canin' },
        { name: 'Sheba', slug: 'sheba' }
      ];

      for (const brandData of brandsToCreate) {
        const existingBrand = await Brand.findOne({ slug: brandData.slug });
        if (!existingBrand) {
          const newBrand = new Brand({
            name: brandData.name,
            slug: brandData.slug,
          });
          await newBrand.save();
        }
      }
      
      // Create categories
      for (const category of this.categories) {
        const existingCategory = await Category.findOne({ slug: category.id });
        if (!existingCategory) {
          const dbCategory = new Category({
            name: category.name,
            slug: category.id,
          });
          await dbCategory.save();

          // Create default brand if needed
          let brand = await Brand.findOne({ name: 'NEKKO' });
          if (!brand) {
            brand = new Brand({
              name: 'NEKKO',
              slug: 'nekko',
            });
            await brand.save();
          }

          // Create products for this category
          for (const product of category.products) {
            const existingProduct = await Product.findOne({ name: product.name });
            if (!existingProduct) {
              const newProduct = new Product({
                name: product.name,
                description: `High-quality ${product.name}`,
                price: product.price,
                categoryId: (dbCategory._id as any).toString(),
                brandId: (brand._id as any).toString(),
                image: product.image,
                rating: product.rating,
                stockQuantity: product.stock,
              });
              await newProduct.save();
            }
          }
        }
      }
      
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}

export const storage = new DatabaseStorage();