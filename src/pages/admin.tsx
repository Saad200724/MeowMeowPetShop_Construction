import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, Package, DollarSign, ShoppingCart, Trash2, ArrowLeft, Shield, 
  Search, Filter, MoreVertical, Edit, Eye, Plus, TrendingUp, 
  BarChart3, Settings, Bell, Activity, Calendar, Star,
  Grid, List, ChevronDown, Download, Upload, RefreshCw
} from 'lucide-react'
import { Link } from 'wouter'
import { queryClient } from '@/lib/queryClient'

const apiRequest = async (method: string, url: string, data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(data && { body: JSON.stringify(data) }),
  }

  const response = await fetch(url, options)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(errorData.message || 'Request failed')
  }

  return response.json()
}

interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
}

interface User {
  id: string
  username: string
  email?: string
  firstName?: string
  lastName?: string
  role: string
  isActive: boolean
  createdAt: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  image: string
  rating: number
  sales: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: string
}

export default function AdminPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  useEffect(() => {
    if (user && (user as any).role === 'admin') {
      fetchAdminData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch admin stats
      const statsResponse = await apiRequest('POST', '/api/admin/stats', { userId: user?.id })
      setStats(statsResponse)

      // Fetch all users
      const usersResponse = await apiRequest('POST', '/api/admin/users', { userId: user?.id })
      setUsers(usersResponse)

      // Generate sample products data for demo
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Cat Food - Adult Formula',
          description: 'High-quality nutrition for adult cats',
          price: 2500,
          category: 'Cat Food',
          brand: 'Reflex',
          stock: 150,
          image: '/api/placeholder/200/200',
          rating: 4.8,
          sales: 89,
          status: 'active',
          createdAt: '2025-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Interactive Cat Toy - Feather Wand',
          description: 'Engaging toy for active play',
          price: 450,
          category: 'Cat Toys',
          brand: 'PetPlay',
          stock: 75,
          image: '/api/placeholder/200/200',
          rating: 4.6,
          sales: 156,
          status: 'active',
          createdAt: '2025-01-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'Dog Food - Puppy Formula',
          description: 'Specially formulated for growing puppies',
          price: 3200,
          category: 'Dog Food',
          brand: 'Reflex',
          stock: 0,
          image: '/api/placeholder/200/200',
          rating: 4.9,
          sales: 203,
          status: 'out_of_stock',
          createdAt: '2025-01-08T00:00:00Z'
        },
        {
          id: '4',
          name: 'Premium Cat Litter - Clumping',
          description: 'Superior odor control and easy cleanup',
          price: 1800,
          category: 'Cat Litter',
          brand: 'CleanPaws',
          stock: 89,
          image: '/api/placeholder/200/200',
          rating: 4.7,
          sales: 134,
          status: 'active',
          createdAt: '2025-01-05T00:00:00Z'
        }
      ]
      setProducts(sampleProducts)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch admin data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return
    }

    try {
      await apiRequest('DELETE', `/api/admin/users/${userId}`, { userId: user?.id })
      
      toast({
        title: 'Success',
        description: `User "${username}" has been deleted`
      })

      // Refresh users list
      fetchAdminData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#26732d] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || (user as any).role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access the admin panel</p>
            <Link href="/">
              <Button className="bg-[#26732d] hover:bg-[#1d5624] text-white">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                Meow Meow Pet Shop
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="ghost" className="text-slate-600">
                <Bell className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-600">
                <Settings className="w-4 h-4" />
              </Button>
              <Link href="/">
                <Button size="sm" variant="outline" className="text-slate-600 border-slate-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Users</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Products</p>
                        <p className="text-3xl font-bold text-slate-900">{products.length}</p>
                        <p className="text-xs text-green-600 mt-1">+5 new this week</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Orders</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
                        <p className="text-xs text-red-600 mt-1">-2% from last month</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900">৳{stats.totalRevenue}</p>
                        <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">New user registered</p>
                      <p className="text-xs text-slate-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">New order received</p>
                      <p className="text-xs text-slate-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Product stock updated</p>
                      <p className="text-xs text-slate-500">1 hour ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Top Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800 truncate w-32">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">{product.sales} sales</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        #{product.sales}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Product Management</h2>
                <p className="text-slate-600">Manage your product catalog</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase tracking-wide border-b pb-2">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-1">Price</div>
                      <div className="col-span-1">Stock</div>
                      <div className="col-span-1">Sales</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    {products.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-100 hover:bg-slate-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-slate-900">{product.name}</h3>
                            <p className="text-sm text-slate-500">by {product.brand}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <div className="col-span-1">
                          <span className="font-medium">৳{product.price}</span>
                        </div>
                        <div className="col-span-1">
                          <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                            {product.stock}
                          </span>
                        </div>
                        <div className="col-span-1">
                          <span className="text-slate-600">{product.sales}</span>
                        </div>
                        <div className="col-span-1">
                          <Badge
                            className={
                              product.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge
                              className={
                                product.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : product.status === 'inactive'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {product.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-slate-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-slate-500 mb-2">by {product.brand}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900">৳{product.price}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-slate-600">{product.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Stock: {product.stock}</span>
                            <span>{product.sales} sales</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                <p className="text-slate-600">Manage registered users</p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Export Users
              </Button>
            </div>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase tracking-wide border-b pb-2">
                      <div className="col-span-4">User</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Joined</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    {users.map((userData) => (
                      <div key={userData.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-100 hover:bg-slate-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {(userData.firstName?.[0] || userData.username?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {userData.firstName && userData.lastName
                                ? `${userData.firstName} ${userData.lastName}`
                                : userData.username}
                            </h3>
                            <p className="text-sm text-slate-500">{userData.email}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge
                            className={
                              userData.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {userData.role}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Badge
                            className={
                              userData.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-slate-600">
                            {new Date(userData.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {userData.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteUser(userData.id, userData.username)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
                <p className="text-slate-600">Track your business performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">Chart placeholder - Sales data visualization</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Top Categories</CardTitle>
                  <CardDescription>Best performing product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cat Food</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-sm text-slate-600">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dog Food</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full w-3/5"></div>
                        </div>
                        <span className="text-sm text-slate-600">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cat Toys</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full w-2/5"></div>
                        </div>
                        <span className="text-sm text-slate-600">40%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cat Litter</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-sm text-slate-600">33%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}