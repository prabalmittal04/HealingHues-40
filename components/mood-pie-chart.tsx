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
    Excellent: "#f472b6",
    Good: "#34d399",
    Excited: "#c4b5fd",
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
          { name: "Calm", value: 25, color: getMoodColor("Calm") },
          { name: "Excellent", value: 20, color: getMoodColor("Excellent") },
          { name: "Good", value: 15, color: getMoodColor("Good") },
          { name: "Anxious", value: 7, color: getMoodColor("Anxious") },
          { name: "Sad", value: 3, color: getMoodColor("Sad") },
        ]

  // Handler for mouse enter on slice (for animation)
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }
  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="h-80 w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            activeIndex={activeIndex ?? undefined}
            activeShape={(props: any) => {
              const RADIAN = Math.PI / 180
              const {
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                startAngle,
                endAngle,
                fill,
                payload,
                percent,
                value,
              } = props
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
                    outerRadius={outerRadius + 15}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{
                      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                    }}
                  />
                  <path d={`M${sx},${sy}L${mx},${my}`} stroke={fill} fill="none" strokeWidth={2} />
                  <circle cx={mx} cy={my} r={5} fill={fill} stroke="white" strokeWidth={2} />
                  <text
                    x={mx + (cos >= 0 ? 1 : -1) * 12}
                    y={my}
                    textAnchor={textAnchor}
                    fill="#333"
                    className="font-semibold text-sm"
                  >
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
                  filter:
                    index === activeIndex
                      ? "drop-shadow(0 0 8px rgba(0,0,0,0.3)) brightness(1.1)"
                      : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
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
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-700 dark:text-slate-200 text-lg">{data.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{data.value} entries</p>
                    <div className="w-4 h-4 rounded-full mt-2" style={{ backgroundColor: data.color }}></div>
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
              <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
