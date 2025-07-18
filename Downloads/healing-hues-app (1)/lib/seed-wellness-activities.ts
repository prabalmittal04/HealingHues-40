import { saveWellnessActivity } from "./firestore"
import type { WellnessActivity } from "./firestore"

// Default wellness activities data
export const defaultWellnessActivities = [
  {
    title: "Therapy Hub",
    description: "Connect with licensed therapists and support groups for personalized mental health guidance and emotional support",
    activityType: "therapy",
    icon: "Brain",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-400/30",
    reward: 30,
    activeSessions: 12,
    totalParticipants: 247,
    difficulty: "beginner" as const,
    duration: 60,
    tags: ["therapy", "support", "mental-health", "professional"],
    isActive: true,
    createdBy: "system",
    featured: true,
    category: "mental-health",
    instructions: "Join a therapy session or support group. Sessions are led by licensed professionals and provide a safe space for sharing and healing.",
    benefits: [
      "Professional mental health support",
      "Safe space for emotional expression",
      "Coping strategies and tools",
      "Community connection"
    ],
    requirements: [
      "Open mind and willingness to participate",
      "Respect for others' privacy",
      "Stable internet connection"
    ]
  },
  {
    title: "Soothing Music",
    description: "Immerse yourself in healing frequencies and calming soundscapes designed to reduce stress and promote relaxation",
    activityType: "music",
    icon: "Music",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-400/30",
    reward: 15,
    activeSessions: 8,
    totalParticipants: 189,
    difficulty: "beginner" as const,
    duration: 45,
    tags: ["music", "relaxation", "stress-relief", "healing-frequencies"],
    isActive: true,
    createdBy: "system",
    featured: true,
    category: "relaxation",
    instructions: "Find a quiet space, put on headphones, and let the healing sounds wash over you. Focus on your breath and allow the music to guide you into deep relaxation.",
    benefits: [
      "Reduces stress and anxiety",
      "Improves sleep quality",
      "Enhances mood and emotional balance",
      "Promotes mindfulness and presence"
    ],
    requirements: [
      "Headphones or quiet environment",
      "Comfortable seating position",
      "Willingness to relax and let go"
    ]
  },
  {
    title: "Meditation Studio",
    description: "Access guided meditations for inner peace, clarity, and spiritual growth with various techniques and durations",
    activityType: "meditation",
    icon: "Heart",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-400/30",
    reward: 25,
    activeSessions: 15,
    totalParticipants: 324,
    difficulty: "beginner" as const,
    duration: 30,
    tags: ["meditation", "mindfulness", "inner-peace", "spiritual-growth"],
    isActive: true,
    createdBy: "system",
    featured: true,
    category: "mindfulness",
    instructions: "Choose a comfortable position, close your eyes, and follow the guided meditation. Focus on your breath and let thoughts pass by without judgment.",
    benefits: [
      "Reduces stress and anxiety",
      "Improves focus and concentration",
      "Enhances emotional regulation",
      "Promotes spiritual growth"
    ],
    requirements: [
      "Quiet, comfortable space",
      "Open mind and patience",
      "Consistent practice"
    ]
  },
  {
    title: "Breathing Coach",
    description: "Learn breathwork techniques for anxiety relief, stress management, and improved respiratory health",
    activityType: "breathing",
    icon: "Wind",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-400/30",
    reward: 20,
    activeSessions: 6,
    totalParticipants: 156,
    difficulty: "beginner" as const,
    duration: 20,
    tags: ["breathwork", "anxiety-relief", "stress-management", "respiratory-health"],
    isActive: true,
    createdBy: "system",
    featured: true,
    category: "stress-relief",
    instructions: "Follow the breathing patterns guided by the coach. Focus on the rhythm and feel the calming effects as you practice different breathing techniques.",
    benefits: [
      "Reduces anxiety and panic attacks",
      "Improves respiratory function",
      "Enhances focus and clarity",
      "Promotes relaxation and calm"
    ],
    requirements: [
      "Comfortable seated position",
      "Willingness to learn new techniques",
      "No respiratory conditions that prevent deep breathing"
    ]
  },
  {
    title: "Mood Nutrition",
    description: "Discover nutritional guidance for mental wellness, mood enhancement, and overall brain health",
    activityType: "nutrition",
    icon: "Utensils",
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-400/30",
    reward: 18,
    activeSessions: 4,
    totalParticipants: 98,
    difficulty: "beginner" as const,
    duration: 45,
    tags: ["nutrition", "mood-enhancement", "brain-health", "wellness"],
    isActive: true,
    createdBy: "system",
    featured: true,
    category: "nutrition",
    instructions: "Learn about foods that support mental health and mood. Discover how nutrition affects your brain chemistry and emotional well-being.",
    benefits: [
      "Improves mood and emotional stability",
      "Enhances brain function and clarity",
      "Supports overall mental health",
      "Provides sustainable energy"
    ],
    requirements: [
      "Openness to dietary changes",
      "Access to healthy food options",
      "Consultation with healthcare provider if needed"
    ]
  }
]

// Function to seed wellness activities
export const seedWellnessActivities = async (userId: string) => {
  try {
    console.log("Seeding wellness activities...")
    
    const results = []
    
    for (const activity of defaultWellnessActivities) {
      try {
        const savedActivity = await saveWellnessActivity({
          ...activity,
          createdBy: userId,
        })
        results.push(savedActivity)
        console.log(`✅ Created activity: ${activity.title}`)
      } catch (error) {
        console.error(`❌ Failed to create activity: ${activity.title}`, error)
      }
    }
    
    console.log(`Successfully seeded ${results.length} wellness activities`)
    return results
  } catch (error) {
    console.error("Error seeding wellness activities:", error)
    throw error
  }
}

// Function to check if activities exist and seed if needed
export const initializeWellnessActivities = async (userId: string) => {
  try {
    // For now, we'll seed activities every time
    // In a production app, you'd check if activities already exist
    await seedWellnessActivities(userId)
    console.log("Wellness activities initialized successfully")
  } catch (error) {
    console.error("Error initializing wellness activities:", error)
    throw error
  }
} 