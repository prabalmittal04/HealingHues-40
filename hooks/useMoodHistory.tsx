"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"
import { getUserMoodEntries } from "@/lib/firestore"

interface MoodDataPoint {
  mood: string
  count: number
  date: string
}

interface BreakdownDataPoint {
  category: string
  value: number
  percentage: number
}

export function useMoodHistory() {
  const { user } = useAuth()
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([])
  const [breakdownData, setBreakdownData] = useState<BreakdownDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMoodHistory = async () => {
      if (!user?.uid) {
        setIsLoading(false)
        return
      }

      try {
        const entries = await getUserMoodEntries(user.uid)

        // Process mood distribution data
        const moodCounts: { [key: string]: number } = {}
        const moodLabels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"]

        entries.forEach((entry) => {
          const label = moodLabels[entry.mood - 1] || "Unknown"
          moodCounts[label] = (moodCounts[label] || 0) + 1
        })

        const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
          mood,
          count,
          date: new Date().toISOString().split("T")[0],
        }))

        setMoodData(moodDistribution)

        // Process breakdown data
        const totalEntries = entries.length
        const breakdown = Object.entries(moodCounts).map(([category, value]) => ({
          category,
          value,
          percentage: totalEntries > 0 ? (value / totalEntries) * 100 : 0,
        }))

        setBreakdownData(breakdown)
      } catch (error) {
        console.error("Error loading mood history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMoodHistory()
  }, [user?.uid])

  return {
    moodData,
    breakdownData,
    isLoading,
  }
}
