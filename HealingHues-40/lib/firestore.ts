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
import { db } from "./firebase"

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

// Medicine Recommendation Types
export interface MedicineRecommendation {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
  popularity: number;
}

// Wellness Session Types
export interface WellnessSession {
  id?: string
  userId: string
  activityType: string
  duration: number
  completedAt: Timestamp | Date
  coinsEarned: number
  experienceGained: number
  notes?: string
}

// Wellness Progress Types
export interface WellnessProgress {
  userId: string
  level: number
  totalExperience: number
  hueCoins: number
  completedVideos: string[]
  completedActivities: string[]
  unlockedLocations: string[]
  currentLocation: string
  badges: string[]
  sessionHistory: string[]
  lastUpdated: Timestamp | Date
}

// Video Completion Types
export interface VideoCompletion {
  id?: string
  userId: string
  videoId: string
  videoTitle: string
  completedAt: Timestamp | Date
  coinsEarned: number
  duration: number
}

// Activity Completion Types
export interface ActivityCompletion {
  id?: string
  userId: string
  activityId: string
  activityTitle: string
  completedAt: Timestamp | Date
  coinsEarned: number
  experienceGained: number
  duration: number
}

// Live Session Types
export interface LiveSession {
  id?: string
  userId: string
  hostName: string
  title: string
  description: string
  activityType: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  isLive: boolean
  startedAt: Timestamp | Date
  createdAt: Timestamp | Date
  status: "scheduled" | "live" | "ended"
  rating?: number
  hostAvatar?: string
}

// Wellness Activity Types
export interface WellnessActivity {
  id?: string
  title: string
  description: string
  activityType: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  reward: number
  activeSessions: number
  totalParticipants: number
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  tags: string[]
  isActive: boolean
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  createdBy: string
  featured: boolean
  category: string
  instructions?: string
  benefits?: string[]
  requirements?: string[]
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
    
    // Return a properly constructed UserProfile object
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: userData.createdAt || serverTimestamp() as Timestamp,
      lastLoginAt: userData.lastLoginAt || serverTimestamp() as Timestamp,
    } as UserProfile
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
        uid: String(data.uid || userId),
        displayName: data.displayName || null,
        email: data.email || null,
        photoURL: data.photoURL || null,
        createdAt: data.createdAt || serverTimestamp() as Timestamp,
        lastLoginAt: data.lastLoginAt || serverTimestamp() as Timestamp,
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

    // Build initial object with all possible fields
    const chatMessage: Record<string, any> = {
      text: String(message.text),
      sender: String(message.sender),
      timestamp: serverTimestamp(),
      userId: String(userId),
      mood: message.mood ? String(message.mood) : undefined,
      moodEmoji: message.moodEmoji ? String(message.moodEmoji) : undefined,
      affirmation: message.affirmation ? String(message.affirmation) : undefined,
      activity: message.activity ? String(message.activity) : undefined,
    }

    // Remove keys with undefined values
    Object.keys(chatMessage).forEach(key => {
      if (chatMessage[key] === undefined) {
        delete chatMessage[key]
      }
    })

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
    if (!userId) throw new Error("No userId provided for saveMedicineOrder")
    // Remove undefined fields
    const cleanOrderData: Record<string, any> = { ...orderData, userId, timestamp: serverTimestamp() }
    Object.keys(cleanOrderData).forEach(key => {
      if (cleanOrderData[key] === undefined) {
        delete cleanOrderData[key]
      }
    })
    const docRef = await addDoc(collection(db, "medicineOrders"), cleanOrderData)
    return { id: docRef.id, ...cleanOrderData }
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

// Medicine Recommendation Functions
export const getMedicineRecommendations = async (searchTerm: string = ""): Promise<MedicineRecommendation[]> => {
  try {
    const q = searchTerm 
      ? query(collection(db, 'medicines'), orderBy('popularity', 'desc'))
      : query(collection(db, 'medicines'), orderBy('popularity', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const medicines: MedicineRecommendation[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        medicines.push({
          id: doc.id,
          ...data,
        } as MedicineRecommendation);
      }
    });
    
    return medicines.slice(0, 10); // Return top 10 recommendations
  } catch (error) {
    console.error('Error getting medicine recommendations:', error);
    return [];
  }
};

