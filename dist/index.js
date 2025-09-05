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
  status: { type: String, default: "Processing" },
  total: { type: Number, required: true },
  items: [{ type: Schema.Types.Mixed }],
  shippingAddress: Schema.Types.Mixed,
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
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now }
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

// server/storage.ts
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
        id: "reflex",
        name: "Reflex Brand",
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
      const dbBrands = await Brand.find({ isActive: true });
      return dbBrands.map((brand) => ({
        id: brand.id.toString(),
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || "",
        description: brand.description || ""
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
  async seedDatabase() {
    try {
      console.log("Seeding database with initial data...");
      for (const category of this.categories) {
        const existingCategory = await Category.findOne({ slug: category.id });
        if (!existingCategory) {
          const dbCategory = new Category({
            name: category.name,
            slug: category.id
          });
          await dbCategory.save();
          let brand = await Brand.findOne({ name: "Default Brand" });
          if (!brand) {
            brand = new Brand({
              name: "Default Brand",
              slug: "default-brand"
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

// server/routes.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
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
  app2.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
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
      const dbProducts = await Product.find({
        isActive: true,
        tags: {
          $not: {
            $in: ["repack-food", "repack", "bulk-save", "bulk"]
          }
        }
      });
      const products = [];
      for (const product of dbProducts) {
        try {
          let category = null;
          try {
            category = await Category.findById(product.categoryId);
          } catch (objectIdError) {
            category = await Category.findOne({ slug: product.categoryId });
          }
          if (!category) {
            category = await Category.findOne({ name: product.categoryId });
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
          products.push({
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
            specifications: product.specifications || {}
          });
        } catch (err) {
          console.warn("Skipping product with invalid data:", product.name || "Unknown", err.message);
        }
      }
      console.log(`Successfully fetched ${products.length} products (excluding bulk/repack products)`);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      let categoryRecord = await Category.findOne({
        $or: [
          { slug: productData.categoryId },
          { name: productData.categoryId }
        ]
      });
      if (!categoryRecord) {
        categoryRecord = new Category({
          name: productData.categoryId,
          slug: productData.categoryId.toLowerCase().replace(/\s+/g, "-")
        });
        await categoryRecord.save();
      }
      let brandRecord = await Brand.findOne({
        $or: [
          { slug: productData.brandId },
          { name: productData.brandId }
        ]
      });
      if (!brandRecord) {
        brandRecord = new Brand({
          name: productData.brandId,
          slug: productData.brandId.toLowerCase().replace(/\s+/g, "-")
        });
        await brandRecord.save();
      }
      const newProduct = new Product({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice || void 0,
        categoryId: categoryRecord._id,
        brandId: brandRecord._id,
        image: productData.image,
        stockQuantity: parseInt(productData.stockQuantity) || 0,
        tags,
        isNew: productData.isNew || false,
        isBestseller: productData.isBestseller || false,
        isOnSale: productData.isOnSale || false,
        isActive: productData.isActive !== false,
        rating: 4.5
        // Default rating
      });
      await newProduct.save();
      console.log("Created product:", newProduct);
      res.status(201).json(newProduct);
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
      let categoryRecord = await Category.findOne({
        $or: [
          { slug: productData.categoryId },
          { name: productData.categoryId }
        ]
      });
      if (!categoryRecord) {
        categoryRecord = new Category({
          name: productData.categoryId,
          slug: productData.categoryId.toLowerCase().replace(/\s+/g, "-")
        });
        await categoryRecord.save();
      }
      let brandRecord = await Brand.findOne({
        $or: [
          { slug: productData.brandId },
          { name: productData.brandId }
        ]
      });
      if (!brandRecord) {
        brandRecord = new Brand({
          name: productData.brandId,
          slug: productData.brandId.toLowerCase().replace(/\s+/g, "-")
        });
        await brandRecord.save();
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          originalPrice: productData.originalPrice || void 0,
          categoryId: categoryRecord._id,
          brandId: brandRecord._id,
          image: productData.image,
          stockQuantity: parseInt(productData.stockQuantity) || 0,
          tags,
          isNew: productData.isNew || false,
          isBestseller: productData.isBestseller || false,
          isOnSale: productData.isOnSale || false,
          isActive: productData.isActive !== false,
          updatedAt: /* @__PURE__ */ new Date()
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
    email: z.string().email(),
    password: z.string().min(6)
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
      const { password: _, ...userResponse } = user;
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
    try {
      const {
        userId,
        customerInfo,
        items,
        subtotal,
        total,
        paymentMethod,
        shippingAddress
      } = req.body;
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const order = new Order({
        userId,
        status: "Processing",
        total,
        items,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid"
      });
      await order.save();
      const invoice = new Invoice({
        invoiceNumber,
        orderId: order._id.toString(),
        userId,
        customerInfo,
        items,
        subtotal,
        total,
        paymentMethod,
        paymentStatus: order.paymentStatus
      });
      await invoice.save();
      await Cart.findOneAndUpdate(
        { userId },
        { items: [], total: 0 }
      );
      res.json({ order, invoice });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      res.json(orders);
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
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
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
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
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
    hmr: { server },
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
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
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
      console.log("Admin account already exists");
      await cleanupCorruptedBrands();
      return;
    }
    const hashedPassword = await bcrypt2.hash("meowmeow123", 10);
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
    await cleanupCorruptedBrands();
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}
async function cleanupCorruptedBrands() {
  try {
    console.log("Running cleanup for corrupted brands...");
    const allBrands = await Brand.find({});
    console.log("Found", allBrands.length, "total brands");
    const corruptedBrands = await Brand.find({
      $or: [
        { name: { $regex: /^[0-9a-fA-F]{24}$/ } },
        // ObjectId pattern
        { slug: { $regex: /^[0-9a-fA-F]{24}$/ } },
        // ObjectId pattern
        { name: "68a571911833638a216fa865" },
        // Specific problematic brand
        { slug: "68a571911833638a216fa865" }
        // Specific problematic brand
      ]
    });
    if (corruptedBrands.length > 0) {
      console.log("Found corrupted brands:", corruptedBrands.map((b) => `${b._id}: ${b.name}`));
      const deleteResult = await Brand.deleteMany({
        $or: [
          { name: { $regex: /^[0-9a-fA-F]{24}$/ } },
          { slug: { $regex: /^[0-9a-fA-F]{24}$/ } },
          { name: "68a571911833638a216fa865" },
          { slug: "68a571911833638a216fa865" }
        ]
      });
      console.log("Cleanup result:", deleteResult);
      console.log("Successfully removed", deleteResult.deletedCount, "corrupted brands");
    } else {
      console.log("No corrupted brands found to clean up");
    }
  } catch (error) {
    console.error("Error during brand cleanup:", error);
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
