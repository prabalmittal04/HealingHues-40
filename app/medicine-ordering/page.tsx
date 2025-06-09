"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  X,
  Pill,
  Camera,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  Package,
  CreditCard,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { saveMedicineOrder, getMedicineOrders, type MedicineItem, type MedicineOrder } from "@/lib/firestore"

// Enhanced medicine database with more details
const MEDICINE_DATABASE = [
  { name: "Paracetamol 500mg", price: 25, manufacturer: "GSK", category: "Pain Relief", rating: 4.5 },
  { name: "Ibuprofen 400mg", price: 35, manufacturer: "Pfizer", category: "Pain Relief", rating: 4.3 },
  { name: "Aspirin 75mg", price: 20, manufacturer: "Bayer", category: "Cardiovascular", rating: 4.4 },
  { name: "Amoxicillin 250mg", price: 45, manufacturer: "Abbott", category: "Antibiotic", rating: 4.2 },
  { name: "Metformin 500mg", price: 55, manufacturer: "Novartis", category: "Diabetes", rating: 4.6 },
  { name: "Lisinopril 10mg", price: 40, manufacturer: "Merck", category: "Cardiovascular", rating: 4.1 },
  { name: "Atorvastatin 20mg", price: 65, manufacturer: "Pfizer", category: "Cholesterol", rating: 4.4 },
  { name: "Omeprazole 20mg", price: 30, manufacturer: "AstraZeneca", category: "Gastric", rating: 4.5 },
  { name: "Amlodipine 5mg", price: 38, manufacturer: "Pfizer", category: "Cardiovascular", rating: 4.2 },
  { name: "Simvastatin 40mg", price: 50, manufacturer: "Merck", category: "Cholesterol", rating: 4.3 },
  { name: "Levothyroxine 50mcg", price: 42, manufacturer: "Abbott", category: "Thyroid", rating: 4.6 },
  { name: "Warfarin 5mg", price: 48, manufacturer: "Bristol Myers", category: "Anticoagulant", rating: 4.0 },
  { name: "Furosemide 40mg", price: 28, manufacturer: "Sanofi", category: "Diuretic", rating: 4.2 },
  { name: "Prednisolone 5mg", price: 35, manufacturer: "Pfizer", category: "Steroid", rating: 4.1 },
  { name: "Salbutamol 100mcg", price: 60, manufacturer: "GSK", category: "Respiratory", rating: 4.7 },
  { name: "Insulin Glargine", price: 120, manufacturer: "Sanofi", category: "Diabetes", rating: 4.8 },
  { name: "Clopidogrel 75mg", price: 75, manufacturer: "Bristol Myers", category: "Antiplatelet", rating: 4.3 },
  { name: "Ramipril 2.5mg", price: 32, manufacturer: "Sanofi", category: "Cardiovascular", rating: 4.4 },
  { name: "Bisoprolol 2.5mg", price: 36, manufacturer: "Merck", category: "Beta Blocker", rating: 4.2 },
  { name: "Cetirizine 10mg", price: 22, manufacturer: "Johnson & Johnson", category: "Antihistamine", rating: 4.5 },
]

const CATEGORIES = [
  "All",
  "Pain Relief",
  "Cardiovascular",
  "Diabetes",
  "Antibiotic",
  "Cholesterol",
  "Gastric",
  "Respiratory",
]

