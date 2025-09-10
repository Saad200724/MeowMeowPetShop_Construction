import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { User, Product, Category, Brand, Announcement, Cart, Order, Invoice, BlogPost, Coupon } from "@shared/models";
import type { IUser, ICart, ICartItem, IOrder, IInvoice, IBlogPost, ICoupon } from "@shared/models";
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
// EmailJS handles email sending on the client side

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), 'uploads');

  // Ensure upload directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // Use memory storage for Sharp processing
  const upload = multer({
    storage:multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
      // Check if file is an image
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Image upload endpoint with WebP conversion
  app.post('/api/upload/image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Generate unique filename with .webp extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const webpFilename = `${req.file.fieldname}-${uniqueSuffix}.webp`;
      const outputPath = path.join(uploadDir, webpFilename);

      // Convert image to WebP format using Sharp with optimized compression
      await sharp(req.file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({
          quality: 75,    // Optimized quality for smaller size
          effort: 6,      // Maximum compression effort
          lossless: false // Use lossy compression for smaller files
        })
        .toFile(outputPath);

      // Get file size information
      const stats = await fs.stat(outputPath);

      const imageUrl = `/api/uploads/${webpFilename}`;
      res.json({
        message: 'Image uploaded and converted to WebP successfully',
        imageUrl: imageUrl,
        filename: webpFilename,
        originalFormat: req.file.mimetype,
        convertedFormat: 'image/webp',
        originalSize: req.file.size,
        compressedSize: stats.size,
        compressionRatio: `${Math.round((1 - stats.size / req.file.size) * 100)}%`
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // Serve uploaded images with proper WebP headers
  app.get('/api/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    // Set proper content type for WebP images
    if (filename.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }

    res.sendFile(filepath);
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Admin endpoint to seed missing categories
  app.post("/api/admin/seed-categories", async (req, res) => {
    try {
      const newCategories = [
        { name: 'Cat Food', slug: 'cat-food' },
        { name: 'Dog Food', slug: 'dog-food' },
        { name: 'Cat Toys', slug: 'cat-toys' },
        { name: 'Cat Litter', slug: 'cat-litter' },
        { name: 'Cat Care & Health', slug: 'cat-care' },
        { name: 'Clothing, Beds & Carrier', slug: 'clothing-beds-carrier' },
        { name: 'Cat Accessories', slug: 'cat-accessories' },
        { name: 'Dog Health & Accessories', slug: 'dog-accessories' },
        { name: 'Rabbit Food & Accessories', slug: 'rabbit' },
        { name: 'Bird Food & Accessories', slug: 'bird' }
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

  // Brands API
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Delete Brand API
  app.delete("/api/brands/:id", async (req, res) => {
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

  // Products API - Excludes bulk/repack products from general listings
  app.get("/api/products", async (req, res) => {
    try {
      // Get products directly from MongoDB to avoid storage layer issues
      // Exclude bulk/repack products from general product listings
      const dbProducts = await Product.find({
        isActive: true,
        tags: {
          $not: {
            $in: ['repack-food', 'repack', 'bulk-save', 'bulk']
          }
        }
      });
      const products = [];

      for (const product of dbProducts) {
        try {
          let category = null;

          // Try to find category by ObjectId first
          try {
            category = await Category.findById(product.categoryId);
          } catch (objectIdError) {
            // If ObjectId lookup fails, try slug lookup
            category = await Category.findOne({ slug: product.categoryId });
          }

          // If still not found, try by name
          if (!category) {
            category = await Category.findOne({ name: product.categoryId });
          }

          // Resolve brand information
          let brand = null;
          if (product.brandId) {
            try {
              brand = await Brand.findById(product.brandId);
            } catch (brandError) {
              // If ObjectId lookup fails, try slug lookup
              brand = await Brand.findOne({ slug: product.brandId });
            }
            // If still not found, try by name
            if (!brand) {
              brand = await Brand.findOne({ name: product.brandId });
            }
          }

          products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: category?.slug || 'uncategorized',
            categoryName: category?.name || 'Uncategorized',
            brandId: product.brandId,
            brandName: brand?.name || 'No Brand',
            brandSlug: brand?.slug || 'no-brand',
            image: product.image,
            images: product.images || [],
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            stock: product.stockQuantity || 0,
            stockStatus: product.stockStatus || 'In Stock',
            tags: product.tags || [],
            features: product.features || [],
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            isOnSale: product.isOnSale || false,
            discount: product.discount || 0,
            description: product.description || '',
            specifications: product.specifications || {}
          });
        } catch (err: any) {
          // Skip products with invalid data or bulk products that might have slipped through
          console.warn('Skipping product with invalid data:', product.name || 'Unknown', err.message);
        }
      }

      console.log(`Successfully fetched ${products.length} products (excluding bulk/repack products)`);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Resolve category and brand information
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
        categoryName: category?.name || 'Uncategorized',
        categorySlug: category?.slug || 'uncategorized',
        brandName: brand?.name || 'No Brand',
        brandSlug: brand?.slug || 'no-brand'
      };

      res.json(enrichedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = req.body;
      console.log('Received product data:', productData);

      // Parse tags if they exist (comma-separated string to array)
      const tags = productData.tags ? productData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];

      // Category mapping for proper slug creation
      const categoryMappings: { [key: string]: { name: string; slug: string } } = {
        'cat-food': { name: 'Cat Food', slug: 'cat-food' },
        'dog-food': { name: 'Dog Food', slug: 'dog-food' },
        'cat-toys': { name: 'Cat Toys', slug: 'cat-toys' },
        'cat-litter': { name: 'Cat Litter', slug: 'cat-litter' },
        'cat-care': { name: 'Cat Care & Health', slug: 'cat-care' },
        'clothing-beds-carrier': { name: 'Clothing, Beds & Carrier', slug: 'clothing-beds-carrier' },
        'cat-accessories': { name: 'Cat Accessories', slug: 'cat-accessories' },
        'dog-accessories': { name: 'Dog Health & Accessories', slug: 'dog-accessories' },
        'rabbit': { name: 'Rabbit Food & Accessories', slug: 'rabbit' },
        'bird': { name: 'Bird Food & Accessories', slug: 'bird' }
      };

      // Brand mapping for proper slug creation
      const brandMappings: { [key: string]: { name: string; slug: string } } = {
        'default-brand': { name: 'Default Brand', slug: 'default-brand' },
        'nekko': { name: 'Nekko', slug: 'nekko' },
        'purina': { name: 'Purina', slug: 'purina' },
        'purina-one': { name: 'Purina One', slug: 'one' },
        'one': { name: 'Purina One', slug: 'one' },
        'reflex': { name: 'Reflex', slug: 'reflex' },
        'reflex-plus': { name: 'Reflex Plus', slug: 'reflex-plus' },
        'royal-canin': { name: 'Royal Canin', slug: 'royal-canin' },
        'sheba': { name: 'Sheba', slug: 'sheba' }
      };

      // Find category and brand by their IDs/names/slugs
      let categoryRecord = null;

      // First try to find existing category
      if (productData.categoryId) {
        // Check if it's a valid ObjectId first
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.categoryId);

        if (isValidObjectId) {
          categoryRecord = await Category.findById(productData.categoryId);
        } else {
          // Look up by slug or name
          categoryRecord = await Category.findOne({
            $or: [
              { slug: productData.categoryId },
              { name: productData.categoryId }
            ]
          });
        }
      }

      if (!categoryRecord) {
        // Create category if it doesn't exist using proper mapping
        const categoryMapping = categoryMappings[productData.categoryId];
        categoryRecord = new Category({
          name: categoryMapping ? categoryMapping.name : productData.categoryId,
          slug: categoryMapping ? categoryMapping.slug : productData.categoryId.toLowerCase().replace(/\s+/g, '-'),
        });
        await categoryRecord.save();
        console.log(`Created new category: ${categoryRecord.name} with slug: ${categoryRecord.slug}`);
      }

      let brandRecord = null;

      // First try to find existing brand
      if (productData.brandId) {
        // Check if it's a valid ObjectId first
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.brandId);

        if (isValidObjectId) {
          brandRecord = await Brand.findById(productData.brandId);
        } else {
          // Look up by slug or name
          brandRecord = await Brand.findOne({
            $or: [
              { slug: productData.brandId },
              { name: productData.brandId }
            ]
          });
        }
      }

      if (!brandRecord) {
        // Create brand if it doesn't exist using proper mapping
        const brandMapping = brandMappings[productData.brandId];
        brandRecord = new Brand({
          name: brandMapping ? brandMapping.name : productData.brandId,
          slug: brandMapping ? brandMapping.slug : productData.brandId.toLowerCase().replace(/\s+/g, '-'),
        });
        await brandRecord.save();
        console.log(`Created new brand: ${brandRecord.name} with slug: ${brandRecord.slug}`);
      }

      // Create product directly in database with all fields
      const newProduct = new Product({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice || undefined,
        categoryId: categoryRecord._id,
        brandId: brandRecord._id,
        image: productData.image,
        stockQuantity: parseInt(productData.stockQuantity) || 0,
        tags: tags,
        isNew: productData.isNew || false,
        isBestseller: productData.isBestseller || false,
        isOnSale: productData.isOnSale || false,
        isActive: productData.isActive !== false,
        rating: 4.5, // Default rating
      });

      await newProduct.save();

      console.log('Created product:', newProduct);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: "Failed to create product", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      console.log('Updating product with data:', productData);

      // Parse tags if they exist (comma-separated string to array)
      const tags = productData.tags ? productData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];

      // Category mapping for proper slug creation
      const categoryMappings: { [key: string]: { name: string; slug: string } } = {
        'cat-food': { name: 'Cat Food', slug: 'cat-food' },
        'dog-food': { name: 'Dog Food', slug: 'dog-food' },
        'cat-toys': { name: 'Cat Toys', slug: 'cat-toys' },
        'cat-litter': { name: 'Cat Litter', slug: 'cat-litter' },
        'cat-care': { name: 'Cat Care & Health', slug: 'cat-care' },
        'clothing-beds-carrier': { name: 'Clothing, Beds & Carrier', slug: 'clothing-beds-carrier' },
        'cat-accessories': { name: 'Cat Accessories', slug: 'cat-accessories' },
        'dog-accessories': { name: 'Dog Health & Accessories', slug: 'dog-accessories' },
        'rabbit': { name: 'Rabbit Food & Accessories', slug: 'rabbit' },
        'bird': { name: 'Bird Food & Accessories', slug: 'bird' }
      };

      // Brand mapping for proper slug creation
      const brandMappings: { [key: string]: { name: string; slug: string } } = {
        'default-brand': { name: 'Default Brand', slug: 'default-brand' },
        'nekko': { name: 'Nekko', slug: 'nekko' },
        'purina': { name: 'Purina', slug: 'purina' },
        'purina-one': { name: 'Purina One', slug: 'one' },
        'one': { name: 'Purina One', slug: 'one' },
        'reflex': { name: 'Reflex', slug: 'reflex' },
        'reflex-plus': { name: 'Reflex Plus', slug: 'reflex-plus' },
        'royal-canin': { name: 'Royal Canin', slug: 'royal-canin' },
        'sheba': { name: 'Sheba', slug: 'sheba' }
      };

      // Find category and brand by their IDs/names/slugs
      let categoryRecord = null;

      // First try to find existing category
      if (productData.categoryId) {
        // Check if it's a valid ObjectId first
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.categoryId);

        if (isValidObjectId) {
          categoryRecord = await Category.findById(productData.categoryId);
        } else {
          // Look up by slug or name
          categoryRecord = await Category.findOne({
            $or: [
              { slug: productData.categoryId },
              { name: productData.categoryId }
            ]
          });
        }
      }

      if (!categoryRecord) {
        // Create category if it doesn't exist using proper mapping
        const categoryMapping = categoryMappings[productData.categoryId];
        categoryRecord = new Category({
          name: categoryMapping ? categoryMapping.name : productData.categoryId,
          slug: categoryMapping ? categoryMapping.slug : productData.categoryId.toLowerCase().replace(/\s+/g, '-'),
        });
        await categoryRecord.save();
        console.log(`Created new category: ${categoryRecord.name} with slug: ${categoryRecord.slug}`);
      }

      let brandRecord = null;

      // First try to find existing brand
      if (productData.brandId) {
        // Check if it's a valid ObjectId first
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productData.brandId);

        if (isValidObjectId) {
          brandRecord = await Brand.findById(productData.brandId);
        } else {
          // Look up by slug or name
          brandRecord = await Brand.findOne({
            $or: [
              { slug: productData.brandId },
              { name: productData.brandId }
            ]
          });
        }
      }

      if (!brandRecord) {
        // Create brand if it doesn't exist using proper mapping
        const brandMapping = brandMappings[productData.brandId];
        brandRecord = new Brand({
          name: brandMapping ? brandMapping.name : productData.brandId,
          slug: brandMapping ? brandMapping.slug : productData.brandId.toLowerCase().replace(/\s+/g, '-'),
        });
        await brandRecord.save();
        console.log(`Created new brand: ${brandRecord.name} with slug: ${brandRecord.slug}`);
      }

      // Update product directly in database with all fields
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          originalPrice: productData.originalPrice || undefined,
          categoryId: categoryRecord._id,
          brandId: brandRecord._id,
          image: productData.image,
          stockQuantity: parseInt(productData.stockQuantity) || 0,
          tags: tags,
          isNew: productData.isNew || false,
          isBestseller: productData.isBestseller || false,
          isOnSale: productData.isOnSale || false,
          isActive: productData.isActive !== false,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      console.log('Updated product:', updatedProduct);
      res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Initialize repack food products
  app.post("/api/init-repack-products", async (req, res) => {
    try {
      // Check if repack products already exist
      const existingRepackProducts = await Product.find({
        tags: { $in: ['repack-food'] }
      });

      if (existingRepackProducts.length > 0) {
        return res.json({ message: "Repack products already exist", count: existingRepackProducts.length });
      }

      // Find or create "Repack Food" category
      let repackCategory = await Category.findOne({ name: "Repack Food" });
      if (!repackCategory) {
        repackCategory = new Category({
          name: "Repack Food",
          slug: "repack-food",
        });
        await repackCategory.save();
      }

      // Find or create "Meow Meow" brand
      let meowMeowBrand = await Brand.findOne({ name: "Meow Meow" });
      if (!meowMeowBrand) {
        meowMeowBrand = new Brand({
          name: "Meow Meow",
          slug: "meow-meow",
        });
        await meowMeowBrand.save();
      }

      // Create the 3 repack food products
      const repackProducts = [
        {
          name: 'Bulk Cat Food Repack (20kg)',
          description: 'Premium quality, repackaged for savings',
          price: 6400,
          originalPrice: 8000,
          categoryId: repackCategory._id,
          brandId: meowMeowBrand._id,
          image: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          stockQuantity: 15,
          tags: ['repack-food', 'bulk-save', 'cat-food'],
          isNew: false,
          isBestseller: true,
          isOnSale: true,
          isActive: true,
          rating: 4.5,
        },
        {
          name: 'Bulk Dog Food Repack (25kg)',
          description: 'Economical choice for multiple dogs',
          price: 7200,
          originalPrice: 9600,
          categoryId: repackCategory._id,
          brandId: meowMeowBrand._id,
          image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          stockQuantity: 12,
          tags: ['repack-food', 'combo-deal', 'dog-food'],
          isNew: false,
          isBestseller: true,
          isOnSale: true,
          isActive: true,
          rating: 4.5,
        },
        {
          name: 'Mixed Pet Treats (5kg)',
          description: 'Assorted treats for cats and dogs',
          price: 2800,
          originalPrice: 3500,
          categoryId: repackCategory._id,
          brandId: meowMeowBrand._id,
          image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          stockQuantity: 25,
          tags: ['repack-food', 'bulk-save', 'treats'],
          isNew: false,
          isBestseller: false,
          isOnSale: true,
          isActive: true,
          rating: 4.5,
        }
      ];

      const createdProducts = await Product.insertMany(repackProducts);
      console.log('Created repack products:', createdProducts.length);

      res.status(201).json({
        message: "Repack products initialized successfully",
        count: createdProducts.length,
        products: createdProducts
      });
    } catch (error) {
      console.error('Init repack products error:', error);
      res.status(500).json({ message: "Failed to initialize repack products" });
    }
  });

  // Get repack food products specifically (for public display)
  app.get("/api/repack-products", async (req, res) => {
    try {
      // Set cache headers for better performance
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache

      const repackProducts = await Product.find({
        $or: [
          { tags: { $in: ['repack-food', 'repack'] } },
          { name: { $regex: /repack/i } },
          { description: { $regex: /repack/i } }
        ],
        isActive: true
      }).select('name price originalPrice image rating stockQuantity tags description isNew isBestseller isOnSale discount').lean();

      console.log(`Successfully fetched ${repackProducts.length} repack products`);
      res.json(repackProducts);
    } catch (error) {
      console.error('Get repack products error:', error);
      res.status(500).json({ message: "Failed to fetch repack products" });
    }
  });

  // Get repack food products for admin management (includes all fields and inactive products)
  app.get("/api/admin/repack-products", async (req, res) => {
    try {
      const repackProducts = await Product.find({
        $or: [
          { tags: { $in: ['repack-food', 'repack', 'bulk-save', 'bulk'] } },
          { name: { $regex: /repack/i } },
          { description: { $regex: /repack/i } }
        ]
        // Note: Don't filter by isActive for admin - they need to see all products
      });

      // Resolve category and brand information for admin display
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
            category: category?.slug || 'uncategorized',
            categoryName: category?.name || 'Uncategorized',
            brandId: product.brandId,
            brandName: brand?.name || 'No Brand',
            brandSlug: brand?.slug || 'no-brand',
            image: product.image,
            images: product.images || [],
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            stock: product.stockQuantity || 0,
            stockStatus: product.stockStatus || 'In Stock',
            tags: product.tags || [],
            features: product.features || [],
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            isOnSale: product.isOnSale || false,
            discount: product.discount || 0,
            description: product.description || '',
            specifications: product.specifications || {},
            isActive: product.isActive
          });
        } catch (err) {
          console.warn('Error processing repack product:', product.name || 'Unknown', err.message);
        }
      }

      console.log(`Successfully fetched ${productsWithDetails.length} repack products for admin`);
      res.json(productsWithDetails);
    } catch (error) {
      console.error('Get admin repack products error:', error);
      res.status(500).json({ message: "Failed to fetch repack products for admin" });
    }
  });

  // Middleware to check admin access
  const requireAdmin = async (req: any, res: any, next: any) => {
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

  // Authentication Routes
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
    path: ["confirmPassword"],
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors
        });
      }

      const { confirmPassword, ...userData } = result.data;

      // Check if user already exists
      const existingUser = userData.email ? await storage.getUserByEmail(userData.email) : null;
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Check if username is taken
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username is already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Remove password from response
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

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors
        });
      }

      const { email, password } = result.data;

      // Find user by email or username (for admin account)
      let user = await storage.getUserByEmail(email);

      // If not found by email, try username (for admin login)
      if (!user) {
        user = await User.findOne({ username: email }) || undefined;
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Remove password from response
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

  // Get user profile
  app.get("/api/auth/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user profile
  app.patch("/api/auth/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Don't allow password updates through this endpoint
      delete updateData.password;
      delete updateData.id;

      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
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

  // Admin Routes
  app.post("/api/admin/stats", async (req, res) => {
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

  app.post("/api/admin/users", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);

      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const allUsers = await User.find().select('-password');
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:userId", async (req, res) => {
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

      // Prevent deleting admin account
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

  // Image placeholder API
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const imageUrl = `https://via.placeholder.com/${width}x${height}/26732d/ffffff?text=Pet+Shop`;
    res.redirect(imageUrl);
  });

  // Announcements API
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await Announcement.find({ isActive: true })
        .sort({ priority: -1, createdAt: -1 })
        .limit(1);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });


  app.post("/api/announcements", async (req, res) => {
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

  app.put("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { text, isActive } = req.body;

      const announcement = await Announcement.findByIdAndUpdate(
        id,
        { text, isActive, updatedAt: new Date() },
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

  app.delete("/api/announcements/:id", async (req, res) => {
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

  // Cart API endpoints
  app.get("/api/cart/:userId", async (req, res) => {
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

  app.post("/api/cart/add", async (req, res) => {
    try {
      const { userId, productId, name, price, image, quantity = 1 } = req.body;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
      }

      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, image, quantity });
      }

      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await cart.save();

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/update", async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      if (quantity <= 0) {
        cart.items = cart.items.filter(item => item.productId !== productId);
      } else {
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
        }
      }

      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await cart.save();

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/clear/:userId", async (req, res) => {
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

  // Order API endpoints
  app.post("/api/orders", async (req, res) => {
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

      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create order
      const order = new Order({
        userId,
        status: 'Processing',
        total,
        items,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid'
      });

      await order.save();

      // Create invoice
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

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { userId },
        { items: [], total: 0 }
      );

      res.json({ order, invoice });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
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

  // Contact form submission endpoint (EmailJS handles email sending)
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, phone, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !phone || !subject || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Log the contact submission for record keeping
      console.log('Contact form submission:', {
        name,
        phone,
        email: email || 'Not provided',
        subject,
        timestamp: new Date().toISOString()
      });

      res.json({
        message: "Message sent successfully! We'll get back to you within 24 hours.",
        success: true
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        message: "Failed to send message. Please try again later.",
        success: false
      });
    }
  });

  // Invoice API endpoints
  app.get("/api/invoices/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:invoiceId", async (req, res) => {
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

  app.get("/api/invoices/download/:invoiceId", async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const invoice = await Invoice.findById(invoiceId);

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Generate invoice HTML for download
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
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>৳ ${item.price}</td>
                  <td>৳ ${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-line">Subtotal: ৳ ${invoice.subtotal}</div>
            <div class="total-line final-total">Total: ৳ ${invoice.total}</div>
            <div class="total-line">Payment Method: ${invoice.paymentMethod}</div>
            <div class="total-line">Payment Status: ${invoice.paymentStatus}</div>
          </div>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.html"`);
      res.send(invoiceHtml);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  });

  // Blog API endpoints
  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get published blog posts only
  app.get("/api/blog/published", async (req, res) => {
    try {
      const { category } = req.query;
      const allPosts = await storage.getBlogPosts();
      let publishedPosts = allPosts.filter(post => post.isPublished);

      // Filter by category if provided
      if (category && category !== 'All') {
        publishedPosts = publishedPosts.filter(post =>
          post.category && post.category === category
        );
      }

      res.json(publishedPosts);
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      res.status(500).json({ message: "Failed to fetch published blog posts" });
    }
  });

  // Get single blog post by ID
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const blogPost = await storage.getBlogPost(id);

      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(blogPost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get blog post by slug
  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blogPost = await storage.getBlogPostBySlug(slug);

      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(blogPost);
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Create new blog post
  app.post("/api/blog", async (req, res) => {
    try {
      const blogPostSchema = z.object({
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

      const validatedData = blogPostSchema.parse(req.body);

      // Convert publishedAt string to Date if provided
      const blogPostData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined
      };

      const newBlogPost = await storage.createBlogPost(blogPostData);
      res.status(201).json(newBlogPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Update blog post
  app.put("/api/blog/:id", async (req, res) => {
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

      // Convert publishedAt string to Date if provided
      const updateData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined
      };

      const updatedBlogPost = await storage.updateBlogPost(id, updateData);

      if (!updatedBlogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(updatedBlogPost);
    } catch (error) {
      console.error('Error updating blog post:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Delete blog post
  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(id);

      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Coupon API routes
  app.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await Coupon.find({}).sort({ createdAt: -1 });
      res.json(coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  app.get("/api/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id);

      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json(coupon);
    } catch (error) {
      console.error('Error fetching coupon:', error);
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });

  app.post("/api/coupons", async (req, res) => {
    try {
      const couponSchema = z.object({
        code: z.string().min(1).toUpperCase(),
        description: z.string().optional(),
        discountType: z.enum(['percentage', 'fixed']),
        discountValue: z.number().min(0.01),
        minOrderAmount: z.number().min(0).optional(),
        maxDiscountAmount: z.number().min(0).optional(),
        usageLimit: z.number().min(1).optional(),
        validFrom: z.string().datetime(),
        validUntil: z.string().datetime(),
        isActive: z.boolean().optional()
      });

      const validatedData = couponSchema.parse(req.body);

      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ code: validatedData.code });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }

      // Validate dates
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
      console.error('Error creating coupon:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });

  app.put("/api/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const updateSchema = z.object({
        code: z.string().min(1).toUpperCase().optional(),
        description: z.string().optional(),
        discountType: z.enum(['percentage', 'fixed']).optional(),
        discountValue: z.number().min(0.01).optional(),
        minOrderAmount: z.number().min(0).optional(),
        maxDiscountAmount: z.number().min(0).optional(),
        usageLimit: z.number().min(1).optional(),
        validFrom: z.string().datetime().optional(),
        validUntil: z.string().datetime().optional(),
        isActive: z.boolean().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      // If updating code, check for duplicates
      if (validatedData.code) {
        const existingCoupon = await Coupon.findOne({ 
          code: validatedData.code, 
          _id: { $ne: id } 
        });
        if (existingCoupon) {
          return res.status(400).json({ message: "Coupon code already exists" });
        }
      }

      // Validate dates if both are provided
      if (validatedData.validFrom && validatedData.validUntil) {
        const validFrom = new Date(validatedData.validFrom);
        const validUntil = new Date(validatedData.validUntil);

        if (validUntil <= validFrom) {
          return res.status(400).json({ message: "Valid until date must be after valid from date" });
        }
      }

      // Convert date strings to Date objects if provided
      const updateData: any = { ...validatedData };
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
      console.error('Error updating coupon:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update coupon" });
    }
  });

  app.delete("/api/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCoupon = await Coupon.findByIdAndDelete(id);

      if (!deletedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });

  // Validate coupon endpoint (for frontend use)
  app.post("/api/coupons/validate", async (req, res) => {
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

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return res.status(400).json({ message: "Coupon has expired or is not yet valid" });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }

      if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        return res.status(400).json({ 
          message: `Minimum order amount of ৳${coupon.minOrderAmount} required` 
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
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
      console.error('Error validating coupon:', error);
      res.status(500).json({ message: "Failed to validate coupon" });
    }
  });

  const server = createServer(app);
  return server;
}