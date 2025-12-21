import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
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
