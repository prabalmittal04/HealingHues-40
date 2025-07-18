"use client"

import { useState } from "react"
import { Heart, Sun, Cloud, Zap, Moon } from "lucide-react"

interface MoodGreetingProps {
  mood: string
  userName: string
}

export default function MoodGreeting({ mood, userName }: MoodGreetingProps) {
  const [currentMood, setCurrentMood] = useState(mood)

  const moodConfig = {
    happy: {
      message: `Hey ${userName} 👋 Your energy is radiant today! Let's amplify that joy ✨`,
      gradient: "from-yellow-400 via-orange-400 to-pink-400",
      icon: Sun,
      emoji: "😊",
    },
    calm: {
      message: `Hey ${userName} 👋 You're in a peaceful space. Let's nurture this serenity 🌸`,
      gradient: "from-blue-400 via-purple-400 to-indigo-400",
      icon: Moon,
      emoji: "😌",
    },
    anxious: {
      message: `Hey ${userName} 👋 It's okay to feel anxious. Let's find balance together 💜`,
      gradient: "from-purple-400 via-pink-400 to-rose-400",
      icon: Heart,
      emoji: "🤗",
    },
    sad: {
      message: `Hey ${userName} 👋 Your feelings are valid. We're here to support you 🌈`,
      gradient: "from-indigo-400 via-blue-400 to-cyan-400",
      icon: Cloud,
      emoji: "🫂",
    },
    energetic: {
      message: `Hey ${userName} 👋 Your vibrant energy is amazing! Let's channel it positively ⚡`,
      gradient: "from-green-400 via-teal-400 to-blue-400",
      icon: Zap,
      emoji: "🚀",
    },
  }

  const config = moodConfig[currentMood as keyof typeof moodConfig] || moodConfig.calm
  const IconComponent = config.icon

  return (
    <div className={`relative mb-8 p-8 rounded-3xl bg-gradient-to-r ${config.gradient} shadow-2xl overflow-hidden`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full animate-spin"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <span className="text-4xl">{config.emoji}</span>
          </div>

          <p className="text-white text-xl font-medium leading-relaxed mb-4">{config.message}</p>

          {/* Mood Selector */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodConfig).map(([moodKey, moodData]) => (
              <button
                key={moodKey}
                onClick={() => setCurrentMood(moodKey)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentMood === moodKey
                    ? "bg-white text-gray-800 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                {moodData.emoji} {moodKey.charAt(0).toUpperCase() + moodKey.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Mood Visualization */}
        <div className="hidden md:block">
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute inset-4 bg-white/30 rounded-full flex items-center justify-center">
              <IconComponent className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
