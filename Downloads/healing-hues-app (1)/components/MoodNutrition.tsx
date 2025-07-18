"use client"

import { useEffect } from "react"

import { useState } from "react"
import { X, Utensils, Calendar, Phone, BookOpen, Heart, Info, ExternalLink, Clock, Star } from "lucide-react"
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface FoodEntry {
  id: string
  name: string
  category: string
  mood: string
  timestamp: Date
  notes?: string
}

interface RecommendedFood {
  name: string
  category: string
  benefits: string[]
  moodTarget: string
  nutrients: string[]
  icon: string
}

interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  moodBenefit: string
  difficulty: "easy" | "medium" | "hard"
  category: string
}

interface Dietician {
  id: string
  name: string
  specialization: string
  phone: string
  email: string
  rating: number
  experience: number
  languages: string[]
}

interface MoodNutritionProps {
  onClose: () => void
  userData: any
  onReward: (amount: number) => void
  onProgressUpdate: (progress: any) => void
}

export default function MoodNutrition({ onClose, userData, onReward, onProgressUpdate }: MoodNutritionProps) {
  const [activeTab, setActiveTab] = useState<"tracker" | "recommendations" | "recipes" | "dieticians">("tracker")
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [newEntry, setNewEntry] = useState({ name: "", category: "breakfast", mood: "neutral", notes: "" })
  const [loading, setLoading] = useState(false)

  const moodOptions = [
    { value: "happy", label: "Happy", color: "text-yellow-400", bg: "bg-yellow-400/20" },
    { value: "calm", label: "Calm", color: "text-green-400", bg: "bg-green-400/20" },
    { value: "energetic", label: "Energetic", color: "text-orange-400", bg: "bg-orange-400/20" },
    { value: "anxious", label: "Anxious", color: "text-red-400", bg: "bg-red-400/20" },
    { value: "sad", label: "Sad", color: "text-blue-400", bg: "bg-blue-400/20" },
    { value: "tired", label: "Tired", color: "text-purple-400", bg: "bg-purple-400/20" },
    { value: "neutral", label: "Neutral", color: "text-gray-400", bg: "bg-gray-400/20" },
  ]

  const categoryOptions = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
    { value: "drink", label: "Drink" },
  ]

  const recommendedFoods: RecommendedFood[] = [
    {
      name: "Bananas",
      category: "Fruit",
      benefits: ["Rich in magnesium", "Natural mood booster", "Reduces anxiety"],
      moodTarget: "anxious",
      nutrients: ["Magnesium", "Potassium", "Vitamin B6"],
      icon: "🍌",
    },
    {
      name: "Spinach",
      category: "Vegetable",
      benefits: ["High in folate", "Supports brain health", "Reduces stress"],
      moodTarget: "anxious",
      nutrients: ["Folate", "Iron", "Magnesium"],
      icon: "🥬",
    },
    {
      name: "Salmon",
      category: "Protein",
      benefits: ["Omega-3 fatty acids", "Improves mood", "Brain health"],
      moodTarget: "sad",
      nutrients: ["Omega-3", "Protein", "Vitamin D"],
      icon: "🐟",
    },
    {
      name: "Dark Chocolate",
      category: "Treat",
      benefits: ["Releases endorphins", "Antioxidants", "Mood enhancement"],
      moodTarget: "sad",
      nutrients: ["Flavonoids", "Magnesium", "Iron"],
      icon: "🍫",
    },
    {
      name: "Green Tea",
      category: "Drink",
      benefits: ["L-theanine for calm", "Antioxidants", "Gentle energy"],
      moodTarget: "tired",
      nutrients: ["L-theanine", "Caffeine", "Catechins"],
      icon: "🍵",
    },
    {
      name: "Almonds",
      category: "Nuts",
      benefits: ["Vitamin E", "Healthy fats", "Sustained energy"],
      moodTarget: "tired",
      nutrients: ["Vitamin E", "Magnesium", "Protein"],
      icon: "🥜",
    },
    {
      name: "Avocado",
      category: "Fruit",
      benefits: ["Healthy fats for brain", "Supports serotonin production"],
      moodTarget: "happy",
      nutrients: ["Healthy Fats", "Vitamin K", "Folate"],
      icon: "🥑",
    },
    {
      name: "Berries",
      category: "Fruit",
      benefits: ["Antioxidant rich", "Boosts cognitive function"],
      moodTarget: "energetic",
      nutrients: ["Vitamin C", "Fiber", "Antioxidants"],
      icon: "🍓",
    },
  ]

  const recipes: Recipe[] = [
    {
      id: "mood-smoothie",
      title: "Morning Mood Boost Smoothie",
      description: "A nutrient-packed smoothie to start your day with positive energy",
      ingredients: [
        "1 banana",
        "1 cup spinach",
        "1/2 cup blueberries",
        "1 tbsp almond butter",
        "1 cup almond milk",
        "1 tsp honey",
        "1/2 tsp vanilla extract",
      ],
      instructions: [
        "Add all ingredients to a blender",
        "Blend until smooth and creamy",
        "Pour into a glass and enjoy immediately",
        "Optional: top with chia seeds or granola",
      ],
      prepTime: 5,
      moodBenefit: "Boosts energy and mood",
      difficulty: "easy",
      category: "breakfast",
    },
    {
      id: "calming-tea",
      title: "Stress-Relief Herbal Tea Blend",
      description: "A soothing herbal tea blend to calm your mind and reduce stress",
      ingredients: [
        "1 tsp chamomile flowers",
        "1/2 tsp lavender buds",
        "1/2 tsp lemon balm",
        "1 cup hot water",
        "Honey to taste",
      ],
      instructions: [
        "Combine all herbs in a tea infuser",
        "Pour hot water over the herbs",
        "Steep for 5-7 minutes",
        "Remove infuser and add honey if desired",
        "Sip slowly and breathe deeply",
      ],
      prepTime: 10,
      moodBenefit: "Reduces anxiety and promotes calm",
      difficulty: "easy",
      category: "drink",
    },
    {
      id: "omega-bowl",
      title: "Omega-3 Power Bowl",
      description: "A brain-boosting bowl packed with mood-supporting nutrients",
      ingredients: [
        "1 cup quinoa, cooked",
        "4 oz grilled salmon",
        "1/2 avocado, sliced",
        "1 cup mixed greens",
        "1/4 cup walnuts",
        "2 tbsp olive oil",
        "1 tbsp lemon juice",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Cook quinoa according to package directions",
        "Grill salmon until cooked through",
        "Arrange quinoa in a bowl",
        "Top with salmon, avocado, and greens",
        "Sprinkle with walnuts",
        "Drizzle with olive oil and lemon juice",
        "Season with salt and pepper",
      ],
      prepTime: 25,
      moodBenefit: "Supports brain health and mood stability",
      difficulty: "medium",
      category: "lunch",
    },
    {
      id: "turmeric-latte",
      title: "Golden Turmeric Latte",
      description: "A warm, anti-inflammatory drink for comfort and well-being",
      ingredients: [
        "1 cup plant-based milk",
        "1 tsp turmeric powder",
        "1/2 tsp ginger powder",
        "Pinch of black pepper",
        "1 tsp maple syrup or honey",
        "Pinch of cinnamon",
      ],
      instructions: [
        "Combine milk, turmeric, ginger, and black pepper in a saucepan",
        "Heat over medium heat, whisking constantly, until warm (do not boil)",
        "Remove from heat, stir in sweetener and cinnamon",
        "Pour into a mug and enjoy",
      ],
      prepTime: 8,
      moodBenefit: "Reduces inflammation, promotes calm",
      difficulty: "easy",
      category: "drink",
    },
    {
      id: "lentil-soup",
      title: "Hearty Lentil & Vegetable Soup",
      description: "A comforting and nutritious soup for sustained energy and warmth",
      ingredients: [
        "1 tbsp olive oil",
        "1 onion, chopped",
        "2 carrots, diced",
        "2 celery stalks, diced",
        "2 cloves garlic, minced",
        "1 cup brown lentils, rinsed",
        "6 cups vegetable broth",
        "1 can (14.5 oz) diced tomatoes",
        "1 tsp dried thyme",
        "Salt and pepper to taste",
        "Fresh parsley, chopped (for garnish)",
      ],
      instructions: [
        "Heat olive oil in a large pot over medium heat",
        "Add onion, carrots, and celery; cook until softened (5-7 min)",
        "Add garlic and cook for 1 minute more",
        "Stir in lentils, broth, diced tomatoes, and thyme",
        "Bring to a boil, then reduce heat and simmer for 25-30 minutes, or until lentils are tender",
        "Season with salt and pepper",
        "Garnish with fresh parsley before serving",
      ],
      prepTime: 40,
      moodBenefit: "Provides sustained energy, comforting",
      difficulty: "medium",
      category: "dinner",
    },
  ]

  const dieticians: Dietician[] = [
    {
      id: "dr-sarah",
      name: "Dr. Sarah Johnson",
      specialization: "Mood & Nutrition Therapy",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@healingnutrition.com",
      rating: 4.9,
      experience: 12,
      languages: ["English", "Spanish"],
    },
    {
      id: "dr-michael",
      name: "Dr. Michael Chen",
      specialization: "Anxiety & Stress Nutrition",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@mindfulmeals.com",
      rating: 4.8,
      experience: 8,
      languages: ["English", "Mandarin"],
    },
    {
      id: "dr-elena",
      name: "Dr. Elena Rodriguez",
      specialization: "Depression & Food Therapy",
      phone: "+1 (555) 345-6789",
      email: "elena.rodriguez@holistichealth.com",
      rating: 4.9,
      experience: 15,
      languages: ["English", "Spanish", "Portuguese"],
    },
    {
      id: "dr-james",
      name: "Dr. James Wilson",
      specialization: "Energy & Fatigue Nutrition",
      phone: "+1 (555) 456-7890",
      email: "james.wilson@vitalitynutrition.com",
      rating: 4.7,
      experience: 10,
      languages: ["English", "French"],
    },
  ]

  useEffect(() => {
    const loadFoodEntries = async () => {
      if (userData?.uid) {
        setLoading(true)
        try {
          const q = query(collection(db, "foodEntries"), orderBy("timestamp", "desc"), limit(20))
          const querySnapshot = await getDocs(q)
          const entries = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(), // Convert Firestore Timestamp to Date object
          })) as FoodEntry[]
          setFoodEntries(entries)
        } catch (error) {
          console.error("Error loading food entries:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadFoodEntries()
  }, [userData?.uid])

  const addFoodEntry = async () => {
    if (!newEntry.name.trim()) return

    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: newEntry.name,
      category: newEntry.category,
      mood: newEntry.mood,
      timestamp: new Date(),
      notes: newEntry.notes,
    }

    try {
      setLoading(true)
      await addDoc(collection(db, "foodEntries"), {
        ...entry,
        userId: userData?.uid,
      })
      setFoodEntries((prev) => [entry, ...prev])
      setNewEntry({ name: "", category: "breakfast", mood: "neutral", notes: "" })
      onReward(5) // Small reward for tracking
    } catch (error) {
      console.error("Error adding food entry:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodRecommendations = (mood: string) => {
    return recommendedFoods.filter((food) => food.moodTarget === mood)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-400/20"
      case "medium":
        return "text-yellow-400 bg-yellow-400/20"
      case "hard":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-orange-950/95 to-yellow-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mood Nutrition</h2>
              <p className="text-slate-300">Nutritional guidance for mental wellness</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: "tracker", label: "Food Tracker", icon: Calendar },
            { id: "recommendations", label: "Recommendations", icon: Heart },
            { id: "recipes", label: "Recipes", icon: BookOpen },
            { id: "dieticians", label: "Dieticians", icon: Phone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-colors ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white border-b-2 border-orange-400"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="h-[calc(90vh-200px)] overflow-y-auto">
          {/* Food Tracker Tab */}
          {activeTab === "tracker" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add New Entry */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Log Food & Mood</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Food/Meal</label>
                      <input
                        type="text"
                        value={newEntry.name}
                        onChange={(e) => setNewEntry((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="What did you eat?"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Category</label>
                        <select
                          value={newEntry.category}
                          onChange={(e) => setNewEntry((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                        >
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Current Mood</label>
                        <select
                          value={newEntry.mood}
                          onChange={(e) => setNewEntry((prev) => ({ ...prev, mood: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                        >
                          {moodOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Notes (Optional)</label>
                      <textarea
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry((prev) => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 resize-none"
                        placeholder="How did this food make you feel?"
                      />
                    </div>

                    <button
                      onClick={addFoodEntry}
                      disabled={loading || !newEntry.name.trim()}
                      className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? "Logging..." : "Log Entry"}
                    </button>
                  </div>
                </div>

                {/* Food History */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Your Food & Mood History</h3>
                  {foodEntries.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Info className="w-12 h-12 mx-auto mb-4" />
                      <p>No food entries logged yet. Start tracking your meals!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {foodEntries.map((entry) => (
                        <div key={entry.id} className="p-4 bg-white/10 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-white">{entry.name}</h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${moodOptions.find((m) => m.value === entry.mood)?.bg} ${moodOptions.find((m) => m.value === entry.mood)?.color}`}
                            >
                              {moodOptions.find((m) => m.value === entry.mood)?.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-1">Category: {entry.category}</p>
                          <p className="text-xs text-slate-400">Logged: {new Date(entry.timestamp).toLocaleString()}</p>
                          {entry.notes && <p className="text-sm text-slate-400 mt-2 italic">"{entry.notes}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Personalized Food Recommendations</h3>
              <p className="text-slate-300 mb-8">
                Based on your current mood, here are some foods that can help you feel better:
              </p>

              <div className="space-y-8">
                {moodOptions.map((moodOpt) => {
                  const recommendationsForMood = getMoodRecommendations(moodOpt.value)
                  if (recommendationsForMood.length === 0) return null
                  return (
                    <div
                      key={moodOpt.value}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                    >
                      <h4 className={`text-lg font-bold mb-4 ${moodOpt.color}`}>
                        Foods for when you're feeling {moodOpt.label}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendationsForMood.map((food, index) => (
                          <div key={index} className="p-4 bg-white/10 rounded-xl border border-white/10">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{food.icon}</span>
                              <h5 className="font-bold text-white">{food.name}</h5>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{food.category}</p>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                              {food.benefits.map((benefit, i) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {food.nutrients.map((nutrient, i) => (
                                <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-lg">
                                  {nutrient}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === "recipes" && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Nutritious Recipes & Tips</h3>
              <p className="text-slate-300 mb-8">
                Discover easy and delicious recipes designed to support your mood and well-being.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-2">{recipe.title}</h4>
                    <p className="text-sm text-slate-300 mb-3">{recipe.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prepTime} min</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}
                      >
                        {recipe.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">
                        {recipe.moodBenefit}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-white mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-white mb-2">Instructions:</h5>
                      <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
                        {recipe.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dieticians Tab */}
          {activeTab === "dieticians" && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Connect with Expert Dieticians</h3>
              <p className="text-slate-300 mb-8">
                Find licensed dieticians specializing in mental wellness and nutritional therapy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dieticians.map((dietician) => (
                  <div
                    key={dietician.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {dietician.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{dietician.name}</h4>
                        <p className="text-sm text-slate-300">{dietician.specialization}</p>
                        <div className="flex items-center space-x-1 text-sm text-slate-400">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>
                            {dietician.rating} ({dietician.experience} yrs exp)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-slate-300 text-sm">
                        <Phone className="w-4 h-4 text-orange-400" />
                        <a href={`tel:${dietician.phone}`} className="hover:underline">
                          {dietician.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300 text-sm">
                        <ExternalLink className="w-4 h-4 text-orange-400" />
                        <a href={`mailto:${dietician.email}`} className="hover:underline">
                          {dietician.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {dietician.languages.map((lang, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 text-xs text-slate-300 rounded-lg">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
