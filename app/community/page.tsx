"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Users, Shield, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { sendCommunityMessage, getCommunityMessages, updateMessageReactions } from "@/lib/firestore"
import type { CommunityMessage } from "@/lib/firestore"

export default function CommunityPage() {
  const { user, userProfile } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load community messages
    const unsubscribe = getCommunityMessages(setMessages)
    return unsubscribe
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || isLoading) return

    setIsLoading(true)

    try {
      const senderName = userProfile?.displayName || user.displayName || "Anonymous User"
      await sendCommunityMessage(newMessage, senderName)
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }

    setIsLoading(false)
  }

  const handleReaction = async (messageId: string, currentReactions: number) => {
    if (!messageId) return

    try {
      await updateMessageReactions(messageId, currentReactions + 1)
    } catch (error) {
      console.error("Error updating reactions:", error)
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <ProtectedRoute requireEmailVerification>
      <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900">
        <Navigation />

        <main className="max-w-4xl mx-auto p-6 pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-700 dark:text-slate-200 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-green-500" />
                  Community Support
                </CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  You are chatting anonymously with peers in a safe, moderated space
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Chat Messages */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-slate-800/60 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {msg.senderName}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleReaction(msg.id!, msg.reactions || 0)}
                            className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-3 h-3" />
                            <span>{msg.reactions || 0}</span>
                          </button>
                        </div>

                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{msg.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        No messages yet. Be the first to share something supportive!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Input */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <Input
                    placeholder="Share something supportive or ask for help..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-xl"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || isLoading}
                    className="rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Community Guidelines: Be kind, supportive, and respectful. No personal information sharing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
