"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, Clock, Timer } from "lucide-react"
import { collection, getDocs, query, orderBy, limit, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface MusicTrack {
  id: string
  title: string
  artist: string
  duration: number
  category: string
  mood: string
  description: string
  audioUrl: string
  imageUrl: string
  plays: number
  likes: number
  hueCoinsReward: number
  tags: string[]
  isLiked?: boolean
}

interface MusicAlbum {
  id: string
  title: string
  description: string
  category: string
  tracks: MusicTrack[]
  totalDuration: number
  imageUrl: string
  color: string
}

interface SoothingMusicProps {
  onClose: () => void
  userData: any
  onReward: (amount: number) => void
  onProgressUpdate: (progress: any) => void
}

export default function SoothingMusic({ onClose, userData, onReward, onProgressUpdate }: SoothingMusicProps) {
  const [albums, setAlbums] = useState<MusicAlbum[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<MusicAlbum | null>(null)
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [loading, setLoading] = useState(true)
  const [showTimer, setShowTimer] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadMusicData()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = async () => {
      setIsPlaying(false)
      if (currentTrack) {
        onReward(currentTrack.hueCoinsReward)
        // Optionally update track plays in Firestore
        try {
          const trackRef = doc(db, "musicAlbums", selectedAlbum!.id, "tracks", currentTrack.id)
          await updateDoc(trackRef, { plays: currentTrack.plays + 1 })
        } catch (error) {
          console.error("Error updating track plays:", error)
        }
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrack, onReward, selectedAlbum])

  const loadMusicData = async () => {
    try {
      const albumsQuery = query(collection(db, "musicAlbums"), orderBy("title", "asc"), limit(20))
      const albumsSnapshot = await getDocs(albumsQuery)

      if (albumsSnapshot.empty) {
        setAlbums(sampleAlbums)
      } else {
        const albumsData = albumsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MusicAlbum[]
        // For each album, fetch its tracks from a subcollection
        for (const album of albumsData) {
          const tracksQuery = query(collection(db, "musicAlbums", album.id, "tracks"), orderBy("title", "asc"))
          const tracksSnapshot = await getDocs(tracksQuery)
          album.tracks = tracksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MusicTrack[]
        }
        setAlbums(albumsData)
      }
    } catch (error) {
      console.error("Error loading music data:", error)
      setAlbums(sampleAlbums)
    }
    setLoading(false)
  }

  const sampleAlbums: MusicAlbum[] = [
    {
      id: "romantic",
      title: "Romantic Serenades",
      description: "Gentle melodies for love and connection",
      category: "romantic",
      totalDuration: 3600,
      imageUrl: "/placeholder.svg",
      color: "from-pink-500 to-rose-500",
      tracks: [
        {
          id: "romantic-1",
          title: "Moonlight Whispers",
          artist: "Luna Harmony",
          duration: 240,
          category: "romantic",
          mood: "loving",
          description: "Soft piano melodies under starlit skies",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 15420,
          likes: 892,
          hueCoinsReward: 15,
          tags: ["piano", "romantic", "peaceful"],
        },
        {
          id: "romantic-2",
          title: "Hearts in Harmony",
          artist: "Celestial Strings",
          duration: 300,
          category: "romantic",
          mood: "loving",
          description: "String quartet expressing pure love",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 12350,
          likes: 756,
          hueCoinsReward: 18,
          tags: ["strings", "romantic", "classical"],
        },
      ],
    },
    {
      id: "nature",
      title: "Nature's Symphony",
      description: "Sounds of the natural world for deep relaxation",
      category: "nature",
      totalDuration: 4200,
      imageUrl: "/placeholder.svg",
      color: "from-green-500 to-emerald-500",
      tracks: [
        {
          id: "nature-1",
          title: "Forest Rain",
          artist: "Earth Sounds",
          duration: 420,
          category: "nature",
          mood: "peaceful",
          description: "Gentle rainfall in an ancient forest",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 28750,
          likes: 1456,
          hueCoinsReward: 12,
          tags: ["rain", "forest", "nature"],
        },
        {
          id: "nature-2",
          title: "Ocean Waves",
          artist: "Coastal Calm",
          duration: 360,
          category: "nature",
          mood: "peaceful",
          description: "Rhythmic waves on a pristine beach",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 32100,
          likes: 1789,
          hueCoinsReward: 12,
          tags: ["ocean", "waves", "beach"],
        },
      ],
    },
    {
      id: "instrumental-chill",
      title: "Instrumental Chill",
      description: "Relaxing instrumental music for focus and calm",
      category: "instrumental",
      totalDuration: 2700,
      imageUrl: "/placeholder.svg",
      color: "from-blue-500 to-indigo-500",
      tracks: [
        {
          id: "chill-1",
          title: "Floating Dreams",
          artist: "Ambient Collective",
          duration: 270,
          category: "instrumental",
          mood: "relaxed",
          description: "Ethereal soundscapes for deep relaxation",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 18920,
          likes: 1123,
          hueCoinsReward: 20,
          tags: ["ambient", "chill", "instrumental"],
        },
        {
          id: "chill-2",
          title: "Gentle Breeze",
          artist: "Serenity Sounds",
          duration: 315,
          category: "instrumental",
          mood: "peaceful",
          description: "Soft melodies like a gentle summer breeze",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 14560,
          likes: 892,
          hueCoinsReward: 22,
          tags: ["peaceful", "melodic", "soft"],
        },
      ],
    },
    {
      id: "binaural-beats",
      title: "Binaural Beats",
      description: "Scientifically designed frequencies for brainwave entrainment",
      category: "binaural",
      totalDuration: 5400,
      imageUrl: "/placeholder.svg",
      color: "from-purple-500 to-violet-500",
      tracks: [
        {
          id: "binaural-1",
          title: "Alpha Waves 10Hz",
          artist: "Brainwave Lab",
          duration: 600,
          category: "binaural",
          mood: "focused",
          description: "Alpha frequency for relaxed focus and creativity",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 45230,
          likes: 2341,
          hueCoinsReward: 25,
          tags: ["alpha", "focus", "binaural"],
        },
        {
          id: "binaural-2",
          title: "Theta Meditation 6Hz",
          artist: "Neural Sync",
          duration: 480,
          category: "binaural",
          mood: "meditative",
          description: "Theta waves for deep meditation and healing",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 38750,
          likes: 1987,
          hueCoinsReward: 23,
          tags: ["theta", "meditation", "healing"],
        },
      ],
    },
    {
      id: "lofi-ambient",
      title: "Lofi & Ambient",
      description: "Chill lofi beats and ambient textures",
      category: "lofi",
      totalDuration: 3200,
      imageUrl: "/placeholder.svg",
      color: "from-orange-500 to-yellow-500",
      tracks: [
        {
          id: "lofi-1",
          title: "Study Vibes",
          artist: "Lofi Collective",
          duration: 180,
          category: "lofi",
          mood: "focused",
          description: "Perfect background music for studying",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 67890,
          likes: 3456,
          hueCoinsReward: 10,
          tags: ["lofi", "study", "chill"],
        },
        {
          id: "lofi-2",
          title: "Rainy Day Cafe",
          artist: "Urban Chill",
          duration: 220,
          category: "lofi",
          mood: "cozy",
          description: "Cozy cafe atmosphere with gentle rain",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          imageUrl: "/placeholder.svg",
          plays: 54320,
          likes: 2789,
          hueCoinsReward: 12,
          tags: ["cafe", "rain", "cozy"],
        },
      ],
    },
  ]

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl
      audioRef.current.play()
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const startTimer = () => {
    setTimerActive(true)
    setTimeRemaining(timerMinutes * 60)

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false)
          setIsPlaying(false)
          if (audioRef.current) {
            audioRef.current.pause()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    setTimerActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (Number.parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value) / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-cyan-950/95 to-blue-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Soothing Music</h2>
              <p className="text-slate-300">Healing frequencies and calming soundscapes</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTimer(!showTimer)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <Timer className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Timer</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Timer Panel */}
        {showTimer && (
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">Sleep Timer</span>
                </div>
                <select
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Number.parseInt(e.target.value))}
                  disabled={timerActive}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  <option value={15} className="bg-slate-800">
                    15 minutes
                  </option>
                  <option value={30} className="bg-slate-800">
                    30 minutes
                  </option>
                  <option value={45} className="bg-slate-800">
                    45 minutes
                  </option>
                  <option value={60} className="bg-slate-800">
                    1 hour
                  </option>
                  <option value={90} className="bg-slate-800">
                    1.5 hours
                  </option>
                  <option value={120} className="bg-slate-800">
                    2 hours
                  </option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                {timerActive && <div className="text-cyan-400 font-mono">{formatTime(timeRemaining)}</div>}
                <button
                  onClick={timerActive ? stopTimer : startTimer}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timerActive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"
                  }`}
                >
                  {timerActive ? "Stop Timer" : "Start Timer"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex h-[calc(90vh-120px)]">
          {/* Albums Sidebar */}
          <div className="w-1/3 border-r border-white/10 p-6 overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Music Collections</h3>
            <div className="space-y-4">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    selectedAlbum?.id === album.id
                      ? `bg-gradient-to-r ${album.color} border-current`
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${album.color} rounded-lg flex items-center justify-center`}
                    >
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{album.title}</h4>
                      <p className="text-sm text-slate-300">{album.tracks.length} tracks</p>
                      <p className="text-xs text-slate-400">{formatTime(album.totalDuration)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-2 line-clamp-2">{album.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {selectedAlbum ? (
              <>
                {/* Album Header */}
                <div className={`p-6 bg-gradient-to-r ${selectedAlbum.color} text-white`}>
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Music className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedAlbum.title}</h2>
                      <p className="text-lg opacity-90 mb-2">{selectedAlbum.description}</p>
                      <div className="flex items-center space-x-4 text-sm opacity-80">
                        <span>{selectedAlbum.tracks.length} tracks</span>
                        <span>•</span>
                        <span>{formatTime(selectedAlbum.totalDuration)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracks List */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    {selectedAlbum.tracks.map((track, index) => (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          currentTrack?.id === track.id
                            ? "bg-cyan-500/20 border border-cyan-400/30"
                            : "bg-white/5 hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-white">{track.title}</h4>
                          <p className="text-sm text-slate-300">{track.artist}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{track.description}</p>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-slate-300">{formatTime(track.duration)}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span className="text-xs text-slate-400">{track.likes}</span>
                            <span className="text-xs text-yellow-400">+{track.hueCoinsReward} coins</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Music className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Select a Music Collection</h3>
                  <p className="text-slate-300">Choose from our curated albums to start your healing journey</p>
                </div>
              </div>
            )}

            {/* Music Player */}
            {currentTrack && (
              <div className="border-t border-white/10 p-6 bg-white/5">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{currentTrack.title}</h4>
                    <p className="text-slate-300">{currentTrack.artist}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <Heart className="w-5 h-5 text-pink-400" />
                    </button>
                    <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <SkipBack className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={togglePlayPause}
                      className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 text-white" />
                      ) : (
                        <Play className="w-7 h-7 text-white ml-1" />
                      )}
                    </button>
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <SkipForward className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={handleVolumeChange}
                      className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <audio ref={audioRef} />
      </div>
    </div>
  )
}
