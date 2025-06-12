"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MoodChartProps {
  trendData?: Array<{ date: string; moodValue: number }>
}

// ✅ Move helper above its usage
const getMoodLabel = (value: number): string => {
  if (value >= 4) return "Happy"
  if (value >= 3) return "Calm"
  if (value >= 2) return "Neutral"
  if (value >= 1) return "Sad"
  return "Unknown"
}

export function MoodChart({ trendData }: MoodChartProps) {
  const data =
    trendData && trendData.length > 0
      ? trendData.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mood: item.moodValue,
          label: getMoodLabel(item.moodValue),
        }))
      : [
          { date: "Jan 10", mood: 3, label: "Calm" },
          { date: "Jan 11", mood: 2, label: "Tired" },
          { date: "Jan 12", mood: 4, label: "Happy" },
          { date: "Jan 13", mood: 1, label: "Anxious" },
          { date: "Jan 14", mood: 3, label: "Calm" },
          { date: "Jan 15", mood: 4, label: "Happy" },
          { date: "Jan 16", mood: 3, label: "Calm" },
        ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs text-slate-500" />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => getMoodLabel(value)}
            axisLine={false}
            tickLine={false}
            className="text-xs text-slate-500"
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Mood: {data.label}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#8b5cf6" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
