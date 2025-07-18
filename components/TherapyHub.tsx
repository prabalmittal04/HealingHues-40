"use client"

import { useState, useEffect } from "react"
import { X, Brain, MessageSquare, Users, Star, Phone, ExternalLink, Clock, Award, CalendarDays } from "lucide-react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Therapist {
  id: string
  name: string
  specialization: string[]
  bio: string
  rating: number
  experience: number
  languages: string[]
  imageUrl: string
  availability: string[] // e.g., ["Mon 9-5", "Wed 10-6"]
  contact: {
    phone: string
    email: string
    website?: string
  }
  sessionCost: number
  hueCoinsReward: number
}

interface SupportGroup {
  id: string
  name: string
  topic: string
  description: string
  facilitator: string
  schedule: string // e.g., "Every Tuesday 7 PM PST"
  participants: number
  maxParticipants: number
  platform: string // e.g., "Zoom", "Google Meet"
  link: string
  hueCoinsReward: number
}

interface TherapyHubProps {
  onClose: () => void
  userData: any
  onReward: (amount: number) => void
  onProgressUpdate: (progress: any) => void
}

export default function TherapyHub({ onClose, userData, onReward, onProgressUpdate }: TherapyHubProps) {
  const [activeTab, setActiveTab] = useState<"therapists" | "groups">("therapists")
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTherapyData()
  }, [])

  const loadTherapyData = async () => {
    try {
      const therapistsQuery = query(collection(db, "therapists"), orderBy("rating", "desc"), limit(20))
      const therapistsSnapshot = await getDocs(therapistsQuery)
      const therapistsData = therapistsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Therapist[]
      setTherapists(therapistsData.length > 0 ? therapistsData : sampleTherapists)

      const groupsQuery = query(collection(db, "supportGroups"), orderBy("participants", "desc"), limit(20))
      const groupsSnapshot = await getDocs(groupsQuery)
      const groupsData = groupsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SupportGroup[]
      setSupportGroups(groupsData.length > 0 ? groupsData : sampleSupportGroups)
    } catch (error) {
      console.error("Error loading therapy data:", error)
      setTherapists(sampleTherapists)
      setSupportGroups(sampleSupportGroups)
    } finally {
      setLoading(false)
    }
  }

  const sampleTherapists: Therapist[] = [
    {
      id: "t1",
      name: "Dr. Anya Sharma",
      specialization: ["Anxiety", "Depression", "Trauma"],
      bio: "Dr. Sharma is a compassionate therapist specializing in CBT and mindfulness-based approaches to help clients navigate life's challenges.",
      rating: 4.9,
      experience: 10,
      languages: ["English", "Hindi"],
      imageUrl: "/placeholder.svg?height=100&width=100",
      availability: ["Mon 9 AM - 5 PM", "Wed 10 AM - 6 PM", "Fri 9 AM - 1 PM"],
      contact: {
        phone: "+1 (555) 111-2222",
        email: "anya.sharma@therapyhub.com",
        website: "https://www.anyasharmatherapy.com",
      },
      sessionCost: 120,
      hueCoinsReward: 50,
    },
    {
      id: "t2",
      name: "Mark Johnson, LCSW",
      specialization: ["Stress Management", "Relationship Issues", "Grief"],
      bio: "Mark offers a supportive and empathetic space for individuals and couples to explore their emotions and develop coping strategies.",
      rating: 4.8,
      experience: 7,
      languages: ["English"],
      imageUrl: "/placeholder.svg?height=100&width=100",
      availability: ["Tue 1 PM - 7 PM", "Thu 9 AM - 5 PM"],
      contact: {
        phone: "+1 (555) 333-4444",
        email: "mark.johnson@therapyhub.com",
      },
      sessionCost: 100,
      hueCoinsReward: 45,
    },
    {
      id: "t3",
      name: "Dr. Lena Petrova",
      specialization: ["Child & Adolescent Therapy", "Family Counseling"],
      bio: "Dr. Petrova works with children, adolescents, and families to address behavioral challenges, communication issues, and emotional well-being.",
      rating: 4.7,
      experience: 15,
      languages: ["English", "Russian"],
      imageUrl: "/placeholder.svg?height=100&width=100",
      availability: ["Mon 1 PM - 6 PM", "Wed 9 AM - 3 PM", "Fri 10 AM - 4 PM"],
      contact: {
        phone: "+1 (555) 555-6666",
        email: "lena.petrova@therapyhub.com",
      },
      sessionCost: 130,
      hueCoinsReward: 55,
    },
  ]

  const sampleSupportGroups: SupportGroup[] = [
    {
      id: "g1",
      name: "Anxiety Support Circle",
      topic: "Managing Anxiety",
      description: "A safe space to share experiences and learn coping mechanisms for anxiety.",
      facilitator: "Sarah Chen",
      schedule: "Every Monday 6:00 PM - 7:30 PM PST",
      participants: 15,
      maxParticipants: 20,
      platform: "Zoom",
      link: "https://zoom.us/j/1234567890",
      hueCoinsReward: 20,
    },
    {
      id: "g2",
      name: "Grief & Loss Healing",
      topic: "Coping with Loss",
      description: "Connect with others navigating grief and find support in a compassionate environment.",
      facilitator: "David Lee",
      schedule: "Every Wednesday 7:00 PM - 8:30 PM EST",
      participants: 10,
      maxParticipants: 15,
      platform: "Google Meet",
      link: "https://meet.google.com/abc-defg-hij",
      hueCoinsReward: 25,
    },
    {
      id: "g3",
      name: "Mindful Parenting",
      topic: "Parenting Challenges",
      description: "Learn mindful strategies to navigate the ups and downs of parenting.",
      facilitator: "Dr. Emily White",
      schedule: "Every Friday 10:00 AM - 11:30 AM GMT",
      participants: 12,
      maxParticipants: 18,
      platform: "Zoom",
      link: "https://zoom.us/j/0987654321",
      hueCoinsReward: 20,
    },
  ]

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-indigo-950/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Therapy Hub</h2>
              <p className="text-slate-300">Connect with licensed therapists and support groups</p>
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
          <button
            onClick={() => setActiveTab("therapists")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "therapists"
                ? "text-white bg-white/10 border-b-2 border-purple-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Therapists
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "groups"
                ? "text-white bg-white/10 border-b-2 border-purple-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Support Groups
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "therapists" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={therapist.imageUrl || "/placeholder.svg"}
                      alt={therapist.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-400"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{therapist.name}</h3>
                      <p className="text-slate-300 text-sm">{therapist.specialization.join(", ")}</p>
                      <div className="flex items-center space-x-1 text-sm text-slate-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>
                          {therapist.rating} ({therapist.experience} yrs exp)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{therapist.bio}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-slate-300 text-sm">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <a href={`tel:${therapist.contact.phone}`} className="hover:underline">
                        {therapist.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300 text-sm">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <a href={`mailto:${therapist.contact.email}`} className="hover:underline">
                        {therapist.contact.email}
                      </a>
                    </div>
                    {therapist.contact.website && (
                      <div className="flex items-center space-x-2 text-slate-300 text-sm">
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                        <a
                          href={therapist.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {therapist.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-white/10 text-xs text-slate-300 rounded-lg">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">+{therapist.hueCoinsReward} coins</span>
                    </div>
                    <span className="text-white font-bold">₹{therapist.sessionCost}/session</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{group.name}</h3>
                      <p className="text-slate-300 text-sm">Topic: {group.topic}</p>
                      <p className="text-slate-400 text-xs">Facilitator: {group.facilitator}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{group.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-slate-300 text-sm">
                      <CalendarDays className="w-4 h-4 text-indigo-400" />
                      <span>{group.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300 text-sm">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>
                        {group.participants}/{group.maxParticipants} participants
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300 text-sm">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>Platform: {group.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">+{group.hueCoinsReward} coins</span>
                    </div>
                    <a
                      href={group.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Join Group</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
