import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, type AuthUser } from '@/lib/supabase'

// Extended user type that matches our database schema
interface ExtendedUser extends AuthUser {
  role?: string
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: ExtendedUser | null
  loading: boolean
  signOut: () => void
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  refreshAuth: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)

  const signOut = async () => {
    // Sign out from Supabase if it's a regular user
    if (user && user.role !== 'admin') {
      const { signOut: supabaseSignOut } = await import('@/lib/supabase')
      await supabaseSignOut()
    }
    
    // Clear local state for all users (including admin)
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const refreshAuth = () => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    // Initialize with stored user for admin access
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Set up Supabase auth state listener
    const { data: { subscription } } = onAuthStateChange((supabaseUser) => {
      if (supabaseUser) {
        // Convert Supabase user to our user format
        const user: ExtendedUser = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || `${supabaseUser.user_metadata?.firstName || ''} ${supabaseUser.user_metadata?.lastName || ''}`.trim(),
          role: supabaseUser.user_metadata?.role || 'user',
          firstName: supabaseUser.user_metadata?.firstName,
          lastName: supabaseUser.user_metadata?.lastName
        }
        setUser(user)
        // Also store in localStorage for consistency
        localStorage.setItem('auth_user', JSON.stringify(user))
      } else {
        // Only clear if it's not an admin user from localStorage
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          if (parsed.role !== 'admin') {
            setUser(null)
            localStorage.removeItem('auth_user')
          }
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}