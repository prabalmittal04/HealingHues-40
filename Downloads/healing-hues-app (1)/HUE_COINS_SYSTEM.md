# Hue Coins Dynamic System

## Overview

The Hue Coins system has been completely redesigned to be fully dynamic and integrated with Firebase. All data is now stored and retrieved in real-time from Firebase, providing a truly interactive and engaging experience for users.

## Features

### 🪙 Real-time Coin Balance
- Dynamic balance updates across all activities
- Level progression based on total experience
- Experience points tracking (0-1000 per level)

### 🏆 Achievement Badges
- 8 different badges with varying rarities
- Progress tracking for each badge
- Automatic coin rewards when badges are unlocked
- Real-time progress updates

### 🎯 Daily Challenges
- 5 daily challenges that reset each day
- Progress tracking with real-time updates
- Automatic coin rewards upon completion
- Time-based expiration system

### 🛍️ Cosmic Reward Store
- 8 premium items available for purchase
- Real-time inventory management
- Purchase history tracking
- Secure transaction system

## Firebase Collections

### `hueCoinsBalances`
Stores user's coin balance and level information:
```typescript
{
  userId: string
  balance: number
  totalEarned: number
  totalSpent: number
  level: number
  experience: number
  lastUpdated: Timestamp
}
```

### `coinEarnings`
Tracks all coin earning activities:
```typescript
{
  userId: string
  activity: string
  amount: number
  type: "meditation" | "therapy" | "streak" | "challenge" | "community" | "breathing" | "nutrition" | "music" | "wellness" | "achievement"
  timestamp: Timestamp
  sessionId?: string
}
```

### `userBadges`
Manages user badge progress:
```typescript
{
  userId: string
  badgeId: string
  name: string
  icon: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  requirement: number
  unlocked: boolean
  unlockedAt?: Timestamp
  progress: number
  maxProgress: number
}
```

### `dailyChallenges`
Daily challenge system:
```typescript
{
  userId: string
  task: string
  description: string
  progress: number
  total: number
  reward: number
  difficulty: "easy" | "medium" | "hard"
  category: "meditation" | "mood" | "therapy" | "community" | "wellness" | "breathing"
  expiresAt: Timestamp
  completed: boolean
  completedAt?: Timestamp
}
```

### `rewardStoreItems`
Store inventory:
```typescript
{
  name: string
  description: string
  cost: number
  icon: string
  category: "theme" | "avatar" | "feature" | "collectible" | "service" | "content" | "education" | "badge"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  available: boolean
  benefits?: string[]
}
```

### `userPurchases`
Purchase history:
```typescript
{
  userId: string
  itemId: string
  itemName: string
  cost: number
  purchasedAt: Timestamp
  itemCategory: string
}
```

## Integration Guide

### 1. Using the Hue Coins Hook

Import and use the `useHueCoins` hook in your components:

```typescript
import { useHueCoins } from "@/hooks/use-hue-coins"

function MyComponent() {
  const { 
    awardMeditationCoins, 
    awardTherapyCoins, 
    awardMoodCoins,
    updateActivityProgress 
  } = useHueCoins()

  const handleMeditationComplete = async (duration: number) => {
    await awardMeditationCoins(duration)
    await updateActivityProgress("meditation_master", 1) // Increment badge progress
  }

  const handleMoodCheckin = async (isStreak: boolean) => {
    await awardMoodCoins(isStreak)
    await updateActivityProgress("mood_tracker_pro", 1)
  }
}
```

### 2. Available Award Functions

#### Meditation
```typescript
await awardMeditationCoins(duration: number, sessionId?: string)
// Awards: 15 coins (short), 25 coins (medium), 40 coins (long)
```

#### Therapy
```typescript
await awardTherapyCoins(sessionType: "individual" | "group" | "support", sessionId?: string)
// Awards: 30 coins (individual), 20 coins (group), 15 coins (support)
```

#### Mood Tracking
```typescript
await awardMoodCoins(isStreak: boolean = false)
// Awards: 5 coins (checkin), 25 coins (streak)
```

#### Breathing Exercises
```typescript
await awardBreathingCoins(duration: number, sessionId?: string)
// Awards: 10 coins (exercise), 20 coins (session), 30 coins (mastery)
```

#### Community Activities
```typescript
await awardCommunityCoins(action: "post" | "reply" | "help")
// Awards: 10 coins (post), 5 coins (reply), 15 coins (help)
```

#### Wellness Activities
```typescript
await awardWellnessCoins(activityType: "video" | "activity" | "challenge", sessionId?: string)
// Awards: 20 coins (video), 25 coins (activity), 50 coins (challenge)
```

#### Nutrition
```typescript
await awardNutritionCoins(action: "log" | "goal" | "streak")
// Awards: 10 coins (log), 35 coins (goal), 40 coins (streak)
```

#### Music Therapy
```typescript
await awardMusicCoins(sessionType: "relaxation" | "regular", sessionId?: string)
// Awards: 25 coins (relaxation), 18 coins (regular)
```

### 3. Badge Progress Updates

Update badge progress when users complete activities:

