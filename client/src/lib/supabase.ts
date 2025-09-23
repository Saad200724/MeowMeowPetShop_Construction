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

// Connection tracking
let connectionCount = 0
let useSupabaseAuth = true

// Check connection limit
export function checkConnectionLimit() {
  if (connectionCount >= 190) { // Keep buffer of 10
    useSupabaseAuth = false
    console.log('Supabase connection limit reached, using fallback auth')
  }
  return useSupabaseAuth
}

// Track connections
export function trackConnection(increment: boolean = true) {
  if (increment) {
    connectionCount++
  } else {
    connectionCount = Math.max(0, connectionCount - 1)
  }
  localStorage.setItem('supabase_connections', connectionCount.toString())
}

export async function sendOtp(email: string, isSignUp: boolean = false) {
  // Check connection limit first
  if (!checkConnectionLimit() || !supabase) {
    console.log('Using fallback authentication for OTP')
    const { fallbackSignUp } = await import('./auth-fallback')
    // For OTP fallback, we'll simulate OTP with a simple code
    if (isSignUp) {
      localStorage.setItem(`otp_${email}`, '123456')
      return { data: { message: 'OTP sent successfully (Fallback mode)' }, error: null }
    }
    return { data: { message: 'Please use sign up first (Fallback mode)' }, error: null }
  }
  
  console.log('Sending OTP to:', email, isSignUp ? '(signup)' : '(signin)')
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // For signup, auto-create user. For signin, don't create if user doesn't exist
        shouldCreateUser: isSignUp,
        data: isSignUp ? {
          role: 'user'
        } : undefined
      }
    })
    
    console.log('OTP send response:', { data: !!data, error: error?.message })
    
    if (!error) {
      return { 
        data: { message: 'OTP sent successfully' }, 
        error: null 
      }
    }
    
    return { data, error }
  } catch (err) {
    console.error('OTP send error:', err)
    return { 
      data: null, 
      error: { message: 'Failed to send OTP. Please try again.' } 
    }
  }
}

export async function verifyOtp(email: string, token: string) {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return { data: null, error: { message: 'Authentication service not configured.' } }
  }
  
  console.log('Verifying OTP for:', email)
  
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    
    console.log('OTP verification response:', { 
      session: !!data?.session, 
      user: !!data?.user, 
      error: error?.message 
    })
    
    return { data, error }
  } catch (err) {
    console.error('OTP verification error:', err)
    return { 
      data: null, 
      error: { message: 'Invalid or expired code. Please try again.' } 
    }
  }
}

export async function signIn(email: string, password?: string) {
  // This app uses OTP authentication, so we redirect to OTP flow
  // For consistency, we'll use the sendOtp function for sign-in
  return sendOtp(email, false) // false = not a sign-up
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