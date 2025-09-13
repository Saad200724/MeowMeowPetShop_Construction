import { useState, useEffect } from "react";
import { Link } from "wouter";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Package, FileEdit, Plus, Trash2, ArrowLeft, Search, 
  Filter, Grid, List, Eye, Edit, Save, X, 
  Home, PawPrint, BookOpen, Speaker, Grid3X3, Coffee, Tag, ShoppingCart
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
  stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
  tags: z.string().optional(),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isActive: z.boolean().optional(),
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
  discountType: z.enum(['percentage', 'fixed'], { required_error: 'Discount type is required' }),
  discountValue: z.number().min(0.01, 'Discount value must be greater than 0'),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  validFrom: z.date({ required_error: 'Valid from date is required' }),
  validUntil: z.date({ required_error: 'Valid until date is required' }),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type RepackFormData = z.infer<typeof repackFormSchema>;
type AnnouncementFormData = z.infer<typeof announcementFormSchema>;
type BlogFormData = z.infer<typeof blogFormSchema>;
type CouponFormData = z.infer<typeof couponFormSchema>;

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
  discountType: 'percentage' | 'fixed';
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



export default function AdminPage() {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>('adult-food');
  const [repackSearchTerm, setRepackSearchTerm] = useState('');
  const [editingRepackProduct, setEditingRepackProduct] = useState<any>(null);
  const [showRepackDialog, setShowRepackDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [couponSearchTerm, setCouponSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Function to parse announcement text for bold formatting
  const parseAnnouncementText = (text: string) => {
    if (!text) return text;

    // Replace **text** with bold
    let parsed = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with bold
    parsed = parsed.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    return parsed;
  };

  // Fetch products, categories, and brands from database
  const { data: products = [], isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['/api/products'],
  });

  // Fetch repack products separately for admin management
  const { data: repackProducts = [], isLoading: isLoadingRepackProducts, refetch: refetchRepackProducts } = useQuery({
    queryKey: ['/api/admin/repack-products'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['/api/brands'],
  });

  // Announcements queries
  const { data: announcements = [], refetch: refetchAnnouncements } = useQuery({
    queryKey: ['/api/announcements'],
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
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
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
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
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
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
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

  // Form for product creation/editing
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
      stockQuantity: 0,
      tags: '',
      isNew: false,
      isBestseller: false,
      isOnSale: false,
      isActive: true,
    },
  });

  // Form for repack food creation/editing
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

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest('POST', '/api/products', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
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
      const response = await apiRequest('PUT', `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
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
      const response = await apiRequest('DELETE', `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
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

  // Repack food mutations
  const createRepackMutation = useMutation({
    mutationFn: async (data: RepackFormData) => {
      // Add repack-food tag automatically
      const repackData = {
        ...data,
        tags: 'repack-food',
        isActive: true,
      };
      const response = await apiRequest('POST', '/api/products', repackData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
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
      const response = await apiRequest('PUT', `/api/products/${id}`, repackData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
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

  // Fetch blogs from API
  const { data: blogPosts = [], refetch: refetchBlogs } = useQuery({
    queryKey: ['/api/blog'],
  });

  // Fetch coupons from API
  const { data: coupons = [], refetch: refetchCoupons } = useQuery({
    queryKey: ['/api/coupons'],
  });

  // Fetch orders from API
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['/api/orders'],
  });

  // Blog mutations
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

  // Coupon mutations
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
            <Link href="/sign-in">
              <Button className="bg-red-600 hover:bg-red-700">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredProducts = (products as any[]).filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;

    const stockQuantity = product.stockQuantity || product.stock || 0;
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'out-of-stock' && stockQuantity === 0) ||
      (stockFilter === 'low-stock' && stockQuantity > 0 && stockQuantity < 10) ||
      (stockFilter === 'high-stock' && stockQuantity >= 10);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleCreateProduct = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (editingProduct) {
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
      stockQuantity: product.stock || product.stockQuantity || 0,
      tags: product.tags?.join(', ') || '',
      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
      isOnSale: product.isOnSale || false,
      isActive: product.isActive !== false,
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
    createCouponMutation.mutate(data);
  };

  const handleUpdateCoupon = (data: CouponFormData) => {
    if (editingCoupon) {
      updateCouponMutation.mutate({ id: editingCoupon._id, data });
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

  // Order status update mutation
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

  // Order handlers
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handleSaveBlog = () => {
    if (!editingBlog) return;

    const blogData = {
      title: editingBlog.title,
      excerpt: editingBlog.excerpt,
      content: editingBlog.content,
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

  return (
    <div className="min-h-screen bg-gray-50">
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
              <span className="text-sm text-gray-600">Welcome, {user.firstName}</span>
              <Link href="/">
                <Button size="sm" variant="outline" className="text-gray-600">
                  <Home className="w-4 h-4 mr-2" />
                  Store
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={signOut} className="text-red-600 border-red-200 hover:bg-red-50">
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
            <TabsTrigger value="shop-categories" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Shop by Category
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
          </TabsList>

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
                        {order.invoiceId && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-900"
                            onClick={() => window.open(`/invoice/${order.invoiceId}`, '_blank')}
                            data-testid={`view-invoice-${order._id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Invoice
                          </Button>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                <p className="text-gray-600">Manage your product catalog across all categories</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingProduct(null);
                  form.reset();
                  setShowProductDialog(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
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
                  {(categories as any[]).map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-black hover:bg-gray-100">{cat.name}</SelectItem>
                  ))}
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isLoadingProducts ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            Loading products...
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                                {(categories as any[]).find((c: any) => c.id === product.categoryId)?.name || product.categoryId}
                              </Badge>
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

          {/* Shop by Category Tab */}
          <TabsContent value="shop-categories" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shop by Category Management</h2>
                <p className="text-gray-600">Manage the 10 featured categories displayed on the homepage</p>
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Select Category to Manage</h3>
              <Select value={selectedShopCategory} onValueChange={setSelectedShopCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a shop category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat-food">Cat Food</SelectItem>
                  <SelectItem value="dog-food">Dog Food</SelectItem>
                  <SelectItem value="cat-toys">Cat Toys</SelectItem>
                  <SelectItem value="cat-litter">Cat Litter</SelectItem>
                  <SelectItem value="cat-care">Cat Care & Health</SelectItem>
                  <SelectItem value="clothing-beds-carrier">Clothing, Beds & Carrier</SelectItem>
                  <SelectItem value="cat-accessories">Cat Accessories</SelectItem>
                  <SelectItem value="dog-accessories">Dog Health & Accessories</SelectItem>
                  <SelectItem value="rabbit">Rabbit Food & Accessories</SelectItem>
                  <SelectItem value="bird">Bird Food & Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Products Management */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-1">
                    <Grid3X3 className="w-5 h-5 text-green-600" />
                    {selectedShopCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Products
                  </CardTitle>
                  <CardDescription>
                    Assign products to this featured category. These will appear in the "Shop by Category" section on the homepage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">How to manage Shop by Category products:</h4>
                      <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        <li>Go to the "Products" tab to add/edit individual products</li>
                        <li>Assign products to the appropriate regular categories (Adult Food, Kitten Food, etc.)</li>
                        <li>Use the "Tags" field to mark products for featured categories</li>
                        <li>Products with matching tags will automatically appear in these sections</li>
                      </ul>
                    </div>

                    {/* Current Products in Category */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Products currently assigned to this category:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {products
                          .filter((product: any) => 
                            product.tags?.includes(selectedShopCategory) ||
                            (selectedShopCategory === 'cat-food' && product.categoryId === 'cat-food') ||
                            (selectedShopCategory === 'dog-food' && product.categoryId === 'dog-food') ||
                            (selectedShopCategory === 'cat-toys' && product.categoryId === 'cat-toys') ||
                            (selectedShopCategory === 'cat-litter' && product.categoryId === 'cat-litter') ||
                            (selectedShopCategory === 'cat-care' && product.categoryId === 'cat-care') ||
                            (selectedShopCategory === 'clothing-beds-carrier' && product.categoryId === 'clothing-beds-carrier') ||
                            (selectedShopCategory === 'cat-accessories' && product.categoryId === 'cat-accessories') ||
                            (selectedShopCategory === 'dog-accessories' && product.categoryId === 'dog-accessories') ||
                            (selectedShopCategory === 'rabbit' && product.categoryId === 'rabbit') ||
                            (selectedShopCategory === 'bird' && product.categoryId === 'bird')
                          )
                          .map((product: any) => (
                            <Card key={product.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm truncate">{product.name}</h5>
                                    <p className="text-xs text-gray-500">৳{product.price}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {product.isActive && (
                                        <Badge className="text-xs bg-green-100 text-green-800">Active</Badge>
                                      )}
                                      {product.isNew && (
                                        <Badge className="text-xs bg-blue-100 text-blue-800">New</Badge>
                                      )}
                                      {product.isBestseller && (
                                        <Badge className="text-xs bg-yellow-100 text-yellow-800">Bestseller</Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        }
                        {products
                          .filter((product: any) => 
                            product.tags?.includes(selectedShopCategory) ||
                            (selectedShopCategory === 'cat-food' && product.categoryId === 'cat-food') ||
                            (selectedShopCategory === 'dog-food' && product.categoryId === 'dog-food') ||
                            (selectedShopCategory === 'cat-toys' && product.categoryId === 'cat-toys') ||
                            (selectedShopCategory === 'cat-litter' && product.categoryId === 'cat-litter') ||
                            (selectedShopCategory === 'cat-care' && product.categoryId === 'cat-care') ||
                            (selectedShopCategory === 'clothing-beds-carrier' && product.categoryId === 'clothing-beds-carrier') ||
                            (selectedShopCategory === 'cat-accessories' && product.categoryId === 'cat-accessories') ||
                            (selectedShopCategory === 'dog-accessories' && product.categoryId === 'dog-accessories') ||
                            (selectedShopCategory === 'rabbit' && product.categoryId === 'rabbit') ||
                            (selectedShopCategory === 'bird' && product.categoryId === 'bird')
                          ).length === 0 && (
                          <div className="col-span-full text-center py-8 text-gray-500">
                            <Grid3X3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No products assigned to this category yet.</p>
                            <p className="text-xs mt-1">
                              Go to Products tab and assign products using categories or tags.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-1">
                      <Button
                        onClick={() => {
                          setEditingProduct(null);
                          form.reset();
                          setShowProductDialog(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Product
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('products')}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Manage All Products
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                    {[
                      'cat-food', 'dog-food', 'cat-toys', 'cat-litter', 
                      'cat-care', 'clothing-beds-carrier', 'cat-accessories', 
                      'dog-accessories', 'rabbit', 'bird'
                    ].map((category) => {
                      const count = products.filter((product: any) => 
                        product.tags?.includes(category) ||
                        (category === 'cat-food' && product.categoryId === 'cat-food') ||
                        (category === 'dog-food' && product.categoryId === 'dog-food') ||
                        (category === 'cat-toys' && product.categoryId === 'cat-toys') ||
                        (category === 'cat-litter' && product.categoryId === 'cat-litter') ||
                        (category === 'cat-care' && product.categoryId === 'cat-care') ||
                        (category === 'clothing-beds-carrier' && product.categoryId === 'clothing-beds-carrier') ||
                        (category === 'cat-accessories' && product.categoryId === 'cat-accessories') ||
                        (category === 'dog-accessories' && product.categoryId === 'dog-accessories') ||
                        (category === 'rabbit' && product.categoryId === 'rabbit') ||
                        (category === 'bird' && product.categoryId === 'bird')
                      ).length;

                      return (
                        <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">{count}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
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
                className="bg-orange-600 hover:bg-orange-700"
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
                    className="pl-10"
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
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                              <Badge variant="outline" className="border-orange-200 text-orange-800">
                                {(categories as any[]).find((c: any) => c.id === product.categoryId)?.name || product.categoryId}
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
                className="bg-yellow-600 hover:bg-yellow-700"
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
                      className="bg-yellow-600 hover:bg-yellow-700"
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
                className="bg-purple-600 hover:bg-purple-700"
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
                  className="pl-10 bg-white border-gray-300"
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
                      className="bg-purple-600 hover:bg-purple-700"
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
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </div>

            <div className="grid gap-1">
              {blogPosts.map((blog) => (
                <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{blog.title}</CardTitle>
                        <CardDescription className="mt-2">{blog.excerpt}</CardDescription>
                        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                          <span>By {blog.author}</span>
                          <span>•</span>
                          <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                          <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                            {blog.isPublished ? 'published' : 'draft'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
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
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Create a new product for your store'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(editingProduct ? handleUpdateProduct : handleCreateProduct)} 
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-1">
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

              <div className="grid grid-cols-3 gap-1">
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
                          <SelectItem value="nekko">Nekko</SelectItem>
                          <SelectItem value="purina">Purina</SelectItem>
                          <SelectItem value="one">ONE</SelectItem>
                          <SelectItem value="reflex">Reflex</SelectItem>
                          <SelectItem value="reflex-plus">Reflex Plus</SelectItem>
                          <SelectItem value="royal-canin">Royal Canin</SelectItem>
                          <SelectItem value="sheba">Sheba</SelectItem>
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
                          placeholder="0" 
                          className="text-gray-900 bg-white border-gray-300"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
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
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="premium, adult, dry food" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
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

              <div className="grid grid-cols-2 gap-1">
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

              <DialogFooter>
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
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createProductMutation.isPending || updateProductMutation.isPending 
                    ? 'Saving...' 
                    : editingProduct ? 'Update Product' : 'Save Product'
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Repack Food Dialog */}
      <Dialog open={showRepackDialog} onOpenChange={setShowRepackDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRepackProduct ? 'Edit Repack Food' : 'Add New Repack Food'}
            </DialogTitle>
            <DialogDescription>
              {editingRepackProduct ? 'Update repack food product information' : 'Create a new repack food product for your store'}
            </DialogDescription>
          </DialogHeader>

          <Form {...repackForm}>
            <form 
              onSubmit={repackForm.handleSubmit(editingRepackProduct ? handleUpdateRepack : handleCreateRepack)} 
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-1">
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

              <div className="grid grid-cols-3 gap-1">
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
                          <SelectItem value="nekko">Nekko</SelectItem>
                          <SelectItem value="purina">Purina</SelectItem>
                          <SelectItem value="one">ONE</SelectItem>
                          <SelectItem value="reflex">Reflex</SelectItem>
                          <SelectItem value="reflex-plus">Reflex Plus</SelectItem>
                          <SelectItem value="royal-canin">Royal Canin</SelectItem>
                          <SelectItem value="sheba">Sheba</SelectItem>
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
                          placeholder="0" 
                          className="text-gray-900 bg-white border-gray-300"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
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
                        <Input placeholder="Enter image URL" className="text-gray-900 bg-white border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> This product will automatically be tagged as "repack-food" and appear in the bulk/repack sections only.
                </p>
              </div>

              <DialogFooter>
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
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={createRepackMutation.isPending || updateRepackMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createRepackMutation.isPending || updateRepackMutation.isPending 
                    ? 'Saving...' 
                    : editingRepackProduct ? 'Update Repack Food' : 'Save Repack Food'
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
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

              <div className="grid grid-cols-3 gap-1">
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
            <Button onClick={handleSaveBlog} className="bg-purple-600 hover:bg-purple-700">
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
                  className="bg-yellow-600 hover:bg-yellow-700"
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
              onSubmit={couponForm.handleSubmit(editingCoupon ? handleUpdateCoupon : handleCreateCoupon)} 
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
                  className="bg-purple-600 hover:bg-purple-700"
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
    </div>
  );
}