// server/index.ts
import dotenv from "dotenv";
import express2 from "express";

// server/mongodb.ts
import mongoose from "mongoose";
var connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error("MONGODB_URI or DATABASE_URL must be set");
    }
    await mongoose.connect(mongoURI, {
      dbName: "petshop"
      // Explicitly set database name
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

// server/routes.ts
import { createServer } from "http";
import mongoose4 from "mongoose";

// shared/models.ts
import mongoose2, { Schema } from "mongoose";
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  phone: String,
  address: Schema.Types.Mixed,
  profilePicture: String,
  role: { type: String, default: "user" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parentId: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var brandSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: String,
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  categoryId: { type: String, required: true },
  brandId: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  stockStatus: { type: String, default: "In Stock" },
  stockQuantity: { type: Number, default: 0 },
  subcategory: { type: String, default: "" },
  tags: [String],
  features: [String],
  specifications: Schema.Types.Mixed,
  isNew: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});
var blogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  image: String,
  author: { type: String, required: true },
  publishedAt: Date,
  category: String,
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });
var orderSchema = new Schema({
  userId: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  // Unique order number
  status: { type: String, default: "Processing" },
  total: { type: Number, required: true },
  items: [{ type: Schema.Types.Mixed }],
  shippingAddress: Schema.Types.Mixed,
  customerInfo: Schema.Types.Mixed,
  invoiceId: String,
  invoiceNumber: { type: String },
  // Will be same as orderNumber
  paymentMethod: String,
  paymentStatus: { type: String, default: "Pending" }
}, { timestamps: true });
var announcementSchema = new Schema({
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var cartSchema = new Schema({
  userId: String,
  sessionId: String,
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, required: true }
  }],
  total: { type: Number, default: 0 }
}, { timestamps: true });
var invoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: Schema.Types.Mixed
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountCode: { type: String },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });
var couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ["percentage", "fixed", "free_delivery"], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, min: 0 },
  maxDiscountAmount: { type: Number, min: 0 },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var paymentTransactionSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  transactionId: { type: String, sparse: true },
  paymentUrl: String,
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "BDT" },
  customerInfo: {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: String
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled"],
    default: "pending"
  },
  paymentMethod: String,
  paymentFee: { type: Number, min: 0 },
  metadata: Schema.Types.Mixed,
  successUrl: { type: String, required: true },
  cancelUrl: { type: String, required: true },
  webhookUrl: String,
  verifiedAt: Date,
  callbackData: Schema.Types.Mixed
}, { timestamps: true });
var paymentWebhookSchema = new Schema({
  transactionId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  rawData: { type: Schema.Types.Mixed, required: true },
  processed: { type: Boolean, default: false },
  errorMessage: String
}, { timestamps: true });
var bannerSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: String,
  order: { type: Number, default: 1, min: 1, max: 3 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var popupPosterSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
var otpSchema = new Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false }
}, { timestamps: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
var reviewSchema = new Schema({
  productId: { type: String, required: true, index: true },
  userId: { type: String },
  userName: { type: String, required: true },
  userEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });
var User = mongoose2.model("User", userSchema);
var Category = mongoose2.model("Category", categorySchema);
var Brand = mongoose2.model("Brand", brandSchema);
var Product = mongoose2.model("Product", productSchema);
var BlogPost = mongoose2.model("BlogPost", blogPostSchema);
var Order = mongoose2.model("Order", orderSchema);
var Announcement = mongoose2.model("Announcement", announcementSchema);
var Cart = mongoose2.model("Cart", cartSchema);
var Invoice = mongoose2.model("Invoice", invoiceSchema);
var Coupon = mongoose2.model("Coupon", couponSchema);
var PaymentTransaction = mongoose2.model("PaymentTransaction", paymentTransactionSchema);
var PaymentWebhook = mongoose2.model("PaymentWebhook", paymentWebhookSchema);
var Banner = mongoose2.model("Banner", bannerSchema);
var PopupPoster = mongoose2.model("PopupPoster", popupPosterSchema);
var OTP = mongoose2.model("OTP", otpSchema);
var Review = mongoose2.model("Review", reviewSchema);

// server/storage.ts
import mongoose3 from "mongoose";
var DatabaseStorage = class {
  categories;
  constructor() {
    this.categories = [
      {
        id: "cat-food",
        name: "Cat Food",
        products: []
      },
      {
        id: "dog-food",
        name: "Dog Food",
        products: []
      },
      {
        id: "cat-toys",
        name: "Cat Toys",
        products: []
      },
      {
        id: "cat-litter",
        name: "Cat Litter",
        products: []
      },
      {
        id: "cat-care-health",
        name: "Cat Care & Health",
        products: []
      },
      {
        id: "clothing-beds-carrier",
        name: "Clothing, Beds & Carrier",
        products: []
      },
      {
        id: "cat-accessories",
        name: "Cat Accessories",
        products: []
      },
      {
        id: "dog-health-accessories",
        name: "Dog Health & Accessories",
        products: []
      },
      {
        id: "rabbit-food-accessories",
        name: "Rabbit Food & Accessories",
        products: []
      },
      {
        id: "bird-food-accessories",
        name: "Bird Food & Accessories",
        products: []
      }
    ];
  }
  async getUser(id) {
    const user = await User.findById(id);
    return user || void 0;
  }
  async getUserByUsername(username) {
    const user = await User.findOne({ username });
    return user || void 0;
  }
  async getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user || void 0;
  }
  async createUser(insertUser) {
    const userToInsert = { ...insertUser, role: "user" };
    const user = new User(userToInsert);
    await user.save();
    return user;
  }
  async updateUser(id, userData) {
    const user = await User.findByIdAndUpdate(
      id,
      { ...userData, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    return user || void 0;
  }
  async getProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) return void 0;
      const category = await Category.findById(product.categoryId);
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: category?.name || "uncategorized",
        image: product.image,
        rating: product.rating || 0,
        stock: product.stockQuantity || 0
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      return void 0;
    }
  }
  async createProduct(productData) {
    let categoryRecord = await Category.findOne({ name: productData.category });
    if (!categoryRecord) {
      categoryRecord = new Category({
        name: productData.category,
        slug: productData.category.toLowerCase().replace(/\s+/g, "-")
      });
      await categoryRecord.save();
    }
    let brandRecord = await Brand.findOne();
    if (!brandRecord) {
      brandRecord = new Brand({
        name: "Default Brand",
        slug: "default-brand"
      });
      await brandRecord.save();
    }
    const newProduct = new Product({
      name: productData.name,
      description: `High-quality ${productData.name}`,
      price: productData.price,
      categoryId: categoryRecord._id.toString(),
      brandId: brandRecord._id.toString(),
      image: productData.image,
      rating: productData.rating,
      stockQuantity: productData.stock
    });
    await newProduct.save();
    return {
      id: newProduct._id.toString(),
      name: newProduct.name,
      slug: newProduct.slug,
      price: newProduct.price,
      category: productData.category,
      image: newProduct.image,
      rating: newProduct.rating || 0,
      stock: newProduct.stockQuantity || 0
    };
  }
  async updateProduct(id, productData) {
    try {
      const updateData = {};
      if (productData.name) updateData.name = productData.name;
      if (productData.price !== void 0) updateData.price = productData.price;
      if (productData.image) updateData.image = productData.image;
      if (productData.rating !== void 0) updateData.rating = productData.rating;
      if (productData.stock !== void 0) updateData.stockQuantity = productData.stock;
      updateData.updatedAt = /* @__PURE__ */ new Date();
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) return void 0;
      return this.getProduct(id);
    } catch (error) {
      console.error("Error updating product:", error);
      return void 0;
    }
  }
  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }
  async getCategories() {
    try {
      const dbCategories = await Category.find({ isActive: true });
      const dbProducts = await Product.find({ isActive: true });
      const categoriesWithProducts = dbCategories.map((cat) => ({
        id: cat.slug,
        name: cat.name,
        products: dbProducts.filter((prod) => prod.categoryId.toString() === cat.id).map((prod) => ({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          category: cat.slug,
          image: prod.image,
          rating: prod.rating || 0,
          stock: prod.stockQuantity || 0
        }))
      }));
      if (categoriesWithProducts.length === 0) {
        await this.seedDatabase();
        return this.categories;
      }
      return categoriesWithProducts;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return this.categories;
    }
  }
  async getBrands() {
    try {
      const dbBrands = await Brand.find({});
      return dbBrands.map((brand) => ({
        id: brand._id.toString(),
        _id: brand._id.toString(),
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || "",
        description: brand.description || "",
        isActive: brand.isActive !== false
      }));
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  }
  async getProducts() {
    try {
      const dbProducts = await Product.find({ isActive: true });
      if (dbProducts.length === 0) {
        await this.seedDatabase();
        return this.categories.flatMap((cat) => cat.products);
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
            category: category?.slug || "uncategorized",
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0
          });
        } catch (categoryError) {
          console.warn("Failed to find category for product:", prod.name, categoryError);
          productsWithCategory.push({
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            category: "uncategorized",
            image: prod.image,
            rating: prod.rating || 0,
            stock: prod.stockQuantity || 0
          });
        }
      }
      return productsWithCategory;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
  // Blog CRUD operations
  async getBlogPosts() {
    try {
      const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
      return blogPosts;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }
  async getBlogPost(id) {
    try {
      const blogPost = await BlogPost.findById(id);
      return blogPost || void 0;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return void 0;
    }
  }
  async getBlogPostBySlug(slug) {
    try {
      const blogPost = await BlogPost.findOne({ slug });
      return blogPost || void 0;
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      return void 0;
    }
  }
  async createBlogPost(blogPostData) {
    try {
      const newBlogPost = new BlogPost(blogPostData);
      await newBlogPost.save();
      return newBlogPost;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }
  async updateBlogPost(id, blogPostData) {
    try {
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        id,
        { ...blogPostData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
      return updatedBlogPost || void 0;
    } catch (error) {
      console.error("Error updating blog post:", error);
      return void 0;
    }
  }
  async deleteBlogPost(id) {
    try {
      const result = await BlogPost.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }
  async getBanners() {
    try {
      const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
      return banners;
    } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
  }
  async getActiveBanners() {
    try {
      const Banner2 = mongoose3.model("Banner");
      const banners = await Banner2.find({ isActive: true }).sort({ order: 1 }).limit(3).lean();
      console.log(`Storage: Found ${banners.length} active banners`);
      return banners;
    } catch (error) {
      console.error("Error getting active banners:", error);
      return [];
    }
  }
  async createBanner(bannerData) {
    try {
      const activeBannerCount = await Banner.countDocuments({ isActive: true });
      const newBanner = new Banner({
        ...bannerData,
        isActive: activeBannerCount < 3,
        order: bannerData.order ?? 1
      });
      await newBanner.save();
      return newBanner;
    } catch (error) {
      console.error("Error creating banner:", error);
      throw error;
    }
  }
  async updateBanner(id, bannerData) {
    try {
      if (bannerData.isActive) {
        const activeBannerCount = await Banner.countDocuments({ isActive: true, _id: { $ne: id } });
        if (activeBannerCount >= 3) {
          throw new Error("Maximum 3 banners can be active at once");
        }
      }
      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        { ...bannerData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
      return updatedBanner || void 0;
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  }
  async deleteBanner(id) {
    try {
      const result = await Banner.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting banner:", error);
      return false;
    }
  }
  async getPopupPosters() {
    try {
      const posters = await PopupPoster.find().sort({ createdAt: -1 });
      return posters;
    } catch (error) {
      console.error("Error fetching popup posters:", error);
      return [];
    }
  }
  async getActivePopupPoster() {
    try {
      const poster = await PopupPoster.findOne({ isActive: true }).sort({ createdAt: -1 });
      return poster || void 0;
    } catch (error) {
      console.error("Error fetching active popup poster:", error);
      return void 0;
    }
  }
  async createPopupPoster(posterData) {
    try {
      await PopupPoster.updateMany({}, { isActive: false });
      const newPoster = new PopupPoster({
        ...posterData,
        isActive: true
      });
      await newPoster.save();
      return newPoster;
    } catch (error) {
      console.error("Error creating popup poster:", error);
      throw error;
    }
  }
  async updatePopupPoster(id, posterData) {
    try {
      if (posterData.isActive) {
        await PopupPoster.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
      const updatedPoster = await PopupPoster.findByIdAndUpdate(
        id,
        { ...posterData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
      return updatedPoster || void 0;
    } catch (error) {
      console.error("Error updating popup poster:", error);
      throw error;
    }
  }
  async deletePopupPoster(id) {
    try {
      const result = await PopupPoster.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting popup poster:", error);
      return false;
    }
  }
  async seedDatabase() {
    try {
      console.log("Seeding database with initial data...");
      const brandsToCreate = [
        { name: "NEKKO", slug: "nekko" },
        { name: "PURINA", slug: "purina" },
        { name: "ONE", slug: "one" },
        { name: "Reflex", slug: "reflex" },
        { name: "Reflex Plus", slug: "reflex-plus" },
        { name: "ROYAL CANIN", slug: "royal-canin" },
        { name: "Sheba", slug: "sheba" }
      ];
      for (const brandData of brandsToCreate) {
        const existingBrand = await Brand.findOne({ slug: brandData.slug });
        if (!existingBrand) {
          const newBrand = new Brand({
            name: brandData.name,
            slug: brandData.slug
          });
          await newBrand.save();
        }
      }
      for (const category of this.categories) {
        const existingCategory = await Category.findOne({ slug: category.id });
        if (!existingCategory) {
          const dbCategory = new Category({
            name: category.name,
            slug: category.id
          });
          await dbCategory.save();
          let brand = await Brand.findOne({ name: "NEKKO" });
          if (!brand) {
            brand = new Brand({
              name: "NEKKO",
              slug: "nekko"
            });
            await brand.save();
          }
          for (const product of category.products) {
            const existingProduct = await Product.findOne({ name: product.name });
            if (!existingProduct) {
              const newProduct = new Product({
                name: product.name,
                description: `High-quality ${product.name}`,
                price: product.price,
                categoryId: dbCategory._id.toString(),
                brandId: brand._id.toString(),
                image: product.image,
                rating: product.rating,
                stockQuantity: product.stock
              });
              await newProduct.save();
            }
          }
        }
      }
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
};
var storage = new DatabaseStorage();

// server/slug-utils.ts
function createSlug(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
async function generateUniqueProductSlug(productName, excludeProductId) {
  const baseSlug = createSlug(productName);
  const existingProduct = await Product.findOne({
    slug: baseSlug,
    ...excludeProductId && { _id: { $ne: excludeProductId } }
  });
  if (!existingProduct) {
    return baseSlug;
  }
  let counter = 1;
  let uniqueSlug;
  let foundUnique = false;
  while (!foundUnique && counter <= 1e3) {
    uniqueSlug = `${baseSlug}-${counter}`;
    const conflictingProduct = await Product.findOne({
      slug: uniqueSlug,
      ...excludeProductId && { _id: { $ne: excludeProductId } }
    });
    if (!conflictingProduct) {
      foundUnique = true;
      return uniqueSlug;
    }
    counter++;
  }
  return `${baseSlug}-${Date.now()}`;
}
async function findProductBySlug(slug) {
  return await Product.findOne({ slug, isActive: true });
}
async function migrateProductSlugs() {
  console.log("Starting product slug migration...");
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
  console.log("Product slug migration completed");
}

// server/routes.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";

// server/email-service.ts
import nodemailer from "nodemailer";
var transporter = null;
function initializeEmailService() {
  try {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    if (!emailHost || !emailPort || !emailUser || !emailPassword) {
      console.warn("\u26A0\uFE0F Email credentials not configured. OTP emails will not be sent.");
      return false;
    }
    transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort, 10),
      secure: parseInt(emailPort, 10) === 465,
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });
    console.log("\u2705 Email service initialized successfully");
    return true;
  } catch (error) {
    console.error("\u274C Email service initialization failed:", error);
    return false;
  }
}
async function sendOTPEmail(email, otp) {
  if (!transporter) {
    console.warn("Email service not initialized. Skipping OTP email.");
    return false;
  }
  try {
    const mailOptions = {
      from: `"Meow Meow Pet Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code - Meow Meow Pet Shop",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #26732D 0%, #FFC107 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">\u{1F43E} Meow Meow Pet Shop</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #26732D; margin-top: 0;">Your Verification Code</h2>
            
            <p style="font-size: 16px; color: #555;">
              Thank you for signing up with Meow Meow Pet Shop! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: white; border: 2px solid #26732D; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #888; font-size: 14px; margin-bottom: 10px;">YOUR VERIFICATION CODE</p>
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: #26732D; letter-spacing: 8px;">${otp}</p>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 25px;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            
            <p style="font-size: 14px; color: #888;">
              If you didn't request this code, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              \xA9 2025 Meow Meow Pet Shop. All rights reserved.<br>
              Your trusted pet supply store.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Your Meow Meow Pet Shop verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.`
    };
    await transporter.sendMail(mailOptions);
    console.log(`\u2705 OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send OTP email:", error);
    return false;
  }
}
function generateOTP() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}

// server/routes.ts
function generateUniqueOrderNumber() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp.toUpperCase()}-${randomPart.toUpperCase()}`;
}
async function registerRoutes(app2) {
  const uploadDir = path.join(process.cwd(), "uploads");
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024
      // 5MB limit
    },
    fileFilter: function(req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    }
  });
  app2.post("/api/upload/image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const webpFilename = `${req.file.fieldname}-${uniqueSuffix}.webp`;
      const outputPath = path.join(uploadDir, webpFilename);
      await sharp(req.file.buffer).resize(800, 600, {
        fit: "inside",
        withoutEnlargement: true
      }).webp({
        quality: 75,
        // Optimized quality for smaller size
        effort: 6,
        // Maximum compression effort
        lossless: false
        // Use lossy compression for smaller files
      }).toFile(outputPath);
      const stats = await fs.stat(outputPath);
      const imageUrl = `/api/uploads/${webpFilename}`;
      res.json({
        message: "Image uploaded and converted to WebP successfully",
        imageUrl,
        filename: webpFilename,
        originalFormat: req.file.mimetype,
        convertedFormat: "image/webp",
        originalSize: req.file.size,
        compressedSize: stats.size,
        compressionRatio: `${Math.round((1 - stats.size / req.file.size) * 100)}%`
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });
  app2.post("/api/upload/images", upload.array("images", 3), async (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      if (files.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }
      const uploadedImages = [];
      for (const file of files) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const webpFilename = `${file.fieldname}-${uniqueSuffix}.webp`;
        const outputPath = path.join(uploadDir, webpFilename);
        await sharp(file.buffer).resize(800, 600, {
          fit: "inside",
          withoutEnlargement: true
        }).webp({
          quality: 75,
          effort: 6,
          lossless: false
        }).toFile(outputPath);
        const imageUrl = `/api/uploads/${webpFilename}`;
        uploadedImages.push(imageUrl);
      }
      res.json({
        message: `${uploadedImages.length} image(s) uploaded successfully`,
        imageUrls: uploadedImages,
        count: uploadedImages.length
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });
  app2.get("/api/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);
    if (filename.endsWith(".webp")) {
      res.setHeader("Content-Type", "image/webp");
    }
    res.sendFile(filepath);
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/admin/seed-categories", async (req, res) => {
    try {
      const newCategories = [
        { name: "Cat Food", slug: "cat-food" },
        { name: "Dog Food", slug: "dog-food" },
        { name: "Cat Toys", slug: "cat-toys" },
        { name: "Cat Litter", slug: "cat-litter" },
        { name: "Cat Care & Health", slug: "cat-care" },
        { name: "Clothing, Beds & Carrier", slug: "clothing-beds-carrier" },
        { name: "Cat Accessories", slug: "cat-accessories" },
        { name: "Dog Health & Accessories", slug: "dog-accessories" },
        { name: "Rabbit Food & Accessories", slug: "rabbit" },
        { name: "Bird Food & Accessories", slug: "bird" }
      ];
      const createdCategories = [];
      for (const categoryData of newCategories) {
        const existingCategory = await Category.findOne({ slug: categoryData.slug });
        if (!existingCategory) {
          const newCategory = new Category(categoryData);
          await newCategory.save();
          createdCategories.push(newCategory);
        }
      }
      res.json({
        message: "Categories seeded successfully",
        created: createdCategories.length,
        categories: createdCategories
      });
    } catch (error) {
      console.error("Error seeding categories:", error);
      res.status(500).json({ message: "Failed to seed categories" });
    }
  });
  app2.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  app2.post("/api/brands", async (req, res) => {
    try {
      const { name, logo, description, isActive } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Brand name is required" });
      }
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const existingBrand = await Brand.findOne({ slug });
      if (existingBrand) {
        return res.status(400).json({ message: "A brand with this name already exists" });
      }
      const newBrand = new Brand({
        name,
        slug,
        logo: logo || "",
        description: description || "",
        isActive: isActive !== false
      });
      await newBrand.save();
      console.log(`Created new brand: ${name}`);
      res.status(201).json({
        id: newBrand._id,
        name: newBrand.name,
        slug: newBrand.slug,
        logo: newBrand.logo,
        description: newBrand.description,
        isActive: newBrand.isActive
      });
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ message: "Failed to create brand" });
    }
  });
  app2.put("/api/brands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, logo, description, isActive } = req.body;
      const brand = await Brand.findById(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      if (name && name !== brand.name) {
        const newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const existingBrand = await Brand.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existingBrand) {
          return res.status(400).json({ message: "A brand with this name already exists" });
        }
        brand.name = name;
        brand.slug = newSlug;
      }
      if (logo !== void 0) brand.logo = logo;
      if (description !== void 0) brand.description = description;
      if (isActive !== void 0) brand.isActive = isActive;
      await brand.save();
      console.log(`Updated brand: ${brand.name}`);
      res.json({
        id: brand._id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        isActive: brand.isActive
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ message: "Failed to update brand" });
    }
  });
  app2.delete("/api/brands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Attempting to delete brand with ID: ${id}`);
      const result = await Brand.findByIdAndDelete(id);
      if (result) {
        console.log(`Successfully deleted brand: ${result.name}`);
        res.json({ message: "Brand deleted successfully" });
      } else {
        res.status(404).json({ message: "Brand not found" });
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const [dbProducts, allCategories, allBrands] = await Promise.all([
        Product.find({
          isActive: true
        }),
        Category.find({}),
        Brand.find({})
      ]);
      const categoryByIdMap = /* @__PURE__ */ new Map();
      const categoryBySlugMap = /* @__PURE__ */ new Map();
      const categoryByNameMap = /* @__PURE__ */ new Map();
      for (const cat of allCategories) {
        if (cat._id) categoryByIdMap.set(cat._id.toString(), cat);
        if (cat.slug) categoryBySlugMap.set(cat.slug, cat);
        if (cat.name) categoryByNameMap.set(cat.name, cat);
      }
      const brandByIdMap = /* @__PURE__ */ new Map();
      const brandBySlugMap = /* @__PURE__ */ new Map();
      const brandByNameMap = /* @__PURE__ */ new Map();
      for (const br of allBrands) {
        if (br._id) brandByIdMap.set(br._id.toString(), br);
        if (br.slug) brandBySlugMap.set(br.slug, br);
        if (br.name) brandByNameMap.set(br.name, br);
      }
      const products = [];
      for (const product of dbProducts) {
        try {
          let category = null;
          if (product.categoryId) {
            category = categoryByIdMap.get(product.categoryId.toString()) || categoryBySlugMap.get(product.categoryId) || categoryByNameMap.get(product.categoryId);
          }
          let brand = null;
          if (product.brandId) {
            brand = brandByIdMap.get(product.brandId.toString()) || brandBySlugMap.get(product.brandId) || brandByNameMap.get(product.brandId);
          }
          products.push({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: category?.slug || "uncategorized",
            categoryName: category?.name || "Uncategorized",
            subcategory: product.subcategory || "",
            brandId: product.brandId,
            brandName: brand?.name || "No Brand",
            brandSlug: brand?.slug || "no-brand",
            image: product.image,
            images: product.images || [],
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            stock: product.stockQuantity || 0,
            stockStatus: product.stockStatus || "In Stock",
            tags: product.tags || [],
            features: product.features || [],
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            isOnSale: product.isOnSale || false,
            discount: product.discount || 0,
            description: product.description || "",
            specifications: product.specifications || {}
          });
        } catch (err) {
          console.warn("Skipping product with invalid data:", product.name || "Unknown", err.message);
        }
      }
      console.log(`Successfully fetched ${products.length} products (including repack products)`);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/admin/products", async (req, res) => {
    try {
      const [dbProducts, allCategories, allBrands] = await Promise.all([
        Product.find({
          tags: {
            $not: {
              $in: ["repack-food", "repack", "bulk-save", "bulk"]
            }
          }
          // Note: Don't filter by isActive for admin - they need to see all products
        }),
        Category.find({}),
        Brand.find({})
      ]);
      const categoryByIdMap = /* @__PURE__ */ new Map();
      const categoryBySlugMap = /* @__PURE__ */ new Map();
      const categoryByNameMap = /* @__PURE__ */ new Map();
      for (const cat of allCategories) {
        if (cat._id) categoryByIdMap.set(cat._id.toString(), cat);
        if (cat.slug) categoryBySlugMap.set(cat.slug, cat);
        if (cat.name) categoryByNameMap.set(cat.name, cat);
      }
      const brandByIdMap = /* @__PURE__ */ new Map();
      const brandBySlugMap = /* @__PURE__ */ new Map();
      const brandByNameMap = /* @__PURE__ */ new Map();
      for (const br of allBrands) {
        if (br._id) brandByIdMap.set(br._id.toString(), br);
        if (br.slug) brandBySlugMap.set(br.slug, br);
        if (br.name) brandByNameMap.set(br.name, br);
      }
      const products = [];
      for (const product of dbProducts) {
        try {
          let category = null;
          if (product.categoryId) {
            category = categoryByIdMap.get(product.categoryId.toString()) || categoryBySlugMap.get(product.categoryId) || categoryByNameMap.get(product.categoryId);
          }
          let brand = null;
          if (product.brandId) {
            brand = brandByIdMap.get(product.brandId.toString()) || brandBySlugMap.get(product.brandId) || brandByNameMap.get(product.brandId);
          }
          products.push({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: category?.slug || "uncategorized",
            categoryId: product.categoryId,
            categoryName: category?.name || "Uncategorized",
            brandId: product.brandId,
            brandName: brand?.name || "No Brand",
            brandSlug: brand?.slug || "no-brand",
            image: product.image,
            images: product.images || [],
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            stock: product.stockQuantity || 0,
            stockQuantity: product.stockQuantity || 0,
            stockStatus: product.stockStatus || "In Stock",
            tags: product.tags || [],
            features: product.features || [],
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            isOnSale: product.isOnSale || false,
            discount: product.discount || 0,
            description: product.description || "",
            specifications: product.specifications || {},
            isActive: product.isActive !== false,
            subcategory: product.subcategory || ""
          });
        } catch (err) {
          console.warn("Skipping product with invalid data:", product.name || "Unknown", err.message);
        }
      }
      console.log(`Successfully fetched ${products.length} products for admin (including inactive)`);
      res.json(products);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      let category = null;
      if (product.categoryId) {
        try {
          category = await Category.findById(product.categoryId);
        } catch (categoryError) {
          category = await Category.findOne({ slug: product.categoryId });
        }
        if (!category) {
          category = await Category.findOne({ name: product.categoryId });
        }
      }
      let brand = null;
      if (product.brandId) {
        try {
          brand = await Brand.findById(product.brandId);
        } catch (brandError) {
          brand = await Brand.findOne({ slug: product.brandId });
        }
        if (!brand) {
          brand = await Brand.findOne({ name: product.brandId });
        }
      }
      const enrichedProduct = {
        ...product.toObject(),
        categoryName: category?.name || "Uncategorized",
        categorySlug: category?.slug || "uncategorized",
        brandName: brand?.name || "No Brand",
        brandSlug: brand?.slug || "no-brand"
      };
      res.json(enrichedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const productData = req.body;
      console.log("Received product data:", productData);
      const tags = productData.tags ? productData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0) : [];
      const categoryMappings = {
        "cat-food": { name: "Cat Food", slug: "cat-food" },
        "dog-food": { name: "Dog Food", slug: "dog-food" },
        "cat-toys": { name: "Cat Toys", slug: "cat-toys" },
        "cat-litter": { name: "Cat Litter", slug: "cat-litter" },
        "cat-care": { name: "Cat Care & Health", slug: "cat-care" },
        "clothing-beds-carrier": { name: "Clothing, Beds & Carrier", slug: "clothing-beds-carrier" },
        "cat-accessories": { name: "Cat Accessories", slug: "cat-accessories" },
        "dog-accessories": { name: "Dog Health & Accessories", slug: "dog-accessories" },
        "rabbit": { name: "Rabbit Food & Accessories", slug: "rabbit" },
        "bird": { name: "Bird Food & Accessories", slug: "bird" }
      };
      const brandMappings = {
        "default-brand": { name: "Default Brand", slug: "default-brand" },
        "nekko": { name: "Nekko", slug: "nekko" },
        "purina": { name: "Purina", slug: "purina" },
        "purina-one": { name: "Purina One", slug: "one" },
        "reflex": { name: "Reflex", slug: "reflex" },
        "reflex-plus": { name: "Reflex Plus", slug: "reflex-plus" },
        "royal-canin": { name: "Royal Canin", slug: "royal-canin" },
        "sheba": { name: "Sheba", slug: "sheba" }
      };
      let categoryRecord = null;
      if (productData.categoryId) {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.categoryId);
        if (isValidObjectId) {
          categoryRecord = await Category.findById(productData.categoryId);
        } else {
          categoryRecord = await Category.findOne({
            $or: [
              { slug: productData.categoryId },
              { name: productData.categoryId }
            ]
          });
        }
      }
      if (!categoryRecord) {
        const categoryMapping = categoryMappings[productData.categoryId];
        categoryRecord = new Category({
          name: categoryMapping ? categoryMapping.name : productData.categoryId,
          slug: categoryMapping ? categoryMapping.slug : productData.categoryId.toLowerCase().replace(/\s+/g, "-")
        });
        await categoryRecord.save();
        console.log(`Created new category: ${categoryRecord.name} with slug: ${categoryRecord.slug}`);
      }
      let brandRecord = null;
      if (productData.brandId) {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.brandId);
        if (isValidObjectId) {
          brandRecord = await Brand.findById(productData.brandId);
        } else {
          brandRecord = await Brand.findOne({
            $or: [
              { slug: productData.brandId },
              { name: productData.brandId }
            ]
          });
        }
      }
      if (!brandRecord) {
        const brandMapping = brandMappings[productData.brandId];
        brandRecord = new Brand({
          name: brandMapping ? brandMapping.name : productData.brandId,
          slug: brandMapping ? brandMapping.slug : productData.brandId.toLowerCase().replace(/\s+/g, "-")
        });
        await brandRecord.save();
        console.log(`Created new brand: ${brandRecord.name} with slug: ${brandRecord.slug}`);
      }
      const productSlug = await generateUniqueProductSlug(productData.name);
      let subcategory = productData.subcategory === "none" ? "" : productData.subcategory || "";
      if (subcategory) {
        subcategory = subcategory.toLowerCase().trim().replace(/\s+/g, "-");
      }
      const product = new Product({
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : void 0,
        category: categoryRecord._id,
        categoryName: categoryRecord.name,
        brand: brandRecord._id,
        brandId: brandRecord._id.toString(),
        brandName: brandRecord.name,
        image: productData.image,
        images: productData.images || [],
        stockQuantity: productData.stockQuantity || 0,
        stock: productData.stockQuantity || 0,
        subcategory,
        tags: subcategory ? [subcategory] : [],
        isNew: productData.isNew || false,
        isBestseller: productData.isBestseller || false,
        isOnSale: productData.isOnSale || false,
        isActive: productData.isActive !== false,
        slug: productSlug
      });
      await product.save();
      console.log("Created product:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Failed to create product", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      console.log("Updating product with data:", productData);
      const tags = productData.tags ? productData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0) : [];
      const categoryMappings = {
        "cat-food": { name: "Cat Food", slug: "cat-food" },
        "dog-food": { name: "Dog Food", slug: "dog-food" },
        "cat-toys": { name: "Cat Toys", slug: "cat-toys" },
        "cat-litter": { name: "Cat Litter", slug: "cat-litter" },
        "cat-care": { name: "Cat Care & Health", slug: "cat-care" },
        "cat-care-health": { name: "Cat Care & Health", slug: "cat-care" },
        "clothing-beds-carrier": { name: "Clothing, Beds & Carrier", slug: "clothing-beds-carrier" },
        "cat-accessories": { name: "Cat Accessories", slug: "cat-accessories" },
        "dog-accessories": { name: "Dog Health & Accessories", slug: "dog-accessories" },
        "dog-health-accessories": { name: "Dog Health & Accessories", slug: "dog-accessories" },
        "rabbit": { name: "Rabbit Food & Accessories", slug: "rabbit" },
        "rabbit-food-accessories": { name: "Rabbit Food & Accessories", slug: "rabbit" },
        "bird": { name: "Bird Food & Accessories", slug: "bird" },
        "bird-food-accessories": { name: "Bird Food & Accessories", slug: "bird" }
      };
      const brandMappings = {
        "default-brand": { name: "Default Brand", slug: "default-brand" },
        "nekko": { name: "Nekko", slug: "nekko" },
        "purina": { name: "Purina", slug: "purina" },
        "purina-one": { name: "Purina One", slug: "one" },
        "reflex": { name: "Reflex", slug: "reflex" },
        "reflex-plus": { name: "Reflex Plus", slug: "reflex-plus" },
        "royal-canin": { name: "Royal Canin", slug: "royal-canin" },
        "sheba": { name: "Sheba", slug: "sheba" }
      };
      let categoryRecord = null;
      if (productData.categoryId) {
        console.log("Looking up category with ID:", productData.categoryId);
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.categoryId);
        if (isValidObjectId) {
          categoryRecord = await Category.findById(productData.categoryId);
          console.log("Found category by ObjectId:", categoryRecord?.name);
        } else {
          categoryRecord = await Category.findOne({
            $or: [
              { slug: productData.categoryId },
              { name: productData.categoryId }
            ]
          });
          console.log("Found category by slug/name:", categoryRecord?.name);
        }
      }
      if (!categoryRecord) {
        const categoryMapping = categoryMappings[productData.categoryId];
        categoryRecord = new Category({
          name: categoryMapping ? categoryMapping.name : productData.categoryId,
          slug: categoryMapping ? categoryMapping.slug : productData.categoryId.toLowerCase().replace(/\s+/g, "-")
        });
        await categoryRecord.save();
        console.log(`Created new category: ${categoryRecord.name} with slug: ${categoryRecord.slug}`);
      }
      let brandRecord = null;
      if (productData.brandId) {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.brandId);
        if (isValidObjectId) {
          brandRecord = await Brand.findById(productData.brandId);
        } else {
          brandRecord = await Brand.findOne({
            $or: [
              { slug: productData.brandId },
              { name: productData.brandId }
            ]
          });
        }
      }
      if (!brandRecord) {
        const brandMapping = brandMappings[productData.brandId];
        brandRecord = new Brand({
          name: brandMapping ? brandMapping.name : productData.brandId,
          slug: brandMapping ? brandMapping.slug : productData.brandId.toLowerCase().replace(/\s+/g, "-")
        });
        await brandRecord.save();
        console.log(`Created new brand: ${brandRecord.name} with slug: ${brandRecord.slug}`);
      }
      const currentProduct = await Product.findById(id);
      let productSlug = currentProduct?.slug;
      if (!productSlug || currentProduct && currentProduct.name !== productData.name) {
        productSlug = await generateUniqueProductSlug(productData.name, id);
      }
      let subcategory = productData.subcategory === "none" ? "" : productData.subcategory || "";
      if (subcategory) {
        subcategory = subcategory.toLowerCase().trim().replace(/\s+/g, "-");
      }
      const productTags = subcategory ? [subcategory] : [];
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : void 0,
          category: categoryRecord._id,
          categoryId: categoryRecord._id.toString(),
          categoryName: categoryRecord.name,
          brand: brandRecord._id,
          brandId: brandRecord._id.toString(),
          brandName: brandRecord.name,
          image: productData.image,
          images: productData.images || [],
          stockQuantity: productData.stockQuantity || 0,
          stock: productData.stockQuantity || 0,
          subcategory,
          tags: productTags,
          isNew: productData.isNew || false,
          isBestseller: productData.isBestseller || false,
          isOnSale: productData.isOnSale || false,
          isActive: productData.isActive !== false,
          slug: productSlug
        },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log("Updated product:", updatedProduct);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.post("/api/admin/migrate-product-slugs", async (req, res) => {
    try {
      await migrateProductSlugs();
      res.json({ message: "Product slug migration completed successfully" });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ message: "Failed to migrate product slugs" });
    }
  });
  app2.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await findProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      let category = null;
      if (product.categoryId) {
        try {
          category = await Category.findById(product.categoryId);
        } catch (categoryError) {
          category = await Category.findOne({ slug: product.categoryId });
        }
        if (!category) {
          category = await Category.findOne({ name: product.categoryId });
        }
      }
      let brand = null;
      if (product.brandId) {
        try {
          brand = await Brand.findById(product.brandId);
        } catch (brandError) {
          brand = await Brand.findOne({ slug: product.brandId });
        }
        if (!brand) {
          brand = await Brand.findOne({ name: product.brandId });
        }
      }
      const enrichedProduct = {
        ...product.toObject(),
        categoryName: category?.name || "Uncategorized",
        categorySlug: category?.slug || "uncategorized",
        brandName: brand?.name || "No Brand",
        brandSlug: brand?.slug || "no-brand"
      };
      res.json(enrichedProduct);
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/init-repack-products", async (req, res) => {
    try {
      const existingRepackProducts = await Product.find({
        tags: { $in: ["repack-food"] }
      });
      if (existingRepackProducts.length > 0) {
        return res.json({ message: "Repack products already exist", count: existingRepackProducts.length });
      }
      let repackCategory = await Category.findOne({ name: "Repack Food" });
      if (!repackCategory) {
        repackCategory = new Category({
          name: "Repack Food",
          slug: "repack-food"
        });
        await repackCategory.save();
      }
      let meowMeowBrand = await Brand.findOne({ name: "Meow Meow" });
      if (!meowMeowBrand) {
        meowMeowBrand = new Brand({
          name: "Meow Meow",
          slug: "meow-meow"
        });
        await meowMeowBrand.save();
      }
      const repackProducts = [
        {
          name: "Bulk Cat Food Repack (20kg)",
          description: "Premium quality, repackaged for savings",
          price: 6400,
          originalPrice: 8e3,
          categoryId: repackCategory._id,
          brandId: meowMeowBrand._id,
          image: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 15,
          tags: ["repack-food", "bulk-save", "cat-food"],
          isNew: false,
          isBestseller: true,
          isOnSale: true,
          isActive: true,
          rating: 4.5
        },
        {
          name: "Bulk Dog Food Repack (25kg)",
          description: "Economical choice for multiple dogs",
          price: 7200,
          originalPrice: 9600,
          categoryId: repackCategory._id,
          brandId: meowMeowBrand._id,
          image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 12,
          tags: ["repack-food", "combo-deal", "dog-food"],
          isNew: false,
          isBestseller: true,
          isOnSale: true,
          isActive: true,
          rating: 4.5
        },
        {
          name: "Mixed Pet Treats (5kg)",
          description: "Assorted treats for cats and dogs",
          price: 2800,
          originalPrice: 3500,
          categoryId: repackCategory._id,
          brandId: meowMeowBrand._id,
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          stockQuantity: 25,
          tags: ["repack-food", "bulk-save", "treats"],
          isNew: false,
          isBestseller: false,
          isOnSale: true,
          isActive: true,
          rating: 4.5
        }
      ];
      const createdProducts = await Product.insertMany(repackProducts);
      console.log("Created repack products:", createdProducts.length);
      res.status(201).json({
        message: "Repack products initialized successfully",
        count: createdProducts.length,
        products: createdProducts
      });
    } catch (error) {
      console.error("Init repack products error:", error);
      res.status(500).json({ message: "Failed to initialize repack products" });
    }
  });
  app2.get("/api/repack-products", async (req, res) => {
    try {
      res.set("Cache-Control", "public, max-age=300");
      const repackProducts = await Product.find({
        $or: [
          { tags: { $in: ["repack-food", "repack"] } },
          { name: { $regex: /repack/i } },
          { description: { $regex: /repack/i } }
        ],
        isActive: true
      }).select("name price originalPrice image rating stockQuantity tags description isNew isBestseller isOnSale discount").lean();
      console.log(`Successfully fetched ${repackProducts.length} repack products`);
      res.json(repackProducts);
    } catch (error) {
      console.error("Get repack products error:", error);
      res.status(500).json({ message: "Failed to fetch repack products" });
    }
  });
  app2.get("/api/admin/repack-products", async (req, res) => {
    try {
      const repackProducts = await Product.find({
        $or: [
          { tags: { $in: ["repack-food", "repack", "bulk-save", "bulk"] } },
          { name: { $regex: /repack/i } },
          { description: { $regex: /repack/i } }
        ]
        // Note: Don't filter by isActive for admin - they need to see all products
      });
      const productsWithDetails = [];
      for (const product of repackProducts) {
        try {
          let category = null;
          if (product.categoryId) {
            try {
              category = await Category.findById(product.categoryId);
            } catch (categoryError) {
              category = await Category.findOne({ slug: product.categoryId });
            }
            if (!category) {
              category = await Category.findOne({ name: product.categoryId });
            }
          }
          let brand = null;
          if (product.brandId) {
            try {
              brand = await Brand.findById(product.brandId);
            } catch (brandError) {
              brand = await Brand.findOne({ slug: product.brandId });
            }
            if (!brand) {
              brand = await Brand.findOne({ name: product.brandId });
            }
          }
          productsWithDetails.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: category?.slug || "uncategorized",
            categoryName: category?.name || "Uncategorized",
            brandId: product.brandId,
            brandName: brand?.name || "No Brand",
            brandSlug: brand?.slug || "no-brand",
            image: product.image,
            images: product.images || [],
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            stock: product.stockQuantity || 0,
            stockStatus: product.stockStatus || "In Stock",
            tags: product.tags || [],
            features: product.features || [],
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            isOnSale: product.isOnSale || false,
            discount: product.discount || 0,
            description: product.description || "",
            specifications: product.specifications || {},
            isActive: product.isActive
          });
        } catch (err) {
          console.warn("Error processing repack product:", product.name || "Unknown", err.message);
        }
      }
      console.log(`Successfully fetched ${productsWithDetails.length} repack products for admin`);
      res.json(productsWithDetails);
    } catch (error) {
      console.error("Get admin repack products error:", error);
      res.status(500).json({ message: "Failed to fetch repack products for admin" });
    }
  });
  const requireAdmin = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const user = await User.findById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      req.adminUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Valid email is required").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });
  const loginSchema = z.object({
    email: z.string().min(1, "Email or username is required"),
    // Accept email or username
    password: z.string().min(6, "Password must be at least 6 characters")
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors
        });
      }
      const { confirmPassword, ...userData } = result.data;
      const existingUser = userData.email ? await storage.getUserByEmail(userData.email) : null;
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username is already taken" });
      }
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      const { password, ...userResponse } = user;
      res.status(201).json({
        message: "User created successfully",
        user: userResponse
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors
        });
      }
      const { email, password } = result.data;
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await User.findOne({ username: email }) || void 0;
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userResponse } = userObj;
      res.json({
        message: "Login successful",
        user: userResponse
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/auth/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      delete updateData.password;
      delete updateData.id;
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userResponse } = user;
      res.json({
        message: "Profile updated successfully",
        user: userResponse
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !z.string().email().safeParse(email).success) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      await OTP.findOneAndDelete({ email });
      const otpRecord = new OTP({
        email,
        code,
        expiresAt,
        verified: false
      });
      await otpRecord.save();
      const emailSent = await sendOTPEmail(email, code);
      if (!emailSent) {
        console.log(`OTP code for ${email}: ${code}`);
        return res.json({
          success: true,
          message: "OTP generated (check server logs for code - email service not configured)",
          devMode: true,
          code: process.env.NODE_ENV === "development" ? code : void 0
        });
      }
      res.json({
        success: true,
        message: "OTP sent successfully to your email"
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });
  app2.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ message: "Email and code are required" });
      }
      const otpRecord = await OTP.findOne({ email, verified: false }).sort({ createdAt: -1 });
      if (!otpRecord) {
        return res.status(400).json({ message: "No OTP found for this email" });
      }
      if (otpRecord.expiresAt < /* @__PURE__ */ new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
      if (otpRecord.code !== code) {
        return res.status(400).json({ message: "Invalid OTP code" });
      }
      otpRecord.verified = true;
      await otpRecord.save();
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userResponse = {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role
      };
      res.json({
        success: true,
        message: "Email verified successfully",
        user: userResponse
      });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });
  app2.post("/api/admin/stats", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const allUsers = await User.find();
      res.json({
        totalUsers: allUsers.length,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 4
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });
  app2.post("/api/admin/users", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const allUsers = await User.find().select("-password");
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.delete("/api/admin/users/:userId", async (req, res) => {
    try {
      const { userId: targetUserId } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const userToDelete = await User.findById(targetUserId);
      if (userToDelete?.role === "admin") {
        return res.status(403).json({ message: "Cannot delete admin account" });
      }
      await User.findByIdAndDelete(targetUserId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const imageUrl = `https://via.placeholder.com/${width}x${height}/26732d/ffffff?text=Pet+Shop`;
    res.redirect(imageUrl);
  });
  app2.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await Announcement.find({ isActive: true }).sort({ priority: -1, createdAt: -1 }).limit(1);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });
  app2.get("/api/admin/announcements", async (req, res) => {
    try {
      const announcements = await Announcement.find({}).sort({ priority: -1, createdAt: -1 });
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });
  app2.post("/api/announcements", async (req, res) => {
    try {
      const { text, isActive } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Announcement text is required" });
      }
      const announcement = new Announcement({
        text,
        isActive: isActive ?? true
      });
      await announcement.save();
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });
  app2.put("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { text, isActive } = req.body;
      const announcement = await Announcement.findByIdAndUpdate(
        id,
        { text, isActive, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update announcement" });
    }
  });
  app2.delete("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findByIdAndDelete(id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete announcement" });
    }
  });
  app2.get("/api/cart/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
        await cart.save();
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  app2.post("/api/cart/add", async (req, res) => {
    try {
      const { userId, productId, name, price, image, quantity = 1 } = req.body;
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
      }
      const existingItemIndex = cart.items.findIndex((item) => item.productId === productId);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, image, quantity });
      }
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  app2.put("/api/cart/update", async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      if (quantity <= 0) {
        cart.items = cart.items.filter((item) => item.productId !== productId);
      } else {
        const itemIndex = cart.items.findIndex((item) => item.productId === productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
        }
      }
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart" });
    }
  });
  app2.delete("/api/cart/clear/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      cart.items = [];
      cart.total = 0;
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    console.log("\u{1F4E6} ORDER CREATION STARTED - Received order request");
    const session = await mongoose4.startSession();
    session.startTransaction();
    try {
      const {
        userId,
        customerInfo,
        items,
        discountCode = null,
        paymentMethod,
        shippingAddress,
        orderNotes
      } = req.body;
      console.log(`\u{1F4E6} Order items: ${items?.length || 0} products`);
      if (!items || !Array.isArray(items) || items.length === 0) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({ message: "Order items are required" });
      }
      if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({ message: "Customer information is required" });
      }
      let serverSubtotal = 0;
      const validatedItems = [];
      for (const item of items) {
        try {
          const product = await Product.findById(item.productId).session(session);
          if (!product) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: `Product ${item.productId} not found` });
          }
          if (!product.isActive) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: `Product ${product.name} is no longer available` });
          }
          if (product.stockQuantity < item.quantity) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
          }
          const itemTotal = product.price * item.quantity;
          serverSubtotal += itemTotal;
          validatedItems.push({
            productId: item.productId,
            name: product.name,
            price: product.price,
            // Use current price from database
            quantity: item.quantity,
            image: item.image || product.image
          });
        } catch (error) {
          console.error(`Error validating product ${item.productId}:`, error);
          await session.abortTransaction();
          await session.endSession();
          return res.status(400).json({ message: `Invalid product: ${item.productId}` });
        }
      }
      let serverDiscount = 0;
      let validatedCouponCode = null;
      let couponId = null;
      if (discountCode) {
        try {
          const coupon = await Coupon.findOne({
            code: discountCode.toUpperCase(),
            isActive: true
          }).session(session);
          if (!coupon) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: "Invalid coupon code" });
          }
          const now = /* @__PURE__ */ new Date();
          if (now < coupon.validFrom || now > coupon.validUntil) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: "Coupon has expired or is not yet valid" });
          }
          if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: "Coupon usage limit reached" });
          }
          if (coupon.minOrderAmount && serverSubtotal < coupon.minOrderAmount) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({
              message: `Minimum order amount of \u09F3${coupon.minOrderAmount} required`
            });
          }
          if (coupon.discountType === "percentage") {
            serverDiscount = Math.round(serverSubtotal * coupon.discountValue / 100);
            if (coupon.maxDiscountAmount) {
              serverDiscount = Math.min(serverDiscount, coupon.maxDiscountAmount);
            }
          } else {
            serverDiscount = coupon.discountValue;
          }
          validatedCouponCode = coupon.code;
          couponId = coupon._id;
        } catch (error) {
          console.error("Error validating coupon:", error);
          await session.abortTransaction();
          await session.endSession();
          return res.status(400).json({ message: "Failed to validate coupon" });
        }
      }
      const serverTotal = Math.max(0, serverSubtotal - serverDiscount);
      const orderNumber = generateUniqueOrderNumber();
      const invoiceNumber = orderNumber;
      const order = new Order({
        userId,
        orderNumber,
        // Unique order number
        status: "Processing",
        total: serverTotal,
        // Use server-computed total
        items: validatedItems,
        shippingAddress,
        customerInfo,
        // Add customer info to order
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
        orderNotes,
        invoiceNumber
        // Set invoice number to same as order number
      });
      await order.save({ session });
      const orderId = order._id.toString();
      console.log(`\u{1F50D} ORDER CREATED - ID: ${orderId}, invoiceNumber: ${invoiceNumber}`);
      for (const item of validatedItems) {
        const result = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stockQuantity: { $gte: item.quantity }
            // Only update if stock >= ordered quantity
          },
          { $inc: { stockQuantity: -item.quantity } },
          { new: true, session }
        );
        if (!result) {
          console.error(`RACE CONDITION: Stock became insufficient for ${item.name} (ID: ${item.productId})`);
          await session.abortTransaction();
          await session.endSession();
          return res.status(400).json({
            message: `Order failed: ${item.name} is out of stock. Please try again.`
          });
        }
        console.log(`\u2705 STOCK DECREMENTED for ${item.name} (ID: ${item.productId}): ${result.stockQuantity + item.quantity} \u2192 ${result.stockQuantity}`);
      }
      if (couponId) {
        await Coupon.findByIdAndUpdate(
          couponId,
          { $inc: { usedCount: 1 } },
          { new: true, session }
        );
        console.log(`Coupon ${validatedCouponCode} used (transaction)`);
      }
      const invoice = new Invoice({
        invoiceNumber,
        orderId,
        userId,
        customerInfo,
        items: validatedItems,
        subtotal: serverSubtotal,
        // Use server-computed subtotal
        discount: serverDiscount,
        // Use server-computed discount
        discountCode: validatedCouponCode,
        total: serverTotal,
        // Use server-computed total
        paymentMethod,
        paymentStatus: order.paymentStatus
      });
      await invoice.save({ session });
      console.log(`\u{1F4C4} INVOICE CREATED - ID: ${invoice._id.toString()}, orderId: ${invoice.orderId}`);
      order.invoiceId = invoice._id?.toString() || invoice.id;
      order.invoiceNumber = invoiceNumber;
      await order.save({ session });
      console.log(`\u2705 ORDER UPDATED - ID: ${order._id.toString()}, invoiceId: ${order.invoiceId}, invoiceNumber: ${order.invoiceNumber}`);
      await Cart.findOneAndUpdate(
        { userId },
        { items: [], total: 0 },
        { session }
      );
      await session.commitTransaction();
      await session.endSession();
      console.log(`\u2705 ORDER COMPLETED SUCCESSFULLY: Invoice=${invoiceNumber}, Subtotal=\u09F3${serverSubtotal}, Discount=\u09F3${serverDiscount}, Total=\u09F3${serverTotal}`);
      const finalOrderId = order._id.toString();
      const finalInvoiceOrderId = invoice.orderId;
      console.log(`\u2705 ORDER CREATED - Order._id: ${finalOrderId}, Invoice.orderId: ${finalInvoiceOrderId}`);
      const orderResponse = order.lean ? order.lean() : order.toObject ? order.toObject() : order;
      orderResponse._id = finalOrderId;
      res.json({ order: orderResponse, invoice });
    } catch (error) {
      console.error("Order creation error:", error);
      await session.abortTransaction();
      await session.endSession();
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      const enhancedOrders = await Promise.all(orders.map(async (order) => {
        const orderObj = order.toObject();
        const orderId = order._id.toString();
        if (!orderObj.invoiceNumber) {
          try {
            const invoice = await Invoice.findOne({ orderId });
            if (invoice && invoice.invoiceNumber) {
              orderObj.invoiceNumber = invoice.invoiceNumber;
            }
          } catch (invoiceError) {
          }
        }
        return orderObj;
      }));
      res.json(enhancedOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      const enhancedOrders = await Promise.all(orders.map(async (order) => {
        const orderObj = order.toObject();
        const orderId = order._id.toString();
        console.log(`Processing order ${orderId}, customerInfo exists:`, !!orderObj.customerInfo);
        try {
          const invoice = await Invoice.findOne({ orderId });
          if (invoice) {
            console.log(`Found invoice:`, !!invoice, `with customerInfo: ${!!invoice.customerInfo}`);
            if (!orderObj.invoiceNumber && invoice.invoiceNumber) {
              orderObj.invoiceNumber = invoice.invoiceNumber;
            }
            if ((!orderObj.customerInfo || !orderObj.customerInfo.name) && invoice.customerInfo) {
              console.log(`Enhancing order ${orderId} with customer info:`, invoice.customerInfo.name);
              orderObj.customerInfo = invoice.customerInfo;
            }
            if (!orderObj.invoiceId) {
              orderObj.invoiceId = invoice._id?.toString();
            }
          }
        } catch (invoiceError) {
          console.log(`Could not fetch invoice for order ${orderId}:`, invoiceError.message);
        }
        return orderObj;
      }));
      res.json(enhancedOrders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.put("/api/orders/:orderId/status", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status,
          updatedAt: /* @__PURE__ */ new Date()
        },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  app2.delete("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, phone, email, subject, message } = req.body;
      if (!name || !phone || !subject || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      console.log("Contact form submission:", {
        name,
        phone,
        email: email || "Not provided",
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({
        message: "Message sent successfully! We'll get back to you within 24 hours.",
        success: true
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        message: "Failed to send message. Please try again later.",
        success: false
      });
    }
  });
  app2.get("/api/invoices/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/invoices/:invoiceId", async (req, res) => {
    try {
      const { invoiceId } = req.params;
      let invoice = await Invoice.findOne({ invoiceNumber: invoiceId });
      if (!invoice) {
        invoice = await Invoice.findById(invoiceId);
      }
      if (!invoice) {
        invoice = await Invoice.findOne({ orderId: invoiceId });
      }
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  app2.put("/api/invoices/:invoiceId", async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const { items, deliveryFee, discount, discountCode, customerInfo } = req.body;
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = subtotal + (deliveryFee || 0) - (discount || 0);
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        {
          items,
          subtotal,
          deliveryFee: deliveryFee || 0,
          discount: discount || 0,
          discountCode: discountCode || "",
          total,
          customerInfo: customerInfo || invoice.customerInfo,
          updatedAt: /* @__PURE__ */ new Date()
        },
        { new: true }
      );
      if (invoice.orderId) {
        await Order.findByIdAndUpdate(
          invoice.orderId,
          {
            items,
            total,
            updatedAt: /* @__PURE__ */ new Date()
          }
        );
      }
      res.json({ message: "Invoice updated successfully", invoice: updatedInvoice });
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  app2.get("/api/invoices/download/:invoiceId", async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const invoiceHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-title { color: #333; font-size: 24px; margin: 0; }
            .invoice-number { color: #666; margin: 5px 0; }
            .company-info { margin-bottom: 30px; }
            .customer-info { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .total-section { text-align: right; }
            .total-line { margin: 10px 0; }
            .final-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="invoice-title">Meow Meow Pet Shop</h1>
            <p class="invoice-number">Invoice #${invoice.invoiceNumber}</p>
            <p>Date: ${new Date(invoice.orderDate).toLocaleDateString()}</p>
          </div>

          <div class="company-info">
            <h3>From:</h3>
            <p>Meow Meow Pet Shop<br>
            Savar, Bangladesh<br>
            Email: info@meowmeowpetshop.com</p>
          </div>

          <div class="customer-info">
            <h3>Bill To:</h3>
            <p>${invoice.customerInfo.name}<br>
            Email: ${invoice.customerInfo.email}<br>
            Phone: ${invoice.customerInfo.phone}</p>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>\u09F3 ${item.price}</td>
                  <td>\u09F3 ${item.price * item.quantity}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-line">Subtotal: \u09F3 ${invoice.subtotal}</div>
            <div class="total-line final-total">Total: \u09F3 ${invoice.total}</div>
            <div class="total-line">Payment Method: ${invoice.paymentMethod}</div>
            <div class="total-line">Payment Status: ${invoice.paymentStatus}</div>
          </div>
        </body>
        </html>
      `;
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Content-Disposition", `attachment; filename="invoice-${invoice.invoiceNumber}.html"`);
      res.send(invoiceHtml);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/published", async (req, res) => {
    try {
      const { category } = req.query;
      const allPosts = await storage.getBlogPosts();
      let publishedPosts = allPosts.filter((post) => post.isPublished);
      if (category && category !== "All") {
        publishedPosts = publishedPosts.filter(
          (post) => post.category && post.category === category
        );
      }
      res.json(publishedPosts);
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      res.status(500).json({ message: "Failed to fetch published blog posts" });
    }
  });
  app2.get("/api/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const blogPost = await storage.getBlogPost(id);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blogPost = await storage.getBlogPostBySlug(slug);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/blog", async (req, res) => {
    try {
      const blogPostSchema2 = z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().min(1, "Slug is required"),
        excerpt: z.string().optional(),
        content: z.string().min(1, "Content is required"),
        image: z.string().optional(),
        author: z.string().min(1, "Author is required"),
        publishedAt: z.string().datetime().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional()
      });
      const validatedData = blogPostSchema2.parse(req.body);
      const blogPostData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : void 0
      };
      const newBlogPost = await storage.createBlogPost(blogPostData);
      res.status(201).json(newBlogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  app2.put("/api/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        image: z.string().optional(),
        author: z.string().min(1).optional(),
        publishedAt: z.string().datetime().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional()
      });
      const validatedData = updateSchema.parse(req.body);
      const updateData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : void 0
      };
      const updatedBlogPost = await storage.updateBlogPost(id, updateData);
      if (!updatedBlogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(updatedBlogPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  app2.delete("/api/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  app2.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });
  app2.get("/api/banners/active", async (req, res) => {
    try {
      const banners = await storage.getActiveBanners();
      const sortedBanners = banners.sort((a, b) => a.order - b.order);
      console.log(`Returning ${sortedBanners.length} active banners, sorted by order:`, sortedBanners.map((b) => ({ title: b.title, order: b.order })));
      res.json(sortedBanners);
    } catch (error) {
      console.error("Error fetching active banners:", error);
      res.status(500).json({ message: "Failed to fetch active banners" });
    }
  });
  app2.post("/api/banners", async (req, res) => {
    try {
      const bannerSchema2 = z.object({
        imageUrl: z.string().min(1, "Image is required"),
        title: z.string().optional(),
        order: z.number().optional()
      });
      const validatedData = bannerSchema2.parse(req.body);
      const newBanner = await storage.createBanner(validatedData);
      res.json(newBanner);
    } catch (error) {
      console.error("Error creating banner:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create banner" });
    }
  });
  app2.put("/api/banners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        imageUrl: z.string().optional(),
        title: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional()
      });
      const validatedData = updateSchema.parse(req.body);
      const updatedBanner = await storage.updateBanner(id, validatedData);
      if (!updatedBanner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(updatedBanner);
    } catch (error) {
      console.error("Error updating banner:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes("Maximum 3 banners")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to update banner" });
    }
  });
  app2.delete("/api/banners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBanner(id);
      if (!deleted) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(500).json({ message: "Failed to delete banner" });
    }
  });
  app2.get("/api/popup-posters", async (req, res) => {
    try {
      const posters = await storage.getPopupPosters();
      res.json(posters);
    } catch (error) {
      console.error("Error fetching popup posters:", error);
      res.status(500).json({ message: "Failed to fetch popup posters" });
    }
  });
  app2.get("/api/popup-posters/active", async (req, res) => {
    try {
      const poster = await storage.getActivePopupPoster();
      res.json(poster || null);
    } catch (error) {
      console.error("Error fetching active popup poster:", error);
      res.status(500).json({ message: "Failed to fetch active popup poster" });
    }
  });
  app2.post("/api/popup-posters", async (req, res) => {
    try {
      const posterSchema = z.object({
        imageUrl: z.string().min(1, "Image is required"),
        title: z.string().optional()
      });
      const validatedData = posterSchema.parse(req.body);
      const newPoster = await storage.createPopupPoster(validatedData);
      res.json(newPoster);
    } catch (error) {
      console.error("Error creating popup poster:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create popup poster" });
    }
  });
  app2.put("/api/popup-posters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        imageUrl: z.string().optional(),
        title: z.string().optional(),
        isActive: z.boolean().optional()
      });
      const validatedData = updateSchema.parse(req.body);
      const updatedPoster = await storage.updatePopupPoster(id, validatedData);
      if (!updatedPoster) {
        return res.status(404).json({ message: "Popup poster not found" });
      }
      res.json(updatedPoster);
    } catch (error) {
      console.error("Error updating popup poster:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update popup poster" });
    }
  });
  app2.delete("/api/popup-posters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePopupPoster(id);
      if (!deleted) {
        return res.status(404).json({ message: "Popup poster not found" });
      }
      res.json({ message: "Popup poster deleted successfully" });
    } catch (error) {
      console.error("Error deleting popup poster:", error);
      res.status(500).json({ message: "Failed to delete popup poster" });
    }
  });
  app2.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await Coupon.find({}).sort({ createdAt: -1 });
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });
  app2.get("/api/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });
  app2.post("/api/coupons", async (req, res) => {
    try {
      const couponSchema2 = z.object({
        code: z.string().min(1).toUpperCase(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed", "free_delivery"]),
        discountValue: z.number().min(0).optional(),
        minOrderAmount: z.number().min(0).optional(),
        maxDiscountAmount: z.number().min(0).optional(),
        usageLimit: z.number().min(1).optional(),
        validFrom: z.string().datetime(),
        validUntil: z.string().datetime(),
        isActive: z.boolean().optional()
      }).refine((data) => {
        if (data.discountType !== "free_delivery" && (!data.discountValue || data.discountValue < 0.01)) {
          return false;
        }
        return true;
      }, {
        message: "Discount value must be greater than 0 for percentage and fixed discounts",
        path: ["discountValue"]
      });
      const validatedData = couponSchema2.parse(req.body);
      const existingCoupon = await Coupon.findOne({ code: validatedData.code });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      const validFrom = new Date(validatedData.validFrom);
      const validUntil = new Date(validatedData.validUntil);
      if (validUntil <= validFrom) {
        return res.status(400).json({ message: "Valid until date must be after valid from date" });
      }
      const newCoupon = new Coupon({
        ...validatedData,
        validFrom,
        validUntil,
        usedCount: 0,
        isActive: validatedData.isActive !== false
      });
      await newCoupon.save();
      res.status(201).json(newCoupon);
    } catch (error) {
      console.error("Error creating coupon:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });
  app2.put("/api/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        code: z.string().min(1).toUpperCase().optional(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed", "free_delivery"]).optional(),
        discountValue: z.number().min(0).optional(),
        minOrderAmount: z.number().min(0).optional(),
        maxDiscountAmount: z.number().min(0).optional(),
        usageLimit: z.number().min(1).optional(),
        validFrom: z.string().datetime().optional(),
        validUntil: z.string().datetime().optional(),
        isActive: z.boolean().optional()
      }).refine((data) => {
        if (data.discountType && data.discountType !== "free_delivery" && (!data.discountValue || data.discountValue < 0.01)) {
          return false;
        }
        return true;
      }, {
        message: "Discount value must be greater than 0 for percentage and fixed discounts",
        path: ["discountValue"]
      });
      const validatedData = updateSchema.parse(req.body);
      if (validatedData.code) {
        const existingCoupon = await Coupon.findOne({
          code: validatedData.code,
          _id: { $ne: id }
        });
        if (existingCoupon) {
          return res.status(400).json({ message: "Coupon code already exists" });
        }
      }
      if (validatedData.validFrom && validatedData.validUntil) {
        const validFrom = new Date(validatedData.validFrom);
        const validUntil = new Date(validatedData.validUntil);
        if (validUntil <= validFrom) {
          return res.status(400).json({ message: "Valid until date must be after valid from date" });
        }
      }
      const updateData = { ...validatedData };
      if (validatedData.validFrom) {
        updateData.validFrom = new Date(validatedData.validFrom);
      }
      if (validatedData.validUntil) {
        updateData.validUntil = new Date(validatedData.validUntil);
      }
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      if (!updatedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(updatedCoupon);
    } catch (error) {
      console.error("Error updating coupon:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update coupon" });
    }
  });
  app2.delete("/api/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
      if (!deletedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });
  app2.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, orderAmount } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Coupon code is required" });
      }
      const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
      });
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }
      const now = /* @__PURE__ */ new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return res.status(400).json({ message: "Coupon has expired or is not yet valid" });
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }
      if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        return res.status(400).json({
          message: `Minimum order amount of \u09F3${coupon.minOrderAmount} required`
        });
      }
      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = Math.round(orderAmount * coupon.discountValue / 100);
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
      } else {
        discountAmount = coupon.discountValue;
      }
      res.json({
        valid: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount
        }
      });
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ message: "Failed to validate coupon" });
    }
  });
  app2.get("/api/payments/debug", async (req, res) => {
    try {
      const hasApiKey = !!process.env.RUPANTORPAY_API_KEY;
      const apiKeyLength = process.env.RUPANTORPAY_API_KEY?.length || 0;
      res.json({
        hasApiKey,
        apiKeyLength,
        environment: process.env.NODE_ENV || "development",
        host: req.get("host"),
        protocol: req.get("x-forwarded-proto") || "http"
      });
    } catch (error) {
      res.status(500).json({ error: "Debug endpoint failed" });
    }
  });
  app2.post("/api/payments/test", async (req, res) => {
    try {
      const apiKey = process.env.RUPANTORPAY_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "API key not configured" });
      }
      const host = req.get("host") || "localhost:5000";
      const protocol = req.get("x-forwarded-proto") || (host.includes("replit.dev") ? "https" : "http");
      const baseUrl = `${protocol}://${host}`;
      const testData = {
        fullname: "Test User",
        email: "test@example.com",
        amount: 10,
        success_url: `${baseUrl}/payment/success`,
        cancel_url: `${baseUrl}/payment/cancel`,
        webhook_url: `${baseUrl}/api/payments/webhook`,
        metadata: JSON.stringify({ test: true })
      };
      console.log("Testing RupantorPay API with:", testData);
      const response = await fetch("https://payment.rupantorpay.com/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
          "X-CLIENT": host,
          "Accept": "application/json"
        },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      res.json({
        httpStatus: response.status,
        responseData: data,
        success: response.ok && (data.payment_url || data.checkout_url)
      });
    } catch (error) {
      console.error("RupantorPay test error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Test failed"
      });
    }
  });
  const createPaymentSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    amount: z.number().min(0.1, "Amount must be greater than 0"),
    customerInfo: z.object({
      fullname: z.string().min(1, "Customer name is required"),
      email: z.string().email("Valid email is required"),
      phone: z.string().optional()
    }),
    metadata: z.any().optional()
  });
  const verifyPaymentSchema = z.object({
    transactionId: z.string().min(1, "Transaction ID is required")
  });
  app2.post("/api/payments/create", async (req, res) => {
    try {
      console.log("Payment creation request received:", req.body);
      const result = createPaymentSchema.safeParse(req.body);
      if (!result.success) {
        console.error("Validation failed:", result.error.flatten().fieldErrors);
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors
        });
      }
      const { orderId, amount, customerInfo, metadata } = result.data;
      console.log("Processing payment for order:", orderId, "Amount:", amount);
      const existingPayment = await PaymentTransaction.findOne({ orderId });
      if (existingPayment && existingPayment.status === "pending") {
        console.log("Existing payment found, returning existing URL");
        return res.json({
          success: true,
          message: "Payment already initialized",
          paymentUrl: existingPayment.paymentUrl,
          orderId
        });
      }
      const apiKey = process.env.RUPANTORPAY_API_KEY;
      if (!apiKey || apiKey.trim() === "") {
        console.error("RupantorPay API key not configured");
        return res.status(500).json({
          message: "Payment gateway not configured",
          error: "API key missing"
        });
      }
      console.log("API Key configured:", !!apiKey, "Length:", apiKey.length);
      const host = req.get("host") || "localhost:5000";
      const protocol = req.get("x-forwarded-proto") || (host.includes("replit.dev") ? "https" : "http");
      const baseUrl = `${protocol}://${host}`;
      console.log("Using base URL:", baseUrl);
      const paymentData = {
        fullname: customerInfo.fullname.trim(),
        email: customerInfo.email.trim(),
        amount: Math.round(amount),
        // Keep as number, not string
        success_url: `${baseUrl}/payment/success`,
        cancel_url: `${baseUrl}/payment/cancel`,
        webhook_url: `${baseUrl}/api/payments/webhook`,
        metadata: {
          orderId,
          customerPhone: customerInfo.phone || "",
          ...metadata
        }
      };
      console.log("Sending payment request to RupantorPay:", {
        ...paymentData,
        apiKeyPresent: !!apiKey,
        host
      });
      const rupantorPayResponse = await fetch("https://payment.rupantorpay.com/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
          "X-CLIENT": host,
          "Accept": "application/json"
        },
        body: JSON.stringify(paymentData)
      });
      console.log("RupantorPay response status:", rupantorPayResponse.status);
      let responseData;
      try {
        responseData = await rupantorPayResponse.json();
        console.log("RupantorPay response data:", responseData);
      } catch (parseError) {
        console.error("Failed to parse RupantorPay response:", parseError);
        const responseText = await rupantorPayResponse.text();
        console.error("Raw response:", responseText);
        return res.status(500).json({
          message: "Payment gateway error",
          error: "Invalid response from payment provider"
        });
      }
      if (!rupantorPayResponse.ok) {
        console.error("RupantorPay API HTTP error:", rupantorPayResponse.status, responseData);
        return res.status(400).json({
          message: "Payment initialization failed",
          error: responseData?.message || responseData?.error || "Payment gateway rejected the request"
        });
      }
      if (responseData && (responseData.status === false || responseData.error)) {
        console.error("RupantorPay API business error:", responseData);
        return res.status(400).json({
          message: "Payment initialization failed",
          error: responseData.message || responseData.error || "Payment gateway error"
        });
      }
      if (!responseData || !responseData.payment_url && !responseData.checkout_url) {
        console.error("Missing payment URL in response:", responseData);
        return res.status(500).json({
          message: "Payment initialization failed",
          error: "Payment URL not provided by gateway",
          debug: responseData
        });
      }
      const paymentUrl = responseData.payment_url || responseData.checkout_url;
      const paymentTransaction = new PaymentTransaction({
        orderId,
        paymentUrl,
        transactionId: responseData.transaction_id || void 0,
        // Use undefined instead of null
        amount,
        currency: "BDT",
        customerInfo,
        status: "pending",
        metadata,
        successUrl: paymentData.success_url,
        cancelUrl: paymentData.cancel_url,
        webhookUrl: paymentData.webhook_url,
        gatewayResponse: responseData
      });
      await paymentTransaction.save();
      console.log("Payment transaction saved with ID:", paymentTransaction._id);
      res.json({
        success: true,
        message: "Payment initialized successfully",
        paymentUrl,
        orderId,
        transactionId: responseData.transaction_id || null
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return res.status(500).json({
          message: "Unable to connect to payment gateway",
          error: "Network connection failed"
        });
      }
      if (error instanceof SyntaxError) {
        return res.status(500).json({
          message: "Invalid response from payment gateway",
          error: "Response parsing failed"
        });
      }
      res.status(500).json({
        message: "Failed to initialize payment",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/payments/verify", async (req, res) => {
    try {
      const result = verifyPaymentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors
        });
      }
      const { transactionId } = result.data;
      const verificationResponse = await fetch("https://payment.rupantorpay.com/api/payment/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.RUPANTORPAY_API_KEY
        },
        body: JSON.stringify({ transaction_id: transactionId })
      });
      const verificationData = await verificationResponse.json();
      if (!verificationData.status) {
        return res.status(400).json({
          message: "Payment verification failed",
          error: verificationData.message
        });
      }
      const paymentTransaction = await PaymentTransaction.findOne({ transactionId });
      if (paymentTransaction) {
        paymentTransaction.status = verificationData.payment_status === "COMPLETED" ? "completed" : "failed";
        paymentTransaction.verifiedAt = /* @__PURE__ */ new Date();
        paymentTransaction.callbackData = verificationData;
        await paymentTransaction.save();
      }
      res.json({
        success: true,
        transactionId,
        status: verificationData.payment_status,
        amount: verificationData.amount,
        paymentMethod: verificationData.payment_method
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        message: "Failed to verify payment",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/payments/webhook", async (req, res) => {
    try {
      const webhookData = req.body;
      const webhook = new PaymentWebhook({
        transactionId: webhookData.transactionId || "unknown",
        paymentStatus: webhookData.status || "unknown",
        rawData: webhookData,
        processed: false
      });
      try {
        await webhook.save();
        if (webhookData.transactionId) {
          const paymentTransaction = await PaymentTransaction.findOne({
            transactionId: webhookData.transactionId
          });
          if (paymentTransaction) {
            paymentTransaction.status = webhookData.status === "COMPLETED" ? "completed" : webhookData.status === "FAILED" ? "failed" : "processing";
            paymentTransaction.paymentMethod = webhookData.paymentMethod;
            paymentTransaction.paymentFee = webhookData.paymentFee;
            paymentTransaction.callbackData = webhookData;
            if (webhookData.status === "COMPLETED") {
              paymentTransaction.verifiedAt = /* @__PURE__ */ new Date();
            }
            await paymentTransaction.save();
            if (webhookData.status === "COMPLETED") {
              await Order.findOneAndUpdate(
                { _id: paymentTransaction.orderId },
                {
                  status: "confirmed",
                  paymentMethod: webhookData.paymentMethod || "rupantorpay"
                }
              );
            }
          }
          webhook.processed = true;
          await webhook.save();
        }
      } catch (processingError) {
        webhook.errorMessage = processingError instanceof Error ? processingError.message : "Unknown error";
        await webhook.save();
        console.error("Webhook processing error:", processingError);
      }
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(200).json({ received: true });
    }
  });
  app2.get("/api/payments/status/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const paymentTransaction = await PaymentTransaction.findOne({ orderId });
      if (!paymentTransaction) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json({
        orderId: paymentTransaction.orderId,
        transactionId: paymentTransaction.transactionId,
        status: paymentTransaction.status,
        amount: paymentTransaction.amount,
        currency: paymentTransaction.currency,
        paymentMethod: paymentTransaction.paymentMethod,
        createdAt: paymentTransaction.createdAt,
        verifiedAt: paymentTransaction.verifiedAt
      });
    } catch (error) {
      console.error("Payment status error:", error);
      res.status(500).json({ message: "Failed to get payment status" });
    }
  });
  app2.get("/api/payment/success", async (req, res) => {
    const { transactionId, paymentMethod, paymentAmount, status } = req.query;
    console.log("Payment success callback received:", req.query);
    if (transactionId && status === "COMPLETED") {
      try {
        const paymentTransaction = await PaymentTransaction.findOne({ transactionId });
        if (paymentTransaction) {
          console.log("Updating payment transaction:", paymentTransaction.orderId);
          paymentTransaction.status = "completed";
          paymentTransaction.transactionId = transactionId;
          paymentTransaction.paymentMethod = paymentMethod;
          paymentTransaction.verifiedAt = /* @__PURE__ */ new Date();
          paymentTransaction.callbackData = req.query;
          await paymentTransaction.save();
          const updatedOrder = await Order.findOneAndUpdate(
            { _id: paymentTransaction.orderId },
            {
              status: "confirmed",
              paymentStatus: "Paid",
              paymentMethod: paymentMethod || "rupantorpay"
            },
            { new: true }
          );
          await Invoice.findOneAndUpdate(
            { orderId: paymentTransaction.orderId },
            {
              paymentStatus: "Paid",
              paymentMethod: paymentMethod || "rupantorpay"
            }
          );
          console.log("Payment and order updated successfully for order:", paymentTransaction.orderId);
        }
      } catch (error) {
        console.error("Payment success callback error:", error);
      }
    }
    res.redirect(`/payment-success?transactionId=${transactionId}&amount=${paymentAmount}&status=COMPLETED`);
  });
  app2.get("/api/payment/cancel", async (req, res) => {
    const { transactionId } = req.query;
    if (transactionId) {
      try {
        await PaymentTransaction.findOneAndUpdate(
          { transactionId },
          {
            status: "cancelled",
            callbackData: req.query
          }
        );
      } catch (error) {
        console.error("Payment cancel callback error:", error);
      }
    }
    res.redirect(`/?payment=cancelled&transactionId=${transactionId}`);
  });
  app2.get("/payment/success", (req, res) => {
    const queryString = new URLSearchParams(req.query).toString();
    res.redirect(`/api/payment/success${queryString ? "?" + queryString : ""}`);
  });
  app2.get("/payment/cancel", (req, res) => {
    const queryString = new URLSearchParams(req.query).toString();
    res.redirect(`/api/payment/cancel${queryString ? "?" + queryString : ""}`);
  });
  app2.get("/api/reviews/product/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await Review.find({
        productId,
        isApproved: true
      }).sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.post("/api/reviews", async (req, res) => {
    try {
      const reviewSchema2 = z.object({
        productId: z.string().min(1, "Product ID is required"),
        userId: z.string().optional(),
        userName: z.string().min(1, "Name is required"),
        userEmail: z.string().email().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1, "Review comment is required")
      });
      const validatedData = reviewSchema2.parse(req.body);
      let isVerifiedPurchase = false;
      if (validatedData.userId) {
        const order = await Order.findOne({
          userId: validatedData.userId,
          "items.productId": validatedData.productId,
          status: { $in: ["Processing", "confirmed", "shipped", "delivered"] }
        });
        isVerifiedPurchase = !!order;
      }
      const review = new Review({
        ...validatedData,
        isVerifiedPurchase,
        isApproved: true
        // Auto-approve for now, can be changed to false for moderation
      });
      await review.save();
      const productReviews = await Review.find({
        productId: validatedData.productId,
        isApproved: true
      });
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await Product.findByIdAndUpdate(validatedData.productId, {
        rating: Math.round(avgRating * 10) / 10,
        // Round to 1 decimal
        reviews: productReviews.length
      });
      res.status(201).json({
        message: "Review submitted successfully",
        review
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to submit review" });
    }
  });
  app2.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await Review.find({}).sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.put("/api/admin/reviews/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;
      const review = await Review.findByIdAndUpdate(
        id,
        { isApproved },
        { new: true }
      );
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      const productReviews = await Review.find({
        productId: review.productId,
        isApproved: true
      });
      const avgRating = productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : 0;
      await Product.findByIdAndUpdate(review.productId, {
        rating: Math.round(avgRating * 10) / 10,
        reviews: productReviews.length
      });
      res.json({ message: "Review updated successfully", review });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });
  app2.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      const productReviews = await Review.find({
        productId: review.productId,
        isApproved: true
      });
      const avgRating = productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : 0;
      await Product.findByIdAndUpdate(review.productId, {
        rating: Math.round(avgRating * 10) / 10,
        reviews: productReviews.length
      });
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  const server = createServer(app2);
  return server;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"]
        }
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    watch: {
      usePolling: false,
      interval: 1e3,
      ignored: ["**/node_modules/**", "**/uploads/**", "**/attached_assets/**"]
    },
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@replit/vite-plugin-cartographer"]
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server
    },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom",
    clearScreen: false,
    // Reduce console output
    logLevel: "warn"
    // Reduce verbose logging
  });
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    return vite.middlewares(req, res, next);
  });
  app2.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api")) {
      return next();
    }
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/admin-setup.ts
import bcrypt2 from "bcrypt";
async function createAdminAccount() {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      const hashedPassword2 = await bcrypt2.hash("meow123", 10);
      existingAdmin.password = hashedPassword2;
      await existingAdmin.save();
      console.log("Admin account password updated");
      return;
    }
    const hashedPassword = await bcrypt2.hash("meow123", 10);
    const adminUser = new User({
      username: "admin",
      password: hashedPassword,
      email: "admin@gmail.com",
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      isActive: true
    });
    await adminUser.save();
    console.log("Admin account created successfully:", adminUser.email);
    const brands = [
      { name: "Default Brand", slug: "default-brand", description: "Default brand for products without specific brand assignment" },
      { name: "Nekko", slug: "nekko", description: "Premium cat food brand from Thailand" },
      { name: "Purina", slug: "purina", description: "Trusted pet nutrition for over 90 years" },
      { name: "Purina One", slug: "purina-one", description: "Purposeful nutrition for dogs and cats" },
      { name: "Reflex", slug: "reflex", description: "Complete nutrition for pets" },
      { name: "Reflex Plus", slug: "reflex-plus", description: "Enhanced nutrition with premium ingredients" },
      { name: "Royal Canin", slug: "royal-canin", description: "Breed-specific and life-stage nutrition" },
      { name: "Sheba", slug: "sheba", description: "Gourmet cat food with fine cuts" }
    ];
    for (const brandData of brands) {
      const existingBrand = await Brand.findOne({ slug: brandData.slug });
      if (!existingBrand) {
        const brand = new Brand(brandData);
        await brand.save();
        console.log(`Created brand: ${brandData.name}`);
      }
    }
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}

// server/index.ts
dotenv.config();
if (!process.env.MONGODB_URI) {
  console.error("\u274C MONGODB_URI not found in environment variables!");
  console.error("Please make sure .env file exists and contains:");
  console.error("MONGODB_URI=your_mongodb_connection_string_here");
  process.exit(1);
}
console.log("\u2705 Environment configuration validated");
var app = express2();
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await connectDB();
  initializeEmailService();
  await createAdminAccount();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
