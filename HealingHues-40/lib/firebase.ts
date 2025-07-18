import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCpyKgo6LlSwfkn7T6rIxXP58YPJ2qCl34",
  authDomain: "healinghues-f6133.firebaseapp.com",
  projectId: "healinghues-f6133",
  storageBucket: "healinghues-f6133.firebasestorage.app",
  messagingSenderId: "1064190717659",
  appId: "1:1064190717659:web:b4026c3abffee0ca11a6fe",
}

// ✅ Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()
export default app
