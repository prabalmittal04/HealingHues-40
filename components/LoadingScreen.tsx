"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.div>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">HealingHues</h2>
        <p className="text-slate-500 dark:text-slate-400">Loading your wellness journey...</p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-6 max-w-xs mx-auto"
        />
      </motion.div>
    </div>
  )
}
