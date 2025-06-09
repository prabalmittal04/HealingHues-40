"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Heart, Sparkles, Brain, Shield, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { saveChatMessage, getChatMessages } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"
import { hueBotService } from "@/lib/huebot-service"
import type { ChatMessage } from "@/lib/firestore"

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center space-x-2 mb-4"
  >
    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
      <Heart className="w-3 h-3 text-white" />
    </div>
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
    </div>
    <span className="text-xs text-slate-500">HueBot is thinking...</span>
  </motion.div>
)

const WelcomeMessage = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-800 mb-4"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
      <Heart className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Welcome to HueBot! 🌟</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
      I'm your empathetic AI companion, designed to provide personalized mental health support. I'm here to listen,
      understand, and support you through whatever you're experiencing.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      <div className="flex items-center justify-center space-x-2 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
        <Brain className="w-4 h-4 text-blue-500" />
        <span>AI-powered responses</span>
      </div>
      <div className="flex items-center justify-center space-x-2 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
        <Shield className="w-4 h-4 text-green-500" />
        <span>Safe & confidential</span>
      </div>
      <div className="flex items-center justify-center space-x-2 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span>Personalized support</span>
      </div>
    </div>
  </motion.div>
)

export function HueBotChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (user) {
      console.log("Setting up chat messages listener for user:", user.uid)

      const unsubscribe = getChatMessages(user.uid, (loadedMessages) => {
        console.log("Received chat messages:", loadedMessages.length)
        setMessages(loadedMessages)

        // Extract mood history for better context
        const moodHistory = loadedMessages
          .filter((msg) => msg.sender === "user" && msg.mood)
          .map((msg) => msg.mood!)
          .slice(-5)

        setChatHistory(moodHistory)
      })

      return unsubscribe
    }
  }, [user])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isTyping || !user) return

    const userMessageText = inputText.trim()
    setInputText("")
    setError(null)
    setIsTyping(true)

    try {
      console.log("Sending user message:", userMessageText)

      // Create and save user message
      const userMessage: ChatMessage = {
        text: userMessageText,
        sender: "user",
        timestamp: new Date(),
        userId: user.uid,
      }

      await saveChatMessage(user.uid, userMessage)
      console.log("User message saved successfully")

      // Generate bot response using enhanced HueBot service
      console.log("Generating bot response...")
      const hueBotResponse = await hueBotService.generateResponse(userMessageText, chatHistory)
      console.log("HueBot response received:", hueBotResponse)

      // Create bot message with HueBot response
      const botMessage: ChatMessage = {
        text: hueBotResponse.text,
        sender: "bot",
        timestamp: new Date(),
        userId: user.uid,
        mood: hueBotResponse.mood,
        moodEmoji: hueBotResponse.moodEmoji,
        affirmation: hueBotResponse.affirmation,
        activity: hueBotResponse.activity,
      }

      await saveChatMessage(user.uid, botMessage)
      console.log("Bot message saved successfully")

      // Update chat history
      if (hueBotResponse.mood) {
        setChatHistory((prev) => [...prev.slice(-4), hueBotResponse.mood!])
      }
    } catch (error) {
      console.error("Error in chat flow:", error)
      setError("I'm having trouble responding right now. Please try again in a moment.")

      // Send a fallback message
      try {
        const fallbackMessage: ChatMessage = {
          text: "I apologize, but I'm experiencing some technical difficulties right now. I'm still here for you though! 💙 Please try sending your message again, and I'll do my best to respond.",
          sender: "bot",
          timestamp: new Date(),
          userId: user.uid,
          moodEmoji: "💙",
        }

        await saveChatMessage(user.uid, fallbackMessage)
      } catch (fallbackError) {
        console.error("Error sending fallback message:", fallbackError)
      }
    } finally {
      setIsTyping(false)
    }
  }

  const getMoodColor = (mood: string): string => {
    const colors: { [key: string]: string } = {
      happy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      sad: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
      angry: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      anxious: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      excited: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      tired: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      calm: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      confused: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
      grateful: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
      hopeful: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300",
      lonely: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300",
    }
    return colors[mood?.toLowerCase()] || "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
  }

  const formatTime = (timestamp: any) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Error Alert */}
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-1 text-red-700 dark:text-red-300"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
        {messages.length === 0 && <WelcomeMessage />}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.id || index}-${message.timestamp}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                    : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">HueBot</span>
                    {message.moodEmoji && <span className="text-sm">{message.moodEmoji}</span>}
                  </div>
                )}

                <p
                  className={`text-sm leading-relaxed ${
                    message.sender === "user" ? "text-white" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {message.text}
                </p>

                {message.affirmation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20"
                  >
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Affirmation
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{message.affirmation}</p>
                  </motion.div>
                )}

                {message.activity && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <Brain className="w-3 h-3 mr-1" />
                      Suggested Activity
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{message.activity}</p>
                  </motion.div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs opacity-70 ${message.sender === "user" ? "text-white" : "text-slate-500"}`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.mood && <Badge className={`text-xs ${getMoodColor(message.mood)}`}>{message.mood}</Badge>}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind... I'm here to listen 💙"
            className="flex-1 rounded-xl border-slate-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-200"
            size="sm"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>

        <div className="mt-2 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            HueBot uses advanced AI to provide personalized mental health support
          </p>
        </div>
      </div>
    </div>
  )
}
