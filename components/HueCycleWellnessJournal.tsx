"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Heart, Plus, Edit, Trash2, Save, X, Search, Calendar, Lock, Unlock } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import type { HueCycleProfile, HueCycleEntry } from "@/lib/huecycle-service"

interface HueCycleWellnessJournalProps {
  profile: HueCycleProfile
  entries: HueCycleEntry[]
  onEntryUpdate: () => void
}

interface JournalEntry {
  id: string
  date: Date
  prompt: string
  reflection: string
  mood: string[]
  gratitude: string[]
  intentions: string[]
  isPrivate: boolean
  tags: string[]
}

const JOURNAL_PROMPTS = [
  "How is my body feeling today, and what is it trying to tell me?",
  "What emotions am I experiencing, and how can I honor them?",
  "What am I most grateful for in this moment?",
  "How can I show myself extra love and care today?",
  "What patterns am I noticing in my cycle and mood?",
  "What boundaries do I need to set for my wellbeing?",
  "How has my relationship with my body evolved?",
  "What wisdom is my cycle teaching me right now?",
  "What would I tell my younger self about embracing femininity?",
  "How can I celebrate my body's incredible capabilities today?",
]

const MOOD_EMOJIS = {
  peaceful: "😌",
  grateful: "🙏",
  empowered: "💪",
  nurturing: "🤗",
  creative: "🎨",
  intuitive: "🔮",
  radiant: "✨",
  grounded: "🌱",
  flowing: "🌊",
  blooming: "🌸",
  reflective: "🤔",
  tender: "💕",
}

const JOURNAL_TAGS = [
  "self-love",
  "body-wisdom",
  "emotional-healing",
  "cycle-awareness",
  "gratitude",
  "intentions",
  "boundaries",
  "creativity",
  "intuition",
  "growth",
  "reflection",
  "celebration",
]

