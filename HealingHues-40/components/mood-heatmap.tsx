"use client"

import { motion } from "framer-motion"

const generateHeatmapData = () => {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      day: date.getDate(),
      intensity: Math.floor(Math.random() * 5) + 1, // 1-5 intensity
      mood: ["😔", "😐", "🙂", "😊", "🥰"][Math.floor(Math.random() * 5)],
    })
  }

  return data
}

const getIntensityColor = (intensity: number) => {
  const colors = [
    "bg-gray-100 dark:bg-gray-800",
    "bg-green-100 dark:bg-green-900/30",
    "bg-green-200 dark:bg-green-800/50",
    "bg-green-300 dark:bg-green-700/70",
    "bg-green-400 dark:bg-green-600/80",
    "bg-green-500 dark:bg-green-500",
  ]
  return colors[intensity] || colors[0]
}

export function MoodHeatmap() {
  const heatmapData = generateHeatmapData()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-10 gap-1">
        {heatmapData.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className={`
              w-6 h-6 rounded-sm flex items-center justify-center text-xs
              ${getIntensityColor(day.intensity)}
              hover:scale-110 transition-transform cursor-pointer
              border border-slate-200 dark:border-slate-600
            `}
            title={`${day.date}: Intensity ${day.intensity}/5`}
          >
            <span className="text-xs">{day.day}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>30 days ago</span>
        <div className="flex items-center space-x-1">
          <span>Less</span>
          {[1, 2, 3, 4, 5].map((intensity) => (
            <div key={intensity} className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`} />
          ))}
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  )
}
