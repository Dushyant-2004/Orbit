'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { FadeIn } from '@/components/animations/PageTransition';
import confetti from 'canvas-confetti';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti on success
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  useEffect(() => {
    // Fetch order details if session ID exists
    if (sessionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/checkout?session_id=${sessionId}`);
      const data = await response.json();
      if (data.success) {
        setOrderDetails(data.session);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderNumber = `ORB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <FadeIn>
          <div className="glass-card p-8 md:p-12 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, duration: 0.6 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-blue/20 flex items-center justify-center"
            >
              <CheckCircle className="w-14 h-14 text-neon-green" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-8 text-lg"
            >
              Thank you for your purchase! Your order is being processed.
            </motion.p>

            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card-dark p-6 rounded-xl mb-8"
            >
              <p className="text-gray-400 text-sm mb-2">Order Number</p>
              <p className="text-2xl font-mono font-bold text-white">{orderNumber}</p>
            </motion.div>

            {/* Order Summary */}
            {orderDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 text-left"
              >
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="text-white font-medium">
                    ${orderDetails.amountTotal?.toFixed(2)}
                  </span>
                </div>
                {orderDetails.customerEmail && (
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{orderDetails.customerEmail}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: Package, label: 'Order Received', status: 'complete' },
                { icon: Truck, label: 'Processing', status: 'current' },
                { icon: Mail, label: 'Shipping Soon', status: 'pending' },
              ].map((step, index) => (
                <div key={step.label} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      step.status === 'complete'
                        ? 'bg-neon-green/20 text-neon-green'
                        : step.status === 'current'
                        ? 'bg-neon-blue/20 text-neon-blue'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <p className={`text-xs ${
                    step.status === 'pending' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-500 text-sm mb-8"
            >
              A confirmation email has been sent to your email address with order details and tracking information.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/orders"
                className="btn-ghost flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Track Order
              </Link>
              <Link
                href="/products"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </FadeIn>

        {/* Back home link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <Link
            href="/"
            className="text-gray-500 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 animate-pulse" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
