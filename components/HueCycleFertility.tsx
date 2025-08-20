"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Baby,
  Heart,
  CalendarIcon,
  TrendingUp,
  Target,
  Thermometer,
  Droplets,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { format, addDays, differenceInDays, isSameDay, isWithinInterval } from "date-fns"
import {
  getLatestCyclePrediction,
  saveCyclePrediction,
  type HueCycleProfile,
  type HueCycleEntry,
  type CyclePrediction,
} from "@/lib/huecycle-service"

interface HueCycleFertilityProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
}

export default function HueCycleFertility({ profile, entries }: HueCycleFertilityProps) {
  const { user } = useAuth()
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (user?.uid) {
      loadPrediction()
    }
  }, [user?.uid])

  const loadPrediction = async () => {
    if (!user?.uid) return

    try {
      setIsLoading(true)
      const latestPrediction = await getLatestCyclePrediction(user.uid)
      setPrediction(latestPrediction)
    } catch (error) {
      console.error("Error loading prediction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePrediction = async () => {
    if (!user?.uid) return

    try {
      setIsGenerating(true)

      // Calculate predictions based on profile data
      const lastPeriodDate = new Date(profile.lastPeriodDate)
      const cycleLength = profile.averageCycleLength
      const periodLength = profile.averagePeriodLength

      // Calculate next period
      const nextPeriodStart = addDays(lastPeriodDate, cycleLength)
      const nextPeriodEnd = addDays(nextPeriodStart, periodLength - 1)

      // Calculate ovulation (typically 14 days before next period)
      const ovulationDate = addDays(nextPeriodStart, -14)

      // Calculate fertility window (5 days before ovulation + ovulation day)
      const fertilityStart = addDays(ovulationDate, -5)
      const fertilityEnd = ovulationDate

      // Calculate confidence based on data consistency
      const confidence = Math.min(90, 60 + entries.length * 2)

      const predictionData = {
        userId: user.uid,
        predictedPeriodStart: nextPeriodStart,
        predictedPeriodEnd: nextPeriodEnd,
        predictedOvulation: ovulationDate,
        fertilityWindowStart: fertilityStart,
        fertilityWindowEnd: fertilityEnd,
        confidence,
        basedOnCycles: Math.min(entries.length, 12),
      }

      const newPrediction = await saveCyclePrediction(predictionData)
      setPrediction(newPrediction)
    } catch (error) {
      console.error("Error generating prediction:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getCurrentPhase = () => {
    if (!prediction) return { phase: "unknown", daysUntil: 0, color: "gray" }

    const today = new Date()
    const periodStart = new Date(prediction.predictedPeriodStart)
    const ovulation = new Date(prediction.predictedOvulation)
    const fertilityStart = new Date(prediction.fertilityWindowStart)
    const fertilityEnd = new Date(prediction.fertilityWindowEnd)

    // Check if in fertility window
    if (isWithinInterval(today, { start: fertilityStart, end: fertilityEnd })) {
      return {
        phase: "fertile",
        daysUntil: differenceInDays(fertilityEnd, today),
        color: "green",
        description: "High fertility window",
      }
    }

    // Check if ovulation day
    if (isSameDay(today, ovulation)) {
      return {
        phase: "ovulation",
        daysUntil: 0,
        color: "yellow",
        description: "Ovulation day",
      }
    }

    // Check days until period
    const daysUntilPeriod = differenceInDays(periodStart, today)
    if (daysUntilPeriod <= 0) {
      return {
        phase: "period",
        daysUntil: 0,
        color: "red",
        description: "Period expected",
      }
    }

    // Check days until fertility window
    const daysUntilFertile = differenceInDays(fertilityStart, today)
    if (daysUntilFertile <= 7) {
      return {
        phase: "pre-fertile",
        daysUntil: daysUntilFertile,
        color: "blue",
        description: "Approaching fertility window",
      }
    }

    return {
      phase: "follicular",
      daysUntil: daysUntilPeriod,
      color: "purple",
      description: "Follicular phase",
    }
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "fertile":
      case "ovulation":
        return <Baby className="w-5 h-5" />
      case "period":
        return <Droplets className="w-5 h-5" />
      case "pre-fertile":
        return <Moon className="w-5 h-5" />
      default:
        return <Sun className="w-5 h-5" />
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "fertile":
      case "ovulation":
        return "from-green-500 to-emerald-500"
      case "period":
        return "from-red-500 to-rose-500"
      case "pre-fertile":
        return "from-blue-500 to-cyan-500"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  const renderCalendarDay = (date: Date) => {
    if (!prediction) return null

    const periodStart = new Date(prediction.predictedPeriodStart)
    const periodEnd = new Date(prediction.predictedPeriodEnd)
    const ovulation = new Date(prediction.predictedOvulation)
    const fertilityStart = new Date(prediction.fertilityWindowStart)
    const fertilityEnd = new Date(prediction.fertilityWindowEnd)

    let className = ""
    let indicator = null

    // Period days
    if (isWithinInterval(date, { start: periodStart, end: periodEnd })) {
      className = "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      indicator = <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
    }
    // Ovulation day
    else if (isSameDay(date, ovulation)) {
      className = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      indicator = <div className="w-2 h-2 bg-yellow-500 rounded-full absolute top-1 right-1"></div>
    }
    // Fertility window
    else if (isWithinInterval(date, { start: fertilityStart, end: fertilityEnd })) {
      className = "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      indicator = <div className="w-2 h-2 bg-green-500 rounded-full absolute top-1 right-1"></div>
    }

    return (
      <div className={`relative w-full h-full p-1 rounded-lg ${className}`}>
        <div className="text-sm font-medium">{format(date, "d")}</div>
        {indicator}
      </div>
    )
  }

  const currentPhase = getCurrentPhase()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-600 dark:text-slate-400">Loading fertility data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Fertility Tracking</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Track your fertile window and ovulation predictions
                </p>
              </div>
            </div>
            <Button
              onClick={generatePrediction}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Update Predictions
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {!prediction ? (
        <Card>
          <CardContent className="text-center py-12">
            <Baby className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No Predictions Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Generate fertility predictions based on your cycle data to track your fertile window.
            </p>
            <Button
              onClick={generatePrediction}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Generate Predictions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Current Phase */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${getPhaseColor(currentPhase.phase)} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {getPhaseIcon(currentPhase.phase)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold capitalize">{currentPhase.phase.replace("-", " ")} Phase</h3>
                      <p className="text-white/90">{currentPhase.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{currentPhase.daysUntil}</div>
                    <div className="text-white/90 text-sm">
                      {currentPhase.daysUntil === 0
                        ? "Today"
                        : `days ${currentPhase.phase === "period" ? "until period" : "remaining"}`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <Droplets className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {format(new Date(prediction.predictedPeriodStart), "MMM dd")}
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">Next Period</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 text-center">
                <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {format(new Date(prediction.predictedOvulation), "MMM dd")}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">Ovulation</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <Baby className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {differenceInDays(
                    new Date(prediction.fertilityWindowEnd),
                    new Date(prediction.fertilityWindowStart),
                  ) + 1}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Fertile Days</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{prediction.confidence}%</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Confidence</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="calendar" className="rounded-lg">
                Calendar
              </TabsTrigger>
              <TabsTrigger value="insights" className="rounded-lg">
                Insights
              </TabsTrigger>
              <TabsTrigger value="tips" className="rounded-lg">
                Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                      Fertility Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-xl"
                      components={{
                        Day: ({ date }) => renderCalendarDay(date),
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Period days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Ovulation day</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Fertile window</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                      Cycle Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Average cycle length:</span>
                      <span className="font-medium">{profile.averageCycleLength} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Average period length:</span>
                      <span className="font-medium">{profile.averagePeriodLength} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Prediction confidence:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={prediction.confidence} className="w-16 h-2" />
                        <span className="font-medium">{prediction.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Based on cycles:</span>
                      <span className="font-medium">{prediction.basedOnCycles}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-500" />
                      Fertility Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                        <h4 className="font-medium text-pink-700 dark:text-pink-300 mb-2">Your Goal:</h4>
                        <p className="text-sm text-pink-600 dark:text-pink-400">
                          {profile.fertilityGoals || "Track fertility patterns"}
                        </p>
                      </div>

                      {currentPhase.phase === "fertile" && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-700 dark:text-green-300">High Fertility</span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            You're currently in your fertile window. This is the best time for conception.
                          </p>
                        </div>
                      )}

                      {currentPhase.phase === "ovulation" && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-yellow-700 dark:text-yellow-300">Ovulation Day</span>
                          </div>
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            Today is your predicted ovulation day - peak fertility time!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Thermometer className="w-5 h-5 mr-2 text-red-500" />
                      Tracking Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-slate-700 dark:text-slate-300">Basal Body Temperature</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Take your temperature first thing in the morning before getting out of bed.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-slate-700 dark:text-slate-300">Cervical Mucus</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Track changes in cervical mucus consistency throughout your cycle.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-slate-700 dark:text-slate-300">Consistency</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Track daily for at least 3 cycles to improve prediction accuracy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      Fertility Facts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Fertile Window</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          The 6-day window ending on ovulation day when pregnancy is most likely.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">Ovulation</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Typically occurs 12-16 days before your next period starts.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Cycle Length</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Normal cycles range from 21-35 days, with 28 days being average.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Disclaimer */}
              <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Important Note</h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        These predictions are estimates based on your cycle data. For medical advice or fertility
                        concerns, please consult with a healthcare professional. This app is not a substitute for
                        medical care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
