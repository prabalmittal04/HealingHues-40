import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  type User,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider } from "./firebaseConfig"
import { createUserProfile } from "./firestore"

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Create user profile in Firestore if it's a new user
    await createUserProfile(user)

    return { user, error: null }
  } catch (error: any) {
    console.error("Google sign-in error:", error)
    return { user: null, error: error.message }
  }
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    console.error("Email sign-in error:", error)
    return { user: null, error: error.message }
  }
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user

    // Update user profile with display name
    await updateProfile(user, { displayName })

    // Send email verification
    await sendEmailVerification(user)

    // Create user profile in Firestore
    await createUserProfile(user)

    return { user, error: null }
  } catch (error: any) {
    console.error("Email sign-up error:", error)
    return { user: null, error: error.message }
  }
}

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    console.error("Sign-out error:", error)
    return { error: error.message }
  }
}

// Send email verification
export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user)
    return { error: null }
  } catch (error: any) {
    console.error("Email verification error:", error)
    return { error: error.message }
  }
}

// Check if email is verified
export const isEmailVerified = (user: User | null) => {
  return user?.emailVerified || false
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser
}
