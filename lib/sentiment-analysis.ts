// Enhanced Sentiment Analysis and Empathetic Response for HueBot

interface SentimentResult {
  mood: string
  moodValue: number
  confidence: number
  keywords: string[]
  trend?: string
  intensity: number
  emotions: string[]
}

interface EmpatheticResponse {
  message: string
  emoji: string
  affirmation: string
  activity: string
  followUp: string
  supportLevel: "low" | "medium" | "high"
  resources?: string[]
}

// Enhanced Sentiment Analyzer with better emotion detection
export function analyzeSentiment(text: string, history: string[] = []): SentimentResult {
  const lowerText = text.toLowerCase()

  const moodKeywords = {
    happy: {
      keywords: [
        "happy",
        "joy",
        "excited",
        "great",
        "amazing",
        "wonderful",
        "fantastic",
        "good",
        "smile",
        "laugh",
        "love",
        "celebrate",
        "thrilled",
        "delighted",
        "cheerful",
        "blissful",
        "ecstatic",
      ],
      intensity: 4,
    },
    sad: {
      keywords: [
        "sad",
        "depressed",
        "down",
        "upset",
        "cry",
        "tears",
        "lonely",
        "empty",
        "hurt",
        "pain",
        "grief",
        "loss",
        "heartbroken",
        "devastated",
        "miserable",
        "gloomy",
        "melancholy",
      ],
      intensity: 1,
    },
    anxious: {
      keywords: [
        "anxious",
        "worried",
        "nervous",
        "stress",
        "panic",
        "fear",
        "scared",
        "overwhelmed",
        "tension",
        "restless",
        "uneasy",
        "apprehensive",
        "jittery",
        "frantic",
      ],
      intensity: 2,
    },
    angry: {
      keywords: [
        "angry",
        "mad",
        "furious",
        "rage",
        "hate",
        "annoyed",
        "frustrated",
        "irritated",
        "pissed",
        "livid",
        "outraged",
        "bitter",
        "resentful",
        "hostile",
      ],
      intensity: 2,
    },
    tired: {
      keywords: [
        "tired",
        "exhausted",
        "drained",
        "weary",
        "fatigue",
        "sleepy",
        "worn out",
        "burned out",
        "depleted",
        "lethargic",
        "sluggish",
      ],
      intensity: 2,
    },
    calm: {
      keywords: [
        "calm",
        "peaceful",
        "relaxed",
        "serene",
        "tranquil",
        "zen",
        "centered",
        "balanced",
        "quiet",
        "composed",
        "content",
        "stable",
      ],
      intensity: 3,
    },
    excited: {
      keywords: [
        "excited",
        "thrilled",
        "pumped",
        "energetic",
        "enthusiastic",
        "eager",
        "motivated",
        "hyped",
        "elated",
        "exhilarated",
      ],
      intensity: 5,
    },
    confused: {
      keywords: ["confused", "lost", "uncertain", "unclear", "puzzled", "bewildered", "perplexed", "mixed up"],
      intensity: 2,
    },
    grateful: {
      keywords: ["grateful", "thankful", "blessed", "appreciative", "fortunate", "lucky"],
      intensity: 4,
    },
    hopeful: {
      keywords: ["hopeful", "optimistic", "positive", "confident", "encouraged", "inspired"],
      intensity: 4,
    },
  }

  const scores: Record<string, { count: number; intensity: number }> = {}
  const detectedEmotions: string[] = []

  // Analyze each mood category
  for (const [mood, data] of Object.entries(moodKeywords)) {
    const matches = data.keywords.filter(
      (keyword) => lowerText.includes(keyword) || new RegExp(`\\b${keyword}\\b`, "gi").test(lowerText),
    )

    if (matches.length > 0) {
      scores[mood] = {
        count: matches.length,
        intensity: data.intensity,
      }
      detectedEmotions.push(mood)
    }
  }

  // Determine dominant mood
  let dominantMood = "calm"
  let maxScore = 0
  let moodValue = 3

  Object.entries(scores).forEach(([mood, data]) => {
    const score = data.count * data.intensity
    if (score > maxScore) {
      maxScore = score
      dominantMood = mood
      moodValue = data.intensity
    }
  })

  // If no specific emotions detected, use contextual analysis
  if (Object.keys(scores).length === 0) {
    const posWords = ["good", "nice", "okay", "fine", "well", "better", "positive", "alright"]
    const negWords = ["bad", "terrible", "awful", "horrible", "worse", "difficult", "hard", "struggle", "tough"]

    const posCount = posWords.reduce((c, w) => c + (lowerText.includes(w) ? 1 : 0), 0)
    const negCount = negWords.reduce((c, w) => c + (lowerText.includes(w) ? 1 : 0), 0)

    if (posCount > negCount) {
      dominantMood = "happy"
      moodValue = 4
    } else if (negCount > posCount) {
      dominantMood = "sad"
      moodValue = 2
    }
  }

  // Calculate confidence based on keyword matches and text length
  const confidence = Math.min((maxScore / Math.max(text.split(" ").length, 1)) * 2, 1)

  // Detect trend if history is available
  const trend = history.length > 2 ? detectTrend([...history, dominantMood]) : undefined

  // Calculate emotional intensity
  const intensity = Math.min(Math.max(moodValue + (maxScore > 3 ? 1 : 0), 1), 5)

  return {
    mood: dominantMood,
    moodValue,
    confidence,
    keywords: moodKeywords[dominantMood as keyof typeof moodKeywords]?.keywords || [],
    trend,
    intensity,
    emotions: detectedEmotions,
  }
}

