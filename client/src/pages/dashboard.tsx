import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLocation, Link } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Gift, 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  LogOut,
  Wallet,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Star,
  CreditCard,
  Edit,
  Save,
  X
} from 'lucide-react'

interface Order {
  id: string
  date: string
  status: 'delivered' | 'pending' | 'processing'
  total: number
  items: { name: string; quantity: number; price: number }[]
}

interface UserStats {
  totalSpent: number
  walletBalance: number
  wishlistCount: number
  deliveredOrders: number
  pendingOrders: number
  processingOrders: number
  activeCoupons: number
  requestedProducts: number
}

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function DashboardPage() {
  const { user, signOut, updateProfile } = useAuth()
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Profile form - moved to top level to avoid hooks rules violation
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    }
  })

  // Update form defaults when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      })
    }
  }, [user, profileForm])

  const [userStats, setUserStats] = useState<UserStats>({
    totalSpent: 1250.50,
    walletBalance: 0,
    wishlistCount: 15,
    deliveredOrders: 8,
    pendingOrders: 2,
    processingOrders: 1,
    activeCoupons: 4,
    requestedProducts: 0
  })

  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  // Fetch user orders and invoices
  useEffect(() => {
    if (user?.id) {
      // Fetch orders
      fetch(`/api/orders/user/${user.id}`)
        .then(res => res.json())
        .then(orders => {
          const formattedOrders = orders.map((order: any) => ({
            id: order._id,
            date: new Date(order.createdAt).toISOString().split('T')[0],
            status: order.status.toLowerCase(),
            total: order.total,
            items: order.items || []
          }))
          setRecentOrders(formattedOrders)
        })
        .catch(err => console.error('Failed to fetch orders:', err))
    } else {
      // Demo data for non-logged in users
      setRecentOrders([
        {
          id: 'ORD-2025-001',
          date: '2025-01-27',
          status: 'delivered',
          total: 89.99,
          items: [
            { name: 'Royal Canin Cat Food 2kg', quantity: 1, price: 45.99 },
            { name: 'Cat Interactive Toy', quantity: 2, price: 22.00 }
          ]
        },
        {
          id: 'ORD-2025-002',
          date: '2025-01-25',
          status: 'processing',
          total: 156.50,
          items: [
            { name: 'Premium Dog Food 5kg', quantity: 1, price: 78.50 },
            { name: 'Dog Grooming Kit', quantity: 1, price: 78.00 }
          ]
        },
        {
          id: 'ORD-2025-003',
          date: '2025-01-20',
          status: 'pending',
          total: 234.75,
          items: [
            { name: 'Cat Litter Premium 10kg', quantity: 2, price: 89.90 },
            { name: 'Cat Tree Large', quantity: 1, price: 144.85 }
          ]
        }
      ])
    }
  }, [user])
  
  useEffect(() => {
    if (!user) {
      setLocation('/sign-in')
    }
  }, [user, setLocation])

  if (!user) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'pending': return <Truck className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setLocation('/')
  }

  const menuItems = [
    { key: 'dashboard', icon: <User className="h-4 w-4" />, label: 'Dashboard' },
    { key: 'profile', icon: <User className="h-4 w-4" />, label: 'My Profile' },
    { key: 'orders', icon: <ShoppingBag className="h-4 w-4" />, label: 'My Orders' },
    { key: 'wishlist', icon: <Heart className="h-4 w-4" />, label: 'My Wishlist' },
    { key: 'requests', icon: <MessageCircle className="h-4 w-4" />, label: 'Track Requests' },
    { key: 'address', icon: <MapPin className="h-4 w-4" />, label: 'My Address' },
    { key: 'coupons', icon: <Gift className="h-4 w-4" />, label: 'My Coupons' },
    { key: 'rewards', icon: <Star className="h-4 w-4" />, label: 'Reward Points' },
    { key: 'refer', icon: <User className="h-4 w-4" />, label: 'Refer a Friend' },
    { key: 'newsletter', icon: <MessageCircle className="h-4 w-4" />, label: 'Newsletters' },
    { key: 'savings', icon: <CreditCard className="h-4 w-4" />, label: 'Savings Plan' },
  ]

  const helpItems = [
    { key: 'faq', icon: <HelpCircle className="h-4 w-4" />, label: 'FAQ' },
    { key: 'call', icon: <Phone className="h-4 w-4" />, label: 'Call to Order' },
    { key: 'support', icon: <MessageCircle className="h-4 w-4" />, label: 'Customer Support' },
    { key: 'chat', icon: <MessageCircle className="h-4 w-4" />, label: 'Chat in Messenger' },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
          <AvatarImage src="/api/placeholder/64/64" />
          <AvatarFallback className="bg-green-100 text-green-800 text-sm sm:text-lg">
            {user.firstName?.[0] || user.name?.[0] || user.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Hello {user.firstName || user.name || 'User'}!</h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            From your account dashboard you can easily manage your profile by checking your orders history, 
            reward points lists, your wishlists, coupons info
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-1">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">TOTAL SPENT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">${userStats.totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">TOTAL WALLET</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{userStats.walletBalance}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-400 to-rose-500 text-white">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium">TOTAL WISHLIST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{userStats.wishlistCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-1">
        <Card className="text-center">
          <CardHeader className="pb-1 sm:pb-2">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto" />
            <CardTitle className="text-xs sm:text-sm text-gray-600">DELIVERED ORDER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{userStats.deliveredOrders}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-1 sm:pb-2">
            <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto" />
            <CardTitle className="text-xs sm:text-sm text-gray-600">PENDING ORDER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{userStats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-1 sm:pb-2">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mx-auto" />
            <CardTitle className="text-xs sm:text-sm text-gray-600">PROCESSING ORDER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{userStats.processingOrders}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-1 sm:pb-2">
            <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto" />
            <CardTitle className="text-xs sm:text-sm text-gray-600">ACTIVE COUPON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{userStats.activeCoupons}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center">
        <CardHeader className="pb-1 sm:pb-2">
          <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 mx-auto" />
          <CardTitle className="text-xs sm:text-sm text-gray-600">REQUEST PRODUCT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{userStats.requestedProducts}</div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Orders</h2>
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{order.id}</h3>
                <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(order.status)} mb-2`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </Badge>
                <p className="font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-2">
              <Link href={`/invoice/${order.id}`}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
              <Link href={`/track-order/${order.id}`}>
                <Button variant="outline" size="sm">Track Order</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const onProfileSubmit = async (data: ProfileFormData) => {
    const result = await updateProfile(data);
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditingProfile(false);
    } else {
      toast({
        title: "Update Failed",
        description: result.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderProfile = () => {

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Profile</h2>
          {!isEditingProfile && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} data-testid="button-edit-profile">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                  {user.firstName?.[0] || user.name?.[0] || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}</h3>
                <p className="text-gray-600 truncate break-all">{user.email || ''}</p>
              </div>
            </div>
            
            <Separator />
            
            {isEditingProfile ? (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-firstName" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-lastName" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={profileForm.formState.isSubmitting} data-testid="button-save-profile">
                      <Save className="h-4 w-4 mr-2" />
                      {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)} data-testid="button-cancel-edit">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1" data-testid="text-firstName">{user.firstName || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1" data-testid="text-lastName">{user.lastName || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 truncate break-all" data-testid="text-email">{user.email || ''}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1">January 2025</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'orders':
        return renderOrders()
      case 'profile':
        return renderProfile()
      case 'wishlist':
        return <div><h2 className="text-2xl font-bold">My Wishlist</h2><p>Your saved items will appear here.</p></div>
      default:
        return <div><h2 className="text-2xl font-bold">Coming Soon</h2><p>This feature is under development.</p></div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-1">
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <Card className="p-3 sm:p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6">
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {user.firstName?.[0] || user.name?.[0] || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{user.firstName || user.name || 'User'}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.email || ''}</p>
                </div>
              </div>


              {/* Navigation */}
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 mb-3">My Account</h4>
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left hover:bg-gray-100 ${
                      activeSection === item.key ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}

                <Separator className="my-4" />

                <h4 className="font-semibold text-gray-700 mb-3">Help</h4>
                {helpItems.map((item) => (
                  <button
                    key={item.key}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg text-left hover:bg-gray-100 text-gray-700"
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}

                <Separator className="my-4" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg text-left hover:bg-red-50 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Card className="p-3 sm:p-6">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}