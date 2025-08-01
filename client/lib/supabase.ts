import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate that we have the required credentials
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL environment variable is required. Please set it in your Replit secrets.')
}
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required. Please set it in your Replit secrets.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AuthUser = {
  id: string
  email: string
  name?: string
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (user: any) => void) {
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
  const redirectUrl = getPasswordResetUrl();
  
  console.log('Password reset redirect URL from library:', redirectUrl);
    
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })
  return { error }
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password: password
  })
  return { error }
}