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
  Home, PawPrint, BookOpen, Speaker, Grid3X3, Coffee
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

const announcementFormSchema = z.object({
  text: z.string().min(1, 'Announcement text is required'),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type AnnouncementFormData = z.infer<typeof announcementFormSchema>;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
}



export default function AdminPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>('adult-food');
  const [repackSearchTerm, setRepackSearchTerm] = useState('');

  // Function to parse bold text formatting
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

  const announcementForm = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      text: '',
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

  // Initialize sample blog data
  useEffect(() => {
    const sampleBlogs: BlogPost[] = [
      {
        id: '1',
        title: 'Complete Guide to Cat Nutrition',
        excerpt: 'Everything you need to know about feeding your feline friend',
        content: 'Proper nutrition is essential for your cat\'s health and wellbeing...',
        category: 'Cat Care',
        author: 'Dr. Sarah Johnson',
        publishedAt: '2025-01-20',
        status: 'published'
      },
      {
        id: '2',
        title: 'Best Dog Training Tips for Beginners',
        excerpt: 'Start your puppy training journey with these essential tips',
        content: 'Training your dog is one of the most rewarding experiences...',
        category: 'Dog Care',
        author: 'Mark Wilson',
        publishedAt: '2025-01-18',
        status: 'published'
      }
    ];

    setBlogPosts(sampleBlogs);
  }, []);

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
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      image: product.image,
      stockQuantity: product.stockQuantity || 0,
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

  const handleSaveBlog = () => {
    if (!editingBlog) return;

    if (editingBlog.id === 'new') {
      const newBlog = { ...editingBlog, id: Date.now().toString() };
      setBlogPosts([...blogPosts, newBlog]);
      toast({ title: 'Success', description: 'Blog post added successfully!' });
    } else {
      setBlogPosts(blogPosts.map(b => b.id === editingBlog.id ? editingBlog : b));
      toast({ title: 'Success', description: 'Blog post updated successfully!' });
    }

    setEditingBlog(null);
    setShowBlogDialog(false);
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(blogPosts.filter(b => b.id !== blogId));
      toast({ title: 'Success', description: 'Blog post deleted successfully!' });
    }
  };

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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 bg-white border border-gray-200">
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
            <TabsTrigger value="blogs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog Management
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {(categories as any[]).map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
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
                                    {(brands as any[]).find((b: any) => b.id === product.brandId)?.name || 'Unknown Brand'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline">
                                {(categories as any[]).find((c: any) => c.id === product.categoryId)?.name || product.category}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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
                          <Badge variant="outline">{product.brand}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                  <SelectItem value="adult-food">Adult Food</SelectItem>
                  <SelectItem value="kitten-food">Kitten Food</SelectItem>
                  <SelectItem value="collar">Collar</SelectItem>
                  <SelectItem value="clumping-cat-litter">Clumping Cat Litter</SelectItem>
                  <SelectItem value="cat-litter-accessories">Cat Litter Accessories</SelectItem>
                  <SelectItem value="harness">Harness</SelectItem>
                  <SelectItem value="cat-tick-flea-control">Cat Tick & Flea Control</SelectItem>
                  <SelectItem value="deworming-tablet">Deworming Tablet</SelectItem>
                  <SelectItem value="cat-pouches">Cat Pouches</SelectItem>
                  <SelectItem value="sunglass">Sunglass</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Products Management */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products
                          .filter((product: any) => 
                            product.tags?.includes(selectedShopCategory) ||
                            (selectedShopCategory === 'adult-food' && product.categoryId === 'adult-food') ||
                            (selectedShopCategory === 'kitten-food' && product.categoryId === 'kitten-food') ||
                            (selectedShopCategory === 'collar' && product.tags?.includes('collar')) ||
                            (selectedShopCategory === 'clumping-cat-litter' && product.categoryId === 'clumping-cat-litter') ||
                            (selectedShopCategory === 'cat-litter-accessories' && product.categoryId === 'cat-litter-accessories') ||
                            (selectedShopCategory === 'harness' && product.tags?.includes('harness')) ||
                            (selectedShopCategory === 'cat-tick-flea-control' && product.categoryId === 'cat-tick-flea-control') ||
                            (selectedShopCategory === 'deworming-tablet' && product.categoryId === 'deworming-tablet') ||
                            (selectedShopCategory === 'cat-pouches' && product.categoryId === 'cat-pouches') ||
                            (selectedShopCategory === 'sunglass' && product.tags?.includes('sunglass'))
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
                            (selectedShopCategory === 'adult-food' && product.categoryId === 'adult-food') ||
                            (selectedShopCategory === 'kitten-food' && product.categoryId === 'kitten-food') ||
                            (selectedShopCategory === 'collar' && product.tags?.includes('collar')) ||
                            (selectedShopCategory === 'clumping-cat-litter' && product.categoryId === 'clumping-cat-litter') ||
                            (selectedShopCategory === 'cat-litter-accessories' && product.categoryId === 'cat-litter-accessories') ||
                            (selectedShopCategory === 'harness' && product.tags?.includes('harness')) ||
                            (selectedShopCategory === 'cat-tick-flea-control' && product.categoryId === 'cat-tick-flea-control') ||
                            (selectedShopCategory === 'deworming-tablet' && product.categoryId === 'deworming-tablet') ||
                            (selectedShopCategory === 'cat-pouches' && product.categoryId === 'cat-pouches') ||
                            (selectedShopCategory === 'sunglass' && product.tags?.includes('sunglass'))
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
                    <div className="flex flex-wrap gap-2">
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
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      'adult-food', 'kitten-food', 'collar', 'clumping-cat-litter', 
                      'cat-litter-accessories', 'harness', 'cat-tick-flea-control', 
                      'deworming-tablet', 'cat-pouches', 'sunglass'
                    ].map((category) => {
                      const count = products.filter((product: any) => 
                        product.tags?.includes(category) ||
                        (category === 'adult-food' && product.categoryId === 'adult-food') ||
                        (category === 'kitten-food' && product.categoryId === 'kitten-food') ||
                        (category === 'collar' && product.tags?.includes('collar')) ||
                        (category === 'clumping-cat-litter' && product.categoryId === 'clumping-cat-litter') ||
                        (category === 'cat-litter-accessories' && product.categoryId === 'cat-litter-accessories') ||
                        (category === 'harness' && product.tags?.includes('harness')) ||
                        (category === 'cat-tick-flea-control' && product.categoryId === 'cat-tick-flea-control') ||
                        (category === 'deworming-tablet' && product.categoryId === 'deworming-tablet') ||
                        (category === 'cat-pouches' && product.categoryId === 'cat-pouches') ||
                        (category === 'sunglass' && product.tags?.includes('sunglass'))
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Repack Food Management</h2>
                <p className="text-gray-600">Manage repack food products and bulk food items</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingProduct(null);
                  form.reset({
                    ...form.getValues(),
                    tags: 'repack-food',
                  });
                  setShowProductDialog(true);
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Repack Food
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
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
                <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
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
                    {isLoadingProducts ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Loading repack food products...
                        </td>
                      </tr>
                    ) : (
                      (() => {
                        const repackProducts = (products as any[]).filter((product: any) => {
                          const matchesRepack = product.tags?.includes('repack-food') || 
                                              product.tags?.includes('repack') ||
                                              product.name.toLowerCase().includes('repack') ||
                                              product.description?.toLowerCase().includes('repack');
                          const matchesSearch = product.name.toLowerCase().includes(repackSearchTerm.toLowerCase());
                          return matchesRepack && matchesSearch;
                        });

                        return repackProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                              <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-sm">No repack food products found</p>
                              <p className="text-xs mt-1">
                                Add products with "repack-food" tag or containing "repack" in name/description
                              </p>
                            </td>
                          </tr>
                        ) : repackProducts.map((product: any) => (
                          <tr key={product.id} className="hover:bg-orange-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {(brands as any[]).find((b: any) => b.id === product.brandId)?.name || 'Unknown Brand'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className="border-orange-200 text-orange-800">
                                {(categories as any[]).find((c: any) => c.id === product.categoryId)?.name || product.category}
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
                                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" onClick={() => handleEditProduct(product)}>
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
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  Repack Food Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {(products as any[]).filter((p: any) => 
                      p.tags?.includes('repack-food') || 
                      p.tags?.includes('repack') ||
                      p.name.toLowerCase().includes('repack') ||
                      p.description?.toLowerCase().includes('repack')
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Total Repack Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(products as any[]).filter((p: any) => 
                      (p.tags?.includes('repack-food') || 
                       p.tags?.includes('repack') ||
                       p.name.toLowerCase().includes('repack') ||
                       p.description?.toLowerCase().includes('repack')) &&
                      p.isActive !== false
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(products as any[]).filter((p: any) => 
                      (p.tags?.includes('repack-food') || 
                       p.tags?.includes('repack') ||
                       p.name.toLowerCase().includes('repack') ||
                       p.description?.toLowerCase().includes('repack')) &&
                      (p.stockQuantity || p.stock || 0) > 0
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">In Stock</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(products as any[]).filter((p: any) => 
                      (p.tags?.includes('repack-food') || 
                       p.tags?.includes('repack') ||
                       p.name.toLowerCase().includes('repack') ||
                       p.description?.toLowerCase().includes('repack')) &&
                      (p.stockQuantity || p.stock || 0) === 0
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Out of Stock</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

            <div className="grid gap-6">
              {announcements.map((announcement: any) => (
                <Card key={announcement._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Speaker className="w-5 h-5 text-yellow-600" />
                          <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                            {announcement.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl" dangerouslySetInnerHTML={{ __html: parseAnnouncementText(announcement.text) }} />
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
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

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <p className="text-gray-600">Create and manage blog posts</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingBlog({
                    id: 'new',
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'Pet Care',
                    author: user.firstName || 'Admin',
                    publishedAt: new Date().toISOString().split('T')[0],
                    status: 'draft'
                  });
                  setShowBlogDialog(true);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </div>

            <div className="grid gap-6">
              {blogPosts.map((blog) => (
                <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{blog.title}</CardTitle>
                        <CardDescription className="mt-2">{blog.excerpt}</CardDescription>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>By {blog.author}</span>
                          <span>•</span>
                          <span>{blog.publishedAt}</span>
                          <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                            {blog.status}
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
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-900" onClick={() => handleDeleteBlog(blog.id)}>
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
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-3 gap-4">
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
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id} className="text-gray-900 hover:bg-gray-100">
                              {category.name}
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
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-sm mb-2 block">Brand</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                            <SelectValue placeholder="Select brand" className="text-gray-900" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-300">
                          {brands.map((brand: any) => (
                            <SelectItem key={brand.id} value={brand.id} className="text-gray-900 hover:bg-gray-100">
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

              <div className="grid grid-cols-2 gap-4">
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
                        onError={(error) => toast({
                          title: 'Upload Error',
                          description: error,
                          variant: 'destructive',
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
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

      {/* Blog Dialog */}
      <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog?.id === 'new' ? 'Add New Blog Post' : 'Edit Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingBlog?.id === 'new' ? 'Create a new blog post' : 'Update blog post'}
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="blog-category">Category</Label>
                  <Input
                    id="blog-category"
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
                    placeholder="Pet Care"
                    className="text-gray-900 bg-white border-gray-300"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  />
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
                  <Select value={editingBlog.status} onValueChange={(value) => setEditingBlog({...editingBlog, status: value as any})}>
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
    </div>
  );
}