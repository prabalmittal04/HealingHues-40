interface LLMResponse {
  text: string
  mood?: string
  confidence?: number
}

interface HuggingFaceResponse {
  generated_text: string
}

export class LLMService {
  private apiKey: string
  private baseUrl = "https://api-inference.huggingface.co/models"

  constructor() {
    // Using Hugging Face free tier - no API key required for basic usage
    this.apiKey = ""
  }

  async generateResponse(userMessage: string, context?: string): Promise<LLMResponse> {
    try {
      console.log("Generating LLM response for:", userMessage.substring(0, 50))

      // Create a therapeutic prompt for mental health support
      const therapeuticPrompt = this.createTherapeuticPrompt(userMessage, context)

      // Try Hugging Face API first, fallback to local generation
      try {
        const response = await this.callHuggingFaceAPI(therapeuticPrompt)
        return {
          text: response,
          mood: this.extractMood(userMessage),
          confidence: 0.8,
        }
      } catch (apiError) {
        console.log("API call failed, using local generation:", apiError)
        return this.generateLocalResponse(userMessage)
      }
    } catch (error) {
      console.error("Error generating LLM response:", error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private async callHuggingFaceAPI(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-medium`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
          pad_token_id: 50256,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }

    const data: HuggingFaceResponse[] = await response.json()

    if (data && data[0] && data[0].generated_text) {
      // Clean up the response
      let generatedText = data[0].generated_text

      // Remove the original prompt from the response
      if (generatedText.includes(prompt)) {
        generatedText = generatedText.replace(prompt, "").trim()
      }

      // Clean up any artifacts
      generatedText = generatedText
        .replace(/^[^\w]*/, "") // Remove leading non-word characters
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()

      return generatedText || this.generateLocalResponse("").text
    }

    throw new Error("Invalid API response format")
  }

  private createTherapeuticPrompt(userMessage: string, context?: string): string {
    const systemPrompt = `You are HueBot, a compassionate AI mental health companion. Respond with empathy, understanding, and helpful guidance. Keep responses warm, supportive, and under 150 words.

User context: ${context || "First conversation"}
User message: ${userMessage}

Respond as HueBot with empathy and support:`

    return systemPrompt
  }

  private generateLocalResponse(userMessage: string): LLMResponse {
    console.log("Generating local response for:", userMessage.substring(0, 50))

    const mood = this.extractMood(userMessage)
    const responses = this.getLocalResponses(mood)

    // Select a random response from the appropriate mood category
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      text: selectedResponse,
      mood,
      confidence: 0.6,
    }
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

  private getFallbackResponse(userMessage: string): LLMResponse {
    const fallbackResponses = [
      "I hear you, and I want you to know that I'm here for you. 💙 Sometimes it helps just to know someone is listening.",
      "Thank you for sharing with me. Your feelings and experiences matter. 🤗 How can I best support you right now?",
      "I appreciate you opening up to me. It takes courage to share our thoughts and feelings. 🌟 I'm here to listen without judgment.",
    ]

    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      mood: "supportive",
      confidence: 0.5,
    }
  }
}

// Export singleton instance
export const llmService = new LLMService()
