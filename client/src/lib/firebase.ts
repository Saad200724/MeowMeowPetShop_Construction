import { initializeApp, getApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth'

// ... existing code ...

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to send reset email' };
  }
}

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
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Switch to signInWithRedirect to avoid popup blocking and cross-origin issues
    // This is often more reliable on Replit and mobile browsers
    await signInWithRedirect(auth, provider);
    // Note: The result will be handled by handleRedirectResult in the hook
    return { user: null, error: null };
  } catch (error: any) {
    console.error('Google Sign-in Error:', {
      code: error.code,
      message: error.message,
    })
    const message = error.message || 'Failed to sign in with Google'
    return {
      user: null,
      error: { message },
    }
  }
}

export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = {
        id: result.user.uid,
        email: result.user.email || '',
        username: result.user.displayName || result.user.email?.split('@')[0] || '',
        role: 'user',
      };
      
      // Sync with backend if needed, or just return the user object
      // For now, return the mapped user object
      return {
        user,
        error: null,
      };
    }
    return null;
  } catch (error: any) {
    console.error('Redirect Result Error:', error);
    return {
      user: null,
      error: { message: error.message || 'Failed to complete sign in' },
    };
  }
}
