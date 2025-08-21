"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, BookOpen, BarChart3, Lightbulb, Edit3, Heart } from "lucide-react"
import { differenceInDays } from "date-fns"
import { motion } from "framer-motion"
import {
  getHueCycleEntries,
  getLatestCyclePrediction,
  getHueCycleInsights,
  generateAIInsights,
  type HueCycleProfile,
  type HueCycleEntry,
  type CyclePrediction,
  type HueCycleInsight,
} from "@/lib/huecycle-service"
import HueCycleCalendar from "./HueCycleCalendar"
import HueCycleDiary from "./HueCycleDiary"
import HueCycleAnalytics from "./HueCycleAnalytics"
import HueTips from "./HueTips"

interface HueCycleDashboardProps {
  profile?: HueCycleProfile | null
}

// Enhanced sample data generator
const generateSampleData = (userId: string) => {
  const today = new Date()
  const lastPeriodDate = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)

  const sampleProfile: HueCycleProfile = {
    id: userId,
    userId,
    age: 28,
    height: 165,
    weight: 60,
    lastPeriodDate,
    averageCycleLength: 28,
    averagePeriodLength: 5,
    contraceptiveMethod: "none",
    medications: [],
    healthConditions: [],
    lifestyleFactors: ["regular-exercise", "balanced-diet"],
    commonSymptoms: ["cramps", "mood-swings", "bloating"],
    moodPatterns: ["irritable-before-period", "energetic-mid-cycle"],
    trackingGoals: ["predict-period", "understand-patterns"],
    notificationPreferences: ["period-reminder", "fertile-window"],
    privacyLevel: "private",
    fertilityGoals: "track-cycle",
    additionalNotes: "",
    isOnboardingComplete: true,
    createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: today,
  }

  const sampleEntries: HueCycleEntry[] = []
  const moodOptions = ["happy", "energetic", "calm", "emotional", "irritable", "tired", "confident", "anxious"]
  const symptomOptions = ["cramps", "bloating", "headache", "breast-tenderness", "fatigue", "acne", "food-cravings"]

  for (let i = 0; i < 30; i++) {
    const entryDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const daysSinceLastPeriod = differenceInDays(entryDate, lastPeriodDate)

    let periodFlow: "none" | "light" | "medium" | "heavy" = "none"
    let symptoms: string[] = []
    let mood: string[] = []
    let energy = 3

    if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < 5) {
      // Period days
      if (daysSinceLastPeriod === 0 || daysSinceLastPeriod === 1) {
        periodFlow = "heavy"
        symptoms = ["cramps", "bloating", "fatigue"]
        mood = ["emotional", "tired"]
        energy = 2
      } else if (daysSinceLastPeriod === 2) {
        periodFlow = "medium"
        symptoms = ["cramps", "bloating"]
        mood = ["calm", "tired"]
        energy = 2
      } else {
        periodFlow = "light"
        symptoms = ["fatigue"]
        mood = ["calm"]
        energy = 3
      }
    } else if (daysSinceLastPeriod >= 12 && daysSinceLastPeriod <= 16) {
      // Ovulation phase
      symptoms = []
      mood = ["happy", "energetic", "confident"]
      energy = 5
    } else if (daysSinceLastPeriod >= 20) {
      // PMS phase
      symptoms = ["bloating", "breast-tenderness", "food-cravings"]
      mood = ["irritable", "emotional"]
      energy = 2
    } else {
      // Follicular phase
      mood = ["happy", "energetic"]
      energy = 4
    }

    sampleEntries.push({
      id: `entry_${i}`,
      userId,
      date: entryDate,
      periodFlow,
      symptoms,
      mood,
      energy,
      sleep: Math.floor(Math.random() * 2) + 7,
      exercise: i % 3 === 0 ? ["walking"] : [],
      notes: i === 0 ? "Feeling grateful and peaceful today. My body feels strong and balanced." : "",
      medications: [],
      sexualActivity: false,
      timestamp: entryDate,
    })
  }

  const nextPeriodStart = new Date(lastPeriodDate.getTime() + 28 * 24 * 60 * 60 * 1000)
  const samplePrediction: CyclePrediction = {
    id: "prediction_1",
    userId,
    predictedPeriodStart: nextPeriodStart,
    predictedPeriodEnd: new Date(nextPeriodStart.getTime() + 5 * 24 * 60 * 60 * 1000),
    predictedOvulation: new Date(lastPeriodDate.getTime() + 14 * 24 * 60 * 60 * 1000),
    fertilityWindowStart: new Date(lastPeriodDate.getTime() + 12 * 24 * 60 * 60 * 1000),
    fertilityWindowEnd: new Date(lastPeriodDate.getTime() + 16 * 24 * 60 * 60 * 1000),
    confidence: 85,
    basedOnCycles: 3,
    createdAt: today,
  }

  const sampleInsights: HueCycleInsight[] = [
    {
      id: "insight_1",
      userId,
      type: "pattern",
      title: "Evening Reflection Pattern",
      description: "Your reflective mood increases during late evenings, especially in your luteal phase.",
      recommendation: "Consider evening journaling sessions during this time for deeper self-connection.",
      confidence: 85,
      dataPoints: ["Evening entries: 70%", "Luteal phase correlation: 85%"],
      isRead: false,
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "insight_2",
      userId,
      type: "lifestyle",
      title: "Follicular Phase Writing Flow",
      description: "You write more consistently during your follicular phase, with 40% more entries.",
      recommendation: "Use this natural creative energy for important journaling and goal-setting.",
      confidence: 90,
      dataPoints: ["Follicular entries: +40%", "Word count: +60%"],
      isRead: false,
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ]

  return {
    profile: sampleProfile,
    entries: sampleEntries,
    prediction: samplePrediction,
    insights: sampleInsights,
  }
}

