import { useState, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Camera, User, Package, Settings, Edit, Save, X, ArrowLeft } from 'lucide-react'
import { Link } from 'wouter'

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    username: user?.username || ''
  })

  // Mock purchase history data (replace with real API call)
  const purchaseHistory = [
    {
      id: '1',
      date: '2025-08-05',
      status: 'Delivered',
      total: 2150,
      items: [
        { name: 'Premium Cat Food', quantity: 2, price: 1850 },
        { name: 'Cat Toy Mouse', quantity: 1, price: 300 }
      ]
    },
    {
      id: '2',
      date: '2025-07-28',
      status: 'Processing',
      total: 3200,
      items: [
        { name: 'Dog Food Large Bag', quantity: 1, price: 2100 },
        { name: 'Dog Leash', quantity: 1, price: 650 },
        { name: 'Dog Bowl Set', quantity: 1, price: 450 }
      ]
    },
    {
      id: '3',
      date: '2025-07-15',
      status: 'Shipped',
      total: 850,
      items: [
        { name: 'Cat Litter Premium', quantity: 1, price: 850 }
      ]
    }
  ]

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive'
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string)
        toast({
          title: 'Profile picture updated',
          description: 'Your new profile picture has been saved'
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    try {
      // Here you would make an API call to update the user profile
      // const response = await apiRequest('PATCH', `/api/auth/profile/${user?.id}`, editForm)
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved successfully'
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please sign in to access your profile</p>
            <div className="mt-4 flex justify-center">
              <Link href="/sign-in">
                <Button className="bg-[#26732d] hover:bg-[#1d5624] text-white">Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-[#26732d] hover:text-[#1d5624] hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="mb-6 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#26732d] to-[#1d5624] flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden border-4 border-white">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (user.firstName?.[0] || user.username?.[0] || user.email?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-[#ffde59] border-[#ffde59] hover:bg-[#ffd700] text-[#26732d]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#26732d]">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.username || 'User'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <Badge className="mt-2 bg-[#26732d] text-white hover:bg-[#1d5624]">
                  Active Member
                </Badge>
              </div>

              {/* Edit Button */}
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing 
                  ? "!border-[#26732d] !text-[#26732d] !bg-white hover:!bg-green-50" 
                  : "!bg-[#26732d] hover:!bg-[#1d5624] !text-white"
                }
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 data-[state=active]:bg-[#26732d] data-[state=active]:text-white text-gray-700 hover:text-[#26732d]"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex items-center space-x-2 data-[state=active]:bg-[#26732d] data-[state=active]:text-white text-gray-700 hover:text-[#26732d]"
            >
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 data-[state=active]:bg-[#26732d] data-[state=active]:text-white text-gray-700 hover:text-[#26732d]"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#26732d]">Personal Information</CardTitle>
                <CardDescription className="text-gray-600">
                  {isEditing ? 'Update your personal details below' : 'Your current profile information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-[#26732d] font-medium">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-600">{user.firstName || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-[#26732d] font-medium">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-600">{user.lastName || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-[#26732d] font-medium">Username</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        className="border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-600">{user.username}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#26732d] font-medium">Email</Label>
                    <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#26732d] font-medium">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="border-gray-300 focus:border-[#26732d] focus:ring-[#26732d]"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-600">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="!border-[#26732d] !text-[#26732d] !bg-white hover:!bg-green-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-[#26732d] hover:bg-[#1d5624] text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#26732d]">Purchase History</CardTitle>
                <CardDescription className="text-gray-600">View all your past orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {purchaseHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No orders found</p>
                    <p className="text-sm text-gray-500 mb-4">Start shopping to see your orders here</p>
                    <Link href="/products">
                      <Button className="bg-[#26732d] hover:bg-[#1d5624] text-white">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseHistory.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-[#26732d] bg-white/80 backdrop-blur-sm shadow-md">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-[#26732d]">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="font-semibold mt-1 text-[#26732d]">৳{order.total}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>৳{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#26732d]">Account Settings</CardTitle>
                <CardDescription className="text-gray-600">Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-[#26732d]">Email Notifications</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="rounded border-gray-300 text-[#26732d] focus:ring-[#26732d]" 
                        />
                        <span className="text-sm text-gray-700">Order updates</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="rounded border-gray-300 text-[#26732d] focus:ring-[#26732d]" 
                        />
                        <span className="text-sm text-gray-700">Promotional offers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="rounded border-gray-300 text-[#26732d] focus:ring-[#26732d]" 
                        />
                        <span className="text-sm text-gray-700">New product announcements</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium mb-2 text-[#26732d]">Account Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#26732d] text-[#26732d] hover:bg-green-50"
                      >
                        Change Password
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#26732d] text-[#26732d] hover:bg-green-50"
                      >
                        Download My Data
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}