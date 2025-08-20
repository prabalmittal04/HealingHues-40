"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Heart, Brain, Sparkles, Star, Play } from "lucide-react"
import { motion } from "framer-motion"

interface HealthResource {
  id: string
  title: string
  category: string
  type: "article" | "video" | "guide" | "meditation" | "course"
  description: string
  author: string
  readTime: string
  rating: number
  tags: string[]
  featured: boolean
  premium: boolean
  image: string
  content?: string
}

const healthResources: HealthResource[] = [
  {
    id: "1",
    title: "Understanding Your Sacred Menstrual Cycle",
    category: "Cycle Education",
    type: "article",
    description:
      "A comprehensive guide to understanding the four phases of your menstrual cycle and how to honor each one.",
    author: "Dr. Sarah Moon",
    readTime: "8 min read",
    rating: 4.9,
    tags: ["cycle phases", "hormones", "self-care"],
    featured: true,
    premium: false,
    image: "/placeholder.svg?height=200&width=300&text=Menstrual+Cycle",
  },
  {
    id: "2",
    title: "Nutrition for Hormonal Balance",
    category: "Nutrition",
    type: "guide",
    description: "Discover foods that support hormonal harmony throughout your cycle and boost your natural energy.",
    author: "Luna Wellness",
    readTime: "12 min read",
    rating: 4.8,
    tags: ["nutrition", "hormones", "energy"],
    featured: true,
    premium: false,
    image: "/placeholder.svg?height=200&width=300&text=Nutrition",
  },
  {
    id: "3",
    title: "Moon Cycle Meditation Journey",
    category: "Mindfulness",
    type: "meditation",
    description: "A guided meditation to connect with your inner wisdom and embrace your feminine cycles.",
    author: "Goddess Meditations",
    readTime: "15 min",
    rating: 4.9,
    tags: ["meditation", "mindfulness", "feminine energy"],
    featured: false,
    premium: true,
    image: "/placeholder.svg?height=200&width=300&text=Meditation",
  },
  {
    id: "4",
    title: "Natural Remedies for Period Pain",
    category: "Natural Health",
    type: "article",
    description: "Gentle, natural approaches to managing menstrual discomfort and supporting your body's healing.",
    author: "Herbal Goddess",
    readTime: "10 min read",
    rating: 4.7,
    tags: ["natural remedies", "pain relief", "herbs"],
    featured: false,
    premium: false,
    image: "/placeholder.svg?height=200&width=300&text=Natural+Remedies",
  },
  {
    id: "5",
    title: "Yoga Flow for Each Cycle Phase",
    category: "Movement",
    type: "video",
    description: "Adaptive yoga sequences designed to support your body through each phase of your menstrual cycle.",
    author: "Sacred Flow Yoga",
    readTime: "25 min",
    rating: 4.8,
    tags: ["yoga", "movement", "cycle support"],
    featured: true,
    premium: true,
    image: "/placeholder.svg?height=200&width=300&text=Yoga",
  },
  {
    id: "6",
    title: "Emotional Wellness Through Your Cycle",
    category: "Mental Health",
    type: "course",
    description:
      "A comprehensive course on understanding and supporting your emotional well-being throughout your cycle.",
    author: "Dr. Moonbeam Therapy",
    readTime: "2 hours",
    rating: 4.9,
    tags: ["emotions", "mental health", "self-care"],
    featured: false,
    premium: true,
    image: "/placeholder.svg?height=200&width=300&text=Emotional+Wellness",
  },
]

const categories = ["All", "Cycle Education", "Nutrition", "Mindfulness", "Natural Health", "Movement", "Mental Health"]

export default function HueCycleHealthLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const filteredResources = healthResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesPremium = !showPremiumOnly || resource.premium
    return matchesSearch && matchesCategory && matchesPremium
  })

  const featuredResources = healthResources.filter((resource) => resource.featured)

  const getTypeIcon = (type: string) => {
    const icons = {
      article: BookOpen,
      video: Play,
      guide: Star,
      meditation: Heart,
      course: Brain,
    }
    return icons[type as keyof typeof icons] || BookOpen
  }

  const getTypeColor = (type: string) => {
    const colors = {
      article: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      video: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
      guide: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
      meditation: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      course: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-200 font-serif">Sacred Health Library 📚</h2>
          <p className="text-pink-600 dark:text-pink-300">Trusted wisdom for your feminine wellness journey</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-pink-500/20 text-pink-700 dark:text-pink-200 border-pink-300/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {healthResources.length} Resources
          </Badge>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full">
            <Star className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
              <Input
                placeholder="Search for wellness wisdom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-600"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-pink-300 dark:border-pink-600 text-pink-700 dark:text-pink-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button
                variant={showPremiumOnly ? "default" : "outline"}
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className={
                  showPremiumOnly
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "bg-white/50 dark:bg-slate-800/50 border-pink-300 dark:border-pink-600 text-pink-700 dark:text-pink-200"
                }
              >
                <Star className="w-4 h-4 mr-2" />
                Premium Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Resources */}
      {!searchTerm && selectedCategory === "All" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-200 font-serif flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Featured Sacred Wisdom ✨
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl hover:shadow-lg">
                  {/* Card content here */}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filtered Resources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-200 font-serif flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          All Sacred Wisdom 📚
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-pink-200 dark:border-pink-700 rounded-2xl hover:shadow-lg">
                {/* Card content here */}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
