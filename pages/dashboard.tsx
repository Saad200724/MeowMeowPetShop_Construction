import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useLocation, Link } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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
  CreditCard
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

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [, setLocation] = useLocation()
  const [activeSection, setActiveSection] = useState('dashboard')

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

  const [recentOrders, setRecentOrders] = useState<Order[]>([
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
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/api/placeholder/64/64" />
          <AvatarFallback className="bg-green-100 text-green-800 text-lg">
            {user.firstName?.[0] || user.name?.[0] || user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">Hello {user.firstName || user.name || 'User'}!</h2>
          <p className="text-gray-600">
            From your account dashboard you can easily manage your profile by checking your orders history, 
            reward points lists, your wishlists, coupons info
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">TOTAL SPENT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${userStats.totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">TOTAL WALLET</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.walletBalance}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-400 to-rose-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">TOTAL WISHLIST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.wishlistCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
            <CardTitle className="text-sm text-gray-600">DELIVERED ORDER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.deliveredOrders}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Truck className="h-8 w-8 text-blue-600 mx-auto" />
            <CardTitle className="text-sm text-gray-600">PENDING ORDER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto" />
            <CardTitle className="text-sm text-gray-600">PROCESSING ORDER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.processingOrders}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Gift className="h-8 w-8 text-purple-600 mx-auto" />
            <CardTitle className="text-sm text-gray-600">ACTIVE COUPON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.activeCoupons}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center">
        <CardHeader className="pb-2">
          <MessageCircle className="h-8 w-8 text-indigo-600 mx-auto" />
          <CardTitle className="text-sm text-gray-600">REQUEST PRODUCT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.requestedProducts}</div>
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
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Track Order</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                {user.firstName?.[0] || user.name?.[0] || user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Button variant="outline" size="sm">Edit Profile</Button>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1">{user.firstName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1">{user.lastName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1">January 2025</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <Card className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6">
                <Avatar>
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {user.firstName?.[0] || user.name?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.firstName || user.name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
                <div className="w-16 h-16 bg-gray-300 mx-auto mb-2 rounded"></div>
                <p className="text-xs text-gray-600">Scan QR for mobile app</p>
                <Button variant="outline" size="sm" className="mt-2">Manage Rewards</Button>
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
          <div className="flex-1">
            <Card className="p-6">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}