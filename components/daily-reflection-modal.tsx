"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface DailyReflectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (reflection: string) => void
}

export function DailyReflectionModal({ isOpen, onClose, onSave }: DailyReflectionModalProps) {
  const [reflection, setReflection] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!reflection.trim()) return

    setIsLoading(true)
    await onSave(reflection)
    setIsLoading(false)
    setReflection("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl text-slate-700 dark:text-slate-200">Daily Reflection</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Take a moment to reflect on your day. What are you grateful for?
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <Textarea
            placeholder="Today I'm grateful for..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[120px] rounded-xl resize-none"
            autoFocus
          />

          <div className="flex space-x-3">
            <Button
              onClick={handleSave}
              disabled={!reflection.trim() || isLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              {isLoading ? "Saving..." : "Save Reflection"}
            </Button>
            <Button variant="outline" onClick={onClose} className="rounded-xl" disabled={isLoading}>
              Skip
            </Button>
          </div>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            This reflection will be saved privately to your journal
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
