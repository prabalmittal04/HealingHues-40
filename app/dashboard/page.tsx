"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Heart, BarChart3, Users, MessageCircle, Plus, Sparkles, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { HueBotChat } from "@/components/hue-bot-chat"
import { useAuth } from "@/hooks/useAuth"
import {
  saveMoodEntry,
  saveGratitudeEntry,
  getGratitudeEntries,
  getMoodStatistics,
  getMoodEntries,
} from "@/lib/firestore"
import type { GratitudeEntry, MoodEntry } from "@/lib/firestore"
import { YourProgress } from "@/components/YourProgress"
import { MoodTrendChart } from "@/components/MoodTrendChart"
import { Alert, AlertDescription } from "@/components/ui/alert"

const moods = [
  { emoji: "😞", label: "Sad", value: 1, color: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
  { emoji: "😐", label: "Neutral", value: 2, color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { emoji: "🙂", label: "Good", value: 3, color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { emoji: "😄", label: "Happy", value: 4, color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  { emoji: "🥰", label: "Excellent", value: 5, color: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
]

type MoodStats = {
  totalEntries: number;
  averageMood: number;
  mostCommonMood: string;
  streakDays: number;
  last7DaysTrend: { date: string; moodValue: number }[];
  moodCounts: Record<string, number>;
};

export default function DashboardPage() {
  const { user, userProfile } = useAuth()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodNote, setMoodNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [gratitudeText, setGratitudeText] = useState("")
  const [showGratitudeModal, setShowGratitudeModal] = useState(false)
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [moodStats, setMoodStats] = useState<MoodStats>({
    totalEntries: 0,
    averageMood: 0,
    mostCommonMood: "No data yet",
    streakDays: 0,
    last7DaysTrend: [],
    moodCounts: {},
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data when user is available
  useEffect(() => {
    if (user?.uid) {
      console.log("Setting up dashboard data for user:", user.uid)

      // Set up real-time mood entries listener
      const unsubscribeMoodEntries = getMoodEntries(user.uid, (entries) => {
        console.log("Dashboard received mood entries:", entries.length)
        setMoodEntries(entries)

        // Recalculate stats when mood entries change
        loadMoodStatistics()
      })

      // Set up gratitude entries listener
      const unsubscribeGratitude = getGratitudeEntries(user.uid, (entries) => {
        console.log("Dashboard received gratitude entries:", entries.length)
        setGratitudeEntries(entries)
      })

      // Initial stats load
      loadMoodStatistics()

      return () => {
        unsubscribeMoodEntries()
        unsubscribeGratitude()
      }
    }
  }, [user?.uid])

  const loadMoodStatistics = async () => {
    if (!user?.uid) return

    setIsLoadingStats(true)
    setError(null)

    try {
      console.log("Loading mood statistics for user:", user.uid)
      const stats = await getMoodStatistics(user.uid)
      console.log("Mood statistics loaded:", stats)
      setMoodStats(stats)
    } catch (error) {
      console.error("Error loading mood statistics:", error)
      setError("Unable to load mood statistics. Please try refreshing the page.")
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleMoodSubmit = async () => {
    if (selectedMood === null || !user?.uid) return

    setIsLoading(true)
    setError(null)

    try {
      const selectedMoodData = moods.find((m) => m.value === selectedMood)
      if (selectedMoodData) {
        console.log("Saving mood entry:", { mood: selectedMood, label: selectedMoodData.label, note: moodNote })
        await saveMoodEntry(user.uid, selectedMood, selectedMoodData.label, moodNote)
        setSelectedMood(null)
        setMoodNote("")

        // Stats will be updated automatically via the mood entries listener
      }
    } catch (error) {
      console.error("Error saving mood:", error)
      setError("Unable to save mood entry. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGratitudeSubmit = async () => {
    if (!gratitudeText.trim() || !user?.uid) return

    try {
      await saveGratitudeEntry(user.uid, gratitudeText)
      setGratitudeText("")
      setShowGratitudeModal(false)
    } catch (error) {
      console.error("Error saving gratitude:", error)
      setError("Unable to save gratitude entry. Please try again.")
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <ProtectedRoute requireEmailVerification>
      <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900">
        <Navigation />

        <main className="max-w-7xl mx-auto p-4 md:p-6 pt-20 md:pt-24">
          <div>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Welcome Header */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg mb-6 md:mb-8">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL || "/placeholder.svg"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      "🙂"
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200">
                      Hi {userProfile?.displayName || user?.displayName || "there"}, how are you feeling today?
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      Take a moment to check in with yourself. I'm here to listen.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Mood Tracker */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-500" />
                      How are you feeling right now?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="grid grid-cols-5 gap-2 md:gap-3 mb-6">
                      {moods.map((mood) => (
                        <motion.button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex flex-col items-center p-2 md:p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedMood === mood.value
                              ? "border-green-400 bg-green-50 dark:bg-green-900/20 shadow-lg"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          } ${mood.color}`}
                        >
                          <span className="text-2xl md:text-3xl mb-1 md:mb-2">{mood.emoji}</span>
                          <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">
                            {mood.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    {selectedMood && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div>
                          <Label htmlFor="mood-note" className="text-slate-700 dark:text-slate-200">Want to reflect more? (Optional)</Label>
                          <Textarea
                            id="mood-note"
                            placeholder="What's contributing to this feeling?"
                            value={moodNote}
                            onChange={(e) => setMoodNote(e.target.value)}
                            className="mt-2 rounded-xl"
                          />
                        </div>
                        <Button
                          onClick={handleMoodSubmit}
                          disabled={isLoading}
                          className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                        >
                          {isLoading ? "Saving..." : "Log My Mood"}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* HueBot Chat Interface - Integrated into Dashboard */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
                      Chat with HueBot
                    </CardTitle>
                    <CardDescription>Your empathetic AI companion is here to listen and support you</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="h-[32rem] md:h-[40rem]">
                      <HueBotChat />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Your Progress (Dynamic Data) */}
                {isLoadingStats ? (
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <YourProgress
                    averageMood={moodStats.averageMood}
                    totalEntries={moodStats.totalEntries}
                    streakDays={moodStats.streakDays}
                    mostCommonMood={moodStats.mostCommonMood}
                  />
                )}

                {/* 7-Day Trend (Dynamic Data) */}
                <MoodTrendChart trendData={moodStats.last7DaysTrend} />

                {/* Recent Reflections */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg text-slate-700 dark:text-slate-200 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                        Gratitude Journal
                      </CardTitle>
                      <Dialog open={showGratitudeModal} onOpenChange={setShowGratitudeModal}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-full">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader>
                            <DialogTitle>Today's Gratitude</DialogTitle>
                            <DialogDescription>What are you grateful for today?</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="I'm grateful for..."
                              value={gratitudeText}
                              onChange={(e) => setGratitudeText(e.target.value)}
                              className="rounded-xl"
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={handleGratitudeSubmit}
                                disabled={!gratitudeText.trim()}
                                className="flex-1 rounded-xl"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setShowGratitudeModal(false)}
                                className="rounded-xl"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-3">
                      {gratitudeEntries.length > 0 ? (
                        gratitudeEntries.slice(0, 3).map((entry) => (
                          <div
                            key={entry.id}
                            className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                          >
                            <p className="text-sm text-slate-700 dark:text-slate-200 mb-1">{entry.text}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(entry.timestamp)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Start your gratitude journey by adding your first entry!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Link href="/mood-history">
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-6 h-6 text-green-500" />
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Mood History</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">View detailed analytics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/medical-help">
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Heart className="w-6 h-6 text-red-500" />
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Medical Help</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AI health assistant</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/medicine-ordering">
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-6 h-6 text-blue-500" />
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Order Medicine</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Quick & convenient</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/community">
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-6 h-6 text-purple-500" />
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Community</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Connect with peers</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
