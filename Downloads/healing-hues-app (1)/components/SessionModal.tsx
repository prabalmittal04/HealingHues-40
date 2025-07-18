"use client"

import { useState, useEffect } from "react"
import { X, Users, Play, Pause, Volume2, VolumeX, Award } from "lucide-react"

interface Activity {
  id: string
  title: string
  description: string
  icon: any
  color: string
  reward: number
}

interface SessionModalProps {
  activity: Activity | undefined
  onClose: () => void
  onReward: (amount: number) => void
  onActivityComplete?: (activityId: string, activityTitle: string, duration: number, coinsEarned: number, experienceGained: number) => void
}

export default function SessionModal({ activity, onClose, onReward, onActivityComplete }: SessionModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    if (!activity) return

    const interval = setInterval(() => {
      if (isPlaying) {
        setSessionTime((prev) => prev + 1)
        setProgress((prev) => Math.min(prev + 0.5, 100))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, activity])

  useEffect(() => {
    if (progress >= 100 && !showReward) {
      setShowReward(true)
      onReward(activity?.reward || 0)
      
      // Call activity completion function if provided
      if (onActivityComplete && activity) {
        const duration = Math.floor(sessionTime)
        const experienceGained = Math.floor(activity.reward * 0.5) // Experience is half of coins
        onActivityComplete(activity.id, activity.title, duration, activity.reward, experienceGained)
      }
    }
  }, [progress, showReward, activity, onReward, onActivityComplete, sessionTime])

  if (!activity) return null

  const IconComponent = activity.icon

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-md rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${activity.color} flex items-center justify-center`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{activity.title}</h2>
              <p className="text-purple-200">{activity.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Session Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Session Area */}
            <div className="lg:col-span-2">
              {/* Session Video/Audio Area */}
              <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-2xl p-8 mb-6 text-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full animate-spin"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border border-white rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full animate-ping"></div>
                </div>

                <div className="relative z-10">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-r ${activity.color} flex items-center justify-center mx-auto mb-6 animate-pulse`}
                  >
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Active Session</h3>
                  <p className="text-purple-200 mb-6">Focus on your breathing and let the healing begin</p>

                  {/* Session Timer */}
                  <div className="text-4xl font-bold text-white mb-6">{formatTime(sessionTime)}</div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-3 mb-6">
                    <div
                      className={`bg-gradient-to-r ${activity.color} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Session Instructions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">Session Guide</h4>
                <div className="space-y-3 text-purple-200">
                  <p>• Find a comfortable position and close your eyes</p>
                  <p>• Focus on your natural breathing rhythm</p>
                  <p>• Let thoughts pass without judgment</p>
                  <p>• Return attention to your breath when distracted</p>
                  <p>• Complete the full session to earn Hue Coins</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participants */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Participants (8)</span>
                </h4>
                <div className="space-y-2">
                  {["Sarah M.", "Alex K.", "Jordan L.", "Casey R."].map((name, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {name[0]}
                      </div>
                      <span className="text-purple-200">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward Info */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>Session Reward</span>
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-yellow-400">+{activity.reward}</div>
                  <div className="text-yellow-300">Hue Coins</div>
                </div>
                <p className="text-purple-200 text-sm mt-2">Complete the session to earn your reward!</p>
              </div>

              {/* Mood Check */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">How are you feeling?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["😌", "😊", "🤗", "✨"].map((emoji, index) => (
                    <button
                      key={index}
                      className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-2xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Celebration */}
        {showReward && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Session Complete!</h3>
              <p className="text-white mb-4">You earned {activity.reward} Hue Coins!</p>
              <button
                onClick={onClose}
                className="bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300"
              >
                Awesome!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
