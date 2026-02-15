'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-dark-400 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          className="relative mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neon-blue" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-white font-display text-xl">Loading</p>
          <p className="text-gray-500 text-sm mt-1">Please wait...</p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-blue"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
