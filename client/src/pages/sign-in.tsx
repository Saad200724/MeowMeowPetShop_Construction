import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, PawPrint, Shield } from 'lucide-react'
const logoPath = '/logo.png'

export default function SignInPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [adminFormData, setAdminFormData] = useState({
    username: '',
    password: ''
  })
  const { toast } = useToast()
  const { user, refreshAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else if (data?.user) {
        // Refresh auth state to ensure UI updates
        refreshAuth()
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        })
        
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          setLocation('/')
        }, 100)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAdminInputChange = (field: string, value: string) => {
    setAdminFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check admin credentials
      if (adminFormData.username === 'admin' && adminFormData.password === 'admin123') {
        const adminUser = {
          id: 'admin-123',
          email: 'admin@meowmeowpetshop.com',
          name: 'Admin',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        }
        
        localStorage.setItem('auth_user', JSON.stringify(adminUser))
        
        // Refresh auth state immediately
        refreshAuth()
        
        toast({
          title: 'Admin Login Successful',
          description: 'Welcome to admin panel!',
        })
        
        // Small delay to ensure auth state is updated, then redirect
        setTimeout(() => {
          setLocation('/admin')
        }, 100)
      } else {
        toast({
          title: 'Invalid Credentials',
          description: 'Please check your admin username and password.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(38,115,45,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-meow-green hover:text-meow-green-dark hover:bg-green-50 p-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <img 
                  src={logoPath} 
                  alt="Meow Meow Pet Shop Logo" 
                  className="h-16 w-16 rounded-full object-cover border-3 border-meow-green shadow-lg"
                />
              </Link>
            </div>
            
            <CardTitle className="text-3xl font-bold text-meow-green">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Sign in to your Meow Meow Pet Shop account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-meow-green font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-meow-green font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/forgot-password">
                  <Button variant="link" className="text-meow-green hover:text-meow-green-dark p-0 h-auto">
                    Forgot your password?
                  </Button>
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-meow-yellow to-yellow-400 hover:from-yellow-400 hover:to-meow-yellow text-meow-green-dark font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-meow-green-dark border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link href="/sign-up">
                <Button variant="outline" className="w-full h-12 border-meow-green text-meow-green hover:bg-green-50 hover:border-meow-green-dark hover:text-meow-green-dark font-semibold">
                  Create New Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Admin Login Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-green-50 via-white to-yellow-50 text-gray-500">or</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              variant="outline"
              className="w-full h-12 border-2 border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 focus:!bg-white focus:!border-red-200 focus:!text-red-600 active:!bg-white active:!text-red-600 font-semibold"
            >
              <Shield className="w-5 h-5 mr-2" />
              {showAdminLogin ? 'Hide Admin Login' : 'Admin Login'}
            </Button>
          </div>

          {/* Admin Login Form */}
          {showAdminLogin && (
            <Card className="mt-4 shadow-lg border-2 border-red-100 bg-red-50/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-red-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Access
                </CardTitle>
                <CardDescription className="text-red-500">
                  Authorized personnel only
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  {/* Admin Username */}
                  <div className="space-y-2">
                    <Label htmlFor="admin-username" className="text-red-600 font-medium">
                      Username
                    </Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Enter admin username"
                      value={adminFormData.username}
                      onChange={(e) => handleAdminInputChange('username', e.target.value)}
                      className="h-10 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      required
                    />
                  </div>

                  {/* Admin Password */}
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-red-600 font-medium">
                      Password
                    </Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminFormData.password}
                      onChange={(e) => handleAdminInputChange('password', e.target.value)}
                      className="h-10 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      required
                    />
                  </div>

                  {/* Admin Login Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing In...
                      </div>
                    ) : (
                      'Access Admin Panel'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2025 Meow Meow Pet Shop. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy">
              <Button variant="link" className="text-gray-500 hover:text-meow-green p-0 h-auto text-sm">
                Privacy Policy
              </Button>
            </Link>
            <span>•</span>
            <Link href="/terms">
              <Button variant="link" className="text-gray-500 hover:text-meow-green p-0 h-auto text-sm">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}