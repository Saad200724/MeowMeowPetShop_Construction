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
import { Mail, ArrowLeft, User, Loader2, Lock } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center justify-center gap-3">
            <img src={logoPath} alt="Meow Meow Pet Shop" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-[#26732d]">Meow Meow</h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Sign Up Card */}
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl text-[#26732d]">Create Account</CardTitle>
            <CardDescription>Join Meow Meow Pet Shop and start shopping</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User size={16} />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    disabled={loading}
                    data-testid="input-signup-firstname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User size={16} />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    disabled={loading}
                    data-testid="input-signup-lastname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} />
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock size={16} />
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock size={16} />
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
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  data-testid="checkbox-terms"
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms">
                    <Button variant="link" className="p-0 h-auto">
                      Terms of Service
                    </Button>
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy">
                    <Button variant="link" className="p-0 h-auto">
                      Privacy Policy
                    </Button>
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                variant="meowGreen"
                className="w-full"
                disabled={loading || googleLoading}
                data-testid="button-signup-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <Separator />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={googleLoading || loading}
                onClick={async () => {
                  setGoogleLoading(true)
                  try {
                    const { error } = await signInWithGoogle()
                    if (error) {
                      toast({
                        title: 'Google Sign Up Failed',
                        description: error.message,
                        variant: 'destructive',
                      })
                    } else {
                      toast({
                        title: 'Account Created!',
                        description: 'Signed up with Google successfully.',
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
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/sign-in">
                  <Button variant="link" className="p-0 text-[#26732d]" data-testid="link-signin">
                    Sign in here
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Your security is important to us. All data is encrypted.</p>
        </div>
      </div>
    </div>
  )
}