export default function MedicineOrderingPage() {
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<"prescription" | "manual" | null>(null)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [medicineSearch, setMedicineSearch] = useState("")
  const [suggestions, setSuggestions] = useState<typeof MEDICINE_DATABASE>([])
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<MedicineOrder[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user's orders
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = getMedicineOrders(user.uid, (userOrders) => {
        setOrders(userOrders)
      })
      return unsubscribe
    }
  }, [user?.uid])

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    setError(null)

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG) or PDF file.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.")
      return
    }

    setPrescriptionFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPrescriptionPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPrescriptionPreview(null)
    }
  }, [])

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Handle medicine search
  const handleMedicineSearch = (value: string) => {
    setMedicineSearch(value)
    if (value.length > 1) {
      let filtered = MEDICINE_DATABASE.filter((medicine) => medicine.name.toLowerCase().includes(value.toLowerCase()))

      // Apply category filter
      if (selectedCategory !== "All") {
        filtered = filtered.filter((medicine) => medicine.category === selectedCategory)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price":
            return a.price - b.price
          case "rating":
            return b.rating - a.rating
          default:
            return a.name.localeCompare(b.name)
        }
      })

      setSuggestions(filtered.slice(0, 8))
    } else {
      setSuggestions([])
    }
  }

  // Add medicine to list
  const addMedicine = (medicineData: (typeof MEDICINE_DATABASE)[0]) => {
    const newMedicine: MedicineItem = {
      id: Date.now().toString(),
      name: medicineData.name,
      quantity: 1,
      type: "manual",
      price: medicineData.price,
      manufacturer: medicineData.manufacturer,
      category: medicineData.category,
    }

    setSelectedMedicines((prev) => [...prev, newMedicine])
    setMedicineSearch("")
    setSuggestions([])
  }

  // Update medicine quantity
  const updateMedicineQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setSelectedMedicines((prev) => prev.map((med) => (med.id === id ? { ...med, quantity } : med)))
  }

  // Remove medicine
  const removeMedicine = (id: string) => {
    setSelectedMedicines((prev) => prev.filter((med) => med.id !== id))
  }

  // Calculate total
  const calculateTotal = () => {
    const subtotal = selectedMedicines.reduce((total, med) => total + (med.price || 0) * med.quantity, 0)
    const deliveryFee = subtotal > 500 ? 0 : 50
    return { subtotal, deliveryFee, total: subtotal + deliveryFee }
  }

  // Submit order
  const handleSubmitOrder = async () => {
    if (!user?.uid) return

    if (selectedMethod === "prescription" && !prescriptionFile) {
      setError("Please upload a prescription file.")
      return
    }

    if (selectedMethod === "manual" && selectedMedicines.length === 0) {
      setError("Please add at least one medicine to your order.")
      return
    }

    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { total } = calculateTotal()
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

      const orderData = {
        items: selectedMedicines,
        prescriptionUrl: prescriptionFile ? URL.createObjectURL(prescriptionFile) : undefined,
        totalAmount: total,
        status: "pending" as const,
        deliveryAddress,
        paymentMethod,
        estimatedDelivery,
      }

      await saveMedicineOrder(user.uid, orderData)
      setSuccess("Order placed successfully! You will receive a confirmation shortly.")

      // Reset form
      setSelectedMethod(null)
      setPrescriptionFile(null)
      setPrescriptionPreview(null)
      setSelectedMedicines([])
      setMedicineSearch("")
      setDeliveryAddress("")
    } catch (error) {
      console.error("Error submitting order:", error)
      setError("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "processing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
      case "shipped":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <ProtectedRoute requireEmailVerification>
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5E8] via-[#F0F8FF] to-[#E6F3FF] dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900">
        <Navigation />

        <main className="max-w-7xl mx-auto p-4 md:p-6 pt-20 md:pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg mb-6 md:mb-8">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200">
                      Medicine Ordering
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      Order your medicines safely and conveniently
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="order" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="order">Place Order</TabsTrigger>
                <TabsTrigger value="history">Order History</TabsTrigger>
              </TabsList>

              <TabsContent value="order" className="space-y-6">
                {/* Success/Error Alerts */}
                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Method Selection */}
                {!selectedMethod && (
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMethod("prescription")}
                      className="cursor-pointer"
                    >
                      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-6 md:p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
                            Upload Prescription
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Upload your prescription for quick processing. We accept images and PDF files.
                          </p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                            <Upload className="w-4 h-4" />
                            <span>Drag & drop or click to upload</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMethod("manual")}
                      className="cursor-pointer"
                    >
                      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-6 md:p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
                            Enter Medicine Manually
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Search and add medicines manually with our smart autocomplete feature.
                          </p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
                            <Pill className="w-4 h-4" />
                            <span>Type medicine names</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                )}

                {/* Prescription Upload Section */}
                {selectedMethod === "prescription" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                      <CardHeader className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200">
                            Upload Your Prescription
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMethod(null)}
                            className="rounded-xl"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Change Method
                          </Button>
                        </div>
                        <CardDescription>
                          Upload a clear image or PDF of your prescription. Our pharmacists will verify and process your
                          order.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        {!prescriptionFile ? (
                          <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-2xl p-8 md:p-12 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 bg-blue-50/50 dark:bg-blue-900/10"
                          >
                            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                              Drop your prescription here
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">or click to browse files</p>
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                              Supports: JPEG, PNG, PDF (Max 5MB)
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Upload Progress */}
                            {isUploading && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                                  <span className="text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* File Preview */}
                            <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                              <div className="flex-shrink-0">
                                {prescriptionPreview ? (
                                  <img
                                    src={prescriptionPreview || "/placeholder.svg"}
                                    alt="Prescription preview"
                                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-slate-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                  {prescriptionFile.name}
                                </h4>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Manual Order Section */}
                {selectedMethod === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                      <CardHeader className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200">
                            Enter Medicine Manually
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMethod(null)}
                            className="rounded-xl"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Change Method
                          </Button>
                        </div>
                        <CardDescription>
                          Search and add medicines manually with our smart autocomplete feature.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <div className="flex items-center space-x-4">
                          <Input
                            value={medicineSearch}
                            onChange={(e) => handleMedicineSearch(e.target.value)}
                            placeholder="Search for medicines..."
                            className="flex-1"
                          />
                          <Button variant="outline" onClick={() => setMedicineSearch("")}>
                            <X className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        </div>

                        <div className="mt-4">
                          {suggestions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {suggestions.map((medicine) => (
                                <motion.div
                                  key={medicine.name}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="cursor-pointer"
                                  onClick={() => addMedicine(medicine)}
                                >
                                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-4 md:p-6">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                          <Pill className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                          <div>
                                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                              {medicine.name}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                              {medicine.manufacturer} - {medicine.category}
                                            </p>
                                          </div>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                          ${medicine.price}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              No medicines found. Please try searching again.
                            </p>
                          )}
                        </div>

                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                            Selected Medicines
                          </h3>
                          <Separator className="my-4" />

                          {selectedMedicines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedMedicines.map((medicine) => (
                                <motion.div
                                  key={medicine.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="cursor-pointer"
                                >
                                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-4 md:p-6">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                          <Pill className="w-6 h-6 text-green-600 dark:text-green-400" />
                                          <div>
                                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                              {medicine.name}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                              Quantity: {medicine.quantity}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Input
                                            type="number"
                                            value={medicine.quantity}
                                            onChange={(e) =>
                                              updateMedicineQuantity(medicine.id, Number.parseInt(e.target.value, 10))
                                            }
                                            className="w-16"
                                          />
                                          <Button variant="outline" onClick={() => removeMedicine(medicine.id)}>
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              No medicines selected. Please add medicines to your order.
                            </p>
                          )}
                        </div>

                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Order Summary</h3>
                          <Separator className="my-4" />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Subtotal</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">${calculateTotal().subtotal}</p>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Delivery Fee</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                ${calculateTotal().deliveryFee}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Total</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">${calculateTotal().total}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Delivery Address</h3>
                          <Separator className="my-4" />

                          <Input
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Enter your delivery address..."
                            className="w-full"
                          />
                        </div>

                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Payment Method</h3>
                          <Separator className="my-4" />

                          <div className="flex items-center space-x-4">
                            <Button
                              variant={paymentMethod === "card" ? "default" : "outline"}
                              onClick={() => setPaymentMethod("card")}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Credit Card
                            </Button>
                            <Button
                              variant={paymentMethod === "cash" ? "default" : "outline"}
                              onClick={() => setPaymentMethod("cash")}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Cash on Delivery
                            </Button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <Button
                            variant="default"
                            size="lg"
                            onClick={handleSubmitOrder}
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? "Submitting..." : "Place Order"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl text-slate-700 dark:text-slate-200">
                      Order History
                    </CardTitle>
                    <CardDescription>View your past medicine orders and their statuses.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    {orders.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orders.map((order) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
                              <CardHeader className="p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <div>
                                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                        Order #{order.id}
                                      </h3>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 md:p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {order.items.map((medicine) => (
                                    <motion.div
                                      key={medicine.id}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="cursor-pointer"
                                    >
                                      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-4 md:p-6">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                              <Pill className="w-6 h-6 text-green-600 dark:text-green-400" />
                                              <div>
                                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                                  {medicine.name}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                  Quantity: {medicine.quantity}
                                                </p>
                                              </div>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                              ${medicine.price * medicine.quantity}
                                            </Badge>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        No orders found. Please place an order to see your history.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
