import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserStats {
  userId: string
  hueCoins: number
  level: number
  xp: number
  lastUpdated: Date | null
}

// Helper to convert Firestore timestamp to JS Date
const convertTimestamp = (timestamp: any): Date | null => {
  if (!timestamp) return null
  if (timestamp.toDate) return timestamp.toDate()
  return new Date(timestamp)
}

// Initialize user stats document if not exists
export const initializeUserStats = async (userId: string): Promise<void> => {
  if (!userId) return
  const statsRef = doc(db, "userStats", userId)
  const statsSnap = await getDoc(statsRef)
  if (!statsSnap.exists()) {
    await setDoc(statsRef, {
      userId,
      hueCoins: 100, // Default starting coins
      level: 1,
      xp: 0,
      lastUpdated: serverTimestamp(),
    })
  }
}

// Get user stats
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  if (!userId) return null
  const statsRef = doc(db, "userStats", userId)
  const statsSnap = await getDoc(statsRef)
  if (statsSnap.exists()) {
    const data = statsSnap.data()
    return {
      userId: data.userId,
      hueCoins: data.hueCoins,
      level: data.level,
      xp: data.xp,
      lastUpdated: convertTimestamp(data.lastUpdated),
    }
  }
  return null
}

// Add coins and update stats
export const addHueCoins = async (userId: string, amount: number, xpGained: number = 0): Promise<void> => {
  if (!userId || amount <= 0) return
  const statsRef = doc(db, "userStats", userId)
  // Get current stats
  const statsSnap = await getDoc(statsRef)
  if (!statsSnap.exists()) {
    // If not exists, initialize first
    await initializeUserStats(userId)
  }
  // Update coins and xp
  await updateDoc(statsRef, {
    hueCoins: increment(amount),
    xp: increment(xpGained),
    lastUpdated: serverTimestamp(),
  })
  // After updating, recalculate level
  await updateUserLevel(userId)
}

// Update user level based on XP
export const updateUserLevel = async (userId: string): Promise<void> => {
  if (!userId) return
  const statsRef = doc(db, "userStats", userId)
  const statsSnap = await getDoc(statsRef)
  if (statsSnap.exists()) {
    const data = statsSnap.data()
    const xp = data.xp || 0
    const newLevel = Math.floor(xp / 1000) + 1
    await updateDoc(statsRef, {
      level: newLevel,
      lastUpdated: serverTimestamp(),
    })
  }
}

// --- HUECOINS COLLECTION LOGIC ---

// Structure: { userId, balance, totalEarned, totalSpent, level, experience, lastUpdated }

export interface HueCoinsBalance {
  userId: string
  balance: number
  totalEarned: number
  totalSpent: number
  level: number
  experience: number
  lastUpdated: Date | null
}

// Initialize huecoins document if not exists
export const initializeHueCoinsBalance = async (userId: string): Promise<void> => {
  if (!userId) return
  const huecoinsRef = doc(db, "huecoins", userId)
  const huecoinsSnap = await getDoc(huecoinsRef)
  if (!huecoinsSnap.exists()) {
    await setDoc(huecoinsRef, {
      userId,
      balance: 100, // Default starting coins
      totalEarned: 100,
      totalSpent: 0,
      level: 1,
      experience: 0,
      lastUpdated: serverTimestamp(),
    })
  }
}

// Get huecoins balance
export const getHueCoinsBalance = async (userId: string): Promise<HueCoinsBalance | null> => {
  if (!userId) return null
  const huecoinsRef = doc(db, "huecoins", userId)
  const huecoinsSnap = await getDoc(huecoinsRef)
  if (huecoinsSnap.exists()) {
    const data = huecoinsSnap.data()
    return {
      userId: data.userId,
      balance: data.balance,
      totalEarned: data.totalEarned,
      totalSpent: data.totalSpent,
      level: data.level,
      experience: data.experience,
      lastUpdated: convertTimestamp(data.lastUpdated),
    }
  }
  return null
}

// Add or subtract coins for user activity
export const addCoins = async (
  userId: string,
  amount: number,
  activity: string,
  type: string,
  sessionId?: string
): Promise<void> => {
  if (!userId || amount === 0) return
  const huecoinsRef = doc(db, "huecoins", userId)
  const huecoinsSnap = await getDoc(huecoinsRef)
  if (!huecoinsSnap.exists()) {
    await initializeHueCoinsBalance(userId)
  }
  // Update balance, totalEarned, totalSpent, and experience (XP)
  const update: any = {
    balance: increment(amount),
    lastUpdated: serverTimestamp(),
    experience: increment(Math.max(amount, 0)), // Only add positive coin rewards to XP
  }
  if (amount > 0) update.totalEarned = increment(amount)
  if (amount < 0) update.totalSpent = increment(Math.abs(amount))
  await updateDoc(huecoinsRef, update)
  // Optionally: log earning/spending in a separate collection (not implemented here)
} 