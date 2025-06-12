import axios from "axios"

interface HueBotResponse {
  text: string
  mood?: string
  moodEmoji?: string
  affirmation?: string
  activity?: string
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  anxious: "😰",
  excited: "😄",
  tired: "😴",
  calm: "😌",
  confused: "😕",
  grateful: "🙏",
  hopeful: "🌈",
  lonely: "🥺",
  default: "💙",
}

const affirmations = [
  "You are enough just as you are.",
  "This feeling is temporary — you've gotten through tough days before.",
  "Take a deep breath — you're doing your best and that's all anyone can ask.",
  "You are strong, even if you don’t feel like it right now.",
  "There is beauty in this moment, even if it's hard to see.",
]

const suggestions = [
  "Maybe a short walk could help clear your mind?",
  "Try writing down what you're feeling — journaling can ease the weight.",
  "Listen to a calming playlist or one of your favorite songs.",
  "Reach out to a friend — even a short chat can lift your mood.",
  "Try taking a few deep breaths right now, slowly and gently.",
]

export async function hueBotService(message: string, chatHistory: string[]): Promise<HueBotResponse> {
  try {
    const prompt = `
You are HueBot, a supportive, emotionally intelligent, and comforting chatbot helping users manage their moods. The user just said: "${message}".

Respond in a way that:
- Feels personal and understanding
- Includes one comforting affirmation
- If the mood is sad, anxious, lonely, or angry, suggest a gentle, relatable activity
- If the mood is happy, excited, or grateful, celebrate with warmth and curiosity

Tone: compassionate, gentle, and positive.
Format your response in plain text — no markdown or emojis in the middle (except for mood emoji at the end).
Provide the following JSON:

{
  "text": "Your friendly and comforting reply here",
  "mood": "happy/sad/angry/etc",
  "moodEmoji": "😊",
  "affirmation": "You are strong and capable.",
  "activity": "Try stepping outside for a short walk."
}
`

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
      }
    )

    const raw = response.data.choices?.[0]?.message?.content

    if (!raw) throw new Error("No response from AI")

    // Safely parse JSON (basic)
    const parsed = JSON.parse(raw)

    return {
      text: parsed.text || "I'm here with you. Let's talk more about how you're feeling.",
      mood: parsed.mood || "default",
      moodEmoji: parsed.moodEmoji || moodEmojis[parsed.mood?.toLowerCase()] || "💙",
      affirmation: parsed.affirmation || affirmations[Math.floor(Math.random() * affirmations.length)],
      activity: parsed.activity || suggestions[Math.floor(Math.random() * suggestions.length)],
    }
  } catch (err: any) {
    console.error("HueBot OpenRouter error:", err.message)
    return {
      text: "I'm having a little trouble responding right now, but I'm still here with you. 💙",
      mood: "default",
      moodEmoji: "💙",
      affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
      activity: suggestions[Math.floor(Math.random() * suggestions.length)],
    }
  }
}
