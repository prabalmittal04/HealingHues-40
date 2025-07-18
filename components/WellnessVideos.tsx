"use client"

import { useState } from "react"
import { X, Play, Clock, Coins, Star, Filter, Search, BookmarkPlus, Share2, Eye } from "lucide-react"

interface WellnessVideosProps {
  onClose: () => void
  onVideoComplete: (coins: number, videoId?: string, videoTitle?: string, duration?: number) => void
  userProgress: any
  onProgressUpdate: (progress: any) => void
}

export default function WellnessVideos({
  onClose,
  onVideoComplete,
  userProgress,
  onProgressUpdate,
}: WellnessVideosProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [watchedVideos, setWatchedVideos] = useState<string[]>(userProgress?.completedVideos || [])
  const [bookmarkedVideos, setBookmarkedVideos] = useState<string[]>([])

  const videoCategories = [
    { id: "all", name: "All Videos", icon: "🎬", count: 24 },
    { id: "mindful-minute", name: "Mindful Minute", icon: "🧘‍♀️", count: 8 },
    { id: "breath-break", name: "Deep Breath Break", icon: "🌬️", count: 6 },
    { id: "mood-hacks", name: "Mood Hacks", icon: "✨", count: 7 },
    { id: "quick-meditation", name: "Quick Meditation", icon: "🕯️", count: 5 },
    { id: "energy-boost", name: "Energy Boost", icon: "⚡", count: 4 },
    { id: "sleep-prep", name: "Sleep Prep", icon: "🌙", count: 3 },
  ]

  const wellnessVideos = [
    {
      id: "1",
      title: "3-Minute Morning Mindfulness",
      description: "Start your day with intention and cosmic awareness",
      category: "mindful-minute",
      duration: "3:24",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Luna Starlight",
      difficulty: "Beginner",
      views: 12500,
      rating: 4.9,
      coins: 15,
      tags: ["morning", "mindfulness", "intention"],
      unlockLocation: "mindfulness-meadow",
    },
    {
      id: "2",
      title: "Box Breathing for Instant Calm",
      description: "Master the 4-4-4-4 breathing technique in 2 minutes",
      category: "breath-break",
      duration: "2:15",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Dr. Breath Master",
      difficulty: "Beginner",
      views: 8900,
      rating: 4.8,
      coins: 12,
      tags: ["breathing", "anxiety", "quick"],
      unlockLocation: "calm-cloud",
    },
    {
      id: "3",
      title: "Mood Shift in 60 Seconds",
      description: "Transform negative emotions with this powerful technique",
      category: "mood-hacks",
      duration: "1:45",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Cosmic Healer",
      difficulty: "All Levels",
      views: 15600,
      rating: 4.7,
      coins: 18,
      tags: ["emotions", "transformation", "quick"],
      unlockLocation: "serenity-summit",
    },
    {
      id: "4",
      title: "Gratitude Micro-Meditation",
      description: "Cultivate appreciation in just 90 seconds",
      category: "quick-meditation",
      duration: "1:32",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Grateful Guide",
      difficulty: "Beginner",
      views: 7800,
      rating: 4.9,
      coins: 10,
      tags: ["gratitude", "appreciation", "micro"],
      unlockLocation: "thankful-temple",
    },
    {
      id: "5",
      title: "Energy Reset Power Pose",
      description: "Boost your energy with cosmic body positioning",
      category: "energy-boost",
      duration: "2:48",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Power Posture Pro",
      difficulty: "All Levels",
      views: 11200,
      rating: 4.6,
      coins: 16,
      tags: ["energy", "posture", "confidence"],
      unlockLocation: "vitality-valley",
    },
    {
      id: "6",
      title: "Bedtime Brain Dump",
      description: "Clear your mind for peaceful sleep in 3 minutes",
      category: "sleep-prep",
      duration: "3:12",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Sleep Sage",
      difficulty: "Beginner",
      views: 9400,
      rating: 4.8,
      coins: 14,
      tags: ["sleep", "relaxation", "mind-clearing"],
      unlockLocation: "dream-dimension",
    },
    {
      id: "7",
      title: "Stress Melting Visualization",
      description: "Dissolve tension with guided cosmic imagery",
      category: "mindful-minute",
      duration: "2:55",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Visualization Voyager",
      difficulty: "Intermediate",
      views: 13700,
      rating: 4.9,
      coins: 20,
      tags: ["stress", "visualization", "relaxation"],
      unlockLocation: "tranquil-temple",
    },
    {
      id: "8",
      title: "Confidence Breathing Boost",
      description: "Build inner strength with powerful breath patterns",
      category: "breath-break",
      duration: "2:30",
      thumbnail: "/placeholder.svg?height=200&width=300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      instructor: "Confidence Coach",
      difficulty: "Intermediate",
      views: 10800,
      rating: 4.7,
      coins: 17,
      tags: ["confidence", "strength", "empowerment"],
      unlockLocation: "courage-canyon",
    },
  ]

  const filteredVideos = wellnessVideos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleVideoComplete = (video: any) => {
    if (!watchedVideos.includes(video.id)) {
      setWatchedVideos((prev) => [...prev, video.id])
      
      // Convert duration string to number (e.g., "3:24" to 204 seconds)
      const durationParts = video.duration.split(':')
      const durationSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1] || '0')
      
      onVideoComplete(video.coins, video.id, video.title, durationSeconds)

      // Update user progress (except coins/XP, which are now handled by parent)
      const newProgress = {
        ...userProgress,
        completedVideos: [...(userProgress.completedVideos || []), video.id],
      }

      // Check if video unlocks new location
      if (video.unlockLocation && !userProgress.unlockedLocations?.includes(video.unlockLocation)) {
        newProgress.unlockedLocations = [...(userProgress.unlockedLocations || []), video.unlockLocation]
        // Show unlock notification
        setTimeout(() => {
          alert(
            `🎉 New location unlocked: ${video.unlockLocation.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}!`,
          )
        }, 1000)
      }

      onProgressUpdate(newProgress)
    }
    setSelectedVideo(null)
  }

  const toggleBookmark = (videoId: string) => {
    setBookmarkedVideos((prev) => (prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400"
      case "Intermediate":
        return "text-yellow-400"
      case "Advanced":
        return "text-red-400"
      default:
        return "text-blue-400"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Enhanced Header */}
        <div className="relative p-8 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                Wellness Video Library
              </h2>
              <p className="text-slate-300 text-lg mb-4">Bite-sized healing content for instant transformation</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">{wellnessVideos.length} Videos Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">{watchedVideos.length} Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    {wellnessVideos.reduce((sum, video) => sum + video.coins, 0)} Total Coins Available
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-8 border-b border-purple-500/20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos, tags, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-purple-300" />
              <span className="text-white font-medium">Categories:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {videoCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border-purple-400/50"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-medium">
                    {video.duration}
                  </div>

                  {/* Watched Badge */}
                  {watchedVideos.includes(video.id) && (
                    <div className="absolute top-3 left-3 bg-green-500 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-bold flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Watched</span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-sm leading-tight flex-1">{video.title}</h3>
                    <button
                      onClick={() => toggleBookmark(video.id)}
                      className={`ml-2 p-1 rounded-lg transition-colors ${
                        bookmarkedVideos.includes(video.id)
                          ? "text-yellow-400 bg-yellow-400/20"
                          : "text-slate-400 hover:text-yellow-400"
                      }`}
                    >
                      <BookmarkPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">{video.description}</p>

                  {/* Instructor and Stats */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-purple-300 text-xs font-medium">{video.instructor}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-xs">{video.rating}</span>
                      </div>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-slate-400 text-xs">{video.views.toLocaleString()} views</span>
                    </div>
                  </div>

                  {/* Difficulty and Tags */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-white/10 text-slate-300 text-xs px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Coins Reward */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">+{video.coins}</span>
                      </div>
                      <span className="text-yellow-300 text-xs font-medium">Watch + Earn</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                    >
                      {watchedVideos.includes(video.id) ? "Watch Again" : "Watch Now"}
                    </button>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Share2 className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl w-full max-w-4xl border border-purple-500/30 shadow-2xl overflow-hidden">
              {/* Video Player Header */}
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedVideo.title}</h3>
                    <p className="text-slate-300">{selectedVideo.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black relative">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => console.log("Video loaded successfully")}
                  onError={(e) => {
                    console.error("Video player error:", e)
                    // Show a fallback message
                    const container = e.currentTarget.parentElement
                    if (container) {
                      container.innerHTML = `
                        <div class="flex items-center justify-center h-full bg-gradient-to-br from-purple-900 to-indigo-900">
                          <div class="text-center text-white">
                            <div class="text-4xl mb-4">🎬</div>
                            <h3 class="text-xl font-bold mb-2">Video Unavailable</h3>
                            <p class="text-slate-300">This video is currently not available for playback.</p>
                            <p class="text-sm text-slate-400 mt-2">You can still complete the session to earn coins!</p>
                          </div>
                        </div>
                      `
                    }
                  }}
                />
              </div>

              {/* Video Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-lg">+{selectedVideo.coins} Hue Coins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">{selectedVideo.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVideoComplete(selectedVideo)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                  >
                    {watchedVideos.includes(selectedVideo.id) ? "Mark as Rewatched" : "Complete & Earn Coins"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
