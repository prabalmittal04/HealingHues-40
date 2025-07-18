"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Brain, Music, Heart, Wind, Utensils, MapPin, Video, BarChart3, Sparkles, Star, Plus } from "lucide-react"
import MoodGreeting from "@/components/MoodGreeting"
import HueCoinsWallet from "@/components/HueCoinsWallet"
import ActivityGrid from "@/components/ActivityGrid"
import CreateSessionPanel from "@/components/CreateSessionPanel"
import CommunityLounge from "@/components/CommunityLounge"
import WellnessVideos from "@/components/WellnessVideos"
import WellnessJourney from "@/components/WellnessJourney"
import SessionModal from "@/components/SessionModal"
import AdvancedAnalytics from "@/components/AdvancedAnalytics"
import TherapyHub from "@/components/TherapyHub"
import SoothingMusic from "@/components/SoothingMusic"
import MeditationStudio from "@/components/MeditationStudio"
import BreathingCoach from "@/components/BreathingCoach"
import MoodNutrition from "@/components/MoodNutrition"
import { getUserProfile, createUserProfile } from "@/lib/firestore"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { addCoins, getHueCoinsBalance } from "@/lib/hue-coins-service"

/*
<style jsx global>{`
  .glow-gradient-text {
    text-shadow: 0 0 16px #a78bfa, 0 0 32px #8b5cf6, 0 0 48px #7c3aed;
    animation: pulse-glow 2s infinite alternate;
  }
  @keyframes pulse-glow {
    0% {
      text-shadow: 0 0 8px #a78bfa, 0 0 16px #8b5cf6, 0 0 24px #7c3aed;
    }
    100% {
      text-shadow: 0 0 24px #a78bfa, 0 0 48px #8b5cf6, 0 0 72px #7c3aed;
    }
  }
`}</style>
*/

