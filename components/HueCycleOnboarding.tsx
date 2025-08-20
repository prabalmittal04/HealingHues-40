"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  CalendarIcon,
  User,
  Activity,
  Brain,
  Target,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { createHueCycleProfile, type HueCycleProfile } from "@/lib/huecycle-service"

interface HueCycleOnboardingProps {
  onComplete: (profile: HueCycleProfile) => void
}

export default function HueCycleOnboarding({ onComplete }: HueCycleOnboardingProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    lastPeriodDate: undefined as Date | undefined,
    averageCycleLength: "28",
    averagePeriodLength: "5",
    contraceptiveMethod: "",
    medications: [] as string[],
    healthConditions: [] as string[],
    lifestyleFactors: [] as string[],
    commonSymptoms: [] as string[],
    moodPatterns: [] as string[],
    trackingGoals: [] as string[],
    notificationPreferences: [] as string[],
    privacyLevel: "private" as "private" | "friends" | "public",
    fertilityGoals: "",
    additionalNotes: "",
  })

  const steps = [
    {
      title: "Welcome to HueCycle! 🌸",
      subtitle: "Let's personalize your period tracking experience",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "About You 👤",
      subtitle: "Basic information to personalize your experience",
      icon: User,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Your Cycle 📅",
      subtitle: "Help us understand your menstrual cycle",
      icon: CalendarIcon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Health & Lifestyle 💪",
      subtitle: "Factors that might affect your cycle",
      icon: Activity,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Symptoms & Moods 🧠",
      subtitle: "Common patterns you experience",
      icon: Brain,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Your Goals 🎯",
      subtitle: "What do you want to achieve with tracking?",
      icon: Target,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Preferences ⚙️",
      subtitle: "Customize your tracking experience",
      icon: Settings,
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const contraceptiveMethods = [
    "None",
    "Birth Control Pills",
    "IUD (Hormonal)",
    "IUD (Copper)",
    "Implant",
    "Injection",
    "Patch",
    "Ring",
    "Condoms",
    "Other",
  ]

  const medicationsList = [
    "Pain Relievers",
    "Antidepressants",
    "Thyroid Medication",
    "Blood Pressure Medication",
    "Diabetes Medication",
    "Vitamins/Supplements",
    "Iron Supplements",
    "Other",
  ]

  const healthConditionsList = [
    "PCOS",
    "Endometriosis",
    "Thyroid Disorders",
    "Diabetes",
    "Depression/Anxiety",
    "Eating Disorders",
    "Autoimmune Conditions",
    "None",
  ]

  const lifestyleFactorsList = [
    "Regular Exercise",
    "High Stress Job",
    "Irregular Sleep",
    "Travel Frequently",
    "Vegetarian/Vegan",
    "Smoker",
    "Regular Alcohol",
    "Student",
  ]

  const symptomsList = [
    "Cramps",
    "Bloating",
    "Headaches",
    "Breast Tenderness",
    "Fatigue",
    "Acne",
    "Food Cravings",
    "Back Pain",
    "Nausea",
    "Sleep Issues",
  ]

  const moodPatternsList = [
    "Mood Swings",
    "Irritability",
    "Anxiety",
    "Depression",
    "Emotional Sensitivity",
    "Low Energy",
    "Difficulty Concentrating",
    "Increased Appetite",
  ]

  const trackingGoalsList = [
    "Predict Periods",
    "Track Fertility",
    "Manage Symptoms",
    "Understand Mood Changes",
    "Plan Activities",
    "Health Monitoring",
    "Pregnancy Planning",
    "General Wellness",
  ]

  const notificationPreferencesList = [
    "Period Reminders",
    "Fertility Window",
    "Symptom Tracking",
    "Mood Check-ins",
    "Health Tips",
    "Medication Reminders",
  ]

  const handleArrayToggle = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user?.uid || !formData.lastPeriodDate) return

    setIsSubmitting(true)
    try {
      const profileData = {
        userId: user.uid,
        age: Number.parseInt(formData.age) || 0,
        height: Number.parseInt(formData.height) || 0,
        weight: Number.parseInt(formData.weight) || 0,
        lastPeriodDate: formData.lastPeriodDate,
        averageCycleLength: Number.parseInt(formData.averageCycleLength) || 28,
        averagePeriodLength: Number.parseInt(formData.averagePeriodLength) || 5,
        contraceptiveMethod: formData.contraceptiveMethod,
        medications: formData.medications,
        healthConditions: formData.healthConditions,
        lifestyleFactors: formData.lifestyleFactors,
        commonSymptoms: formData.commonSymptoms,
        moodPatterns: formData.moodPatterns,
        trackingGoals: formData.trackingGoals,
        notificationPreferences: formData.notificationPreferences,
        privacyLevel: formData.privacyLevel,
        fertilityGoals: formData.fertilityGoals,
        additionalNotes: formData.additionalNotes,
        isOnboardingComplete: true,
      }

      const profile = await createHueCycleProfile(profileData)
      onComplete(profile as HueCycleProfile)
    } catch (error) {
      console.error("Error creating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.height && formData.weight
      case 2:
        return formData.lastPeriodDate && formData.averageCycleLength && formData.averagePeriodLength
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto"
            >
              <Heart className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-4">Welcome to HueCycle!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your personalized period tracker that understands you. Let's set up your profile to provide the most
                accurate predictions and insights.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-2 gap-4 max-w-md mx-auto"
            >
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800">
                <Sparkles className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">AI Insights</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <CalendarIcon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Smart Predictions</p>
              </div>
            </motion.div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-purple-700 dark:text-purple-300 font-medium">
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  className="rounded-xl border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-purple-700 dark:text-purple-300 font-medium">
                  Height (cm) *
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="165"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  className="rounded-xl border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-purple-700 dark:text-purple-300 font-medium">
                  Weight (kg) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="60"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  className="rounded-xl border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-600 dark:text-purple-400">
                💡 This information helps us provide more accurate cycle predictions and health insights tailored to
                you.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-blue-700 dark:text-blue-300 font-medium">Last Period Start Date *</Label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal rounded-xl border-blue-200 focus:border-blue-400 bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {formData.lastPeriodDate ? format(formData.lastPeriodDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.lastPeriodDate}
                      onSelect={(date) => {
                        setFormData((prev) => ({ ...prev, lastPeriodDate: date }))
                        setShowCalendar(false)
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-blue-700 dark:text-blue-300 font-medium">Average Cycle Length (days) *</Label>
                  <Select
                    value={formData.averageCycleLength}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, averageCycleLength: value }))}
                  >
                    <SelectTrigger className="rounded-xl border-blue-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 21).map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-700 dark:text-blue-300 font-medium">Average Period Length (days) *</Label>
                  <Select
                    value={formData.averagePeriodLength}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, averagePeriodLength: value }))}
                  >
                    <SelectTrigger className="rounded-xl border-blue-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                📊 Don't worry if you're not sure about exact numbers - we'll learn and adjust as you track!
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-green-700 dark:text-green-300 font-medium">Contraceptive Method</Label>
                <Select
                  value={formData.contraceptiveMethod}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, contraceptiveMethod: value }))}
                >
                  <SelectTrigger className="rounded-xl border-green-200 focus:border-green-400">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {contraceptiveMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-green-700 dark:text-green-300 font-medium">Current Medications</Label>
                <div className="grid grid-cols-2 gap-2">
                  {medicationsList.map((medication) => (
                    <div key={medication} className="flex items-center space-x-2">
                      <Checkbox
                        id={medication}
                        checked={formData.medications.includes(medication)}
                        onCheckedChange={() => handleArrayToggle("medications", medication)}
                        className="border-green-300 data-[state=checked]:bg-green-500"
                      />
                      <Label htmlFor={medication} className="text-sm">
                        {medication}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-green-700 dark:text-green-300 font-medium">Health Conditions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthConditionsList.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.healthConditions.includes(condition)}
                        onCheckedChange={() => handleArrayToggle("healthConditions", condition)}
                        className="border-green-300 data-[state=checked]:bg-green-500"
                      />
                      <Label htmlFor={condition} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-green-700 dark:text-green-300 font-medium">Lifestyle Factors</Label>
                <div className="grid grid-cols-2 gap-2">
                  {lifestyleFactorsList.map((factor) => (
                    <div key={factor} className="flex items-center space-x-2">
                      <Checkbox
                        id={factor}
                        checked={formData.lifestyleFactors.includes(factor)}
                        onCheckedChange={() => handleArrayToggle("lifestyleFactors", factor)}
                        className="border-green-300 data-[state=checked]:bg-green-500"
                      />
                      <Label htmlFor={factor} className="text-sm">
                        {factor}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-orange-700 dark:text-orange-300 font-medium">Common Symptoms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {symptomsList.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.commonSymptoms.includes(symptom)}
                        onCheckedChange={() => handleArrayToggle("commonSymptoms", symptom)}
                        className="border-orange-300 data-[state=checked]:bg-orange-500"
                      />
                      <Label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-orange-700 dark:text-orange-300 font-medium">Mood Patterns</Label>
                <div className="grid grid-cols-2 gap-2">
                  {moodPatternsList.map((pattern) => (
                    <div key={pattern} className="flex items-center space-x-2">
                      <Checkbox
                        id={pattern}
                        checked={formData.moodPatterns.includes(pattern)}
                        onCheckedChange={() => handleArrayToggle("moodPatterns", pattern)}
                        className="border-orange-300 data-[state=checked]:bg-orange-500"
                      />
                      <Label htmlFor={pattern} className="text-sm">
                        {pattern}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                🧠 Understanding your patterns helps us provide better insights and recommendations.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-red-700 dark:text-red-300 font-medium">What are your tracking goals?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {trackingGoalsList.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.trackingGoals.includes(goal)}
                        onCheckedChange={() => handleArrayToggle("trackingGoals", goal)}
                        className="border-red-300 data-[state=checked]:bg-red-500"
                      />
                      <Label htmlFor={goal} className="text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fertilityGoals" className="text-red-700 dark:text-red-300 font-medium">
                  Fertility Goals (Optional)
                </Label>
                <Select
                  value={formData.fertilityGoals}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, fertilityGoals: value }))}
                >
                  <SelectTrigger className="rounded-xl border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Select your fertility goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trying-to-conceive">Trying to Conceive</SelectItem>
                    <SelectItem value="avoiding-pregnancy">Avoiding Pregnancy</SelectItem>
                    <SelectItem value="understanding-fertility">Understanding My Fertility</SelectItem>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                🎯 Your goals help us customize the insights and features most relevant to you.
              </p>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-indigo-700 dark:text-indigo-300 font-medium">Notification Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  {notificationPreferencesList.map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={pref}
                        checked={formData.notificationPreferences.includes(pref)}
                        onCheckedChange={() => handleArrayToggle("notificationPreferences", pref)}
                        className="border-indigo-300 data-[state=checked]:bg-indigo-500"
                      />
                      <Label htmlFor={pref} className="text-sm">
                        {pref}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-700 dark:text-indigo-300 font-medium">Privacy Level</Label>
                <Select
                  value={formData.privacyLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, privacyLevel: value as "private" | "friends" | "public" }))
                  }
                >
                  <SelectTrigger className="rounded-xl border-indigo-200 focus:border-indigo-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Only You)</SelectItem>
                    <SelectItem value="friends">Friends (Share with Connections)</SelectItem>
                    <SelectItem value="public">Public (Community Features)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes" className="text-indigo-700 dark:text-indigo-300 font-medium">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Anything else you'd like us to know about your cycle or health?"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  className="rounded-xl border-indigo-200 focus:border-indigo-400"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                🔒 Your privacy is important to us. You can change these settings anytime in your profile.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = steps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-pink-200 dark:border-pink-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress Header */}
        <div className={`bg-gradient-to-r ${currentStepData.color} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentStepData.title}</h1>
                <p className="text-white/80">{currentStepData.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Step</div>
              <div className="text-xl font-bold">
                {currentStep + 1}/{steps.length}
              </div>
            </div>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2 bg-white/20" />
        </div>

        {/* Step Content */}
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        {/* Navigation Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="rounded-xl bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Profile...
                </>
              ) : (
                <>
                  Complete Setup
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
