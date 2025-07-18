"use client"

import { useState, useEffect } from "react"
import { Coins, Sparkles, Trophy, Target, Gift, X, Crown, Star, Award, TrendingUp } from "lucide-react"

interface HueCoinsWalletProps {
  balance: number
  level: number
  experiencePoints: number
}

export default function HueCoinsWallet({ balance, level, experiencePoints }: HueCoinsWalletProps) {
  const [showVault, setShowVault] = useState(false)

  const earnedHistory = [
    { activity: "Completed Deep Meditation Session", amount: 25, time: "1 hour ago", type: "meditation" },
    { activity: "Joined Anxiety Support Group", amount: 30, time: "3 hours ago", type: "therapy" },
    { activity: "Daily Mood Check-in Streak (7 days)", amount: 50, time: "5 hours ago", type: "streak" },
    { activity: "Helped Community Member", amount: 15, time: "8 hours ago", type: "community" },
    { activity: "Breathing Exercise Mastery", amount: 20, time: "12 hours ago", type: "breathing" },
    { activity: "Nutrition Goal Achievement", amount: 35, time: "1 day ago", type: "nutrition" },
    { activity: "Weekly Wellness Challenge", amount: 100, time: "2 days ago", type: "challenge" },
    { activity: "Mindfulness Music Session", amount: 18, time: "3 days ago", type: "music" },
  ]

  const badges = [
    {
      name: "Meditation Master",
      icon: "🧘‍♀️",
      unlocked: balance >= 1000,
      requirement: 1000,
      description: "Complete 50 meditation sessions",
      rarity: "common",
    },
    {
      name: "Mood Tracker Pro",
      icon: "📊",
      unlocked: balance >= 5000,
      requirement: 5000,
      description: "Log mood for 30 consecutive days",
      rarity: "uncommon",
    },
    {
      name: "Community Guardian",
      icon: "🤝",
      unlocked: balance >= 7000,
      requirement: 7000,
      description: "Help 100 community members",
      rarity: "rare",
    },
    {
      name: "Wellness Sage",
      icon: "⚡",
      unlocked: balance >= 10000,
      requirement: 10000,
      description: "Achieve master level in all activities",
      rarity: "epic",
    },
    {
      name: "Cosmic Healer",
      icon: "✨",
      unlocked: balance >= 30000,
      requirement: 30000,
      description: "Transcend to ultimate wellness",
      rarity: "legendary",
    },
    {
      name: "Therapy Champion",
      icon: "🏆",
      unlocked: balance >= 50000,
      requirement: 50000,
      description: "Complete 25 therapy sessions",
      rarity: "common",
    },
  ]

  const dailyChallenges = [
    {
      task: "Complete morning meditation",
      progress: 1,
      total: 1,
      reward: 25,
      difficulty: "easy",
      timeLeft: "18h 32m",
    },
    {
      task: "Log mood 3 times today",
      progress: 2,
      total: 3,
      reward: 20,
      difficulty: "medium",
      timeLeft: "18h 32m",
    },
    {
      task: "Join a live therapy session",
      progress: 0,
      total: 1,
      reward: 40,
      difficulty: "hard",
      timeLeft: "18h 32m",
    },
    {
      task: "Share positive affirmation",
      progress: 1,
      total: 1,
      reward: 15,
      difficulty: "easy",
      timeLeft: "18h 32m",
    },
  ]

  const rewardStore = [
    {
      name: "Cosmic Aurora Theme",
      cost: 500,
      icon: "🌌",
      category: "theme",
      description: "Beautiful space-themed interface",
    },
    {
      name: "Premium Meditation Avatar",
      cost: 2000,
      icon: "🧘‍♀️",
      category: "avatar",
      description: "Exclusive animated meditation avatar",
    },
    {
      name: "Advanced Mood Analytics",
      cost: 5000,
      icon: "💎",
      category: "collectible",
      description: "Virtual crystal collection for meditation",
    },
    {
      name: "Personal Wellness Coach",
      cost: 10000,
      icon: "👨‍⚕️",
      category: "service",
      description: "1-on-1 coaching session with expert",
    },
    {
      name: "Exclusive Soundscape Library",
      cost: 20000,
      icon: "🎵",
      category: "content",
      description: "Premium healing frequencies collection",
    },
    {
      name: "Mindfulness Masterclass",
      cost: 35000,
      icon: "🎓",
      category: "education",
      description: "Advanced mindfulness techniques course",
    },
    {
      name: "Golden Lotus Badge",
      cost: 50000,
      icon: "🪷",
      category: "badge",
      description: "Ultra-rare achievement badge",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "uncommon":
        return "from-green-400 to-green-600"
      case "rare":
        return "from-blue-400 to-blue-600"
      case "epic":
        return "from-purple-400 to-purple-600"
      case "legendary":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "theme":
        return "🎨"
      case "avatar":
        return "👤"
      case "feature":
        return "⚙️"
      case "collectible":
        return "💎"
      case "service":
        return "🤝"
      case "content":
        return "📚"
      case "education":
        return "🎓"
      case "badge":
        return "🏅"
      default:
        return "🎁"
    }
  }

  return (
    <>
      <button
        onClick={() => setShowVault(true)}
        className="relative group flex items-center space-x-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-yellow-400/30"
      >
        <div className="relative">
          <Coins className="w-7 h-7 animate-spin group-hover:animate-bounce" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-200 rounded-full animate-pulse"></div>
        </div>
        <div className="text-left">
          <div className="text-sm font-medium opacity-90">Hue Coins</div>
          <div className="text-xl font-bold">{balance.toLocaleString()}</div>
          <div className="text-xs opacity-75">
            Level {level} • {experiencePoints} XP
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <div className="text-xs font-medium mt-1">Vault</div>
        </div>
      </button>

      {/* Enhanced Hue Coins Vault Modal */}
      {showVault && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-purple-950/95 backdrop-blur-xl rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-purple-500/30 shadow-2xl">
            {/* Enhanced Header */}
            <div className="relative p-8 border-b border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl">
                      <Coins className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      Hue Coins Vault
                    </h2>
                    <p className="text-slate-300 text-lg">Balance: {balance.toLocaleString()} coins</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Level {level}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">{experiencePoints}/1000 XP</span>
                      </div>
                    </div>
                    {/* XP Progress Bar */}
                    <div className="w-64 bg-slate-700 rounded-full h-2 mt-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(experiencePoints / 1000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowVault(false)}
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Enhanced Earned History */}
                <div className="xl:col-span-1">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span>Recent Earnings</span>
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {earnedHistory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm leading-relaxed">{item.activity}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <p className="text-slate-400 text-xs">{item.time}</p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  item.type === "streak"
                                    ? "bg-purple-500/20 text-purple-300"
                                    : item.type === "challenge"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-400 font-bold ml-4">
                            <Coins className="w-4 h-4" />
                            <span>+{item.amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Badges Section */}
                <div className="xl:col-span-1">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <span>Achievement Badges</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className={`relative p-4 rounded-xl border transition-all duration-500 hover:scale-105 ${
                          badge.unlocked
                            ? `bg-gradient-to-br ${getRarityColor(badge.rarity)}/20 border-current shadow-lg`
                            : "bg-white/5 border-white/10 opacity-60"
                        }`}
                      >
                        {badge.unlocked && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="text-center">
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <p className="text-white text-sm font-bold mb-1">{badge.name}</p>
                          <p className="text-slate-400 text-xs mb-2">{badge.description}</p>
                          <div className="flex items-center justify-center space-x-1">
                            <Coins className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-medium">
                              {badge.unlocked ? "Unlocked" : `${badge.requirement} coins`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Daily Challenges */}
                <div className="xl:col-span-1">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <span>Daily Challenges</span>
                  </h3>
                  <div className="space-y-4">
                    {dailyChallenges.map((challenge, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm mb-1">{challenge.task}</p>
                            <div className="flex items-center space-x-3">
                              <span className={`text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty.toUpperCase()}
                              </span>
                              <span className="text-slate-400 text-xs">⏰ {challenge.timeLeft}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-yellow-400 font-bold flex items-center space-x-1">
                              <Coins className="w-3 h-3" />
                              <span className="text-sm">{challenge.reward}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-slate-300">
                            Progress: {challenge.progress}/{challenge.total}
                          </span>
                          <span className="text-slate-300">
                            {Math.round((challenge.progress / challenge.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Reward Store */}
                <div className="xl:col-span-3 mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <span>Cosmic Reward Store</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {rewardStore.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                      >
                        <div className="text-4xl mb-3">{item.icon}</div>
                        <div className="text-xs text-slate-400 mb-2 flex items-center justify-center space-x-1">
                          <span>{getCategoryIcon(item.category)}</span>
                          <span className="uppercase tracking-wide">{item.category}</span>
                        </div>
                        <p className="text-white font-bold text-sm mb-2">{item.name}</p>
                        <p className="text-slate-400 text-xs mb-4 leading-relaxed">{item.description}</p>
                        <div className="flex items-center justify-center space-x-1 text-yellow-400 text-sm font-bold mb-4">
                          <Coins className="w-4 h-4" />
                          <span>{item.cost.toLocaleString()}</span>
                        </div>
                        <button
                          className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                            balance >= item.cost
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
                              : "bg-slate-700 text-slate-400 cursor-not-allowed"
                          }`}
                          disabled={balance < item.cost}
                        >
                          {balance >= item.cost ? "Purchase" : "Insufficient Coins"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
