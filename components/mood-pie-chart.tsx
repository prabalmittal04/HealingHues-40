"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface MoodPieChartProps {
  moodCounts?: Record<string, number>
}

export function MoodPieChart({ moodCounts }: MoodPieChartProps) {
  // Calculate percentages from moodCounts
  const data =
    moodCounts && Object.keys(moodCounts).length > 0
      ? (() => {
          const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0)
          return Object.entries(moodCounts).map(([mood, count]) => ({
            name: mood,
            value: Math.round((count / total) * 100),
            color: getMoodColor(mood),
          }))
        })()
      : [
          { name: "Happy", value: 30, color: "#fbbf24" },
          { name: "Calm", value: 40, color: "#60a5fa" },
          { name: "Neutral", value: 15, color: "#9ca3af" },
          { name: "Anxious", value: 10, color: "#fb923c" },
          { name: "Sad", value: 5, color: "#6b7280" },
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
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{data.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{data.value}% of entries</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
