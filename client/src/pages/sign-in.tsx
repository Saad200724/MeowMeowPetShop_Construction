import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { Mail, ArrowLeft, PawPrint, Loader2, Lock } from 'lucide-react'

const logoPath = '/logo.png'

export default function SignInPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
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

        {/* Sign In Card */}
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl text-[#26732d]">Sign In</CardTitle>
            <CardDescription>Sign in to your Meow Meow Pet Shop account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  data-testid="input-signin-email"
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
                  placeholder="Enter your password"
                  disabled={loading}
                  data-testid="input-signin-password"
                />
              </div>

              <Button
                type="submit"
                variant="meowGreen"
                className="w-full"
                disabled={loading}
                data-testid="button-signin-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/sign-up">
                  <Button variant="link" className="p-0 text-[#26732d]" data-testid="link-signup">
                    Create one here
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
