import { useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Lock, Loader2, ArrowRight, Shield } from 'lucide-react'

const logoPath = '/logo.png'

export default function AdminLoginPage() {
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username.trim()) {
      toast({
        title: 'Username Required',
        description: 'Please enter your username',
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
      // Call server authentication endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.username, // Use username as email for authentication
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Login Failed',
          description: data.message || 'Invalid username or password',
          variant: 'destructive',
        })
        return
      }

      // Check if user is admin
      if (data.user?.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'Only administrators can access this panel',
          variant: 'destructive',
        })
        return
      }

      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({
        isAdmin: true,
        userId: data.user._id || data.user.id,
        username: data.user.username,
        loginTime: new Date().toISOString(),
      }))

      // Also store in the format that useAuth() expects
      const userData = {
        id: data.user._id || data.user.id,
        username: data.user.username,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
      }
      localStorage.setItem('meow_meow_auth_user', JSON.stringify(userData))
      
      // Dispatch custom event to notify AuthProvider of login
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: userData }))
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin panel!',
      })
      setFormData({ username: '', password: '' })
      
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        setLocation('/admin')
      }, 100)
    } catch (error) {
      console.error('Admin login error:', error)
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
        <div className="flex items-center justify-center gap-3">
          <img src={logoPath} alt="Meow Meow Pet Shop" className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
              Meow Meow
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pet Shop</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="animate-fade-in">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center pb-6 border-b border-gray-100 dark:border-slate-800">
              <div className="inline-block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent">
                  Admin Login
                </CardTitle>
                <CardDescription className="text-base mt-2">Access the admin panel</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Shield size={16} className="text-red-600 dark:text-red-400" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter admin username"
                    disabled={loading}
                    data-testid="input-admin-username"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Lock size={16} className="text-red-600 dark:text-red-400" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter admin password"
                    disabled={loading}
                    data-testid="input-admin-password"
                    className="h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-700"
                  />
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-11 mt-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover-elevate animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                  disabled={loading}
                  data-testid="button-admin-login"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    <>
                      Access Admin Panel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  This area is restricted. Only authorized administrators have access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 px-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p>🔒 Admin access is restricted and monitored.</p>
        </div>
      </div>
    </div>
  )
}
