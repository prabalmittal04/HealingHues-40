"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MoodBarChartProps {
  moodCounts?: Record<string, number>
}

export function MoodBarChart({ moodCounts }: MoodBarChartProps) {
  // Use provided moodCounts or fallback to static data
  const data =
    moodCounts && Object.keys(moodCounts).length > 0
      ? Object.entries(moodCounts).map(([mood, count]) => ({
          mood,
          count,
          color: getMoodColor(mood),
        }))
      : [
          { mood: "Happy", count: 12, color: "#fbbf24" },
          { mood: "Calm", count: 18, color: "#60a5fa" },
          { mood: "Neutral", count: 8, color: "#9ca3af" },
          { mood: "Anxious", count: 5, color: "#fb923c" },
          { mood: "Sad", count: 2, color: "#6b7280" },
        ]

  const getMoodColor = (mood: string): string => {
    const colors: Record<string, string> = {
      Happy: "#fbbf24",
      Calm: "#60a5fa",
      Neutral: "#9ca3af",
      Sad: "#6b7280",
      Angry: "#ef4444",
    }
    return colors[mood] || "#9ca3af"
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="mood" axisLine={false} tickLine={false} className="text-xs text-slate-500" />
          <YAxis axisLine={false} tickLine={false} className="text-xs text-slate-500" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Count: {payload[0].value}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
