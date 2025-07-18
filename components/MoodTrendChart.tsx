"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoodChart } from "@/components/mood-chart"

interface MoodTrendChartProps {
  trendData?: Array<{ date: string; moodValue: number }>
}

export const MoodTrendChart = ({ trendData }: MoodTrendChartProps) => {
  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-slate-700 dark:text-slate-200">7-Day Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodChart trendData={trendData} />
      </CardContent>
    </Card>
  )
}
