"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, RefreshCw, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { sendVerificationEmail, signOutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleResendEmail = async () => {
    if (!user) return

    setIsLoading(true)
    const { error } = await sendVerificationEmail(user)

    if (!error) {
      setEmailSent(true)
    }

    setIsLoading(false)
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push("/auth")
  }

  const handleRefresh = () => {
    window.location.reload()
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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-slate-700 dark:text-slate-200">HealingHues</span>
          </div>
        </div>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-slate-700 dark:text-slate-200">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a verification link to <br />
              <span className="font-medium text-slate-600 dark:text-slate-300">{user?.email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Please check your email and click the verification link to continue to your dashboard.
              </p>

              {emailSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                >
                  <p className="text-sm text-green-700 dark:text-green-300">✅ Verification email sent successfully!</p>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                I've Verified - Continue
              </Button>

              <Button onClick={handleResendEmail} variant="outline" className="w-full rounded-xl" disabled={isLoading}>
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>

            <div className="text-center">
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Sign out and try different email
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
