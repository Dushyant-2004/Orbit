'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { FadeIn } from '@/components/animations/PageTransition';

const benefits = [
  'Access exclusive member deals',
  'Track all your orders in one place',
  'Save items to your wishlist',
  'Faster checkout experience',
  'Early access to new products',
];

export default function SignupPage() {
  const { signUpWithEmail, signInWithGoogle, loading, error, googleSignInAvailable } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email');
    }
    
    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    if (!agreedToTerms) {
      errors.push('You must agree to the terms and conditions');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    await signUpWithEmail(formData.email, formData.password, formData.name);
  };

  const handleGoogleSignUp = async () => {
    if (!agreedToTerms) {
      setValidationErrors(['Please agree to the terms and conditions']);
      return;
    }
    await signInWithGoogle();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors([]);
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <FadeIn>
            <div className="hidden lg:block">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-sm text-gray-300">Join the Orbit Community</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Create Your <br />
                <span className="gradient-text">Account</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8">
                Join thousands of tech enthusiasts and get exclusive access to the 
                best products and deals.
              </p>

              {/* Benefits List */}
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '4.9', label: 'Rating' },
                  { value: '24/7', label: 'Support' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right Side - Form */}
          <FadeIn delay={0.2}>
            <div className="glass-card p-8 md:p-10 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-gray-400 mb-8">Create your free account</p>

              {/* Google Sign Up */}
              {googleSignInAvailable ? (
                <motion.button
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 glass-card hover:bg-white/10 transition-colors rounded-lg mb-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-white">Continue with Google</span>
                </motion.button>
              ) : (
                <div className="text-center text-sm text-gray-500 p-3 glass-card rounded-lg mb-6">
                  <p>Google Sign-Up is not available.</p>
                  <p className="mt-1 text-xs">Please sign up with email below.</p>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-sm">or sign up with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Error Messages */}
              <AnimatePresence>
                {(error || validationErrors.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 glass-card border border-red-500/30 rounded-lg"
                  >
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {validationErrors.map((err, i) => (
                      <p key={i} className="text-red-400 text-sm">{err}</p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="form-input pl-12"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="form-input pl-12"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="form-input pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Password strength: {strengthLabels[passwordStrength - 1] || 'Too weak'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="form-input pl-12"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-neon-blue hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-neon-blue hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gradient flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Sign In Link */}
              <p className="text-center text-gray-400 mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-neon-blue hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
