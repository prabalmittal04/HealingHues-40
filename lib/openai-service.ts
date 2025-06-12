import type { ChatCompletionRequestMessage } from "openai"

interface OpenAIResponse {
  text: string
  mood?: string
  affirmation?: string
  activity?: string
}

export class OpenAIService {
  private apiKey: string
  private baseUrl = "https://api.openai.com/v1/chat/completions"
  private model = "gpt-3.5-turbo"

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = process.env.OPENAI_API_KEY || ""
  }

  async generateResponse(userMessage: string, context?: string): Promise<OpenAIResponse> {
    try {
      console.log("Generating OpenAI response for:", userMessage.substring(0, 50))

      // If no API key is available, use local generation
      if (!this.apiKey) {
        console.log("No OpenAI API key available, using local generation")
        return this.generateLocalResponse(userMessage)
      }

      const messages: ChatCompletionRequestMessage[] = [
        {
          role: "system",
          content: this.createTherapeuticPrompt(context),
        },
        {
          role: "user",
          content: userMessage,
        },
      ]

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.choices[0]?.message?.content || ""

      // Extract mood from message
      const mood = this.extractMood(userMessage)

      return {
        text: generatedText,
        mood,
        affirmation: this.generateAffirmation(mood),
        activity: this.generateActivity(mood),
      }
    } catch (error) {
      console.error("Error generating OpenAI response:", error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private createTherapeuticPrompt(context?: string): string {
    return `You are HueBot, a compassionate AI mental health companion. Your purpose is to provide empathetic, supportive responses to users who may be experiencing various emotional states.

User context: ${context || "First conversation"}

Guidelines:
1. Respond with warmth, empathy, and understanding
2. Keep responses concise (under 150 words)
3. Validate the user's feelings
4. Offer gentle support and encouragement
5. Avoid clinical diagnoses or medical advice
6. Focus on emotional support rather than problem-solving
7. Use a conversational, friendly tone

Your goal is to help the user feel heard, understood, and supported.`
  }

  private extractMood(message: string): string {
    const lowerMessage = message.toLowerCase()

    const moodKeywords = {
      happy: ["happy", "joy", "excited", "great", "amazing", "wonderful", "good", "smile", "laugh"],
      sad: ["sad", "depressed", "down", "upset", "cry", "tears", "lonely", "hurt", "pain"],
      anxious: ["anxious", "worried", "nervous", "stress", "panic", "fear", "scared", "overwhelmed"],
      angry: ["angry", "mad", "furious", "frustrated", "irritated", "annoyed", "rage"],
      tired: ["tired", "exhausted", "drained", "weary", "fatigue", "sleepy"],
      calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "zen", "content"],
      confused: ["confused", "lost", "uncertain", "unclear", "puzzled", "mixed up"],
      grateful: ["grateful", "thankful", "blessed", "appreciative", "fortunate"],
      hopeful: ["hopeful", "optimistic", "positive", "confident", "encouraged"],
    }

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return mood
      }
    }

    return "neutral"
  }

  private generateLocalResponse(userMessage: string): OpenAIResponse {
    console.log("Generating local response for:", userMessage.substring(0, 50))

    const mood = this.extractMood(userMessage)
    const responses = this.getLocalResponses(mood)

    // Select a random response from the appropriate mood category
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      text: selectedResponse,
      mood,
      affirmation: this.generateAffirmation(mood),
      activity: this.generateActivity(mood),
    }
  }

  private getLocalResponses(mood: string): string[] {
    const responses: Record<string, string[]> = {
      happy: [
        "I can feel your joy radiating through your words! 🌟 It's wonderful to see you in such a positive space. What's bringing you this happiness today?",
        "Your happiness is contagious! ✨ I love hearing when you're feeling good. Would you like to share what's making you smile?",
        "This positive energy is beautiful! 🌈 It's so important to celebrate these moments. How can you carry this feeling forward?",
      ],
      sad: [
        "I can sense the weight you're carrying right now, and I want you to know that your feelings are completely valid. 💙 You don't have to face this alone.",
        "It takes courage to acknowledge when we're struggling. I'm here to listen without judgment. 🤗 What's been weighing on your heart?",
        "I see your pain, and I want you to know that it's okay to not be okay right now. 🕊️ Let's take this one moment at a time together.",
      ],
      anxious: [
        "I can feel the anxiety you're experiencing, and I want you to know that you're safe right now. 🌿 Let's breathe together for a moment.",
        "Anxiety can feel overwhelming, but you've gotten through difficult moments before. 🌸 You're stronger than your worries.",
        "Your mind might be racing right now, and that's okay. 🕯️ Let's focus on grounding you in this present moment.",
      ],
      angry: [
        "I can feel the intensity of your emotions, and that's completely valid. 🔥 Your feelings matter. Let's channel this energy constructively.",
        "Anger often comes from a place of hurt or injustice. ⚡ I'm here to listen to what's fueling these feelings.",
        "It's okay to feel angry - it shows you care deeply about something. 💪 Let's explore what's behind this emotion.",
      ],
      tired: [
        "I can feel how exhausted you are, both physically and emotionally. 🌙 You've been carrying so much. You deserve rest.",
        "Being tired isn't just about sleep - sometimes our souls need rest too. ☁️ You deserve to pause and recharge.",
        "Exhaustion is your body and mind's way of asking for care. 😴 Let's honor that need together.",
      ],
      calm: [
        "I love this peaceful energy you're bringing. 🍃 There's something beautiful about finding calm in our busy world.",
        "Your sense of tranquility is wonderful. ☁️ How are you cultivating this inner peace?",
        "This calm presence you have is a gift. 🕊️ What's helping you feel so centered?",
      ],
      confused: [
        "It's completely normal to feel confused sometimes. 🌀 Life can be complex, and it's okay not to have all the answers right now.",
        "Confusion often means you're processing something important. 🤔 Let's explore what's making you feel uncertain together.",
        "Feeling lost is part of the human experience. 🧭 Sometimes the path becomes clearer when we talk through our thoughts.",
      ],
      grateful: [
        "Your gratitude is beautiful and powerful. ✨ Gratitude has such a positive impact on our wellbeing. What are you most thankful for?",
        "I love hearing about what you're grateful for! 🙏 Gratitude can transform our perspective. Tell me more about what's filling your heart.",
        "Your appreciation for life's gifts is inspiring. 🌻 How has practicing gratitude changed your outlook?",
      ],
      hopeful: [
        "Your hope is like a beacon of light! 🌅 It's beautiful to see you looking forward with optimism. What's inspiring this hope?",
        "Hope is such a powerful force. 🌟 Even in difficult times, you're choosing to believe in better days ahead. That's incredible strength.",
        "Your optimism is contagious! 🌈 Hope can carry us through so much. What dreams are you nurturing right now?",
      ],
      neutral: [
        "Thank you for sharing with me. I'm here to listen and support you in whatever way I can. 💙 How are you feeling right now?",
        "I appreciate you opening up to me. 🤗 Sometimes it helps just to have someone to talk to. What's on your mind today?",
        "I'm glad you're here. 🌟 Whether you're having a good day or a challenging one, I'm here to support you. Tell me more about how you're doing.",
      ],
    }

    return responses[mood] || responses.neutral
  }

  private generateAffirmation(mood: string): string {
    const affirmations: Record<string, string[]> = {
      happy: [
        "Your joy is a gift to the world!",
        "You deserve all this happiness!",
        "Your positive energy is contagious!",
      ],
      sad: [
        "Your feelings are valid and important",
        "You are stronger than you know",
        "It's okay to not be okay right now",
      ],
      anxious: [
        "You are safe in this moment",
        "You have survived 100% of your difficult days",
        "This feeling will pass",
      ],
      angry: [
        "Your anger is valid and tells us something important",
        "You have the power to choose how to respond",
        "You can transform this energy into positive action",
      ],
      tired: ["You deserve rest and recovery", "It's okay to slow down", "Rest is productive and necessary"],
      neutral: ["You are valued and important", "Your feelings matter", "You are not alone"],
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
      ],
      sad: [
        "Try the 5-4-3-2-1 grounding technique",
        "Take three slow, deep breaths",
        "Wrap yourself in a soft blanket",
      ],
      anxious: [
        "Try the 4-7-8 breathing technique",
        "Name 5 things you can see around you",
        "Place your feet flat on the ground",
      ],
      angry: [
        "Take 10 deep breaths and count each one",
        "Write down your thoughts without censoring",
        "Do some physical movement or stretching",
      ],
      tired: ["Give yourself permission to rest", "Make a warm, comforting drink", "Do some gentle stretches"],
      neutral: [
        "Take a few mindful breaths",
        "Notice something beautiful around you",
        "Practice a moment of self-compassion",
      ],
    }

    const moodActivities = activities[mood] || activities.neutral
    return moodActivities[Math.floor(Math.random() * moodActivities.length)]
  }

  private getFallbackResponse(userMessage: string): OpenAIResponse {
    const mood = this.extractMood(userMessage)

    const fallbackResponses = [
      "I hear you, and I want you to know that I'm here for you. 💙 Sometimes it helps just to know someone is listening.",
      "Thank you for sharing with me. Your feelings and experiences matter. 🤗 How can I best support you right now?",
      "I appreciate you opening up to me. It takes courage to share our thoughts and feelings. 🌟 I'm here to listen without judgment.",
    ]

    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      mood,
      affirmation: this.generateAffirmation(mood),
      activity: this.generateActivity(mood),
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService()
