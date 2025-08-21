"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Heart, Brain, Flower2, Shield, Sparkles, AlertCircle, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Article {
  id: string
  title: string
  description: string
  content: string
  category: "basics" | "conditions" | "wellness" | "myths" | "fertility" | "mental-health"
  readTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  featured: boolean
  rating: number
  lastUpdated: Date
}

const HEALTH_ARTICLES: Article[] = [
  {
    id: "cycle-basics",
    title: "Understanding Your Beautiful Cycle 🌙",
    description: "A gentle introduction to the four phases of your menstrual cycle and what makes each one special.",
    content: `Your menstrual cycle is like a beautiful dance that your body performs every month. It's a sign of health, vitality, and the incredible power of your feminine body.

## The Four Sacred Phases

### 🌑 Menstrual Phase (Days 1-5)
This is your moon time - a period of release and renewal. Your body is shedding the lining it created, making space for new possibilities. It's natural to feel more introspective and need extra rest.

**What's happening:** Hormone levels are low, giving you a chance to reset and reflect.
**How to honor it:** Rest deeply, use heat for comfort, practice gentle movement, and be extra kind to yourself.

### 🌱 Follicular Phase (Days 1-13)
Your fresh beginning phase! As your period ends, your energy starts to build. This is when your body begins preparing for potential ovulation.

**What's happening:** Estrogen is rising, bringing increased energy and optimism.
**How to honor it:** Start new projects, plan adventures, try new activities, and embrace your growing vitality.

### 🌸 Ovulatory Phase (Days 14-16)
Your radiant bloom time! This is when you're most fertile and often feeling your most confident and attractive.

**What's happening:** Estrogen peaks and luteinizing hormone surges, triggering ovulation.
**How to honor it:** Schedule important meetings, enjoy social activities, express yourself creatively, and celebrate your peak energy.

### 🍂 Luteal Phase (Days 17-28)
Your gentle reflection phase. If pregnancy doesn't occur, your body begins preparing for the next cycle. You might feel more sensitive and introspective.

**What's happening:** Progesterone rises then falls, which can affect mood and energy.
**How to honor it:** Practice self-care, set boundaries, eat comforting foods, and prepare for your next moon time.

## Remember, Beautiful Soul
Every cycle is unique, and yours might not follow the "textbook" timeline. That's completely normal! Your cycle can be anywhere from 21-35 days and still be healthy. The key is getting to know YOUR unique rhythm and honoring what your body needs in each phase.`,
    category: "basics",
    readTime: 5,
    difficulty: "beginner",
    tags: ["cycle-phases", "hormones", "self-care", "basics"],
    featured: true,
    rating: 4.9,
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pcos-guide",
    title: "PCOS: Your Journey to Understanding 💪",
    description: "A compassionate guide to Polycystic Ovary Syndrome, including symptoms, management, and self-care.",
    content: `PCOS (Polycystic Ovary Syndrome) affects about 1 in 10 women of reproductive age. If you have PCOS, know that you're not alone, and there are many ways to manage it with love and care.

## What is PCOS?
PCOS is a hormonal condition that can affect your ovaries, metabolism, and overall health. Despite its name, not everyone with PCOS has cysts on their ovaries.

## Common Signs (You Don't Need All of These)
- Irregular or missing periods
- Excess hair growth (hirsutism)
- Acne or oily skin
- Weight gain or difficulty losing weight
- Hair thinning on the scalp
- Skin darkening (acanthosis nigricans)
- Difficulty getting pregnant

## Gentle Management Strategies

### 🍃 Nutrition That Loves You Back
- Focus on whole, unprocessed foods
- Include plenty of fiber-rich vegetables
- Choose complex carbohydrates over simple sugars
- Add healthy fats like avocados and nuts
- Consider anti-inflammatory foods like berries and leafy greens

### 💪 Movement That Feels Good
- Find activities you genuinely enjoy
- Mix cardio with strength training
- Try yoga or pilates for stress relief
- Even 30 minutes of walking can make a difference
- Listen to your body and rest when needed

### 🧘‍♀️ Stress Management
- Practice meditation or deep breathing
- Prioritize quality sleep (7-9 hours)
- Set healthy boundaries
- Consider counseling or support groups
- Engage in hobbies that bring you joy

## Medical Support
Work with healthcare providers who understand PCOS and treat you with respect. Treatment might include:
- Hormonal birth control to regulate cycles
- Metformin for insulin resistance
- Anti-androgen medications for excess hair growth
- Fertility treatments if you're trying to conceive

## Remember, Warrior
Having PCOS doesn't define you. You are strong, beautiful, and capable of living a full, healthy life. Be patient with yourself as you learn what works for your unique body.`,
    category: "conditions",
    readTime: 8,
    difficulty: "intermediate",
    tags: ["PCOS", "hormones", "management", "self-care"],
    featured: true,
    rating: 4.8,
    lastUpdated: new Date("2024-01-10"),
  },
  {
    id: "period-myths",
    title: "Busting Period Myths with Love 🚫",
    description: "Let's lovingly debunk common myths about periods and replace them with empowering truths.",
    content: `It's time to clear up some myths about periods that have been passed down for generations. You deserve to know the truth about your beautiful body!

## Myth vs. Truth

### ❌ Myth: "You can't exercise during your period"
✅ **Truth:** Exercise can actually help reduce cramps and improve your mood! Listen to your body and adjust intensity as needed. Gentle yoga, walking, or swimming can be especially soothing.

### ❌ Myth: "PMS is all in your head"
✅ **Truth:** PMS is very real and caused by hormonal fluctuations. Your feelings and physical symptoms are valid. There are many effective ways to manage PMS symptoms.

### ❌ Myth: "Periods should be extremely painful"
✅ **Truth:** While some discomfort is normal, severe pain that interferes with daily life isn't. If you experience debilitating cramps, please talk to a healthcare provider.

### ❌ Myth: "You lose a lot of blood during your period"
✅ **Truth:** The average person loses only 2-3 tablespoons of blood during their entire period. Most of what you see is other fluids and tissue.

### ❌ Myth: "Irregular periods always mean something is wrong"
✅ **Truth:** Many factors can affect cycle regularity, including stress, weight changes, travel, and life transitions. However, consistently irregular periods should be discussed with a healthcare provider.

### ❌ Myth: "You can't get pregnant during your period"
✅ **Truth:** While less likely, pregnancy can occur if you have sex during your period, especially if you have shorter cycles or longer periods.

### ❌ Myth: "Tampons can get lost inside you"
✅ **Truth:** Your vagina is a closed space - tampons cannot get "lost." If you can't find the string, you can safely remove it with clean fingers or see a healthcare provider.

### ❌ Myth: "Periods sync up when women live together"
✅ **Truth:** Scientific studies haven't found strong evidence for menstrual synchrony. It's more likely a coincidence when cycles seem to align.

## Empowering Truths to Remember
- Your period is a sign of health and vitality
- Every person's cycle is unique and beautiful
- You deserve comfort and care during your period
- There's no shame in talking about periods
- You have the right to accurate information about your body

## Creating Your Own Truth
Don't let outdated myths dictate how you feel about your period. You are the expert on your own body. Trust your experiences, seek reliable information, and surround yourself with people who support your journey to understanding your beautiful cycle.`,
    category: "myths",
    readTime: 6,
    difficulty: "beginner",
    tags: ["myths", "education", "empowerment", "facts"],
    featured: false,
    rating: 4.7,
    lastUpdated: new Date("2024-01-08"),
  },
  {
    id: "fertility-awareness",
    title: "Fertility Awareness: Your Body's Wisdom 🌸",
    description: "Learn to read your body's natural fertility signs with confidence and grace.",
    content: `Fertility awareness is about understanding your body's natural signals. Whether you're trying to conceive, avoid pregnancy, or simply want to understand your cycle better, this knowledge is empowering.

## Your Body's Fertility Signals

### 🌡️ Basal Body Temperature (BBT)
Your resting body temperature rises slightly after ovulation due to progesterone.

**How to track:**
- Take your temperature first thing in the morning, before getting out of bed
- Use a basal body thermometer for accuracy
- Track for at least 3 cycles to see patterns
- Look for a sustained temperature rise of 0.2-0.4°F

### 💧 Cervical Mucus
Your cervical mucus changes throughout your cycle, becoming more fertile around ovulation.

**What to look for:**
- **Dry days:** Little to no mucus (less fertile)
- **Sticky/tacky:** Thick, paste-like (low fertility)
- **Creamy:** Lotion-like consistency (increasing fertility)
- **Egg white:** Clear, stretchy, slippery (most fertile)

### 🎯 Cervical Position
Your cervix changes position and texture throughout your cycle.

**During fertile times, your cervix becomes:**
- Higher in the vagina
- Softer (like your lips)
- More open

## Fertility Awareness Methods (FAM)

### The Sympto-Thermal Method
Combines BBT, cervical mucus, and cervical position for the most accurate picture of fertility.

### The Billings Method
Focuses primarily on cervical mucus observations.

### The Rhythm Method
Uses calendar calculations based on past cycles (less reliable than other methods).

## Using FAM for Different Goals

### 🤱 Trying to Conceive
- Have intercourse during your fertile window
- Focus on days with fertile cervical mucus
- Time intercourse around ovulation
- Track for several cycles to identify patterns

### 🛡️ Natural Birth Control
- Avoid unprotected intercourse during fertile times
- Use barrier methods or abstain during fertile window
- Requires dedication and accurate tracking
- Consider working with a FAM instructor

### 📊 Understanding Your Body
- Track patterns in mood, energy, and symptoms
- Predict when your period will arrive
- Identify potential health concerns
- Celebrate your body's incredible intelligence

## Getting Started

1. **Choose your tracking method** (app, chart, or journal)
2. **Start observing** your body's signals daily
3. **Be patient** - it takes 2-3 cycles to see clear patterns
4. **Consider education** - books, classes, or working with a certified instructor
5. **Trust the process** - your body has incredible wisdom

## Important Notes
- FAM requires daily attention and accurate record-keeping
- Illness, stress, travel, and medications can affect fertility signs
- If using for birth control, consider the learning curve and your comfort with the method
- Always consult healthcare providers for personalized advice

## Celebrating Your Wisdom
Learning fertility awareness is like learning a new language - the language of your own body. Be patient with yourself as you develop this skill. Every observation teaches you something valuable about your unique cycle and helps you make informed decisions about your reproductive health.`,
    category: "fertility",
    readTime: 10,
    difficulty: "intermediate",
    tags: ["fertility", "natural-family-planning", "body-awareness", "conception"],
    featured: true,
    rating: 4.6,
    lastUpdated: new Date("2024-01-12"),
  },
  {
    id: "mental-health-cycle",
    title: "Your Cycle & Mental Wellness 🧠💕",
    description: "Understanding the beautiful connection between your menstrual cycle and emotional well-being.",
    content: `Your menstrual cycle and mental health are intimately connected. Understanding this relationship can help you navigate your emotions with more compassion and wisdom.

## The Hormone-Mood Connection

### Estrogen: Your Confidence Hormone
- **Rising (Follicular Phase):** Increased energy, optimism, and mental clarity
- **Peak (Ovulation):** Enhanced mood, confidence, and social connection
- **Falling (Luteal Phase):** Can contribute to mood changes and sensitivity

### Progesterone: Your Calming Hormone
- **Rising (Luteal Phase):** Can have a calming effect but may cause drowsiness
- **Falling (Pre-menstrual):** Rapid drop can trigger mood changes, anxiety, or irritability

## Emotional Patterns Throughout Your Cycle

### 🌑 Menstrual Phase: Introspective Wisdom
- **Common feelings:** Reflective, sensitive, need for solitude
- **Gifts:** Deep intuition, emotional clarity, release of what no longer serves
- **Support strategies:** Honor your need for rest, practice gentle self-care, journal your insights

### 🌱 Follicular Phase: Rising Hope
- **Common feelings:** Optimistic, energetic, ready for new beginnings
- **Gifts:** Motivation, creativity, openness to possibilities
- **Support strategies:** Start new projects, socialize, engage in physical activity

### 🌸 Ovulatory Phase: Radiant Connection
- **Common feelings:** Confident, attractive, socially engaged
- **Gifts:** Peak communication skills, charisma, emotional resilience
- **Support strategies:** Schedule important conversations, enjoy social activities, express yourself

### 🍂 Luteal Phase: Gentle Boundaries
- **Common feelings:** More sensitive, need for comfort, potential irritability
- **Gifts:** Heightened intuition, attention to detail, protective instincts
- **Support strategies:** Practice extra self-care, set boundaries, prepare for menstruation

## When to Seek Support

### Premenstrual Dysphoric Disorder (PMDD)
If you experience severe mood changes that significantly impact your life, you might have PMDD. Symptoms include:
- Severe depression or anxiety before your period
- Extreme mood swings or irritability
- Difficulty concentrating
- Physical symptoms like bloating or breast tenderness
- Symptoms that interfere with work, relationships, or daily activities

### Postpartum Mental Health
Pregnancy, childbirth, and breastfeeding can significantly affect your mental health. Don't hesitate to seek support if you're struggling.

### General Mental Health
Your menstrual cycle can amplify existing mental health conditions. If you're experiencing persistent depression, anxiety, or other mental health concerns, professional support can be incredibly helpful.

## Nurturing Your Mental Wellness

### 🧘‍♀️ Mindfulness Practices
- Daily meditation or breathing exercises
- Body scan practices to connect with your physical sensations
- Mindful movement like yoga or tai chi
- Gratitude journaling

### 🌿 Natural Support
- Regular exercise (adjust intensity to your cycle phase)
- Adequate sleep (7-9 hours nightly)
- Nutritious foods that support stable blood sugar
- Limiting caffeine and alcohol, especially during luteal phase
- Spending time in nature

### 💕 Emotional Support
- Build a support network of understanding friends and family
- Consider therapy or counseling
- Join support groups (online or in-person)
- Practice self-compassion and positive self-talk

### 📊 Tracking for Awareness
- Monitor your moods alongside your cycle
- Identify patterns and triggers
- Plan self-care strategies for challenging times
- Celebrate your emotional strengths in each phase

## Reframing Your Relationship with Emotions

Instead of seeing emotional changes as problems to fix, try viewing them as information about your needs:

- **Irritability** might signal a need for boundaries or rest
- **Sensitivity** could indicate a need for gentleness and comfort
- **Low energy** might be your body asking for restoration
- **Emotional intensity** could be highlighting important issues in your life

## Creating Your Emotional Wellness Plan

1. **Track your patterns** for 2-3 cycles
2. **Identify your unique needs** in each phase
3. **Plan supportive activities** for challenging times
4. **Build your support network**
5. **Practice self-compassion** throughout your journey

## Remember, Beautiful Soul
Your emotional experiences throughout your cycle are valid and meaningful. You're not "too sensitive" or "overreacting" - you're experiencing the natural ebb and flow of your hormones. With understanding and self-compassion, you can work with your cycle rather than against it, creating a more harmonious relationship with your emotions and your beautiful, wise body.`,
    category: "mental-health",
    readTime: 12,
    difficulty: "intermediate",
    tags: ["mental-health", "emotions", "hormones", "self-care", "PMDD"],
    featured: true,
    rating: 4.9,
    lastUpdated: new Date("2024-01-14"),
  },
]

