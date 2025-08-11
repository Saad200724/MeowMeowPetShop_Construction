import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, type AuthUser } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshAuth: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshAuth = () => {
    // Check localStorage for admin user
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('auth_user')
      }
    }
  }

  useEffect(() => {
    // Check for stored admin user on mount
    refreshAuth()

    const { data: { subscription } } = onAuthStateChange((user) => {
      if (user) {
        setUser({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name,
          firstName: user.user_metadata?.firstName,
          lastName: user.user_metadata?.lastName
        })
      } else {
        // Check localStorage for admin user when Supabase user is null
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (error) {
            console.error('Error parsing stored user:', error)
            localStorage.removeItem('auth_user')
            setUser(null)
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
    <AuthContext.Provider value={{ user, loading, refreshAuth }}>
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