export default function HueCycleDashboard({ profile: initialProfile }: HueCycleDashboardProps) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<HueCycleProfile | null>(initialProfile || null)
  const [entries, setEntries] = useState<HueCycleEntry[]>([])
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null)
  const [insights, setInsights] = useState<HueCycleInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tracker")

  useEffect(() => {
    if (user?.uid) {
      loadDashboardData()
    }
  }, [user?.uid])

  const loadDashboardData = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)

      const [entriesData, predictionData, insightsData] = await Promise.all([
        getHueCycleEntries(user.uid, 90),
        getLatestCyclePrediction(user.uid),
        getHueCycleInsights(user.uid, 10),
      ])

      if (!profile || entriesData.length === 0) {
        const sampleData = generateSampleData(user.uid)
        setProfile(sampleData.profile)
        setEntries(sampleData.entries)
        setPrediction(sampleData.prediction)
        setInsights(sampleData.insights)

        try {
          await generateAIInsights(user.uid, sampleData.profile, sampleData.entries)
        } catch (error) {
          console.error("Error generating AI insights:", error)
        }
      } else {
        setEntries(entriesData)
        setPrediction(predictionData)
        setInsights(insightsData)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      if (user?.uid) {
        const sampleData = generateSampleData(user.uid)
        setProfile(sampleData.profile)
        setEntries(sampleData.entries)
        setPrediction(sampleData.prediction)
        setInsights(sampleData.insights)
      }
    } finally {
      setLoading(false)
    }
  }

  const getCurrentCyclePhase = () => {
    if (!profile?.lastPeriodDate) {
      return {
        phase: "Unknown",
        dayInCycle: 1,
        description: "Start tracking to discover your rhythm",
        emoji: "🌱",
        color: "from-slate-400 to-slate-500",
        bgColor: "bg-slate-400",
      }
    }

    const today = new Date()
    const daysSinceLastPeriod = differenceInDays(today, profile.lastPeriodDate)
    const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

    if (dayInCycle <= (profile.averagePeriodLength || 5)) {
      return {
        phase: "Menstrual",
        dayInCycle,
        description: "Rest and renewal phase",
        emoji: "🌙",
        color: "from-red-400 to-rose-500",
        bgColor: "bg-red-400",
      }
    } else if (dayInCycle <= 13) {
      return {
        phase: "Follicular",
        dayInCycle,
        description: "Energy building phase",
        emoji: "🌱",
        color: "from-green-400 to-emerald-500",
        bgColor: "bg-green-400",
      }
    } else if (dayInCycle <= 16) {
      return {
        phase: "Ovulation",
        dayInCycle,
        description: "Peak energy and fertility",
        emoji: "🌸",
        color: "from-pink-400 to-rose-500",
        bgColor: "bg-pink-400",
      }
    } else {
      return {
        phase: "Luteal",
        dayInCycle,
        description: "Reflection and preparation",
        emoji: "🍂",
        color: "from-amber-400 to-orange-500",
        bgColor: "bg-amber-400",
      }
    }
  }

  const currentPhase = getCurrentCyclePhase()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2 font-serif">Loading HueCycle</h2>
          <p className="text-slate-600 dark:text-slate-400">Preparing your wellness insights...</p>
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl">
          <CardContent className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2 font-serif">
              Welcome to HueCycle
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Your intelligent wellness companion for cycle tracking and insights
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full px-8 py-3 shadow-lg font-medium"
            >
              Begin Your Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-4 font-serif">
            HueCycle
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xl font-light">
            Intelligent wellness tracking with beautiful insights
          </p>
        </motion.div>

        {/* Current Phase Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-6xl"
                  >
                    {currentPhase.emoji}
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 font-serif">
                      {currentPhase.phase} Phase
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Day {currentPhase.dayInCycle} of {profile.averageCycleLength || 28}
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 mt-2">{currentPhase.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-slate-700 dark:text-slate-200 font-serif">
                    {prediction ? Math.max(0, differenceInDays(prediction.predictedPeriodStart, new Date())) : 0}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">days until next period</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Cycle Progress</span>
                  <span>{Math.round((currentPhase.dayInCycle / (profile.averageCycleLength || 28)) * 100)}%</span>
                </div>
                <Progress
                  value={(currentPhase.dayInCycle / (profile.averageCycleLength || 28)) * 100}
                  className="h-3 bg-slate-200 dark:bg-slate-700"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lg">
              <TabsTrigger
                value="tracker"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mb-1" />
                <span className="text-xs">Tracker</span>
              </TabsTrigger>
              <TabsTrigger
                value="diary"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Edit3 className="w-4 h-4 mb-1" />
                <span className="text-xs">Diary</span>
              </TabsTrigger>
              <TabsTrigger
                value="journal"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mb-1" />
                <span className="text-xs">Journal</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mb-1" />
                <span className="text-xs">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="tips"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Lightbulb className="w-4 h-4 mb-1" />
                <span className="text-xs">HueTips</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
              <TabsContent value="tracker" className="p-8 space-y-6">
                <HueCycleCalendar profile={profile} entries={entries} onEntryUpdate={loadDashboardData} />
              </TabsContent>

              <TabsContent value="diary" className="p-8">
                <HueCycleDiary profile={profile} entries={entries} onEntryUpdate={loadDashboardData} />
              </TabsContent>

              <TabsContent value="journal" className="p-8">
                <HueCycleJournal profile={profile} entries={entries} onEntryUpdate={loadDashboardData} />
              </TabsContent>

              <TabsContent value="analytics" className="p-8">
                <HueCycleAnalytics profile={profile} entries={entries} prediction={prediction} />
              </TabsContent>

              <TabsContent value="tips" className="p-8">
                <HueTips profile={profile} entries={entries} currentPhase={currentPhase} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

// Journal Component
function HueCycleJournal({
  profile,
  entries,
  onEntryUpdate,
}: {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  onEntryUpdate: () => void
}) {
  const [isHandwriting, setIsHandwriting] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 font-serif">Personal Journal</h2>
          <p className="text-slate-600 dark:text-slate-400">Your private space for thoughts and reflections</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsHandwriting(!isHandwriting)}
          className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isHandwriting ? "Clean Text" : "Handwriting"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-3xl p-8 border border-amber-200 dark:border-amber-800 shadow-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='paper' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M0 20L20 0' stroke='%23f1f5f9' strokeWidth='0.5' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23paper)'/%3e%3c/svg%3e")`,
        }}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3
              className={`text-xl font-bold text-amber-700 dark:text-amber-300 ${isHandwriting ? "font-mono" : "font-serif"}`}
            >
              Today's Entry
            </h3>
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <textarea
            placeholder="Dear diary, today I feel..."
            className={`w-full h-64 bg-transparent border-none resize-none focus:outline-none text-slate-700 dark:text-slate-200 placeholder:text-amber-500/60 ${
              isHandwriting ? "font-mono text-lg leading-relaxed" : "font-serif text-base leading-loose"
            }`}
          />

          <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
              >
                Add Voice Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
              >
                Add Image
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
              Save Entry
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 font-serif">Previous Entries</h3>
        <div className="grid gap-4">
          {entries.slice(0, 5).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 font-serif">
                    {entry.date.toLocaleDateString()}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {entry.mood.length > 0 && `Mood: ${entry.mood.join(", ")}`}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              {entry.notes && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-serif">{entry.notes}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
