'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface PreloaderProps {
  onComplete: () => void;
  minDuration?: number;
}

export function Preloader({ onComplete, minDuration = 3000 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  // Generate stars on mount
  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 1,
      });
    }
    setStars(generatedStars);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Complete after minimum duration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress >= 100) {
        setIsExiting(true);
        setTimeout(onComplete, 800);
      }
    }, minDuration);

    return () => clearTimeout(timer);
  }, [progress, minDuration, onComplete]);

  // Check if ready to exit
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 800);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
          }}
        >
          {/* Animated stars background */}
          <div className="absolute inset-0">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.5, 1, 0],
                  scale: [0, 1, 1.2, 1, 0],
                  boxShadow: [
                    '0 0 0px rgba(255, 255, 255, 0)',
                    '0 0 10px rgba(255, 255, 255, 1)',
                    '0 0 20px rgba(0, 212, 255, 0.8)',
                    '0 0 10px rgba(168, 85, 247, 0.8)',
                    '0 0 0px rgba(255, 255, 255, 0)',
                  ],
                }}
                transition={{
                  duration: star.duration + 2,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div
                  className="w-full h-full rounded-full bg-white"
                  style={{
                    boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Nebula effect */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="relative mb-8"
            >
              {/* Glowing orbit rings */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="w-32 h-32 rounded-full border-2 border-neon-blue/30"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), inset 0 0 30px rgba(0, 212, 255, 0.1)',
                  }}
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="w-40 h-40 rounded-full border border-neon-purple/20"
                  style={{
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
                  }}
                />
              </motion.div>

              {/* Central logo */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  className="absolute w-20 h-20 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 212, 255, 0.5)',
                      '0 0 40px rgba(168, 85, 247, 0.5)',
                      '0 0 20px rgba(0, 212, 255, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative text-3xl font-bold text-white z-10">O</span>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-display font-bold tracking-wider mb-2"
              style={{
                background: 'linear-gradient(90deg, #00d4ff, #a855f7, #00d4ff)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 3s ease infinite',
              }}
            >
              ORBIT
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-sm tracking-widest mb-8"
            >
              FUTURISTIC E-COMMERCE
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.8 }}
              className="relative h-1 bg-dark-200 rounded-full overflow-hidden"
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-gray-500 text-sm"
            >
              {progress < 100 ? 'Loading experience...' : 'Welcome to the future'}
            </motion.p>
          </div>

          {/* Shooting stars */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, 200],
                y: [0, 100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 2 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <div
                className="w-12 h-0.5 bg-gradient-to-r from-white to-transparent -ml-12"
                style={{
                  transform: 'rotate(-30deg)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