export default function WellnessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [showCommunityLounge, setShowCommunityLounge] = useState(false)
  const [showWellnessVideos, setShowWellnessVideos] = useState(false)
  const [showWellnessJourney, setShowWellnessJourney] = useState(false)
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showTherapyHub, setShowTherapyHub] = useState(false)
  const [showSoothingMusic, setShowSoothingMusic] = useState(false)
  const [showMeditationStudio, setShowMeditationStudio] = useState(false)
  const [showBreathingCoach, setShowBreathingCoach] = useState(false)
  const [showMoodNutrition, setShowMoodNutrition] = useState(false)

  const activities = [
    {
      id: "therapy",
      title: "Therapy Hub",
      description: "Connect with licensed therapists and support groups",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      reward: 30,
      activeSessions: 12,
      totalParticipants: 247,
    },
    {
      id: "music",
      title: "Soothing Music",
      description: "Healing frequencies and calming soundscapes",
      icon: Music,
      color: "from-cyan-500 to-blue-500",
      reward: 15,
      activeSessions: 8,
      totalParticipants: 189,
    },
    {
      id: "meditation",
      title: "Meditation Studio",
      description: "Guided meditations for inner peace and clarity",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      reward: 25,
      activeSessions: 15,
      totalParticipants: 324,
    },
    {
      id: "breathing",
      title: "Breathing Coach",
      description: "Breathwork techniques for anxiety and stress relief",
      icon: Wind,
      color: "from-green-500 to-emerald-500",
      reward: 20,
      activeSessions: 6,
      totalParticipants: 156,
    },
    {
      id: "nutrition",
      title: "Mood Nutrition",
      description: "Nutritional guidance for mental wellness",
      icon: Utensils,
      color: "from-orange-500 to-yellow-500",
      reward: 18,
      activeSessions: 4,
      totalParticipants: 98,
    },
  ]

  // Initialize user data
  useEffect(() => {
    if (user === null) {
      router.push("/auth")
    }
  }, [user, router])

  useEffect(() => {
    const initializeUserData = async () => {
      if (user) {
        try {
          // Ensure huecoins doc exists
          // initializeHueCoinsBalance(user.uid) // This is now handled by addCoins
          // Fetch huecoins data
          const huecoins = await getHueCoinsBalance(user.uid)
          let profile = await getUserProfile(user.uid)
          if (!profile) {
            profile = await createUserProfile(user)
          }
          // Merge huecoins data into userData
          const wellnessData = {
            ...profile,
            hueCoins: huecoins?.balance || 100,
            level: huecoins?.level || 1,
            totalExperience: huecoins?.experience || 0,
          }
          setUserData(wellnessData)
        } catch (error) {
          console.error("Error initializing user data:", error)
          setUserData({
            uid: user.uid,
            displayName: user.displayName || "Cosmic Healer",
            email: user.email,
            hueCoins: 100,
            level: 1,
            totalExperience: 0,
            completedVideos: [],
            completedActivities: [],
            unlockedLocations: ["peaceful-pond"],
            currentLocation: "peaceful-pond",
            currentMood: "calm",
            badges: [],
            moodHistory: [],
            sessionHistory: [],
            communityPosts: [],
            preferences: {
              notifications: true,
              theme: "cosmic",
              privacy: "public",
            },
          })
        }
      }
      setLoading(false)
    }
    initializeUserData()
  }, [user])

  if (user === undefined) {
    return null; // or a loading spinner
  }

  const updateUserData = async (newData: any) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, newData)
        setUserData(newData)
      } catch (error) {
        console.error("Error updating user data:", error)
        setUserData(newData)
      }
    }
  }

  const handleActivitySelect = (activityId: string) => {
    switch (activityId) {
      case "therapy":
        setShowTherapyHub(true)
        break
      case "music":
        setShowSoothingMusic(true)
        break
      case "meditation":
        setShowMeditationStudio(true)
        break
      case "breathing":
        setShowBreathingCoach(true)
        break
      case "nutrition":
        setShowMoodNutrition(true)
        break
      default:
        const activity = activities.find((a) => a.id === activityId)
        setSelectedActivity(activity)
        setShowSessionModal(true)
    }
  }

  const handleReward = async (amount: number, activity = "Completed activity", type = "wellness") => {
    if (user) {
      await addCoins(user.uid, amount, activity, type)
      // Refetch and update UI
      const huecoins = await getHueCoinsBalance(user.uid)
      setUserData((prev: any) => ({
        ...prev,
        hueCoins: huecoins?.balance || 0,
        level: huecoins?.level || 1,
        totalExperience: huecoins?.experience || 0,
      }))
    }
  }

  const handleProgressUpdate = async (newProgress: any) => {
    await updateUserData(newProgress)
  }

  const handleVideoComplete = async (coins: number, videoId?: string, title?: string, durationSeconds?: number) => {
    if (user) {
      await addCoins(user.uid, coins, title || "Watched video", "wellness")
      // Refetch and update UI
      const huecoins = await getHueCoinsBalance(user.uid)
      setUserData((prev: any) => ({
        ...prev,
        hueCoins: huecoins?.balance || 0,
        level: huecoins?.level || 1,
        totalExperience: huecoins?.experience || 0,
        completedVideos: [...(prev.completedVideos || []), videoId].filter(Boolean),
      }))
    }
  }

  // Debug: Force-create huecoins doc for current user
  const handleCreateHueCoins = async () => {
    if (user) {
      try {
        // initializeHueCoinsBalance(user.uid) // This is now handled by addCoins
        alert("huecoins document created/ensured for user: " + user.uid)
      } catch (e) {
        alert("Failed to create huecoins document: " + e)
      }
    } else {
      alert("No user logged in")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your cosmic wellness center...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Wellness Center</h1>
          <p className="text-slate-300 text-lg mb-8">Please sign in to access your personalized wellness journey</p>
          <button
            onClick={() => (window.location.href = "/auth")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden pt-4">
      {/* Enhanced Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Twinkling Stars */}
        {[...Array(200)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Floating Cosmic Particles */}
        {[...Array(60)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Geometric Patterns */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-purple-500/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-cyan-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-pink-500/20 transform rotate-12 animate-bounce"></div>

        {/* Aurora Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 animate-aurora"></div>

        {/* Holographic Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {[...Array(400)].map((_, i) => (
              <div key={`grid-${i}`} className="border border-cyan-400/20"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with reduced margins */}
      <div className="relative z-10 container mx-auto px-4 py-4 max-w-7xl">
        {/* Smaller Header Section with Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* Animated Logo */}
            <div className="relative -mt-12">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <Sparkles className="w-6 h-6 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-2 h-2 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-2xl rounded-full animate-pulse"></div>
            </div>
            {/* Title Section */}
            <div className="relative flex items-center">
              <div className="relative">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-violet-500 bg-clip-text text-transparent mb-1 relative leading-tight pb-2">
                  HealingHues
                </h1>
                <p className="text-slate-300 text-base mb-1">Your Cosmic Wellness Sanctuary</p>
                {/* Neural Interface Status */}
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Neural Interface: Active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400 text-xs font-medium">Quantum Sync: 98.7%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-400 text-xs font-medium">Bio-Resonance: Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Enhanced Hue Coins Wallet */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-2xl rounded-full"></div>
            <HueCoinsWallet 
              balance={userData?.hueCoins || 0}
              level={userData?.level || 1}
              experiencePoints={userData?.totalExperience || 0}
            />
          </div>
        </div>

        {/* Enhanced Mood Greeting */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 blur-2xl rounded-3xl"></div>
          <MoodGreeting mood={userData?.currentMood || "calm"} userName={userData?.displayName || "Cosmic Healer"} />
        </div>

        {/* Enhanced Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <button
            onClick={() => setShowWellnessJourney(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-purple-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MapPin className="w-5 h-5 group-hover:animate-bounce" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Journey Map</div>
                <div className="text-xs opacity-90">Explore your path</div>
              </div>
            </div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          </button>

          <button
            onClick={() => setShowWellnessVideos(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-cyan-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Video className="w-5 h-5 group-hover:animate-bounce" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Wellness Videos</div>
                <div className="text-xs opacity-90">Quick healing</div>
              </div>
            </div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </button>

          <button
            onClick={() => setShowCreateSession(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-green-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Plus className="w-5 h-5 group-hover:animate-bounce" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Create Session</div>
                <div className="text-xs opacity-90">Start new activity</div>
              </div>
            </div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </button>

          <button
            onClick={() => setShowCommunityLounge(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-pink-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-5 h-5 group-hover:animate-bounce" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Community</div>
                <div className="text-xs opacity-90">Share & connect</div>
              </div>
            </div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          </button>

          <button
            onClick={() => setShowAdvancedAnalytics(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-yellow-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 group-hover:animate-bounce" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Analytics</div>
                <div className="text-xs opacity-90">View insights</div>
              </div>
            </div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          </button>
        </div>

        {/* Enhanced Activity Grid */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-cyan-600/5 blur-3xl rounded-3xl"></div>
          <ActivityGrid
            activities={activities}
            onActivitySelect={handleActivitySelect}
            onShowLiveSessions={() => setShowCreateSession(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showCreateSession && (
        <CreateSessionPanel onClose={() => setShowCreateSession(false)} onActivitySelect={handleActivitySelect} />
      )}

      {showCommunityLounge && <CommunityLounge isVisible={true} onToggle={() => setShowCommunityLounge(false)} />}

      {showWellnessVideos && (
        <WellnessVideos
          onClose={() => setShowWellnessVideos(false)}
          onVideoComplete={handleVideoComplete}
          userProgress={userData}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showWellnessJourney && (
        <WellnessJourney
          onClose={() => setShowWellnessJourney(false)}
          userProgress={userData}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showAdvancedAnalytics && <AdvancedAnalytics onClose={() => setShowAdvancedAnalytics(false)} />}

      {showTherapyHub && (
        <TherapyHub
          onClose={() => setShowTherapyHub(false)}
          userData={userData}
          onReward={handleReward}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showSoothingMusic && (
        <SoothingMusic
          onClose={() => setShowSoothingMusic(false)}
          userData={userData}
          onReward={handleReward}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showMeditationStudio && (
        <MeditationStudio
          onClose={() => setShowMeditationStudio(false)}
          userData={userData}
          onReward={handleReward}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showBreathingCoach && (
        <BreathingCoach
          onClose={() => setShowBreathingCoach(false)}
          userData={userData}
          onReward={handleReward}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showMoodNutrition && (
        <MoodNutrition
          onClose={() => setShowMoodNutrition(false)}
          userData={userData}
          onReward={handleReward}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {showSessionModal && selectedActivity && (
        <SessionModal activity={selectedActivity} onClose={() => setShowSessionModal(false)} onReward={handleReward} />
      )}
    </div>
    </>
  )
}
