import { 
  initializeHueCoinsBalance, 
  initializeUserBadges, 
  initializeRewardStore, 
  generateDailyChallenges,
  addCoins 
} from "./hue-coins-service"

// Function to manually initialize Hue Coins for a user
export const manuallyInitializeHueCoins = async (userId: string) => {
  try {
    console.log("🚀 Manually initializing Hue Coins for user:", userId)
    
    // Initialize balance
    await initializeHueCoinsBalance(userId)
    console.log("✅ Balance initialized")
    
    // Initialize badges
    await initializeUserBadges(userId)
    console.log("✅ Badges initialized")
    
    // Initialize reward store
    await initializeRewardStore()
    console.log("✅ Reward store initialized")
    
    // Generate daily challenges
    await generateDailyChallenges(userId)
    console.log("✅ Daily challenges initialized")
    
    // Add some test coins for demonstration
    await addCoins(userId, 100, "Welcome bonus", "achievement")
    await addCoins(userId, 25, "Completed meditation session", "meditation")
    await addCoins(userId, 30, "Joined therapy session", "therapy")
    await addCoins(userId, 15, "Helped community member", "community")
    
    console.log("✅ Test coins added")
    console.log("🎉 Hue Coins initialization complete!")
    
    return true
  } catch (error) {
    console.error("❌ Error initializing Hue Coins:", error)
    return false
  }
}

// Function to check if collections exist
export const checkHueCoinsCollections = async (userId: string) => {
  try {
    const { getDoc, doc } = await import("firebase/firestore")
    const { db } = await import("./firebase")
    
    const balanceRef = doc(db, "hueCoinsBalances", userId)
    const balanceSnap = await getDoc(balanceRef)
    
    console.log("📊 Collection Status:")
    console.log("- hueCoinsBalances:", balanceSnap.exists() ? "✅ Exists" : "❌ Missing")
    
    return balanceSnap.exists()
  } catch (error) {
    console.error("❌ Error checking collections:", error)
    return false
  }
}
