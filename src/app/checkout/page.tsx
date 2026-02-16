'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';
import { 
  CreditCard, Lock, Truck, Gift, ArrowLeft, CheckCircle, 
  Shield, AlertCircle, Timer, Percent, X, Wallet, User, Mail, Phone, MapPin, Building, Map, Hash
} from 'lucide-react';
import { useCart } from '@/providers/CartProvider';
import { FadeIn } from '@/components/animations/PageTransition';
import { formatCurrency } from '@/lib/utils';
import { CartItem } from '@/types';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 99,
    icon: Truck,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 199,
    icon: Timer,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 349,
    icon: AlertCircle,
  },
];

export default function CheckoutPage() {
  const { items, subtotal: cartSubtotal, shipping: cartShipping, tax, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]);

  // Calculate actual subtotal from items
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping?.price || 0;
  const TAX_RATE = 0.08;
  const taxAmount = subtotal * TAX_RATE;
  const discountAmount = appliedCoupon ? subtotal * (couponDiscount / 100) : 0;
  const grandTotal = subtotal + shippingCost + taxAmount - discountAmount;

  // Handle Razorpay script load
  const handleRazorpayLoad = () => {
    console.log('Razorpay SDK loaded');
    setRazorpayLoaded(true);
  };

  // Check if Razorpay is already loaded (e.g., from cache)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayLoaded(true);
    }
  }, []);

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponError('');
    // Mock coupon validation
    const validCoupons: { [key: string]: number } = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'ORBIT25': 25,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponDiscount(validCoupons[couponCode.toUpperCase()]);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Handle shipping form change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Create Razorpay order and open payment modal
  const processPayment = async () => {
    console.log('processPayment called', { razorpayLoaded, hasRazorpay: !!window.Razorpay });
    
    if (!razorpayLoaded || !window.Razorpay) {
      setPaymentError('Payment system not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setPaymentError('');

    try {
      // Create order on backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(grandTotal * 100), // Convert to paise
          currency: 'INR',
          receipt: `orbit_${Date.now()}`,
          customerEmail: shippingInfo.email,
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          customerPhone: shippingInfo.phone,
          items: items.map((item: CartItem) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            line1: shippingInfo.address,
            line2: shippingInfo.apartment,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postalCode: shippingInfo.zipCode,
            country: shippingInfo.country,
          },
          subtotal,
          shipping: shippingCost,
          tax: taxAmount,
          discount: discountAmount,
        }),
      });

      const data = await response.json();
      console.log('Checkout API response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const razorpayKey = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      console.log('Using Razorpay key:', razorpayKey ? 'Key exists' : 'No key found');

      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Orbit',
        description: 'Premium Products',
        order_id: data.order.id,
        handler: async function (paymentResponse: any) {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/checkout', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              setOrderNumber(data.orderNumber || 'ORB-' + Math.random().toString(36).substr(2, 9).toUpperCase());
              setOrderComplete(true);
              clearCart();
            } else {
              setPaymentError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setPaymentError('Payment verification failed. Please contact support.');
          }
          setLoading(false);
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        notes: {
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
        },
        theme: {
          color: '#00D9FF',
          backdrop_color: '#0A0A0F',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      console.log('Razorpay instance created, opening modal...');
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setPaymentError(response.error.description || 'Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
    } catch (err: any) {
      console.error('Payment process error:', err);
      setPaymentError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Steps validation
  const canProceedToPayment = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.zipCode &&
      shippingInfo.phone
    );
  };

  // Empty cart check
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some products before proceeding to checkout</p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Order complete
  if (orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <FadeIn>
          <div className="glass-card p-12 text-center max-w-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-neon-green" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-gray-400 mb-6">
              Thank you for your purchase. Your order #{orderNumber} 
              has been placed successfully.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You will receive an email confirmation shortly with tracking details.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/orders" className="btn-ghost">
                View Orders
              </Link>
              <Link href="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Load Razorpay SDK */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={handleRazorpayLoad}
        onReady={() => {
          console.log('Razorpay script ready');
          if (window.Razorpay) {
            setRazorpayLoaded(true);
          }
        }}
        onError={() => {
          console.error('Failed to load Razorpay SDK');
          setPaymentError('Failed to load payment gateway. Please refresh the page.');
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products" className="p-2 glass-card rounded-lg hover:bg-white/10">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Checkout</h1>
          </div>
        </FadeIn>

        {/* Progress Steps */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-12">
            {[
              { step: 1, label: 'Shipping' },
              { step: 2, label: 'Review & Pay' },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <motion.button
                  onClick={() => item.step < currentStep && setCurrentStep(item.step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= item.step
                      ? 'bg-neon-blue text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {currentStep > item.step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </motion.button>
                <span className={`ml-2 hidden sm:block ${
                  currentStep >= item.step ? 'text-white' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                {index < 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > item.step ? 'bg-neon-blue' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card p-8 relative overflow-hidden"
                >
                  {/* Background gradient accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-full blur-3xl -z-1" />
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Shipping Information</h2>
                      <p className="text-sm text-gray-400">Where should we deliver your order?</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <User className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <User className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-5 group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Street Address *</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                        <MapPin className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6 group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Apartment, suite, etc. (optional)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                        <Building className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                      </div>
                      <input
                        type="text"
                        name="apartment"
                        value={shippingInfo.apartment}
                        onChange={handleShippingChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                        placeholder="Apt 4B"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-5 mb-8">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <Building className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="Mumbai"
                          required
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <Map className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="text"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="Maharashtra"
                          required
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">PIN Code *</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-focus-within:bg-neon-blue/20 transition-colors">
                          <Hash className="w-4 h-4 text-gray-400 group-focus-within:text-neon-blue" />
                        </div>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-16 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all"
                          placeholder="400001"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Delivery Speed</h3>
                      <p className="text-sm text-gray-400">Choose how fast you want your order</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    {shippingMethods.map((method, index) => (
                      <motion.button
                        key={method.id}
                        onClick={() => setSelectedShipping(method)}
                        className={`w-full flex items-center gap-4 p-5 rounded-xl transition-all ${
                          selectedShipping.id === method.id
                            ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-2 border-neon-blue shadow-lg shadow-neon-blue/10'
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-white/20'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedShipping.id === method.id 
                            ? 'bg-neon-blue text-white' 
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{method.name}</span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 text-xs bg-neon-green/20 text-neon-green rounded-full">Popular</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{method.description}</div>
                        </div>
                        <div className={`text-lg font-bold ${
                          selectedShipping.id === method.id ? 'text-neon-blue' : 'text-white'
                        }`}>
                          {formatCurrency(method.price)}
                        </div>
                        {selectedShipping.id === method.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review & Pay */}
              {currentStep === 2 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Payment Error */}
                  {paymentError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{paymentError}</p>
                    </div>
                  )}

                  {/* Shipping Summary */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">Shipping Details</h3>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-neon-blue hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-300">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {shippingInfo.address}
                      {shippingInfo.apartment && `, ${shippingInfo.apartment}`}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">{shippingInfo.email}</p>
                    {shippingInfo.phone && (
                      <p className="text-gray-400 text-sm">{shippingInfo.phone}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-gray-300">{selectedShipping.name}</p>
                      <p className="text-gray-400 text-sm">{selectedShipping.description}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">Payment Method</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Lock className="w-4 h-4" />
                        <span>Secure</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <Wallet className="w-8 h-8 text-neon-blue" />
                      <div>
                        <div className="text-white font-medium">Razorpay</div>
                        <div className="text-sm text-gray-400">UPI, Cards, Net Banking, Wallets</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 p-4 bg-neon-green/10 rounded-lg">
                      <Shield className="w-6 h-6 text-neon-green" />
                      <div>
                        <div className="text-white text-sm">100% Secure Payments</div>
                        <div className="text-xs text-gray-400">All transactions are encrypted</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {items.map((item: CartItem) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-300">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-white font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 btn-ghost"
                    >
                      Back
                    </button>
                    <motion.button
                      onClick={processPayment}
                      disabled={loading || !razorpayLoaded}
                      className="flex-1 btn-gradient disabled:opacity-70"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Pay ${formatCurrency(grandTotal)}`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="glass-card p-6 sticky top-28">
              <h3 className="text-lg font-medium text-white mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-blue rounded-full text-xs flex items-center justify-center text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                    </div>
                    <p className="text-sm text-gray-400">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-neon-green/10 border border-neon-green/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-neon-green" />
                      <span className="text-neon-green text-sm">{appliedCoupon}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 form-input text-sm"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-sm mt-1">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-neon-green">
                    <span>Discount ({couponDiscount}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{paymentError}</p>
                </div>
              )}

              {/* Pay Button */}
              {currentStep === 2 && (
                <motion.button
                  onClick={processPayment}
                  disabled={loading || !razorpayLoaded}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <span className="relative z-10">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : !razorpayLoaded ? (
                      'Loading Payment...'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Pay {formatCurrency(grandTotal)}
                      </span>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              )}

              {/* Continue to Payment button for Step 1 */}
              {currentStep === 1 && (
                <motion.button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToPayment()}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-neon-blue to-neon-purple disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: canProceedToPayment() ? 1.02 : 1 }}
                  whileTap={{ scale: canProceedToPayment() ? 0.98 : 1 }}
                >
                  Continue to Payment
                </motion.button>
              )}

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 justify-center">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
