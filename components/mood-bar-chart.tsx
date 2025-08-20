"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"

interface MoodBarChartProps {
  moodCounts?: Record<string, number>
}

const gradientDefs = (
  <defs>
    <linearGradient id="happy" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="100%" stopColor="#fde047" />
    </linearGradient>
    <linearGradient id="calm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#bae6fd" />
      <stop offset="100%" stopColor="#60a5fa" />
    </linearGradient>
    <linearGradient id="neutral" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#e5e7eb" />
      <stop offset="100%" stopColor="#9ca3af" />
    </linearGradient>
    <linearGradient id="sad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#cbd5e1" />
      <stop offset="100%" stopColor="#64748b" />
    </linearGradient>
    <linearGradient id="anxious" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fdba74" />
      <stop offset="100%" stopColor="#fb923c" />
    </linearGradient>
    <linearGradient id="angry" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fecaca" />
      <stop offset="100%" stopColor="#f87171" />
    </linearGradient>
    <linearGradient id="excited" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ddd6fe" />
      <stop offset="100%" stopColor="#c4b5fd" />
    </linearGradient>
    <linearGradient id="excellent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fce7f3" />
      <stop offset="100%" stopColor="#f472b6" />
    </linearGradient>
    <linearGradient id="good" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#bbf7d0" />
      <stop offset="100%" stopColor="#34d399" />
    </linearGradient>
  </defs>
)

const getMoodGradientId = (mood: string): string => {
  const ids: Record<string, string> = {
    Happy: "happy",
    Calm: "calm",
    Neutral: "neutral",
    Sad: "sad",
    Anxious: "anxious",
    Angry: "angry",
    Excited: "excited",
    Excellent: "excellent",
    Good: "good",
  }
  return ids[mood] || "neutral"
}

export function MoodBarChart({ moodCounts }: MoodBarChartProps) {
  const data =
    moodCounts && Object.keys(moodCounts).length > 0
      ? Object.entries(moodCounts).map(([mood, count]) => ({
          mood,
          count,
          gradient: `url(#${getMoodGradientId(mood)})`,
        }))
      : [
          { mood: "Happy", count: 12, gradient: "url(#happy)" },
          { mood: "Calm", count: 18, gradient: "url(#calm)" },
          { mood: "Neutral", count: 8, gradient: "url(#neutral)" },
          { mood: "Anxious", count: 5, gradient: "url(#anxious)" },
          { mood: "Sad", count: 2, gradient: "url(#sad)" },
          { mood: "Excellent", count: 15, gradient: "url(#excellent)" },
          { mood: "Good", count: 20, gradient: "url(#good)" },
        ]

  return (
    <div className="h-72 w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          {gradientDefs}
          <XAxis
            dataKey="mood"
            axisLine={false}
            tickLine={false}
            className="text-sm font-medium text-slate-600 dark:text-slate-300"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-sm text-slate-500 dark:text-slate-400"
            tickCount={5}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-w-[120px]">
                    <p className="font-semibold text-slate-700 dark:text-slate-100 mb-1">{label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Count: {payload[0].value}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="count" animationDuration={1000} animationEasing="ease-out" barSize={40} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.gradient}
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.06))",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
