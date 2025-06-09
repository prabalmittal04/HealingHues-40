"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Brain, TrendingUp, Users, Shield, Lock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "Empathetic AI Chat",
    description: "Talk to HueBot, your compassionate AI companion that listens without judgment",
    color: "text-green-500",
  },
  {
    icon: TrendingUp,
    title: "Track Your Emotional Journey",
    description: "Monitor your mood patterns and celebrate your progress over time",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Anonymous Peer Support",
    description: "Connect with others in a safe, moderated community space",
    color: "text-purple-500",
  },
]

const testimonials = [
  {
    quote: "HealingHues has become my daily companion. The AI chat feels so understanding and never judges me.",
    name: "User from Mumbai",
    avatar: "🌸",
  },
  {
    quote: "I love tracking my moods here. It's helped me understand my emotional patterns better.",
    name: "User from Delhi",
    avatar: "🌿",
  },
  {
    quote: "The community support is amazing. Knowing I'm not alone in my struggles means everything.",
    name: "User from Bangalore",
    avatar: "🦋",
  },
]

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay }}
    className="absolute opacity-20"
  >
    {children}
  </motion.div>
)

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900 relative overflow-hidden">
      {/* Floating decorative elements */}
      <FloatingElement delay={0}>
        <Heart className="w-8 h-8 text-green-300 absolute top-20 left-10" />
      </FloatingElement>
      <FloatingElement delay={1}>
        <div className="w-6 h-6 bg-green-200 rounded-full absolute top-40 right-20" />
      </FloatingElement>
      <FloatingElement delay={2}>
        <div className="text-2xl absolute top-60 left-1/4">🌿</div>
      </FloatingElement>
      <FloatingElement delay={3}>
        <div className="text-2xl absolute top-32 right-1/3">☁️</div>
      </FloatingElement>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">HealingHues</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/auth">
            <Button
              variant="outline"
              className="rounded-full border-green-300 hover:bg-green-50 dark:border-green-600 dark:hover:bg-green-900/20"
            >
              Sign In
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                HealingHues
              </span>{" "}
              🌿
            </h1>

            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Your AI-powered safe space for emotional wellbeing
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <Link href="/auth">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-6 text-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Why HealingHues Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-12">Why HealingHues?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                >
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <CardContent className="p-8 text-center">
                      <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-3">{testimonial.avatar}</div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">— {testimonial.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security & Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-2xl shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-3">Security & Privacy First</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  We respect your privacy. Your data stays with you, encrypted and secure.
                </p>
                <div className="flex items-center justify-center text-sm text-green-600 dark:text-green-400">
                  <Lock className="w-4 h-4 mr-2" />
                  End-to-end encrypted conversations
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-white/20 dark:border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200">HealingHues</span>
            </div>

            <div className="flex space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/about" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Contact
              </Link>
              <Link
                href="https://github.com"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2024 HealingHues. Made with 💚 for mental wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
