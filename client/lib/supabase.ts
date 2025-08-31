import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase URL configured:', !!supabaseUrl)
console.log('Supabase Key configured:', !!supabaseAnonKey)
console.log('URL starts with:', supabaseUrl.substring(0, 20))

// Check if we have valid Supabase credentials (not placeholder values)
function isValidSupabaseConfig(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (supabaseUrl.includes('your_supabase_project') || supabaseUrl === 'your_supabase_project_url_here') return false
  if (supabaseAnonKey.includes('your_supabase_anon') || supabaseAnonKey === 'your_supabase_anon_key_here') return false
  
  try {
    new URL(supabaseUrl) // Test if URL is valid
    return true
  } catch {
    return false
  }
}

// Create Supabase client only if we have valid configuration
let supabase: any = null
let supabaseConfigured = false

try {
  if (isValidSupabaseConfig()) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    supabaseConfigured = true
    console.log('✅ Supabase client initialized successfully')
  } else {
    console.log('⚠️ Supabase not configured - using fallback mode. Set real credentials later.')
    supabaseConfigured = false
  }
} catch (error) {
  console.error('Supabase configuration error:', error)
  supabaseConfigured = false
}

export { supabase, supabaseConfigured }

export type AuthUser = {
  id: string
  email: string
  name?: string
}

export async function signUp(email: string, password: string) {
  if (!supabaseConfigured || !supabase) {
    return { data: null, error: { message: 'Authentication not configured. Please set up Supabase credentials.' } }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  if (!supabaseConfigured || !supabase) {
    return { data: null, error: { message: 'Authentication not configured. Please set up Supabase credentials.' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  if (!supabaseConfigured || !supabase) {
    return { error: { message: 'Authentication not configured. Please set up Supabase credentials.' } }
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!supabaseConfigured || !supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (user: any) => void) {
  if (!supabaseConfigured || !supabase) {
    callback(null)
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}

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

export async function resetPassword(email: string) {
  if (!supabaseConfigured || !supabase) {
    return { error: { message: 'Authentication not configured. Please set up Supabase credentials.' } }
  }
  
  const redirectUrl = getPasswordResetUrl();
  
  console.log('Password reset redirect URL from library:', redirectUrl);
    
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })
  return { error }
}

export async function updatePassword(password: string) {
  if (!supabaseConfigured || !supabase) {
    return { error: { message: 'Authentication not configured. Please set up Supabase credentials.' } }
  }
  
  const { error } = await supabase.auth.updateUser({
    password: password
  })
  return { error }
}