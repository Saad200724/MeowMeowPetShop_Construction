import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { signUp, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowLeft, User, Loader2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SiGoogle } from 'react-icons/si'

const logoPath = '/logo.png'

export default function SignUpPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { toast } = useToast()

  const passwordStrength = formData.password.length >= 6 ? 'good' : formData.password.length >= 3 ? 'fair' : 'weak'

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
      const { error } = await signUp(formData.email, formData.password)

      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Account Created!',
          description: 'Your account has been successfully created. You can now sign in.',
        })
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        setLocation('/sign-in')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast({
        title: 'Network Error',
        description: 'Unable to create account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-200 to-transparent dark:from-green-900 dark:to-transparent opacity-30 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-30 blur-3xl rounded-full -ml-48 -mb-48 pointer-events-none" />

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center justify-center gap-3">
            <img src={logoPath} alt="Meow Meow Pet Shop" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                Meow Meow
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pet Shop</p>
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Main Card */}
        <div className="animate-fade-in">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center pb-6 border-b border-gray-100 dark:border-slate-800">
              <div className="inline-block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                  Join Us
                </CardTitle>
                <CardDescription className="text-base mt-2">Create your Meow Meow Pet Shop account</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <User size={14} className="text-green-600 dark:text-green-400" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      disabled={loading}
                      data-testid="input-signup-firstname"
                      className="h-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <User size={14} className="text-green-600 dark:text-green-400" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      disabled={loading}
                      data-testid="input-signup-lastname"
                      className="h-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Mail size={14} className="text-green-600 dark:text-green-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    disabled={loading}
                    data-testid="input-signup-email"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Lock size={14} className="text-green-600 dark:text-green-400" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a password"
                    disabled={loading}
                    data-testid="input-signup-password"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                  {formData.password && (
                    <div className="flex gap-1 mt-2">
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-red-400' : 'bg-gray-300'}`} />
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'good' ? 'bg-green-400' : passwordStrength === 'fair' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'good' ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <span className={`text-xs font-semibold ml-2 ${passwordStrength === 'weak' ? 'text-red-600 dark:text-red-400' : passwordStrength === 'fair' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                        {passwordStrength}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Lock size={14} className="text-green-600 dark:text-green-400" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    disabled={loading}
                    data-testid="input-signup-confirm"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 pt-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    data-testid="checkbox-terms"
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-xs font-normal cursor-pointer text-gray-700 dark:text-gray-300 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms">
                      <Button variant="link" className="p-0 h-auto font-semibold text-green-600 dark:text-green-400">
                        Terms of Service
                      </Button>
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy">
                      <Button variant="link" className="p-0 h-auto font-semibold text-green-600 dark:text-green-400">
                        Privacy Policy
                      </Button>
                    </Link>
                  </Label>
                </div>

                {/* Create Account Button */}
                <Button
                  type="submit"
                  className="w-full h-11 mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover-elevate animate-slide-up"
                  style={{ animationDelay: '0.35s' }}
                  disabled={loading || googleLoading}
                  data-testid="button-signup-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <Separator className="bg-gray-200 dark:bg-slate-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3 text-xs text-gray-500 dark:text-gray-400">
                  or join with
                </span>
              </div>

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 hover-elevate animate-slide-up"
                style={{ animationDelay: '0.4s' }}
                disabled={googleLoading || loading}
                onClick={async () => {
                  setGoogleLoading(true)
                  try {
                    const { user: googleUser, error } = await signInWithGoogle()
                    if (error) {
                      toast({
                        title: 'Google Sign Up Failed',
                        description: error.message,
                        variant: 'destructive',
                      })
                    } else if (googleUser) {
                      toast({
                        title: 'Welcome back!',
                        description: 'You have successfully signed in.',
                      })
                      setLocation('/')
                    }
                  } catch (err) {
                    toast({
                      title: 'Error',
                      description: 'An unexpected error occurred',
                      variant: 'destructive',
                    })
                  } finally {
                    setGoogleLoading(false)
                  }
                }}
                data-testid="button-google-signup"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <SiGoogle className="w-4 h-4 mr-2" />
                    Sign up with Google
                  </>
                )}
              </Button>

              {/* Sign In Link */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center animate-slide-up" style={{ animationDelay: '0.45s' }}>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/sign-in">
                    <Button variant="link" className="p-0 h-auto font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300" data-testid="link-signin">
                      Sign in here
                    </Button>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 px-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>🔒 Your security is important to us. All data is encrypted with SSL.</p>
        </div>
      </div>
    </div>
  )
}