function detectTrend(history: string[]): string {
  const last3 = history.slice(-3)
  const positiveEmotions = ["happy", "excited", "grateful", "hopeful", "calm"]
  const negativeEmotions = ["sad", "anxious", "angry", "tired"]

  const recentPositive = last3.filter((mood) => positiveEmotions.includes(mood)).length
  const recentNegative = last3.filter((mood) => negativeEmotions.includes(mood)).length

  if (recentPositive > recentNegative) return "Improving trend"
  if (recentNegative > recentPositive) return "Needs attention"
  return "Stable pattern"
}

// Enhanced Empathetic Response Generator
export function generateEmpatheticResponse(sentiment: SentimentResult, userHistory?: string[]): EmpatheticResponse {
  const responses = getResponseTemplates()
  const moodResponses = responses[sentiment.mood as keyof typeof responses] || responses.calm

  // Determine support level based on mood and intensity
  let supportLevel: "low" | "medium" | "high" = "medium"
  if (["sad", "anxious", "angry"].includes(sentiment.mood) && sentiment.intensity <= 2) {
    supportLevel = "high"
  } else if (["happy", "excited", "grateful"].includes(sentiment.mood)) {
    supportLevel = "low"
  }

  // Select appropriate response based on support level
  const responseSet = moodResponses[supportLevel] || moodResponses.medium

  return {
    message: getRandom(responseSet.messages),
    emoji: getRandom(moodResponses.emojis),
    affirmation: getRandom(responseSet.affirmations),
    activity: getRandom(responseSet.activities),
    followUp: getRandom(responseSet.followUps),
    supportLevel,
    resources: supportLevel === "high" ? getResources(sentiment.mood) : undefined,
  }
}

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getResources(mood: string): string[] {
  const resources: Record<string, string[]> = {
    sad: [
      "Consider talking to a counselor or therapist",
      "Try the 5-4-3-2-1 grounding technique",
      "Reach out to a trusted friend or family member",
    ],
    anxious: [
      "Practice deep breathing exercises",
      "Try progressive muscle relaxation",
      "Consider mindfulness meditation",
    ],
    angry: [
      "Take a 10-minute walk to cool down",
      "Try journaling your thoughts",
      "Practice the 4-7-8 breathing technique",
    ],
  }

  return resources[mood] || []
}