export default function HueCycleWellnessJournal({ profile, entries, onEntryUpdate }: HueCycleWellnessJournalProps) {
  const { user } = useAuth()
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [showJournalDialog, setShowJournalDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [journalForm, setJournalForm] = useState({
    prompt: "",
    reflection: "",
    mood: [] as string[],
    gratitude: [] as string[],
    intentions: [] as string[],
    isPrivate: true,
    tags: [] as string[],
  })

  useEffect(() => {
    loadJournalEntries()
  }, [user?.uid])

  const loadJournalEntries = () => {
    if (!user?.uid) return

    // Load from localStorage
    const storageKey = `huecycle_journal_${user.uid}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      const entriesWithDates = parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }))
      setJournalEntries(entriesWithDates)
    } else {
      // Generate sample entries
      const sampleEntries: JournalEntry[] = [
        {
          id: "journal_1",
          date: new Date(),
          prompt: "How is my body feeling today, and what is it trying to tell me?",
          reflection:
            "Today I'm feeling so grateful for my body's wisdom. I noticed some gentle cramping, which reminded me to slow down and practice self-care. My body is asking for rest, warm tea, and gentle movement. I'm learning to listen more deeply to these signals. 💕",
          mood: ["grateful", "reflective", "tender"],
          gratitude: ["My body's wisdom", "Cozy moments", "Self-awareness"],
          intentions: ["Practice gentle self-care", "Listen to my body", "Honor my needs"],
          isPrivate: true,
          tags: ["body-wisdom", "self-love", "gratitude"],
        },
        {
          id: "journal_2",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          prompt: "What emotions am I experiencing, and how can I honor them?",
          reflection:
            "I've been feeling more emotional lately, and instead of judging myself, I'm choosing to see this as a beautiful part of my cycle. These feelings are valid and deserve space. I'm honoring them by journaling, taking warm baths, and being extra gentle with myself. 🌙",
          mood: ["emotional", "nurturing", "peaceful"],
          gratitude: ["Emotional depth", "Safe spaces", "Self-compassion"],
          intentions: ["Embrace all emotions", "Create safe spaces", "Practice self-compassion"],
          isPrivate: true,
          tags: ["emotional-healing", "cycle-awareness", "self-love"],
        },
      ]
      setJournalEntries(sampleEntries)
      saveJournalEntries(sampleEntries)
    }
  }

  const saveJournalEntries = (entries: JournalEntry[]) => {
    if (!user?.uid) return
    const storageKey = `huecycle_journal_${user.uid}`
    localStorage.setItem(storageKey, JSON.stringify(entries))
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM dd, yyyy")
  }

  const handleNewEntry = () => {
    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]
    setJournalForm({
      prompt: randomPrompt,
      reflection: "",
      mood: [],
      gratitude: [],
      intentions: [],
      isPrivate: true,
      tags: [],
    })
    setEditingEntry(null)
    setShowJournalDialog(true)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setJournalForm({
      prompt: entry.prompt,
      reflection: entry.reflection,
      mood: entry.mood,
      gratitude: entry.gratitude,
      intentions: entry.intentions,
      isPrivate: entry.isPrivate,
      tags: entry.tags,
    })
    setEditingEntry(entry)
    setShowJournalDialog(true)
  }

  const handleSubmit = async () => {
    if (!user?.uid || !journalForm.reflection.trim()) return

    setIsSubmitting(true)
    try {
      const newEntry: JournalEntry = {
        id: editingEntry?.id || `journal_${Date.now()}`,
        date: editingEntry?.date || new Date(),
        prompt: journalForm.prompt,
        reflection: journalForm.reflection,
        mood: journalForm.mood,
        gratitude: journalForm.gratitude,
        intentions: journalForm.intentions,
        isPrivate: journalForm.isPrivate,
        tags: journalForm.tags,
      }

      let updatedEntries
      if (editingEntry) {
        updatedEntries = journalEntries.map((entry) => (entry.id === editingEntry.id ? newEntry : entry))
      } else {
        updatedEntries = [newEntry, ...journalEntries]
      }

      setJournalEntries(updatedEntries)
      saveJournalEntries(updatedEntries)
      setShowJournalDialog(false)
      setEditingEntry(null)
    } catch (error) {
      console.error("Error saving journal entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = journalEntries.filter((entry) => entry.id !== entryId)
    setJournalEntries(updatedEntries)
    saveJournalEntries(updatedEntries)
  }

  const handleArrayToggle = (field: "mood" | "gratitude" | "intentions" | "tags", value: string) => {
    const currentArray = journalForm[field]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    setJournalForm((prev) => ({
      ...prev,
      [field]: newArray,
    }))
  }

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.reflection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTag = selectedTag === "all" || entry.tags.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-300 mb-2">Wellness Journal 🌸</h2>
          <p className="text-rose-500 dark:text-rose-400">
            Your sacred space for reflection, gratitude, and self-discovery
          </p>
        </div>
        <Button
          onClick={handleNewEntry}
          className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-full px-6 py-3 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Reflection
        </Button>
      </div>

      {/* Inspiration Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800 rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">
              "Your journal is a sacred conversation with your soul"
            </h3>
            <p className="text-purple-500 dark:text-purple-400">
              This is your private sanctuary to explore your thoughts, celebrate your journey, and nurture your
              relationship with yourself. Write freely, love deeply. 💜
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your reflections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-rose-200 dark:border-rose-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full sm:w-48 bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 rounded-2xl">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reflections</SelectItem>
            {JOURNAL_TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag.replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredEntries.length === 0 ? (
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-300 mb-2">
                  {searchTerm || selectedTag !== "all"
                    ? "No reflections match your search"
                    : "Begin your wellness journey"}
                </h3>
                <p className="text-rose-500 dark:text-rose-400 mb-6">
                  {searchTerm || selectedTag !== "all"
                    ? "Try adjusting your search or filters"
                    : "Your first journal entry is waiting to be written. Let your heart guide your words."}
                </p>
                {!searchTerm && selectedTag === "all" && (
                  <Button
                    onClick={handleNewEntry}
                    className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-full px-6 py-3"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Start Writing
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                          📝
                        </div>
                        <div>
                          <h3 className="font-semibold text-rose-600 dark:text-rose-300">{getDateLabel(entry.date)}</h3>
                          <div className="flex items-center space-x-2 text-sm text-rose-500 dark:text-rose-400">
                            <Calendar className="w-3 h-3" />
                            <span>{format(entry.date, "EEEE, MMM dd")}</span>
                            {entry.isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEntry(entry)}
                          className="text-rose-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-full"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-rose-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Prompt */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
                      <p className="text-sm font-medium text-rose-600 dark:text-rose-300 mb-1">Reflection Prompt:</p>
                      <p className="text-rose-700 dark:text-rose-200 italic">"{entry.prompt}"</p>
                    </div>

                    {/* Reflection */}
                    <div className="mb-4">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{entry.reflection}</p>
                    </div>

                    {/* Mood Tags */}
                    {entry.mood && entry.mood.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-rose-500 dark:text-rose-400 mb-2">Mood:</div>
                        <div className="flex flex-wrap gap-2">
                          {entry.mood.map((mood) => (
                            <Badge
                              key={mood}
                              variant="outline"
                              className="text-xs bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 border-pink-300 dark:border-pink-700 rounded-full"
                            >
                              {MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]} {mood}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gratitude */}
                    {entry.gratitude && entry.gratitude.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-rose-500 dark:text-rose-400 mb-2">Grateful for:</div>
                        <div className="flex flex-wrap gap-2">
                          {entry.gratitude.map((item, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700 rounded-full"
                            >
                              🙏 {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Intentions */}
                    {entry.intentions && entry.intentions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-rose-500 dark:text-rose-400 mb-2">Intentions:</div>
                        <div className="flex flex-wrap gap-2">
                          {entry.intentions.map((intention, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-700 rounded-full"
                            >
                              ✨ {intention}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 rounded-full"
                            >
                              #{tag.replace("-", "")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-rose-200 dark:border-rose-800 text-xs text-rose-400 dark:text-rose-500">
                      <span>Written with love</span>
                      <span>{format(entry.date, "h:mm a")}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Journal Dialog */}
      <Dialog open={showJournalDialog} onOpenChange={setShowJournalDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-rose-600 dark:text-rose-300 text-xl">
              <BookOpen className="w-5 h-5 mr-2" />
              {editingEntry ? "Edit Reflection" : "New Wellness Reflection"} 🌸
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Prompt Selection */}
            <div className="space-y-2">
              <Label className="text-rose-600 dark:text-rose-300 font-medium">Reflection Prompt</Label>
              <Select
                value={journalForm.prompt}
                onValueChange={(value) => setJournalForm((prev) => ({ ...prev, prompt: value }))}
              >
                <SelectTrigger className="bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 rounded-xl">
                  <SelectValue placeholder="Choose a prompt to guide your reflection..." />
                </SelectTrigger>
                <SelectContent>
                  {JOURNAL_PROMPTS.map((prompt, index) => (
                    <SelectItem key={index} value={prompt}>
                      {prompt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reflection */}
            <div className="space-y-2">
              <Label htmlFor="reflection" className="text-rose-600 dark:text-rose-300 font-medium">
                Your Reflection 💭
              </Label>
              <Textarea
                id="reflection"
                placeholder="Let your heart speak... Write freely about your thoughts, feelings, and experiences. This is your sacred space. 💕"
                value={journalForm.reflection}
                onChange={(e) => setJournalForm((prev) => ({ ...prev, reflection: e.target.value }))}
                className="bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 rounded-xl text-slate-700 dark:text-slate-300 min-h-[200px]"
                rows={8}
              />
            </div>

            {/* Mood Selection */}
            <div className="space-y-3">
              <Label className="text-rose-600 dark:text-rose-300 font-medium">How are you feeling? ✨</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => (
                  <Button
                    key={mood}
                    type="button"
                    variant={journalForm.mood.includes(mood) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleArrayToggle("mood", mood)}
                    className={`${
                      journalForm.mood.includes(mood)
                        ? "bg-gradient-to-r from-pink-400 to-rose-500 text-white"
                        : "bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20"
                    } rounded-xl text-xs flex items-center justify-center py-3`}
                  >
                    <span className="mr-1">{emoji}</span>
                    <span className="capitalize">{mood}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Gratitude */}
            <div className="space-y-2">
              <Label className="text-rose-600 dark:text-rose-300 font-medium">What are you grateful for? 🙏</Label>
              <div className="space-y-2">
                {journalForm.gratitude.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newGratitude = [...journalForm.gratitude]
                        newGratitude[index] = e.target.value
                        setJournalForm((prev) => ({ ...prev, gratitude: newGratitude }))
                      }}
                      className="flex-1 px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-rose-200 dark:border-rose-800 rounded-xl text-slate-700 dark:text-slate-300"
                      placeholder="Something you're grateful for..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newGratitude = journalForm.gratitude.filter((_, i) => i !== index)
                        setJournalForm((prev) => ({ ...prev, gratitude: newGratitude }))
                      }}
                      className="text-rose-400 hover:text-red-500 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setJournalForm((prev) => ({ ...prev, gratitude: [...prev.gratitude, ""] }))}
                  className="bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gratitude
                </Button>
              </div>
            </div>

            {/* Intentions */}
            <div className="space-y-2">
              <Label className="text-rose-600 dark:text-rose-300 font-medium">Set your intentions ✨</Label>
              <div className="space-y-2">
                {journalForm.intentions.map((intention, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={intention}
                      onChange={(e) => {
                        const newIntentions = [...journalForm.intentions]
                        newIntentions[index] = e.target.value
                        setJournalForm((prev) => ({ ...prev, intentions: newIntentions }))
                      }}
                      className="flex-1 px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-rose-200 dark:border-rose-800 rounded-xl text-slate-700 dark:text-slate-300"
                      placeholder="An intention for yourself..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newIntentions = journalForm.intentions.filter((_, i) => i !== index)
                        setJournalForm((prev) => ({ ...prev, intentions: newIntentions }))
                      }}
                      className="text-rose-400 hover:text-red-500 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setJournalForm((prev) => ({ ...prev, intentions: [...prev.intentions, ""] }))}
                  className="bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Intention
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-rose-600 dark:text-rose-300 font-medium">Tags 🏷️</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {JOURNAL_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={journalForm.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleArrayToggle("tags", tag)}
                    className={`${
                      journalForm.tags.includes(tag)
                        ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white"
                        : "bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20"
                    } rounded-xl text-xs py-2`}
                  >
                    {tag.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                {journalForm.isPrivate ? (
                  <Lock className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                ) : (
                  <Unlock className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                )}
                <div>
                  <h4 className="font-medium text-purple-600 dark:text-purple-300">Privacy Setting</h4>
                  <p className="text-sm text-purple-500 dark:text-purple-400">
                    {journalForm.isPrivate ? "This reflection is private" : "This reflection can be shared"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setJournalForm((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))}
                className="bg-white/70 dark:bg-slate-800/70 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl"
              >
                {journalForm.isPrivate ? "Make Shareable" : "Make Private"}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-rose-200 dark:border-rose-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJournalDialog(false)}
                className="bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !journalForm.reflection.trim()}
                className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-xl px-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingEntry ? "Update Reflection" : "Save Reflection"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
