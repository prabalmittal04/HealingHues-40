"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import HueCycleOnboarding from "@/components/HueCycleOnboarding"
import HueCycleDashboard from "@/components/HueCycleDashboard"
import { getHueCycleProfile, type HueCycleProfile } from "@/lib/huecycle-service"
import { motion } from "framer-motion"

export default function HueCyclePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<HueCycleProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.uid) {
        try {
          const profileData = await getHueCycleProfile(user.uid)
          setProfile(profileData)
          setShowOnboarding(!profileData?.isOnboardingComplete)
        } catch (error) {
          console.error("Error checking HueCycle profile:", error)
          setShowOnboarding(true)
        }
      }
      setLoading(false)
    }

    checkProfile()
  }, [user])

  const handleOnboardingComplete = (newProfile: HueCycleProfile) => {
    setProfile(newProfile)
    setShowOnboarding(false)
  }

  if (loading) {
    return (
      <ProtectedRoute requireEmailVerification>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-pink-950 dark:via-purple-950 dark:to-rose-950">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-16 h-16 border-4 border-pink-300 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 mb-2 font-serif">
                Loading HueCycle ✨
              </h2>
              <p className="text-pink-600 dark:text-pink-400">Preparing your magical wellness sanctuary...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireEmailVerification>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-pink-950 dark:via-purple-950 dark:to-rose-950">
        <Navigation />
        <main className="pt-20">
          {showOnboarding ? (
            <HueCycleOnboarding onComplete={handleOnboardingComplete} />
          ) : (
            <HueCycleDashboard profile={profile} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
