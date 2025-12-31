import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  firstName: varchar('firstName', { length: 255 }),
  lastName: varchar('lastName', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: json('address'),
  profilePicture: varchar('profilePicture', { length: 500 }),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  parentId: integer('parentId'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logo: varchar('logo', { length: 500 }),
  description: text('description'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('originalPrice', { precision: 10, scale: 2 }),
  categoryId: integer('categoryId').notNull(),
  brandId: integer('brandId').notNull(),
  image: varchar('image', { length: 500 }).notNull(),
  images: json('images'),
  rating: decimal('rating', { precision: 2, scale: 1 }).notNull().default('0'),
  reviews: integer('reviews').notNull().default(0),
  stockStatus: varchar('stockStatus', { length: 50 }).notNull().default('in_stock'),
  stockQuantity: integer('stockQuantity').notNull().default(0),
  subcategory: varchar('subcategory', { length: 255 }).notNull().default(''), // Added subcategory field
  tags: json('tags'),
  features: json('features'),
  specifications: json('specifications'),
  isNew: boolean('isNew').notNull().default(false),
  isBestseller: boolean('isBestseller').notNull().default(false),
  isOnSale: boolean('isOnSale').notNull().default(false),
  discount: decimal('discount', { precision: 5, scale: 2 }).notNull().default('0'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: varchar('userId', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('paymentMethod', { length: 50 }).notNull(),
  shippingAddress: json('shippingAddress'),
  orderNotes: text('orderNotes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const orderItems = pgTable('orderItems', {
  id: serial('id').primaryKey(),
  orderId: integer('orderId').notNull(),
  productId: varchar('productId', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  orderId: integer('orderId').notNull(),
  invoiceNumber: varchar('invoiceNumber', { length: 100 }).notNull().unique(),
  customerInfo: json('customerInfo'),
  items: json('items'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('paymentMethod', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const blogPosts = pgTable('blogPosts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  image: varchar('image', { length: 500 }),
  readTime: integer('readTime').notNull().default(5),
  tags: json('tags').notNull().default('[]'),
  featured: boolean('featured').notNull().default(false),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  publishedAt: timestamp('publishedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;