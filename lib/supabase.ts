import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client safely
let supabase: any = null

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  console.log('Supabase URL configured:', !!supabaseUrl)
  console.log('Supabase Key configured:', !!supabaseAnonKey)
  console.log('URL starts with:', supabaseUrl.substring(0, 20))

  // Check if Supabase credentials are available
  const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

  // Create supabase client if credentials are available
  if (hasSupabaseCredentials) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client created successfully')
  } else {
    console.warn('Supabase credentials not configured. Authentication features will show appropriate messages.')
  }
} catch (error) {
  console.error('Supabase configuration error:', error)
  supabase = null
}

export { supabase }

export type AuthUser = {
  id: string
  email: string
  name?: string
}

export async function signUp(email: string, password: string, firstName?: string, lastName?: string) {
  if (!supabase) {
    console.error('Supabase client not initialized, using fallback authentication')
    const { fallbackSignUp } = await import('./auth-fallback')
    return fallbackSignUp(email, password, firstName, lastName)
  }
  
  console.log('Attempting Supabase sign up for:', email)
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: firstName,
          lastName: lastName,
          name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
          role: 'user'
        }
      }
    })
    
    console.log('Supabase sign up response:', { data: !!data, error: error?.message })
    
    // If Supabase fails, try fallback
    if (error && error.message.includes('fetch')) {
      console.log('Supabase network error, using fallback authentication')
      const { fallbackSignUp } = await import('./auth-fallback')
      return fallbackSignUp(email, password, firstName, lastName)
    }
    
    return { data, error }
  } catch (err) {
    console.error('Supabase sign up error, using fallback:', err)
    const { fallbackSignUp } = await import('./auth-fallback')
    return fallbackSignUp(email, password, firstName, lastName)
  }
}

export async function signIn(email: string, password: string) {
  if (!supabase) {
    console.log('Supabase not available, using fallback authentication')
    const { fallbackSignIn } = await import('./auth-fallback')
    return fallbackSignIn(email, password)
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // If Supabase fails, try fallback
    if (error && error.message.includes('fetch')) {
      console.log('Supabase network error, using fallback authentication')
      const { fallbackSignIn } = await import('./auth-fallback')
      return fallbackSignIn(email, password)
    }
    
    return { data, error }
  } catch (err) {
    console.error('Supabase sign in error, using fallback:', err)
    const { fallbackSignIn } = await import('./auth-fallback')
    return fallbackSignIn(email, password)
  }
}

export async function signOut() {
  if (!supabase) {
    return { error: { message: 'Authentication service not configured.' } }
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (user: any) => void) {
  if (!supabase) {
    callback(null)
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
  return supabase.auth.onAuthStateChange((_event: any, session: any) => {
    callback(session?.user ?? null)
  })
}