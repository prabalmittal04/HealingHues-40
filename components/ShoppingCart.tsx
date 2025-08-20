"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart as CartIcon,
  X,
  Plus,
  Minus,
  Trash2,
  Package,
  CreditCard,
  ArrowRight,
  Heart,
  AlertCircle,
} from "lucide-react"
import type { MedicineItem } from "../lib/firestore"

interface ShoppingCartProps {
  items: MedicineItem[]
  wishlist: any[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onProceedToCheckout: () => void
  onAddFromWishlist: (medicine: any) => void
  onRemoveFromWishlist: (medicineId: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function ShoppingCart({
  items,
  wishlist,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onAddFromWishlist,
  onRemoveFromWishlist,
  isOpen,
  onToggle,
}: ShoppingCartProps) {
  const [isHovered, setIsHovered] = useState(false)

  const calculateTotal = () => {
    const subtotal = items.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0)
    const deliveryFee = subtotal > 500 ? 0 : 50
    const tax = subtotal * 0.05 // 5% tax
    return { subtotal, deliveryFee, tax, total: subtotal + deliveryFee + tax }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <CartIcon className="w-6 h-6" />
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </motion.div>
          )}
        </div>
        
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
            >
              {totalItems > 0 ? `${totalItems} items in cart` : "Your cart is empty"}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={onToggle}
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CartIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Shopping Cart</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onToggle}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

                             {/* Cart Items */}
               <div className="flex-1 overflow-y-auto p-6">
                 {/* Cart Items */}
                 {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CartIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Add some medicines to get started
                    </p>
                    <motion.button
                      onClick={onToggle}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Shopping
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.manufacturer} • {item.category}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                ₹{(item.price ?? 0).toFixed(2)}
                              </span>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <span className="w-8 text-center font-semibold text-gray-800 dark:text-gray-200">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                                     </div>
                 )}

                 {/* Wishlist Section */}
                 {wishlist.length > 0 && (
                   <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                       <Heart className="w-5 h-5 text-red-500" />
                       <span>Saved for Later ({wishlist.length})</span>
                     </h3>
                     <div className="space-y-3">
                       {wishlist.map((item, index) => (
                         <motion.div
                           key={item.id}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex-1 min-w-0">
                               <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm">
                                 {item.name}
                               </h4>
                               <p className="text-xs text-gray-600 dark:text-gray-400">
                                 {item.manufacturer} • {item.category}
                               </p>
                               <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                 ₹{(item.price ?? 0).toFixed(2)}
                               </span>
                             </div>
                             <div className="flex items-center space-x-2">
                               <motion.button
                                 onClick={() => onAddFromWishlist(item)}
                                 className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                               >
                                 <Plus className="w-3 h-3" />
                               </motion.button>
                               <motion.button
                                 onClick={() => onRemoveFromWishlist(item.id)}
                                 className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                               >
                                 <Trash2 className="w-3 h-3" />
                               </motion.button>
                             </div>
                           </div>
                         </motion.div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

              {/* Cart Summary */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold">₹{calculateTotal().subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                      <span className="font-semibold">₹{calculateTotal().deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
                      <span className="font-semibold">₹{calculateTotal().tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800 dark:text-gray-200">Total</span>
                        <span className="text-green-600 dark:text-green-400">
                          ₹{calculateTotal().total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                                     {/* Action Buttons */}
                   <div className="space-y-3">
                     <motion.button
                       onClick={onProceedToCheckout}
                       className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <CreditCard className="w-5 h-5" />
                       <span>Proceed to Checkout</span>
                       <ArrowRight className="w-5 h-5" />
                     </motion.button>

                     <motion.button
                       onClick={onClearCart}
                       className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2"
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <Trash2 className="w-5 h-5" />
                       <span>Clear Cart</span>
                     </motion.button>
                   </div>

                   {/* Quick Actions */}
                   <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h4>
                     <div className="grid grid-cols-2 gap-2">
                       <motion.button
                         onClick={onToggle}
                         className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                       >
                         Continue Shopping
                       </motion.button>
                       <motion.button
                         onClick={onToggle}
                         className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                       >
                         Save for Later
                       </motion.button>
                     </div>
                   </div>

                  {/* Save for Later */}
                  <div className="mt-4 text-center">
                    <motion.button
                      onClick={onToggle}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors flex items-center justify-center space-x-1 mx-auto"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Continue Shopping</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
