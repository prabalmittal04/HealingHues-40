"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState } from "react"
import { Sector } from "recharts"


interface MoodPieChartProps {
  moodCounts?: Record<string, number>
}

interface PieSectorDataItem {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: {
    name: string
    value: number
    color: string
  }
  percent: number
  value: number
}

interface ActiveShapeProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: {
    name: string
    value: number
    color: string
  }
  percent: number
  value: number
}

const getMoodColor = (mood: string): string => {
  const colors: Record<string, string> = {
    Happy: "#fbbf24",
    Calm: "#60a5fa",
    Neutral: "#9ca3af",
    Sad: "#6b7280",
    Angry: "#ef4444",
    Anxious: "#fb923c",
  }
  return colors[mood] || "#9ca3af"
}

export function MoodPieChart({ moodCounts }: MoodPieChartProps) {
  // Track active slice for hover effect
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Calculate percentages from moodCounts
  const data =
    moodCounts && Object.keys(moodCounts).length > 0
      ? (() => {
          const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0)
          return Object.entries(moodCounts).map(([mood, count]) => ({
            name: mood,
            value: count,
            color: getMoodColor(mood),
          }))
        })()
      : [
          { name: "Happy", value: 30, color: getMoodColor("Happy") },
          { name: "Calm", value: 40, color: getMoodColor("Calm") },
          { name: "Neutral", value: 15, color: getMoodColor("Neutral") },
          { name: "Anxious", value: 10, color: getMoodColor("Anxious") },
          { name: "Sad", value: 5, color: getMoodColor("Sad") },
        ]

  // Handler for mouse enter on slice (for animation)
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }
  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="h-64 w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            activeIndex={activeIndex ?? undefined}
            activeShape={(props: any) => {
              const RADIAN = Math.PI / 180
              const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
              const sin = Math.sin(-RADIAN * midAngle)
              const cos = Math.cos(-RADIAN * midAngle)
              const sx = cx + (outerRadius + 10) * cos
              const sy = cy + (outerRadius + 10) * sin
              const mx = cx + (outerRadius + 30) * cos
              const my = cy + (outerRadius + 30) * sin
              const textAnchor = cos >= 0 ? "start" : "end"

              return (
                <g>
                  <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
                    {payload.name}
                  </text>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  />
                  <path d={`M${sx},${sy}L${mx},${my}`} stroke={fill} fill="none" />
                  <circle cx={mx} cy={my} r={4} fill={fill} stroke="none" />
                  <text x={mx + (cos >= 0 ? 1 : -1) * 12} y={my} textAnchor={textAnchor} fill="#333" className="font-semibold">
                    {`${value} (${(percent * 100).toFixed(0)}%)`}
                  </text>
                </g>
              )
            }}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{
                  filter: index === activeIndex ? "drop-shadow(0 0 5px rgba(0,0,0,0.3))" : "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{data.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{data.value} entries</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
