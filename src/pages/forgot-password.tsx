import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowLeft, PawPrint, CheckCircle } from 'lucide-react'

// Function to get the correct password reset URL for different environments
function getPasswordResetUrl(): string {
  const currentOrigin = window.location.origin;

  // For production domains, use the current origin
  if (!currentOrigin.includes('localhost') && !currentOrigin.includes('127.0.0.1')) {
    return `${currentOrigin}/reset-password`;
  }

  // For development, try to detect Replit environment
  const hostname = window.location.hostname;
  const href = window.location.href;
  const referrer = document.referrer;

  // Check if we can find a replit.dev domain
  const replitMatch =
    href.match(/https?:\/\/([^\/]+\.replit\.dev)/) ||
    referrer.match(/https?:\/\/([^\/]+\.replit\.dev)/);

  if (replitMatch) {
    return `https://${replitMatch[1]}/reset-password`;
  }

  // Fallback: use current origin (will work when deployed to your domain)
  return `${currentOrigin}/reset-password`;
}

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const logoPath = "/logo.png"; // Assuming logo.png is in the public directory

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
      // Get the correct redirect URL for password reset
      const redirectUrl = getPasswordResetUrl();

      console.log('Password reset redirect URL:', redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        toast({
          title: 'Reset Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        setIsSubmitted(true)
        toast({
          title: 'Reset Email Sent',
          description: 'Check your email for password reset instructions',
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(38,115,45,0.1),transparent_50%)]" />

        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-green-500 shadow-lg">
                  <img
                    src={logoPath}
                    alt="Meow Meow Pet Shop Logo"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </div>
              </div>

              <CardTitle className="text-3xl font-bold text-meow-green">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                We've sent password reset instructions to your email
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We sent a password reset link to:
                </p>
                <p className="font-semibold text-meow-green bg-green-50 px-4 py-2 rounded-lg">
                  {email}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create a new password</li>
                  <li>• Sign in with your new password</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/sign-in">
                  <Button className="w-full h-12 bg-gradient-to-r from-meow-yellow to-yellow-400 hover:from-yellow-400 hover:to-meow-yellow text-meow-green-dark font-semibold">
                    Back to Sign In
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full h-12 border-meow-green text-meow-green hover:bg-green-50"
                >
                  Try Different Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(38,115,45,0.1),transparent_50%)]" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-meow-green hover:text-meow-green-dark hover:bg-green-50 p-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-green-500 shadow-lg">
                <img
                  src={logoPath}
                  alt="Meow Meow Pet Shop Logo"
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-meow-green">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-meow-green font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-meow-yellow focus:ring-meow-yellow/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-meow-yellow to-yellow-400 hover:from-yellow-400 hover:to-meow-yellow text-meow-green-dark font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-meow-green-dark border-t-transparent rounded-full animate-spin mr-2" />
                    Sending Reset Email...
                  </div>
                ) : (
                  'Send Reset Email'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?{' '}
                <Link href="/sign-in">
                  <Button variant="link" className="text-meow-green hover:text-meow-green-dark p-0 h-auto">
                    Sign in here
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2025 Meow Meow Pet Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}