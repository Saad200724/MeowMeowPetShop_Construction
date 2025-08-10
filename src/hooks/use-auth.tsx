import { createContext, useContext, useEffect, useState } from 'react'
import { type AuthUser } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUser(user)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('authUser')
      }
    }
    setLoading(false)

    // Listen for auth state changes
    const handleAuthChange = (event: CustomEvent) => {
      setUser(event.detail)
    }

    window.addEventListener('authStateChange' as any, handleAuthChange)
    
    return () => {
      window.removeEventListener('authStateChange' as any, handleAuthChange)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
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