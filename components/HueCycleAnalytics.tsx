"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Calendar, Heart, Activity, Moon, Zap, Target, Award, Sparkles } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { HueCycleProfile, HueCycleEntry, CyclePrediction } from "@/lib/huecycle-service"

interface HueCycleAnalyticsProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  prediction: CyclePrediction | null
}

const MOOD_COLORS = {
  happy: "#10B981",
  energetic: "#F59E0B",
  calm: "#3B82F6",
  emotional: "#EC4899",
  irritable: "#EF4444",
  tired: "#6B7280",
  confident: "#8B5CF6",
  anxious: "#F97316",
}

const SYMPTOM_COLORS = {
  cramps: "#EF4444",
  bloating: "#F59E0B",
  headache: "#8B5CF6",
  "breast-tenderness": "#EC4899",
  fatigue: "#6B7280",
  acne: "#F97316",
  "food-cravings": "#10B981",
  "back-pain": "#DC2626",
}

export default function HueCycleAnalytics({ profile, entries, prediction }: HueCycleAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"month" | "3months" | "6months" | "year">("3months")

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!entries.length) return null

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Cycle length analysis
    const periodEntries = sortedEntries.filter((entry) => entry.periodFlow && entry.periodFlow !== "none")
    const cycleLengths: number[] = []

    for (let i = 1; i < periodEntries.length; i++) {
      const currentPeriod = new Date(periodEntries[i].date)
      const previousPeriod = new Date(periodEntries[i - 1].date)
      const cycleLength = differenceInDays(currentPeriod, previousPeriod)
      if (cycleLength > 15 && cycleLength < 45) {
        // Reasonable cycle length
        cycleLengths.push(cycleLength)
      }
    }

    const avgCycleLength =
      cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
        : profile.averageCycleLength

    // Energy trends
    const energyData = sortedEntries.map((entry) => ({
      date: format(new Date(entry.date), "MMM dd"),
      energy: entry.energy,
      mood: entry.mood[0] || "neutral",
    }))

    // Mood frequency
    const moodCounts: Record<string, number> = {}
    sortedEntries.forEach((entry) => {
      entry.mood.forEach((mood) => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1
      })
    })

    const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / sortedEntries.length) * 100),
    }))

    // Symptom frequency
    const symptomCounts: Record<string, number> = {}
    sortedEntries.forEach((entry) => {
      entry.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })
    })

    const symptomData = Object.entries(symptomCounts).map(([symptom, count]) => ({
      symptom,
      count,
      percentage: Math.round((count / sortedEntries.length) * 100),
    }))

    // Cycle regularity
    const cycleVariation = cycleLengths.length > 1 ? Math.max(...cycleLengths) - Math.min(...cycleLengths) : 0

    const regularityScore = cycleVariation <= 7 ? 90 : cycleVariation <= 14 ? 70 : 50

    // Wellness score
    const avgEnergy = sortedEntries.reduce((sum, entry) => sum + entry.energy, 0) / sortedEntries.length
    const avgSleep = sortedEntries.reduce((sum, entry) => sum + entry.sleep, 0) / sortedEntries.length
    const exerciseFreq = sortedEntries.filter((entry) => entry.exercise.length > 0).length / sortedEntries.length

    const wellnessScore = Math.round(
      (avgEnergy / 5) * 30 + (avgSleep / 10) * 30 + exerciseFreq * 20 + (regularityScore / 100) * 20,
    )

    return {
      avgCycleLength,
      cycleLengths,
      cycleVariation,
      regularityScore,
      energyData,
      moodData,
      symptomData,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgSleep: Math.round(avgSleep * 10) / 10,
      exerciseFreq: Math.round(exerciseFreq * 100),
      wellnessScore,
      totalEntries: sortedEntries.length,
      trackingStreak: calculateStreak(sortedEntries),
    }
  }, [entries, profile])

  const calculateStreak = (entries: HueCycleEntry[]) => {
    if (!entries.length) return 0

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0
    const today = new Date()

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      const daysDiff = differenceInDays(today, entryDate)

      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
          <CardContent className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-rose-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-300 mb-2">Building Your Analytics</h3>
            <p className="text-rose-500 dark:text-rose-400 mb-6">
              Keep tracking your cycle to unlock beautiful insights about your patterns and wellness journey.
            </p>
            <Button className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-full">
              <Target className="w-4 h-4 mr-2" />
              Start Tracking
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-300 mb-2">Your Wellness Analytics 📊</h2>
        <p className="text-rose-500 dark:text-rose-400">
          Beautiful insights into your cycle patterns and wellness journey
        </p>
      </div>

      {/* Wellness Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800 rounded-3xl shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-6xl">✨</div>
              <div>
                <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                  {analytics.wellnessScore}/100
                </h3>
                <p className="text-purple-500 dark:text-purple-400">Wellness Harmony Score</p>
              </div>
            </div>
            <Progress value={analytics.wellnessScore} className="h-4 mb-4" />
            <p className="text-purple-600 dark:text-purple-300">
              {analytics.wellnessScore >= 80
                ? "You're thriving beautifully! 🌟"
                : analytics.wellnessScore >= 60
                  ? "You're on a wonderful path! 🌸"
                  : "Every step forward is progress! 💕"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 border-rose-200 dark:border-rose-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-300 mb-2">
                {analytics.avgCycleLength} days
              </div>
              <div className="text-rose-500 dark:text-rose-400 text-sm">Average cycle length</div>
              <Badge className="mt-2 bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-700">
                {analytics.regularityScore >= 80
                  ? "Very Regular"
                  : analytics.regularityScore >= 60
                    ? "Mostly Regular"
                    : "Variable"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-300 mb-2">{analytics.avgEnergy}/5</div>
              <div className="text-amber-500 dark:text-amber-400 text-sm">Average energy level</div>
              <div className="mt-2 flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= analytics.avgEnergy ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Moon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-2">{analytics.avgSleep}h</div>
              <div className="text-blue-500 dark:text-blue-400 text-sm">Average sleep</div>
              <Badge className="mt-2 bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                {analytics.avgSleep >= 8 ? "Excellent" : analytics.avgSleep >= 7 ? "Good" : "Needs attention"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-600 dark:text-green-300 mb-2">
                {analytics.trackingStreak}
              </div>
              <div className="text-green-500 dark:text-green-400 text-sm">Day tracking streak</div>
              <Badge className="mt-2 bg-green-500/20 text-green-600 dark:text-green-300 border-green-300 dark:border-green-700">
                {analytics.trackingStreak >= 30
                  ? "Amazing!"
                  : analytics.trackingStreak >= 7
                    ? "Great job!"
                    : "Keep going!"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="energy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl p-2">
          <TabsTrigger
            value="energy"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-pink-500 data-[state=active]:text-white text-rose-600 dark:text-rose-300"
          >
            Energy Trends
          </TabsTrigger>
          <TabsTrigger
            value="moods"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-pink-500 data-[state=active]:text-white text-rose-600 dark:text-rose-300"
          >
            Mood Patterns
          </TabsTrigger>
          <TabsTrigger
            value="symptoms"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-pink-500 data-[state=active]:text-white text-rose-600 dark:text-rose-300"
          >
            Symptoms
          </TabsTrigger>
          <TabsTrigger
            value="cycles"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-pink-500 data-[state=active]:text-white text-rose-600 dark:text-rose-300"
          >
            Cycle Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-rose-600 dark:text-rose-300 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Energy Level Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.energyData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[1, 5]} stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #f1f5f9",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#ec4899"
                      strokeWidth={3}
                      dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#be185d" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moods" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-rose-600 dark:text-rose-300 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Mood Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.moodData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="mood" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #f1f5f9",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-rose-600 dark:text-rose-300 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Symptom Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.symptomData.slice(0, 6).map((symptom, index) => (
                  <div key={symptom.symptom} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {symptom.symptom.replace("-", " ")}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{symptom.percentage}% of days</span>
                    </div>
                    <Progress value={symptom.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-rose-600 dark:text-rose-300 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Cycle Regularity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-rose-600 dark:text-rose-300 mb-2">
                    {analytics.regularityScore}%
                  </div>
                  <p className="text-rose-500 dark:text-rose-400">Regularity Score</p>
                </div>
                <Progress value={analytics.regularityScore} className="h-3" />
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Average cycle:</span>
                    <span className="font-medium">{analytics.avgCycleLength} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variation:</span>
                    <span className="font-medium">{analytics.cycleVariation} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cycles tracked:</span>
                    <span className="font-medium">{analytics.cycleLengths.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-rose-600 dark:text-rose-300 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Wellness Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Exercise Frequency</span>
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-300">
                      {analytics.exerciseFreq}% of days
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Sleep Quality</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-300">
                      {analytics.avgSleep >= 8 ? "Excellent" : analytics.avgSleep >= 7 ? "Good" : "Improving"}
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Tracking Consistency
                      </span>
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-300">
                      {analytics.totalEntries} entries logged
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Encouragement */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border-violet-200 dark:border-violet-800 rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-lg font-semibold text-violet-600 dark:text-violet-300 mb-2">
              Your Journey is Beautiful
            </h3>
            <p className="text-violet-500 dark:text-violet-400">
              Every data point you track is an act of self-love and awareness. You're building a deeper understanding of
              your unique rhythm and honoring your body's wisdom. Keep celebrating these insights - they're helping you
              live in harmony with your natural cycles. 💜
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