// Wellness Session Functions
export const saveWellnessSession = async (sessionData: Omit<WellnessSession, "id" | "completedAt">) => {
  try {
    console.log("Saving wellness session:", sessionData)

    // Check if user is authenticated
    if (!sessionData.userId) {
      throw new Error("User ID is required to save wellness session")
    }

    const session = {
      ...sessionData,
      completedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "wellnessSessions"), session)
    console.log("Wellness session saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...session }
  } catch (error) {
    console.error("Error saving wellness session:", error)
    throw error
  }
}

export const getWellnessSessions = (userId: string, callback: (sessions: WellnessSession[]) => void) => {
  try {
    console.log("Setting up wellness sessions listener for user:", userId)

    if (!userId) {
      console.error("No userId provided for wellness sessions listener")
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "wellnessSessions"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(50)
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Wellness sessions snapshot received, size:", snapshot.size)

        const sessions = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: String(data.userId),
            activityType: String(data.activityType),
            duration: Number(data.duration),
            completedAt: convertTimestamp(data.completedAt),
            coinsEarned: Number(data.coinsEarned),
            experienceGained: Number(data.experienceGained),
            notes: String(data.notes || ""),
          }
        }) as WellnessSession[]

        console.log("Processed wellness sessions:", sessions.length)
        callback(sessions)
      },
      (error) => {
        console.error("Error listening to wellness sessions:", error)
        // Don't throw error, just return empty array
        callback([])
      }
    )
  } catch (error) {
    console.error("Error setting up wellness sessions listener:", error)
    callback([])
    return () => {}
  }
}

// Wellness Progress Functions
export const saveWellnessProgress = async (progressData: Omit<WellnessProgress, "lastUpdated">) => {
  try {
    console.log("Saving wellness progress:", progressData)

    // Check if user is authenticated
    if (!progressData.userId) {
      throw new Error("User ID is required to save wellness progress")
    }

    const progress = {
      ...progressData,
      lastUpdated: serverTimestamp(),
    }

    const userRef = doc(db, "users", progressData.userId)
    await updateDoc(userRef, progress)
    console.log("Wellness progress saved successfully")

    return progress
  } catch (error) {
    console.error("Error saving wellness progress:", error)
    throw error
  }
}

export const getWellnessProgress = async (userId: string): Promise<WellnessProgress | null> => {
  try {
    if (!userId) {
      console.error("No userId provided for wellness progress")
      return null
    }

    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        userId: String(data.userId || userId),
        level: Number(data.level || 1),
        totalExperience: Number(data.totalExperience || 0),
        hueCoins: Number(data.hueCoins || 1000),
        completedVideos: Array.isArray(data.completedVideos) ? data.completedVideos : [],
        completedActivities: Array.isArray(data.completedActivities) ? data.completedActivities : [],
        unlockedLocations: Array.isArray(data.unlockedLocations) ? data.unlockedLocations : ["peaceful-pond"],
        currentLocation: String(data.currentLocation || "peaceful-pond"),
        badges: Array.isArray(data.badges) ? data.badges : [],
        sessionHistory: Array.isArray(data.sessionHistory) ? data.sessionHistory : [],
        lastUpdated: convertTimestamp(data.lastUpdated),
      }
    }
    return null
  } catch (error) {
    console.error("Error getting wellness progress:", error)
    return null
  }
}

// Video Completion Functions
export const saveVideoCompletion = async (completionData: Omit<VideoCompletion, "id" | "completedAt">) => {
  try {
    console.log("Saving video completion:", completionData)

    // Check if user is authenticated
    if (!completionData.userId) {
      throw new Error("User ID is required to save video completion")
    }

    const completion = {
      ...completionData,
      completedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "videoCompletions"), completion)
    console.log("Video completion saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...completion }
  } catch (error) {
    console.error("Error saving video completion:", error)
    throw error
  }
}

export const getVideoCompletions = (userId: string, callback: (completions: VideoCompletion[]) => void) => {
  try {
    console.log("Setting up video completions listener for user:", userId)

    if (!userId) {
      console.error("No userId provided for video completions listener")
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "videoCompletions"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(100)
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Video completions snapshot received, size:", snapshot.size)

        const completions = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: String(data.userId),
            videoId: String(data.videoId),
            videoTitle: String(data.videoTitle),
            completedAt: convertTimestamp(data.completedAt),
            coinsEarned: Number(data.coinsEarned),
            duration: Number(data.duration),
          }
        }) as VideoCompletion[]

        console.log("Processed video completions:", completions.length)
        callback(completions)
      },
      (error) => {
        console.error("Error listening to video completions:", error)
        // Don't throw error, just return empty array
        callback([])
      }
    )
  } catch (error) {
    console.error("Error setting up video completions listener:", error)
    callback([])
    return () => {}
  }
}

