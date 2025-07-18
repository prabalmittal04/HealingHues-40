"use client"

import { useState, useEffect, useRef } from "react"
import { X, Wind, Play, Pause, Settings, RotateCcw, Timer } from "lucide-react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface BreathingExercise {
  id: string
  name: string
  description: string
  inhale: number
  hold: number
  exhale: number
  cycles: number
  difficulty: "beginner" | "intermediate" | "advanced"
  benefits: string[]
  hueCoinsReward: number
}

interface BreathingCoachProps {
  onClose: () => void
  userData: any
  onReward: (amount: number) => void
  onProgressUpdate: (progress: any) => void
}

export default function BreathingCoach({ onClose, userData, onReward, onProgressUpdate }: BreathingCoachProps) {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [showCustom, setShowCustom] = useState(false)
  const [customSettings, setCustomSettings] = useState({ inhale: 4, hold: 4, exhale: 4, cycles: 5 })
  const [visualizer, setVisualizer] = useState<"circle" | "wave">("circle")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [loading, setLoading] = useState(true)

  const [exercises, setExercises] = useState<BreathingExercise[]>([])

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercisesCollection = collection(db, "breathingExercises")
        const snapshot = await getDocs(exercisesCollection)
        if (snapshot.empty) {
          setExercises(sampleExercises)
        } else {
          const fetchedExercises = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as BreathingExercise[]
          setExercises(fetchedExercises)
        }
      } catch (error) {
        console.error("Error loading breathing exercises:", error)
        setExercises(sampleExercises) // Fallback to sample data
      } finally {
        setLoading(false)
      }
    }
    loadExercises()
  }, [])

  const sampleExercises: BreathingExercise[] = [
    {
      id: "4-7-8",
      name: "4-7-8 Relaxation",
      description: "A powerful technique for reducing anxiety and promoting sleep",
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 4,
      difficulty: "beginner",
      benefits: ["Reduces anxiety", "Promotes sleep", "Calms nervous system"],
      hueCoinsReward: 20,
    },
    {
      id: "box-breathing",
      name: "Box Breathing",
      description: "Equal timing for all phases, used by Navy SEALs for focus",
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 6,
      difficulty: "beginner",
      benefits: ["Improves focus", "Reduces stress", "Enhances performance"],
      hueCoinsReward: 18,
    },
    {
      id: "triangle-breathing",
      name: "Triangle Breathing",
      description: "Three-phase breathing without hold, perfect for beginners",
      inhale: 4,
      hold: 0,
      exhale: 4,
      cycles: 8,
      difficulty: "beginner",
      benefits: ["Simple technique", "Builds foundation", "Gentle relaxation"],
      hueCoinsReward: 15,
    },
  ]

  useEffect(() => {
    if (isActive && selectedExercise) {
      startBreathingCycle()
    } else {
      stopBreathingCycle()
    }

    return () => stopBreathingCycle()
  }, [isActive, selectedExercise])

  const startBreathingCycle = () => {
    if (!selectedExercise) return

    const exercise = selectedExercise
    let phase: "inhale" | "hold" | "exhale" = "inhale"
    let timeLeft = exercise.inhale
    let cycle = 0

    setCurrentPhase(phase)
    setTimeRemaining(timeLeft)
    setCurrentCycle(cycle)

    intervalRef.current = setInterval(() => {
      timeLeft -= 1

      if (timeLeft <= 0) {
        // Move to next phase
        if (phase === "inhale") {
          if (exercise.hold > 0) {
            phase = "hold"
            timeLeft = exercise.hold
          } else {
            phase = "exhale"
            timeLeft = exercise.exhale
          }
        } else if (phase === "hold") {
          phase = "exhale"
          timeLeft = exercise.exhale
        } else if (phase === "exhale") {
          cycle += 1
          if (cycle >= exercise.cycles) {
            // Exercise complete
            setIsActive(false)
            onReward(exercise.hueCoinsReward)
            // Update user progress in Firestore
            if (userData && userData.uid) {
              const userRef = doc(db, "users", userData.uid)
              const updatedCompletedActivities = [...(userData.completedActivities || []), exercise.id]
              const updatedSessionHistory = [
                ...(userData.sessionHistory || []),
                {
                  id: exercise.id,
                  type: "breathing",
                  title: exercise.name,
                  completedAt: new Date(),
                  reward: exercise.hueCoinsReward,
                },
              ]
              updateDoc(userRef, {
                completedActivities: updatedCompletedActivities,
                sessionHistory: updatedSessionHistory,
                totalExperience: (userData.totalExperience || 0) + exercise.hueCoinsReward,
              })
              onProgressUpdate({
                ...userData,
                completedActivities: updatedCompletedActivities,
                sessionHistory: updatedSessionHistory,
                totalExperience: (userData.totalExperience || 0) + exercise.hueCoinsReward,
              })
            }
            return
          }
          phase = "inhale"
          timeLeft = exercise.inhale
        }
      }

      setCurrentPhase(phase)
      setTimeRemaining(timeLeft)
      setCurrentCycle(cycle)
    }, 1000)
  }

  const stopBreathingCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentCycle(0)
    setCurrentPhase("inhale")
    setTimeRemaining(selectedExercise?.inhale || 0)
  }

  const createCustomExercise = (): BreathingExercise => ({
    id: "custom",
    name: "Custom Breathing",
    description: "Your personalized breathing pattern",
    inhale: customSettings.inhale,
    hold: customSettings.hold,
    exhale: customSettings.exhale,
    cycles: customSettings.cycles,
    difficulty: "intermediate",
    benefits: ["Personalized practice", "Flexible timing"],
    hueCoinsReward: 25,
  })

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "inhale":
        return "from-green-500 to-emerald-500"
      case "hold":
        return "from-yellow-500 to-orange-500"
      case "exhale":
        return "from-blue-500 to-cyan-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
      default:
        return "Ready"
    }
  }

  const CircleVisualizer = () => {
    const scale = currentPhase === "inhale" ? 1.2 : currentPhase === "exhale" ? 0.8 : 1
    const duration = selectedExercise
      ? currentPhase === "inhale"
        ? selectedExercise.inhale
        : currentPhase === "hold"
          ? selectedExercise.hold
          : selectedExercise.exhale
      : 4

    return (
      <div className="relative w-64 h-64 mx-auto">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${getPhaseColor()} rounded-full transition-transform duration-1000 ease-in-out opacity-30`}
          style={{
            transform: `scale(${scale})`,
            transitionDuration: `${duration}s`,
          }}
        />
        <div
          className={`absolute inset-4 bg-gradient-to-r ${getPhaseColor()} rounded-full transition-transform duration-1000 ease-in-out opacity-60`}
          style={{
            transform: `scale(${scale})`,
            transitionDuration: `${duration}s`,
          }}
        />
        <div
          className={`absolute inset-8 bg-gradient-to-r ${getPhaseColor()} rounded-full transition-transform duration-1000 ease-in-out`}
          style={{
            transform: `scale(${scale})`,
            transitionDuration: `${duration}s`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">{timeRemaining}</div>
            <div className="text-lg text-white opacity-80">{getPhaseInstruction()}</div>
          </div>
        </div>
      </div>
    )
  }

  const WaveVisualizer = () => {
    const amplitude = currentPhase === "inhale" ? 60 : currentPhase === "exhale" ? 20 : 40
    const frequency = currentPhase === "hold" ? 0.5 : 1

    return (
      <div className="relative w-full h-64 mx-auto overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 100 Q 100 ${100 - amplitude} 200 100 T 400 100`}
            stroke="url(#waveGradient)"
            strokeWidth="4"
            fill="none"
            className="animate-pulse"
            style={{
              animationDuration: `${2 / frequency}s`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl font-bold text-white mb-2">{timeRemaining}</div>
            <div className="text-lg text-white opacity-80">{getPhaseInstruction()}</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-green-950/95 to-emerald-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Breathing Coach</h2>
              <p className="text-slate-300">Breathwork techniques for anxiety and stress relief</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Exercise Selection */}
          <div className="w-1/3 border-r border-white/10 p-6 overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Breathing Exercises</h3>

            <div className="space-y-4 mb-6">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    selectedExercise?.id === exercise.id
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <h4 className="font-bold text-white mb-2">{exercise.name}</h4>
                  <p className="text-sm text-slate-300 mb-3">{exercise.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                    <span>Inhale: {exercise.inhale}s</span>
                    {exercise.hold > 0 && <span>Hold: {exercise.hold}s</span>}
                    <span>Exhale: {exercise.exhale}s</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {exercise.benefits.slice(0, 2).map((benefit) => (
                      <span key={benefit} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg">
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{exercise.cycles} cycles</span>
                    <span className="text-yellow-400 text-sm">+{exercise.hueCoinsReward} coins</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Mode */}
            <div className="border-t border-white/10 pt-6">
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="w-full p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-2xl text-white hover:bg-purple-600/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Custom Mode</span>
                  </div>
                  <span className="text-sm opacity-80">Personalize</span>
                </div>
              </button>

              {showCustom && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Inhale (s)</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customSettings.inhale}
                        onChange={(e) =>
                          setCustomSettings((prev) => ({ ...prev, inhale: Number.parseInt(e.target.value) }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Hold (s)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={customSettings.hold}
                        onChange={(e) =>
                          setCustomSettings((prev) => ({ ...prev, hold: Number.parseInt(e.target.value) }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Exhale (s)</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customSettings.exhale}
                        onChange={(e) =>
                          setCustomSettings((prev) => ({ ...prev, exhale: Number.parseInt(e.target.value) }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Cycles</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customSettings.cycles}
                        onChange={(e) =>
                          setCustomSettings((prev) => ({ ...prev, cycles: Number.parseInt(e.target.value) }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedExercise(createCustomExercise())}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Use Custom Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Practice Area */}
          <div className="flex-1 flex flex-col">
            {selectedExercise ? (
              <>
                {/* Exercise Info */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedExercise.name}</h3>
                      <p className="text-slate-300">{selectedExercise.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{currentCycle + 1}</div>
                        <div className="text-sm text-slate-300">of {selectedExercise.cycles}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setVisualizer(visualizer === "circle" ? "wave" : "circle")}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Settings className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-slate-300">
                    <span>Inhale: {selectedExercise.inhale}s</span>
                    {selectedExercise.hold > 0 && <span>Hold: {selectedExercise.hold}s</span>}
                    <span>Exhale: {selectedExercise.exhale}s</span>
                    <span>•</span>
                    <span>{selectedExercise.cycles} cycles</span>
                  </div>
                </div>

                {/* Visualizer */}
                <div className="flex-1 flex items-center justify-center p-8">
                  {visualizer === "circle" ? <CircleVisualizer /> : <WaveVisualizer />}
                </div>

                {/* Controls */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={resetExercise}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <RotateCcw className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      {isActive ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => setVisualizer(visualizer === "circle" ? "wave" : "circle")}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Timer className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-slate-300 text-sm">
                      {isActive
                        ? "Follow the rhythm and breathe naturally"
                        : "Press play to begin your breathing practice"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Wind className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Select a Breathing Exercise</h3>
                  <p className="text-slate-300">Choose from our guided techniques or create your own custom pattern</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
