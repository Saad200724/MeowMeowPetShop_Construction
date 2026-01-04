import { initializeApp, getApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Clean up any potential extra characters (quotes, commas) from env vars
Object.keys(firebaseConfig).forEach((key) => {
  const k = key as keyof typeof firebaseConfig;
  if (typeof firebaseConfig[k] === 'string') {
    firebaseConfig[k] = (firebaseConfig[k] as string).replace(/['",]/g, '').trim();
  }
});

let app
try {
  app = initializeApp(firebaseConfig)
} catch (error: any) {
  // Handle duplicate app initialization during HMR in development
  if (error.code !== 'app/duplicate-app') {
    throw error
  }
  // Use existing app instance
  app = getApp()
}
const auth = getAuth(app)

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set persistence:', error)
})

export { auth }

export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return {
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        username: userCredential.user.email?.split('@')[0] || '',
        role: 'user',
      },
      error: null,
    }
  } catch (error: any) {
    const message = error.message || 'Failed to create account'
    return {
      user: null,
      error: { message },
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        username: userCredential.user.email?.split('@')[0] || '',
        role: 'user',
      },
      error: null,
    }
  } catch (error: any) {
    const message = error.message || 'Failed to sign in'
    return {
      user: null,
      error: { message },
    }
  }
}

export async function logOut() {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Failed to sign out' }
  }
}

export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({
          id: user.uid,
          email: user.email || '',
          username: user.email?.split('@')[0] || '',
          role: 'user',
        })
      } else {
        resolve(null)
      }
      unsubscribe()
    })
  })
}

export function onAuthChange(callback: (user: any) => void) {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        username: firebaseUser.email?.split('@')[0] || '',
        role: 'user',
      })
    } else {
      callback(null)
    }
  })
  return unsubscribe
}

export async function signInWithGoogle() {
  try {
    // Debug: Log Firebase config
    console.log('Firebase config:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✓ set' : '✗ missing',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    })
    
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    return {
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        username: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || '',
        role: 'user',
      },
      error: null,
    }
  } catch (error: any) {
    console.error('Google Sign-in Error:', {
      code: error.code,
      message: error.message,
      customData: error.customData,
    })
    const message = error.message || 'Failed to sign in with Google'
    return {
      user: null,
      error: { message },
    }
  }
}