// Activity Completion Functions
export const saveActivityCompletion = async (completionData: Omit<ActivityCompletion, "id" | "completedAt">) => {
  try {
    console.log("Saving activity completion:", completionData)

    // Check if user is authenticated
    if (!completionData.userId) {
      throw new Error("User ID is required to save activity completion")
    }

    const completion = {
      ...completionData,
      completedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "activityCompletions"), completion)
    console.log("Activity completion saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...completion }
  } catch (error) {
    console.error("Error saving activity completion:", error)
    throw error
  }
}

export const getActivityCompletions = (userId: string, callback: (completions: ActivityCompletion[]) => void) => {
  try {
    console.log("Setting up activity completions listener for user:", userId)

    if (!userId) {
      console.error("No userId provided for activity completions listener")
      callback([])
      return () => {}
    }

    const q = query(
      collection(db, "activityCompletions"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(100)
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Activity completions snapshot received, size:", snapshot.size)

        const completions = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: String(data.userId),
            activityId: String(data.activityId),
            activityTitle: String(data.activityTitle),
            completedAt: convertTimestamp(data.completedAt),
            coinsEarned: Number(data.coinsEarned),
            experienceGained: Number(data.experienceGained),
            duration: Number(data.duration),
          }
        }) as ActivityCompletion[]

        console.log("Processed activity completions:", completions.length)
        callback(completions)
      },
      (error) => {
        console.error("Error listening to activity completions:", error)
        callback([])
      }
    )
  } catch (error) {
    console.error("Error setting up activity completions listener:", error)
    callback([])
    return () => {}
  }
}

// Live Session Functions
export const saveLiveSession = async (sessionData: Omit<LiveSession, "id" | "createdAt" | "startedAt" | "currentParticipants" | "isLive" | "status">) => {
  try {
    console.log("Saving live session:", sessionData)

    // Check if user is authenticated
    if (!sessionData.userId) {
      throw new Error("User ID is required to save live session")
    }

    const session = {
      ...sessionData,
      currentParticipants: 1, // Host is the first participant
      isLive: true,
      status: "live" as const,
      createdAt: serverTimestamp(),
      startedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "liveSessions"), session)
    console.log("Live session saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...session }
  } catch (error: any) {
    console.error("Error saving live session:", error)
    
    // Provide specific error messages for common issues
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please make sure Firebase security rules allow access to liveSessions collection.")
    } else if (error.code === 'unauthenticated') {
      throw new Error("You must be logged in to create a live session.")
    } else if (error.message) {
      throw new Error(`Failed to create live session: ${error.message}`)
    } else {
      throw new Error("Failed to create live session. Please try again.")
    }
  }
}

export const getLiveSessions = (callback: (sessions: LiveSession[]) => void) => {
  try {
    console.log("Setting up live sessions listener")

    const q = query(
      collection(db, "liveSessions"),
      where("status", "==", "live"),
      orderBy("startedAt", "desc"),
      limit(50)
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Live sessions snapshot received, size:", snapshot.size)

        const sessions = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            userId: String(data.userId),
            hostName: String(data.hostName),
            title: String(data.title),
            description: String(data.description),
            activityType: String(data.activityType),
            duration: Number(data.duration),
            maxParticipants: Number(data.maxParticipants),
            currentParticipants: Number(data.currentParticipants),
            difficulty: String(data.difficulty) as "beginner" | "intermediate" | "advanced",
            tags: Array.isArray(data.tags) ? data.tags : [],
            isLive: Boolean(data.isLive),
            startedAt: convertTimestamp(data.startedAt),
            createdAt: convertTimestamp(data.createdAt),
            status: String(data.status) as "scheduled" | "live" | "ended",
            rating: data.rating ? Number(data.rating) : undefined,
            hostAvatar: data.hostAvatar ? String(data.hostAvatar) : undefined,
          }
        }) as LiveSession[]

        console.log("Processed live sessions:", sessions.length)
        callback(sessions)
      },
      (error) => {
        console.error("Error listening to live sessions:", error)
        
        // Provide specific error messages
        if (error.code === 'permission-denied') {
          console.error("Permission denied for liveSessions collection. Please update Firebase security rules.")
        } else if (error.code === 'unauthenticated') {
          console.error("User not authenticated for live sessions.")
        }
        
        // Return empty array instead of throwing
        callback([])
      }
    )
  } catch (error: any) {
    console.error("Error setting up live sessions listener:", error)
    
    if (error.code === 'permission-denied') {
      console.error("Permission denied for liveSessions collection. Please update Firebase security rules.")
    }
    
    callback([])
    return () => {}
  }
}

