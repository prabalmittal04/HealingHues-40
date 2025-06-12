"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Clock,
  Home,
  AlertTriangle,
  Send,
  Loader2,
  Shield,
  Brain,
  Activity,
  CheckCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { saveMedicalQuery, getMedicalQueries, type MedicalQuery } from "@/lib/firestore"
import { medicalAIService } from "@/lib/medical-ai-service"

export default function MedicalHelpPage() {
  const { user } = useAuth()
  const [symptom, setSymptom] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null)
  const [pastQueries, setPastQueries] = useState<MedicalQuery[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user?.uid) {
      console.log("Setting up medical queries listener for user:", user.uid)
      const unsubscribe = getMedicalQueries(user.uid, (queries) => {
        console.log("Received medical queries:", queries.length)
        setPastQueries(queries)
      })
      return unsubscribe
    }
  }, [user?.uid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptom.trim() || !user?.uid) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("Analyzing symptoms:", symptom)

      // Check for emergency symptoms first
      if (medicalAIService.isEmergencySymptom(symptom)) {
        setError(
          "⚠️ Your symptoms may require immediate medical attention. Please call emergency services (112) or go to the nearest emergency room immediately.",
        )
        setIsLoading(false)
        return
      }

      // Analyze symptoms using the medical AI service
      const analysis = await medicalAIService.analyzeSymptoms(symptom)
      console.log("Analysis result:", analysis)

      setCurrentAnalysis(analysis)

      // Save to Firestore
      await saveMedicalQuery(user.uid, {
        symptom,
        analysis,
      })

      console.log("Medical query saved successfully")
      setSuccess("Analysis completed successfully! Review the recommendations below.")
      setSymptom("")
    } catch (error) {
      console.error("Error analyzing symptom:", error)
      setError("Unable to analyze symptoms at this time. Please try again or consult a healthcare provider.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-500 text-white"
      case "urgent":
        return "bg-orange-500 text-white"
      case "routine":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <ProtectedRoute requireEmailVerification>
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5E8] via-[#F0F8FF] to-[#E6F3FF] dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900">
        <Navigation />

        <main className="max-w-7xl mx-auto p-4 md:p-6 pt-20 md:pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg mb-6 md:mb-8">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200">
                      AI Medical Assistant
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      Get intelligent health insights powered by advanced medical AI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Disclaimer */}
            <Alert className="mb-6 md:mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only and is
                not a substitute for professional medical advice. Always consult with a qualified healthcare provider
                for proper diagnosis and treatment. In case of emergency, call 112 immediately.
              </AlertDescription>
            </Alert>

            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 md:mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 md:mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Input and Current Analysis */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Symptom Input */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-500" />
                      Describe Your Symptoms
                    </CardTitle>
                    <CardDescription>
                      Please provide detailed information about your symptoms, including when they started, severity,
                      and any relevant context.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Textarea
                        placeholder="Example: I have been experiencing a persistent headache for the past 2 days. The pain is mostly on the right side of my head and gets worse when I look at screens. I also feel slightly nauseous and have trouble concentrating..."
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        className="min-h-[120px] rounded-xl resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        disabled={!symptom.trim() || isLoading}
                        className="w-full rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Symptoms...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Analyze Symptoms
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Current Analysis Results */}
                <AnimatePresence>
                  {currentAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                        <CardHeader className="p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200">
                              AI Analysis Results
                            </CardTitle>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getSeverityColor(currentAnalysis.severity)}>
                                {currentAnalysis.severity.toUpperCase()} SEVERITY
                              </Badge>
                              <Badge className={getUrgencyColor(currentAnalysis.urgencyLevel)}>
                                {currentAnalysis.urgencyLevel.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          {currentAnalysis.recommendSeekingCare && (
                            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 mt-4">
                              <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              <AlertDescription className="text-orange-700 dark:text-orange-300">
                                <strong>Recommendation:</strong> Consider consulting with a healthcare provider for
                                proper evaluation and treatment.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0 space-y-6">
                          {/* Possible Causes */}
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                              Possible Causes
                            </h3>
                            <div className="space-y-2">
                              {currentAnalysis.possibleCauses.map((cause: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                >
                                  <p className="text-sm text-slate-700 dark:text-slate-200">{cause}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Home Remedies */}
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                              <Home className="w-4 h-4 mr-2 text-green-500" />
                              Home Remedies & Self-Care
                            </h3>
                            <div className="space-y-2">
                              {currentAnalysis.homeRemedies.map((remedy: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                >
                                  <p className="text-sm text-slate-700 dark:text-slate-200">{remedy}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Medical Treatments */}
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                              <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />
                              Medical Treatments
                            </h3>
                            <div className="space-y-2">
                              {currentAnalysis.medicalTreatments.map((treatment: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                >
                                  <p className="text-sm text-slate-700 dark:text-slate-200">{treatment}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Recovery Time */}
                          <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-purple-500" />
                              Estimated Recovery
                            </h3>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <p className="text-sm text-slate-700 dark:text-slate-200">
                                {currentAnalysis.estimatedRecovery}
                              </p>
                            </div>
                          </div>

                          {/* Follow-up Advice */}
                          {currentAnalysis.followUpAdvice && currentAnalysis.followUpAdvice.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                                <Activity className="w-4 h-4 mr-2 text-indigo-500" />
                                Follow-up Advice
                              </h3>
                              <div className="space-y-2">
                                {currentAnalysis.followUpAdvice.map((advice: string, index: number) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                                  >
                                    <p className="text-sm text-slate-700 dark:text-slate-200">{advice}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Warning Signs */}
                          {currentAnalysis.warningSignsToWatch && currentAnalysis.warningSignsToWatch.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                                Warning Signs to Watch
                              </h3>
                              <div className="space-y-2">
                                {currentAnalysis.warningSignsToWatch.map((warning: string, index: number) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                                  >
                                    <p className="text-sm text-slate-700 dark:text-slate-200">{warning}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column - Past Queries and Info */}
              <div className="space-y-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg text-slate-700 dark:text-slate-200">
                        Medical History
                      </CardTitle>
                      <Badge variant="secondary">{pastQueries.length}</Badge>
                    </div>
                    <CardDescription>Your previous symptom analyses</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {pastQueries.length > 0 ? (
                        pastQueries.map((query, index) => (
                          <motion.div
                            key={query.id || index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {formatDate(query.timestamp as Date)}
                              </Badge>
                              <Badge className={getSeverityColor(query.analysis.severity)}>
                                {query.analysis.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-200 mb-2 line-clamp-2">
                              {query.symptom}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                {query.analysis.possibleCauses.length} causes
                              </Badge>
                              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                {query.analysis.homeRemedies.length} remedies
                              </Badge>
                              <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                {query.analysis.medicalTreatments.length} treatments
                              </Badge>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No medical queries yet. Start by describing your symptoms above.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Notice */}
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Emergency Situations</h3>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        If you're experiencing severe symptoms, chest pain, difficulty breathing, or any
                        life-threatening emergency, call emergency services immediately.
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                      >
                        Emergency: 112
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Features */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">AI-Powered Analysis</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                        Our medical AI analyzes your symptoms using advanced algorithms and medical databases to provide
                        comprehensive health insights.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <span>✓ Symptom Analysis</span>
                        </div>
                        <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <span>✓ Treatment Options</span>
                        </div>
                        <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <span>✓ Recovery Estimates</span>
                        </div>
                        <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <span>✓ Emergency Detection</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
