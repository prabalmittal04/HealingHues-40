"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface YourProgressProps {
  averageMood: number
  totalEntries: number
  streakDays: number
  mostCommonMood: string
}

export const YourProgress = ({
  averageMood,
  totalEntries,
  streakDays,
  mostCommonMood,
}: YourProgressProps) => {
  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <p className="text-sm text-green-700 dark:text-green-300 mb-1">Average Mood</p>
          <p className="font-medium text-slate-700 dark:text-slate-200">{averageMood}/5</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalEntries}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{streakDays}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Day Streak</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Most Common:</p>
          <Badge variant="secondary" className="rounded-full">
            {mostCommonMood}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