function getResponseTemplates() {
  return {
    happy: {
      emojis: ["😊", "🌟", "🌈", "✨", "🎉"],
      low: {
        messages: [
          "Your happiness is contagious! What's bringing you such joy today? 🌞",
          "I love seeing you so upbeat! Tell me more about what's making you smile! ✨",
          "Your positive energy is wonderful! What's the highlight of your day? 🌟",
        ],
        affirmations: [
          "You deserve all this happiness!",
          "Your joy is a gift to the world!",
          "You radiate positivity!",
        ],
        activities: [
          "Share this joy with someone you care about",
          "Write down what made you happy today",
          "Take a moment to savor this feeling",
        ],
        followUps: [
          "What would you like to do to celebrate this moment?",
          "How can you carry this energy forward?",
          "Would you like to share what's making you so happy?",
        ],
      },
      medium: {
        messages: [
          "It's wonderful to see you feeling good! What's contributing to your happiness? 😊",
          "Your positive mood is lovely! What's been going well for you? 🌟",
        ],
        affirmations: ["You deserve to feel this good!", "Your happiness matters!"],
        activities: ["Capture this moment in your gratitude journal", "Do something kind for yourself"],
        followUps: ["What's been the best part of your day?", "How are you taking care of yourself?"],
      },
      high: {
        messages: ["You seem happy! That's great to see! 😊"],
        affirmations: ["You're doing well!"],
        activities: ["Keep doing what makes you happy"],
        followUps: ["What's going well for you?"],
      },
    },
    sad: {
      emojis: ["💙", "🕊️", "🤗", "🌸", "💜"],
      high: {
        messages: [
          "I can feel the weight you're carrying right now, and I want you to know that I'm here with you. Your feelings are completely valid. 💙",
          "It takes courage to acknowledge when we're struggling. I'm here to listen without judgment. What's been weighing on your heart? 🤗",
          "I see your pain, and I want you to know that you don't have to face this alone. Let's take this one moment at a time. 🕊️",
        ],
        affirmations: [
          "Your feelings are valid and important",
          "You are stronger than you know, even in this difficult moment",
          "It's okay to not be okay right now",
          "You matter, and your life has value",
        ],
        activities: [
          "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
          "Take three slow, deep breaths with me",
          "Wrap yourself in a soft blanket and be gentle with yourself",
        ],
        followUps: [
          "Would you like to talk about what's making you feel this way?",
          "Is there someone in your life you could reach out to right now?",
          "What's one small thing that might bring you a tiny bit of comfort?",
        ],
      },
      medium: {
        messages: [
          "I can sense you're going through a tough time. I'm here to listen. 💙",
          "It's okay to feel sad sometimes. What's on your mind? 🤗",
        ],
        affirmations: ["You're not alone in this", "It's okay to feel your emotions"],
        activities: ["Take a few deep breaths", "Be gentle with yourself today"],
        followUps: ["What's been difficult for you lately?", "How can I support you right now?"],
      },
      low: {
        messages: ["I notice you might be feeling down. I'm here if you need to talk. 💙"],
        affirmations: ["Your feelings matter"],
        activities: ["Take care of yourself today"],
        followUps: ["How are you doing?"],
      },
    },
    anxious: {
      emojis: ["🌿", "🌸", "🕯️", "🦋", "☁️"],
      high: {
        messages: [
          "I can feel the anxiety you're experiencing, and I want you to know that you're safe right now. Let's breathe together for a moment. 🌿",
          "Anxiety can feel overwhelming, but you've gotten through difficult moments before. You're stronger than your worries. 🌸",
          "Your mind might be racing right now, and that's okay. Let's focus on grounding you in this present moment. 🕯️",
        ],
        affirmations: [
          "You are safe in this moment",
          "You have survived 100% of your difficult days so far",
          "This feeling will pass, even though it feels intense right now",
          "You are capable of handling whatever comes your way",
        ],
        activities: [
          "Try the 4-7-8 breathing: breathe in for 4, hold for 7, exhale for 8",
          "Name 5 things you can see around you right now",
          "Place your feet flat on the ground and feel the connection to the earth",
        ],
        followUps: [
          "What's making you feel most anxious right now?",
          "Would you like me to guide you through a calming exercise?",
          "Is there something specific you're worried about that we can talk through?",
        ],
      },
      medium: {
        messages: [
          "I can sense some anxiety in what you're sharing. Let's take this slowly. 🌿",
          "Feeling anxious is tough. You're not alone in this. 🌸",
        ],
        affirmations: ["You can handle this", "One step at a time"],
        activities: ["Take three deep breaths", "Focus on what you can control"],
        followUps: ["What's causing you to feel anxious?", "How can we work through this together?"],
      },
      low: {
        messages: ["I notice you might be feeling a bit anxious. I'm here to help. 🌿"],
        affirmations: ["You're going to be okay"],
        activities: ["Take a moment to breathe"],
        followUps: ["What's on your mind?"],
      },
    },
    angry: {
      emojis: ["🔥", "⚡", "🌋", "💪", "🎯"],
      high: {
        messages: [
          "I can feel the intensity of your anger, and that's completely valid. Your feelings matter. Let's channel this energy constructively. 🔥",
          "Anger often comes from a place of hurt or injustice. I'm here to listen to what's fueling these feelings. ⚡",
          "It's okay to feel angry - it shows you care deeply about something. Let's explore what's behind this emotion. 💪",
        ],
        affirmations: [
          "Your anger is valid and tells us something important",
          "You have the power to choose how to respond to these feelings",
          "It's okay to feel intense emotions",
          "You can transform this energy into positive action",
        ],
        activities: [
          "Take 10 deep breaths and count each one",
          "Write down your thoughts without censoring them",
          "Do some physical movement - even just stretching can help",
        ],
        followUps: [
          "What triggered these angry feelings?",
          "Is there an injustice or boundary that's been crossed?",
          "How would you like to channel this energy?",
        ],
      },
      medium: {
        messages: [
          "I can sense your frustration. Let's work through this together. 🔥",
          "Anger can be a powerful emotion. What's driving these feelings? ⚡",
        ],
        affirmations: ["Your feelings are understandable", "You can work through this"],
        activities: ["Take some deep breaths", "Step back and assess the situation"],
        followUps: ["What's making you feel angry?", "How can we address what's bothering you?"],
      },
      low: {
        messages: ["I sense some frustration. Want to talk about it? 🔥"],
        affirmations: ["It's okay to feel frustrated"],
        activities: ["Take a moment to cool down"],
        followUps: ["What's bothering you?"],
      },
    },
    tired: {
      emojis: ["😴", "🌙", "☁️", "🛌", "🕯️"],
      high: {
        messages: [
          "I can feel how exhausted you are, both physically and emotionally. You've been carrying so much. 🌙",
          "Being tired isn't just about sleep - sometimes our souls need rest too. You deserve to pause and recharge. ☁️",
          "Exhaustion is your body and mind's way of asking for care. Let's honor that need together. 😴",
        ],
        affirmations: [
          "You deserve rest and recovery",
          "It's okay to slow down and take care of yourself",
          "You've been working hard and doing your best",
          "Rest is productive and necessary",
        ],
        activities: [
          "Give yourself permission to rest without guilt",
          "Make a warm, comforting drink and sip it slowly",
          "Do some gentle stretches or light movement",
        ],
        followUps: [
          "What's been draining your energy lately?",
          "When was the last time you had quality rest?",
          "What would help you feel more restored?",
        ],
      },
      medium: {
        messages: [
          "You sound tired. It's important to listen to your body. 🌙",
          "Feeling drained is tough. What's been wearing you down? 😴",
        ],
        affirmations: ["You need and deserve rest", "It's okay to take breaks"],
        activities: ["Consider taking a short break", "Do something gentle for yourself"],
        followUps: ["What's been exhausting you?", "How can you get better rest?"],
      },
      low: {
        messages: ["You seem tired. Make sure you're taking care of yourself. 😴"],
        affirmations: ["Rest is important"],
        activities: ["Consider getting some rest"],
        followUps: ["How have you been sleeping?"],
      },
    },
    calm: {
      emojis: ["🍃", "☁️", "🕊️", "🌊", "🧘"],
      low: {
        messages: [
          "I love this peaceful energy you're bringing. There's something beautiful about finding calm in our busy world. 🍃",
          "Your sense of tranquility is wonderful. How are you cultivating this inner peace? ☁️",
          "This calm presence you have is a gift. What's helping you feel so centered? 🕊️",
        ],
        affirmations: [
          "Peace suits you beautifully",
          "You've found a lovely balance",
          "Your calm energy is a strength",
        ],
        activities: [
          "Take a moment to appreciate this peaceful feeling",
          "Notice what's contributing to your sense of calm",
          "Share this peaceful energy with your environment",
        ],
        followUps: [
          "What's helping you feel so peaceful?",
          "How can you maintain this sense of calm?",
          "What would you like to reflect on in this peaceful moment?",
        ],
      },
      medium: {
        messages: [
          "You seem to be in a good, balanced place right now. 🍃",
          "I appreciate the calm energy you're sharing. ☁️",
        ],
        affirmations: ["You're in a good space", "This balance is healthy"],
        activities: ["Enjoy this moment of peace", "Reflect on what's going well"],
        followUps: ["How are things going for you?", "What's bringing you peace today?"],
      },
      high: {
        messages: ["You seem calm and centered. That's wonderful. 🍃"],
        affirmations: ["You're doing well"],
        activities: ["Continue what you're doing"],
        followUps: ["How are you feeling overall?"],
      },
    },
    excited: {
      emojis: ["🚀", "🎉", "⭐", "🌟", "🎊"],
      low: {
        messages: [
          "Your excitement is absolutely infectious! I can feel your energy radiating through your words! 🚀",
          "Wow! Your enthusiasm is amazing! What's got you so pumped up? This is wonderful to see! 🎉",
          "I LOVE this energy! Your excitement is lighting up everything around you! Tell me everything! ⭐",
        ],
        affirmations: [
          "Your enthusiasm is a superpower!",
          "You bring such vibrant energy to the world!",
          "Your excitement inspires others!",
        ],
        activities: [
          "Channel this energy into something creative",
          "Share your excitement with someone you love",
          "Dance or move your body to express this joy",
        ],
        followUps: [
          "What's got you so excited? I want to hear all about it!",
          "How can you use this amazing energy?",
          "Who else would love to hear about what's exciting you?",
        ],
      },
      medium: {
        messages: [
          "I can feel your excitement! That's wonderful! 🚀",
          "Your enthusiasm is great to see! What's happening? 🎉",
        ],
        affirmations: ["Your excitement is contagious!", "It's great to see you so energized!"],
        activities: ["Channel this energy positively", "Share your excitement with others"],
        followUps: ["What's making you so excited?", "How can you make the most of this energy?"],
      },
      high: {
        messages: ["You seem excited! That's great! 🚀"],
        affirmations: ["Your energy is wonderful!"],
        activities: ["Enjoy this excitement"],
        followUps: ["What's exciting you?"],
      },
    },
  }
}

export type Response = EmpatheticResponse
export const generateEmpathetic = generateEmpatheticResponse
