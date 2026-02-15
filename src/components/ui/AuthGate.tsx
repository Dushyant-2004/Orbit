'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Preloader } from '@/components/ui/Preloader';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, LogIn } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();
  const [showPreloader, setShowPreloader] = useState(true);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate stars
  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      });
    }
    setStars(generatedStars);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!formData.name.trim()) {
          setFormError('Name is required');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          setFormError('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(formData.email, formData.password, formData.name);
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setFormError(err.message || 'Google sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show preloader first
  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} minDuration={2500} />;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // User is authenticated - show the main content
  if (user) {
    return <>{children}</>;
  }

  // User not authenticated - show auth screen with stars background
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
      }}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.3, 1],
              boxShadow: [
                '0 0 2px rgba(255, 255, 255, 0.5)',
                '0 0 8px rgba(0, 212, 255, 0.8)',
                '0 0 2px rgba(255, 255, 255, 0.5)',
              ],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Nebula effects */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="relative p-8 rounded-3xl backdrop-blur-xl"
          style={{
            background: 'rgba(20, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.1)',
          }}
        >
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 212, 255, 0.4)',
                    '0 0 40px rgba(168, 85, 247, 0.4)',
                    '0 0 20px rgba(0, 212, 255, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to ORBIT
            </h1>
            <p className="text-gray-400">
              {isSignUp ? 'Create an account to continue' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-3 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {formError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center"
              >
                {formError}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
              }}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-3 bg-dark-300 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
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
            Continue with Google
          </motion.button>

          {/* Toggle Form Type */}
          <p className="text-center text-gray-400 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormError('');
              }}
              className="text-neon-blue hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
