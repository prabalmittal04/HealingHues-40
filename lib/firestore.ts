import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  where,
  getDocs,
  serverTimestamp,
  type Timestamp,
  deleteDoc,
} from "firebase/firestore"
import type { User } from "firebase/auth"
import { db } from "./firebaseConfig"

// User Profile Types
export interface UserProfile {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  createdAt: Timestamp
  lastLoginAt: Timestamp
}

// Mood Entry Types
export interface MoodEntry {
  id?: string
  mood: number
  moodLabel: string
  note?: string
  timestamp: Timestamp | Date
  userId: string
}

// Chat Message Types
export interface ChatMessage {
  id?: string
  text: string
  sender: "user" | "bot"
  timestamp: Timestamp | Date
  userId: string
  mood?: string
  moodEmoji?: string
  affirmation?: string
  activity?: string
}

// Gratitude Entry Types
export interface GratitudeEntry {
  id?: string
  text: string
  timestamp: Timestamp | Date
  userId: string
}

// Community Message Types
export interface CommunityMessage {
  id?: string
  message: string
  senderName: string
  timestamp: Timestamp | Date
  reactions?: number
}

// Medical Query Types
export interface MedicalQuery {
  id?: string
  symptom: string
  analysis: {
    possibleCauses: string[]
    homeRemedies: string[]
    medicalTreatments: string[]
    estimatedRecovery: string
    severity: "low" | "medium" | "high"
    recommendSeekingCare: boolean
  }
  timestamp: Timestamp | Date
  userId: string
}

// Medicine Order Types
export interface MedicineItem {
  id: string
  name: string
  dosage?: string
  quantity: number
  price?: number
  type: "prescription" | "manual"
  manufacturer?: string
  category?: string
}

export interface MedicineOrder {
  id?: string
  items: MedicineItem[]
  prescriptionUrl?: string
  totalAmount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  timestamp: Timestamp | Date
  userId: string
  deliveryAddress?: string
  paymentMethod?: string
  trackingNumber?: string
  estimatedDelivery?: Date
}

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date()
  if (timestamp.toDate) return timestamp.toDate()
  if (timestamp instanceof Date) return timestamp
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000)
  return new Date(timestamp)
}

// Create or update user profile
export const createUserProfile = async (user: User) => {
  if (!user) return

  const userRef = doc(db, "users", user.uid)

  try {
    const userSnap = await getDoc(userRef)

    const userData: Partial<UserProfile> = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLoginAt: serverTimestamp() as Timestamp,
    }

    if (!userSnap.exists()) {
      userData.createdAt = serverTimestamp() as Timestamp
    }

    await setDoc(userRef, userData, { merge: true })
    console.log("User profile created/updated successfully for:", user.uid)
    return userData as UserProfile
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        lastLoginAt: convertTimestamp(data.lastLoginAt),
      } as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Mood Entries
export const saveMoodEntry = async (userId: string, mood: number, moodLabel: string, note?: string) => {
  try {
    console.log("Saving mood entry:", { userId, mood, moodLabel, note })

    if (!userId || mood < 1 || mood > 5 || !moodLabel) {
      throw new Error("Invalid mood entry data")
    }

    const moodEntry = {
      mood: Number(mood),
      moodLabel: String(moodLabel),
      note: note ? String(note) : "",
      timestamp: serverTimestamp(),
      userId: String(userId),
    }

    const docRef = await addDoc(collection(db, "moodEntries"), moodEntry)
    console.log("Mood entry saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...moodEntry }
  } catch (error) {
    console.error("Error saving mood entry:", error)
    throw error
  }
}

// Get mood entries with real-time updates
export const getMoodEntries = (userId: string, callback: (entries: MoodEntry[]) => void) => {
  try {
    console.log("Setting up mood entries listener for user:", userId)

    if (!userId) {
      console.error("No userId provided for mood entries listener")
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "moodEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(100),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Mood entries snapshot received, size:", snapshot.size)

        const entries = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            mood: Number(data.mood) || 0,
            moodLabel: String(data.moodLabel) || "Unknown",
            note: String(data.note) || "",
            timestamp: convertTimestamp(data.timestamp),
            userId: String(data.userId),
          }
        }) as MoodEntry[]

        console.log("Processed mood entries:", entries.length, entries)
        callback(entries)
      },
      (error) => {
        console.error("Error in mood entries listener:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up mood entries listener:", error)
    callback([])
    return () => {}
  }
}

