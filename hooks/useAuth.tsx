"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange } from "@/lib/auth"
import { getUserProfile, type UserProfile } from "@/lib/firestore"
import { signOutUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isEmailVerified: boolean
  error: string | null
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isEmailVerified: false,
  error: null,
  signOut: async () => ({ error: "signOut function not implemented" }), // Placeholder
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const unsubscribe = onAuthStateChange(async (user) => {
      if (!mounted) return

      try {
        setUser(user)
        setError(null)

        if (user) {
          // Get user profile from Firestore
          const profile = await getUserProfile(user.uid)
          if (mounted) {
            setUserProfile(profile)
          }
        } else {
          if (mounted) {
            setUserProfile(null)
          }
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        if (mounted) {
          setError("Authentication error occurred")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const isEmailVerified = user?.emailVerified || false

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isEmailVerified, error, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
