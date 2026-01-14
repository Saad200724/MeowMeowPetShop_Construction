import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from '@/components/ui/image-upload';
import { MultipleImageUpload } from '@/components/ui/multiple-image-upload';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Package, FileEdit, Plus, Trash2, ArrowLeft, Search, 
  Filter, Grid, List, Eye, Edit, Save, X, 
  Home, PawPrint, BookOpen, Speaker, Grid3X3, Coffee, Tag, ShoppingCart, Image as ImageIcon, Building2
} from "lucide-react";

// Form validation schemas
const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  image: z.string().min(1, 'Image is required'),
  images: z.array(z.string()).optional(),
  stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
  subcategory: z.string().optional(),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isActive: z.boolean().optional(),
  availableWeights: z.array(z.string()).optional(),
  availableColors: z.array(z.string()).optional(),
});

// Simplified schema for repack food products
const repackFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  image: z.string().min(1, 'Product image is required'),
  stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
});

const announcementFormSchema = z.object({
  text: z.string().min(1, 'Announcement text is required'),
  isActive: z.boolean().optional(),
});

const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  image: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  isPublished: z.boolean().optional(),
});

const couponFormSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed', 'free_delivery'], { message: 'Discount type is required' }),
  discountValue: z.number().min(0, 'Discount value must be non-negative').optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  validFrom: z.date({ message: 'Valid from date is required' }),
  validUntil: z.date({ message: 'Valid until date is required' }),
  isActive: z.boolean().optional(),
}).refine((data) => {
  // For percentage and fixed discount types, require a discount value
  if (data.discountType !== 'free_delivery' && (!data.discountValue || data.discountValue < 0.01)) {
    return false;
  }
  return true;
}, {
  message: 'Discount value must be greater than 0 for percentage and fixed discounts',
  path: ['discountValue'],
});

const bannerFormSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
  title: z.string().optional(),
  order: z.number().min(0).optional(),
});

const popupPosterFormSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
  title: z.string().optional(),
});

const brandFormSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logo: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type BrandFormData = z.infer<typeof brandFormSchema>;
type RepackFormData = z.infer<typeof repackFormSchema>;
type AnnouncementFormData = z.infer<typeof announcementFormSchema>;
type BlogFormData = z.infer<typeof blogFormSchema>;
type CouponFormData = z.infer<typeof couponFormSchema>;
type BannerFormData = z.infer<typeof bannerFormSchema>;
type PopupPosterFormData = z.infer<typeof popupPosterFormSchema>;

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  publishedAt?: Date;
  tags?: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Coupon {
  _id: string;
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

interface Banner {
  _id: string;
  imageUrl: string;
  title?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PopupPoster {
  _id: string;
  imageUrl: string;
  title?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BrandItem {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();

  // All state hooks declared at the top level (not conditionally)
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [showPOSDialog, setShowPOSDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [repackSearchTerm, setRepackSearchTerm] = useState('');
  const [editingRepackProduct, setEditingRepackProduct] = useState<any>(null);
  const [showRepackDialog, setShowRepackDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [couponSearchTerm, setCouponSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [showBannerDialog, setShowBannerDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerImageSource, setBannerImageSource] = useState<'url' | 'upload'>('url');
  const [showPopupDialog, setShowPopupDialog] = useState(false);
  const [editingPopupPoster, setEditingPopupPoster] = useState<PopupPoster | null>(null);
  const [popupImageSource, setPopupImageSource] = useState<'url' | 'upload'>('url');
  const [showBrandDialog, setShowBrandDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [brandLogoSource, setBrandLogoSource] = useState<'url' | 'upload'>('url');
  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [invoiceDeliveryFee, setInvoiceDeliveryFee] = useState(0);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceCustomerName, setInvoiceCustomerName] = useState('');
  const [invoiceCustomerPhone, setInvoiceCustomerPhone] = useState('');
  const [invoiceCustomerEmail, setInvoiceCustomerEmail] = useState('');
  const [invoiceCustomerAddress, setInvoiceCustomerAddress] = useState<any>({});
  const [invoicePaymentMethod, setInvoicePaymentMethod] = useState('');

  const [newWeight, setNewWeight] = useState('');
  const [newColor, setNewColor] = useState('');

  // All queries declared at the top level (not conditionally)
  useEffect(() => {
    // If loading is done and user is not admin, redirect to login
    if (!loading && (!user || user.role !== 'admin')) {
      setLocation('/admin-login');
    } else if (!loading && user && user.role === 'admin') {
      // User is authenticated and is admin
      setIsSessionChecked(true);
    }
  }, [user, loading, setLocation]);

  // All queries declared at the top level (not conditionally)
  const { data: products = [], isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['/api/admin/products'],
    enabled: !!user && user.role === 'admin', // Only run if user is admin
  });

  const { data: repackProducts = [], isLoading: isLoadingRepackProducts, refetch: refetchRepackProducts } = useQuery({
    queryKey: ['/api/admin/repack-products'],
    enabled: !!user && user.role === 'admin',
  }) as { data: any[], isLoading: boolean, refetch: any };

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['/api/brands'],
    enabled: !!user && user.role === 'admin',
  }) as { data: BrandItem[] };

  const { data: announcements = [], refetch: refetchAnnouncements } = useQuery({
    queryKey: ['/api/admin/announcements'],
    enabled: !!user && user.role === 'admin',
  }) as { data: any[], refetch: any };

  const { data: blogPosts = [], refetch: refetchBlogs } = useQuery({
    queryKey: ['/api/blog'],
    enabled: !!user && user.role === 'admin',
  }) as { data: BlogPost[], refetch: any };

  const { data: coupons = [], refetch: refetchCoupons } = useQuery({
    queryKey: ['/api/coupons'],
    enabled: !!user && user.role === 'admin',
  }) as { data: Coupon[], refetch: any };

  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user && user.role === 'admin',
  }) as { data: any[], refetch: any };

  const { data: banners = [], refetch: refetchBanners } = useQuery({
    queryKey: ['/api/banners'],
    enabled: !!user && user.role === 'admin',
  }) as { data: Banner[], refetch: any };

  const { data: popupPosters = [], refetch: refetchPopupPosters } = useQuery({
    queryKey: ['/api/popup-posters'],
    enabled: !!user && user.role === 'admin',
  }) as { data: PopupPoster[], refetch: any };

  // All forms declared at the top level
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      brandId: '',
      image: '',
      images: [],
      stockQuantity: 0,
      subcategory: 'none',
      isNew: false,
      isBestseller: false,
      isOnSale: false,
      isActive: true,
    },
  });

  const repackForm = useForm<RepackFormData>({
    resolver: zodResolver(repackFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      brandId: '',
      image: '',
      stockQuantity: 0,
    },
  });

  const announcementForm = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      text: '',
      isActive: true,
    },
  });

  const couponForm = useForm<CouponFormData>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: undefined,
      maxDiscountAmount: undefined,
      usageLimit: undefined,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
  });

  const bannerForm = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      imageUrl: '',
      title: '',
      order: 1,
    },
  });

  const popupPosterForm = useForm<PopupPosterFormData>({
    resolver: zodResolver(popupPosterFormSchema),
    defaultValues: {
      imageUrl: '',
      title: '',
    },
  });

  const brandForm = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: '',
      logo: '',
      description: '',
      isActive: true,
    },
  });

  // All mutations declared at the top level
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/repack-products'] });
      setShowProductDialog(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      return await apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/repack-products'] });
      setEditingProduct(null);
      setShowProductDialog(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/products/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/repack-products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });

  // Brand mutations
  const createBrandMutation = useMutation({
    mutationFn: async (data: BrandFormData) => {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create brand');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      brandForm.reset();
      setShowBrandDialog(false);
      toast({
        title: 'Success',
        description: 'Brand created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create brand',
        variant: 'destructive',
      });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BrandFormData }) => {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update brand');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      brandForm.reset();
      setEditingBrand(null);
      setShowBrandDialog(false);
      toast({
        title: 'Success',
        description: 'Brand updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update brand',
        variant: 'destructive',
      });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete brand');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      toast({
        title: 'Success',
        description: 'Brand deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete brand',
        variant: 'destructive',
      });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/announcements'] });
      announcementForm.reset();
      setShowAnnouncementDialog(false);
      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create announcement',
        variant: 'destructive',
      });
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AnnouncementFormData }) => {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/announcements'] });
      announcementForm.reset();
      setEditingAnnouncement(null);
      setShowAnnouncementDialog(false);
      toast({
        title: 'Success',
        description: 'Announcement updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update announcement',
        variant: 'destructive',
      });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/announcements'] });
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete announcement',
        variant: 'destructive',
      });
    },
  });

  const createRepackMutation = useMutation({
    mutationFn: async (data: RepackFormData) => {
      // Add repack-food tag automatically
      const repackData = {
        ...data,
        tags: 'repack-food',
        isActive: true,
      };
      return await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(repackData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/repack-products'] });
      setShowRepackDialog(false);
      repackForm.reset();
      toast({
        title: 'Success',
        description: 'Repack food product created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create repack food product',
        variant: 'destructive',
      });
    },
  });

  const updateRepackMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RepackFormData }) => {
      // Ensure repack-food tag is maintained
      const repackData = {
        ...data,
        tags: 'repack-food',
      };
      return await apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(repackData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/repack-products'] });
      setEditingRepackProduct(null);
      setShowRepackDialog(false);
      repackForm.reset();
      toast({
        title: 'Success',
        description: 'Repack food product updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update repack food product',
        variant: 'destructive',
      });
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const blogData = {
        ...data,
        slug,
        tags: data.category ? [data.category] : [],
        isPublished: data.isPublished || false
      };
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) throw new Error('Failed to create blog post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setShowBlogDialog(false);
      setEditingBlog(null);
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create blog post',
        variant: 'destructive',
      });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogFormData }) => {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const blogData = {
        ...data,
        slug,
        tags: data.category ? [data.category] : [],
      };
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) throw new Error('Failed to update blog post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setShowBlogDialog(false);
      setEditingBlog(null);
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update blog post',
        variant: 'destructive',
      });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete blog post',
        variant: 'destructive',
      });
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create coupon');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coupons'] });
      setShowCouponDialog(false);
      couponForm.reset();
      toast({
        title: 'Success',
        description: 'Coupon created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create coupon',
        variant: 'destructive',
      });
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CouponFormData }) => {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update coupon');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coupons'] });
      setShowCouponDialog(false);
      setEditingCoupon(null);
      couponForm.reset();
      toast({
        title: 'Success',
        description: 'Coupon updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update coupon',
        variant: 'destructive',
      });
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete coupon');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coupons'] });
      toast({
        title: 'Success',
        description: 'Coupon deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete coupon',
        variant: 'destructive',
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete order',
        variant: 'destructive',
      });
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ invoiceId, data }: { invoiceId: string; data: any }) => {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update invoice');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setShowInvoiceEditor(false);
      setEditingInvoice(null);
      toast({
        title: 'Success',
        description: 'Invoice updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update invoice',
        variant: 'destructive',
      });
    },
  });

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking authentication</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Meow Meow" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please sign in with admin credentials</p>
            <Link href="/admin-login">
              <Button className="bg-red-600 hover:bg-red-700">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Function to parse announcement text for bold formatting
  const parseAnnouncementText = (text: string) => {
    if (!text) return text;

    // Replace **text** with bold
    let parsed = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with bold
    parsed = parsed.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    return parsed;
  };

  const filteredProducts = (products as any[]).filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Check both category and categoryId fields, handle different formats
    const productCategory = product.category || product.categoryId || '';
    const matchesCategory = selectedCategory === 'all' || 
      productCategory === selectedCategory ||
      productCategory.toLowerCase() === selectedCategory.toLowerCase() ||
      productCategory.replace(/\s+/g, '-').toLowerCase() === selectedCategory.toLowerCase();

    const stockQuantity = product.stockQuantity || product.stock || 0;
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'out-of-stock' && stockQuantity === 0) ||
      (stockFilter === 'low-stock' && stockQuantity > 0 && stockQuantity < 10) ||
      (stockFilter === 'high-stock' && stockQuantity >= 10);

    const isActive = product.isActive !== false;
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'active' && isActive) ||
      (activeFilter === 'inactive' && !isActive);

    return matchesSearch && matchesCategory && matchesStock && matchesActive;
  });

  const handleCreateProduct = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (editingProduct) {
      console.log('Updating product with form data:', data);
      console.log('Editing product ID:', editingProduct.id);
      updateProductMutation.mutate({ id: editingProduct.id, data });
    }
  };

  const handleCreateAnnouncement = (data: AnnouncementFormData) => {
    createAnnouncementMutation.mutate(data);
  };

  const handleUpdateAnnouncement = (data: AnnouncementFormData) => {
    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({ id: editingAnnouncement._id, data });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      categoryId: product.category || product.categoryId || '',
      brandId: product.brandId || '',
      image: product.image,
      images: product.images || [],
      stockQuantity: product.stock || product.stockQuantity || 0,
      subcategory: product.subcategory || 'none',
      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
      isOnSale: product.isOnSale || false,
      isActive: product.isActive !== false,
      availableWeights: product.availableWeights || [],
      availableColors: product.availableColors || [],
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // Repack food handlers
  const handleCreateRepack = (data: RepackFormData) => {
    createRepackMutation.mutate(data);
  };

  const handleUpdateRepack = (data: RepackFormData) => {
    if (editingRepackProduct) {
      updateRepackMutation.mutate({ id: editingRepackProduct.id, data });
    }
  };

  const handleEditRepack = (product: any) => {
    setEditingRepackProduct(product);
    repackForm.reset({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      categoryId: product.category || product.categoryId || '',
      brandId: product.brandId || '',
      image: product.image,
      stockQuantity: product.stock || product.stockQuantity || 0,
    });
    setShowRepackDialog(true);
  };

  const handleCreateBlog = (data: BlogFormData) => {
    createBlogMutation.mutate(data);
  };

  const handleUpdateBlog = (data: BlogFormData) => {
    if (editingBlog && editingBlog._id !== 'new') {
      updateBlogMutation.mutate({ id: editingBlog._id, data });
    }
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  // Coupon handlers
  const handleCreateCoupon = (data: CouponFormData) => {
    // Ensure discountValue is 0 for free_delivery coupons
    const couponData = {
      ...data,
      discountValue: data.discountType === 'free_delivery' ? 0 : data.discountValue
    };
    createCouponMutation.mutate(couponData);
  };

  const handleUpdateCoupon = (data: CouponFormData) => {
    if (editingCoupon) {
      // Ensure discountValue is 0 for free_delivery coupons
      const couponData = {
        ...data,
        discountValue: data.discountType === 'free_delivery' ? 0 : data.discountValue
      };
      updateCouponMutation.mutate({ id: editingCoupon._id, data: couponData });
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    couponForm.reset({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      usageLimit: coupon.usageLimit,
      validFrom: new Date(coupon.validFrom),
      validUntil: new Date(coupon.validUntil),
      isActive: coupon.isActive,
    });
    setShowCouponDialog(true);
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponMutation.mutate(id);
    }
  };



  // Order handlers
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handleEditInvoice = async (order: any) => {
    // Try using invoiceId first, then fallback to order._id
    const invoiceId = order.invoiceId || order._id;
    
    if (!invoiceId) {
      toast({
        title: 'Error',
        description: 'No invoice found for this order',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) throw new Error('Failed to fetch invoice');
      const invoice = await response.json();
      
      setEditingInvoice(invoice);
      setInvoiceItems(invoice.items || []);
      setInvoiceDeliveryFee(invoice.deliveryFee || 0);
      setInvoiceDiscount(invoice.discount || 0);
      setInvoiceCustomerName(invoice.customerInfo?.name || '');
      setInvoiceCustomerPhone(invoice.customerInfo?.phone || '');
      setInvoiceCustomerEmail(invoice.customerInfo?.email || '');
      setInvoiceCustomerAddress(invoice.customerInfo?.address || {});
      setInvoicePaymentMethod(invoice.paymentMethod || '');
      setShowInvoiceEditor(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load invoice for editing',
        variant: 'destructive',
      });
    }
  };

  const handleSaveInvoice = () => {
    if (!editingInvoice) return;
    
    updateInvoiceMutation.mutate({
      invoiceId: editingInvoice._id,
      data: {
        items: invoiceItems,
        deliveryFee: invoiceDeliveryFee,
        discount: invoiceDiscount,
        customerInfo: {
          name: invoiceCustomerName,
          phone: invoiceCustomerPhone,
          email: invoiceCustomerEmail,
          address: invoiceCustomerAddress,
        },
        paymentMethod: invoicePaymentMethod,
      },
    });
  };

  const handleAddInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        productId: `new-${Date.now()}`,
        name: 'New Product',
        price: 0,
        quantity: 1,
        image: '/placeholder.png',
      },
    ]);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleUpdateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInvoiceItems(updatedItems);
  };

  const calculateInvoiceSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateInvoiceTotal = () => {
    return calculateInvoiceSubtotal() + invoiceDeliveryFee - invoiceDiscount;
  };

  const handleSaveBlog = () => {
    if (!editingBlog) return;

    const blogData = {
      title: editingBlog.title,
      excerpt: editingBlog.excerpt,
      content: editingBlog.content,
      image: editingBlog.image || undefined,
      author: editingBlog.author,
      category: (editingBlog as any).category,
      isPublished: editingBlog.isPublished,
      slug: editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (editingBlog._id === 'new') {
      createBlogMutation.mutate(blogData);
    } else {
      updateBlogMutation.mutate({ id: editingBlog._id, data: blogData });
    }
  };

  // Blog categories
  const blogCategories = [
    'Pet Care Tips',
    'Cat Health', 
    'Dog Health',
    'Training',
    'Nutrition',
    'Grooming',
    'Behavior',
    'Product Reviews'
  ];

  // Show loading state while session is being checked
  if (!isSessionChecked) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={showPOSDialog} onOpenChange={setShowPOSDialog}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 m-0 rounded-none border-none overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="flex items-center text-xl">
              <Grid3X3 className="w-6 h-6 mr-2 text-blue-600" />
              POS System
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full relative bg-white">
            <iframe 
              src="https://www.softhut.app/pos-mmp/" 
              className="absolute inset-0 w-full h-full border-0"
              title="POS System"
              allow="payment; fullscreen"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <PawPrint className="w-8 h-8 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
              <Badge className="bg-green-100 text-green-800">Meow Meow Pet Shop</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Welcome, <span className="text-gray-900 font-semibold">{user.firstName}</span></span>
              <Button 
                size="sm" 
                onClick={() => setShowPOSDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                POS System
              </Button>
              <Link href="/">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-black font-medium shadow-sm hover:shadow transition-all duration-200"
                >
                  <Home className="w-4 h-4 mr-2 text-gray-700 hover:text-black" />
                  Store
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={signOut} 
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-medium shadow-sm hover:shadow transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7 bg-white border border-gray-200">
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="repack-food" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Coffee className="w-4 h-4 mr-2" />
              Repack Food
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Speaker className="w-4 h-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="coupons" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Tag className="w-4 h-4 mr-2" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog Management
            </TabsTrigger>
            <TabsTrigger value="graphics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" />
              Graphics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="graphics" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Graphics Management</h2>
                <p className="text-gray-600">Manage banners and popup posters for the store</p>
              </div>
            </div>

            <Tabs defaultValue="banners" className="space-y-6">
              <TabsList className="bg-white border">
                <TabsTrigger value="banners">Home Banners</TabsTrigger>
                <TabsTrigger value="popups">Popup Posters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="banners" className="space-y-4">
                {/* Banner list content would follow here, search for existing content */}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* API Docs Tab Content moved into Products Tab */}

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                <p className="text-gray-600">View and manage customer orders</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search orders by customer name or order ID..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                />
              </div>
              <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Filter by status" className="text-black" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="all" className="text-black hover:bg-gray-100">All Orders</SelectItem>
                  <SelectItem value="pending" className="text-black hover:bg-gray-100">Pending</SelectItem>
                  <SelectItem value="processing" className="text-black hover:bg-gray-100">Processing</SelectItem>
                  <SelectItem value="shipped" className="text-black hover:bg-gray-100">Shipped</SelectItem>
                  <SelectItem value="delivered" className="text-black hover:bg-gray-100">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-black hover:bg-gray-100">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders List */}
            <div className="grid gap-4">
              {orders
                .filter((order: any) => {
                  const searchTerm = orderSearchTerm.toLowerCase();
                  const invoiceNumber = order.invoiceNumber?.toLowerCase() || '';

                  // Remove # from search term if present for comparison
                  const cleanSearchTerm = searchTerm.startsWith('#') ? searchTerm.substring(1) : searchTerm;

                  const matchesSearch = 
                    order.customerInfo?.name?.toLowerCase().includes(searchTerm) ||
                    order._id.toLowerCase().includes(searchTerm) ||
                    // Match invoice number with or without # prefix
                    invoiceNumber.includes(searchTerm) ||
                    invoiceNumber.includes(cleanSearchTerm) ||
                    // Also check if invoice number starts with search term when # is added
                    (searchTerm.startsWith('#') && invoiceNumber.includes(cleanSearchTerm)) ||
                    (!searchTerm.startsWith('#') && invoiceNumber.includes(searchTerm));

                  const matchesStatus = orderStatusFilter === 'all' || order.status?.toLowerCase() === orderStatusFilter;
                  return matchesSearch && matchesStatus;
                })
                .map((order: any) => (
                <Card key={order._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg font-bold text-red-700">
                            Order #{order.invoiceNumber || order._id.slice(-8).toUpperCase()}
                          </CardTitle>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} 
                                 className={
                                   order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                   order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                   order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                   order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                   'bg-gray-100 text-gray-800'
                                 }>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                          </Badge>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            ৳{order.total || 0}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium text-gray-900">Customer:</span>
                            <p>{order.customerInfo?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Phone:</span>
                            <p>{order.customerInfo?.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Items:</span>
                            <p>{order.items?.length || 0} items</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Date:</span>
                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {order.customerInfo?.address && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">Address:</span> {order.customerInfo.address.address}, {order.customerInfo.address.area}, {order.customerInfo.address.city}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {order && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-900"
                              onClick={() => {
                                // Fallback to order ID if invoiceId is missing, as they often match or can be resolved
                                const invoiceId = order.invoiceId || order._id;
                                window.open(`/invoice/${invoiceId}`, '_blank');
                              }}
                              data-testid={`view-invoice-${order._id}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Invoice
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-900"
                              onClick={() => handleEditInvoice(order)}
                              data-testid={`edit-invoice-${order._id}`}
                            >
                              <FileEdit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </>
                        )}
                        <Select
                          value={order.status || 'pending'}
                          onValueChange={(newStatus) => handleUpdateOrderStatus(order._id, newStatus)}
                        >
                          <SelectTrigger className="w-32 bg-white border-gray-300 text-sm text-black">
                            <SelectValue className="text-black" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300">
                            <SelectItem value="pending" className="text-black hover:bg-gray-100">Pending</SelectItem>
                            <SelectItem value="processing" className="text-black hover:bg-gray-100">Processing</SelectItem>
                            <SelectItem value="shipped" className="text-black hover:bg-gray-100">Shipped</SelectItem>
                            <SelectItem value="delivered" className="text-black hover:bg-gray-100">Delivered</SelectItem>
                            <SelectItem value="cancelled" className="text-black hover:bg-gray-100">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900" 
                          onClick={() => handleDeleteOrder(order._id)}
                          data-testid={`delete-order-${order._id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              {orders.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Customer orders will appear here once they start placing orders.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                <p className="text-gray-600">Manage your product catalog across all categories</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setEditingProduct(null);
                    form.reset();
                    setShowProductDialog(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  data-testid="button-add-product"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
                <Button 
                  onClick={() => {
                    setEditingBrand(null);
                    brandForm.reset();
                    setShowBrandDialog(true);
                  }}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 font-medium shadow-sm hover:shadow transition-all duration-200"
                  data-testid="button-manage-brands"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Brands
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium shadow-sm hover:shadow transition-all duration-200"
                      data-testid="button-api-docs"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      API Docs
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Public API Reference (v1)</DialogTitle>
                      <DialogDescription>
                        Use these endpoints to integrate product data into other systems.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
                        <h3 className="font-bold text-blue-800 text-sm mb-1">Authentication Required</h3>
                        <p className="text-blue-700 text-xs mb-2">Include your API Key in the request header or query string.</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-white px-2 py-1 rounded border text-blue-900 font-mono text-xs flex-1">
                            X-API-KEY: mmp_pos_integration_2026
                          </code>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 text-blue-600"
                            onClick={() => {
                              navigator.clipboard.writeText('mmp_pos_integration_2026');
                              toast({ title: "Copied!", description: "API Key copied to clipboard" });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase text-gray-500">How integration works</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex gap-3">
                            <div className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <p><strong>Fetch Data:</strong> Your POS system makes a "GET" request to our API using the API Key provided above.</p>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <p><strong>Real-time Info:</strong> The website sends back current stock levels, prices, and product names in a standard format (JSON).</p>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <p><strong>POS Update:</strong> Your POS system receives this data and updates its internal inventory automatically.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm uppercase text-gray-500">Endpoints</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto font-mono text-xs">
                          <p className="mb-1 text-green-400"># Example: Get POS Ready Data</p>
                          <p className="mb-3">GET /api/v1/products?limit=100&apiKey=mmp_pos_integration_2026</p>
                          
                          <p className="mb-1 text-green-400"># Get all products</p>
                          <p className="mb-3">GET /api/v1/products?limit=50&page=1</p>
                          
                          <p className="mb-1 text-green-400"># Get single product</p>
                          <p className="mb-3">GET /api/v1/products/:id-or-slug</p>
                          
                          <p className="mb-1 text-green-400"># Get categories</p>
                          <p className="mb-3">GET /api/v1/categories</p>
                          
                          <p className="mb-1 text-green-400"># Get brands</p>
                          <p>GET /api/v1/brands</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm uppercase text-gray-500">Query Parameters</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="font-bold">category</span>
                            <p className="text-gray-600">Filter by category slug</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="font-bold">brand</span>
                            <p className="text-gray-600">Filter by brand slug</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="font-bold">onSale</span>
                            <p className="text-gray-600">Set to 'true' for sale items</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="font-bold">Price</span>
                            <p className="text-gray-600">minPrice / maxPrice</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-1 bg-white p-4 rounded-lg border">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-black placeholder:text-gray-500"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 text-black">
                  <SelectValue placeholder="Category" className="text-black" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all" className="text-black hover:bg-gray-100">All Categories</SelectItem>
                  <SelectItem value="cat-food" className="text-black hover:bg-gray-100">Cat Food</SelectItem>
                  <SelectItem value="dog-food" className="text-black hover:bg-gray-100">Dog Food</SelectItem>
                  <SelectItem value="cat-toys" className="text-black hover:bg-gray-100">Cat Toys</SelectItem>
                  <SelectItem value="cat-litter" className="text-black hover:bg-gray-100">Cat Litter</SelectItem>
                  <SelectItem value="cat-care" className="text-black hover:bg-gray-100">Cat Care & Health</SelectItem>
                  <SelectItem value="clothing-beds-carrier" className="text-black hover:bg-gray-100">Clothing, Beds & Carrier</SelectItem>
                  <SelectItem value="cat-accessories" className="text-black hover:bg-gray-100">Cat Accessories</SelectItem>
                  <SelectItem value="dog-accessories" className="text-black hover:bg-gray-100">Dog Health & Accessories</SelectItem>
                  <SelectItem value="rabbit" className="text-black hover:bg-gray-100">Rabbit Food & Accessories</SelectItem>
                  <SelectItem value="bird" className="text-black hover:bg-gray-100">Bird Food & Accessories</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-48 text-black">
                  <SelectValue placeholder="Stock Status" className="text-black" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all" className="text-black hover:bg-gray-100">All Stock</SelectItem>
                  <SelectItem value="out-of-stock" className="text-black hover:bg-gray-100">Out of Stock</SelectItem>
                  <SelectItem value="low-stock" className="text-black hover:bg-gray-100">Low Stock (&lt;10)</SelectItem>
                  <SelectItem value="high-stock" className="text-black hover:bg-gray-100">High Stock (≥10)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full sm:w-48 text-black">
                  <SelectValue placeholder="Product Status" className="text-black" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all" className="text-black hover:bg-gray-100">All Products</SelectItem>
                  <SelectItem value="active" className="text-black hover:bg-gray-100">Active Products</SelectItem>
                  <SelectItem value="inactive" className="text-black hover:bg-gray-100">Inactive Products</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-r-none border ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-l-none border ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg border">
              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategory</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isLoadingProducts ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            Loading products...
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product: any) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {product.brandName || 
                                     (brands as any[]).find((b: any) => b.id === product.brandId || b.slug === product.brandId)?.name || 
                                     'Unknown Brand'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="text-xs">
                                {(categories as any[]).find((c: any) => c.id === product.category)?.name || product.categoryName || product.category}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              {product.subcategory ? (
                                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                  {product.subcategory.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Badge>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-900">৳{product.price}</td>
                            <td className="px-4 py-4 text-gray-900">{product.stockQuantity || product.stock || 0}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-1">
                                {product.isActive !== false && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                                )}
                                {product.isNew && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>
                                )}
                                {product.isBestseller && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Bestseller</Badge>
                                )}
                                {product.isOnSale && (
                                  <Badge variant="secondary" className="bg-red-100 text-red-800">On Sale</Badge>
                                )}
                                {(product.stockQuantity || product.stock || 0) === 0 && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">Out of Stock</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-green-600">৳{product.price}</span>
                          <Badge variant="outline">{product.brandName || 
                               (brands as any[]).find((b: any) => b.id === product.brandId || b.slug === product.brandId)?.name || 
                               'Unknown Brand'}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Stock: {product.stockQuantity || product.stock || 0}</span>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" onClick={() => {
                              setEditingProduct(product);
                              setShowProductDialog(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Repack Food Tab */}
          <TabsContent value="repack-food" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Repack Food Management</h2>
                <p className="text-gray-600">Manage repack food products and bulk food items</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingRepackProduct(null);
                  repackForm.reset();
                  setShowRepackDialog(true);
                }}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Repack Food
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-1 bg-white p-4 rounded-lg border">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search repack food products..."
                    value={repackSearchTerm}
                    onChange={(e) => setRepackSearchTerm(e.target.value)}
                    className="pl-10 text-black placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Repack Food Products */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-1">
                  <Coffee className="w-5 h-5" />
                  Repack Food Products
                </h3>
                <p className="text-sm text-orange-600 mt-1">
                  Products tagged as repack food items
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoadingRepackProducts ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Loading repack food products...
                        </td>
                      </tr>
                    ) : (
                      (() => {
                        const filteredRepackProducts = (repackProducts as any[]).filter((product: any) => {
                          const matchesSearch = product.name.toLowerCase().includes(repackSearchTerm.toLowerCase());
                          return matchesSearch;
                        });

                        return filteredRepackProducts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                              <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-sm">No repack food products found</p>
                              <p className="text-xs mt-1">
                                Add products with "repack-food" tag or containing "repack" in name/description
                              </p>
                            </td>
                          </tr>
                        ) : filteredRepackProducts.map((product: any) => (
                          <tr key={product.id} className="hover:bg-orange-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                                <div className="font-medium text-gray-900">{product.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {product.brandName || 
                               (brands as any[]).find((b: any) => b.id === product.brandId || b.slug === product.brandId)?.name || 
                               'No Brand'}
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="border-orange-200 text-orange-800">
                                {product.categoryName || 
                                 (categories as any[]).find((c: any) => c.id === product.categoryId || c.slug === product.categoryId || c.slug === product.category)?.name || 
                                 product.category || 
                                 'Uncategorized'}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-900">৳{product.price}</td>
                            <td className="px-4 py-4 text-gray-900">{product.stockQuantity || product.stock || 0}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-1">
                                {product.isActive !== false && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                                )}
                                {product.tags?.includes('repack-food') && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Repack</Badge>
                                )}
                                {product.isNew && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>
                                )}
                                {product.isBestseller && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Bestseller</Badge>
                                )}
                                {product.isOnSale && (
                                  <Badge variant="secondary" className="bg-red-100 text-red-800">On Sale</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" onClick={() => handleEditRepack(product)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Repack Food Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  Repack Food Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-900 mb-2">How to add repack food products:</h4>
                    <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                      <li>Use the "Add Repack Food" button above</li>
                      <li>Add "repack-food" in the Tags field</li>
                      <li>Include "repack" in the product name or description</li>
                      <li>Set appropriate pricing for bulk quantities</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Best practices:</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>Clearly specify quantity in product name</li>
                      <li>Include packaging information in description</li>
                      <li>Use appropriate categories (Adult Food, Kitten Food, etc.)</li>
                      <li>Set realistic stock quantities for bulk items</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {repackProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Repack Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(repackProducts as any[]).filter((p: any) => p.isActive !== false).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(repackProducts as any[]).filter((p: any) => (p.stockQuantity || p.stock || 0) > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">In Stock</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(repackProducts as any[]).filter((p: any) => (p.stockQuantity || p.stock || 0) === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Out of Stock</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Announcement Management</h2>
                <p className="text-gray-600">Manage website announcements shown in the top bar</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingAnnouncement(null);
                  announcementForm.reset();
                  setShowAnnouncementDialog(true);
                }}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Announcement
              </Button>
            </div>

            <div className="grid gap-1">
              {announcements.map((announcement: any) => (
                <Card key={announcement._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-2">
                          <Speaker className="w-5 h-5 text-yellow-600" />
                          <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                            {announcement.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl" dangerouslySetInnerHTML={{ __html: parseAnnouncementText(announcement.text) }} />
                        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                          <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                          {announcement.updatedAt !== announcement.createdAt && (
                            <>
                              <span>•</span>
                              <span>Updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" onClick={() => {
                          setEditingAnnouncement(announcement);
                          announcementForm.reset({
                            text: announcement.text,
                            isActive: announcement.isActive,
                          });
                          setShowAnnouncementDialog(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900" 
                          onClick={() => deleteAnnouncementMutation.mutate(announcement._id)}
                          disabled={deleteAnnouncementMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              {announcements.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Speaker className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                    <p className="text-gray-600 mb-4">Create your first announcement to show messages to website visitors.</p>
                    <Button 
                      onClick={() => {
                        setEditingAnnouncement(null);
                        announcementForm.reset();
                        setShowAnnouncementDialog(true);
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Announcement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
                <p className="text-gray-600">Create and manage discount coupons</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingCoupon(null);
                  couponForm.reset();
                  setShowCouponDialog(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                data-testid="add-coupon-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Coupon
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search coupons..."
                  value={couponSearchTerm}
                  onChange={(e) => setCouponSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Coupons List */}
            <div className="grid gap-4">
              {coupons
                .filter((coupon: any) => 
                  coupon.code.toLowerCase().includes(couponSearchTerm.toLowerCase()) ||
                  (coupon.description && coupon.description.toLowerCase().includes(couponSearchTerm.toLowerCase()))
                )
                .map((coupon: any) => (
                <Card key={coupon._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl font-bold text-purple-700">{coupon.code}</CardTitle>
                          <Badge variant={coupon.isActive ? 'default' : 'secondary'} className={coupon.isActive ? 'bg-green-100 text-green-800' : ''}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `৳${coupon.discountValue} Off`}
                          </Badge>
                        </div>
                        {coupon.description && (
                          <CardDescription className="mb-3">{coupon.description}</CardDescription>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-900">Min Order:</span>
                            <p>{coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : 'No minimum'}</p>
                          </div>
                          {coupon.maxDiscountAmount && (
                            <div>
                              <span className="font-medium text-gray-900">Max Discount:</span>
                              <p>৳{coupon.maxDiscountAmount}</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-900">Usage:</span>
                            <p>{coupon.usedCount} / {coupon.usageLimit || '∞'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Valid Until:</span>
                            <p>{new Date(coupon.validUntil).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" 
                          onClick={() => handleEditCoupon(coupon)}
                          data-testid={`edit-coupon-${coupon._id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900" 
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          data-testid={`delete-coupon-${coupon._id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              {coupons.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
                    <p className="text-gray-600 mb-4">Create your first coupon to offer discounts to customers.</p>
                    <Button 
                      onClick={() => {
                        setEditingCoupon(null);
                        couponForm.reset();
                        setShowCouponDialog(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Coupon
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <p className="text-gray-600">Create and manage blog posts</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingBlog({
                    _id: 'new',
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    image: '',
                    author: user.firstName || 'Admin',
                    publishedAt: new Date(),
                    category: '',
                    isPublished: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  } as any);
                  setShowBlogDialog(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </div>

            <div className="grid gap-1">
              {blogPosts.map((blog: BlogPost) => (
                <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      {blog.image && (
                        <div className="flex-shrink-0">
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-32 h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/128/128';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl line-clamp-2">{blog.title}</CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">{blog.excerpt}</CardDescription>
                        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500 flex-wrap">
                          <span>By {blog.author}</span>
                          <span>•</span>
                          <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                          <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                            {blog.isPublished ? 'published' : 'draft'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" onClick={() => {
                          setEditingBlog(blog);
                          setShowBlogDialog(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900" onClick={() => handleDeleteBlog(blog._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Graphics Tab */}
          <TabsContent value="graphics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Graphics Management</h2>
              <p className="text-gray-600">Manage home banners and popup posters</p>
            </div>

            {/* Banner Management Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Home Banners (1200x400px)</CardTitle>
                    <CardDescription>Maximum 3 active banners allowed</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingBanner(null);
                      bannerForm.reset();
                      setBannerImageSource('url');
                      setShowBannerDialog(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    data-testid="button-add-banner"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {banners.map((banner: Banner) => (
                    <Card key={banner._id} className="overflow-hidden">
                      <div className="flex items-center gap-4 p-4">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title || 'Banner'} 
                          className="w-32 h-16 object-cover rounded"
                          data-testid={`img-banner-${banner._id}`}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{banner.title || 'Untitled Banner'}</h4>
                          <p className="text-sm text-gray-500">Order: {banner.order}</p>
                          <Badge variant={banner.isActive ? 'default' : 'secondary'} className="mt-1">
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              try {
                                await apiRequest(`/api/banners/${banner._id}`, {
                                  method: 'PUT',
                                  body: JSON.stringify({ isActive: !banner.isActive }),
                                });
                                refetchBanners();
                                toast({
                                  title: 'Success',
                                  description: `Banner ${banner.isActive ? 'deactivated' : 'activated'} successfully`,
                                });
                              } catch (error: any) {
                                toast({
                                  title: 'Error',
                                  description: error.message || 'Failed to update banner',
                                  variant: 'destructive',
                                });
                              }
                            }}
                            data-testid={`button-toggle-banner-${banner._id}`}
                          >
                            {banner.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this banner?')) {
                                try {
                                  await apiRequest(`/api/banners/${banner._id}`, {
                                    method: 'DELETE',
                                  });
                                  refetchBanners();
                                  toast({
                                    title: 'Success',
                                    description: 'Banner deleted successfully',
                                  });
                                } catch (error: any) {
                                  toast({
                                    title: 'Error',
                                    description: error.message || 'Failed to delete banner',
                                    variant: 'destructive',
                                  });
                                }
                              }
                            }}
                            data-testid={`button-delete-banner-${banner._id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {banners.length === 0 && (
                    <div className="space-y-4">
                      <Card className="overflow-hidden border-dashed border-2 border-amber-300 bg-amber-50">
                        <div className="flex items-center gap-4 p-4">
                          <img 
                            src="/Banner_Reflex.webp" 
                            alt="Default Homepage Banner" 
                            className="w-32 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-800">Default Homepage Banner</h4>
                            <p className="text-sm text-amber-600">This banner is currently showing on the homepage as a fallback</p>
                            <Badge variant="outline" className="mt-1 border-amber-400 text-amber-700">
                              Fallback Banner
                            </Badge>
                          </div>
                        </div>
                      </Card>
                      <p className="text-center text-sm text-gray-500">
                        Add a new banner above to replace the default fallback banner
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popup Poster Management Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Popup Poster</CardTitle>
                    <CardDescription>Appears when loading the website (only one can be active)</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingPopupPoster(null);
                      popupPosterForm.reset();
                      setPopupImageSource('url');
                      setShowPopupDialog(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    data-testid="button-add-popup"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Popup Poster
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {popupPosters.map((poster: PopupPoster) => (
                    <Card key={poster._id} className="overflow-hidden">
                      <div className="flex items-center gap-4 p-4">
                        <img 
                          src={poster.imageUrl} 
                          alt={poster.title || 'Popup'} 
                          className="w-32 h-32 object-cover rounded"
                          data-testid={`img-popup-${poster._id}`}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{poster.title || 'Untitled Popup'}</h4>
                          <Badge variant={poster.isActive ? 'default' : 'secondary'} className="mt-1">
                            {poster.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              try {
                                await apiRequest(`/api/popup-posters/${poster._id}`, {
                                  method: 'PUT',
                                  body: JSON.stringify({ isActive: !poster.isActive }),
                                });
                                refetchPopupPosters();
                                toast({
                                  title: 'Success',
                                  description: `Popup poster ${poster.isActive ? 'deactivated' : 'activated'} successfully`,
                                });
                              } catch (error: any) {
                                toast({
                                  title: 'Error',
                                  description: error.message || 'Failed to update popup poster',
                                  variant: 'destructive',
                                });
                              }
                            }}
                            data-testid={`button-toggle-popup-${poster._id}`}
                          >
                            {poster.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this popup poster?')) {
                                try {
                                  await apiRequest(`/api/popup-posters/${poster._id}`, {
                                    method: 'DELETE',
                                  });
                                  refetchPopupPosters();
                                  toast({
                                    title: 'Success',
                                    description: 'Popup poster deleted successfully',
                                  });
                                } catch (error: any) {
                                  toast({
                                    title: 'Error',
                                    description: error.message || 'Failed to delete popup poster',
                                    variant: 'destructive',
                                  });
                                }
                              }
                            }}
                            data-testid={`button-delete-popup-${poster._id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {popupPosters.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No popup posters yet. Add one to display when users visit your site.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Banner Dialog */}
      <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </DialogTitle>
            <DialogDescription>Banner resolution should be 1200x400 pixels for best results</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-1 py-2">
            <Form {...bannerForm}>
              <form onSubmit={bannerForm.handleSubmit(async (data) => {
                try {
                  if (editingBanner) {
                    await apiRequest(`/api/banners/${editingBanner._id}`, {
                      method: 'PUT',
                      body: JSON.stringify(data),
                    });
                    toast({
                      title: 'Success',
                      description: 'Banner updated successfully',
                    });
                  } else {
                    await apiRequest('/api/banners', {
                      method: 'POST',
                      body: JSON.stringify(data),
                    });
                    toast({
                      title: 'Success',
                      description: 'Banner created successfully',
                    });
                  }
                  refetchBanners();
                  setShowBannerDialog(false);
                  bannerForm.reset();
                } catch (error: any) {
                  toast({
                    title: 'Error',
                    description: error.message || 'Failed to save banner',
                    variant: 'destructive',
                  });
                }
              })} className="space-y-4">
                <FormField
                  control={bannerForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Banner Image (1200x400px)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bannerForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Banner title" {...field} data-testid="input-banner-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bannerForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <Select 
                        value={field.value?.toString() || "1"} 
                        onValueChange={(value) => field.onChange(parseInt(value) || 1)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Banner Order" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="1">Order 1</SelectItem>
                          <SelectItem value="2">Order 2</SelectItem>
                          <SelectItem value="3">Order 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="sticky bottom-0 bg-white pt-2 border-t mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowBannerDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-submit-banner">
                    {editingBanner ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup Poster Dialog */}
      <Dialog open={showPopupDialog} onOpenChange={setShowPopupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPopupPoster ? 'Edit Popup Poster' : 'Add New Popup Poster'}</DialogTitle>
            <DialogDescription>This poster will appear when users load your website</DialogDescription>
          </DialogHeader>
          <Form {...popupPosterForm}>
            <form onSubmit={popupPosterForm.handleSubmit(async (data) => {
              try {
                if (editingPopupPoster) {
                  await apiRequest(`/api/popup-posters/${editingPopupPoster._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                  });
                  toast({
                    title: 'Success',
                    description: 'Popup poster updated successfully',
                  });
                } else {
                  await apiRequest('/api/popup-posters', {
                    method: 'POST',
                    body: JSON.stringify(data),
                  });
                  toast({
                    title: 'Success',
                    description: 'Popup poster created successfully',
                  });
                }
                refetchPopupPosters();
                setShowPopupDialog(false);
                popupPosterForm.reset();
              } catch (error: any) {
                toast({
                  title: 'Error',
                  description: error.message || 'Failed to save popup poster',
                  variant: 'destructive',
                });
              }
            })} className="space-y-4">
              <FormField
                control={popupPosterForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Popup Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={popupPosterForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Popup title" {...field} data-testid="input-popup-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowPopupDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit-popup">
                  {editingPopupPoster ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Create a new product for your store'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form 
              id="product-form"
              onSubmit={form.handleSubmit(editingProduct ? handleUpdateProduct : handleCreateProduct)} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Price (৳)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter price" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Product Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        rows={3} 
                        className="text-gray-900 bg-white border-gray-300 placeholder:text-gray-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-900 font-semibold text-sm">Available Weights</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. 1kg"
                          value={newWeight}
                          onChange={(e) => setNewWeight(e.target.value)}
                          className="h-8 w-24 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const current = form.getValues('availableWeights') || [];
                              if (newWeight && !current.includes(newWeight)) {
                                form.setValue('availableWeights', [...current, newWeight]);
                                setNewWeight('');
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            const current = form.getValues('availableWeights') || [];
                            if (newWeight && !current.includes(newWeight)) {
                              form.setValue('availableWeights', [...current, newWeight]);
                              setNewWeight('');
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      {(form.watch('availableWeights') || []).length > 0 ? (
                        form.watch('availableWeights')?.map((weight, idx) => (
                          <Badge key={idx} variant="secondary" className="flex items-center gap-1 bg-white border">
                            {weight}
                            <button
                              type="button"
                              onClick={() => {
                                const current = form.getValues('availableWeights') || [];
                                form.setValue('availableWeights', current.filter((_, i) => i !== idx));
                              }}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <X className="w-4 h-4 text-red-400" />
                          <span>Not applicable / None added</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-900 font-semibold text-sm">Available Colors</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Red"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          className="h-8 w-24 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const current = form.getValues('availableColors') || [];
                              if (newColor && !current.includes(newColor)) {
                                form.setValue('availableColors', [...current, newColor]);
                                setNewColor('');
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            const current = form.getValues('availableColors') || [];
                            if (newColor && !current.includes(newColor)) {
                              form.setValue('availableColors', [...current, newColor]);
                              setNewColor('');
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      {(form.watch('availableColors') || []).length > 0 ? (
                        form.watch('availableColors')?.map((color, idx) => (
                          <Badge key={idx} variant="secondary" className="flex items-center gap-1 bg-white border">
                            {color}
                            <button
                              type="button"
                              onClick={() => {
                                const current = form.getValues('availableColors') || [];
                                form.setValue('availableColors', current.filter((_, i) => i !== idx));
                              }}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <X className="w-4 h-4 text-red-400" />
                          <span>Not applicable / None added</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                            <SelectValue placeholder="Select category" className="text-gray-900" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="cat-food" className="text-black hover:bg-gray-100">Cat Food</SelectItem>
                          <SelectItem value="dog-food" className="text-black hover:bg-gray-100">Dog Food</SelectItem>
                          <SelectItem value="cat-toys" className="text-black hover:bg-gray-100">Cat Toys</SelectItem>
                          <SelectItem value="cat-litter" className="text-black hover:bg-gray-100">Cat Litter</SelectItem>
                          <SelectItem value="cat-care-health" className="text-black hover:bg-gray-100">Cat Care & Health</SelectItem>
                          <SelectItem value="clothing-beds-carrier" className="text-black hover:bg-gray-100">Clothing, Beds & Carrier</SelectItem>
                          <SelectItem value="cat-accessories" className="text-black hover:bg-gray-100">Cat Accessories</SelectItem>
                          <SelectItem value="dog-health-accessories" className="text-black hover:bg-gray-100">Dog Health & Accessories</SelectItem>
                          <SelectItem value="rabbit-food-accessories" className="text-black hover:bg-gray-100">Rabbit Food & Accessories</SelectItem>
                          <SelectItem value="bird-food-accessories" className="text-black hover:bg-gray-100">Bird Food & Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Brand</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                            <SelectValue placeholder="Select brand">
                              {field.value && brands.find((b: any) => b.id === field.value)?.name || 
                               field.value && brands.find((b: any) => b.slug === field.value)?.name || 
                               field.value || 
                               "Select brand"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="default-brand">Default Brand</SelectItem>
                          {(brands as BrandItem[]).map((brand) => (
                            <SelectItem 
                              key={brand._id || brand.id || brand.slug} 
                              value={brand.slug}
                              className="text-black hover:bg-gray-100"
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="0" 
                          className="text-gray-900 bg-white border-gray-300"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            field.onChange(Math.max(0, value));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Original Price (৳) - Optional</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter original price (if on sale)" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Subcategory (Shop by Category)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                            <SelectValue placeholder="Select subcategory" className="text-gray-900" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="none" className="text-black hover:bg-gray-100">No Category</SelectItem>
                          <SelectItem value="kitten-dry-food" className="text-black hover:bg-gray-100">Kitten Dry Food</SelectItem>
                          <SelectItem value="adult-dry-food" className="text-black hover:bg-gray-100">Adult Dry Food</SelectItem>
                          <SelectItem value="kitten-wet-food" className="text-black hover:bg-gray-100">Kitten Wet Food</SelectItem>
                          <SelectItem value="adult-wet-food" className="text-black hover:bg-gray-100">Adult Wet Food</SelectItem>
                          <SelectItem value="litter-box" className="text-black hover:bg-gray-100">Litter Box</SelectItem>
                          <SelectItem value="accessories" className="text-black hover:bg-gray-100">Accessories</SelectItem>
                          <SelectItem value="medicine" className="text-black hover:bg-gray-100">Medicine</SelectItem>
                          <SelectItem value="toys" className="text-black hover:bg-gray-100">Toys</SelectItem>
                          <SelectItem value="shampoo" className="text-black hover:bg-gray-100">Shampoo</SelectItem>
                          <SelectItem value="sunglass" className="text-black hover:bg-gray-100">Sunglass</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Main Product Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">
                      Additional Product Images (Up to 3)
                    </FormLabel>
                    <FormControl>
                      <MultipleImageUpload
                        value={field.value || []}
                        onChange={field.onChange}
                        maxImages={3}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload up to 3 additional images to showcase your product from different angles
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Product Flags</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>New Product</FormLabel>
                            <div className="text-xs text-muted-foreground">
                              Mark as a new arrival
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isBestseller"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Bestseller</FormLabel>
                            <div className="text-xs text-muted-foreground">
                              Mark as a bestselling product
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Status & Availability</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="isOnSale"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>On Sale</FormLabel>
                            <div className="text-xs text-muted-foreground">
                              Mark as currently on sale
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <div className="text-xs text-muted-foreground">
                              Product is visible to customers
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
          </div>

          <DialogFooter className="border-t pt-4 mt-0 flex-shrink-0">
            <Button 
              type="button" 
              variant="outline" 
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => setShowProductDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="product-form"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createProductMutation.isPending || updateProductMutation.isPending 
                ? 'Saving...' 
                : editingProduct ? 'Update Product' : 'Save Product'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repack Food Dialog */}
      <Dialog open={showRepackDialog} onOpenChange={setShowRepackDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {editingRepackProduct ? 'Edit Repack Food' : 'Add New Repack Food'}
            </DialogTitle>
            <DialogDescription>
              {editingRepackProduct ? 'Update repack food product information' : 'Create a new repack food product for your store'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
          <Form {...repackForm}>
            <form 
              id="repack-form"
              onSubmit={repackForm.handleSubmit(editingRepackProduct ? handleUpdateRepack : handleCreateRepack)} 
              className="space-y-4 py-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={repackForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={repackForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Price (৳)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter price" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={repackForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Product Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        rows={3} 
                        className="text-gray-900 bg-white border-gray-300 placeholder:text-gray-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={repackForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="text-gray-900 bg-white border-gray-300">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-gray-300 shadow-lg">
                          <SelectItem value="Kitten Dry Food" className="text-black hover:bg-gray-100">Kitten Dry Food</SelectItem>
                          <SelectItem value="Adult Dry Food" className="text-black hover:bg-gray-100">Adult Dry Food</SelectItem>
                          <SelectItem value="Kitten Wet Food" className="text-black hover:bg-gray-100">Kitten Wet Food</SelectItem>
                          <SelectItem value="Adult Wet Food" className="text-black hover:bg-gray-100">Adult Wet Food</SelectItem>
                          <SelectItem value="Litter Box" className="text-black hover:bg-gray-100">Litter Box</SelectItem>
                          <SelectItem value="Accessories" className="text-black hover:bg-gray-100">Accessories</SelectItem>
                          <SelectItem value="Medicine" className="text-black hover:bg-gray-100">Medicine</SelectItem>
                          <SelectItem value="Toys" className="text-black hover:bg-gray-100">Toys</SelectItem>
                          <SelectItem value="Shampoo" className="text-black hover:bg-gray-100">Shampoo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={repackForm.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Brand</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="text-gray-900 bg-white border-gray-300">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-gray-300 shadow-lg">
                          <SelectItem value="default-brand">Default Brand</SelectItem>
                          {(brands as BrandItem[]).map((brand) => (
                            <SelectItem 
                              key={brand._id || brand.id || brand.slug} 
                              value={brand.slug}
                              className="text-black hover:bg-gray-100"
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={repackForm.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="0" 
                          className="text-gray-900 bg-white border-gray-300"
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 0;
                            field.onChange(Math.max(0, value));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={repackForm.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Original Price (৳) - Optional</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter original price (if on sale)" className="text-gray-900 bg-white border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={repackForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Product Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This product will be tagged as "repack-food" and will appear in <strong>BOTH</strong> the repack section and the selected category page (e.g., Cat Food, Dog Food).
                </p>
              </div>
            </form>
          </Form>
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-0">
            <Button 
              type="button" 
              variant="outline" 
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => setShowRepackDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="repack-form"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={createRepackMutation.isPending || updateRepackMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createRepackMutation.isPending || updateRepackMutation.isPending 
                ? 'Saving...' 
                : editingRepackProduct ? 'Update Repack Food' : 'Save Repack Food'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Dialog */}
      <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog?._id === 'new' ? 'Add New Blog Post' : 'Edit Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingBlog?._id === 'new' ? 'Create a new blog post' : 'Update blog post'}
            </DialogDescription>
          </DialogHeader>

          {editingBlog && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="blog-title">Title</Label>
                <Input
                  id="blog-title"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                  placeholder="Enter blog title"
                  className="text-gray-900 bg-white border-gray-300"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <Label htmlFor="blog-image">Blog Image</Label>
                <ImageUpload
                  value={editingBlog.image || ''}
                  onChange={(url) => setEditingBlog({...editingBlog, image: url})}
                />
              </div>

              <div>
                <Label htmlFor="blog-excerpt">Excerpt</Label>
                <Input
                  id="blog-excerpt"
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                  placeholder="Brief description of the blog post"
                  className="text-gray-900 bg-white border-gray-300"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <Label htmlFor="blog-content">Content</Label>
                <Textarea
                  id="blog-content"
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                  placeholder="Write your blog content here..."
                  rows={8}
                  className="text-gray-900 bg-white border-gray-300 placeholder:text-gray-500"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="blog-category">Category</Label>
                  <Select value={(editingBlog as any).category || ''} onValueChange={(value) => setEditingBlog({...editingBlog, category: value} as any)}>
                    <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                      <SelectValue placeholder="Select a category" className="text-gray-900" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {blogCategories.map(category => (
                        <SelectItem key={category} value={category} className="text-gray-900 hover:bg-gray-100">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="blog-author">Author</Label>
                  <Input
                    id="blog-author"
                    value={editingBlog.author}
                    onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value})}
                    placeholder="Author name"
                    className="text-gray-900 bg-white border-gray-300"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <Label htmlFor="blog-status">Status</Label>
                  <Select value={editingBlog.isPublished ? 'published' : 'draft'} onValueChange={(value) => setEditingBlog({...editingBlog, isPublished: value === 'published'})}>
                    <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                      <SelectValue className="text-gray-900" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="draft" className="text-gray-900 hover:bg-gray-100">Draft</SelectItem>
                      <SelectItem value="published" className="text-gray-900 hover:bg-gray-100">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50" onClick={() => setShowBlogDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBlog} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Blog Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
            </DialogTitle>
            <DialogDescription>
              {editingAnnouncement ? 'Update announcement' : 'Create a new announcement for the top bar'}
            </DialogDescription>
          </DialogHeader>

          <Form {...announcementForm}>
            <form onSubmit={announcementForm.handleSubmit((data) => {
              if (editingAnnouncement) {
                updateAnnouncementMutation.mutate({ id: editingAnnouncement._id, data });
              } else {
                createAnnouncementMutation.mutate(data);
              }
            })} className="space-y-4">
              <FormField
                control={announcementForm.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Announcement Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter announcement message..." 
                        rows={3} 
                        className="text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 !text-gray-900 !bg-white"
                        style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={announcementForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <div className="text-xs text-muted-foreground">
                        Show to visitors
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
                  onClick={() => setShowAnnouncementDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  disabled={createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending 
                    ? 'Saving...' 
                    : editingAnnouncement ? 'Update Announcement' : 'Save Announcement'
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Coupon Dialog */}
      <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon ? 'Update coupon information' : 'Create a new discount coupon'}
            </DialogDescription>
          </DialogHeader>

          <Form {...couponForm}>
            <form 
              onSubmit={couponForm.handleSubmit((data) => {
                if (editingCoupon) {
                  handleUpdateCoupon(data);
                } else {
                  handleCreateCoupon(data);
                }
              })} 
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={couponForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Coupon Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., SAVE20" 
                          className="text-gray-900 bg-white border-gray-300 uppercase" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={couponForm.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Discount Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-gray-900 bg-white border-gray-300">
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-gray-300">
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                          <SelectItem value="free_delivery">Free Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={couponForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the coupon" 
                        rows={2} 
                        className="text-gray-900 bg-white border-gray-300" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {couponForm.watch('discountType') !== 'free_delivery' && (
                  <FormField
                    control={couponForm.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-semibold">
                          Discount Value {couponForm.watch('discountType') === 'percentage' ? '(%)' : '(৳)'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            placeholder={couponForm.watch('discountType') === 'percentage' ? '10' : '100'} 
                            className="text-gray-900 bg-white border-gray-300" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {couponForm.watch('discountType') === 'free_delivery' && (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">Coupon Type</FormLabel>
                    <div className="h-10 bg-green-50 border border-green-200 rounded-md flex items-center px-3 text-green-700 font-medium">
                      Free Delivery (No discount value needed)
                    </div>
                  </FormItem>
                )}
                <FormField
                  control={couponForm.control}
                  name="minOrderAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Min Order Amount (৳)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0 (no minimum)" 
                          className="text-gray-900 bg-white border-gray-300" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={couponForm.control}
                  name="maxDiscountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Max Discount Amount (৳)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="No maximum" 
                          className="text-gray-900 bg-white border-gray-300" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={couponForm.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Usage Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Unlimited" 
                          className="text-gray-900 bg-white border-gray-300" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={couponForm.control}
                  name="validFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Valid From</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="text-gray-900 bg-white border-gray-300" 
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={couponForm.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Valid Until</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="text-gray-900 bg-white border-gray-300" 
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={couponForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-gray-900 font-semibold">Active Status</FormLabel>
                      <div className="text-sm text-gray-600">
                        Enable this coupon for customer use
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => setShowCouponDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createCouponMutation.isPending || updateCouponMutation.isPending 
                    ? 'Saving...' 
                    : editingCoupon ? 'Update Coupon' : 'Save Coupon'
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Brand Management Dialog */}
      <Dialog open={showBrandDialog} onOpenChange={setShowBrandDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingBrand ? 'Edit Brand' : 'Brand Management'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingBrand ? 'Update brand details' : 'Manage your brands - add new brands or edit existing ones'}
            </DialogDescription>
          </DialogHeader>
          
          {!editingBrand ? (
            <div className="space-y-4">
              {/* Existing Brands List */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Brands</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(brands as BrandItem[]).map((brand) => (
                    <div 
                      key={brand._id || brand.id} 
                      className="bg-white border rounded-lg p-3 flex flex-col items-center gap-2 group relative"
                    >
                      {brand.logo ? (
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          className="w-16 h-12 object-contain"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 text-center">{brand.name}</span>
                      <Badge 
                        variant={brand.isActive ? 'default' : 'secondary'}
                        className={brand.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                      >
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex gap-1 mt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setEditingBrand(brand);
                            brandForm.reset({
                              name: brand.name,
                              logo: brand.logo || '',
                              isActive: brand.isActive,
                            });
                          }}
                          data-testid={`edit-brand-${brand._id || brand.id}`}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${brand.name}"?`)) {
                              deleteBrandMutation.mutate((brand._id || brand.id) as string);
                            }
                          }}
                          data-testid={`delete-brand-${brand._id || brand.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {(brands as BrandItem[]).length === 0 && (
                  <p className="text-center text-gray-500 py-4">No brands found. Add your first brand below.</p>
                )}
              </div>

              {/* Add New Brand Form */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Add New Brand</h3>
                <Form {...brandForm}>
                  <form onSubmit={brandForm.handleSubmit((data) => createBrandMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={brandForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">Brand Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter brand name" 
                              className="text-gray-900 bg-white border-gray-300" 
                              {...field}
                              data-testid="input-brand-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={brandForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">Logo URL</FormLabel>
                          <div className="flex gap-2 mb-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={brandLogoSource === 'url' ? 'default' : 'outline'}
                              onClick={() => setBrandLogoSource('url')}
                              className={brandLogoSource === 'url' ? 'bg-green-600' : ''}
                            >
                              URL
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={brandLogoSource === 'upload' ? 'default' : 'outline'}
                              onClick={() => setBrandLogoSource('upload')}
                              className={brandLogoSource === 'upload' ? 'bg-green-600' : ''}
                            >
                              Upload
                            </Button>
                          </div>
                          <FormControl>
                            {brandLogoSource === 'url' ? (
                              <Input 
                                placeholder="Enter logo URL" 
                                className="text-gray-900 bg-white border-gray-300" 
                                {...field}
                                data-testid="input-brand-logo"
                              />
                            ) : (
                              <ImageUpload
                                value={field.value || ''}
                                onChange={field.onChange}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={brandForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-gray-900 font-semibold">Active Status</FormLabel>
                            <div className="text-sm text-gray-600">
                              Show this brand on the homepage and brand pages
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        onClick={() => setShowBrandDialog(false)}
                      >
                        Close
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={createBrandMutation.isPending}
                        data-testid="button-save-brand"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {createBrandMutation.isPending ? 'Adding...' : 'Add Brand'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            /* Edit Brand Form */
            <Form {...brandForm}>
              <form onSubmit={brandForm.handleSubmit((data) => updateBrandMutation.mutate({ id: (editingBrand._id || editingBrand.id) as string, data }))} className="space-y-4">
                <FormField
                  control={brandForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Brand Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter brand name" 
                          className="text-gray-900 bg-white border-gray-300" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={brandForm.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">Logo URL</FormLabel>
                      <div className="flex gap-2 mb-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={brandLogoSource === 'url' ? 'default' : 'outline'}
                          onClick={() => setBrandLogoSource('url')}
                          className={brandLogoSource === 'url' ? 'bg-green-600' : ''}
                        >
                          URL
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={brandLogoSource === 'upload' ? 'default' : 'outline'}
                          onClick={() => setBrandLogoSource('upload')}
                          className={brandLogoSource === 'upload' ? 'bg-green-600' : ''}
                        >
                          Upload
                        </Button>
                      </div>
                      <FormControl>
                        {brandLogoSource === 'url' ? (
                          <Input 
                            placeholder="Enter logo URL" 
                            className="text-gray-900 bg-white border-gray-300" 
                            {...field}
                          />
                        ) : (
                          <ImageUpload
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={brandForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-900 font-semibold">Active Status</FormLabel>
                        <div className="text-sm text-gray-600">
                          Show this brand on the homepage and brand pages
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    onClick={() => {
                      setEditingBrand(null);
                      brandForm.reset();
                    }}
                  >
                    Back to List
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={updateBrandMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateBrandMutation.isPending ? 'Saving...' : 'Update Brand'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Editor Dialog */}
      <Dialog open={showInvoiceEditor} onOpenChange={setShowInvoiceEditor}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Edit Invoice {editingInvoice?.invoiceNumber}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Modify invoice items, prices, delivery fee, and discounts
            </DialogDescription>
          </DialogHeader>

          {editingInvoice && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2">Name</Label>
                    <Input
                      value={invoiceCustomerName}
                      onChange={(e) => setInvoiceCustomerName(e.target.value)}
                      className="bg-white text-black"
                      placeholder="Customer name"
                      data-testid="input-invoice-customer-name"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2">Phone</Label>
                    <Input
                      value={invoiceCustomerPhone}
                      onChange={(e) => setInvoiceCustomerPhone(e.target.value)}
                      className="bg-white text-black"
                      placeholder="Phone number"
                      data-testid="input-invoice-customer-phone"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2">Email</Label>
                    <Input
                      type="email"
                      value={invoiceCustomerEmail}
                      onChange={(e) => setInvoiceCustomerEmail(e.target.value)}
                      className="bg-white text-black"
                      placeholder="Email address"
                      data-testid="input-invoice-customer-email"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2">Payment Method</Label>
                    <Input
                      value={invoicePaymentMethod}
                      onChange={(e) => setInvoicePaymentMethod(e.target.value)}
                      className="bg-white text-black"
                      placeholder="Payment method"
                      data-testid="input-invoice-payment-method"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-700 font-medium mb-2">Shipping Address</Label>
                    <Textarea
                      value={typeof invoiceCustomerAddress === 'string' ? invoiceCustomerAddress : invoiceCustomerAddress?.address || ''}
                      onChange={(e) => {
                        if (typeof invoiceCustomerAddress === 'string') {
                          setInvoiceCustomerAddress(e.target.value);
                        } else {
                          setInvoiceCustomerAddress({ ...invoiceCustomerAddress, address: e.target.value });
                        }
                      }}
                      className="bg-white text-black min-h-[80px]"
                      placeholder="Shipping address"
                      data-testid="textarea-invoice-customer-address"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddInvoiceItem}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-add-invoice-item"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {invoiceItems.map((item, index) => (
                    <div key={item.productId || index} className="border rounded-lg p-4 bg-gray-50">
                      {/* Product Image and Name Row */}
                      <div className="flex items-start gap-4 mb-4">
                        {item.image && (
                          <div className="flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover border"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Product Name</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => handleUpdateInvoiceItem(index, 'name', e.target.value)}
                            className="bg-white text-black"
                            placeholder="Product name"
                            data-testid={`input-item-name-${index}`}
                          />
                        </div>
                      </div>

                      {/* Product Image URL Row */}
                      <div className="mb-4">
                        <Label className="text-xs text-gray-600">Product Image URL</Label>
                        <Input
                          value={item.image || ''}
                          onChange={(e) => handleUpdateInvoiceItem(index, 'image', e.target.value)}
                          className="bg-white text-black text-sm"
                          placeholder="https://example.com/image.jpg"
                          data-testid={`input-item-image-${index}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the product image URL</p>
                      </div>

                      {/* Price, Quantity, and Total Row */}
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600">Price (৳)</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleUpdateInvoiceItem(index, 'price', parseFloat(e.target.value) || 0)}
                            className="bg-white text-black"
                            placeholder="0"
                            data-testid={`input-item-price-${index}`}
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-xs text-gray-600">Qty</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="bg-white text-black"
                            min="1"
                            data-testid={`input-item-quantity-${index}`}
                          />
                        </div>
                        <div className="w-28 text-right">
                          <Label className="text-xs text-gray-600">Total</Label>
                          <p className="font-semibold text-gray-900 mt-2">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 mb-1"
                          onClick={() => handleRemoveInvoiceItem(index)}
                          data-testid={`button-remove-item-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {invoiceItems.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No items in invoice. Add items using the button above.</p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-900">৳{calculateInvoiceSubtotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <Label className="text-gray-700">Delivery Fee (৳):</Label>
                    <Input
                      type="number"
                      value={invoiceDeliveryFee}
                      onChange={(e) => setInvoiceDeliveryFee(parseFloat(e.target.value) || 0)}
                      className="w-32 bg-white text-black text-right"
                      min="0"
                      data-testid="input-delivery-fee"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <Label className="text-gray-700">Discount (৳):</Label>
                    <Input
                      type="number"
                      value={invoiceDiscount}
                      onChange={(e) => setInvoiceDiscount(parseFloat(e.target.value) || 0)}
                      className="w-32 bg-white text-black text-right"
                      min="0"
                      data-testid="input-invoice-discount"
                    />
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-green-600">৳{calculateInvoiceTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => {
                setShowInvoiceEditor(false);
                setEditingInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSaveInvoice}
              disabled={updateInvoiceMutation.isPending}
              data-testid="button-save-invoice"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateInvoiceMutation.isPending ? 'Saving...' : 'Save Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}