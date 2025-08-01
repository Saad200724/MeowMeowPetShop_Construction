// server/index.ts
import dotenv from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  categories;
  brands;
  products;
  blogPosts;
  testimonials;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.brands = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.testimonials = /* @__PURE__ */ new Map();
    this.initializeSampleData();
  }
  initializeSampleData() {
    const catFoodCategory = {
      id: randomUUID(),
      name: "Cat Food",
      slug: "cat-food",
      description: "Premium food for cats of all ages",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      image: null,
      parentId: null
    };
    const dogFoodCategory = {
      id: randomUUID(),
      name: "Dog Food",
      slug: "dog-food",
      description: "Nutritious food for dogs of all sizes",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      image: null,
      parentId: null
    };
    this.categories.set(catFoodCategory.id, catFoodCategory);
    this.categories.set(dogFoodCategory.id, dogFoodCategory);
    const royalCanin = {
      id: randomUUID(),
      name: "Royal Canin",
      slug: "royal-canin",
      description: "Premium pet nutrition brand",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      logo: null
    };
    this.brands.set(royalCanin.id, royalCanin);
    const premiumCatFood = {
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      originalPrice: null,
      images: null,
      features: null,
      specifications: null,
      isNew: false,
      isOnSale: false,
      discount: 0
    };
    this.products.set(premiumCatFood.id, premiumCatFood);
    const blogPost1 = {
      id: randomUUID(),
      title: "10 Essential Tips for New Pet Owners",
      slug: "essential-tips-new-pet-owners",
      excerpt: "Starting your journey as a pet parent? Here are the essential tips every new pet owner should know.",
      content: "Full blog content here...",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      author: "Dr. Sarah Ahmed",
      publishedAt: /* @__PURE__ */ new Date("2024-03-15"),
      tags: ["tips", "new-owners", "pets"],
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(blogPost1.id, blogPost1);
    const testimonial1 = {
      id: randomUUID(),
      name: "Sarah Rahman",
      role: "Cat Parent",
      location: "Savar",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      text: "Meow Meow Pet Shop has the best quality pet food in Savar! My cat Luna loves their premium kibble and the delivery is always on time. Highly recommended!",
      rating: 5,
      isApproved: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.testimonials.set(testimonial1.id, testimonial1);
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  // Category methods
  async getCategories() {
    return Array.from(this.categories.values()).filter((cat) => cat.isActive);
  }
  async getCategory(id) {
    return this.categories.get(id);
  }
  async createCategory(insertCategory) {
    const id = randomUUID();
    const category = {
      ...insertCategory,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.categories.set(id, category);
    return category;
  }
  // Brand methods
  async getBrands() {
    return Array.from(this.brands.values()).filter((brand) => brand.isActive);
  }
  async getBrand(id) {
    return this.brands.get(id);
  }
  async createBrand(insertBrand) {
    const id = randomUUID();
    const brand = {
      ...insertBrand,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.brands.set(id, brand);
    return brand;
  }
  // Product methods
  async getProducts(filters) {
    let products2 = Array.from(this.products.values()).filter((p) => p.isActive);
    if (filters) {
      if (filters.categoryId) {
        products2 = products2.filter((p) => p.categoryId === filters.categoryId);
      }
      if (filters.brandId) {
        products2 = products2.filter((p) => p.brandId === filters.brandId);
      }
      if (filters.isNew !== void 0) {
        products2 = products2.filter((p) => p.isNew === filters.isNew);
      }
      if (filters.isBestseller !== void 0) {
        products2 = products2.filter((p) => p.isBestseller === filters.isBestseller);
      }
      if (filters.isOnSale !== void 0) {
        products2 = products2.filter((p) => p.isOnSale === filters.isOnSale);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products2 = products2.filter(
          (p) => p.name.toLowerCase().includes(searchLower) || p.description?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.offset) {
        products2 = products2.slice(filters.offset);
      }
      if (filters.limit) {
        products2 = products2.slice(0, filters.limit);
      }
    }
    return products2;
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(insertProduct) {
    const id = randomUUID();
    const product = {
      ...insertProduct,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, product);
    return product;
  }
  // Blog post methods
  async getBlogPosts(published) {
    let posts = Array.from(this.blogPosts.values());
    if (published !== void 0) {
      posts = posts.filter((p) => p.isPublished === published);
    }
    return posts.sort(
      (a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
    );
  }
  async getBlogPost(id) {
    return this.blogPosts.get(id);
  }
  async getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find((p) => p.slug === slug);
  }
  async createBlogPost(insertPost) {
    const id = randomUUID();
    const post = {
      ...insertPost,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, post);
    return post;
  }
  // Testimonial methods
  async getTestimonials(approved) {
    let testimonials2 = Array.from(this.testimonials.values());
    if (approved !== void 0) {
      testimonials2 = testimonials2.filter((t) => t.isApproved === approved);
    }
    return testimonials2.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getTestimonial(id) {
    return this.testimonials.get(id);
  }
  async createTestimonial(insertTestimonial) {
    const id = randomUUID();
    const testimonial = {
      ...insertTestimonial,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: jsonb("address"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: varchar("parent_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  categoryId: varchar("category_id").notNull(),
  brandId: varchar("brand_id").notNull(),
  image: text("image").notNull(),
  images: text("images").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviews: integer("reviews").default(0),
  stockStatus: text("stock_status").notNull().default("In Stock"),
  stockQuantity: integer("stock_quantity").default(0),
  tags: text("tags").array(),
  features: text("features").array(),
  specifications: jsonb("specifications"),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  isOnSale: boolean("is_on_sale").default(false),
  discount: integer("discount").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  image: text("image"),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at"),
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role"),
  location: text("location"),
  image: text("image"),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  app2.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });
  app2.get("/api/brands", async (req, res) => {
    try {
      const brands2 = await storage.getBrands();
      res.json(brands2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  app2.get("/api/brands/:id", async (req, res) => {
    try {
      const brand = await storage.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });
  app2.post("/api/brands", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Invalid brand data" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        brandId: req.query.brandId,
        isNew: req.query.isNew === "true" ? true : req.query.isNew === "false" ? false : void 0,
        isBestseller: req.query.isBestseller === "true" ? true : req.query.isBestseller === "false" ? false : void 0,
        isOnSale: req.query.isOnSale === "true" ? true : req.query.isOnSale === "false" ? false : void 0,
        search: req.query.search,
        limit: req.query.limit ? parseInt(req.query.limit) : void 0,
        offset: req.query.offset ? parseInt(req.query.offset) : void 0
      };
      Object.keys(filters).forEach((key) => {
        if (filters[key] === void 0) {
          delete filters[key];
        }
      });
      const products2 = await storage.getProducts(filters);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === "true" ? true : req.query.published === "false" ? false : void 0;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const approved = req.query.approved === "true" ? true : req.query.approved === "false" ? false : void 0;
      const testimonials2 = await storage.getTestimonials(approved);
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  app2.get("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonial" });
    }
  });
  app2.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products2 = await storage.getProducts({ search: query, limit: 20 });
      res.json({ products: products2 });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
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
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
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
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
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
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
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
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
