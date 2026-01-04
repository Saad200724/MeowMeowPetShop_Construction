import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { signIn, signInWithGoogle } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { Mail, ArrowLeft, Loader2, Lock, ArrowRight } from 'lucide-react'
import { SiGoogle } from 'react-icons/si'

const logoPath = '/logo.png'

export default function SignInPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { toast } = useToast()
  const { user } = useAuth()

  // Redirect if already logged in
  if (user) {
    setLocation('/')
    return null
  }

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
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        })
        setFormData({ email: '', password: '' })
        setLocation('/')
      }
    } catch (error) {
      console.error('Sign in error:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-200 to-transparent dark:from-green-900 dark:to-transparent opacity-30 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-30 blur-3xl rounded-full -ml-48 -mb-48 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 hover-elevate bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-gray-200 dark:border-slate-700 shadow-sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Shop</span>
            </Button>
          </Link>
          <div className="flex-1 flex items-center justify-center gap-3 pr-8">
            <img src={logoPath} alt="Meow Meow Pet Shop" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                Meow Meow
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pet Shop</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="animate-fade-in">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center pb-6 border-b border-gray-100 dark:border-slate-800">
              <div className="inline-block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base mt-2">Sign in to Meow Meow Pet Shop</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Mail size={16} className="text-green-600 dark:text-green-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    disabled={loading}
                    data-testid="input-signin-email"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Lock size={16} className="text-green-600 dark:text-green-400" />
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    disabled={loading}
                    data-testid="input-signin-password"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                  <div className="flex justify-end">
                    <Link href="/forgot-password">
                      <Button variant="link" className="p-0 h-auto text-xs text-green-600 dark:text-green-400 hover:text-green-700" data-testid="link-forgot-password">
                        Forgot Password?
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-11 mt-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover-elevate animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                  disabled={loading || googleLoading}
                  data-testid="button-signin-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/sign-up">
                    <Button variant="link" className="p-0 h-auto font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300" data-testid="link-signup">
                      Create one here
                    </Button>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>🔒 Your security is important to us. All data is encrypted with SSL.</p>
        </div>
      </div>
    </div>
  )
}
