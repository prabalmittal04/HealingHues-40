"use client"

import { useState, useEffect } from "react"
import { Brain, Music, Flower2, Wind, Apple, Sparkles, Star, Video, Map, BarChart3 } from "lucide-react"
import MoodGreeting from "./MoodGreeting"
import ActivityGrid from "./ActivityGrid"
import LiveSessionsPanel from "./LiveSessionsPanel"
import HueCoinsWallet from "./HueCoinsWallet"
import CommunityLounge from "./CommunityLounge"
import SessionModal from "./SessionModal"
import WellnessVideos from "./WellnessVideos"
import WellnessJourney from "./WellnessJourney"
import AdvancedAnalytics from "./AdvancedAnalytics"
import { useAuth } from "@/hooks/useAuth"
import { 
  getWellnessProgress, 
  saveWellnessProgress,
  getWellnessSessions,
  getVideoCompletions,
  getActivityCompletions
} from "@/lib/firestore"

export default function WellnessCenter() {
  const { user } = useAuth()
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [showLiveSessions, setShowLiveSessions] = useState(false)
  const [showCommunity, setShowCommunity] = useState(false)
  const [userMood, setUserMood] = useState("calm")
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  const [showWellnessVideos, setShowWellnessVideos] = useState(false)
  const [showWellnessJourney, setShowWellnessJourney] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [userProgress, setUserProgress] = useState<{
    currentLocation: string
    unlockedLocations: string[]
    totalExperience: number
    completedVideos: string[]
    completedActivities: string[]
    hueCoins: number
    level: number
  } | null>(null)
  const [wellnessSessions, setWellnessSessions] = useState<any[]>([])
  const [videoCompletions, setVideoCompletions] = useState<any[]>([])
  const [activityCompletions, setActivityCompletions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Generate random stars for background
  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 3,
        })
      }
      setStars(newStars)
    }
    generateStars()
  }, [])

  // Load user data from Firebase
  useEffect(() => {
    let unsubSessions = () => {}
    let unsubVideos = () => {}
    let unsubActivities = () => {}
    setLoading(true)
    const loadUserData = async () => {
      if (user) {
        try {
          // Get wellness progress from Firebase
          const progress = await getWellnessProgress(user.uid)
          if (progress) {
            setUserProgress({
              currentLocation: progress.currentLocation,
              unlockedLocations: progress.unlockedLocations,
              totalExperience: progress.totalExperience,
              completedVideos: progress.completedVideos,
              completedActivities: progress.completedActivities,
              hueCoins: progress.hueCoins,
              level: progress.level,
            })
          } else {
            setUserProgress(null)
          }
          // Set up real-time listeners
          unsubSessions = getWellnessSessions(user.uid, (sessions) => {
            setWellnessSessions(sessions)
          })
          unsubVideos = getVideoCompletions(user.uid, (completions) => {
            setVideoCompletions(completions)
          })
          unsubActivities = getActivityCompletions(user.uid, (completions) => {
            setActivityCompletions(completions)
          })
        } catch (error) {
          setUserProgress(null)
          setWellnessSessions([])
          setVideoCompletions([])
          setActivityCompletions([])
        }
      } else {
        setUserProgress(null)
        setWellnessSessions([])
        setVideoCompletions([])
        setActivityCompletions([])
      }
      setLoading(false)
    }
    loadUserData()
    return () => {
      unsubSessions()
      unsubVideos()
      unsubActivities()
    }
  }, [user])

  // All activity/coin/progress updates go to Firestore
  const handleReward = async (amount: number) => {
    if (user && userProgress) {
      const newBalance = userProgress.hueCoins + amount
      const updatedProgress = {
        ...userProgress,
        hueCoins: newBalance,
      }
      setUserProgress(updatedProgress)
      try {
        await saveWellnessProgress({
          userId: user.uid,
          level: updatedProgress.level,
          totalExperience: updatedProgress.totalExperience,
          hueCoins: newBalance,
          completedVideos: updatedProgress.completedVideos,
          completedActivities: updatedProgress.completedActivities,
          unlockedLocations: updatedProgress.unlockedLocations,
          currentLocation: updatedProgress.currentLocation,
          badges: [],
          sessionHistory: [],
        })
        // Re-fetch progress
        const progress = await getWellnessProgress(user.uid)
        if (progress) {
          setUserProgress({
            currentLocation: progress.currentLocation,
            unlockedLocations: progress.unlockedLocations,
            totalExperience: progress.totalExperience,
            completedVideos: progress.completedVideos,
            completedActivities: progress.completedActivities,
            hueCoins: progress.hueCoins,
            level: progress.level,
          })
        }
      } catch (error) {
        console.error("Error updating wellness progress:", error)
      }
    }
  }

  const handleProgressUpdate = async (newProgress: any) => {
    if (user && userProgress) {
      const updatedProgress = {
        ...userProgress,
        ...newProgress,
      }
      setUserProgress(updatedProgress)
      try {
        await saveWellnessProgress({
          userId: user.uid,
          level: updatedProgress.level,
          totalExperience: updatedProgress.totalExperience,
          hueCoins: updatedProgress.hueCoins,
          completedVideos: updatedProgress.completedVideos,
          completedActivities: updatedProgress.completedActivities,
          unlockedLocations: updatedProgress.unlockedLocations,
          currentLocation: updatedProgress.currentLocation,
          badges: [],
          sessionHistory: [],
        })
        // Re-fetch progress
        const progress = await getWellnessProgress(user.uid)
        if (progress) {
          setUserProgress({
            currentLocation: progress.currentLocation,
            unlockedLocations: progress.unlockedLocations,
            totalExperience: progress.totalExperience,
            completedVideos: progress.completedVideos,
            completedActivities: progress.completedActivities,
            hueCoins: progress.hueCoins,
            level: progress.level,
          })
        }
      } catch (error) {
        console.error("Error updating wellness progress:", error)
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Wellness Center...</div>
  }

  const activities = [
    {
      id: "therapy",
      title: "Therapy Hub",
      description: "Connect with certified therapists",
      icon: Brain,
      color: "from-violet-500 to-purple-600",
      reward: 25,
      activeSessions: 12,
      totalParticipants: 89,
    },
    {
      id: "music",
      title: "Soothing Music",
      description: "Healing frequencies & soundscapes",
      icon: Music,
      color: "from-cyan-500 to-blue-600",
      reward: 15,
      activeSessions: 8,
      totalParticipants: 156,
    },
    {
      id: "meditation",
      title: "Meditation Studio",
      description: "Guided mindfulness sessions",
      icon: Flower2,
      color: "from-emerald-500 to-teal-600",
      reward: 20,
      activeSessions: 15,
      totalParticipants: 203,
    },
    {
      id: "breathing",
      title: "Breathing Coach",
      description: "Rhythmic breathing exercises",
      icon: Wind,
      color: "from-sky-500 to-indigo-600",
      reward: 12,
      activeSessions: 6,
      totalParticipants: 78,
    },
    {
      id: "nutrition",
      title: "Mood Nutrition",
      description: "Nourish your mind & body",
      icon: Apple,
      color: "from-orange-500 to-red-600",
      reward: 18,
      activeSessions: 4,
      totalParticipants: 45,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-950 relative overflow-hidden">
      {/* Twinkling Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse opacity-60"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Cosmic Nebula Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-1 h-20 bg-gradient-to-b from-white to-transparent rotate-45 animate-ping opacity-40"></div>
        <div className="absolute top-60 right-20 w-1 h-16 bg-gradient-to-b from-cyan-300 to-transparent rotate-12 animate-ping opacity-30 delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-1 h-12 bg-gradient-to-b from-purple-300 to-transparent -rotate-12 animate-ping opacity-50 delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Enhanced Branding */}
        <header className="flex justify-between items-center p-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                HealingHues
              </h1>
              <p className="text-slate-300 text-sm font-medium">Cosmic Wellness Sanctuary</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">571 Active Healers Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAnalytics(true)}
              className="group flex items-center space-x-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-pink-400/30"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 group-hover:animate-pulse" />
              </div>
              <div className="text-left">
                <div className="font-medium">Analytics</div>
                <div className="text-xs opacity-90">Track progress</div>
              </div>
            </button>

            <button
              onClick={() => setShowWellnessVideos(true)}
              className="group flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-emerald-400/30"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 group-hover:animate-pulse" />
              </div>
              <div className="text-left">
                <div className="font-medium">Wellness Videos</div>
                <div className="text-xs opacity-90">Quick healing content</div>
              </div>
            </button>

            <button
              onClick={() => setShowWellnessJourney(true)}
              className="group flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-indigo-400/30"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Map className="w-4 h-4 group-hover:animate-bounce" />
              </div>
              <div className="text-left">
                <div className="font-medium">Journey Map</div>
                <div className="text-xs opacity-90">Track your progress</div>
              </div>
            </button>

            {userProgress && <HueCoinsWallet balance={userProgress.hueCoins} />}
          </div>
        </header>

        {/* Rest of the component remains the same but will be enhanced by other components */}
        <div className="container mx-auto px-8 pb-12">
          <MoodGreeting mood={userMood} userName="Prabal" />
          <ActivityGrid
            activities={activities}
            onActivitySelect={setSelectedActivity}
            onShowLiveSessions={() => setShowLiveSessions(true)}
          />
          <CommunityLounge isVisible={showCommunity} onToggle={() => setShowCommunity(!showCommunity)} />
        </div>

        {showLiveSessions && <LiveSessionsPanel onClose={() => setShowLiveSessions(false)} />}
        {selectedActivity && (
          <SessionModal
            activity={activities.find((a) => a.id === selectedActivity)}
            onClose={() => setSelectedActivity(null)}
            onReward={(amount) => handleReward(amount)}
          />
        )}

        {showWellnessVideos && (
          <WellnessVideos
            onClose={() => setShowWellnessVideos(false)}
            onVideoComplete={(coins) => handleReward(coins)}
            userProgress={userProgress}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {showWellnessJourney && (
          <WellnessJourney
            onClose={() => setShowWellnessJourney(false)}
            userProgress={userProgress}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {showAnalytics && <AdvancedAnalytics onClose={() => setShowAnalytics(false)} />}
      </div>
    </div>
  )
}
