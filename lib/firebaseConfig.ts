import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCpyKgo6LlSwfkn7T6rIxXP58YPJ2qCl34",
  authDomain: "healinghues-f6133.firebaseapp.com",
  projectId: "healinghues-f6133",
  storageBucket: "healinghues-f6133.firebasestorage.app",
  messagingSenderId: "1064190717659",
  appId: "1:1064190717659:web:b4026c3abffee0ca11a6fe",
}

// Initialize Firebase with proper error handling
let app
try {
  if (!getApps().length) {
    console.log("Initializing new Firebase app")
    app = initializeApp(firebaseConfig)
  } else {
    console.log("Using existing Firebase app")
    app = getApp()
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Fallback initialization with minimal config
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  })
}

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google Auth provider
googleProvider.setCustomParameters({
  prompt: "select_account",
})

export default app
