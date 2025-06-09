"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Moon, Sun, Bell, Shield, LogOut, Palette } from "lucide-react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(false)
  const [communityUpdates, setCommunityUpdates] = useState(true)
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...")
  }

  return (
    <div className="min-h-screen healing-gradient">
      <Navigation />

      <main className="max-w-4xl mx-auto p-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <Card className="healing-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-700 dark:text-slate-200 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-purple-500" />
                Settings
              </CardTitle>
              <CardDescription>Customize your HealingHues experience</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-6">
            {/* Theme Settings */}
            <Card className="healing-card">
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>Choose your preferred theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === "dark" ? (
                      <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    ) : (
                      <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    )}
                    <div>
                      <Label className="text-slate-700 dark:text-slate-200">Dark Mode</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="healing-card">
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-200">Push Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive general app notifications</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-200">Daily Check-in Reminders</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gentle reminders to log your mood</p>
                  </div>
                  <Switch checked={dailyReminders} onCheckedChange={setDailyReminders} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-200">Community Updates</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Notifications from community interactions
                    </p>
                  </div>
                  <Switch checked={communityUpdates} onCheckedChange={setCommunityUpdates} />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="healing-card">
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 dark:text-slate-200 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Your data protection and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Data Protection</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your conversations and mood data are encrypted and stored securely. We never share your personal
                    information.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl text-red-600 hover:text-red-700">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="healing-card">
              <CardContent className="p-6">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
