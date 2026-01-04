import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthChange, logOut as firebaseLogOut, handleRedirectResult } from '@/lib/firebase'

interface User {
  id: string
  username: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; message?: string }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'meow_meow_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for redirect result first
      try {
        console.log('Checking for Firebase redirect result...');
        const redirectResult = await handleRedirectResult();
        if (redirectResult && redirectResult.user) {
          console.log('Successfully signed in via redirect, syncing with backend...', redirectResult.user);
          
          try {
            const syncResponse = await fetch('/api/auth/firebase-sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: redirectResult.user.id,
                email: redirectResult.user.email,
                username: redirectResult.user.username
              })
            });
            
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              const syncedUser = { ...syncData.user, id: syncData.user._id };
              console.log('Sync successful, setting user:', syncedUser);
              setUser(syncedUser);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(syncedUser));
              setLoading(false);
              window.dispatchEvent(new CustomEvent('authStateChanged', { detail: syncedUser }));
              return;
            } else {
              console.error('Sync failed with status:', syncResponse.status);
            }
          } catch (syncError) {
            console.error('Backend sync failed:', syncError);
          }
          
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }

      // 2. Fallback to localStorage
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setLoading(false)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem(AUTH_STORAGE_KEY)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    };

    initAuth();

    // Set up Firebase listener for real-time updates
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase auth state changed: user detected', firebaseUser);
        
        try {
          // Verify/Sync with backend
          const syncResponse = await fetch('/api/auth/firebase-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: firebaseUser.id,
              email: firebaseUser.email,
              username: firebaseUser.username
            })
          });
          
          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            const syncedUser = syncData.user;
            
            setUser((currentUser) => {
              // Map syncedUser._id to id for frontend compatibility
              const mappedUser = { ...syncedUser, id: syncedUser._id };
              if (!currentUser || currentUser.id !== mappedUser.id) {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
                return mappedUser;
              }
              return currentUser;
            });
          }
        } catch (error) {
          console.error('Auth change sync error:', error);
        }
      } else {
        // If Firebase says no user, but we have a stored user, check if it was a local login
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedUser) {
          setUser(null);
        }
      }
    })

    // Listen for custom auth state changes (used for admin login)
    const handleAuthStateChanged = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail) {
        setUser(customEvent.detail)
      }
    }

    window.addEventListener('authStateChanged', handleAuthStateChanged)

    return () => {
      unsubscribe()
      window.removeEventListener('authStateChanged', handleAuthStateChanged)
    }
  }, [])

  const signOut = async () => {
    try {
      await firebaseLogOut()
      setUser(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      console.log('User signed out and storage cleared')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) {
      return { success: false, message: 'No user logged in' }
    }

    try {
      const response = await fetch(`/api/auth/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedUser = { ...user, ...data.user }
        setUser(updatedUser)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
        console.log('Profile updated successfully:', updatedUser)
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: 'Network error' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, signOut, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
