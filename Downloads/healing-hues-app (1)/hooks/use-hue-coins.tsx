"use client"

import { useCallback } from "react"
import { useAuth } from "./use-auth"
import { addCoins, updateBadgeProgress } from "@/lib/hue-coins-service"

export const useHueCoins = () => {
  const { user } = useAuth()

  // Award coins for completing activities
  const awardCoins = useCallback(async (
    amount: number,
    activity: string,
    type: "meditation" | "therapy" | "streak" | "challenge" | "community" | "breathing" | "nutrition" | "music" | "wellness" | "achievement",
    sessionId?: string
  ) => {
    if (!user?.uid) return

    try {
      await addCoins(user.uid, amount, activity, type, sessionId)
    } catch (error) {
      console.error("Error awarding coins:", error)
    }
  }, [user?.uid])

  // Update badge progress for various activities
  const updateActivityProgress = useCallback(async (
    badgeId: string,
    progress: number
  ) => {
    if (!user?.uid) return

    try {
      await updateBadgeProgress(user.uid, badgeId, progress)
    } catch (error) {
      console.error("Error updating badge progress:", error)
    }
  }, [user?.uid])

  // Predefined coin rewards for common activities
  const coinRewards = {
    meditation: {
      short: 15, // 5-10 minutes
      medium: 25, // 10-20 minutes
      long: 40, // 20+ minutes
      streak: 50, // Daily streak bonus
    },
    therapy: {
      session: 30,
      group: 20,
      support: 15,
    },
    mood: {
      checkin: 5,
      streak: 25,
      weekly: 100,
    },
    breathing: {
      exercise: 10,
      session: 20,
      mastery: 30,
    },
    community: {
      post: 10,
      reply: 5,
      help: 15,
    },
    wellness: {
      video: 20,
      activity: 25,
      challenge: 50,
    },
    nutrition: {
      log: 10,
      goal: 35,
      streak: 40,
    },
    music: {
      session: 18,
      relaxation: 25,
    },
  }

  // Helper functions for common activities
  const awardMeditationCoins = useCallback(async (duration: number, sessionId?: string) => {
    let amount = coinRewards.meditation.medium
    if (duration < 10) amount = coinRewards.meditation.short
    else if (duration > 20) amount = coinRewards.meditation.long

    await awardCoins(amount, `Completed ${duration}min meditation session`, "meditation", sessionId)
  }, [awardCoins])

  const awardTherapyCoins = useCallback(async (sessionType: "individual" | "group" | "support", sessionId?: string) => {
    let amount = coinRewards.therapy.session
    if (sessionType === "group") amount = coinRewards.therapy.group
    else if (sessionType === "support") amount = coinRewards.therapy.support

    await awardCoins(amount, `Completed ${sessionType} therapy session`, "therapy", sessionId)
  }, [awardCoins])

  const awardMoodCoins = useCallback(async (isStreak: boolean = false) => {
    const amount = isStreak ? coinRewards.mood.streak : coinRewards.mood.checkin
    const activity = isStreak ? "Daily mood check-in streak" : "Mood check-in"
    
    await awardCoins(amount, activity, "streak")
  }, [awardCoins])

  const awardBreathingCoins = useCallback(async (duration: number, sessionId?: string) => {
    let amount = coinRewards.breathing.exercise
    if (duration > 10) amount = coinRewards.breathing.session
    if (duration > 20) amount = coinRewards.breathing.mastery

    await awardCoins(amount, `Completed ${duration}min breathing exercise`, "breathing", sessionId)
  }, [awardCoins])

  const awardCommunityCoins = useCallback(async (action: "post" | "reply" | "help") => {
    const amount = coinRewards.community[action]
    const activity = action === "post" ? "Shared community post" : 
                    action === "reply" ? "Replied to community" : 
                    "Helped community member"
    
    await awardCoins(amount, activity, "community")
  }, [awardCoins])

  const awardWellnessCoins = useCallback(async (activityType: "video" | "activity" | "challenge", sessionId?: string) => {
    const amount = coinRewards.wellness[activityType]
    const activity = activityType === "video" ? "Completed wellness video" :
                    activityType === "activity" ? "Completed wellness activity" :
                    "Completed wellness challenge"
    
    await awardCoins(amount, activity, "wellness", sessionId)
  }, [awardCoins])

  const awardNutritionCoins = useCallback(async (action: "log" | "goal" | "streak") => {
    const amount = coinRewards.nutrition[action]
    const activity = action === "log" ? "Logged nutrition" :
                    action === "goal" ? "Achieved nutrition goal" :
                    "Nutrition goal streak"
    
    await awardCoins(amount, activity, "nutrition")
  }, [awardCoins])

  const awardMusicCoins = useCallback(async (sessionType: "relaxation" | "regular", sessionId?: string) => {
    const amount = sessionType === "relaxation" ? coinRewards.music.relaxation : coinRewards.music.session
    const activity = sessionType === "relaxation" ? "Mindfulness music session" : "Music therapy session"
    
    await awardCoins(amount, activity, "music", sessionId)
  }, [awardCoins])

  return {
    awardCoins,
    updateActivityProgress,
    awardMeditationCoins,
    awardTherapyCoins,
    awardMoodCoins,
    awardBreathingCoins,
    awardCommunityCoins,
    awardWellnessCoins,
    awardNutritionCoins,
    awardMusicCoins,
    coinRewards,
  }
} 