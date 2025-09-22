import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sendOtp } from '@/lib/supabase'
import { OtpVerification } from '@/components/ui/otp-verification'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { Mail, ArrowLeft, PawPrint, Loader2, Lock, Shield, User } from 'lucide-react'
const logoPath = '/logo.png'

export default function SignInPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [adminFormData, setAdminFormData] = useState({
    username: '',
    password: ''
  })
  const [showAdminAccess, setShowAdminAccess] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      })
      return
    }

    if (!formData.password.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter your password',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // First, validate email and password
      console.log('Validating credentials...')
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json()
        toast({
          title: 'Sign In Failed',
          description: errorData.message || 'Invalid email or password',
          variant: 'destructive',
        })
        return
      }

      // If login successful, send OTP for additional verification
      console.log('Credentials validated, sending OTP...')
      const result = await sendOtp(formData.email, false) // false = isSignIn
      
      console.log('OTP send result:', result)
      
      if (result.error) {
        console.error('OTP send error:', result.error)
        
        // Check if it's a rate limit error
        if (result.error.code === 'over_email_send_rate_limit' || 
            result.error.message?.includes('rate limit')) {
          toast({
            title: 'Too Many Attempts',
            description: 'Please wait 5-10 minutes before trying again, or use direct login below.',
            variant: 'destructive',
          })
          
          // Enable fallback authentication for rate limit cases
          try {
            const fallbackResult = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.email,
                password: formData.password
              }),
            })

            if (fallbackResult.ok) {
              const data = await fallbackResult.json()
              localStorage.setItem('meow_meow_auth_user', JSON.stringify(data.user))
              toast({
                title: 'Sign In Successful!',
                description: 'Logged in using direct authentication.',
              })
              setLocation('/')
              return
            }
          } catch (fallbackError) {
            console.error('Fallback auth failed:', fallbackError)
          }
        } else {
          toast({
            title: 'Verification Failed',
            description: result.error.message || 'Failed to send verification code',
            variant: 'destructive',
          })
        }
      } else {
        console.log('OTP sent successfully')
        toast({
          title: 'Verification Code Sent! 📧',
          description: 'Please check your email for the 6-digit code to complete sign in.',
        })
        setShowOtpVerification(true)
      }
    } catch (error) {
      console.error('Unexpected error during signin:', error)
      toast({
        title: 'Network Error',
        description: 'Unable to sign in. Please try again.',
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
    
    if (!adminFormData.username.trim()) {
      toast({
        title: 'Username Required',
        description: 'Please enter admin username',
        variant: 'destructive',
      })
      return
    }

    if (!adminFormData.password.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter admin password',
        variant: 'destructive',
      })
      return
    }

    // Check admin credentials
    if (adminFormData.username !== 'admin' || adminFormData.password !== 'admin123') {
      toast({
        title: 'Invalid Admin Credentials',
        description: 'Incorrect username or password',
        variant: 'destructive',
      })
      return
    }

    setAdminLoading(true)

    try {
      // Create admin user object
      const adminUser = {
        id: 'admin',
        username: 'admin',
        email: 'admin@meowmeowpetshop.com',
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
        role: 'admin'
      }
      
      localStorage.setItem('meow_meow_auth_user', JSON.stringify(adminUser))
      
      toast({
        title: 'Admin Login Successful!',
        description: 'Welcome to the admin panel.',
      })
      
      // Small delay to ensure localStorage is written, then redirect
      setTimeout(() => {
        window.location.href = '/admin'
      }, 100)
    } catch (error) {
      console.error('Admin login error:', error)
      toast({
        title: 'Login Error',
        description: 'An error occurred during admin login.',
        variant: 'destructive',
      })
    } finally {
      setAdminLoading(false)
    }
  }

  const handleOtpSuccess = (user: any) => {
    console.log('OTP verification successful:', user)
    
    // Store user in the custom auth system's localStorage
    const authUser = {
      id: user.id,
      username: user.email?.split('@')[0] || 'user',
      email: user.email,
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      role: user.user_metadata?.role || 'user'
    }
    
    localStorage.setItem('meow_meow_auth_user', JSON.stringify(authUser))
    console.log('User stored in localStorage for header display:', authUser)
    
    toast({
      title: 'Welcome back!',
      description: 'You have successfully signed in.',
    })
    
    // Trigger a page refresh to ensure the header updates with the new auth state
    window.location.href = '/'
  }

  const handleBackToSignIn = () => {
    setShowOtpVerification(false)
  }

  // Show OTP verification component if needed
  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <OtpVerification
          email={formData.email}
          isSignUp={false}
          onSuccess={handleOtpSuccess}
          onBack={handleBackToSignIn}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(38,115,45,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Button */}
        <div className="mb-3 sm:mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-meow-green hover:text-meow-green-dark hover:bg-green-50 p-2 text-sm">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6 pt-4 sm:pt-6">
            {/* Logo */}
            <div className="flex justify-center mb-2 sm:mb-4">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <img 
                  src={logoPath} 
                  alt="Meow Meow Pet Shop Logo" 
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-3 border-meow-green shadow-lg"
                />
              </Link>
            </div>
            
            <CardTitle className="text-2xl sm:text-3xl font-bold text-meow-green">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 text-base sm:text-lg">
              Enter your email and password to sign in
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
              {/* Email Field */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-meow-green font-medium text-sm sm:text-base">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20 text-sm sm:text-base"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-meow-green font-medium text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20 text-sm sm:text-base"
                    required
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Send Code Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-meow-yellow to-yellow-400 hover:from-yellow-400 hover:to-meow-yellow text-meow-green-dark font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="button-send-code"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Sending Code...
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
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link href="/sign-up">
                <Button variant="outline" className="w-full h-10 sm:h-12 border-meow-green text-meow-green hover:bg-green-50 hover:border-meow-green-dark hover:text-meow-green-dark font-semibold text-sm sm:text-base">
                  Create New Account
                </Button>
              </Link>
            </div>

            {/* Admin Access Toggle */}
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowAdminAccess(!showAdminAccess)}
                className="w-full h-8 sm:h-10 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium text-xs sm:text-sm"
                data-testid="button-toggle-admin"
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {showAdminAccess ? 'Hide Admin Access' : 'Admin Access'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Login Section */}
        {showAdminAccess && (
        <Card className="shadow-2xl border-0 bg-gradient-to-r from-orange-50 to-red-50 backdrop-blur-sm mt-4 sm:mt-6">
          <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6 pt-3 sm:pt-4">
            <div className="flex justify-center mb-1 sm:mb-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-orange-600">
              Admin Access
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base">
              Login with admin credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-3 sm:pb-4">
            <form onSubmit={handleAdminSubmit} className="space-y-2 sm:space-y-3">
              {/* Username Field */}
              <div className="space-y-1">
                <Label htmlFor="admin-username" className="text-orange-600 font-medium text-sm">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="Enter admin username"
                    value={adminFormData.username}
                    onChange={(e) => handleAdminInputChange('username', e.target.value)}
                    className="pl-9 h-9 sm:h-10 border-orange-200 focus:border-orange-300 focus:ring-orange-200/20 text-sm"
                    required
                    data-testid="input-admin-username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Label htmlFor="admin-password" className="text-orange-600 font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminFormData.password}
                    onChange={(e) => handleAdminInputChange('password', e.target.value)}
                    className="pl-9 h-9 sm:h-10 border-orange-200 focus:border-orange-300 focus:ring-orange-200/20 text-sm"
                    required
                    data-testid="input-admin-password"
                  />
                </div>
              </div>

              {/* Admin Login Button */}
              <Button
                type="submit"
                disabled={adminLoading}
                className="w-full h-9 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="button-admin-login"
              >
                {adminLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm">
          <p>© 2025 Meow Meow Pet Shop. All rights reserved.</p>
          <div className="flex justify-center space-x-2 sm:space-x-4 mt-1 sm:mt-2">
            <Link href="/privacy">
              <Button variant="link" className="text-gray-500 hover:text-meow-green p-0 h-auto text-xs sm:text-sm">
                Privacy Policy
              </Button>
            </Link>
            <span>•</span>
            <Link href="/terms">
              <Button variant="link" className="text-gray-500 hover:text-meow-green p-0 h-auto text-xs sm:text-sm">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}