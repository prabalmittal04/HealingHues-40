"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Send, Users, Heart, SparklesIcon, ThumbsUp, Clock, Star, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  sendCommunityMessage,
  getCommunityMessages,
  updateMessageReactions,
  type CommunityMessage,
} from "@/lib/firestore"

interface CommunityLoungeProps {
  isVisible: boolean
  onToggle: () => void
}

export default function CommunityLounge({ isVisible, onToggle }: CommunityLoungeProps) {
  const { user } = useAuth()
  const [newPost, setNewPost] = useState("")
  const [selectedMoodTag, setSelectedMoodTag] = useState("grateful")
  const [communityPosts, setCommunityPosts] = useState<CommunityMessage[]>([])
  const [loading, setLoading] = useState(false)

  const moodTags = [
    { name: "grateful", emoji: "🙏", color: "from-green-500 to-emerald-500" },
    { name: "peaceful", emoji: "🕊️", color: "from-blue-500 to-cyan-500" },
    { name: "anxious", emoji: "💙", color: "from-purple-500 to-indigo-500" },
    { name: "proud", emoji: "✨", color: "from-yellow-500 to-orange-500" },
    { name: "hopeful", emoji: "🌈", color: "from-pink-500 to-rose-500" },
    { name: "accomplished", emoji: "🏆", color: "from-violet-500 to-purple-500" },
    { name: "loving", emoji: "💖", color: "from-red-500 to-pink-500" },
    { name: "centered", emoji: "🧘‍♀️", color: "from-teal-500 to-cyan-500" },
  ]

  const reactionEmojis = {
    heart: "💖",
    sparkle: "✨",
    thumbsUp: "👍",
  }

  // Load community messages
  useEffect(() => {
    if (isVisible) {
      const unsubscribe = getCommunityMessages((messages) => {
        setCommunityPosts(messages)
      })
      return unsubscribe
    }
  }, [isVisible])

  const handleSendMessage = async () => {
    if (!newPost.trim() || !user || loading) return

    setLoading(true)
    try {
      await sendCommunityMessage(`${newPost} #${selectedMoodTag}`, user.displayName || "Anonymous Healer")
      setNewPost("")
      setSelectedMoodTag("grateful")
    } catch (error) {
      console.error("Error sending message:", error)
    }
    setLoading(false)
  }

  const handleReaction = async (messageId: string, currentReactions: number) => {
    try {
      await updateMessageReactions(messageId, currentReactions + 1)
    } catch (error) {
      console.error("Error updating reactions:", error)
    }
  }

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case "heart":
        return Heart
      case "sparkle":
        return SparklesIcon
      case "thumbsUp":
        return ThumbsUp
      default:
        return Heart
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Community Wellness Lounge</h2>
              <p className="text-slate-300">Share your healing journey anonymously</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(90vh-120px)]">
          {/* Create Post Section */}
          <div className="p-6 border-b border-white/10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something positive about your wellness journey... How are you feeling today?"
                className="w-full bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none text-lg leading-relaxed"
                rows={3}
                maxLength={500}
              />

              {/* Mood Tags */}
              <div className="mt-4">
                <p className="text-white font-medium mb-3">How are you feeling?</p>
                <div className="flex flex-wrap gap-3">
                  {moodTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => setSelectedMoodTag(tag.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                        selectedMoodTag === tag.name
                          ? `bg-gradient-to-r ${tag.color} text-white shadow-lg border-current`
                          : "bg-white/10 text-slate-300 hover:bg-white/20 border-white/20"
                      }`}
                    >
                      {tag.emoji} {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-slate-400 text-sm">{newPost.length}/500 characters</div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newPost.trim() || newPost.length > 500 || loading}
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sharing..." : "Share Anonymously"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {communityPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
                <p className="text-slate-400">Be the first to share your wellness journey!</p>
              </div>
            ) : (
              communityPosts.map((post) => {
                const moodTag = moodTags.find((tag) => post.message.includes(`#${tag.name}`))

                return (
                  <div
                    key={post.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.senderName[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{post.senderName}</span>
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Star className="w-2 h-2 text-white fill-current" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(post.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mood Tag */}
                      {moodTag && (
                        <div
                          className={`px-4 py-2 rounded-full bg-gradient-to-r ${moodTag.color} text-white text-sm font-medium shadow-lg`}
                        >
                          {moodTag.emoji} {moodTag.name}
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <p className="text-white leading-relaxed mb-6 text-lg">
                      {post.message.replace(/#\w+/g, "").trim()}
                    </p>

                    {/* Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleReaction(post.id!, post.reactions || 0)}
                          className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 border border-white/10"
                        >
                          <Heart className="w-4 h-4 text-purple-300 group-hover:text-purple-200" />
                          <span className="text-slate-300 font-medium">{post.reactions || 0}</span>
                        </button>
                      </div>
                      <button className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
