"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Brain,
  Heart,
  Activity,
  Lightbulb,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Flower2,
  Sparkles,
  Target,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { markInsightAsRead, type HueCycleInsight } from "@/lib/huecycle-service"

interface HueCycleInsightsProps {
  insights: HueCycleInsight[]
  onInsightRead: () => void
}

const INSIGHT_ICONS = {
  pattern: BarChart3,
  prediction: TrendingUp,
  health: Heart,
  lifestyle: Activity,
  fertility: Flower2,
}

const INSIGHT_COLORS = {
  pattern: "from-blue-400 to-cyan-400",
  prediction: "from-purple-400 to-indigo-400",
  health: "from-red-400 to-pink-400",
  lifestyle: "from-green-400 to-emerald-400",
  fertility: "from-yellow-400 to-orange-400",
}

export default function HueCycleInsights({ insights, onInsightRead }: HueCycleInsightsProps) {
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<string>("all")

  const handleMarkAsRead = async (insight: HueCycleInsight) => {
    if (!user?.uid || !insight.id || insight.isRead) return

    try {
      await markInsightAsRead(insight.id, user.uid)
      onInsightRead()
    } catch (error) {
      console.error("Error marking insight as read:", error)
    }
  }

  const filteredInsights =
    selectedType === "all" ? insights : insights.filter((insight) => insight.type === selectedType)

  const unreadCount = insights.filter((insight) => !insight.isRead).length
  const insightsByType = insights.reduce(
    (acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Insights</h2>
          <p className="text-pink-100">Personalized insights powered by advanced AI</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-pink-500/20 text-pink-200 border-pink-300/30">{unreadCount} new insights</Badge>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate More
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(INSIGHT_ICONS).map(([type, IconComponent]) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => setSelectedType(type)}
          >
            <Card
              className={`bg-white/10 backdrop-blur-lg border-pink-300/30 hover:bg-white/20 transition-all duration-300 ${
                selectedType === type ? "ring-2 ring-pink-400" : ""
              }`}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-8 h-8 bg-gradient-to-r ${INSIGHT_COLORS[type]} rounded-full flex items-center justify-center mx-auto mb-2`}
                >
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl font-bold text-white">{insightsByType[type] || 0}</div>
                <div className="text-xs text-pink-200 capitalize">{type}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredInsights.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-pink-300/30">
              <CardContent className="text-center py-12">
                <Brain className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedType === "all" ? "No insights available" : `No ${selectedType} insights yet`}
                </h3>
                <p className="text-pink-200 mb-4">Keep tracking your cycle to unlock personalized AI insights</p>
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                  <Target className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredInsights.map((insight, index) => {
              const IconComponent = INSIGHT_ICONS[insight.type]

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`bg-white/10 backdrop-blur-lg border-pink-300/30 hover:bg-white/20 transition-all duration-300 ${
                      !insight.isRead ? "ring-2 ring-pink-400/50" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${INSIGHT_COLORS[insight.type]}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <CardTitle className="text-lg font-semibold text-white">{insight.title}</CardTitle>
                              {!insight.isRead && (
                                <Badge className="text-xs bg-pink-500/20 text-pink-200 border-pink-300/30">New</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-pink-300">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize bg-white/10 border-pink-300/30 text-pink-200"
                              >
                                {insight.type}
                              </Badge>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {format(insight.createdAt, "MMM dd")}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!insight.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(insight)}
                            className="text-pink-300 hover:text-white hover:bg-white/10"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-pink-100">{insight.description}</p>

                      {/* Confidence Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-pink-300">Confidence Level</span>
                          <span className="font-medium text-white">{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-2 bg-white/20" />
                      </div>

                      {/* Data Points */}
                      {insight.dataPoints && insight.dataPoints.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-pink-200">Based on:</div>
                          <div className="flex flex-wrap gap-2">
                            {insight.dataPoints.map((point, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs bg-white/10 text-pink-200 border-pink-300/30"
                              >
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendation */}
                      <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-300/30">
                        <div className="flex items-start space-x-3">
                          <div className="p-1 bg-pink-400/20 rounded-full">
                            <Lightbulb className="w-4 h-4 text-pink-300" />
                          </div>
                          <div>
                            <h4 className="font-medium text-pink-200 mb-1">AI Recommendation</h4>
                            <p className="text-sm text-pink-100">{insight.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Generate More Insights */}
      {insights.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-pink-300/30">
          <CardContent className="text-center py-8">
            <Brain className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Want more personalized insights?</h3>
            <p className="text-pink-200 mb-4">
              Continue tracking your cycle daily to unlock deeper AI-powered insights and predictions.
            </p>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to Premium Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
