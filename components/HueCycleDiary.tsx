"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Plus, Edit, Trash2, Droplets, Activity, Save, X, Search } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { saveHueCycleEntry, type HueCycleProfile, type HueCycleEntry } from "@/lib/huecycle-service"

interface HueCycleDiaryProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  onEntryUpdate: () => void
}

const SYMPTOMS_OPTIONS = [
  "cramps",
  "bloating",
  "headache",
  "nausea",
  "breast-tenderness",
  "back-pain",
  "fatigue",
  "mood-swings",
  "acne",
  "food-cravings",
]

const MOOD_OPTIONS = [
  "happy",
  "sad",
  "anxious",
  "irritable",
  "energetic",
  "tired",
  "calm",
  "stressed",
  "confident",
  "emotional",
]

const EXERCISE_OPTIONS = [
  "walking",
  "running",
  "yoga",
  "swimming",
  "cycling",
  "strength-training",
  "pilates",
  "dancing",
]

const moodEmojis = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  irritable: "😤",
  energetic: "⚡",
  tired: "😴",
  calm: "😌",
  stressed: "😫",
  confident: "😎",
  emotional: "🥺",
}

export default function HueCycleDiary({ profile, entries, onEntryUpdate }: HueCycleDiaryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showQuickLog, setShowQuickLog] = useState(false)
  const [quickLogData, setQuickLogData] = useState({
    periodFlow: "none" as "none" | "light" | "medium" | "heavy",
    symptoms: [] as string[],
    mood: [] as string[],
    energy: 3,
    notes: "",
  })

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM dd, yyyy")
  }

  const getMoodEmoji = (moods: string[]) => {
    if (moods.length === 0) return "😐"
    const firstMood = moods[0]
    return moodEmojis[firstMood as keyof typeof moodEmojis] || "😐"
  }

  const getEnergyColor = (energy: number) => {
    if (energy >= 4) return "text-green-400"
    if (energy >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mood.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
      entry.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleQuickLog = async () => {
    if (!profile.userId) return

    try {
      const entryData = {
        userId: profile.userId,
        date: new Date(),
        periodFlow: quickLogData.periodFlow,
        symptoms: quickLogData.symptoms,
        mood: quickLogData.mood,
        energy: quickLogData.energy,
        sleep: 8,
        exercise: [],
        notes: quickLogData.notes,
        medications: [],
        sexualActivity: false,
      }

      await saveHueCycleEntry(entryData)
      setShowQuickLog(false)
      setQuickLogData({
        periodFlow: "none",
        symptoms: [],
        mood: [],
        energy: 3,
        notes: "",
      })
      onEntryUpdate()
    } catch (error) {
      console.error("Error saving quick log:", error)
    }
  }

  const handleArrayToggle = (field: "symptoms" | "mood", value: string) => {
    const currentArray = quickLogData[field]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    setQuickLogData((prev) => ({
      ...prev,
      [field]: newArray,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Log Today</h2>
          <p className="text-pink-100">Track your daily symptoms and feelings</p>
        </div>
        <Button onClick={() => setShowQuickLog(true)} className="bg-pink-500 hover:bg-pink-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Quick Log
        </Button>
      </div>

      {/* Quick Log Today */}
      <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg border-pink-300/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Mood Selection */}
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(moodEmojis)
              .slice(0, 5)
              .map(([mood, emoji]) => (
                <motion.button
                  key={mood}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-all duration-200"
                >
                  <div className="text-2xl mb-2">{emoji}</div>
                  <div className="text-xs text-white capitalize">{mood}</div>
                </motion.button>
              ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="bg-white/10 border-pink-300/30 text-white hover:bg-white/20 h-16 flex-col"
            >
              <Droplets className="w-6 h-6 mb-2" />
              <span className="text-xs">Log Period</span>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-pink-300/30 text-white hover:bg-white/20 h-16 flex-col"
            >
              <Activity className="w-6 h-6 mb-2" />
              <span className="text-xs">Add Symptoms</span>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-pink-300/30 text-white hover:bg-white/20 h-16 flex-col"
            >
              <Heart className="w-6 h-6 mb-2" />
              <span className="text-xs">Mood Check</span>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-pink-300/30 text-white hover:bg-white/20 h-16 flex-col"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-xs">Quick Note</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-white/10 backdrop-blur-lg border-pink-300/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-4 h-4" />
            <Input
              placeholder="Search your entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-pink-300/30 text-white placeholder:text-pink-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEntries.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-pink-300/30">
              <CardContent className="text-center py-12">
                <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchTerm ? "No entries match your search" : "Start your wellness journey"}
                </h3>
                <p className="text-pink-200 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Log your first entry to begin tracking your cycle"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowQuickLog(true)} className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Entry
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-pink-300/30 hover:bg-white/20 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                          {getMoodEmoji(entry.mood)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{getDateLabel(entry.date)}</h3>
                          <div className="flex items-center space-x-4 text-sm text-pink-200">
                            <span>
                              Energy: <span className={getEnergyColor(entry.energy)}>{entry.energy}/5</span>
                            </span>
                            {entry.periodFlow && entry.periodFlow !== "none" && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-red-500/20 text-red-200 border-red-300/30"
                              >
                                {entry.periodFlow} flow
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-pink-300 hover:text-white hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-pink-300 hover:text-red-400 hover:bg-white/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Notes */}
                    {entry.notes && (
                      <div className="mb-4">
                        <p className="text-pink-100 leading-relaxed">{entry.notes}</p>
                      </div>
                    )}

                    {/* Mood Tags */}
                    {entry.mood && entry.mood.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {entry.mood.map((mood) => (
                            <Badge
                              key={mood}
                              variant="outline"
                              className="text-xs bg-yellow-500/20 text-yellow-200 border-yellow-300/30"
                            >
                              {moodEmojis[mood as keyof typeof moodEmojis]} {mood}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Symptoms */}
                    {entry.symptoms && entry.symptoms.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-pink-300 mb-1">Symptoms:</div>
                        <div className="flex flex-wrap gap-1">
                          {entry.symptoms.map((symptom) => (
                            <Badge
                              key={symptom}
                              variant="secondary"
                              className="text-xs bg-orange-500/20 text-orange-200 border-orange-300/30"
                            >
                              {symptom.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-pink-300/20 text-xs text-pink-300">
                      <span>{format(entry.date, "EEEE, MMM dd")}</span>
                      <span>{format(entry.timestamp, "HH:mm")}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Quick Log Dialog */}
      {showQuickLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-rose-900/95 to-pink-900/95 backdrop-blur-lg border border-pink-300/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Quick Log - Today</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickLog(false)}
                className="text-pink-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Period Flow */}
              <div className="space-y-2">
                <Label className="text-pink-200 font-medium">Period Flow</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "none", label: "None", color: "bg-gray-500" },
                    { value: "light", label: "Light", color: "bg-pink-300" },
                    { value: "medium", label: "Medium", color: "bg-pink-500" },
                    { value: "heavy", label: "Heavy", color: "bg-red-500" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={quickLogData.periodFlow === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickLogData((prev) => ({ ...prev, periodFlow: option.value as any }))}
                      className={`${
                        quickLogData.periodFlow === option.value
                          ? `${option.color} text-white`
                          : "bg-white/10 border-pink-300/30 text-white hover:bg-white/20"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full mr-2 ${option.color}`}></div>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-3">
                <Label className="text-pink-200 font-medium">Energy Level: {quickLogData.energy}/5</Label>
                <Slider
                  value={[quickLogData.energy]}
                  onValueChange={(value) => setQuickLogData((prev) => ({ ...prev, energy: value[0] }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-pink-300">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
              </div>

              {/* Quick Mood Selection */}
              <div className="space-y-3">
                <Label className="text-pink-200 font-medium">How are you feeling?</Label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <Button
                      key={mood}
                      variant={quickLogData.mood.includes(mood) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleArrayToggle("mood", mood)}
                      className={`${
                        quickLogData.mood.includes(mood)
                          ? "bg-pink-500 text-white"
                          : "bg-white/10 border-pink-300/30 text-white hover:bg-white/20"
                      } text-xs flex-col h-16`}
                    >
                      <span className="text-lg mb-1">{emoji}</span>
                      <span className="capitalize">{mood}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Symptoms */}
              <div className="space-y-3">
                <Label className="text-pink-200 font-medium">Any symptoms?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOMS_OPTIONS.slice(0, 6).map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={quickLogData.symptoms.includes(symptom)}
                        onCheckedChange={() => handleArrayToggle("symptoms", symptom)}
                        className="border-pink-300 data-[state=checked]:bg-pink-500"
                      />
                      <Label htmlFor={symptom} className="text-sm text-pink-100">
                        {symptom.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Notes */}
              <div className="space-y-2">
                <Label htmlFor="quick-notes" className="text-pink-200 font-medium">
                  Quick Note
                </Label>
                <Textarea
                  id="quick-notes"
                  placeholder="How was your day? Any thoughts or feelings..."
                  value={quickLogData.notes}
                  onChange={(e) => setQuickLogData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="bg-white/10 border-pink-300/30 text-white placeholder:text-pink-300"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-pink-300/30">
                <Button
                  variant="outline"
                  onClick={() => setShowQuickLog(false)}
                  className="bg-white/10 border-pink-300/30 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button onClick={handleQuickLog} className="bg-pink-500 hover:bg-pink-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
