"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingScreen } from "./LoadingScreen"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireEmailVerification?: boolean
}

export default function ProtectedRoute({ children, requireEmailVerification = false }: ProtectedRouteProps) {
  const { user, loading, isEmailVerified } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth")
        return
      }

      if (requireEmailVerification && !isEmailVerified) {
        router.push("/verify-email")
        return
      }
    }
  }, [user, loading, isEmailVerified, requireEmailVerification, router])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  if (requireEmailVerification && !isEmailVerified) {
    return null
  }

  return <>{children}</>
}
