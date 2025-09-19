import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { sendOtp } from '@/lib/supabase'
import { OtpVerification } from '@/components/ui/otp-verification'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowLeft, PawPrint, User, Loader2, Lock } from 'lucide-react'
const logoPath = '/logo.png'

export default function SignUpPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the Terms of Service and Privacy Policy',
        variant: 'destructive',
      })
      return
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your first and last name',
        variant: 'destructive',
      })
      return
    }

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
        description: 'Please enter a password',
        variant: 'destructive',
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure both passwords match',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // First, register the user with password validation
      console.log('Registering user...')
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // Use email as username
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      })

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json()
        toast({
          title: 'Registration Failed',
          description: errorData.message || 'Failed to create account',
          variant: 'destructive',
        })
        return
      }

      // If registration successful, send OTP for verification
      console.log('Registration successful, sending OTP...')
      const result = await sendOtp(formData.email, true) // true = isSignUp
      
      console.log('OTP send result:', result)
      
      if (result.error) {
        console.error('OTP send error:', result.error)
        
        // Check if it's a rate limit error - if so, use fallback authentication
        if (result.error.code === 'over_email_send_rate_limit' || 
            result.error.message?.includes('rate limit')) {
          
          // Complete registration without OTP verification
          const authUser = {
            id: Date.now().toString(),
            username: formData.email,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`,
            role: 'user'
          }
          
          localStorage.setItem('meow_meow_auth_user', JSON.stringify(authUser))
          console.log('Registration completed using fallback authentication:', authUser)
          
          toast({
            title: 'Account Created Successfully! 🎉',
            description: 'Welcome to Meow Meow Pet Shop! You can start shopping now.',
          })
          
          // Redirect to home page
          window.location.href = '/'
          return
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
          title: 'Account Created! 🎉',
          description: 'Please check your email for the verification code to complete signup.',
        })
        setShowOtpVerification(true)
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error)
      toast({
        title: 'Network Error',
        description: 'Unable to create account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOtpSuccess = (user: any) => {
    console.log('OTP verification successful:', user)
    
    // Store user in the custom auth system's localStorage
    const authUser = {
      id: user.id,
      username: user.email?.split('@')[0] || 'user',
      email: user.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}` || user.email?.split('@')[0] || 'User',
      role: user.user_metadata?.role || 'user'
    }
    
    localStorage.setItem('meow_meow_auth_user', JSON.stringify(authUser))
    console.log('User stored in localStorage for header display:', authUser)
    
    toast({
      title: 'Welcome to Meow Meow Pet Shop! 🐾',
      description: 'Your account has been created successfully.',
    })
    
    // Trigger a page refresh to ensure the header updates with the new auth state
    window.location.href = '/'
  }

  const handleBackToSignUp = () => {
    setShowOtpVerification(false)
  }

  // Show OTP verification component if needed
  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <OtpVerification
          email={formData.email}
          isSignUp={true}
          onSuccess={handleOtpSuccess}
          onBack={handleBackToSignUp}
        />
      </div>
    )
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
              Join Our Pack
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Create your Meow Meow Pet Shop account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-meow-green font-medium text-sm">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-9 h-11 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20 text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-meow-green font-medium text-sm">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="pl-9 h-11 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

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
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20"
                    required
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-meow-green font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>


              {/* Terms Agreement */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-0.5 border-gray-300 data-[state=checked]:bg-meow-green data-[state=checked]:border-meow-green"
                />
                <div className="text-sm text-gray-600 leading-relaxed">
                  <Label htmlFor="terms" className="cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms">
                      <Button variant="link" className="text-meow-green hover:text-meow-green-dark p-0 h-auto text-sm underline">
                        Terms of Service
                      </Button>
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy">
                      <Button variant="link" className="text-meow-green hover:text-meow-green-dark p-0 h-auto text-sm underline">
                        Privacy Policy
                      </Button>
                    </Link>
                  </Label>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full h-12 bg-gradient-to-r from-meow-yellow to-yellow-400 hover:from-yellow-400 hover:to-meow-yellow text-meow-green-dark font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-meow-green-dark border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link href="/sign-in">
                <Button variant="outline" className="w-full h-12 border-meow-green text-meow-green hover:bg-green-50 hover:border-meow-green-dark hover:text-meow-green-dark font-semibold">
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2025 Meow Meow Pet Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}