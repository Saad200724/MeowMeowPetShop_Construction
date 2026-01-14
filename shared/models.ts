import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  username: string;
  password: string;
  email?: string;
  firebaseUid?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: any;
  profilePicture?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  firebaseUid: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  phone: String,
  address: Schema.Types.Mixed,
  profilePicture: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Category Schema
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parentId: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Brand Schema
export interface IBrand extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: String,
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Product Schema
export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  brandId: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stockStatus: string;
  stockQuantity: number;
  subcategory?: string;
  tags?: string[];
  features?: string[];
  specifications?: any;
  isNew: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  discount: number;
  availableWeights?: string[];
  availableColors?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
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
  stockStatus: { type: String, default: 'In Stock' },
  stockQuantity: { type: Number, default: 0 },
  subcategory: { type: String, default: '' },
  tags: [String],
  features: [String],
  specifications: Schema.Types.Mixed,
  isNew: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  availableWeights: [String],
  availableColors: [String],
  isActive: { type: Boolean, default: true },
} as any, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

// Blog Post Schema
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  publishedAt?: Date;
  category?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  image: String,
  author: { type: String, required: true },
  publishedAt: Date,
  category: String,
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

// Order Schema
export interface IOrder extends Document {
  userId: string;
  orderNumber: string; // Unique order number used as invoice number
  status: string;
  total: number;
  items: any[];
  shippingAddress?: any;
  customerInfo?: any;
  invoiceId?: string;
  invoiceNumber?: string; // Same as orderNumber
  paymentMethod?: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true }, // Unique order number
  status: { type: String, default: 'Processing' },
  total: { type: Number, required: true },
  items: [{ type: Schema.Types.Mixed }],
  shippingAddress: Schema.Types.Mixed,
  customerInfo: Schema.Types.Mixed,
  invoiceId: String,
  invoiceNumber: { type: String }, // Will be same as orderNumber
  paymentMethod: String,
  paymentStatus: { type: String, default: 'Pending' },
}, { timestamps: true });

// Announcement Schema
export interface IAnnouncement extends Document {
  text: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Cart Item Schema
export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Cart Schema
export interface ICart extends Document {
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
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

// Invoice Schema
export interface IInvoice extends Document {
  invoiceNumber: string;
  orderId: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: any;
  };
  items: ICartItem[];
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  discountCode?: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>({
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
  paymentStatus: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Coupon Schema
export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed', 'free_delivery'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, min: 0 },
  maxDiscountAmount: { type: Number, min: 0 },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Payment Transaction Schema (for RupantorPay integration)
export interface IPaymentTransaction extends Document {
  orderId: string;
  transactionId?: string; // RupantorPay transaction ID
  paymentUrl?: string; // Generated payment URL from RupantorPay
  amount: number;
  currency: string;
  customerInfo: {
    fullname: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: string; // Received from RupantorPay callback
  paymentFee?: number; // Transaction fee
  metadata?: any; // Additional data
  successUrl: string;
  cancelUrl: string;
  webhookUrl?: string;
  verifiedAt?: Date;
  callbackData?: any; // Data received from RupantorPay callback
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<IPaymentTransaction>({
  orderId: { type: String, required: true, unique: true },
  transactionId: { type: String, sparse: true },
  paymentUrl: String,
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'BDT' },
  customerInfo: {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: String,
  paymentFee: { type: Number, min: 0 },
  metadata: Schema.Types.Mixed,
  successUrl: { type: String, required: true },
  cancelUrl: { type: String, required: true },
  webhookUrl: String,
  verifiedAt: Date,
  callbackData: Schema.Types.Mixed,
}, { timestamps: true });

// Payment Webhook Log Schema (for debugging and audit)
export interface IPaymentWebhook extends Document {
  transactionId: string;
  paymentStatus: string;
  rawData: any; // Complete webhook payload
  processed: boolean;
  errorMessage?: string;
  createdAt: Date;
}

const paymentWebhookSchema = new Schema<IPaymentWebhook>({
  transactionId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  rawData: { type: Schema.Types.Mixed, required: true },
  processed: { type: Boolean, default: false },
  errorMessage: String,
}, { timestamps: true });

// Banner Schema (Home Screen Banners)
export interface IBanner extends Document {
  imageUrl: string;
  title?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>({
  imageUrl: { type: String, required: true },
  title: String,
  order: { type: Number, default: 1, min: 1, max: 3 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Popup Poster Schema
export interface IPopupPoster extends Document {
  imageUrl: string;
  title?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const popupPosterSchema = new Schema<IPopupPoster>({
  imageUrl: { type: String, required: true },
  title: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// OTP Schema
export interface IOTP extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

// Create TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Review Schema
export interface IReview extends Document {
  productId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  productId: { type: String, required: true, index: true },
  userId: { type: String },
  userName: { type: String, required: true },
  userEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

// Export Models
export const User = mongoose.model<IUser>('User', userSchema);
export const Category = mongoose.model<ICategory>('Category', categorySchema);
export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
export const Product = mongoose.model<IProduct>('Product', productSchema);
export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
export const Order = mongoose.model<IOrder>('Order', orderSchema);
export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);
export const Cart = mongoose.model<ICart>('Cart', cartSchema);
export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
export const PaymentTransaction = mongoose.model<IPaymentTransaction>('PaymentTransaction', paymentTransactionSchema);
export const PaymentWebhook = mongoose.model<IPaymentWebhook>('PaymentWebhook', paymentWebhookSchema);
export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
export const PopupPoster = mongoose.model<IPopupPoster>('PopupPoster', popupPosterSchema);
export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
export const Review = mongoose.model<IReview>('Review', reviewSchema);

// Export types for compatibility with existing code
export type UserType = IUser;
export type CategoryType = ICategory;
export type BrandType = IBrand;
export type ProductType = IProduct;
export type BlogPostType = IBlogPost;
export type OrderType = IOrder;
export type AnnouncementType = IAnnouncement;
export type CartType = ICart;
export type CartItemType = ICartItem;
export type InvoiceType = IInvoice;
export type CouponType = ICoupon;
export type PaymentTransactionType = IPaymentTransaction;
export type PaymentWebhookType = IPaymentWebhook;
export type BannerType = IBanner;
export type PopupPosterType = IPopupPoster;
export type OTPType = IOTP;
export type ReviewType = IReview;