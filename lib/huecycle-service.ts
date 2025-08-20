// HueCycle Service - Local Storage Implementation (No Firebase Required)

// HueCycle Profile Types
export interface HueCycleProfile {
  id?: string
  userId: string
  age: number
  height: number // in cm
  weight: number // in kg
  lastPeriodDate: Date
  averageCycleLength: number // in days
  averagePeriodLength: number // in days
  contraceptiveMethod: string
  medications: string[]
  healthConditions: string[]
  lifestyleFactors: string[]
  commonSymptoms: string[]
  moodPatterns: string[]
  trackingGoals: string[]
  notificationPreferences: string[]
  privacyLevel: "private" | "friends" | "public"
  fertilityGoals: string
  additionalNotes: string
  isOnboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

// HueCycle Entry Types (daily logs)
export interface HueCycleEntry {
  id?: string
  userId: string
  date: Date
  periodFlow?: "none" | "light" | "medium" | "heavy"
  symptoms: string[]
  mood: string[]
  energy: number // 1-5 scale
  sleep: number // hours
  exercise: string[]
  notes: string
  temperature?: number // basal body temperature
  cervicalMucus?: "dry" | "sticky" | "creamy" | "watery" | "egg-white"
  medications: string[]
  sexualActivity: boolean
  timestamp: Date
}

// Cycle Prediction Types
export interface CyclePrediction {
  id?: string
  userId: string
  predictedPeriodStart: Date
  predictedPeriodEnd: Date
  predictedOvulation: Date
  fertilityWindowStart: Date
  fertilityWindowEnd: Date
  confidence: number // 0-100
  basedOnCycles: number
  createdAt: Date
}

// AI Insights Types
export interface HueCycleInsight {
  id?: string
  userId: string
  type: "pattern" | "prediction" | "health" | "lifestyle" | "fertility"
  title: string
  description: string
  recommendation: string
  confidence: number
  dataPoints: string[]
  isRead: boolean
  createdAt: Date
}

// Local Storage Keys
const STORAGE_KEYS = {
  PROFILE: "huecycle_profile_",
  ENTRIES: "huecycle_entries_",
  PREDICTIONS: "huecycle_predictions_",
  INSIGHTS: "huecycle_insights_",
}

// Helper functions for local storage
const getStorageKey = (key: string, userId: string) => `${key}${userId}`

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

const getFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

// Helper function to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Helper function to convert date strings back to Date objects
const convertDates = (obj: any): any => {
  if (!obj) return obj

  const dateFields = [
    "date",
    "lastPeriodDate",
    "createdAt",
    "updatedAt",
    "timestamp",
    "predictedPeriodStart",
    "predictedPeriodEnd",
    "predictedOvulation",
    "fertilityWindowStart",
    "fertilityWindowEnd",
  ]

  const converted = { ...obj }

  dateFields.forEach((field) => {
    if (converted[field]) {
      converted[field] = new Date(converted[field])
    }
  })

  return converted
}

// Create HueCycle Profile
export const createHueCycleProfile = async (profileData: Omit<HueCycleProfile, "id" | "createdAt" | "updatedAt">) => {
  try {
    console.log("Creating HueCycle profile:", profileData.userId)

    if (!profileData.userId) {
      throw new Error("User ID is required to create HueCycle profile")
    }

    const profile = {
      ...profileData,
      id: profileData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const storageKey = getStorageKey(STORAGE_KEYS.PROFILE, profileData.userId)
    saveToStorage(storageKey, profile)

    console.log("HueCycle profile created successfully")
    return profile
  } catch (error) {
    console.error("Error creating HueCycle profile:", error)
    throw error
  }
}

// Get HueCycle Profile
export const getHueCycleProfile = async (userId: string): Promise<HueCycleProfile | null> => {
  try {
    if (!userId) {
      console.error("No userId provided for HueCycle profile")
      return null
    }

    const storageKey = getStorageKey(STORAGE_KEYS.PROFILE, userId)
    const data = getFromStorage(storageKey)

    if (data) {
      return convertDates(data)
    }

    return null
  } catch (error) {
    console.error("Error getting HueCycle profile:", error)
    return null
  }
}

// Update HueCycle Profile
export const updateHueCycleProfile = async (userId: string, updates: Partial<HueCycleProfile>) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to update HueCycle profile")
    }

