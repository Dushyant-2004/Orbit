'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Eye, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { FadeIn, ScrollReveal, StaggerContainer, StaggerItem, Float } from '@/components/animations/PageTransition';
import { ProductCard } from '@/components/products/ProductCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { HeroScrollVideo } from '@/components/ui/scroll-animated-video';

// Dynamic import for 3D scene (client-side only)
const Hero3DScene = dynamic(
  () => import('@/components/three/Product3DViewer').then((mod) => mod.Hero3DScene),
  { ssr: false }
);

// Mock featured products
const featuredProducts = [
  {
    _id: '1',
    name: 'Quantum Pro Headphones',
    slug: 'quantum-pro-headphones',
    description: 'Experience audio like never before',
    shortDescription: 'Premium wireless headphones with AI noise cancellation',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    tags: ['wireless', 'premium', 'ai'],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    arEnabled: true,
    stock: 50,
    sold: 1200,
    rating: 4.8,
    reviewCount: 342,
    creatorId: '1',
    features: [],
    specifications: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Neural Smart Watch',
    slug: 'neural-smart-watch',
    description: 'AI-powered fitness tracking',
    shortDescription: 'Next-gen smartwatch with health monitoring',
    price: 449.99,
    category: 'Wearables',
    tags: ['smart', 'fitness', 'ai'],
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    arEnabled: true,
    stock: 30,
    sold: 890,
    rating: 4.9,
    reviewCount: 567,
    creatorId: '1',
    features: [],
    specifications: {},
    dynamicPricing: {
      basePrice: 449.99,
      demandMultiplier: 1.0,
      timeMultiplier: 1.0,
      inventoryMultiplier: 1.0,
      competitorMultiplier: 1.0,
      finalPrice: 449.99,
      factors: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'Aura VR Glasses',
    slug: 'aura-vr-glasses',
    description: 'Immersive virtual reality',
    shortDescription: 'Ultra-lightweight VR headset',
    price: 599.99,
    originalPrice: 749.99,
    category: 'VR/AR',
    tags: ['vr', 'gaming', 'immersive'],
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500'],
    arEnabled: true,
    stock: 20,
    sold: 456,
    rating: 4.7,
    reviewCount: 234,
    creatorId: '2',
    features: [],
    specifications: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Nebula Sneakers',
    slug: 'nebula-sneakers',
    description: 'Style meets comfort',
    shortDescription: 'AI-designed performance footwear',
    price: 189.99,
    category: 'Fashion',
    tags: ['fashion', 'comfort', 'style'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    arEnabled: true,
    stock: 100,
    sold: 2340,
    rating: 4.6,
    reviewCount: 789,
    creatorId: '3',
    features: [],
    specifications: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Categories
const categories = [
  { name: 'Electronics', icon: Zap, color: 'from-neon-blue to-neon-purple', count: 234 },
  { name: 'Fashion', icon: Star, color: 'from-neon-purple to-neon-pink', count: 567 },
  { name: 'Home & Living', icon: ShoppingBag, color: 'from-neon-pink to-neon-orange', count: 345 },
  { name: 'Sports', icon: TrendingUp, color: 'from-neon-orange to-neon-green', count: 189 },
];

// Stats
const stats = [
  { label: 'Active Users', value: '50K+' },
  { label: 'Products', value: '10K+' },
  { label: 'AI Recommendations', value: '99%' },
  { label: 'Happy Customers', value: '45K+' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={null}>
          <Hero3DScene />
        </Suspense>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-400/50 via-transparent to-dark-400" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-50" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <FadeIn delay={0.2}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-gray-300">AI-Powered Shopping Experience</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
              <span className="text-white">The Future of</span>
              <br />
              <span className="gradient-text animate-gradient bg-[length:200%_auto]">E-Commerce</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12">
              Experience shopping like never before with AI-powered recommendations,
              immersive 3D product previews, and AR try-on features.
            </p>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link href="/products">
                  <motion.button
                    className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Products
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/ar-tryon">
                  <motion.button
                    className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-5 h-5" />
                    Try AR Experience
                  </motion.button>
                </Link>
              </MagneticButton>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={1}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-neon-blue rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-dark-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-400">Discover products tailored to your interests</p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <StaggerItem key={category.name}>
                  <Link href={`/products?category=${category.name.toLowerCase()}`}>
                    <motion.div
                      className="glass-card p-6 text-center group cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} p-0.5`}>
                        <div className="w-full h-full bg-dark-200 rounded-2xl flex items-center justify-center group-hover:bg-transparent transition-colors">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-medium mb-1">{category.name}</h3>
                      <p className="text-gray-400 text-sm">{category.count} products</p>
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  Featured Products
                </h2>
                <p className="text-gray-400">Handpicked by our AI for you</p>
              </div>
              <Link href="/products">
                <motion.button
                  className="btn-ghost flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product as any} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Animated Video Section */}
      <HeroScrollVideo
        title="Experience Shopping"
        subtitle="Like Never Before"
        meta="AI-Powered • 3D • AR"
        credits={
          <>
            <p>Powered by</p>
            <p>Advanced AI Technology</p>
          </>
        }
        media="https://videos.pexels.com/video-files/6151238/6151238-hd_1920_1080_30fps.mp4"
        overlay={{
          caption: "ORBIT • 2025",
          heading: "The Future of E-Commerce",
          paragraphs: [
            "Discover products with immersive 3D previews, AI-powered recommendations, and AR try-on experiences.",
            "Shop smarter with dynamic pricing and personalized suggestions tailored just for you.",
          ],
          extra: (
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity">
                Explore Products
              </Link>
              <Link href="/ar-tryon" className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-colors border border-white/20">
                Try AR Mode
              </Link>
            </div>
          ),
        }}
        initialBoxSize={320}
        scrollHeightVh={250}
        overlayBlur={12}
        smoothScroll={true}
      />

      {/* AI Features Section */}
      <section className="py-24 bg-dark-300/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-sm text-gray-300">Powered by AI</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Experience the Future
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our AI-powered features make shopping smarter, faster, and more personalized than ever before.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: '3D Product Preview',
                description: 'View products from every angle with our immersive 3D viewer before you buy.',
                color: 'neon-blue',
              },
              {
                icon: Sparkles,
                title: 'AI Recommendations',
                description: 'Get personalized product suggestions based on your preferences and browsing history.',
                color: 'neon-purple',
              },
              {
                icon: Zap,
                title: 'Dynamic Pricing',
                description: 'Our AI analyzes market trends to ensure you always get the best deals.',
                color: 'neon-pink',
              },
            ].map((feature, index) => (
              <ScrollReveal key={feature.title}>
                <motion.div
                  className="glass-card p-8 h-full"
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Float duration={3} distance={5}>
                    <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/20 flex items-center justify-center mb-6`}>
                      <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                    </div>
                  </Float>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative glass-card p-12 md:p-16 text-center overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-neon opacity-10" />
              <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                  Ready to Experience the Future?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                  Join thousands of shoppers who've already discovered a better way to shop online.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/products">
                    <motion.button
                      className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Shopping
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link href="/marketplace">
                    <motion.button
                      className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Become a Seller
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
