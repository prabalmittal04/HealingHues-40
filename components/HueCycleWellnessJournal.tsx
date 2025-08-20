"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Heart, Sparkles, Star, Edit3, Save, Search } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import type { HueCycleProfile, HueCycleEntry } from "@/lib/huecycle-service"

interface HueCycleWellnessJournalProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  onEntryUpdate: () => void
}

const JOURNAL_PROMPTS = {
  menstrual: [
    "How is my body feeling during this sacred time of rest? 🌙",
    "What does my soul need most right now for comfort and healing? 💕",
    "How can I honor my body's wisdom during this phase? ✨",
    "What emotions are flowing through me like gentle waves? 🌊",
  ],
  follicular: [
    "What new dreams and ideas are blooming in my heart? 🌱",
    "How is my creative energy awakening and expanding? ✨",
    "What adventures is my spirit calling me toward? 🦋",
    "How can I nurture the seeds of possibility within me? 🌸",
  ],
  ovulation: [
    "How am I feeling in my radiant, powerful energy? 👑",
    "What makes me feel most confident and magnetic today? ✨",
    "How can I share my gifts with the world right now? 🌟",
    "What connections and relationships am I drawn to nurture? 💕",
  ],
  luteal: [
    "What wisdom is my intuition whispering to me? 🔮",
    "How can I create more sacred space for reflection? 🕯️",
    "What patterns in my life need gentle attention? 🍂",
    "How can I practice extra self-compassion right now? 💜",
  ],
}

const GRATITUDE_PROMPTS = [
  "Three things my body did amazingly today... 💪",
  "Moments that made my heart smile... 😊",
  "People who brought light to my day... ✨",
  "Small miracles I noticed today... 🌟",
  "Ways I showed myself love today... 💕",
]

const INTENTION_PROMPTS = [
  "Tomorrow, I want to feel... 🌅",
  "This week, I'm calling in... ✨",
  "I'm ready to release... 🍃",
  "My heart is open to... 💖",
  "I'm grateful for the opportunity to... 🙏",
]

