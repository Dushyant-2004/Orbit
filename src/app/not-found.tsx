'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-[150px] md:text-[200px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink leading-none animate-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            404
          </motion.h1>
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-1/4 left-0 w-4 h-4 rounded-full bg-neon-blue/40"
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-0 w-6 h-6 rounded-full bg-neon-purple/40"
            animate={{
              y: [0, 20, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-neon-pink/40"
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Browse Products
          </Link>
        </motion.div>

        {/* Search suggestion */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-500 text-sm mb-4">
            Looking for something specific?
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-neon-blue hover:underline"
          >
            <Search className="w-4 h-4" />
            Search our products
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
