"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import type { MedicineRecommendation } from "../lib/firestore"

interface WishlistButtonProps {
  medicine: MedicineRecommendation
  isInWishlist: boolean
  onToggleWishlist: (medicine: MedicineRecommendation) => void
}

export default function WishlistButton({ medicine, isInWishlist, onToggleWishlist }: WishlistButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={() => onToggleWishlist(medicine)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-2 rounded-lg transition-all duration-300 ${
        isInWishlist
          ? "bg-red-100 dark:bg-red-900/20 text-red-500"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          isInWishlist ? "fill-current" : ""
        }`}
      />
    </motion.button>
  )
}
