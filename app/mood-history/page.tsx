"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  TrendingUp,
  Clock,
  BarChart,
  PieChart,
  Activity,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import { MoodChart } from "@/components/mood-chart"
import { MoodBarChart } from "@/components/mood-bar-chart"
import { MoodPieChart } from "@/components/mood-pie-chart"
import { MoodHeatmap } from "@/components/mood-heatmap"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { getMoodStatistics, getUserMoodEntries } from "@/lib/firestore"
import { Alert, AlertDescription } from "@/components/ui/alert"

const moodColors = {
  Happy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  Good: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  Neutral: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  Sad: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  Excellent: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
}

interface MoodEntryDisplay {
  id?: string
  mood: number
  moodLabel: string
  note?: string
  timestamp: Date
  userId: string
}

interface MoodStats {
  totalEntries: number
  averageMood: number
  mostCommonMood: string
  streakDays: number
  last7DaysTrend: { date: string; moodValue: number }[]
  moodCounts: Record<string, number>
}

export default function MoodHistoryPage() {
  const { user } = useAuth()
  const [moodEntries, setMoodEntries] = useState<MoodEntryDisplay[]>([])
  const [moodStats, setMoodStats] = useState<MoodStats>({
    totalEntries: 0,
    averageMood: 0,
    mostCommonMood: "Calm",
    streakDays: 0,
    moodCounts: {},
    last7DaysTrend: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Loading mood data for user ${user.uid}`)

      // Load mood entries
      const entries = await getUserMoodEntries(user.uid)
      console.log("Raw mood entries:", entries)

      // Convert entries to display format
      const displayEntries: MoodEntryDisplay[] = entries.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp instanceof Date ? entry.timestamp : entry.timestamp.toDate(),
      }))

      console.log("Processed mood entries:", displayEntries)
      setMoodEntries(displayEntries)

      // Load mood statistics
      const stats = await getMoodStatistics(user.uid)
      console.log("Mood statistics:", stats)
      setMoodStats(stats)

      if (entries.length === 0) {
        console.log("No mood entries found for user")
      }
    } catch (error) {
      console.error("Error loading mood data:", error)
      setError("Unable to load mood data. Please try refreshing the page.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleRefresh = () => {
    loadData()
  }

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString()
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <ProtectedRoute requireEmailVerification>
      <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900">
        <Navigation />

        <main className="max-w-7xl mx-auto p-6 pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  {error}
                  <Button onClick={handleRefresh} variant="outline" size="sm" className="ml-2 bg-transparent">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Header */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl text-slate-700 dark:text-slate-200 flex items-center">
                      <TrendingUp className="w-8 h-8 mr-3 text-green-500" />
                      Your Mood Journey
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Track your emotional patterns and celebrate your progress
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      className="rounded-xl bg-transparent"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" className="rounded-xl bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {isLoading ? "..." : moodStats.averageMood.toFixed(1)}
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Average Mood</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-800/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {isLoading ? "..." : moodStats.totalEntries}
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Total Entries</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/30 dark:to-indigo-800/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {isLoading ? "..." : moodStats.streakDays}
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Day Streak</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Keep it up!</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">😌</div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Most Common</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {isLoading ? "..." : moodStats.mostCommonMood}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Line Chart */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-emerald-500" />
                    Mood Trends (7 Days)
                  </CardTitle>
                  <CardDescription>Your emotional patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                  ) : (
                    <MoodChart trendData={moodStats.last7DaysTrend} />
                  )}
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-blue-500" />
                    Mood Distribution
                  </CardTitle>
                  <CardDescription>Frequency of different moods</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <MoodBarChart moodCounts={moodStats.moodCounts} />
                  )}
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                    Mood Breakdown
                  </CardTitle>
                  <CardDescription>Overall emotional distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <MoodPieChart moodCounts={moodStats.moodCounts} />
                  )}
                </CardContent>
              </Card>

              {/* Heatmap */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                    Mood Heatmap
                  </CardTitle>
                  <CardDescription>Daily mood intensity</CardDescription>
                </CardHeader>
                <CardContent>
                  <MoodHeatmap />
                </CardContent>
              </Card>
            </div>

            {/* Mood Timeline */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Entries
                </CardTitle>
                <CardDescription>Your mood check-ins and reflections</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-start space-x-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50"
                      >
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {moodEntries.length > 0 ? (
                      moodEntries.map((entry, index) => (
                        <motion.div
                          key={entry.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-white/60 to-slate-50/60 dark:from-slate-800/60 dark:to-slate-700/60 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="text-3xl">
                            {entry.mood === 1 && "😞"}
                            {entry.mood === 2 && "😐"}
                            {entry.mood === 3 && "🙂"}
                            {entry.mood === 4 && "😄"}
                            {entry.mood === 5 && "🥰"}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge
                                className={`${
                                  moodColors[entry.moodLabel as keyof typeof moodColors] || "bg-gray-100 text-gray-800"
                                } border-0`}
                              >
                                {entry.moodLabel}
                              </Badge>
                              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                              </div>
                              <div className="flex items-center">
                                <div className="flex space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < entry.mood ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {entry.note && (
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{entry.note}</p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400">
                          No mood entries yet. Start tracking your emotions on the dashboard!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
