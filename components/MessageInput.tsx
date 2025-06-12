import { analyzeSentiment, generateEmpathetic } from "@/lib/sentiment-analysis"
import { db } from "@/lib/firebase" // assuming Firebase config is here
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useState } from "react"

export default function MessageInput({ userId }: { userId: string }) {
  const [text, setText] = useState("")

  const handleSend = async () => {
    if (!text.trim()) return

    const userMessage = {
      text,
      sender: "user",
      createdAt: serverTimestamp(),
    }

    await addDoc(collection(db, "users", userId, "messages"), userMessage)

    // 💡 INSTANT response generation:
    const sentiment = analyzeSentiment(text)
    const response = generateEmpathetic(sentiment)

    const botMessage = {
      text: `${response.emoji} ${response.message}\n\n🌟 *Affirmation:* "${response.affirmation}"\n🎯 *Try this:* ${response.activity}`,
      sender: "HueBot",
      createdAt: serverTimestamp(),
    }

    await addDoc(collection(db, "users", userId, "messages"), botMessage)

    setText("")
  }

  return (
    <div className="flex gap-2 p-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-4 py-2 flex-1 rounded"
        placeholder="How are you feeling today?"
      />
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  )
}
