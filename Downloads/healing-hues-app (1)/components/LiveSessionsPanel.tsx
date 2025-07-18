"use client"

import { useState, useEffect } from "react"
import { X, Users, Video, Music, Brain, Filter, Plus, Clock, Star, Zap } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { getLiveSessions, updateLiveSessionParticipants, endLiveSession, type LiveSession } from "@/lib/firestore"
import CreateSessionPanel from "./CreateSessionPanel"

interface LiveSessionsPanelProps {
  onClose: () => void
}

export default function LiveSessionsPanel({ onClose }: LiveSessionsPanelProps) {
  const { user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for all live sessions (not filtered by user)
  useEffect(() => {
    const unsubscribe = getLiveSessions((sessions) => {
      setLiveSessions(sessions)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleJoinSession = async (session: LiveSession) => {
    if (session.currentParticipants < session.maxParticipants) {
      try {
        await updateLiveSessionParticipants(session.id!, session.currentParticipants + 1)
        console.log("Joined session:", session.title)
      } catch (error) {
        console.error("Error joining session:", error)
        alert("Failed to join session. Please try again.")
      }
    }
  }

  const handleEndSession = async (session: LiveSession) => {
    if (session.userId === user?.uid) {
      try {
        await endLiveSession(session.id!)
        console.log("Ended session:", session.title)
      } catch (error) {
        console.error("Error ending session:", error)
        alert("Failed to end session. Please try again.")
      }
    }
  }

  // Helper function to format time ago
  const getTimeAgo = (startedAt: Date | any) => {
    const now = new Date()
    let sessionDate: Date
    if (startedAt?.toDate) sessionDate = startedAt.toDate()
    else if (startedAt instanceof Date) sessionDate = startedAt
    else sessionDate = new Date(startedAt)
    const diffInMinutes = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60))
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading live sessions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl relative">
        {/* Header */}
        <div className="relative p-8 border-b border-purple-500/20 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Live Healing Sessions
            </h2>
            <p className="text-slate-300 text-lg">Join or create transformative wellness experiences</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Floating Create Session Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="fixed bottom-10 right-10 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Session</span>
        </button>

        {/* Main Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {liveSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">No live sessions available right now.<br/>Be the first to create one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-4 mb-2">
                    {/* Activity Icon */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                      {/* You can add more icons based on session.activityType */}
                      <span className="text-white text-2xl">
                        {session.activityType === "meditation" && <Brain className="w-7 h-7" />}
                        {session.activityType === "therapy" && <Users className="w-7 h-7" />}
                        {session.activityType === "music" && <Music className="w-7 h-7" />}
                        {session.activityType === "breathing" && <Zap className="w-7 h-7" />}
                        {session.activityType === "nutrition" && <Star className="w-7 h-7" />}
                        {/* Default icon */}
                        {!["meditation","therapy","music","breathing","nutrition"].includes(session.activityType) && <Video className="w-7 h-7" />}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-white">{session.title}</span>
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">LIVE</span>
                      </div>
                      <div className="text-slate-300 text-sm">{session.description}</div>
                      <div className="text-xs text-slate-400 mt-1">Hosted by <span className="font-medium text-white">{session.hostName}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 font-medium">{session.currentParticipants}/{session.maxParticipants}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{session.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-slate-400">{getTimeAgo(session.startedAt)}</span>
                      </div>
                    </div>
                    {/* Join/End buttons */}
                    {session.userId === user?.uid ? (
                      <button
                        onClick={() => handleEndSession(session)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-all"
                      >
                        End Session
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-all"
                        disabled={session.currentParticipants >= session.maxParticipants}
                      >
                        {session.currentParticipants >= session.maxParticipants ? "Full" : "Join"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Session Modal/Drawer */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <CreateSessionPanel onClose={() => setShowCreateForm(false)} onActivitySelect={() => {}} />
          </div>
        )}
      </div>
    </div>
  )
}
