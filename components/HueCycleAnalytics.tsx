"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Calendar, Heart, Activity, Moon, Sun, Zap, Brain, Sparkles } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { HueCycleProfile, HueCycleEntry, CyclePrediction } from "@/lib/huecycle-service"

interface HueCycleAnalyticsProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  prediction: CyclePrediction | null
}

const COLORS = {
  menstrual: "#ef4444",
  follicular: "#22c55e",
  ovulation: "#3b82f6",
  luteal: "#a855f7",
}

const MOOD_COLORS = {
  happy: "#fbbf24",
  energetic: "#10b981",
  calm: "#60a5fa",
  emotional: "#f472b6",
  irritable: "#ef4444",
  tired: "#6b7280",
  confident: "#8b5cf6",
  anxious: "#f97316",
  creative: "#ec4899",
  peaceful: "#06b6d4",
}

export default function HueCycleAnalytics({ profile, entries, prediction }: HueCycleAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate cycle analytics
  const getCyclePhaseData = () => {
    if (!profile.lastPeriodDate) return []

    const phaseData = entries.map((entry) => {
      const daysSinceLastPeriod = differenceInDays(entry.date, profile.lastPeriodDate!)
      const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

      let phase = "luteal"
      if (dayInCycle <= (profile.averagePeriodLength || 5)) {
        phase = "menstrual"
      } else if (dayInCycle <= 13) {
        phase = "follicular"
      } else if (dayInCycle <= 16) {
        phase = "ovulation"
      }

      return {
        date: format(entry.date, "MMM dd"),
        phase,
        energy: entry.energy,
        mood: entry.mood[0] || "neutral",
        symptoms: entry.symptoms.length,
      }
    })

    return phaseData.reverse().slice(-14) // Last 14 days
  }

  const getMoodTrendData = () => {
    return entries
      .slice(-14)
      .reverse()
      .map((entry) => ({
        date: format(entry.date, "MMM dd"),
        energy: entry.energy,
        mood: entry.mood.length,
        symptoms: entry.symptoms.length,
      }))
  }

  const getPhaseDistribution = () => {
    const phaseCount = { menstrual: 0, follicular: 0, ovulation: 0, luteal: 0 }

    entries.forEach((entry) => {
      if (!profile.lastPeriodDate) return

      const daysSinceLastPeriod = differenceInDays(entry.date, profile.lastPeriodDate)
      const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

      if (dayInCycle <= (profile.averagePeriodLength || 5)) {
        phaseCount.menstrual++
      } else if (dayInCycle <= 13) {
        phaseCount.follicular++
      } else if (dayInCycle <= 16) {
        phaseCount.ovulation++
      } else {
        phaseCount.luteal++
      }
    })

    return Object.entries(phaseCount).map(([phase, count]) => ({
      name: phase.charAt(0).toUpperCase() + phase.slice(1),
      value: count,
      color: COLORS[phase as keyof typeof COLORS],
    }))
  }

  const getMoodDistribution = () => {
    const moodCount: Record<string, number> = {}

    entries.forEach((entry) => {
      entry.mood.forEach((mood) => {
        moodCount[mood] = (moodCount[mood] || 0) + 1
      })
    })

    return Object.entries(moodCount)
      .slice(0, 6)
      .map(([mood, count]) => ({
        name: mood.charAt(0).toUpperCase() + mood.slice(1),
        value: count,
        color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS] || "#6b7280",
      }))
  }

  const getAveragesByPhase = () => {
    const phaseStats = {
      menstrual: { energy: [], symptoms: [] },
      follicular: { energy: [], symptoms: [] },
      ovulation: { energy: [], symptoms: [] },
      luteal: { energy: [], symptoms: [] },
    }

    entries.forEach((entry) => {
      if (!profile.lastPeriodDate) return

      const daysSinceLastPeriod = differenceInDays(entry.date, profile.lastPeriodDate)
      const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

      let phase: keyof typeof phaseStats = "luteal"
      if (dayInCycle <= (profile.averagePeriodLength || 5)) {
        phase = "menstrual"
      } else if (dayInCycle <= 13) {
        phase = "follicular"
      } else if (dayInCycle <= 16) {
        phase = "ovulation"
      }

      phaseStats[phase].energy.push(entry.energy)
      phaseStats[phase].symptoms.push(entry.symptoms.length)
    })

    return Object.entries(phaseStats).map(([phase, stats]) => ({
      phase: phase.charAt(0).toUpperCase() + phase.slice(1),
      avgEnergy: stats.energy.length > 0 ? stats.energy.reduce((a, b) => a + b, 0) / stats.energy.length : 0,
      avgSymptoms: stats.symptoms.length > 0 ? stats.symptoms.reduce((a, b) => a + b, 0) / stats.symptoms.length : 0,
      color: COLORS[phase as keyof typeof COLORS],
    }))
  }

  const cyclePhaseData = getCyclePhaseData()
  const moodTrendData = getMoodTrendData()
  const phaseDistribution = getPhaseDistribution()
  const moodDistribution = getMoodDistribution()
  const averagesByPhase = getAveragesByPhase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 font-serif">Sacred Analytics ✨</h2>
          <p className="text-pink-600 dark:text-pink-300">Beautiful insights into your divine cycle patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-pink-500/20 text-pink-700 dark:text-pink-200 border-pink-300/30">
            <Brain className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/30 dark:to-pink-800/30 border-rose-200 dark:border-rose-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Moon className="w-8 h-8 text-rose-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-200 mb-2 font-serif">
                {profile.averageCycleLength || 28}
              </div>
              <div className="text-rose-600 dark:text-rose-300 text-sm">Average Cycle Length</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/30 dark:to-indigo-800/30 border-purple-200 dark:border-purple-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2 font-serif">
                {entries.length > 0
                  ? (entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length).toFixed(1)
                  : "0"}
              </div>
              <div className="text-purple-600 dark:text-purple-300 text-sm">Average Energy</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 border-emerald-200 dark:border-emerald-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-200 mb-2 font-serif">
                {prediction?.confidence || 0}%
              </div>
              <div className="text-emerald-600 dark:text-emerald-300 text-sm">AI Prediction Accuracy</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 border-amber-200 dark:border-amber-800 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Sun className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-200 mb-2 font-serif">
                {entries.length}
              </div>
              <div className="text-amber-600 dark:text-amber-300 text-sm">Days Tracked</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-pink-200 dark:border-pink-800 rounded-2xl p-2">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="phases"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            Phases
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Energy Trends */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Energy Flow (14 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
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
                      dot={{ fill: "#ec4899", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Phase Distribution */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Cycle Phase Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={phaseDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {phaseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mood Distribution */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Mood Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moodDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #f1f5f9",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Symptoms Trend */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Symptoms Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #f1f5f9",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="symptoms"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          {/* Phase Averages */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Average Energy & Symptoms by Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={averagesByPhase}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="phase" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #f1f5f9",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="avgEnergy" name="Average Energy" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgSymptoms" name="Average Symptoms" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-800 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-700 dark:text-purple-200 font-serif">
                    AI Pattern Recognition ✨
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 dark:text-purple-300">Cycle Regularity</span>
                    <Progress value={92} className="w-20 h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 dark:text-purple-300">Energy Patterns</span>
                    <Progress value={88} className="w-20 h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 dark:text-purple-300">Mood Stability</span>
                    <Progress value={85} className="w-20 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-200 dark:border-rose-800 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-rose-500 rounded-full">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-rose-700 dark:text-rose-200 font-serif">Wellness Score 💕</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-rose-700 dark:text-rose-200 mb-2 font-serif">89%</div>
                  <p className="text-rose-600 dark:text-rose-300 text-sm">
                    Your overall cycle wellness is excellent! Keep nurturing your beautiful rhythm.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