    const storageKey = getStorageKey(STORAGE_KEYS.PROFILE, userId)
    const existingProfile = getFromStorage(storageKey)

    if (existingProfile) {
      const updatedProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date(),
      }

      saveToStorage(storageKey, updatedProfile)
      console.log("HueCycle profile updated successfully")
    }
  } catch (error) {
    console.error("Error updating HueCycle profile:", error)
    throw error
  }
}

// Save HueCycle Entry
export const saveHueCycleEntry = async (entryData: Omit<HueCycleEntry, "id" | "timestamp">) => {
  try {
    console.log("Saving HueCycle entry:", entryData.userId, entryData.date)

    if (!entryData.userId) {
      throw new Error("User ID is required to save HueCycle entry")
    }

    const entry = {
      ...entryData,
      id: generateId(),
      timestamp: new Date(),
    }

    const storageKey = getStorageKey(STORAGE_KEYS.ENTRIES, entryData.userId)
    const existingEntries = getFromStorage(storageKey) || []

    existingEntries.push(entry)
    saveToStorage(storageKey, existingEntries)

    console.log("HueCycle entry saved successfully with ID:", entry.id)
    return entry
  } catch (error) {
    console.error("Error saving HueCycle entry:", error)
    throw error
  }
}

// Get HueCycle Entries
export const getHueCycleEntries = async (userId: string, limitCount = 100): Promise<HueCycleEntry[]> => {
  try {
    console.log("Fetching HueCycle entries for user:", userId)

    if (!userId) {
      console.error("No userId provided for HueCycle entries")
      return []
    }

    const storageKey = getStorageKey(STORAGE_KEYS.ENTRIES, userId)
    const entries = getFromStorage(storageKey) || []

    // Convert dates and sort by date (newest first)
    const convertedEntries = entries
      .map((entry: any) => convertDates(entry))
      .sort((a: HueCycleEntry, b: HueCycleEntry) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limitCount)

    console.log("Successfully fetched HueCycle entries:", convertedEntries.length)
    return convertedEntries
  } catch (error) {
    console.error("Error fetching HueCycle entries:", error)
    return []
  }
}

// Update HueCycle Entry
export const updateHueCycleEntry = async (entryId: string, updates: Partial<HueCycleEntry>) => {
  try {
    if (!entryId || !updates.userId) {
      throw new Error("Entry ID and User ID are required to update HueCycle entry")
    }

    const storageKey = getStorageKey(STORAGE_KEYS.ENTRIES, updates.userId)
    const entries = getFromStorage(storageKey) || []

    const entryIndex = entries.findIndex((entry: any) => entry.id === entryId)

    if (entryIndex !== -1) {
      entries[entryIndex] = {
        ...entries[entryIndex],
        ...updates,
        timestamp: new Date(),
      }

      saveToStorage(storageKey, entries)
      console.log("HueCycle entry updated successfully")
    }
  } catch (error) {
    console.error("Error updating HueCycle entry:", error)
    throw error
  }
}

// Delete HueCycle Entry
export const deleteHueCycleEntry = async (entryId: string, userId?: string) => {
  try {
    if (!entryId) {
      throw new Error("Entry ID is required to delete HueCycle entry")
    }

    // If userId is not provided, we need to find it by searching all entries
    if (!userId) {
      // For simplicity, we'll require userId to be passed
      throw new Error("User ID is required to delete HueCycle entry")
    }

    const storageKey = getStorageKey(STORAGE_KEYS.ENTRIES, userId)
    const entries = getFromStorage(storageKey) || []

    const filteredEntries = entries.filter((entry: any) => entry.id !== entryId)
    saveToStorage(storageKey, filteredEntries)

    console.log("HueCycle entry deleted successfully")
  } catch (error) {
    console.error("Error deleting HueCycle entry:", error)
    throw error
  }
}

