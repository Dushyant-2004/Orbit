'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/providers/CartProvider';
import { formatCurrency } from '@/lib/utils';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-400/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md glass-morphism-dense border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neon-blue" />
                <h2 className="text-xl font-display font-bold text-white">Your Cart</h2>
                <span className="px-2 py-0.5 text-xs bg-neon-blue/20 text-neon-blue rounded-full">
                  {cart.items.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mb-4 rounded-full bg-white/5 flex items-center justify-center"
                  >
                    <ShoppingBag className="w-10 h-10 text-gray-500" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Discover our amazing products</p>
                  <Link href="/products" onClick={onClose}>
                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Shopping
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex gap-4 p-4 glass-card"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{item.name}</h4>
                          {item.selectedVariants && (
                            <p className="text-gray-400 text-sm">
                              {Object.entries(item.selectedVariants)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                          <p className="text-neon-blue font-medium mt-1">
                            {formatCurrency(item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-gray-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Clear Cart
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatCurrency(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>{formatCurrency(cart.tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{cart.shipping === 0 ? 'FREE' : formatCurrency(cart.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-white font-medium text-lg pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="gradient-text">{formatCurrency(cart.total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" onClick={onClose}>
                  <motion.button
                    className="w-full btn-primary flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full btn-ghost text-center"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
