"use client"//VERSION 27

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Mail, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const router = useRouter()
  const { user, isEmailVerified } = useAuth()

  // Redirect if user is already authenticated and verified
  useEffect(() => {
    if (user && isEmailVerified) {
      router.push("/dashboard")
    } else if (user && !isEmailVerified) {
      router.push("/verify-email")
    }
  }, [user, isEmailVerified, router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    const { user, error } = await signInWithGoogle()

    if (error) {
      setError(error)
    } else if (user) {
      if (user.emailVerified) {
        router.push("/dashboard")
      } else {
        router.push("/verify-email")
      }
    }

    setIsLoading(false)
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { user, error } = await signInWithEmail(email, password)

    if (error) {
      setError(error)
    } else if (user) {
      if (user.emailVerified) {
        router.push("/dashboard")
      } else {
        router.push("/verify-email")
      }
    }

    setIsLoading(false)
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { user, error } = await signUpWithEmail(email, password, displayName)

    if (error) {
      setError(error)
    } else if (user) {
      router.push("/verify-email")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-slate-700 dark:text-slate-200">HealingHues</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400">Welcome to your safe space</p>
        </div>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-slate-700 dark:text-slate-200">Join HealingHues</CardTitle>
            <CardDescription>Sign in to continue your wellness journey</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="rounded-xl"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 rounded-xl"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
