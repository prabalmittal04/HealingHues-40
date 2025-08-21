"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react"
import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import {
  saveHueCycleEntry,
  updateHueCycleEntry,
  type HueCycleProfile,
  type HueCycleEntry,
} from "@/lib/huecycle-service"

interface HueCycleCalendarProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  onEntryUpdate: () => void
}

const PERIOD_COLORS = {
  none: "",
  light: "bg-red-200 border-red-300",
  medium: "bg-red-400 border-red-500",
  heavy: "bg-red-600 border-red-700",
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

export default function HueCycleCalendar({ profile, entries, onEntryUpdate }: HueCycleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEntryDialog, setShowEntryDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HueCycleEntry | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [entryForm, setEntryForm] = useState({
    periodFlow: "none" as "none" | "light" | "medium" | "heavy",
    symptoms: [] as string[],
    mood: [] as string[],
    energy: 3,
    sleep: 8,
    notes: "",
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get entry for a specific date
  const getEntryForDate = (date: Date): HueCycleEntry | undefined => {
    return entries.find((entry) => isSameDay(entry.date, date))
  }

  // Get phase for a specific date
  const getPhaseForDate = (date: Date) => {
    if (!profile.lastPeriodDate) return null

    const daysSinceLastPeriod = Math.floor((date.getTime() - profile.lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

    if (dayInCycle <= (profile.averagePeriodLength || 5)) {
      return { phase: "menstrual", color: "bg-red-100 border-red-200" }
    } else if (dayInCycle <= 13) {
      return { phase: "follicular", color: "bg-green-100 border-green-200" }
    } else if (dayInCycle <= 16) {
      return { phase: "ovulation", color: "bg-blue-100 border-blue-200" }
    } else {
      return { phase: "luteal", color: "bg-amber-100 border-amber-200" }
    }
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const existingEntry = getEntryForDate(date)
    if (existingEntry) {
      setEditingEntry(existingEntry)
      setEntryForm({
        periodFlow: existingEntry.periodFlow || "none",
        symptoms: existingEntry.symptoms || [],
        mood: existingEntry.mood || [],
        energy: existingEntry.energy || 3,
        sleep: existingEntry.sleep || 8,
        notes: existingEntry.notes || "",
      })
    } else {
      setEditingEntry(null)
      setEntryForm({
        periodFlow: "none",
        symptoms: [],
        mood: [],
        energy: 3,
        sleep: 8,
        notes: "",
      })
    }
    setShowEntryDialog(true)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!profile.userId || !selectedDate) return

    setIsSubmitting(true)
    try {
      const entryData = {
        userId: profile.userId,
        date: selectedDate,
        periodFlow: entryForm.periodFlow,
        symptoms: entryForm.symptoms,
        mood: entryForm.mood,
        energy: entryForm.energy,
        sleep: entryForm.sleep,
        notes: entryForm.notes,
        exercise: [],
        medications: [],
        sexualActivity: false,
      }

      if (editingEntry) {
        await updateHueCycleEntry(editingEntry.id!, entryData)
      } else {
        await saveHueCycleEntry(entryData)
      }

      setShowEntryDialog(false)
      setEditingEntry(null)
      onEntryUpdate()
    } catch (error) {
      console.error("Error saving entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArrayToggle = (field: "symptoms" | "mood", value: string) => {
    const currentArray = entryForm[field]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    setEntryForm((prev) => ({
      ...prev,
      [field]: newArray,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 font-serif">Cycle Tracker</h2>
          <p className="text-slate-600 dark:text-slate-400">Clean, intelligent calendar with phase insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 min-w-[200px] text-center font-serif">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-slate-600 dark:text-slate-400 font-medium py-2 font-serif">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month start */}
            {Array.from({ length: getDay(monthStart) }).map((_, index) => (
              <div key={`empty-${index}`} className="h-20"></div>
            ))}

            {/* Month days */}
            <AnimatePresence>
              {monthDays.map((date, index) => {
                const entry = getEntryForDate(date)
                const phase = getPhaseForDate(date)
                const isCurrentDay = isToday(date)
                const hasEntry = !!entry
                const periodFlow = entry?.periodFlow || "none"

                return (
                  <motion.div
                    key={date.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative h-20 rounded-xl cursor-pointer transition-all duration-300 border-2
                      ${isCurrentDay ? "ring-2 ring-blue-400 ring-offset-2" : ""}
                      ${hasEntry ? "bg-white/80 dark:bg-slate-700/80 shadow-md" : "bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60"}
                      ${phase?.color || "border-slate-200 dark:border-slate-600"}
                      ${PERIOD_COLORS[periodFlow] && periodFlow !== "none" ? PERIOD_COLORS[periodFlow] : ""}
                    `}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className="text-slate-700 dark:text-slate-200 font-medium text-sm font-serif">
                        {format(date, "d")}
                      </div>

                      {/* Period indicator */}
                      {periodFlow !== "none" && (
                        <div className="absolute top-1 right-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              periodFlow === "heavy"
                                ? "bg-red-600"
                                : periodFlow === "medium"
                                  ? "bg-red-400"
                                  : "bg-red-300"
                            }`}
                          ></div>
                        </div>
                      )}

                      {/* Phase indicator */}
                      {phase && (
                        <div className="absolute bottom-1 left-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              phase.phase === "menstrual"
                                ? "bg-red-400"
                                : phase.phase === "follicular"
                                  ? "bg-green-400"
                                  : phase.phase === "ovulation"
                                    ? "bg-blue-400"
                                    : "bg-amber-400"
                            }`}
                          ></div>
                        </div>
                      )}

                      {/* Mood indicator */}
                      {entry && entry.mood && entry.mood.length > 0 && (
                        <div className="absolute bottom-1 right-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                      )}

                      {/* Energy level */}
                      {entry && (
                        <div className="mt-auto">
                          <div className="flex space-x-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${
                                  i <= entry.energy ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-2xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-200">Heavy flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-200">Medium flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-300 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-200">Light flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-200">Ovulation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Dialog */}
      <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-slate-700 dark:text-slate-200 font-serif">
              {editingEntry ? "Edit Entry" : "Add Entry"} - {selectedDate && format(selectedDate, "MMM dd, yyyy")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Period Flow */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Period Flow</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "none", label: "None", color: "bg-slate-400" },
                  { value: "light", label: "Light", color: "bg-red-300" },
                  { value: "medium", label: "Medium", color: "bg-red-500" },
                  { value: "heavy", label: "Heavy", color: "bg-red-700" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={entryForm.periodFlow === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEntryForm((prev) => ({ ...prev, periodFlow: option.value as any }))}
                    className={`${
                      entryForm.periodFlow === option.value
                        ? `${option.color} text-white hover:${option.color}`
                        : "bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    } transition-all duration-200`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${option.color}`}></div>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-3">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">
                Energy Level: {entryForm.energy}/5
              </Label>
              <Slider
                value={[entryForm.energy]}
                onValueChange={(value) => setEntryForm((prev) => ({ ...prev, energy: value[0] }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Very Low</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Sleep Hours: {entryForm.sleep}h</Label>
              <Slider
                value={[entryForm.sleep]}
                onValueChange={(value) => setEntryForm((prev) => ({ ...prev, sleep: value[0] }))}
                max={12}
                min={4}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Symptoms */}
            <div className="space-y-3">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Symptoms</Label>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOMS_OPTIONS.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={entryForm.symptoms.includes(symptom)}
                      onCheckedChange={() => handleArrayToggle("symptoms", symptom)}
                      className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor={symptom} className="text-sm text-slate-600 dark:text-slate-300">
                      {symptom.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-3">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Mood</Label>
              <div className="grid grid-cols-2 gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <div key={mood} className="flex items-center space-x-2">
                    <Checkbox
                      id={mood}
                      checked={entryForm.mood.includes(mood)}
                      onCheckedChange={() => handleArrayToggle("mood", mood)}
                      className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor={mood} className="text-sm text-slate-600 dark:text-slate-300">
                      {mood}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700 dark:text-slate-200 font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling today? Any thoughts or observations..."
                value={entryForm.notes}
                onChange={(e) => setEntryForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-500 font-serif"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={() => setShowEntryDialog(false)}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingEntry ? "Update Entry" : "Save Entry"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
