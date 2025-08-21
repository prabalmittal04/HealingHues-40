"use client"
import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Heart,
  Shield,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  TrendingUp,
  Award,
  Syringe,
  FlaskConical,
  ClipboardCheck,
  Truck,
  Wallet,
  ReceiptText,
  ShoppingCart,
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
import ShoppingCartComponent from "./ShoppingCart"
import WishlistButton from "./WishlistButton"

// Enhanced medicine database with images and more details
const MEDICINE_DATABASE: MedicineRecommendation[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    price: 25,
    manufacturer: "GSK",
    category: "Pain Relief",
    rating: 4.5,
    image: "https://m.media-amazon.com/images/I/91bz6RZlHZL.jpg",
    description: "Effective pain relief and fever reducer",
    inStock: true,
    popularity: 95,
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    price: 35,
    manufacturer: "Pfizer",
    category: "Pain Relief",
    rating: 4.3,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/1/QV/MZ/FT/151234371/ibuprofen-400-mg-bp-tablets-500x500.webp",
    description: "Anti-inflammatory pain reliever",
    inStock: true,
    popularity: 88,
  },
  {
    id: "3",
    name: "Aspirin 75mg",
    price: 20,
    manufacturer: "Bayer",
    category: "Cardiovascular",
    rating: 4.4,
    image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Heart health and blood thinner",
    inStock: true,
    popularity: 82,
  },
  {
    id: "4",
    name: "Amoxicillin 250mg(Prescription required)",
    price: 45,
    manufacturer: "Abbott",
    category: "Antibiotic",
    rating: 4.2,
    image:
      "https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/bodminug3xmfcubbrdix.jpg?dpr=2&format=auto",
    description: "Broad-spectrum antibiotic",
    inStock: true,
    popularity: 75,
  },
  {
    id: "5",
    name: "Metformin 500mg",
    price: 55,
    manufacturer: "Novartis",
    category: "Diabetes",
    rating: 4.6,
    image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Diabetes management medication",
    inStock: true,
    popularity: 90,
  },
  {
    id: "6",
    name: "Vitamin D3 1000IU",
    price: 30,
    manufacturer: "Nature's Way",
    category: "Vitamins",
    rating: 4.7,
    image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Essential vitamin for bone health",
    inStock: true,
    popularity: 85,
  },
  {
    id: "7",
    name: "Omega-3 Fish Oil",
    price: 65,
    manufacturer: "Nordic Naturals",
    category: "Supplements",
    rating: 4.8,
    image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Heart and brain health supplement",
    inStock: true,
    popularity: 78,
  },
  {
    id: "8",
    name: "Probiotics Complex",
    price: 55,
    manufacturer: "Garden of Life",
    category: "Digestive Health",
    rating: 4.6,
    image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Digestive and immune support",
    inStock: true,
    popularity: 72,
  },
]

