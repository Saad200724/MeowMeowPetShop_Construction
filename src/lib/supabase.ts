import { createClient } from '@supabase/supabase-js'
import { apiRequest } from '@/lib/queryClient'

// Initialize Supabase client safely
let supabase: any = null

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  // Check if Supabase credentials are available
  const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

  // Create supabase client if credentials are available
  if (hasSupabaseCredentials) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client initialized successfully')
  } else {
    console.warn('Supabase credentials not configured. Using database authentication.')
  }
} catch (error) {
  console.warn('Supabase configuration error:', error)
  supabase = null
}

export { supabase }

export type AuthUser = {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  isActive?: boolean
  role?: string
}

// Storage for current user session
let currentUser: AuthUser | null = null
let authListeners: ((user: AuthUser | null) => void)[] = []

function notifyAuthListeners(user: AuthUser | null) {
  currentUser = user
  authListeners.forEach(callback => callback(user))
}

export async function signUp(email: string, password: string, userData: any = {}) {
  try {
    // Use our database authentication system
    const response = await apiRequest('POST', '/api/auth/register', {
      email,
      password,
      confirmPassword: password,
      username: userData.username || email.split('@')[0],
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || ''
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { data: null, error: { message: errorData.message || 'Registration failed' } }
    }

    const data = await response.json()
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      phone: data.user.phone,
      isActive: data.user.isActive
    }

    notifyAuthListeners(authUser)
    return { data: { user: authUser }, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error: { message: 'Network error occurred during registration' } }
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Use our database authentication system
    const response = await apiRequest('POST', '/api/auth/login', {
      email,
      password
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { data: null, error: { message: errorData.message || 'Login failed' } }
    }

    const data = await response.json()
    const authUser = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      phone: data.user.phone,
      isActive: data.user.isActive,
      role: data.user.role // Include role for admin check
    }

    // Store user session in localStorage
    localStorage.setItem('authUser', JSON.stringify(authUser))
    notifyAuthListeners(authUser)
    
    // Trigger custom event for immediate auth state change
    window.dispatchEvent(new CustomEvent('authStateChange', { detail: authUser }))
    
    return { data: { user: authUser }, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error: { message: 'Network error occurred during login' } }
  }
}

export async function signOut() {
  try {
    // Clear local storage
    localStorage.removeItem('authUser')
    notifyAuthListeners(null)
    return { error: null }
  } catch (error) {
    return { error: { message: 'Error during sign out' } }
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // First check if we have a user in memory
  if (currentUser) {
    return currentUser
  }

  // Try to get user from localStorage
  try {
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      const user = JSON.parse(storedUser) as AuthUser
      currentUser = user
      return user
    }
  } catch (error) {
    console.error('Error parsing stored user:', error)
    localStorage.removeItem('authUser')
  }

  return null
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  // Add listener
  authListeners.push(callback)

  // Call immediately with current user
  getCurrentUser().then(user => {
    callback(user)
  })

  // Return unsubscribe function
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          authListeners = authListeners.filter(listener => listener !== callback)
        }
      }
    }
  }
}