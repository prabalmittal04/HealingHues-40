/*import axios from "axios";

interface HueBotResponse {
  text: string;
  mood?: string;
  moodEmoji?: string;
  affirmation?: string;
  activity?: string;
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
};

const affirmations = [
  "You are enough just as you are.",
  "This feeling is temporary — you've gotten through tough days before.",
  "Take a deep breath — you're doing your best and that's all anyone can ask.",
  "You are strong, even if you don’t feel like it right now.",
  "There is beauty in this moment, even if it's hard to see.",
];

const suggestions = [
  "Maybe a short walk could help clear your mind?",
  "Try writing down what you're feeling — journaling can ease the weight.",
  "Listen to a calming playlist or one of your favorite songs.",
  "Reach out to a friend — even a short chat can lift your mood.",
  "Try taking a few deep breaths right now, slowly and gently.",
];

export async function hueBotService(message: string, chatHistory: string[]): Promise<HueBotResponse> {
  try {
    const prompt = `
You are HueBot, a supportive, emotionally intelligent, and comforting chatbot helping users manage their moods. The user just said: "${message}".

Respond in a way that:
- Feels personal and understanding
- Includes one comforting affirmation
- If the mood is sad, anxious, lonely, or angry, suggest a gentle, relatable activity
- If the mood is happy, excited, or grateful, celebrate with warmth and curiosity

Tone: compassionate, gentle, and positive. Respond in 1-2 sentences.
`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // HARDCODED API KEY FOR TESTING ONLY — REMOVE BEFORE DEPLOYMENT
    const huggingFaceApiKey = "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";
    headers["Authorization"] = `Bearer ${huggingFaceApiKey}`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
        },
      },
      { headers }
    );

    const raw = response.data?.[0]?.generated_text;
    if (!raw) throw new Error("No response from Hugging Face");

    const mood = extractMood(message);

    return {
      text: raw.trim(),
      mood,
      moodEmoji: moodEmojis[mood.toLowerCase()] || "💙",
      affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
      activity: suggestions[Math.floor(Math.random() * suggestions.length)],
    };
  } catch (err: any) {
    console.error("HueBot Hugging Face error:", err.message);
    return {
      text: "I'm having a little trouble responding right now, but I'm still here with you. 💙",
      mood: "default",
      moodEmoji: "💙",
      affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
      activity: suggestions[Math.floor(Math.random() * suggestions.length)],
    };
  }
}

function extractMood(message: string): string {
  const lowerMessage = message.toLowerCase();
  const moodKeywords: Record<string, string[]> = {
    happy: ["happy", "joy", "excited", "great", "amazing", "wonderful", "good", "smile", "laugh"],
    sad: ["sad", "depressed", "down", "upset", "cry", "tears", "lonely", "hurt", "pain"],
    anxious: ["anxious", "worried", "nervous", "stress", "panic", "fear", "scared", "overwhelmed"],
    angry: ["angry", "mad", "furious", "frustrated", "irritated", "annoyed", "rage"],
    tired: ["tired", "exhausted", "drained", "weary", "fatigue", "sleepy"],
    calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "zen", "content"],
    confused: ["confused", "lost", "uncertain", "unclear", "puzzled", "mixed up"],
    grateful: ["grateful", "thankful", "blessed", "appreciative", "fortunate"],
    hopeful: ["hopeful", "optimistic", "positive", "confident", "encouraged"],
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return mood;
    }
  }

  return "neutral";
} */
