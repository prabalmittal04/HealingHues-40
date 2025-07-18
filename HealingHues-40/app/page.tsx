"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Heart, Sparkles, Music, Wind, Users2, ArrowRight, ShoppingCart } from "lucide-react"

// Hero Section with Autumn Forest Background
function HeroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
    {/* Autumn Forest Background */}
    <motion.div style={{ y }} className="absolute inset-0">
      <Image src="/images/autumn-forest.png" alt="Autumn Forest" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-violet-900/30" />
    </motion.div>

      {/* Floating Organic Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{
            background:
              "radial-gradient(circle, transparent 40%, rgba(255,255,255,0.05) 41%, rgba(255,255,255,0.05) 60%, transparent 61%)",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 border border-white/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{
            background:
              "radial-gradient(circle, transparent 30%, rgba(255,255,255,0.03) 31%, rgba(255,255,255,0.03) 50%, transparent 51%)",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400/40 to-violet-300/40 rounded-full"
            animate={{
              x: [0, Math.random() * 60 - 30],
              y: [0, -100],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 4,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Content - Left Side */}
      <motion.div style={{ opacity }} className="relative z-10 h-full flex items-center pl-8 md:pl-16 lg:pl-24">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Healing
            <br />
            <span className="italic">and</span> Wellness
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed max-w-xl font-light"
            style={{ fontFamily: "Georgia, serif" }}
          >
            We understand that true wellness extends beyond the surface. That's why we've crafted an environment that
            prioritizes comfort and relaxation through AI-powered therapy and comprehensive medicine delivery.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 text-lg font-light rounded-full backdrop-blur-sm transition-all duration-300"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Explore <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8 text-white/60"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="flex flex-col items-center"
        >
          <span className="text-sm mb-2 font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            Scroll
          </span>
          <div className="w-px h-12 bg-white/30" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Empathetic AI Chat",
      description:
        "Connect with our advanced AI companion that understands your emotions and provides personalized guidance through your healing journey.",
      gradient: "from-purple-600 to-violet-600",
      link: "/dashboard",
    },
    {
      icon: Heart,
      title: "Track Your Emotional Journey",
      description:
        "Visualize your progress with beautiful, intuitive charts that map your emotional landscape and celebrate your growth.",
      gradient: "from-emerald-500 to-teal-500",
      link: "/mood-history",
    },
    {
      icon: ShoppingCart,
      title: "Medicine Ordering System",
      description:
        "Access our comprehensive medicine delivery platform featuring prescription medications, wellness supplements, and health products at reasonable prices with fast, reliable delivery to your doorstep.",
      gradient: "from-purple-700 to-indigo-700",
      link: "/medicine-ordering",
    },
  ]

  return (
    <section id="features" className="py-32 px-4 bg-gradient-to-b from-slate-900 to-purple-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Comprehensive Wellness Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light" style={{ fontFamily: "Georgia, serif" }}>
            Experience the future of mental health and medicine delivery through our AI-powered sanctuary
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className="relative mb-6">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}
                    />
                    <div
                      className={`relative w-16 h-16 mx-auto bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3
                    className="text-xl font-light text-white mb-4 tracking-wide"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-gray-300 leading-relaxed flex-grow font-light"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {feature.description}
                  </p>
                  <Link href={feature.link}>
                    <Button
                      variant="ghost"
                      className="mt-6 text-white hover:bg-white/10 group-hover:bg-white/20 transition-all font-light"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Medicine Ordering Section
function MedicineOrderingSection() {
  const medicineFeatures = [
    {
      icon: Users2,
      title: "Guided Therapy Sessions",
      description: "Professional-led sessions with AI assistance for personalized healing",
    },
    {
      icon: Music,
      title: "Soothing Music Library",
      description: "Curated soundscapes and healing frequencies for deep relaxation",
    },
    {
      icon: Wind,
      title: "Breathing Exercises",
      description: "Guided breathwork practices for stress relief and mindfulness",
    },
  ]

  return (
    <section id="medicine" className="py-32 px-4 bg-gradient-to-b from-purple-900 via-slate-900 to-violet-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <motion.h2
                className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wide"
                style={{ fontFamily: "Georgia, serif" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                HealingHues, developed at the{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent italic">
                  intersection of convenience and care
                </span>
              </motion.h2>
            </div>

            {/* Medicine Features */}
            <div className="space-y-6">
              {medicineFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-light text-white mb-1 tracking-wide"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-light" style={{ fontFamily: "Georgia, serif" }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-between bg-gradient-to-r from-purple-500/20 to-violet-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
            >
              <div>
                <p
                  className="text-purple-300 text-sm font-light mb-1 tracking-wide"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  HEALING CAPACITY
                </p>
                <p className="text-white text-2xl font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                  all heartbeats,
                </p>
                <p className="text-white text-2xl font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                  all week.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-10 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-end pr-1">
                  <div className="w-8 h-8 bg-white rounded-full shadow-lg" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-navy-900/50 to-emerald-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="space-y-6">
                <div className="text-center">
                  <h3
                    className="text-white text-xl font-semibold mb-4"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    Cosmic Wellness Dashboard
                  </h3>
                  <div className="relative w-32 h-32 mx-auto">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p
                      className="text-emerald-400 text-sm"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                    >
                      Emotional Balance
                    </p>
                    <p
                      className="text-white text-2xl font-bold"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                    >
                      94%
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p className="text-emerald-400 text-sm" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Healing Progress
                    </p>
                    <p
                      className="text-white text-2xl font-bold"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                    >
                      87%
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p
                    className="text-gray-300 text-sm mb-4"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    Quickly locate your inner peace, ensuring it's always within reach when you need it most.
                  </p>
                  <Link href="/wellness">
                    <Button
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-6 mb-4"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                    >
                      Access Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Mental Health Advocate",
      content:
        "HealingHues has transformed my approach to mental wellness. The AI companion truly understands my emotions and provides personalized guidance that feels genuine and caring.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Psychiatrist",
      content:
        "As a healthcare professional, I'm impressed by the sophisticated AI technology. My patients have shown remarkable progress using HealingHues alongside traditional therapy.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Wellness Coach",
      content:
        "The medicine ordering system is incredibly convenient. Fast delivery, reasonable prices, and the integration with wellness tracking makes it a complete solution.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Anxiety Survivor",
      content:
        "The breathing exercises and soothing music library have been life-changing. I finally found a platform that addresses both my mental health and practical needs.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Busy Professional",
      content:
        "HealingHues fits perfectly into my hectic schedule. The AI chat is available 24/7, and the medicine delivery saves me countless trips to the pharmacy.",
      rating: 5,
    },
    {
      name: "Robert Kim",
      role: "Meditation Practitioner",
      content:
        "The cosmic wellness center creates such a serene digital environment. It's like having a personal sanctuary that I can access anytime, anywhere.",
      rating: 5,
    },
  ]

  return (
    <section className="py-32 px-4 bg-gradient-to-b from-violet-900 to-purple-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light" style={{ fontFamily: "Georgia, serif" }}>
            Real stories from people who have transformed their wellness journey with HealingHues
          </p>
        </motion.div>

        {/* Sliding Testimonials */}
        <div className="relative">
          <div className="flex space-x-6 animate-slide-left">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Sparkles key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p
                  className="text-white/90 mb-6 leading-relaxed font-light text-sm"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-light text-lg" style={{ fontFamily: "Georgia, serif" }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm font-light" style={{ fontFamily: "Georgia, serif" }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Component
export default function HealingHuesLanding() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">

    
      {/* Header */}
<header className="fixed top-0 left-0 right-0 z-50 bg-transparent px-6 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    
    {/* Left: Logo */}
   <div className="absolute top-4 left-10">
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/images/healinghues-logo.png" alt="HealingHues Logo" width={36} height={36} />
      <span className="text-2xl font-semibold text-white tracking-wide">HealingHues</span>
    </Link>
   </div>

    {/* Center: Navigation */}
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center h-16">
    <nav className="hidden md:flex space-x-8 text-white text-sm font-medium">
      <Link href="/about" className="hover:text-purple-300 transition">About</Link>
      <Link href="/dashboard" className="hover:text-purple-300 transition">AI ChatBot</Link>
      <Link href="/wellness" className="hover:text-purple-300 transition">Wellness Center</Link>
      <Link href="/medicine-ordering" className="hover:text-purple-300 transition">Medicine Ordering</Link>
    </nav>
  </div>

    {/* Right: Sign In + Hamburger */}
    <div className="flex items-center space-x-4">
      <div className="absolute top-4 right-10">
        <Link href="/auth">
        <button className="rounded-full text-white bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 transition-colors shadow-md px-5 py-2"
        >
          Sign In
        </button>
      </Link>
      </div>
    </div>

  </div>
</header>




      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* Medicine Ordering Section */}
      <MedicineOrderingSection />
      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image src="/images/healinghues-logo.png" alt="HealingHues" width={60} height={60} className="rounded-lg" />
          </div>
          <p className="text-gray-400 text-lg mb-4 font-light" style={{ fontFamily: "Georgia, serif" }}>
            An emotionally intelligent AI wellness system, built with love and care by Prabal Mittal
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400 mb-6">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
          <p className="text-gray-500 font-light" style={{ fontFamily: "Georgia, serif" }}>
            © 2025 HealingHues. Made with ❤ for mental wellness
          </p>
        </div>
      </footer>
    </div>
  )
}
