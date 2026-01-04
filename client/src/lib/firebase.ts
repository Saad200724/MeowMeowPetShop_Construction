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
    
    console.log('Attempting Google Sign-in with popup...');
    // Clear any potential leftover redirect state
    localStorage.removeItem('firebase:previous_websocket_id');
    
    const result = await signInWithPopup(auth, provider);
    if (result && result.user) {
      const userData = {
        id: result.user.uid,
        email: result.user.email || '',
        username: result.user.displayName || result.user.email?.split('@')[0] || `user_${result.user.uid.substring(0, 5)}`,
        role: 'user',
      };
      
      try {
        console.log('Syncing Google user with backend...');
        const syncResponse = await fetch('/api/auth/firebase-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: userData.id,
            email: userData.email,
            username: userData.username
          })
        });
        
        let syncData;
        const contentType = syncResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          syncData = await syncResponse.json();
        } else {
          const text = await syncResponse.text();
          console.error('Backend sync returned non-JSON:', text);
          return { user: null, error: { message: 'Server returned an invalid response' } };
        }
        
        if (!syncResponse.ok) {
          console.error('Backend sync failed:', syncData);
          return { user: null, error: { message: syncData.message || 'Server synchronization failed' } };
        }
        
        const syncedUser = { ...syncData.user, id: syncData.user._id || syncData.user.id };
        
        return {
          user: syncedUser,
          error: null
        };
      } catch (syncError: any) {
        console.error('Initial sync network error:', syncError);
        return { user: null, error: { message: 'Network error during synchronization' } };
      }
    }
    return { user: null, error: null };
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    return { user: null, error: { message: error.message || 'Failed to sign in with Google' } };
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
