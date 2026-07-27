import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Firebase Project Configuration
 * Loads environment variables using Vite's import.meta.env syntax.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD-DEV-MOCK-KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'uber-clone.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'uber-clone',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'uber-clone.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// 1. Initialize Firebase App (singleton pattern to support Vite HMR cleanly)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// 2. Initialize Firebase Authentication (Modular SDK)
const auth = getAuth(app)

// 3. Initialize Firestore Database (Modular SDK)
const db = getFirestore(app)

// 4. Initialize Firebase Cloud Storage (Modular SDK)
const storage = getStorage(app)

export { app, auth, db, storage }
export default app
