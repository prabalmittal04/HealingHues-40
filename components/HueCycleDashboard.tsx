"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, BookOpen, BarChart3, Lightbulb, Edit3, Heart, Sparkles, Brain, Zap } from "lucide-react"
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
import HueCycleInsights from "./HueCycleInsights"
import HueCycleHealthLibrary from "./HueCycleHealthLibrary"

interface HueCycleDashboardProps {
  profile?: HueCycleProfile | null
}

// Enhanced sample data generator with more feminine and AI-powered insights
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
    lifestyleFactors: ["regular-exercise", "balanced-diet", "meditation"],
    commonSymptoms: ["cramps", "mood-swings", "bloating"],
    moodPatterns: ["creative-follicular", "reflective-luteal"],
    trackingGoals: ["predict-period", "understand-patterns", "optimize-wellness"],
    notificationPreferences: ["period-reminder", "fertile-window", "self-care-tips"],
    privacyLevel: "private",
    fertilityGoals: "track-cycle",
    additionalNotes: "",
    isOnboardingComplete: true,
    createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: today,
  }

  const sampleEntries: HueCycleEntry[] = []
  const moodOptions = [
    "happy",
    "energetic",
    "calm",
    "emotional",
    "irritable",
    "tired",
    "confident",
    "anxious",
    "creative",
    "peaceful",
  ]
  const symptomOptions = [
    "cramps",
    "bloating",
    "headache",
    "breast-tenderness",
    "fatigue",
    "acne",
    "food-cravings",
    "back-pain",
  ]

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
        mood = ["calm", "peaceful"]
        energy = 3
      }
    } else if (daysSinceLastPeriod >= 12 && daysSinceLastPeriod <= 16) {
      // Ovulation phase
      symptoms = []
      mood = ["happy", "energetic", "confident", "creative"]
      energy = 5
    } else if (daysSinceLastPeriod >= 20) {
      // PMS phase
      symptoms = ["bloating", "breast-tenderness", "food-cravings"]
      mood = ["irritable", "emotional"]
      energy = 2
    } else {
      // Follicular phase
      mood = ["happy", "energetic", "creative"]
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
      exercise: i % 3 === 0 ? ["yoga", "walking"] : [],
      notes:
        i === 0
          ? "Feeling so grateful for my body's wisdom today. My intuition feels especially strong! 💕✨"
          : i === 5
            ? "Had the most beautiful meditation session this morning. My cycle feels so aligned with the moon phases 🌙"
            : "",
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
    confidence: 92,
    basedOnCycles: 6,
    createdAt: today,
  }

  const sampleInsights: HueCycleInsight[] = [
    {
      id: "insight_1",
      userId,
      type: "pattern",
      title: "✨ Your Creative Moon Cycle",
      description:
        "AI has detected that your creativity peaks during your follicular phase, with 65% more journaling and artistic activities.",
      recommendation:
        "Schedule your most important creative projects during days 6-12 of your cycle for maximum flow state! 🎨",
      confidence: 92,
      dataPoints: ["Creative activities: +65% follicular", "Journal entries: 3x longer", "Mood correlation: 89%"],
      isRead: false,
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "insight_2",
      userId,
      type: "prediction",
      title: "🌙 Your Next Sacred Flow",
      description:
        "Based on your unique rhythm, your next period will begin in 13 days with 92% AI confidence. Your body is preparing beautifully.",
      recommendation:
        "Start your self-care ritual 3 days early - stock up on herbal teas, cozy blankets, and your favorite comfort foods! 🫖",
      confidence: 92,
      dataPoints: ["Cycle consistency: 96%", "Hormonal patterns: stable", "Prediction accuracy: 92%"],
      isRead: false,
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "insight_3",
      userId,
      type: "health",
      title: "💖 Emotional Intelligence Blooming",
      description:
        "Your emotional awareness has increased by 40% this month! You're becoming more attuned to your inner wisdom.",
      recommendation:
        "Continue your mindfulness practice - your emotional intelligence is your superpower! Consider moon journaling. 🌸",
      confidence: 88,
      dataPoints: ["Mood tracking: 28 days", "Self-awareness: +40%", "Mindfulness score: 9/10"],
      isRead: false,
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "insight_4",
      userId,
      type: "lifestyle",
      title: "🧘‍♀️ Your Wellness Harmony Score",
      description:
        "AI analysis shows your sleep, exercise, and nutrition are 85% aligned with your cycle phases - you're glowing from within!",
      recommendation:
        "You're doing amazingly! Try adding some gentle yin yoga during your luteal phase for even deeper harmony. 🕯️",
      confidence: 85,
      dataPoints: ["Sleep quality: 8.5/10", "Exercise alignment: 90%", "Nutrition harmony: 80%"],
      isRead: false,
      createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
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
  const [activeTab, setActiveTab] = useState("sanctuary")

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
        description: "Begin your magical journey of self-discovery",
        emoji: "🌱",
        color: "from-slate-400 to-slate-500",
        bgColor: "bg-slate-400",
        message: "Welcome to your sacred feminine space ✨",
      }
    }

    const today = new Date()
    const daysSinceLastPeriod = differenceInDays(today, profile.lastPeriodDate)
    const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

    if (dayInCycle <= (profile.averagePeriodLength || 5)) {
      return {
        phase: "Sacred Flow",
        dayInCycle,
        description: `Day ${dayInCycle} of your moon time`,
        emoji: "🌙",
        color: "from-red-400 to-rose-500",
        bgColor: "bg-red-400",
        message: "Honor your body's wisdom and rest deeply, beautiful soul 💕",
      }
    } else if (dayInCycle <= 13) {
      return {
        phase: "Fresh Bloom",
        dayInCycle,
        description: "Your energy is awakening like spring flowers",
        emoji: "🌸",
        color: "from-green-400 to-emerald-500",
        bgColor: "bg-green-400",
        message: "Perfect time for new adventures and creative projects! ✨",
      }
    } else if (dayInCycle <= 16) {
      return {
        phase: "Radiant Goddess",
        dayInCycle,
        description: "You're glowing with peak feminine energy",
        emoji: "🌺",
        color: "from-pink-400 to-rose-500",
        bgColor: "bg-pink-400",
        message: "Your confidence and magnetism are absolutely radiant! 👑",
      }
    } else {
      return {
        phase: "Wise Woman",
        dayInCycle,
        description: "Time for inner wisdom and intuitive insights",
        emoji: "🔮",
        color: "from-purple-400 to-indigo-500",
        bgColor: "bg-purple-400",
        message: "Trust your intuition - your inner wisdom is speaking loudly 🦋",
      }
    }
  }

  const getNextPeriodInfo = () => {
    if (!prediction) {
      return { daysUntil: 0, date: new Date(), message: "AI is learning your unique rhythm..." }
    }

    const today = new Date()
    const daysUntil = differenceInDays(prediction.predictedPeriodStart, today)

    let message = ""
    if (daysUntil < 0) {
      message = "Your sacred flow may be arriving 🌙"
    } else if (daysUntil === 0) {
      message = "Your moon time begins today ✨"
    } else if (daysUntil === 1) {
      message = "Your sacred flow begins tomorrow 🌸"
    } else if (daysUntil <= 3) {
      message = `${daysUntil} days until your moon time 💕`
    } else {
      message = `${daysUntil} days of beautiful energy ahead! 🦋`
    }

    return {
      daysUntil: Math.max(0, daysUntil),
      date: prediction.predictedPeriodStart,
      message,
    }
  }

  const currentPhase = getCurrentCyclePhase()
  const nextPeriod = getNextPeriodInfo()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-pink-950 dark:via-purple-950 dark:to-rose-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-pink-300 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 mb-2 font-serif">
            Preparing Your Sanctuary ✨
          </h2>
          <p className="text-pink-600 dark:text-pink-400">Creating your personalized wellness magic...</p>
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-pink-950 dark:via-purple-950 dark:to-rose-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-pink-200 dark:border-pink-800 rounded-3xl shadow-2xl">
          <CardContent className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 mb-2 font-serif">
              Welcome to HueCycle! 🌸✨
            </h2>
            <p className="text-pink-600 dark:text-pink-400 mb-6">
              Your magical AI-powered sanctuary for feminine wellness awaits
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full px-8 py-3 shadow-lg font-medium"
            >
              Begin Your Magical Journey ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-pink-950 dark:via-purple-950 dark:to-rose-950">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-pink-300/30 text-6xl"
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-40 right-20 text-purple-300/30 text-4xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [-15, 15, -15], x: [5, -5, 5] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 text-rose-300/30 text-5xl"
        >
          🦋
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-4 font-serif">
            Hue<span className="text-pink-400">Cycle</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <p className="text-pink-700 dark:text-pink-200 text-xl font-medium">
              AI-Powered Feminine Wellness Sanctuary
            </p>
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-pink-600 dark:text-pink-300 text-sm">Where technology meets feminine wisdom ✨</p>
        </motion.div>

        {/* Current Phase Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="bg-gradient-to-r from-white/90 to-pink-50/90 dark:from-slate-800/90 dark:to-pink-900/30 backdrop-blur-xl border-pink-200 dark:border-pink-800 rounded-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-7xl"
                  >
                    {currentPhase.emoji}
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-pink-700 dark:text-pink-200 font-serif">
                      {currentPhase.phase}
                    </h2>
                    <p className="text-pink-600 dark:text-pink-300 text-lg">
                      Day {currentPhase.dayInCycle} of {profile.averageCycleLength || 28}
                    </p>
                    <p className="text-pink-500 dark:text-pink-400 mt-2 font-medium">{currentPhase.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-pink-700 dark:text-pink-200 font-serif">
                    {nextPeriod.daysUntil}
                  </div>
                  <div className="text-pink-600 dark:text-pink-300 text-sm font-medium">{nextPeriod.message}</div>
                  <div className="flex items-center justify-end mt-2">
                    <Brain className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      AI Confidence: {prediction?.confidence || 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-pink-600 dark:text-pink-300">
                  <span>Cycle Harmony</span>
                  <span>{Math.round((currentPhase.dayInCycle / (profile.averageCycleLength || 28)) * 100)}%</span>
                </div>
                <Progress
                  value={(currentPhase.dayInCycle / (profile.averageCycleLength || 28)) * 100}
                  className="h-3 bg-pink-100 dark:bg-pink-900"
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
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-pink-200 dark:border-pink-800 rounded-2xl p-2 shadow-lg">
              <TabsTrigger
                value="sanctuary"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Heart className="w-4 h-4 mb-1" />
                <span className="text-xs">Sanctuary</span>
              </TabsTrigger>
              <TabsTrigger
                value="tracker"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mb-1" />
                <span className="text-xs">Tracker</span>
              </TabsTrigger>
              <TabsTrigger
                value="diary"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Edit3 className="w-4 h-4 mb-1" />
                <span className="text-xs">Diary</span>
              </TabsTrigger>
              <TabsTrigger
                value="journal"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mb-1" />
                <span className="text-xs">Journal</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mb-1" />
                <span className="text-xs">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Brain className="w-4 h-4 mb-1" />
                <span className="text-xs">AI Insights</span>
              </TabsTrigger>
              <TabsTrigger
                value="tips"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Lightbulb className="w-4 h-4 mb-1" />
                <span className="text-xs">HueTips</span>
              </TabsTrigger>
              <TabsTrigger
                value="library"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300 flex flex-col items-center py-3 font-medium transition-all duration-300"
              >
                <Zap className="w-4 h-4 mb-1" />
                <span className="text-xs">Library</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-pink-200 dark:border-pink-800 overflow-hidden shadow-2xl">
              <TabsContent value="sanctuary" className="p-8 space-y-6">
                <SanctuaryContent
                  profile={profile}
                  entries={entries}
                  prediction={prediction}
                  insights={insights}
                  currentPhase={currentPhase}
                  nextPeriod={nextPeriod}
                />
              </TabsContent>

              <TabsContent value="tracker" className="p-8">
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

              <TabsContent value="insights" className="p-8">
                <HueCycleInsights insights={insights} onInsightRead={loadDashboardData} />
              </TabsContent>

              <TabsContent value="tips" className="p-8">
                <HueTips profile={profile} entries={entries} currentPhase={currentPhase} />
              </TabsContent>

              <TabsContent value="library" className="p-8">
                <HueCycleHealthLibrary />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

// Sanctuary Content Component (Main Dashboard)
function SanctuaryContent({
  profile,
  entries,
  prediction,
  insights,
  currentPhase,
  nextPeriod,
}: {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  prediction: CyclePrediction | null
  insights: HueCycleInsight[]
  currentPhase: any
  nextPeriod: any
}) {
  const recentEntry = entries[0]
  const unreadInsights = insights.filter((i) => !i.isRead).length

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 border-pink-200 dark:border-pink-800 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 mb-2 font-serif">
              Welcome to your sacred sanctuary, beautiful goddess 💕✨
            </h2>
            <p className="text-pink-600 dark:text-pink-300">
              This is your magical space to honor your cycle, track your wellness, and celebrate your divine feminine
              energy.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-700 dark:text-purple-200 font-serif">
                    AI Insights Ready ✨
                  </h3>
                  <p className="text-purple-600 dark:text-purple-300 text-sm">
                    {unreadInsights} new personalized insights from your AI wellness companion
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full">
                View All Insights
              </Button>
            </div>
            {insights.length > 0 && (
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-700 dark:text-purple-200 mb-2">{insights[0].title}</h4>
                <p className="text-purple-600 dark:text-purple-300 text-sm">{insights[0].description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/30 dark:to-pink-800/30 border-rose-200 dark:border-rose-800 rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🌙</div>
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-200 mb-2 font-serif">
                {entries.length}
              </div>
              <div className="text-rose-600 dark:text-rose-300 text-sm">Days of wisdom tracked</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/30 dark:to-indigo-800/30 border-purple-200 dark:border-purple-800 rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🧠</div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2 font-serif">
                {unreadInsights}
              </div>
              <div className="text-purple-600 dark:text-purple-300 text-sm">AI insights waiting</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 border-emerald-200 dark:border-emerald-800 rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-200 mb-2 font-serif">
                {prediction?.confidence || 0}%
              </div>
              <div className="text-emerald-600 dark:text-emerald-300 text-sm">AI prediction accuracy</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 border-amber-200 dark:border-amber-800 rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-200 mb-2 font-serif">
                {recentEntry?.energy || 3}/5
              </div>
              <div className="text-amber-600 dark:text-amber-300 text-sm">Current energy flow</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Affirmation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border-violet-200 dark:border-violet-800 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-lg text-violet-700 dark:text-violet-200 mb-2 font-serif">Today's Sacred Affirmation</h3>
            <h2 className="text-2xl font-bold text-violet-800 dark:text-violet-100 mb-4 font-serif">
              "I honor my body's divine wisdom and embrace my sacred feminine cycles"
            </h2>
            <p className="text-violet-600 dark:text-violet-300">
              Your cycle is a beautiful dance of hormones, emotions, and divine energy. Trust the magic within you. 💜✨
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-200 dark:border-rose-800 rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🌸</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-rose-700 dark:text-rose-200 mb-2 font-serif">Sacred Journal</h3>
                  <p className="text-rose-600 dark:text-rose-300 text-sm mb-3">
                    Connect with your inner wisdom through guided reflection
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full"
                  >
                    Write Today ✨
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
          <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-800 rounded-2xl hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">📚</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-200 mb-2 font-serif">
                    Wellness Library
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-300 text-sm mb-3">
                    Discover sacred knowledge about your feminine body
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full"
                  >
                    Explore Magic 🔮
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 font-serif">Sacred Journal ✨</h2>
          <p className="text-pink-600 dark:text-pink-300">Your private space for divine thoughts and reflections</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsHandwriting(!isHandwriting)}
          className="bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/20 text-pink-700 dark:text-pink-200"
        >
          {isHandwriting ? "✍️ Handwriting" : "📝 Clean Text"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20 rounded-3xl p-8 border border-pink-200 dark:border-pink-800 shadow-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='paper' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M0 20L20 0' stroke='%23fce7f3' strokeWidth='0.5' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23paper)'/%3e%3c/svg%3e")`,
        }}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3
              className={`text-xl font-bold text-pink-700 dark:text-pink-200 ${isHandwriting ? "font-mono" : "font-serif"}`}
            >
              Today's Sacred Entry ✨
            </h3>
            <p className="text-pink-600 dark:text-pink-300 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <textarea
            placeholder="Dear sacred journal, today my heart feels... 💕"
            className={`w-full h-64 bg-transparent border-none resize-none focus:outline-none text-pink-700 dark:text-pink-200 placeholder:text-pink-500/60 ${
              isHandwriting ? "font-mono text-lg leading-relaxed" : "font-serif text-base leading-loose"
            }`}
          />

          <div className="flex items-center justify-between pt-4 border-t border-pink-200 dark:border-pink-800">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-900/20"
              >
                🎤 Add Voice Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-900/20"
              >
                📸 Add Image
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-full">
              Save Sacred Entry ✨
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-200 font-serif">
          Previous Sacred Entries 📖
        </h3>
        <div className="grid gap-4">
          {entries.slice(0, 5).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-pink-700 dark:text-pink-200 font-serif">
                    {entry.date.toLocaleDateString()}
                  </h4>
                  <p className="text-sm text-pink-500 dark:text-pink-400">
                    {entry.mood.length > 0 && `Mood: ${entry.mood.join(", ")} ✨`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-500 hover:text-pink-700 dark:hover:text-pink-300"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              {entry.notes && (
                <p className="text-pink-600 dark:text-pink-300 leading-relaxed font-serif">{entry.notes}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
