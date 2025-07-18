"use client"

import { useState } from "react"
import { X, TrendingUp, Calendar, Target, Award, BarChart3, Activity } from "lucide-react"

interface AdvancedAnalyticsProps {
  onClose: () => void
}

export default function AdvancedAnalytics({ onClose }: AdvancedAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [selectedMetric, setSelectedMetric] = useState("overview")

  const timeframes = [
    { id: "week", name: "This Week", days: 7 },
    { id: "month", name: "This Month", days: 30 },
    { id: "quarter", name: "3 Months", days: 90 },
    { id: "year", name: "This Year", days: 365 },
  ]

  const metrics = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "mood", name: "Mood Trends", icon: Activity },
    { id: "progress", name: "Progress", icon: TrendingUp },
    { id: "achievements", name: "Achievements", icon: Award },
  ]

  const analyticsData = {
    overview: {
      totalSessions: 42,
      totalVideos: 18,
      totalExperience: 1250,
      currentStreak: 7,
      averageSessionTime: "12 min",
      favoriteActivity: "Meditation",
    },
    weeklyProgress: [
      { day: "Mon", sessions: 3, mood: 8, experience: 45 },
      { day: "Tue", sessions: 2, mood: 7, experience: 30 },
      { day: "Wed", sessions: 4, mood: 9, experience: 60 },
      { day: "Thu", sessions: 1, mood: 6, experience: 15 },
      { day: "Fri", sessions: 3, mood: 8, experience: 45 },
      { day: "Sat", sessions: 5, mood: 9, experience: 75 },
      { day: "Sun", sessions: 2, mood: 8, experience: 30 },
    ],
    moodDistribution: [
      { mood: "Peaceful", count: 45, color: "from-blue-400 to-cyan-500" },
      { mood: "Grateful", count: 38, color: "from-green-400 to-emerald-500" },
      { mood: "Energetic", count: 32, color: "from-orange-400 to-red-500" },
      { mood: "Calm", count: 28, color: "from-purple-400 to-indigo-500" },
      { mood: "Anxious", count: 12, color: "from-yellow-400 to-orange-500" },
    ],
    achievements: [
      { name: "7-Day Streak", date: "2 days ago", type: "streak" },
      { name: "Meditation Master", date: "1 week ago", type: "activity" },
      { name: "Video Enthusiast", date: "2 weeks ago", type: "content" },
      { name: "Community Helper", date: "3 weeks ago", type: "social" },
    ],
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="relative p-8 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                Advanced Analytics
              </h2>
              <p className="text-slate-300 text-lg">Deep insights into your wellness journey</p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-8 border-b border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {metrics.map((metric) => {
                const IconComponent = metric.icon
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedMetric === metric.id
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{metric.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeframes.map((timeframe) => (
                  <option key={timeframe.id} value={timeframe.id} className="bg-slate-800">
                    {timeframe.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {selectedMetric === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analyticsData.overview.totalSessions}</p>
                    <p className="text-slate-400 text-sm">Total Sessions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analyticsData.overview.currentStreak}</p>
                    <p className="text-slate-400 text-sm">Day Streak</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analyticsData.overview.totalExperience}</p>
                    <p className="text-slate-400 text-sm">Total Experience</p>
                  </div>
                </div>
              </div>

              {/* Weekly Progress Chart */}
              <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
                <div className="grid grid-cols-7 gap-4">
                  {analyticsData.weeklyProgress.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-slate-400 text-sm mb-2">{day.day}</div>
                      <div className="relative h-32 bg-slate-700 rounded-lg overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-pink-500 transition-all duration-1000"
                          style={{ height: `${(day.sessions / 5) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-white font-bold mt-2">{day.sessions}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedMetric === "mood" && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Mood Distribution</h3>
                <div className="space-y-4">
                  {analyticsData.moodDistribution.map((mood, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-24 text-white font-medium">{mood.mood}</div>
                      <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${mood.color} transition-all duration-1000`}
                          style={{ width: `${(mood.count / 50) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-slate-400 text-sm">{mood.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedMetric === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsData.achievements.map((achievement, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{achievement.name}</p>
                      <p className="text-slate-400 text-sm">{achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
