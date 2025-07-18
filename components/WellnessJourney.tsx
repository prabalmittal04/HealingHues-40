"use client"

import { useState } from "react"
import { X, MapPin, Star, Lock, Unlock, Trophy, Sparkles, Mountain, Trees, Cloud, Waves } from "lucide-react"

interface WellnessJourneyProps {
  onClose: () => void
  userProgress: any
  onProgressUpdate: (progress: any) => void
}

export default function WellnessJourney({ onClose, userProgress, onProgressUpdate }: WellnessJourneyProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [showLocationDetails, setShowLocationDetails] = useState(false)

  const journeyLocations = [
    {
      id: "peaceful-pond",
      name: "Peaceful Pond",
      description: "Your wellness journey begins at this tranquil starting point",
      icon: Waves,
      position: { x: 10, y: 80 },
      unlockRequirement: 1, // Level
      experienceReward: 0,
      affirmation: "I am ready to begin my healing journey",
      color: "from-blue-400 to-cyan-500",
      backgroundImage: "🏞️",
      activities: ["Initial mood assessment", "Welcome meditation"],
      rewards: ["Beginner's Badge", "10 Hue Coins"],
      isStarting: true,
    },
    {
      id: "mindfulness-meadow",
      name: "Mindfulness Meadow",
      description: "A serene meadow where awareness blooms like wildflowers",
      icon: Trees,
      position: { x: 25, y: 65 },
      unlockRequirement: 2, // Level 2
      experienceReward: 50,
      affirmation: "I am present and aware in this moment",
      color: "from-green-400 to-emerald-500",
      backgroundImage: "🌸",
      activities: ["Mindful breathing", "Nature meditation", "Awareness exercises"],
      rewards: ["Mindfulness Badge", "25 Hue Coins", "Flower Crown Avatar"],
      milestoneMessage: "You've discovered the beauty of present-moment awareness!",
    },
    {
      id: "calm-cloud",
      name: "Calm Cloud",
      description: "Float above your worries in this peaceful sky sanctuary",
      icon: Cloud,
      position: { x: 45, y: 45 },
      unlockRequirement: 5, // Level 5
      experienceReward: 75,
      affirmation: "I release my worries and embrace inner peace",
      color: "from-sky-400 to-blue-500",
      backgroundImage: "☁️",
      activities: ["Cloud meditation", "Worry release ritual", "Sky gazing"],
      rewards: ["Cloud Walker Badge", "40 Hue Coins", "Sky Theme"],
      milestoneMessage: "You've risen above the storms of anxiety!",
    },
    {
      id: "serenity-summit",
      name: "Serenity Summit",
      description: "Reach new heights of inner peace and emotional balance",
      icon: Mountain,
      position: { x: 60, y: 30 },
      unlockRequirement: 10, // Level 10
      experienceReward: 100,
      affirmation: "I have the strength to overcome any challenge",
      color: "from-purple-400 to-indigo-500",
      backgroundImage: "🏔️",
      activities: ["Peak meditation", "Strength visualization", "Goal setting"],
      rewards: ["Summit Master Badge", "60 Hue Coins", "Mountain Avatar"],
      milestoneMessage: "You've reached the summit of emotional resilience!",
    },
    {
      id: "thankful-temple",
      name: "Thankful Temple",
      description: "A sacred space dedicated to gratitude and appreciation",
      icon: Star,
      position: { x: 75, y: 50 },
      unlockRequirement: 20, // Level 20
      experienceReward: 125,
      affirmation: "I am grateful for all the abundance in my life",
      color: "from-yellow-400 to-orange-500",
      backgroundImage: "🏛️",
      activities: ["Gratitude meditation", "Appreciation journal", "Blessing ceremony"],
      rewards: ["Gratitude Guardian Badge", "80 Hue Coins", "Golden Aura"],
      milestoneMessage: "Your heart overflows with gratitude and joy!",
    },
    {
      id: "vitality-valley",
      name: "Vitality Valley",
      description: "Discover renewed energy and zest for life in this vibrant valley",
      icon: Sparkles,
      position: { x: 85, y: 70 },
      unlockRequirement: 40, // Level 40
      experienceReward: 150,
      affirmation: "I am filled with vibrant energy and enthusiasm",
      color: "from-red-400 to-pink-500",
      backgroundImage: "🌺",
      activities: ["Energy meditation", "Vitality visualization", "Power poses"],
      rewards: ["Energy Master Badge", "100 Hue Coins", "Vitality Boost"],
      milestoneMessage: "You've unlocked your inner source of unlimited energy!",
    },
    {
      id: "dream-dimension",
      name: "Dream Dimension",
      description: "Enter the mystical realm where healing happens during sleep",
      icon: Star,
      position: { x: 90, y: 20 },
      unlockRequirement: 50, // Level 50
      experienceReward: 200,
      affirmation: "My dreams guide me toward healing and wisdom",
      color: "from-indigo-400 to-purple-600",
      backgroundImage: "🌌",
      activities: ["Dream meditation", "Sleep preparation", "Lucid dreaming"],
      rewards: ["Dream Walker Badge", "150 Hue Coins", "Cosmic Theme"],
      milestoneMessage: "You've mastered the art of healing through dreams!",
    },
    {
      id: "enlightenment-peak",
      name: "Enlightenment Peak",
      description: "The ultimate destination of your wellness journey",
      icon: Trophy,
      position: { x: 95, y: 10 },
      unlockRequirement: 70, // Level 70
      experienceReward: 500,
      affirmation: "I am whole, healed, and at peace with myself",
      color: "from-gold-400 to-yellow-600",
      backgroundImage: "✨",
      activities: ["Mastery meditation", "Wisdom sharing", "Journey reflection"],
      rewards: ["Enlightenment Master Badge", "500 Hue Coins", "Legendary Status"],
      milestoneMessage: "You have achieved true wellness mastery!",
      isFinal: true,
    },
  ]

  // Update isLocationUnlocked to use level
  const isLocationUnlocked = (location: any) => {
    return (userProgress.level || 1) >= location.unlockRequirement
  }

  const isLocationCompleted = (location: any) => {
    return (userProgress.unlockedLocations || []).includes(location.id)
  }

  const handleLocationClick = (location: any) => {
    if (isLocationUnlocked(location)) {
      setSelectedLocation(location)
      setShowLocationDetails(true)
    }
  }

  const completeLocation = (location: any) => {
    if (!isLocationCompleted(location)) {
      // Calculate new XP
      const newTotalExperience = userProgress.totalExperience + location.experienceReward;
      // Optionally, calculate new level (example: 1 level per 100 XP)
      const newLevel = userProgress.level !== undefined ? Math.floor(newTotalExperience / 100) + 1 : undefined;
      // Optionally, add hueCoins if rewards include coins (parse from rewards array or set a value)
      let newHueCoins = userProgress.hueCoins;
      // Try to extract coin reward from location.rewards
      const coinReward = location.rewards.find((r: string) => r.includes('Hue Coin'));
      if (coinReward) {
        const match = coinReward.match(/(\d+)/);
        if (match) newHueCoins = (userProgress.hueCoins || 0) + parseInt(match[1], 10);
      }
      const newProgress = {
        ...userProgress,
        unlockedLocations: [...(userProgress.unlockedLocations || []), location.id],
        totalExperience: newTotalExperience,
        currentLocation: location.id,
        ...(newLevel !== undefined ? { level: newLevel } : {}),
        ...(newHueCoins !== undefined ? { hueCoins: newHueCoins } : {}),
      };
      onProgressUpdate(newProgress);
      // Show milestone message
      if (location.milestoneMessage) {
        setTimeout(() => {
          alert(`🎉 ${location.milestoneMessage}`)
        }, 500)
      }
    }
    setShowLocationDetails(false);
  }

  const getProgressPercentage = () => {
    const maxExperience = Math.max(...journeyLocations.map((loc) => loc.unlockRequirement))
    return Math.min((userProgress.totalExperience / maxExperience) * 100, 100)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="relative p-8 border-b border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                Wellness Journey Map
              </h2>
              <p className="text-slate-300 text-lg mb-4">Navigate your path to cosmic healing and enlightenment</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">
                    Current:{" "}
                    {journeyLocations.find((loc) => loc.id === userProgress.currentLocation)?.name || "Peaceful Pond"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">{userProgress.totalExperience} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">
                    {(userProgress.unlockedLocations || []).length}/{journeyLocations.length} Locations
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-96">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Journey Progress</span>
                  <span className="text-slate-400">{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
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

        {/* Journey Map */}
        <div className="relative p-8 h-[70vh] overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>

          {/* Journey Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d={`M ${journeyLocations.map((loc) => `${loc.position.x}% ${loc.position.y}%`).join(" L ")}`}
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>

          {/* Location Markers */}
          {journeyLocations.map((location, index) => {
            const IconComponent = location.icon
            const unlocked = isLocationUnlocked(location)
            const completed = isLocationCompleted(location)
            const isCurrent = userProgress.currentLocation === location.id

            return (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${location.position.x}%`, top: `${location.position.y}%` }}
                onClick={() => handleLocationClick(location)}
              >
                {/* Location Marker */}
                <div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                    completed
                      ? `bg-gradient-to-br ${location.color} shadow-2xl animate-pulse`
                      : unlocked
                        ? `bg-gradient-to-br ${location.color} opacity-80 hover:opacity-100`
                        : "bg-slate-600 opacity-40"
                  } ${isCurrent ? "ring-4 ring-white/50 animate-bounce" : ""}`}
                >
                  {unlocked ? (
                    <IconComponent className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-slate-400" />
                  )}

                  {/* Completion Badge */}
                  {completed && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Unlock className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Current Location Indicator */}
                  {isCurrent && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Location Name */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      unlocked ? "bg-white/20 text-white" : "bg-slate-600/50 text-slate-400"
                    }`}
                  >
                    {location.name}
                  </div>
                  {!unlocked && (
                    <div className="text-xs text-slate-500 mt-1">Requires Level {location.unlockRequirement}</div>
                  )}
                </div>

                {/* Background Emoji */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10 pointer-events-none">
                  {location.backgroundImage}
                </div>
              </div>
            )
          })}
        </div>

        {/* Location Details Modal */}
        {showLocationDetails && selectedLocation && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl w-full max-w-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
              {/* Location Header */}
              <div className={`relative p-8 bg-gradient-to-r ${selectedLocation.color}/20`}>
                <div className="absolute inset-0 opacity-20 text-8xl flex items-center justify-center">
                  {selectedLocation.backgroundImage}
                </div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{selectedLocation.name}</h3>
                    <p className="text-slate-300 text-lg mb-4">{selectedLocation.description}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white font-medium italic">"{selectedLocation.affirmation}"</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLocationDetails(false)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Location Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activities */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span>Activities</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedLocation.activities.map((activity: string, index: number) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                          <p className="text-white text-sm">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span>Rewards</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedLocation.rewards.map((reward: string, index: number) => {
                        // Find the minimum unlockRequirement for this badge across all locations
                        let badgeUnlockXP = 0;
                        if (reward.toLowerCase().includes('badge')) {
                          badgeUnlockXP = Math.min(
                            ...journeyLocations
                              .filter(loc => loc.rewards.some((r: string) => r === reward))
                              .map(loc => loc.unlockRequirement)
                          );
                        }
                        // Badge is unlocked if user XP >= badgeUnlockXP
                        const badgeUnlocked = reward.toLowerCase().includes('badge')
                          ? userProgress.totalExperience >= badgeUnlockXP
                          : userProgress.totalExperience >= selectedLocation.unlockRequirement;
                        return (
                          <div
                            key={index}
                            className={`bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30 flex items-center space-x-2 ${badgeUnlocked ? 'ring-2 ring-yellow-400' : 'opacity-50'}`}
                          >
                            {reward.toLowerCase().includes('badge') && (
                              badgeUnlocked ? <Unlock className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-gray-400" />
                            )}
                            <p className={`text-yellow-300 text-sm font-medium ${badgeUnlocked ? '' : 'line-through'}`}>{reward}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Experience Info */}
                <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Experience Reward</p>
                      <p className="text-white font-bold text-lg">+{selectedLocation.experienceReward} XP</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Unlock Requirement</p>
                      <p className="text-white font-bold text-lg">Level {selectedLocation.unlockRequirement}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                  {isLocationCompleted(selectedLocation) ? (
                    <div className="bg-green-500/20 text-green-400 py-3 px-6 rounded-xl font-bold border border-green-400/30">
                      ✅ Location Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => completeLocation(selectedLocation)}
                      className={`bg-gradient-to-r ${selectedLocation.color} text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      Complete Location
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
