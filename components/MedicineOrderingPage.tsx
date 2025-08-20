"use client"
import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Search,
  Trash2,
  Star,
  Shield,
  Clock,
  Plus,
  Minus,
  Syringe,
  FlaskConical,
  ClipboardCheck,
  Truck,
  ReceiptText,
  ShoppingCartIcon,
  Filter,
} from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import {
  saveMedicineOrder,
  getMedicineOrders,
  getMedicineRecommendations,
  type MedicineItem,
  type MedicineOrder,
  type MedicineRecommendation,
} from "../lib/firestore"
import WishlistButton from "./WishlistButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Medicine {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  image: string
  rating: number
  reviews: number
  inStock: boolean
  prescription: boolean
  brand: string
  dosage?: string
  benefits: string[]
}

const medicines: Medicine[] = [
  {
    id: "1",
    name: "Vitamin D3 Supplements",
    category: "Vitamins",
    price: 24.99,
    originalPrice: 29.99,
    description: "High-quality Vitamin D3 for bone health and immune support",
    image: "/placeholder.svg?height=200&width=200&text=Vitamin+D3",
    rating: 4.8,
    reviews: 1250,
    inStock: true,
    prescription: false,
    brand: "HealthPlus",
    dosage: "1000 IU",
    benefits: ["Bone Health", "Immune Support", "Mood Enhancement"],
  },
  {
    id: "2",
    name: "Iron Supplements",
    category: "Minerals",
    price: 18.99,
    description: "Gentle iron formula for energy and blood health",
    image: "/placeholder.svg?height=200&width=200&text=Iron",
    rating: 4.6,
    reviews: 890,
    inStock: true,
    prescription: false,
    brand: "WellCare",
    dosage: "65mg",
    benefits: ["Energy Boost", "Blood Health", "Reduces Fatigue"],
  },
  {
    id: "3",
    name: "Omega-3 Fish Oil",
    category: "Supplements",
    price: 32.99,
    originalPrice: 39.99,
    description: "Premium fish oil for heart and brain health",
    image: "/placeholder.svg?height=200&width=200&text=Omega-3",
    rating: 4.9,
    reviews: 2100,
    inStock: true,
    prescription: false,
    brand: "OceanPure",
    dosage: "1000mg",
    benefits: ["Heart Health", "Brain Function", "Anti-inflammatory"],
  },
  {
    id: "4",
    name: "Probiotics Complex",
    category: "Digestive",
    price: 28.99,
    description: "Multi-strain probiotics for digestive wellness",
    image: "/placeholder.svg?height=200&width=200&text=Probiotics",
    rating: 4.7,
    reviews: 1560,
    inStock: true,
    prescription: false,
    brand: "GutHealth",
    dosage: "50 Billion CFU",
    benefits: ["Digestive Health", "Immune Support", "Gut Balance"],
  },
  {
    id: "5",
    name: "Magnesium Glycinate",
    category: "Minerals",
    price: 21.99,
    description: "Highly absorbable magnesium for relaxation and sleep",
    image: "/placeholder.svg?height=200&width=200&text=Magnesium",
    rating: 4.8,
    reviews: 980,
    inStock: true,
    prescription: false,
    brand: "RelaxWell",
    dosage: "400mg",
    benefits: ["Better Sleep", "Muscle Relaxation", "Stress Relief"],
  },
  {
    id: "6",
    name: "B-Complex Vitamins",
    category: "Vitamins",
    price: 16.99,
    description: "Complete B-vitamin complex for energy and metabolism",
    image: "/placeholder.svg?height=200&width=200&text=B-Complex",
    rating: 4.5,
    reviews: 750,
    inStock: false,
    prescription: false,
    brand: "EnergyBoost",
    dosage: "High Potency",
    benefits: ["Energy Production", "Metabolism", "Nervous System"],
  },
]

const categories = ["All", "Vitamins", "Minerals", "Supplements", "Digestive", "Pain Relief"]

const STEPS = [
  { id: 1, title: "Choose Method", description: "Select how you want to order", icon: FlaskConical },
  { id: 2, title: "Add Medicines", description: "Upload prescription or search manually", icon: Syringe },
  { id: 3, title: "Review Order", description: "Check your selected medicines", icon: ClipboardCheck },
  { id: 4, title: "Delivery Details", description: "Enter delivery and payment info", icon: Truck },
  { id: 5, title: "Confirmation", description: "Order placed successfully", icon: ReceiptText },
]

const MEDICINE_DATABASE = medicines

