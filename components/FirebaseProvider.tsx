"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

interface FirebaseContextType {
  user: any
  userData: any
  loading: boolean
  updateUserData: (data: any) => void
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  userData: null,
  loading: true,
  updateUserData: () => {},
})

export const useFirebase = () => useContext(FirebaseContext)

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        } else {
          // Create new user profile
          const newUserData = {
            uid: user.uid,
            displayName: "Cosmic Healer",
            email: user.email || "",
            hueCoins: 1000,
            level: 1,
            totalExperience: 0,
            completedVideos: [],
            completedActivities: [],
            unlockedLocations: ["peaceful-pond"],
            currentLocation: "peaceful-pond",
            badges: [],
            moodHistory: [],
            sessionHistory: [],
            communityPosts: [],
            preferences: {
              notifications: true,
              theme: "cosmic",
              privacy: "public",
            },
          }

          await setDoc(doc(db, "users", user.uid), newUserData)
          setUserData(newUserData)
        }
      } else {
        // Sign in anonymously if no user
        try {
          await signInAnonymously(auth)
        } catch (error) {
          console.error("Error signing in anonymously:", error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const updateUserData = (data: any) => {
    setUserData((prev: any) => ({ ...prev, ...data }))
  }

  return (
    <FirebaseContext.Provider value={{ user, userData, loading, updateUserData }}>{children}</FirebaseContext.Provider>
  )
}