// Save Cycle Prediction
export const saveCyclePrediction = async (predictionData: Omit<CyclePrediction, "id" | "createdAt">) => {
  try {
    console.log("Saving cycle prediction:", predictionData.userId)

    if (!predictionData.userId) {
      throw new Error("User ID is required to save cycle prediction")
    }

    const prediction = {
      ...predictionData,
      id: generateId(),
      createdAt: new Date(),
    }

    const storageKey = getStorageKey(STORAGE_KEYS.PREDICTIONS, predictionData.userId)
    const existingPredictions = getFromStorage(storageKey) || []

    existingPredictions.push(prediction)
    saveToStorage(storageKey, existingPredictions)

    console.log("Cycle prediction saved successfully with ID:", prediction.id)
    return prediction
  } catch (error) {
    console.error("Error saving cycle prediction:", error)
    throw error
  }
}

// Get Latest Cycle Prediction
export const getLatestCyclePrediction = async (userId: string): Promise<CyclePrediction | null> => {
  try {
    if (!userId) {
      console.error("No userId provided for cycle prediction")
      return null
    }

    const storageKey = getStorageKey(STORAGE_KEYS.PREDICTIONS, userId)
    const predictions = getFromStorage(storageKey) || []

    if (predictions.length === 0) {
      console.log("No cycle predictions found for user:", userId)
      return null
    }

    // Get the most recent prediction
    const sortedPredictions = predictions
      .map((prediction: any) => convertDates(prediction))
      .sort(
        (a: CyclePrediction, b: CyclePrediction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

    return sortedPredictions[0]
  } catch (error) {
    console.error("Error getting cycle prediction:", error)
    return null
  }
}

// Save HueCycle Insight
export const saveHueCycleInsight = async (insightData: Omit<HueCycleInsight, "id" | "createdAt">) => {
  try {
    console.log("Saving HueCycle insight:", insightData.userId, insightData.type)

    if (!insightData.userId) {
      throw new Error("User ID is required to save HueCycle insight")
    }

    const insight = {
      ...insightData,
      id: generateId(),
      createdAt: new Date(),
    }

    const storageKey = getStorageKey(STORAGE_KEYS.INSIGHTS, insightData.userId)
    const existingInsights = getFromStorage(storageKey) || []

    existingInsights.push(insight)
    saveToStorage(storageKey, existingInsights)

    console.log("HueCycle insight saved successfully with ID:", insight.id)
    return insight
  } catch (error) {
    console.error("Error saving HueCycle insight:", error)
    throw error
  }
}

// Get HueCycle Insights
export const getHueCycleInsights = async (userId: string, limitCount = 20): Promise<HueCycleInsight[]> => {
  try {
    console.log("Fetching HueCycle insights for user:", userId)

    if (!userId) {
      console.error("No userId provided for HueCycle insights")
      return []
    }

    const storageKey = getStorageKey(STORAGE_KEYS.INSIGHTS, userId)
    const insights = getFromStorage(storageKey) || []

    // Convert dates and sort by creation date (newest first)
    const convertedInsights = insights
      .map((insight: any) => convertDates(insight))
      .sort(
        (a: HueCycleInsight, b: HueCycleInsight) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limitCount)

    console.log("Successfully fetched HueCycle insights:", convertedInsights.length)
    return convertedInsights
  } catch (error) {
    console.error("Error fetching HueCycle insights:", error)
    return []
  }
}

// Mark Insight as Read
export const markInsightAsRead = async (insightId: string, userId?: string) => {
  try {
    if (!insightId) {
      throw new Error("Insight ID is required to mark as read")
    }

    // If userId is not provided, we need to find it by searching all insights
    if (!userId) {
      throw new Error("User ID is required to mark insight as read")
    }

    const storageKey = getStorageKey(STORAGE_KEYS.INSIGHTS, userId)
    const insights = getFromStorage(storageKey) || []

    const insightIndex = insights.findIndex((insight: any) => insight.id === insightId)

    if (insightIndex !== -1) {
      insights[insightIndex].isRead = true
      saveToStorage(storageKey, insights)
      console.log("HueCycle insight marked as read")
    }
  } catch (error) {
    console.error("Error marking insight as read:", error)
    throw error
  }
}

// Generate AI Insights (Mock implementation)
export const generateAIInsights = async (userId: string, profile: HueCycleProfile, entries: HueCycleEntry[]) => {
  try {
    console.log("Generating AI insights for user:", userId)

    const insights: Omit<HueCycleInsight, "id" | "createdAt">[] = []

    // Example pattern insight
    if (entries.length >= 3) {
      const recentEntries = entries.slice(0, 3)
      const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length

      if (avgEnergy < 2.5) {
        insights.push({
          userId,
          type: "pattern",
          title: "Low Energy Pattern Detected",
          description: "Your energy levels have been consistently low over the past few days.",
          recommendation: "Consider getting more sleep, eating iron-rich foods, and gentle exercise.",
          confidence: 75,
          dataPoints: [`Average energy: ${avgEnergy.toFixed(1)}/5`],
          isRead: false,
        })
      }

      if (avgEnergy > 4) {
        insights.push({
          userId,
          type: "pattern",
          title: "High Energy Pattern",
          description: "You've been experiencing high energy levels recently.",
          recommendation: "Great time to engage in more physical activities and tackle challenging tasks.",
          confidence: 80,
          dataPoints: [`Average energy: ${avgEnergy.toFixed(1)}/5`],
          isRead: false,
        })
      }
    }

    // Example cycle prediction insight
    if (entries.length >= profile.averageCycleLength / 2) {
      insights.push({
        userId,
        type: "prediction",
        title: "Next Period Prediction",
        description: "Based on your cycle history, your next period is predicted to start soon.",
        recommendation: "Prepare period supplies and consider tracking symptoms more closely.",
        confidence: 85,
        dataPoints: [`Cycle length: ${profile.averageCycleLength} days`],
        isRead: false,
      })
    }

    // Example health insight based on symptoms
    const symptomsCount = entries.reduce((count, entry) => count + entry.symptoms.length, 0)
    if (symptomsCount > entries.length * 2) {
      insights.push({
        userId,
        type: "health",
        title: "Increased Symptom Activity",
        description: "You've been experiencing more symptoms than usual recently.",
        recommendation: "Consider consulting with a healthcare provider if symptoms persist or worsen.",
        confidence: 70,
        dataPoints: [`Average symptoms per day: ${(symptomsCount / entries.length).toFixed(1)}`],
        isRead: false,
      })
    }

    // Example lifestyle insight
    const exerciseEntries = entries.filter((entry) => entry.exercise.length > 0)
    if (exerciseEntries.length > entries.length * 0.7) {
      insights.push({
        userId,
        type: "lifestyle",
        title: "Great Exercise Consistency",
        description: "You've been maintaining excellent exercise habits.",
        recommendation:
          "Keep up the great work! Regular exercise can help with cycle regularity and symptom management.",
        confidence: 90,
        dataPoints: [`Exercise frequency: ${Math.round((exerciseEntries.length / entries.length) * 100)}%`],
        isRead: false,
      })
    }

    // Example fertility insight
    if (profile.fertilityGoals === "trying-to-conceive") {
      insights.push({
        userId,
        type: "fertility",
        title: "Fertility Window Approaching",
        description: "Your fertile window is approaching based on your cycle pattern.",
        recommendation: "Consider tracking basal body temperature and cervical mucus for better timing.",
        confidence: 75,
        dataPoints: [`Goal: ${profile.fertilityGoals}`],
        isRead: false,
      })
    }

    // Save insights to local storage
    for (const insight of insights) {
      await saveHueCycleInsight(insight)
    }

    console.log(`Generated ${insights.length} AI insights`)
    return insights
  } catch (error) {
    console.error("Error generating AI insights:", error)
    throw error
  }
}

// Real-time updates simulation (for compatibility)
export const getHueCycleEntriesRealtime = (userId: string, callback: (entries: HueCycleEntry[]) => void) => {
  // Since we're using localStorage, we'll just call the callback immediately
  // In a real implementation, this would set up a listener
  getHueCycleEntries(userId).then(callback)

  // Return a cleanup function
  return () => {
    // No cleanup needed for localStorage implementation
  }
}

// Clear all HueCycle data for a user (useful for testing)
export const clearHueCycleData = (userId: string) => {
  try {
    const keys = Object.values(STORAGE_KEYS)
    keys.forEach((key) => {
      const storageKey = getStorageKey(key, userId)
      localStorage.removeItem(storageKey)
    })
    console.log("HueCycle data cleared for user:", userId)
  } catch (error) {
    console.error("Error clearing HueCycle data:", error)
  }
}