const STEPS = [
  { id: 1, title: "Choose Method", description: "Select how you want to order", icon: FlaskConical },
  { id: 2, title: "Add Medicines", description: "Upload prescription or search manually", icon: Syringe },
  { id: 3, title: "Review Order", description: "Check your selected medicines", icon: ClipboardCheck },
  { id: 4, title: "Delivery Details", description: "Enter delivery and payment info", icon: Truck },
  { id: 5, title: "Confirmation", description: "Order placed successfully", icon: ReceiptText },
]

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
  // Load recommendations and orders
  useEffect(() => {
    if (user === null) {
      router.push("/auth")
    }
  }, [user, router])

  if (user === undefined) {
    return null // or a loading spinner
  }

  // Load recommendations and orders
  useEffect(() => {
    loadRecommendations()
    if (user?.uid) {
      const unsubscribe = getMedicineOrders(user.uid, (userOrders) => {
        setOrders(userOrders)
      })
      return unsubscribe
    }
  }, [user?.uid])

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

  useEffect(() => {
    if (user === null) {
      router.push("/auth")
      return
    }

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
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-green-200/50 dark:border-green-800/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  HealingHues
                </h1>
                <p className="text-xs text-green-600 dark:text-green-400">Your Health, Our Priority</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-6">
              <motion.div
                className="flex items-center space-x-4 text-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <Award className="w-4 h-4" />
                  <span>Licensed</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <Clock className="w-4 h-4" />
                  <span>24/7</span>
                </div>
              </motion.div>

              {/* Cart Indicator */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cart ({selectedMedicines.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                  {selectedMedicines.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {selectedMedicines.reduce((sum, item) => sum + item.quantity, 0)}
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="flex items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.5 + index * 0.1 }}
                >
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }
                  `}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${currentStep >= step.id ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                      w-12 h-1 mx-4 rounded-full transition-all duration-300
                      ${currentStep > step.id ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}
                    `}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: Users, label: "50K+ Customers", value: "50,000+", color: "from-blue-500 to-blue-600" },
            { icon: Clock, label: "24/7 Delivery", value: "Always", color: "from-green-500 to-green-600" },
            { icon: Star, label: "Rating", value: "4.9/5", color: "from-yellow-500 to-yellow-600" },
            { icon: Shield, label: "Secure", value: "100%", color: "from-purple-500 to-purple-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-green-200/50 dark:border-green-800/50"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 + index * 0.1 }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{stat.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Choose Method */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod("prescription")}
                  className={`cursor-pointer transition-all duration-300 ${selectedMethod === "prescription" ? "ring-4 ring-green-500/50" : ""}`}
                >
                  <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-green-200/50 dark:border-green-800/50 h-full">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Camera className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Upload Prescription</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Upload your prescription for quick processing. Our licensed pharmacists will verify and process
                      your order safely.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                      <Upload className="w-5 h-5" />
                      <span className="font-medium">Drag & drop or click to upload</span>
                    </div>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span>✓ JPEG, PNG, PDF</span>
                      <span>✓ Max 5MB</span>
                      <span>✓ Secure</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod("manual")}
                  className={`cursor-pointer transition-all duration-300 ${selectedMethod === "manual" ? "ring-4 ring-green-500/50" : ""}`}
                >
                  <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-green-200/50 dark:border-green-800/50 h-full">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      whileHover={{ rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Search className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Search Medicines</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Search and add medicines manually with our smart autocomplete feature and AI-powered
                      recommendations.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">Smart recommendations</span>
                    </div>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span>✓ 10,000+ medicines</span>
                      <span>✓ Real-time search</span>
                      <span>✓ Best prices</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Step 2: Add Medicines */}
            {currentStep === 2 && (
              <div className="space-y-8">
                {selectedMethod === "prescription" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50 dark:border-green-800/50"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                      Upload Your Prescription
                    </h3>

                    {!prescriptionFile ? (
                      <motion.div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-2xl p-12 text-center cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 bg-green-50/50 dark:bg-green-900/10"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Upload className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        </motion.div>
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Drop your prescription here
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">or click to browse files</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Supports: JPEG, PNG, PDF (Max 5MB)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          className="hidden"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {isUploading && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                              <span className="text-green-600 dark:text-green-400">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <motion.div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-start space-x-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex-shrink-0">
                            {prescriptionPreview ? (
                              <img
                                src={prescriptionPreview || "/placeholder.svg"}
                                alt="Prescription preview"
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <FileText className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                              {prescriptionFile.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600 dark:text-green-400">Upload successful</span>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => {
                              setPrescriptionFile(null)
                              setPrescriptionPreview(null)
                            }}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {selectedMethod === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50 dark:border-green-800/50"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Search Medicines</h3>

                    <div className="relative mb-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={medicineSearch}
                          onChange={(e) => handleMedicineSearch(e.target.value)}
                          placeholder="Search for medicines, vitamins, supplements..."
                          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
                        />
                        {medicineSearch && (
                          <motion.button
                            onClick={() => {
                              setMedicineSearch("")
                              loadRecommendations()
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Medicine Recommendations */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {medicineSearch ? "Search Results" : "Popular Medicines"}
                        </h4>
                        <div className="flex items-center space-x-4">
                          {selectedMedicines.length > 0 && (
                            <motion.button
                              onClick={() => setIsCartOpen(true)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>View Cart ({selectedMedicines.reduce((sum, item) => sum + item.quantity, 0)})</span>
                            </motion.button>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <TrendingUp className="w-4 h-4" />
                            <span>Trending</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.slice(0, 6).map((medicine, index) => (
                          <motion.div
                            key={medicine.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300"
                            onClick={() => addMedicine(medicine)}
                          >
                            <div className="flex items-start space-x-3">
                              <img
                                src={medicine.image || "/placeholder.svg"}
                                alt={medicine.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {medicine.name}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {medicine.manufacturer}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-500">{medicine.rating}</span>
                                  </div>
                                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                                    {medicine.category}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                    ₹{(medicine.price ?? 0).toFixed(2)}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <WishlistButton
                                      medicine={medicine}
                                      isInWishlist={isInWishlist(medicine.id)}
                                      onToggleWishlist={toggleWishlist}
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span>Recently Viewed</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {recentlyViewed.map((medicine, index) => (
                            <motion.div
                              key={medicine.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-xl"
                              onClick={() => addMedicine(medicine)}
                            >
                              <div className="flex items-start space-x-3">
                                <img
                                  src={medicine.image || "/placeholder.svg"}
                                  alt={medicine.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm">
                                    {medicine.name}
                                  </h5>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {medicine.manufacturer}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                      ₹{(medicine.price ?? 0).toFixed(2)}
                                    </span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Quick Cart Summary */}
                    {selectedMedicines.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">Cart Summary</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedMedicines.length} {selectedMedicines.length === 1 ? "item" : "items"} • Total: ₹
                              {selectedMedicines
                                .reduce((total, med) => total + (med.price ?? 0) * med.quantity, 0)
                                .toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => setIsCartOpen(true)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Cart
                            </motion.button>
                            <motion.button
                              onClick={() => setCurrentStep(3)}
                              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Checkout
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50 dark:border-green-800/50"
              >
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Review Your Order</h3>

                {selectedMedicines.length > 0 ? (
                  <div className="space-y-4">
                    {selectedMedicines.map((medicine, index) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                            <Pill className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{medicine.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {medicine.manufacturer} • {medicine.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => updateMedicineQuantity(medicine.id, medicine.quantity - 1)}
                              className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={medicine.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="w-8 text-center font-semibold">{medicine.quantity}</span>
                            <motion.button
                              onClick={() => updateMedicineQuantity(medicine.id, medicine.quantity + 1)}
                              className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              ₹{(medicine.price ?? 0 * medicine.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">₹{medicine.price ?? 0} each</p>
                          </div>

                          <motion.button
                            onClick={() => removeMedicine(medicine.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}

                    {/* Order Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                          <span className="font-semibold">₹{calculateTotal().subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                          <span className="font-semibold">₹{calculateTotal().deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
                          <span className="font-semibold">₹{calculateTotal().tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-green-200 dark:border-green-800 pt-2">
                          <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-800 dark:text-gray-200">Total</span>
                            <span className="text-green-600 dark:text-green-400">
                              ₹{calculateTotal().total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No medicines in your order yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Delivery Details */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Customer Information */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50 dark:border-green-800/50">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-4 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50 dark:border-green-800/50">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Delivery Address</h3>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter your complete delivery address including landmark, city, and pincode"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50 dark:border-green-800/50">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentMethod === "card"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            paymentMethod === "card" ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <CreditCard
                            className={`w-6 h-6 ${paymentMethod === "card" ? "text-white" : "text-gray-500"}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Credit/Debit Card</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pay securely with your card</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() => setPaymentMethod("cash")}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentMethod === "cash"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            paymentMethod === "cash" ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <Wallet className={`w-6 h-6 ${paymentMethod === "cash" ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Cash on Delivery</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4"
                >
                  Order Placed Successfully!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
                >
                  Thank you for choosing HealingHues. Your order has been received and will be processed shortly.
                </motion.p>

                {orderId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-lg border border-green-200/50 dark:border-green-800/50"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Order Details</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Order ID: #{orderId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total: ₹{calculateTotal().total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery: 2-3 business days</p>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedMethod(null)
                    setSelectedMedicines([])
                    setPrescriptionFile(null)
                    setPrescriptionPreview(null)
                    setDeliveryAddress("")
                    setCustomerInfo({ name: "", phone: "", email: "" })
                    setOrderId(null)
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Place Another Order
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <motion.div
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-lg border border-gray-200 dark:border-gray-700"
              }`}
              whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
              whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </div>
            </motion.button>

            <motion.button
              onClick={handleNextButtonClick}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                canProceedToNextStep() && !isSubmitting
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              whileHover={canProceedToNextStep() && !isSubmitting ? { scale: 1.05 } : {}}
              whileTap={canProceedToNextStep() && !isSubmitting ? { scale: 0.95 } : {}}
            >
              <div className="flex items-center space-x-2">
                <span>{isSubmitting ? "Processing..." : currentStep === 4 ? "Place Order" : "Next"}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-xl shadow-lg max-w-sm"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg max-w-sm"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
                <button onClick={() => setSuccess(null)} className="ml-auto">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prescription Required Popup */}
        <AnimatePresence>
          {showPrescriptionPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPrescriptionPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Prescription Required</h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Some medicines in your cart require a valid prescription to proceed.
                  </p>

                  <div className="space-y-3">
                    {/* Option 1: Upload Prescription */}
                    <button
                      onClick={() => {
                        setShowPrescriptionPopup(false)
                        setCurrentStep(2) // Go back to prescription upload step
                        setSelectedMethod("prescription")
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Prescription</span>
                    </button>

                    {/* Option 2: Remove Prescription Medicines */}
                    <button
                      onClick={() => {
                        // Remove medicines that require prescription
                        const filteredMedicines = selectedMedicines.filter(
                          (medicine) => !medicine.name.toLowerCase().includes("prescription required"),
                        )
                        setSelectedMedicines(filteredMedicines)
                        setShowPrescriptionPopup(false)

                        // Show success message
                        setSuccess("Prescription medicines removed from your cart. You can now proceed.")
                        setTimeout(() => setSuccess(null), 5000)
                      }}
                      className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Prescription Medicines</span>
                    </button>

                    {/* Option 3: Get Help with Prescription */}
                    <button
                      onClick={() => {
                        setShowPrescriptionPopup(false)
                        // Navigate to medical help page
                        window.open("/medical-help", "_blank")
                      }}
                      className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Syringe className="w-4 h-4" />
                      <span>Get Medical Consultation</span>
                    </button>

                    {/* Option 4: Cancel */}
                    <button
                      onClick={() => setShowPrescriptionPopup(false)}
                      className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shopping Cart Component */}
        <ShoppingCartComponent
          items={selectedMedicines}
          wishlist={wishlist}
          onUpdateQuantity={updateMedicineQuantity}
          onRemoveItem={removeMedicine}
          onClearCart={clearCart}
          onProceedToCheckout={proceedToCheckout}
          onAddFromWishlist={addMedicine}
          onRemoveFromWishlist={(medicineId) => {
            setWishlist((prev) => prev.filter((item) => item.id !== medicineId))
          }}
          isOpen={isCartOpen}
          onToggle={() => setIsCartOpen(!isCartOpen)}
        />
      </main>
    </div>
  )
}
