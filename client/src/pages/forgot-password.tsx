import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const logoPath = '/logo.png'

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // Firebase password reset via email
      // For now, show a message to use sign-in page
      toast({
        title: 'Password Reset',
        description: 'Please contact support or try signing in again.',
        variant: 'default',
      })
      setIsSubmitted(true)
      setTimeout(() => setLocation('/sign-in'), 2000)
    } catch (error) {
      console.error('Password reset error:', error)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
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

        {!isSubmitted ? (
          <Card>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl text-[#26732d]">Reset Password</CardTitle>
              <CardDescription>Enter your email address and we'll help you reset your password</CardDescription>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                    data-testid="input-email"
                  />
                </div>

                <Button
                  type="submit"
                  variant="meowGreen"
                  className="w-full"
                  disabled={loading}
                  data-testid="button-submit"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link href="/sign-in">
                    <Button variant="link" className="p-0 text-[#26732d]" data-testid="link-signin">
                      Sign in here
                    </Button>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-[#26732d] mx-auto" />
                <h2 className="text-lg font-semibold">Check Your Email</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If an account exists with this email, you'll receive password reset instructions.
                </p>
                <Button
                  onClick={() => setLocation('/sign-in')}
                  variant="meowGreen"
                  className="w-full"
                  data-testid="button-back-signin"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
