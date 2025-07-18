"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createUserProfile } from "@/lib/firestore"
import { getUserStats, initializeUserStats, type UserStats } from "@/lib/hue-coins-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  userStats?: UserStats | null
  statsLoading?: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await createUserProfile(user)
        } catch (error) {
          console.error("Error creating user profile:", error)
        }
        setUser(user)
        setStatsLoading(true)
        try {
          await initializeUserStats(user.uid)
          const stats = await getUserStats(user.uid)
          setUserStats(stats)
        } catch (error) {
          setUserStats(null)
        }
        setStatsLoading(false)
      } else {
        setUser(null)
        setUserStats(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, loading, userStats, statsLoading }}>{children}</AuthContext.Provider>
}
