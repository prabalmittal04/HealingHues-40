"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Leaf, Heart, Brain, Zap, Coffee, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { HueCycleProfile, HueCycleEntry } from "@/lib/huecycle-service"

interface HueTipsProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  currentPhase: {
    phase: string
    dayInCycle: number
    description: string
    emoji: string
  }
}

interface Tip {
  id: string
  title: string
  description: string
  category: "nutrition" | "wellness" | "relaxation" | "productivity"
  icon: any
  color: string
  illustration: string
}

const TIPS_DATABASE: Tip[] = [
  {
    id: "breathing",
    title: "Deep Breathing Reset",
    description: "🌿 Take 5 minutes today to do deep breathing before sleep. Inhale calm, exhale tension.",
    category: "relaxation",
    icon: Leaf,
    color: "from-green-400 to-emerald-500",
    illustration: "🌿",
  },
  {
    id: "hydration",
    title: "Mindful Hydration",
    description: "💧 Start your day with a glass of warm lemon water to support your body's natural detox.",
    category: "nutrition",
    icon: Coffee,
    color: "from-blue-400 to-cyan-500",
    illustration: "💧",
  },
  {
    id: "movement",
    title: "Gentle Movement",
    description: "🌸 Try 10 minutes of gentle stretching or yoga to connect with your body's wisdom.",
    category: "wellness",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    illustration: "🌸",
  },
  {
    id: "energy",
    title: "Energy Boost",
    description: "⚡ Eat iron-rich foods like spinach and dark chocolate to support your energy levels.",
    category: "nutrition",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    illustration: "⚡",
  },
  {
    id: "focus",
    title: "Mindful Focus",
    description: "🧠 Use the Pomodoro technique during your high-energy phases for maximum productivity.",
    category: "productivity",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    illustration: "🧠",
  },
  {
    id: "rest",
    title: "Sacred Rest",
    description: "🌙 Honor your body's need for rest. Create a calming bedtime ritual with herbal tea.",
    category: "relaxation",
    icon: Moon,
    color: "from-indigo-400 to-purple-500",
    illustration: "🌙",
  },
]

export default function HueTips({ profile, entries, currentPhase }: HueTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Auto-rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS_DATABASE.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const filteredTips =
    selectedCategory === "all" ? TIPS_DATABASE : TIPS_DATABASE.filter((tip) => tip.category === selectedCategory)

  const currentTip = filteredTips[currentTipIndex % filteredTips.length]

  const categories = [
    { id: "all", label: "All", color: "from-slate-400 to-slate-500" },
    { id: "nutrition", label: "Nutrition", color: "from-green-400 to-emerald-500" },
    { id: "wellness", label: "Wellness", color: "from-pink-400 to-rose-500" },
    { id: "relaxation", label: "Relaxation", color: "from-blue-400 to-cyan-500" },
    { id: "productivity", label: "Productivity", color: "from-purple-400 to-indigo-500" },
  ]

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 font-serif">HueTips</h2>
        <p className="text-slate-600 dark:text-slate-400">Personalized wellness guidance for your journey</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory(category.id)
              setCurrentTipIndex(0)
            }}
            className={`${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white border-none`
                : "bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            } transition-all duration-200 rounded-full`}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Main Tip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${currentTip.color} p-8 text-white relative`}>
              <div className="absolute top-4 right-4 text-6xl opacity-20">{currentTip.illustration}</div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <currentTip.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-serif">{currentTip.title}</h3>
                    <Badge className="bg-white/20 text-white border-white/30 mt-1">{currentTip.category}</Badge>
                  </div>
                </div>
                <p className="text-white/90 text-lg leading-relaxed font-light">{currentTip.description}</p>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTip}
                    className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTip}
                    className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {currentTipIndex + 1} of {filteredTips.length}
                  </span>
                  <div className="flex space-x-1">
                    {filteredTips.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTipIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentTipIndex ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full">
                  Try This Today
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Phase-Specific Tips */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800 rounded-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 font-serif">
              {currentPhase.phase} Phase Tips
            </h3>
            <p className="text-purple-600 dark:text-purple-400 text-sm">Personalized for your current cycle day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentPhase.phase === "Menstrual" && (
              <>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🛁</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Warm Comfort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Use heating pads and warm baths</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🍫</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Iron Rich</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Dark chocolate and leafy greens</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">😴</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Extra Rest</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Honor your body's need for sleep</p>
                </div>
              </>
            )}

            {currentPhase.phase === "Follicular" && (
              <>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🏃‍♀️</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Active Energy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Perfect time for new workouts</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Goal Setting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Plan and start new projects</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🥗</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Fresh Foods</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Light, energizing meals</p>
                </div>
              </>
            )}

            {currentPhase.phase === "Ovulation" && (
              <>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">💪</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Peak Performance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High-intensity workouts welcome</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🗣️</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Communication</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Great time for important conversations</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Confidence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">You're naturally radiant</p>
                </div>
              </>
            )}

            {currentPhase.phase === "Luteal" && (
              <>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🧘‍♀️</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Gentle Movement</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Yoga and stretching</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Reflection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Perfect for journaling</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🥜</div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Comfort Foods</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Healthy fats and complex carbs</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Insights */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 rounded-2xl">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-2 font-serif">
            Personalized Insight
          </h3>
          <p className="text-amber-600 dark:text-amber-400">
            Based on your tracking patterns, you tend to write more consistently during your follicular phase. Consider
            using this natural creative energy for important journaling and goal-setting sessions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