```typescript
// Meditation badge
await updateActivityProgress("meditation_master", 1)

// Mood tracking badge
await updateActivityProgress("mood_tracker_pro", 1)

// Community badge
await updateActivityProgress("community_guardian", 1)

// Breathing badge
await updateActivityProgress("breathing_expert", 1)

// Streak badge
await updateActivityProgress("streak_master", 1)
```

## Badge System

### Available Badges

1. **Meditation Master** (Common)
   - Complete 50 meditation sessions
   - Reward: 50 coins

2. **Mood Tracker Pro** (Uncommon)
   - Log mood for 30 consecutive days
   - Reward: 100 coins

3. **Community Guardian** (Rare)
   - Help 100 community members
   - Reward: 250 coins

4. **Wellness Sage** (Epic)
   - Achieve master level in all activities
   - Reward: 500 coins

5. **Cosmic Healer** (Legendary)
   - Transcend to ultimate wellness
   - Reward: 1000 coins

6. **Therapy Champion** (Common)
   - Complete 25 therapy sessions
   - Reward: 50 coins

7. **Breathing Expert** (Uncommon)
   - Complete 100 breathing exercises
   - Reward: 100 coins

8. **Streak Master** (Common)
   - Maintain a 7-day activity streak
   - Reward: 50 coins

## Daily Challenges

### Challenge Types

1. **Morning Meditation** (Easy)
   - Complete morning meditation
   - Reward: 25 coins

2. **Mood Tracking** (Medium)
   - Log mood 3 times today
   - Reward: 20 coins

3. **Live Therapy** (Hard)
   - Join a live therapy session
   - Reward: 40 coins

4. **Community Engagement** (Easy)
   - Share positive affirmation
   - Reward: 15 coins

5. **Breathing Exercise** (Medium)
   - Complete breathing exercise
   - Reward: 30 coins

## Reward Store Items

### Available Items

1. **Cosmic Aurora Theme** (150 coins)
   - Beautiful space-themed interface
   - Category: Theme

2. **Premium Meditation Avatar** (300 coins)
   - Exclusive animated meditation avatar
   - Category: Avatar

3. **Advanced Mood Analytics** (500 coins)
   - Detailed mood patterns and insights
   - Category: Feature

4. **Healing Crystal Collection** (750 coins)
   - Virtual crystal collection for meditation
   - Category: Collectible

5. **Personal Wellness Coach** (1200 coins)
   - 1-on-1 coaching session with expert
   - Category: Service

6. **Exclusive Soundscape Library** (400 coins)
   - Premium healing frequencies collection
   - Category: Content

7. **Mindfulness Masterclass** (800 coins)
   - Advanced mindfulness techniques course
   - Category: Education

8. **Golden Lotus Badge** (2000 coins)
   - Ultra-rare achievement badge
   - Category: Badge

## Security Rules

The system includes comprehensive Firebase security rules that ensure:

- Users can only access their own data
- Coin balances are protected from unauthorized access
- Purchase transactions are secure
- Badge progress is user-specific
- Store items are read-only for users

## Setup Instructions

### 1. Initialize Firebase Collections

The system automatically initializes user data when they first access the vault:

```typescript
// This happens automatically in HueCoinsWallet component
await initializeHueCoinsBalance(user.uid)
await initializeUserBadges(user.uid)
await initializeRewardStore()
await generateDailyChallenges(user.uid)
```

### 2. Deploy Security Rules

Update your Firebase security rules to include the new collections:

```bash
firebase deploy --only firestore:rules
```

### 3. Integration Examples

#### Meditation Component
```typescript
const { awardMeditationCoins, updateActivityProgress } = useHueCoins()

const handleMeditationComplete = async (duration: number) => {
  await awardMeditationCoins(duration)
  await updateActivityProgress("meditation_master", 1)
}
```

#### Mood Tracking Component
```typescript
const { awardMoodCoins, updateActivityProgress } = useHueCoins()

const handleMoodSubmit = async (isStreak: boolean) => {
  await awardMoodCoins(isStreak)
  await updateActivityProgress("mood_tracker_pro", 1)
}
```

#### Community Component
```typescript
const { awardCommunityCoins, updateActivityProgress } = useHueCoins()

const handleCommunityPost = async () => {
  await awardCommunityCoins("post")
  await updateActivityProgress("community_guardian", 1)
}
```

## Real-time Updates

All data updates in real-time using Firebase's `onSnapshot` listeners:

- Coin balance updates immediately
- Badge progress shows live updates
- Challenge progress updates in real-time
- Store purchases reflect immediately
- Recent earnings show instantly

## Performance Considerations

- Data is cached locally for better performance
- Real-time listeners are properly cleaned up
- Batch operations for multiple updates
- Optimized queries with proper indexing

## Error Handling

The system includes comprehensive error handling:

- Network connectivity issues
- Firebase permission errors
- Invalid data validation
- Graceful fallbacks for missing data

## Future Enhancements

- Seasonal challenges and events
- Limited-time store items
- Social features (gift coins to friends)
- Advanced analytics and insights
- Custom badge creation
- Achievement sharing 