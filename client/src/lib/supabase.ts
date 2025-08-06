import { createClient } from '@supabase/supabase-js'

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
  } else {
    console.warn('Supabase credentials not configured. Authentication features will show appropriate messages.')
  }
} catch (error) {
  console.warn('Supabase configuration error:', error)
  supabase = null
}

export { supabase }

export type AuthUser = {
  id: string
  email: string
  name?: string
}

export async function signUp(email: string, password: string) {
  if (!supabase) {
    return { data: null, error: { message: 'Authentication service not configured. Please contact support to set up your account.' } }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  if (!supabase) {
    return { data: null, error: { message: 'Authentication service not configured. Please contact support to sign in.' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
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