export default function MedicineOrderingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<"prescription" | "manual" | null>(null)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [medicineSearch, setMedicineSearch] = useState("")
  const [recommendations, setRecommendations] = useState<MedicineRecommendation[]>([])
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<MedicineOrder[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [showPrescriptionPopup, setShowPrescriptionPopup] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState<MedicineRecommendation[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<MedicineRecommendation[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [wishlist2, setWishlist2] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCart, setShowCart] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (medicineId: string) => {
    setCart((prev) => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1,
    }))
    setSuccessMessage("Item added to cart successfully! 🛒")
    setTimeout(() => setSuccessMessage(""), 5000) // Extended to 5 seconds
  }

  const removeFromCart = (medicineId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[medicineId] > 1) {
        newCart[medicineId]--
      } else {
        delete newCart[medicineId]
      }
      return newCart
    })
  }

  const toggleWishlist2 = (medicineId: string) => {
    setWishlist2((prev) => (prev.includes(medicineId) ? prev.filter((id) => id !== medicineId) : [...prev, medicineId]))
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [medicineId, quantity]) => {
      const medicine = medicines.find((m) => m.id === medicineId)
      return total + (medicine ? medicine.price * quantity : 0)
    }, 0)
  }

  // Load recommendations and orders
  useEffect(() => {
    if (user === null) {
      router.push("/auth")
    }
  }, [user, router])

  useEffect(() => {
    if (user === undefined) {
      return
    }
    loadRecommendations()
    if (user?.uid) {
      const unsubscribe = getMedicineOrders(user.uid, (userOrders) => {
        setOrders(userOrders)
      })
      return () => unsubscribe()
    }
  }, [user])

  // Load medicine recommendations
  const loadRecommendations = async (searchTerm = "") => {
    try {
      const recs = await getMedicineRecommendations(searchTerm)
      setRecommendations(recs.length > 0 ? recs : MEDICINE_DATABASE)
    } catch (error) {
      console.error("Error loading recommendations:", error)
      setRecommendations(MEDICINE_DATABASE)
    }
  }

  // Handle medicine search with recommendations
  const handleMedicineSearch = useCallback(async (value: string) => {
    setMedicineSearch(value)
    if (value.length > 1) {
      await loadRecommendations(value)
    } else {
      await loadRecommendations()
    }
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    setError(null)

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG) or PDF file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.")
      return
    }

    setPrescriptionFile(file)
    setIsUploading(true)
    setUploadProgress(0)

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

  // Add medicine to cart
  const addMedicine = (medicineData: MedicineRecommendation) => {
    const existingMedicine = selectedMedicines.find((med) => med.name === medicineData.name)

    if (existingMedicine) {
      updateMedicineQuantity(existingMedicine.id, existingMedicine.quantity + 1)
      setSuccess(`${medicineData.name} quantity updated in cart!`)
    } else {
      const newMedicine: MedicineItem = {
        id: Date.now().toString(),
        name: medicineData.name,
        quantity: 1,
        type: "manual",
        price: medicineData.price ?? 0,
        manufacturer: medicineData.manufacturer,
        category: medicineData.category,
      }
      setSelectedMedicines((prev) => [...prev, newMedicine])
      setSuccess(`${medicineData.name} added to cart!`)
    }

    // Add to recently viewed
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== medicineData.id)
      return [medicineData, ...filtered].slice(0, 5) // Keep only 5 most recent
    })

    setMedicineSearch("")

    // Auto-hide success message after 5 seconds instead of 2
    setTimeout(() => {
      setSuccess(null)
    }, 5000)
  }

  // Cart functions
  const clearCart = () => {
    setSelectedMedicines([])
    setSuccess("Cart cleared successfully!")
    setTimeout(() => {
      setSuccess(null)
    }, 5000)
  }

  const proceedToCheckout = () => {
    setIsCartOpen(false)
    if (selectedMedicines.length > 0) {
      setCurrentStep(3) // Go to review order step
    }
  }

  // Wishlist functions
  const toggleWishlist = (medicine: MedicineRecommendation) => {
    setWishlist((prev) => {
      const isInWishlist = prev.some((item) => item.id === medicine.id)
      if (isInWishlist) {
        setSuccess(`${medicine.name} removed from wishlist`)
        setTimeout(() => setSuccess(null), 5000)
        return prev.filter((item) => item.id !== medicine.id)
      } else {
        setSuccess(`${medicine.name} added to wishlist`)
        setTimeout(() => setSuccess(null), 5000)
        return [...prev, medicine]
      }
    })
  }

  const isInWishlist = (medicineId: string) => {
    return wishlist.some((item) => item.id === medicineId)
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
    const subtotal = selectedMedicines.reduce((total, med) => total + (med.price ?? 0) * med.quantity, 0)
    const deliveryFee = subtotal > 500 ? 0 : 50
    const tax = subtotal * 0.05 // 5% tax
    return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax }
  }

  // Submit order
  const handleSubmitOrder = async () => {
    if (!user?.uid) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { total } = calculateTotal()
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

      const orderData: any = {
        items: selectedMedicines,
        totalAmount: total,
        status: "pending" as const,
        deliveryAddress,
        paymentMethod,
        estimatedDelivery,
        userId: user.uid, // ✅ REQUIRED for Firestore rule
      }

      if (prescriptionFile) {
        orderData.prescriptionUrl = URL.createObjectURL(prescriptionFile)
      }

      const result = await saveMedicineOrder(user.uid, orderData)

      setOrderId(result.id)
      setSuccess("Order placed successfully! You will receive a confirmation shortly.")
      setCurrentStep(5)
    } catch (error) {
      console.error("Error submitting order:", error)
      setError("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleNextButtonClick = () => {
    // Check if prescription is required but not provided
    if (currentStep === 2 && selectedMethod === "prescription" && !prescriptionFile) {
      setShowPrescriptionPopup(true)
      return
    }

    // Check if any selected medicines require prescription
    const requiresPrescription = selectedMedicines.some((medicine) =>
      medicine.name.toLowerCase().includes("prescription required"),
    )

    if (requiresPrescription && !prescriptionFile) {
      setShowPrescriptionPopup(true)
      return
    }

    // If validation passes, proceed to next step
    if (canProceedToNextStep()) {
      if (currentStep === 4) {
        handleSubmitOrder()
      } else {
        nextStep()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Validation for each step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedMethod !== null
      case 2:
        if (selectedMethod === "prescription") {
          return prescriptionFile !== null
        } else {
          return selectedMedicines.length > 0
        }
      case 3:
        return selectedMedicines.length > 0
      case 4:
        return deliveryAddress.trim() !== "" && customerInfo.name.trim() !== "" && customerInfo.phone.trim() !== ""
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-700 dark:text-slate-200 mb-2">Medicine & Wellness Store</h1>
            <p className="text-slate-600 dark:text-slate-400">Your trusted source for health and wellness products</p>
          </div>
          <Button onClick={() => setShowCart(true)} className="relative bg-green-600 hover:bg-green-700 text-white">
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Cart ({getTotalItems()})
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{getTotalItems()}</Badge>
            )}
          </Button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search medicines, supplements, vitamins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-slate-500" />
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="bg-white/50 dark:bg-slate-800/50">
                      {categories.map((category) => (
                        <TabsTrigger key={category} value={category} className="text-sm">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
            <CardContent className="p-4 text-center">
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Free Shipping</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">On orders over $50</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Quality Assured</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">FDA approved products</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Fast Delivery</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">2-3 business days</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMedicines.map((medicine, index) => (
            <motion.div
              key={medicine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <img
                      src={medicine.image || "/placeholder.svg"}
                      alt={medicine.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <WishlistButton
                      isWishlisted={wishlist2.includes(medicine.id)}
                      onToggle={() => toggleWishlist2(medicine.id)}
                      className="absolute top-2 right-2"
                    />
                    {medicine.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        Save ${(medicine.originalPrice - medicine.price).toFixed(2)}
                      </Badge>
                    )}
                    {!medicine.inStock && (
                      <Badge className="absolute top-2 left-2 bg-gray-500 text-white">Out of Stock</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {medicine.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {medicine.rating} ({medicine.reviews})
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-slate-700 dark:text-slate-200">{medicine.name}</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {medicine.brand} {medicine.dosage && `• ${medicine.dosage}`}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-slate-600 dark:text-slate-400">
                    {medicine.description}
                  </CardDescription>

                  {/* Benefits */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {medicine.benefits.slice(0, 3).map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">${medicine.price}</span>
                      {medicine.originalPrice && (
                        <span className="text-sm text-slate-500 line-through">${medicine.originalPrice}</span>
                      )}
                    </div>
                    {medicine.prescription && (
                      <Badge variant="outline" className="text-xs">
                        Prescription Required
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {cart[medicine.id] ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(medicine.id)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium text-slate-700 dark:text-slate-200 min-w-[2rem] text-center">
                          {cart[medicine.id]}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(medicine.id)}
                          className="w-8 h-8 p-0"
                          disabled={!medicine.inStock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(medicine.id)}
                        disabled={!medicine.inStock}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        {medicine.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredMedicines.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg">
              <CardContent className="p-12">
                <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No products found</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search terms or browse different categories
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Shopping Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Shopping Cart</h2>
                <Button onClick={() => setShowCart(false)} className="bg-red-600 hover:bg-red-700 text-white">
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
              <div className="space-y-4">
                {Object.entries(cart).map(([medicineId, quantity]) => {
                  const medicine = medicines.find((m) => m.id === medicineId)
                  if (!medicine) return null
                  return (
                    <div key={medicineId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={medicine.image || "/placeholder.svg"}
                          alt={medicine.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{medicine.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">${medicine.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(medicineId)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium text-slate-700 dark:text-slate-200 min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(medicineId)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Button onClick={clearCart} className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200">${getTotalPrice()}</span>
                  <Button onClick={proceedToCheckout} className="bg-green-600 hover:bg-green-700 text-white">
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
