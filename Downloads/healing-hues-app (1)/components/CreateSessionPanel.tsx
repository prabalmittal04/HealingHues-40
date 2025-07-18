"use client"

import { useState } from "react"
import { X, Brain, Music, Heart, Wind, Utensils, Plus, Sparkles, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { saveLiveSession } from "@/lib/firestore"

interface CreateSessionPanelProps {
  onClose: () => void
  onActivitySelect: (activityId: string) => void
}

export default function CreateSessionPanel({ onClose, onActivitySelect }: CreateSessionPanelProps) {
  const { user } = useAuth()
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [sessionDetails, setSessionDetails] = useState({
    title: "",
    description: "",
    duration: 30,
    maxParticipants: 10,
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    tags: [] as string[],
  })
  const [isCreating, setIsCreating] = useState(false)

  const activities = [
    {
      id: "therapy",
      title: "Therapy Hub",
      description: "Create a therapy session or support group",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-400/30",
    },
    {
      id: "music",
      title: "Soothing Music",
      description: "Share healing music and soundscapes",
      icon: Music,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-400/30",
    },
    {
      id: "meditation",
      title: "Meditation Studio",
      description: "Guide others in meditation practice",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-400/30",
    },
    {
      id: "breathing",
      title: "Breathing Coach",
      description: "Lead breathing exercises and techniques",
      icon: Wind,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30",
    },
    {
      id: "nutrition",
      title: "Mood Nutrition",
      description: "Share nutritional guidance for wellness",
      icon: Utensils,
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-400/30",
    },
  ]

  const handleCreateSession = async () => {
    if (selectedActivity && user) {
      setIsCreating(true)
      try {
        // Only save session to liveSessions collection (not anywhere else)
        await saveLiveSession({
          userId: user.uid,
          hostName: user.displayName || "Cosmic Healer",
          title: sessionDetails.title,
          description: sessionDetails.description,
          activityType: selectedActivity,
          duration: sessionDetails.duration,
          maxParticipants: sessionDetails.maxParticipants,
          difficulty: sessionDetails.difficulty,
          tags: sessionDetails.tags,
          hostAvatar: user.photoURL || "/placeholder.svg",
        })
        // Session will only be visible in LiveSessionsPanel (not in wellnessSessions or anywhere else)
        console.log("Live session created successfully:", { activity: selectedActivity, details: sessionDetails })
        onClose()
      } catch (error) {
        console.error("Error creating live session:", error)
        alert("Failed to create live session. Please try again.")
      } finally {
        setIsCreating(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-slate-900/95 via-green-950/95 to-emerald-950/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Session</h2>
              <p className="text-slate-300">Start a new wellness activity for the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!selectedActivity ? (
            <>
              <h3 className="text-xl font-bold text-white mb-6">Choose Activity Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedActivity(activity.id)}
                    className={`${activity.bgColor} ${activity.borderColor} border backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${activity.color} rounded-full flex items-center justify-center shadow-lg`}
                      >
                        <activity.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{activity.title}</h4>
                        <p className="text-slate-300 text-sm">{activity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Create Session</span>
                      </div>
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white rotate-45" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Create {activities.find((a) => a.id === selectedActivity)?.title} Session
                  </h3>
                  <p className="text-slate-300">Fill in the details for your session</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Session Title</label>
                    <input
                      type="text"
                      value={sessionDetails.title}
                      onChange={(e) => setSessionDetails((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter session title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      value={sessionDetails.description}
                      onChange={(e) => setSessionDetails((prev) => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Describe your session..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Difficulty Level</label>
                    <select
                      value={sessionDetails.difficulty}
                      onChange={(e) => setSessionDetails((prev) => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="beginner" className="bg-slate-800">
                        Beginner
                      </option>
                      <option value="intermediate" className="bg-slate-800">
                        Intermediate
                      </option>
                      <option value="advanced" className="bg-slate-800">
                        Advanced
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Duration (minutes)</label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <input
                        type="number"
                        value={sessionDetails.duration || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 30
                          setSessionDetails((prev) => ({ ...prev, duration: value }))
                        }}
                        min="15"
                        max="180"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Max Participants</label>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-green-400" />
                      <input
                        type="number"
                        value={sessionDetails.maxParticipants || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 10
                          setSessionDetails((prev) => ({ ...prev, maxParticipants: value }))
                        }}
                        min="1"
                        max="50"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tags</label>
                    <input
                      type="text"
                      placeholder="Add tags separated by commas..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag)
                        setSessionDetails((prev) => ({ ...prev, tags }))
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateSession}
                  disabled={!sessionDetails.title || !sessionDetails.description || isCreating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isCreating ? "Creating..." : "Create Session"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