export const updateLiveSessionParticipants = async (sessionId: string, participantCount: number) => {
  try {
    const sessionRef = doc(db, "liveSessions", sessionId)
    await updateDoc(sessionRef, {
      currentParticipants: participantCount,
    })
    console.log("Live session participants updated successfully")
  } catch (error) {
    console.error("Error updating live session participants:", error)
    throw error
  }
}

export const endLiveSession = async (sessionId: string) => {
  try {
    const sessionRef = doc(db, "liveSessions", sessionId)
    await updateDoc(sessionRef, {
      status: "ended",
      isLive: false,
    })
    console.log("Live session ended successfully")
  } catch (error) {
    console.error("Error ending live session:", error)
    throw error
  }
}

// Wellness Activity Functions
export const saveWellnessActivity = async (activityData: Omit<WellnessActivity, "id" | "createdAt" | "updatedAt">) => {
  try {
    console.log("Saving wellness activity:", activityData)

    // Check if user is authenticated
    if (!activityData.createdBy) {
      throw new Error("User ID is required to save wellness activity")
    }

    const activity = {
      ...activityData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "wellnessActivities"), activity)
    console.log("Wellness activity saved successfully with ID:", docRef.id)

    return { id: docRef.id, ...activity }
  } catch (error: any) {
    console.error("Error saving wellness activity:", error)
    
    // Provide specific error messages for common issues
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please make sure Firebase security rules allow access to wellnessActivities collection.")
    } else if (error.code === 'unauthenticated') {
      throw new Error("You must be logged in to create a wellness activity.")
    } else if (error.message) {
      throw new Error(`Failed to create wellness activity: ${error.message}`)
    } else {
      throw new Error("Failed to create wellness activity. Please try again.")
    }
  }
}

export const getWellnessActivities = (callback: (activities: WellnessActivity[]) => void) => {
  try {
    console.log("Setting up wellness activities listener")

    const q = query(
      collection(db, "wellnessActivities"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(50)
    )

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("Wellness activities snapshot received, size:", snapshot.size)

        const activities = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: String(data.title),
            description: String(data.description),
            activityType: String(data.activityType),
            icon: String(data.icon),
            color: String(data.color),
            bgColor: String(data.bgColor),
            borderColor: String(data.borderColor),
            reward: Number(data.reward),
            activeSessions: Number(data.activeSessions),
            totalParticipants: Number(data.totalParticipants),
            difficulty: String(data.difficulty) as "beginner" | "intermediate" | "advanced",
            duration: Number(data.duration),
            tags: Array.isArray(data.tags) ? data.tags : [],
            isActive: Boolean(data.isActive),
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
            createdBy: String(data.createdBy),
            featured: Boolean(data.featured),
            category: String(data.category),
            instructions: data.instructions ? String(data.instructions) : undefined,
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            requirements: Array.isArray(data.requirements) ? data.requirements : [],
          }
        }) as WellnessActivity[]

        console.log("Processed wellness activities:", activities.length)
        callback(activities)
      },
      (error) => {
        console.error("Error listening to wellness activities:", error)
        
        // Provide specific error messages
        if (error.code === 'permission-denied') {
          console.error("Permission denied for wellnessActivities collection. Please update Firebase security rules.")
        } else if (error.code === 'unauthenticated') {
          console.error("User not authenticated for wellness activities.")
        }
        
        // Return empty array instead of throwing
        callback([])
      }
    )
  } catch (error: any) {
    console.error("Error setting up wellness activities listener:", error)
    
    if (error.code === 'permission-denied') {
      console.error("Permission denied for wellnessActivities collection. Please update Firebase security rules.")
    }
    
    callback([])
    return () => {}
  }
}

export const updateWellnessActivity = async (activityId: string, updates: Partial<WellnessActivity>) => {
  try {
    const activityRef = doc(db, "wellnessActivities", activityId)
    await updateDoc(activityRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    console.log("Wellness activity updated successfully")
  } catch (error) {
    console.error("Error updating wellness activity:", error)
    throw error
  }
}

export const deleteWellnessActivity = async (activityId: string) => {
  try {
    const activityRef = doc(db, "wellnessActivities", activityId)
    await deleteDoc(activityRef)
    console.log("Wellness activity deleted successfully")
  } catch (error) {
    console.error("Error deleting wellness activity:", error)
    throw error
  }
}