export default function HueCycleWellnessJournal({ profile, entries, onEntryUpdate }: HueCycleWellnessJournalProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [journalEntry, setJournalEntry] = useState("")
  const [gratitudeList, setGratitudeList] = useState(["", "", ""])
  const [intentions, setIntentions] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState("")

  const getCurrentPhase = () => {
    if (!profile.lastPeriodDate) return "follicular"

    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - profile.lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const dayInCycle = (daysSinceLastPeriod % (profile.averageCycleLength || 28)) + 1

    if (dayInCycle <= (profile.averagePeriodLength || 5)) {
      return "menstrual"
    } else if (dayInCycle <= 13) {
      return "follicular"
    } else if (dayInCycle <= 16) {
      return "ovulation"
    } else {
      return "luteal"
    }
  }

  const currentPhase = getCurrentPhase()
  const phasePrompts = JOURNAL_PROMPTS[currentPhase as keyof typeof JOURNAL_PROMPTS]

  const getPhaseEmoji = (phase: string) => {
    const emojis = {
      menstrual: "🌙",
      follicular: "🌱",
      ovulation: "🌺",
      luteal: "🔮",
    }
    return emojis[phase as keyof typeof emojis] || "✨"
  }

  const getPhaseColor = (phase: string) => {
    const colors = {
      menstrual: "from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-800/30",
      follicular: "from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30",
      ovulation: "from-pink-100 to-rose-200 dark:from-pink-900/30 dark:to-rose-800/30",
      luteal: "from-purple-100 to-indigo-200 dark:from-purple-900/30 dark:to-indigo-800/30",
    }
    return colors[phase as keyof typeof colors] || "from-pink-100 to-purple-200"
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mood.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMood = !selectedMood || entry.mood.includes(selectedMood)
    return matchesSearch && matchesMood
  })

  const handleSaveEntry = () => {
    // Here you would save the journal entry
    console.log("Saving journal entry:", {
      prompt: currentPrompt,
      entry: journalEntry,
      gratitude: gratitudeList,
      intentions,
      phase: currentPhase,
    })

    // Reset form
    setJournalEntry("")
    setGratitudeList(["", "", ""])
    setIntentions("")
    setCurrentPrompt("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 font-serif">Sacred Wellness Journal 📖</h2>
          <p className="text-pink-600 dark:text-pink-300">Your divine space for reflection, gratitude, and growth</p>
        </div>
        <Badge
          className={`bg-gradient-to-r ${getPhaseColor(currentPhase)} text-pink-700 dark:text-pink-200 border-pink-300/30 px-4 py-2`}
        >
          {getPhaseEmoji(currentPhase)} {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-pink-200 dark:border-pink-800 rounded-2xl p-2">
          <TabsTrigger
            value="today"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Today's Entry
          </TabsTrigger>
          <TabsTrigger
            value="gratitude"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            <Heart className="w-4 h-4 mr-2" />
            Gratitude
          </TabsTrigger>
          <TabsTrigger
            value="intentions"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            <Star className="w-4 h-4 mr-2" />
            Intentions
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Phase-Specific Prompts */}
          <Card
            className={`bg-gradient-to-br ${getPhaseColor(currentPhase)} border-pink-200 dark:border-pink-800 rounded-2xl`}
          >
            <CardHeader>
              <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                {getPhaseEmoji(currentPhase)}
                <span className="ml-2">
                  Sacred Prompts for Your {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phasePrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPrompt(prompt)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                      currentPrompt === prompt
                        ? "bg-white/80 dark:bg-slate-800/80 shadow-md ring-2 ring-pink-400"
                        : "bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70"
                    }`}
                  >
                    <p className="text-pink-700 dark:text-pink-200 font-medium">{prompt}</p>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Journal Writing Area */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-pink-700 dark:text-pink-200 font-serif flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Sacred Writing Space
              </CardTitle>
              {currentPrompt && (
                <div className="bg-pink-100 dark:bg-pink-900/20 rounded-lg p-3 mt-2">
                  <p className="text-pink-700 dark:text-pink-200 font-medium text-sm">{currentPrompt}</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Let your heart speak... What is flowing through your beautiful soul today? ✨"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[200px] bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-600 text-pink-700 dark:text-pink-200 placeholder:text-pink-500 font-serif text-base leading-relaxed"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveEntry}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Sacred Entry ✨
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gratitude" className="space-y-6">
          <Card className="bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 border-amber-200 dark:border-amber-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-amber-700 dark:text-amber-200 font-serif flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Daily Gratitude Practice 🙏
              </CardTitle>
              <p className="text-amber-600 dark:text-amber-300">
                Cultivate appreciation for the beautiful moments in your day
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gratitude Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GRATITUDE_PROMPTS.map((prompt, index) => (
                  <div key={index} className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4">
                    <p className="text-amber-700 dark:text-amber-200 font-medium text-sm mb-2">{prompt}</p>
                  </div>
                ))}
              </div>

              {/* Gratitude List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-200 font-serif">
                  Three Sacred Gratitudes Today ✨
                </h3>
                {gratitudeList.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-amber-600 dark:text-amber-300">Gratitude {index + 1}</Label>
                    <Input
                      placeholder={`Something beautiful that filled your heart today... 💕`}
                      value={item}
                      onChange={(e) => {
                        const newList = [...gratitudeList]
                        newList[index] = e.target.value
                        setGratitudeList(newList)
                      }}
                      className="bg-white/50 dark:bg-slate-800/50 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-200"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSaveEntry}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Save Gratitude Practice ✨
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intentions" className="space-y-6">
          <Card className="bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/30 dark:to-purple-800/30 border-violet-200 dark:border-violet-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-violet-700 dark:text-violet-200 font-serif flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Sacred Intentions & Dreams 🌟
              </CardTitle>
              <p className="text-violet-600 dark:text-violet-300">Plant seeds of intention for your beautiful future</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Intention Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTENTION_PROMPTS.map((prompt, index) => (
                  <div key={index} className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4">
                    <p className="text-violet-700 dark:text-violet-200 font-medium text-sm">{prompt}</p>
                  </div>
                ))}
              </div>

              {/* Intentions Writing */}
              <div className="space-y-4">
                <Label className="text-violet-700 dark:text-violet-200 font-medium">My Sacred Intentions ✨</Label>
                <Textarea
                  placeholder="What beautiful intentions are you setting for yourself? What dreams are calling to your heart? 🌟"
                  value={intentions}
                  onChange={(e) => setIntentions(e.target.value)}
                  className="min-h-[150px] bg-white/50 dark:bg-slate-800/50 border-violet-300 dark:border-violet-600 text-violet-700 dark:text-violet-200 placeholder:text-violet-500 font-serif"
                />
              </div>

              <Button
                onClick={handleSaveEntry}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full"
              >
                <Star className="w-4 h-4 mr-2" />
                Plant Sacred Intentions ✨
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                  <Input
                    placeholder="Search your sacred entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-600"
                  />
                </div>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-pink-300 dark:border-pink-600 text-pink-700 dark:text-pink-200"
                >
                  <option value="">All Moods</option>
                  <option value="happy">Happy</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="creative">Creative</option>
                  <option value="emotional">Emotional</option>
                  <option value="energetic">Energetic</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Journal History */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredEntries.length === 0 ? (
                <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-200 mb-2 font-serif">
                      Your Sacred Journal Awaits ✨
                    </h3>
                    <p className="text-pink-600 dark:text-pink-300 mb-4">
                      Start writing your beautiful story and watch your wisdom unfold
                    </p>
                    <Button
                      onClick={() => setActiveTab("today")}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Write Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-pink-700 dark:text-pink-200 font-serif">
                              {format(entry.date, "EEEE, MMMM dd, yyyy")}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                              {entry.mood.map((mood) => (
                                <Badge
                                  key={mood}
                                  className="text-xs bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-200 border-pink-300/30"
                                >
                                  {mood} ✨
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-2xl">{entry.energy >= 4 ? "🌟" : entry.energy >= 3 ? "✨" : "🌙"}</div>
                        </div>
                      </CardHeader>
                      {entry.notes && (
                        <CardContent>
                          <p className="text-pink-600 dark:text-pink-300 leading-relaxed font-serif">{entry.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
