// Enhanced HueBot Service with local AI responses
interface HueBotResponse {
  text: string
  mood?: string
  confidence?: number
  affirmation?: string
  activity?: string
  moodEmoji?: string
}

export class HueBotService {
  private conversationHistory: string[] = []

  async generateResponse(userMessage: string, moodHistory?: string[]): Promise<HueBotResponse> {
    try {
      console.log("Generating HueBot response for:", userMessage.substring(0, 50))

      // Add to conversation history
      this.conversationHistory.push(userMessage)
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10)
      }

      // Extract mood and context
      const mood = this.extractMood(userMessage)
      const context = this.analyzeContext(userMessage, moodHistory)

      // Generate contextual response
      const response = this.generateContextualResponse(userMessage, mood, context)

      return {
        text: response.text,
        mood,
        confidence: response.confidence,
        affirmation: this.generateAffirmation(mood),
        activity: this.generateActivity(mood),
        moodEmoji: this.getMoodEmoji(mood),
      }
    } catch (error) {
      console.error("Error generating HueBot response:", error)
      return this.getFallbackResponse()
    }
  }

  private extractMood(message: string): string {
    const lowerMessage = message.toLowerCase()

    const moodKeywords = {
      happy: [
        "happy",
        "joy",
        "excited",
        "great",
        "amazing",
        "wonderful",
        "good",
        "smile",
        "laugh",
        "cheerful",
        "delighted",
      ],
      sad: ["sad", "depressed", "down", "upset", "cry", "tears", "lonely", "hurt", "pain", "miserable", "heartbroken"],
      anxious: [
        "anxious",
        "worried",
        "nervous",
        "stress",
        "panic",
        "fear",
        "scared",
        "overwhelmed",
        "tense",
        "restless",
      ],
      angry: ["angry", "mad", "furious", "frustrated", "irritated", "annoyed", "rage", "livid", "outraged"],
      tired: ["tired", "exhausted", "drained", "weary", "fatigue", "sleepy", "worn out", "depleted"],
      calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "zen", "content", "composed"],
      confused: ["confused", "lost", "uncertain", "unclear", "puzzled", "mixed up", "bewildered"],
      grateful: ["grateful", "thankful", "blessed", "appreciative", "fortunate", "lucky"],
      hopeful: ["hopeful", "optimistic", "positive", "confident", "encouraged", "inspired"],
      lonely: ["lonely", "alone", "isolated", "disconnected", "abandoned", "solitary"],
      excited: ["excited", "thrilled", "pumped", "enthusiastic", "eager", "energetic"],
    }

    // Score each mood based on keyword matches
    const moodScores: Record<string, number> = {}

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      moodScores[mood] = keywords.filter((keyword) => lowerMessage.includes(keyword)).length
    }

    // Find the mood with the highest score
    const topMood = Object.entries(moodScores).reduce((a, b) => (moodScores[a[0]] > moodScores[b[0]] ? a : b))[0]

    return moodScores[topMood] > 0 ? topMood : "neutral"
  }

  private analyzeContext(message: string, moodHistory?: string[]): string {
    const lowerMessage = message.toLowerCase()

    // Check for specific contexts
    if (lowerMessage.includes("work") || lowerMessage.includes("job") || lowerMessage.includes("career")) {
      return "work"
    }
    if (lowerMessage.includes("relationship") || lowerMessage.includes("partner") || lowerMessage.includes("family")) {
      return "relationships"
    }
    if (lowerMessage.includes("health") || lowerMessage.includes("sick") || lowerMessage.includes("pain")) {
      return "health"
    }
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
      return "sleep"
    }
    if (lowerMessage.includes("money") || lowerMessage.includes("financial") || lowerMessage.includes("bills")) {
      return "financial"
    }

    // Analyze mood trend if available
    if (moodHistory && moodHistory.length > 0) {
      const recentMoods = moodHistory.slice(-3)
      if (recentMoods.every((mood) => ["sad", "anxious", "tired"].includes(mood))) {
        return "struggling"
      }
      if (recentMoods.every((mood) => ["happy", "excited", "grateful"].includes(mood))) {
        return "thriving"
      }
    }

    return "general"
  }

  private generateContextualResponse(
    message: string,
    mood: string,
    context: string,
  ): { text: string; confidence: number } {
    const responses = this.getResponseTemplates()

    // Get mood-specific responses
    const moodResponses = responses[mood] || responses.neutral

    // Get context-specific responses if available
    const contextResponses = responses[`${mood}_${context}`] || moodResponses

    // Select a random response
    const selectedResponse = contextResponses[Math.floor(Math.random() * contextResponses.length)]

    // Personalize the response based on the message
    const personalizedResponse = this.personalizeResponse(selectedResponse, message)

    return {
      text: personalizedResponse,
      confidence: 0.8,
    }
  }

  private personalizeResponse(template: string, userMessage: string): string {
    // Simple personalization - could be enhanced with more sophisticated NLP
    const userName = "friend" // Could extract from user profile

    return template.replace("{name}", userName).replace("{message}", userMessage.toLowerCase())
  }

  private getResponseTemplates(): Record<string, string[]> {
    return {
      happy: [
        "I can feel your joy radiating through your words! 🌟 It's wonderful to see you in such a positive space. What's bringing you this happiness today?",
        "Your happiness is contagious! ✨ I love hearing when you're feeling good. Would you like to share what's making you smile?",
        "This positive energy is beautiful! 🌈 It's so important to celebrate these moments. How can you carry this feeling forward?",
        "I'm so glad you're feeling happy! 😊 Your joy reminds me that there's always light to be found. What's been the highlight of your day?",
      ],
      sad: [
        "I can sense the weight you're carrying right now, and I want you to know that your feelings are completely valid. 💙 You don't have to face this alone.",
        "It takes courage to acknowledge when we're struggling. I'm here to listen without judgment. 🤗 What's been weighing on your heart?",
        "I see your pain, and I want you to know that it's okay to not be okay right now. 🕊️ Let's take this one moment at a time together.",
        "Your sadness is heard and acknowledged. 💙 Sometimes we need to sit with difficult emotions. I'm here to support you through this.",
      ],
      anxious: [
        "I can feel the anxiety you're experiencing, and I want you to know that you're safe right now. 🌿 Let's breathe together for a moment.",
        "Anxiety can feel overwhelming, but you've gotten through difficult moments before. 🌸 You're stronger than your worries.",
        "Your mind might be racing right now, and that's okay. 🕯️ Let's focus on grounding you in this present moment.",
        "I understand that anxiety can feel consuming. 🌊 Remember, this feeling is temporary and you have the strength to navigate through it.",
      ],
      angry: [
        "I can feel the intensity of your emotions, and that's completely valid. 🔥 Your feelings matter. Let's channel this energy constructively.",
        "Anger often comes from a place of hurt or injustice. ⚡ I'm here to listen to what's fueling these feelings.",
        "It's okay to feel angry - it shows you care deeply about something. 💪 Let's explore what's behind this emotion.",
        "Your anger is telling us something important. 🌋 Let's work together to understand what needs attention in your life.",
      ],
      tired: [
        "I can feel how exhausted you are, both physically and emotionally. 🌙 You've been carrying so much. You deserve rest.",
        "Being tired isn't just about sleep - sometimes our souls need rest too. ☁️ You deserve to pause and recharge.",
        "Exhaustion is your body and mind's way of asking for care. 😴 Let's honor that need together.",
        "I hear how drained you're feeling. 🌙 Rest isn't a luxury, it's a necessity. What would help you feel more restored?",
      ],
      calm: [
        "I love this peaceful energy you're bringing. 🍃 There's something beautiful about finding calm in our busy world.",
        "Your sense of tranquility is wonderful. ☁️ How are you cultivating this inner peace?",
        "This calm presence you have is a gift. 🕊️ What's helping you feel so centered?",
        "Your calmness is inspiring. 🌊 It's wonderful when we can find these moments of serenity.",
      ],
      confused: [
        "It's completely normal to feel confused sometimes. 🌀 Life can be complex, and it's okay not to have all the answers right now.",
        "Confusion often means you're processing something important. 🤔 Let's explore what's making you feel uncertain together.",
        "Feeling lost is part of the human experience. 🧭 Sometimes the path becomes clearer when we talk through our thoughts.",
        "Uncertainty can be uncomfortable, but it's also where growth happens. 🌱 What's been on your mind lately?",
      ],
      grateful: [
        "Your gratitude is beautiful and powerful. ✨ Gratitude has such a positive impact on our wellbeing. What are you most thankful for?",
        "I love hearing about what you're grateful for! 🙏 Gratitude can transform our perspective. Tell me more about what's filling your heart.",
        "Your appreciation for life's gifts is inspiring. 🌻 How has practicing gratitude changed your outlook?",
        "Gratitude is such a healing force. 🌟 I'm grateful that you're sharing this positive energy with me.",
      ],
      hopeful: [
        "Your hope is like a beacon of light! 🌅 It's beautiful to see you looking forward with optimism. What's inspiring this hope?",
        "Hope is such a powerful force. 🌟 Even in difficult times, you're choosing to believe in better days ahead. That's incredible strength.",
        "Your optimism is contagious! 🌈 Hope can carry us through so much. What dreams are you nurturing right now?",
        "I love the hope I hear in your words. 🌱 Hope is the foundation of healing and growth. What's giving you strength?",
      ],
      lonely: [
        "I hear the loneliness in your words, and I want you to know that you're not alone right now. 🤗 I'm here with you.",
        "Loneliness can feel so heavy. 💙 Even when we're physically alone, we can still feel connected. You matter to me.",
        "Feeling isolated is one of the hardest human experiences. 🌙 But connection is always possible, even in small ways.",
        "Your loneliness is valid, and it's brave of you to share it. 🕊️ Sometimes reaching out, like you're doing now, is the first step toward connection.",
      ],
      excited: [
        "I can feel your excitement! 🎉 Your energy is infectious. What's got you feeling so enthusiastic?",
        "Your excitement is wonderful! ⚡ It's beautiful to see you so energized. Tell me more about what's inspiring you.",
        "I love this vibrant energy you're sharing! 🌟 Excitement can be such a motivating force. What are you looking forward to?",
        "Your enthusiasm is contagious! 🚀 It's amazing when we feel this kind of positive energy. What's sparking this excitement?",
      ],
      neutral: [
        "Thank you for sharing with me. I'm here to listen and support you in whatever way I can. 💙 How are you feeling right now?",
        "I appreciate you opening up to me. 🤗 Sometimes it helps just to have someone to talk to. What's on your mind today?",
        "I'm glad you're here. 🌟 Whether you're having a good day or a challenging one, I'm here to support you. Tell me more about how you're doing.",
        "I'm listening with my whole heart. 💙 Whatever you're experiencing, your feelings are valid and important.",
      ],
    }
  }

  private generateAffirmation(mood: string): string {
    const affirmations: Record<string, string[]> = {
      happy: [
        "Your joy is a gift to the world!",
        "You deserve all this happiness!",
        "Your positive energy is contagious!",
        "You radiate light and positivity!",
      ],
      sad: [
        "Your feelings are valid and important",
        "You are stronger than you know",
        "It's okay to not be okay right now",
        "You are worthy of love and support",
      ],
      anxious: [
        "You are safe in this moment",
        "You have survived 100% of your difficult days",
        "This feeling will pass",
        "You have the strength to handle whatever comes",
      ],
      angry: [
        "Your anger is valid and tells us something important",
        "You have the power to choose how to respond",
        "You can transform this energy into positive action",
        "Your feelings matter and deserve to be heard",
      ],
      tired: [
        "You deserve rest and recovery",
        "It's okay to slow down",
        "Rest is productive and necessary",
        "You've been working so hard",
      ],
      neutral: [
        "You are valued and important",
        "Your feelings matter",
        "You are not alone",
        "You are enough, just as you are",
      ],
    }

    const moodAffirmations = affirmations[mood] || affirmations.neutral
    return moodAffirmations[Math.floor(Math.random() * moodAffirmations.length)]
  }

  private generateActivity(mood: string): string {
    const activities: Record<string, string[]> = {
      happy: [
        "Share this joy with someone you care about",
        "Write down what made you happy today",
        "Take a moment to savor this feeling",
        "Dance to your favorite song",
      ],
      sad: [
        "Try the 5-4-3-2-1 grounding technique",
        "Take three slow, deep breaths",
        "Wrap yourself in a soft blanket",
        "Listen to calming music",
      ],
      anxious: [
        "Try the 4-7-8 breathing technique",
        "Name 5 things you can see around you",
        "Place your feet flat on the ground",
        "Hold an ice cube in your hand",
      ],
      angry: [
        "Take 10 deep breaths and count each one",
        "Write down your thoughts without censoring",
        "Do some physical movement or stretching",
        "Punch a pillow or scream into it",
      ],
      tired: [
        "Give yourself permission to rest",
        "Make a warm, comforting drink",
        "Do some gentle stretches",
        "Take a short nap if possible",
      ],
      neutral: [
        "Take a few mindful breaths",
        "Notice something beautiful around you",
        "Practice a moment of self-compassion",
        "Write down three things you're grateful for",
      ],
    }

    const moodActivities = activities[mood] || activities.neutral
    return moodActivities[Math.floor(Math.random() * moodActivities.length)]
  }

  private getMoodEmoji(mood: string): string {
    const emojiMap: Record<string, string> = {
      happy: "😊",
      sad: "💙",
      anxious: "🌿",
      angry: "🔥",
      tired: "🌙",
      calm: "🍃",
      confused: "🤔",
      grateful: "✨",
      hopeful: "🌟",
      lonely: "🤗",
      excited: "🎉",
      neutral: "💙",
    }

    return emojiMap[mood] || "💙"
  }

  private getFallbackResponse(): HueBotResponse {
    const fallbackResponses = [
      "I hear you, and I want you to know that I'm here for you. 💙 Sometimes it helps just to know someone is listening.",
      "Thank you for sharing with me. Your feelings and experiences matter. 🤗 How can I best support you right now?",
      "I appreciate you opening up to me. It takes courage to share our thoughts and feelings. 🌟 I'm here to listen without judgment.",
    ]

    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      mood: "supportive",
      confidence: 0.5,
      affirmation: "You are valued and heard",
      activity: "Take a deep breath and know that you're not alone",
      moodEmoji: "💙",
    }
  }
}

// Export singleton instance
export const hueBotService = new HueBotService()