export default function HueCycleHealthLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const categories = [
    { id: "all", label: "All Articles", icon: BookOpen, count: HEALTH_ARTICLES.length },
    {
      id: "basics",
      label: "Cycle Basics",
      icon: Heart,
      count: HEALTH_ARTICLES.filter((a) => a.category === "basics").length,
    },
    {
      id: "conditions",
      label: "Conditions",
      icon: Shield,
      count: HEALTH_ARTICLES.filter((a) => a.category === "conditions").length,
    },
    {
      id: "wellness",
      label: "Wellness",
      icon: Sparkles,
      count: HEALTH_ARTICLES.filter((a) => a.category === "wellness").length,
    },
    {
      id: "fertility",
      label: "Fertility",
      icon: Flower2,
      count: HEALTH_ARTICLES.filter((a) => a.category === "fertility").length,
    },
    {
      id: "mental-health",
      label: "Mental Health",
      icon: Brain,
      count: HEALTH_ARTICLES.filter((a) => a.category === "mental-health").length,
    },
    {
      id: "myths",
      label: "Myth Busting",
      icon: AlertCircle,
      count: HEALTH_ARTICLES.filter((a) => a.category === "myths").length,
    },
  ]

  const filteredArticles = HEALTH_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredArticles = HEALTH_ARTICLES.filter((article) => article.featured)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => setSelectedArticle(null)}
          className="bg-white/70 dark:bg-slate-800/70 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-xl"
        >
          ← Back to Library
        </Button>

        {/* Article Content */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-3xl shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-rose-600 dark:text-rose-300 mb-3">
                  {selectedArticle.title}
                </CardTitle>
                <p className="text-rose-500 dark:text-rose-400 text-lg mb-4">{selectedArticle.description}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={getDifficultyColor(selectedArticle.difficulty)}>{selectedArticle.difficulty}</Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                  >
                    {selectedArticle.readTime} min read
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{selectedArticle.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Updated {selectedArticle.lastUpdated.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-rose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedArticle.content}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-rose-200 dark:border-rose-800">
              <h4 className="font-semibold text-rose-600 dark:text-rose-300 mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-700"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-300 mb-2">Health Library 📚</h2>
        <p className="text-rose-500 dark:text-rose-400">Trusted, compassionate resources for your wellness journey</p>
      </div>

      {/* Search */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400 w-4 h-4" />
            <Input
              placeholder="Search articles, topics, or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent border-none focus:ring-2 focus:ring-rose-400 text-slate-700 dark:text-slate-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Articles */}
      {!searchTerm && selectedCategory === "all" && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-300 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Featured Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-200 dark:border-rose-800 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-rose-600 dark:text-rose-300 flex-1 pr-2">
                        {article.title}
                      </CardTitle>
                      <Badge className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">
                        Featured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-rose-500 dark:text-rose-400 text-sm mb-4 line-clamp-3">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(article.difficulty)} size="sm">
                          {article.difficulty}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{article.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{article.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl p-2">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-pink-500 data-[state=active]:text-white text-rose-600 dark:text-rose-300 flex flex-col items-center py-3"
              >
                <IconComponent className="w-4 h-4 mb-1" />
                <span className="text-xs">{category.label}</span>
                <Badge variant="secondary" className="text-xs mt-1 bg-rose-100 dark:bg-rose-900/20">
                  {category.count}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredArticles.length === 0 ? (
                <div className="col-span-full">
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl">
                    <CardContent className="text-center py-12">
                      <Search className="w-12 h-12 text-rose-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-300 mb-2">No articles found</h3>
                      <p className="text-rose-500 dark:text-rose-400">
                        Try adjusting your search terms or browse different categories
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-rose-200 dark:border-rose-800 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-rose-600 dark:text-rose-300 flex-1 pr-2">
                            {article.title}
                          </CardTitle>
                          {article.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-rose-500 dark:text-rose-400 text-sm mb-4 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge className={getDifficultyColor(article.difficulty)} size="sm">
                              {article.difficulty}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {article.readTime} min read
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">{article.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              #{tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              +{article.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-800 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-1">Important Note</h4>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                The information in our Health Library is for educational purposes and should not replace professional
                medical advice. Always consult with qualified healthcare providers for personalized guidance about your
                health and wellness journey. You deserve compassionate, knowledgeable care from professionals who
                respect and understand your unique needs. 💕
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
