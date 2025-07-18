"use client"

import { useState } from "react"
import { Users, Sparkles, ArrowRight, TrendingUp, Clock, Star } from "lucide-react"

interface Activity {
  id: string
  title: string
  description: string
  icon: any
  color: string
  reward: number
  activeSessions: number
  totalParticipants: number
}

interface ActivityGridProps {
  activities: Activity[]
  onActivitySelect: (id: string) => void
  onShowLiveSessions: () => void
}

export default function ActivityGrid({ activities, onActivitySelect, onShowLiveSessions }: ActivityGridProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3">
            Wellness Activities
          </h2>
          <p className="text-slate-300 text-lg">Choose your path to cosmic healing and inner peace</p>
          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">53 Live Sessions Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">571 Healers Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={onShowLiveSessions}
          className="group flex items-center space-x-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-purple-400/30"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 group-hover:animate-bounce" />
          </div>
          <div className="text-left">
            <div className="font-bold">Live Sessions</div>
            <div className="text-sm opacity-90">Join healing circles</div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {activities.map((activity) => {
          const IconComponent = activity.icon
          const isHovered = hoveredCard === activity.id

          return (
            <div
              key={activity.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCard(activity.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onActivitySelect(activity.id)}
            >
              <div
                className={`
                relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10
                transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:bg-white/10
                ${isHovered ? "transform rotate-1" : ""}
                min-h-[320px] flex flex-col justify-between
              `}
              >
                {/* Reward Badge */}
                <div
                  className={`
                  absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500
                  text-white text-sm font-bold px-4 py-2 rounded-full flex items-center space-x-2
                  transition-all duration-500 shadow-lg border border-yellow-300/30
                  ${isHovered ? "scale-110 animate-bounce" : "scale-0"}
                `}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>+{activity.reward}</span>
                </div>

                {/* Activity Stats */}
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">{activity.activeSessions} live</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400 font-medium">{activity.totalParticipants}</span>
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`
                  w-20 h-20 rounded-3xl bg-gradient-to-br ${activity.color} 
                  flex items-center justify-center mb-6 mx-auto mt-8
                  transition-all duration-500 shadow-xl
                  ${isHovered ? "rotate-12 scale-110 shadow-2xl" : ""}
                `}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-white font-bold text-xl mb-3">{activity.title}</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">{activity.description}</p>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`
                  absolute inset-0 rounded-3xl bg-gradient-to-br ${activity.color} opacity-0 -z-10
                  transition-opacity duration-500 blur-2xl
                  ${isHovered ? "opacity-20" : ""}
                `}
                ></div>

                {/* Cosmic Particles */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 left-2 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute top-1/2 left-1 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-500"></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2,847</p>
              <p className="text-slate-400 text-sm">Sessions Completed Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">18.5k</p>
              <p className="text-slate-400 text-sm">Minutes of Healing</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9</p>
              <p className="text-slate-400 text-sm">Average Session Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
