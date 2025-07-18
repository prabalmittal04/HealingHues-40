"use client"

import { useState, useEffect } from "react"
import { X, Heart, Play, Clock, Star, Users, Sparkles } from "lucide-react"
import { collection, getDocs, query, orderBy, limit, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface MeditationSession {
  id: string
  title: string
  instructor: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  description: string
  audioUrl: string
  imageUrl: string
  participants: number
  rating: number
  hueCoinsReward: number
  tags: string[]
  isCompleted?: boolean
}

interface MeditationStudioProps {
  onClose: () => void
  userData: any
  onReward: (amount: number) => void
  onProgressUpdate: (progress: any) => void
}

export default function MeditationStudio({ onClose, userData, onReward, onProgressUpdate }: MeditationStudioProps) {
  const [sessions, setSessions] = useState<MeditationSession[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: "all", name: "All Sessions", color: "from-purple-500 to-pink-500" },
    { id: "mindfulness", name: "Mindfulness", color: "from-green-500 to-emerald-500" },
    { id: "sleep", name: "Sleep", color: "from-indigo-500 to-purple-500" },
    { id: "stress-relief", name: "Stress Relief", color: "from-blue-500 to-cyan-500" },
    { id: "focus", name: "Focus", color: "from-orange-500 to-yellow-500" },
    { id: "healing", name: "Healing", color: "from-pink-500 to-rose-500" },
    { id: "chakra", name: "Chakra", color: "from-violet-500 to-purple-500" },
  ]

  useEffect(() => {
    loadMeditationSessions()
  }, [])

  const loadMeditationSessions = async () => {
    try {
      const sessionsQuery = query(collection(db, "meditationSessions"), orderBy("rating", "desc"), limit(50))
      const sessionsSnapshot = await getDocs(sessionsQuery)

      if (sessionsSnapshot.empty) {
        setSessions(sampleSessions)
      } else {
        const sessionsData = sessionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MeditationSession[]
        setSessions(sessionsData)
      }
    } catch (error) {
      console.error("Error loading meditation sessions:", error)
      setSessions(sampleSessions)
    }
    setLoading(false)
  }

  const sampleSessions: MeditationSession[] = [
    {
      id: "mindful-morning",
      title: "Mindful Morning Awakening",
      instructor: "Sarah Chen",
      duration: 600, // 10 minutes
      difficulty: "beginner",
      category: "mindfulness",
      description: "Start your day with gentle awareness and positive intention setting",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 15420,
      rating: 4.8,
      hueCoinsReward: 25,
      tags: ["morning", "mindfulness", "gentle"],
    },
    {
      id: "deep-sleep",
      title: "Deep Sleep Journey",
      instructor: "Michael Rivers",
      duration: 1800, // 30 minutes
      difficulty: "beginner",
      category: "sleep",
      description: "Drift into peaceful slumber with this guided sleep meditation",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 28750,
      rating: 4.9,
      hueCoinsReward: 35,
      tags: ["sleep", "relaxation", "peaceful"],
    },
    {
      id: "stress-release",
      title: "Stress Release & Renewal",
      instructor: "Dr. Elena Martinez",
      duration: 900, // 15 minutes
      difficulty: "intermediate",
      category: "stress-relief",
      description: "Release tension and restore inner balance with proven techniques",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 19340,
      rating: 4.7,
      hueCoinsReward: 30,
      tags: ["stress", "tension", "balance"],
    },
    {
      id: "laser-focus",
      title: "Laser Focus Meditation",
      instructor: "James Thompson",
      duration: 720, // 12 minutes
      difficulty: "intermediate",
      category: "focus",
      description: "Sharpen your concentration and mental clarity for peak performance",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 12890,
      rating: 4.6,
      hueCoinsReward: 28,
      tags: ["focus", "concentration", "clarity"],
    },
    {
      id: "heart-healing",
      title: "Heart Healing Sanctuary",
      instructor: "Luna Goddess",
      duration: 1200, // 20 minutes
      difficulty: "advanced",
      category: "healing",
      description: "Open your heart to love and healing with this transformative practice",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 8750,
      rating: 4.9,
      hueCoinsReward: 40,
      tags: ["healing", "heart", "love"],
    },
    {
      id: "chakra-alignment",
      title: "Complete Chakra Alignment",
      instructor: "Ravi Patel",
      duration: 2100, // 35 minutes
      difficulty: "advanced",
      category: "chakra",
      description: "Balance and align all seven chakras for optimal energy flow",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 6420,
      rating: 4.8,
      hueCoinsReward: 45,
      tags: ["chakra", "energy", "alignment"],
    },
    {
      id: "walking-meditation",
      title: "Mindful Walking Practice",
      instructor: "Nature Guide",
      duration: 900, // 15 minutes
      difficulty: "beginner",
      category: "mindfulness",
      description: "Connect with nature through mindful walking meditation",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 11230,
      rating: 4.5,
      hueCoinsReward: 22,
      tags: ["walking", "nature", "mindful"],
    },
    {
      id: "anxiety-relief",
      title: "Anxiety Relief & Calm",
      instructor: "Dr. Peace Maker",
      duration: 840, // 14 minutes
      difficulty: "beginner",
      category: "stress-relief",
      description: "Find immediate relief from anxiety with gentle breathing techniques",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      imageUrl: "/placeholder.svg",
      participants: 22100,
      rating: 4.7,
      hueCoinsReward: 26,
      tags: ["anxiety", "calm", "breathing"],
    },
  ]

  const filteredSessions =
    selectedCategory === "all" ? sessions : sessions.filter((session) => session.category === selectedCategory)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400 bg-green-400/20"
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20"
      case "advanced":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const startSession = async (session: MeditationSession) => {
    setSelectedSession(session)
    setIsPlaying(true)
    // Simulate session completion after a short delay
    setTimeout(async () => {
      onReward(session.hueCoinsReward)
      setIsPlaying(false)
      setSelectedSession(null)

      // Update user progress in Firestore
      if (userData && userData.uid) {
        const userRef = doc(db, "users", userData.uid)
        const updatedCompletedActivities = [...(userData.completedActivities || []), session.id]
        const updatedSessionHistory = [
          ...(userData.sessionHistory || []),
          {
            id: session.id,
            type: "meditation",
            title: session.title,
            completedAt: new Date(),
            reward: session.hueCoinsReward,
          },
        ]
        await updateDoc(userRef, {
          completedActivities: updatedCompletedActivities,
          sessionHistory: updatedSessionHistory,
          totalExperience: (userData.totalExperience || 0) + session.hueCoinsReward,
        })
        onProgressUpdate({
          ...userData,
          completedActivities: updatedCompletedActivities,
          sessionHistory: updatedSessionHistory,
          totalExperience: (userData.totalExperience || 0) + session.hueCoinsReward,
        })
      }
    }, 3000) // Simulate session completion
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-pink-950/95 to-rose-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Meditation Studio</h2>
              <p className="text-slate-300">Guided meditations for inner peace and clarity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Categories Sidebar */}
          <div className="w-1/4 border-r border-white/10 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm opacity-80">
                    {category.id === "all"
                      ? `${sessions.length} sessions`
                      : `${sessions.filter((s) => s.category === category.id).length} sessions`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {categories.find((c) => c.id === selectedCategory)?.name || "All Sessions"}
              </h3>
              <div className="text-slate-300">{filteredSessions.length} sessions available</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                  onClick={() => startSession(session)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}
                    >
                      {session.difficulty}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-300">{session.rating}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-sm text-slate-300 mb-2">by {session.instructor}</p>
                    <p className="text-sm text-slate-400 line-clamp-2">{session.description}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-slate-300">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(session.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{session.participants.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">+{session.hueCoinsReward} coins</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {session.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white/10 text-xs text-slate-300 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Session Modal */}
        {selectedSession && isPlaying && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gradient-to-br from-pink-900/90 to-rose-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 text-center border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedSession.title}</h3>
              <p className="text-slate-300 mb-4">with {selectedSession.instructor}</p>
              <p className="text-slate-400 mb-6">Session in progress...</p>

              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>

              <button
                onClick={() => {
                  setIsPlaying(false)
                  setSelectedSession(null)
                }}
                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