// Get mood entries as a promise (for one-time fetch)
export const getUserMoodEntries = async (userId: string): Promise<MoodEntry[]> => {
  try {
    console.log("Fetching mood entries for user:", userId)

    if (!userId) {
      console.error("No userId provided for getUserMoodEntries")
      return []
    }

    const q = query(
      collection(db, "moodEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(100),
    )

    const snapshot = await getDocs(q)
    console.log("Mood entries query result - size:", snapshot.size)

    if (snapshot.empty) {
      console.log("No mood entries found for user:", userId)
      return []
    }

    const entries = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        mood: Number(data.mood) || 0,
        moodLabel: String(data.moodLabel) || "Unknown",
        note: String(data.note) || "",
        timestamp: convertTimestamp(data.timestamp),
        userId: String(data.userId),
      }
    }) as MoodEntry[]

    console.log("Successfully fetched mood entries:", entries.length, entries)
    return entries
  } catch (error) {
    console.error("Error fetching user mood entries:", error)
    throw error
  }
}

// Enhanced mood statistics calculation
export const getMoodStatistics = async (userId: string) => {
  if (!userId) {
    console.log("No userId provided for mood statistics")
    return {
      totalEntries: 0,
      averageMood: 0,
      mostCommonMood: "No data yet",
      streakDays: 0,
      moodCounts: {},
      last7DaysTrend: [],
    }
  }

  try {
    console.log("Calculating mood statistics for user:", userId)

    const entries = await getUserMoodEntries(userId)
    console.log("Entries for statistics calculation:", entries.length)

    if (entries.length === 0) {
      console.log("No entries found, returning default statistics")
      return {
        totalEntries: 0,
        averageMood: 0,
        mostCommonMood: "No data yet",
        streakDays: 0,
        moodCounts: {},
        last7DaysTrend: [],
      }
    }

    // Calculate mood counts and average
    const moodCounts: Record<string, number> = {}
    let totalMoodValue = 0

    entries.forEach((entry) => {
      const moodLabel = entry.moodLabel || "Unknown"
      moodCounts[moodLabel] = (moodCounts[moodLabel] || 0) + 1
      totalMoodValue += entry.mood || 0
    })

    const averageMood = entries.length > 0 ? totalMoodValue / entries.length : 0

    // Find most common mood
    let mostCommonMood = "No data yet"
    let maxCount = 0
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommonMood = mood
      }
    })

    // Calculate streak days
    const streakDays = calculateStreakDays(entries)

    // Calculate 7-day trend
    const last7DaysTrend = calculateLast7DaysTrend(entries)

    const stats = {
      totalEntries: entries.length,
      averageMood: Number(averageMood.toFixed(1)),
      mostCommonMood,
      streakDays,
      moodCounts,
      last7DaysTrend,
    }

    console.log("Calculated mood statistics:", stats)
    return stats
  } catch (error) {
    console.error("Error calculating mood statistics:", error)
    throw error
  }
}

// Helper function to calculate streak days
const calculateStreakDays = (entries: MoodEntry[]): number => {
  if (entries.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get unique dates with entries
  const entryDates = new Set<string>()
  entries.forEach((entry) => {
    const entryDate = convertTimestamp(entry.timestamp)
    entryDate.setHours(0, 0, 0, 0)
    entryDates.add(entryDate.toISOString().split("T")[0])
  })

  const sortedDates = Array.from(entryDates).sort().reverse()

  let streak = 0
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i])
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - streak)

    if (date.toISOString().split("T")[0] === expectedDate.toISOString().split("T")[0]) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Helper function to calculate 7-day trend
const calculateLast7DaysTrend = (entries: MoodEntry[]) => {
  const last7Days = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dateStr = date.toISOString().split("T")[0]

    // Find entries for this date
    const dayEntries = entries.filter((entry) => {
      const entryDate = convertTimestamp(entry.timestamp)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.toISOString().split("T")[0] === dateStr
    })

    // Calculate average mood for the day
    let avgMood = 0
    if (dayEntries.length > 0) {
      const totalMood = dayEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0)
      avgMood = totalMood / dayEntries.length
    }

    last7Days.push({
      date: dateStr,
      moodValue: Number(avgMood.toFixed(1)),
    })
  }

  return last7Days
}

