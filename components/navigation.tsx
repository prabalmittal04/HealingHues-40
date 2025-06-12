"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu, Home, BarChart3, Users, Stethoscope, Settings, Pill } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/mood-history", label: "Mood History", icon: BarChart3 },
  { href: "/medical-help", label: "Medical Help", icon: Stethoscope },
  { href: "/community", label: "Community", icon: Users },
  { href: "/medicine-ordering", label: "Medicine", icon: Pill },
  { href: "/settings", label: "Settings", icon: Settings },
]

function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              HealingHues
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.displayName || "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                {user.photoURL && (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                  />
                )}
              </div>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-300 dark:border-slate-600"
            >
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* User Info */}
                  {user && (
                    <div className="flex items-center space-x-3 p-4 border-b border-slate-200 dark:border-slate-700">
                      {user.photoURL && (
                        <img
                          src={user.photoURL || "/placeholder.svg"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                        />
                      )}
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">{user.displayName || "User"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="flex-1 py-4">
                    <div className="space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                            <div
                              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                isActive
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <Button onClick={handleSignOut} variant="outline" className="w-full rounded-lg">
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation;