// Chat Messages
export const saveChatMessage = async (userId: string, message: ChatMessage) => {
  try {
    console.log("Saving chat message:", { userId, sender: message.sender, text: message.text.substring(0, 50) })

    if (!userId || !message.text || !message.sender) {
      throw new Error("Invalid chat message data")
    }

    const chatMessage = {
      text: String(message.text),
      sender: String(message.sender),
      timestamp: serverTimestamp(),
      userId: String(userId),
      mood: message.mood ? String(message.mood) : undefined,
      moodEmoji: message.moodEmoji ? String(message.moodEmoji) : undefined,
      affirmation: message.affirmation ? String(message.affirmation) : undefined,
      activity: message.activity ? String(message.activity) : undefined,
    }

    const docRef = await addDoc(collection(db, "chatMessages"), chatMessage)
    console.log("Chat message saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...chatMessage }
  } catch (error) {
    console.error("Error saving chat message:", error)
    throw error
  }
}

export const getChatMessages = (userId: string, callback: (messages: ChatMessage[]) => void) => {
  try {
    console.log("Setting up chat messages listener for user:", userId)

    if (!userId) {
      console.error("No userId provided for chat messages listener")
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "chatMessages"),
      where("userId", "==", userId),
      orderBy("timestamp", "asc"),
      limit(50),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Chat messages snapshot received, size:", snapshot.size)

        const messages = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            text: String(data.text),
            sender: String(data.sender),
            timestamp: convertTimestamp(data.timestamp),
            userId: String(data.userId),
            mood: data.mood ? String(data.mood) : undefined,
            moodEmoji: data.moodEmoji ? String(data.moodEmoji) : undefined,
            affirmation: data.affirmation ? String(data.affirmation) : undefined,
            activity: data.activity ? String(data.activity) : undefined,
          }
        }) as ChatMessage[]

        console.log("Processed chat messages:", messages.length)
        callback(messages)
      },
      (error) => {
        console.error("Error in chat messages listener:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up chat messages listener:", error)
    callback([])
    return () => {}
  }
}

// Gratitude Entries
export const saveGratitudeEntry = async (userId: string, text: string) => {
  try {
    if (!userId || !text) {
      throw new Error("Invalid gratitude entry data")
    }

    const gratitudeEntry = {
      text: String(text),
      timestamp: serverTimestamp(),
      userId: String(userId),
    }

    const docRef = await addDoc(collection(db, "gratitudeEntries"), gratitudeEntry)
    return { id: docRef.id, ...gratitudeEntry }
  } catch (error) {
    console.error("Error saving gratitude entry:", error)
    throw error
  }
}

export const getGratitudeEntries = (userId: string, callback: (entries: GratitudeEntry[]) => void) => {
  try {
    if (!userId) {
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "gratitudeEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(10),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const entries = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            text: String(data.text),
            timestamp: convertTimestamp(data.timestamp),
            userId: String(data.userId),
          }
        }) as GratitudeEntry[]
        callback(entries)
      },
      (error) => {
        console.error("Error fetching gratitude entries:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up gratitude entries listener:", error)
    callback([])
    return () => {}
  }
}

// Community Messages
export const sendCommunityMessage = async (message: string, senderName: string) => {
  try {
    const communityMessage = {
      message: String(message),
      senderName: String(senderName),
      timestamp: serverTimestamp(),
      reactions: 0,
    }

    const docRef = await addDoc(collection(db, "communityMessages"), communityMessage)
    return { id: docRef.id, ...communityMessage }
  } catch (error) {
    console.error("Error sending community message:", error)
    throw error
  }
}

export const getCommunityMessages = (callback: (messages: CommunityMessage[]) => void) => {
  try {
    const q = query(collection(db, "communityMessages"), orderBy("timestamp", "desc"), limit(50))

    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            message: String(data.message),
            senderName: String(data.senderName),
            timestamp: convertTimestamp(data.timestamp),
            reactions: Number(data.reactions) || 0,
          }
        }) as CommunityMessage[]
        callback(messages.reverse())
      },
      (error) => {
        console.error("Error fetching community messages:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up community messages listener:", error)
    callback([])
    return () => {}
  }
}

// Update community message reactions
export const updateMessageReactions = async (messageId: string, reactions: number) => {
  try {
    const messageRef = doc(db, "communityMessages", messageId)
    await updateDoc(messageRef, { reactions: Number(reactions) })
  } catch (error) {
    console.error("Error updating message reactions:", error)
    throw error
  }
}

// Medical Query Functions
export const saveMedicalQuery = async (
  userId: string,
  queryData: Omit<MedicalQuery, "id" | "timestamp" | "userId">,
) => {
  try {
    if (!userId || !queryData.symptom) {
      throw new Error("Invalid medical query data")
    }

    const medicalQuery = {
      symptom: String(queryData.symptom),
      analysis: queryData.analysis,
      timestamp: serverTimestamp(),
      userId: String(userId),
    }

    const docRef = await addDoc(collection(db, "medicalQueries"), medicalQuery)
    return { id: docRef.id, ...medicalQuery }
  } catch (error) {
    console.error("Error saving medical query:", error)
    throw error
  }
}

export const getMedicalQueries = (userId: string, callback: (queries: MedicalQuery[]) => void) => {
  try {
    if (!userId) {
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "medicalQueries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const queries = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            symptom: String(data.symptom),
            analysis: data.analysis,
            timestamp: convertTimestamp(data.timestamp),
            userId: String(data.userId),
          }
        }) as MedicalQuery[]
        callback(queries)
      },
      (error) => {
        console.error("Error fetching medical queries:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up medical queries listener:", error)
    callback([])
    return () => {}
  }
}

// Medicine Order Functions
export const saveMedicineOrder = async (
  userId: string,
  orderData: Omit<MedicineOrder, "id" | "timestamp" | "userId">,
) => {
  try {
    if (!userId || !orderData.items || orderData.items.length === 0) {
      throw new Error("Invalid medicine order data")
    }

    const medicineOrder = {
      items: orderData.items,
      prescriptionUrl: orderData.prescriptionUrl ? String(orderData.prescriptionUrl) : undefined,
      totalAmount: Number(orderData.totalAmount),
      status: String(orderData.status),
      deliveryAddress: orderData.deliveryAddress ? String(orderData.deliveryAddress) : undefined,
      paymentMethod: orderData.paymentMethod ? String(orderData.paymentMethod) : undefined,
      trackingNumber: orderData.trackingNumber ? String(orderData.trackingNumber) : undefined,
      estimatedDelivery: orderData.estimatedDelivery || undefined,
      timestamp: serverTimestamp(),
      userId: String(userId),
    }

    const docRef = await addDoc(collection(db, "medicineOrders"), medicineOrder)
    return { id: docRef.id, ...medicineOrder }
  } catch (error) {
    console.error("Error saving medicine order:", error)
    throw error
  }
}

export const getMedicineOrders = (userId: string, callback: (orders: MedicineOrder[]) => void) => {
  try {
    if (!userId) {
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "medicineOrders"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            items: data.items,
            prescriptionUrl: data.prescriptionUrl,
            totalAmount: Number(data.totalAmount),
            status: String(data.status),
            deliveryAddress: data.deliveryAddress,
            paymentMethod: data.paymentMethod,
            trackingNumber: data.trackingNumber,
            estimatedDelivery: data.estimatedDelivery ? convertTimestamp(data.estimatedDelivery) : undefined,
            timestamp: convertTimestamp(data.timestamp),
            userId: String(data.userId),
          }
        }) as MedicineOrder[]
        callback(orders)
      },
      (error) => {
        console.error("Error fetching medicine orders:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up medicine orders listener:", error)
    callback([])
    return () => {}
  }
}

// Update medicine order status
export const updateMedicineOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
  try {
    const orderRef = doc(db, "medicineOrders", orderId)
    const updateData: any = { status: String(status) }
    if (trackingNumber) {
      updateData.trackingNumber = String(trackingNumber)
    }
    await updateDoc(orderRef, updateData)
  } catch (error) {
    console.error("Error updating medicine order status:", error)
    throw error
  }
}

// Delete medicine order
export const deleteMedicineOrder = async (orderId: string) => {
  try {
    const orderRef = doc(db, "medicineOrders", orderId)
    await deleteDoc(orderRef)
  } catch (error) {
    console.error("Error deleting medicine order:", error)
    throw error
  }
}
