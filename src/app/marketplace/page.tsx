'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, Filter, Grid, List, Star, Heart, ShoppingCart, Plus,
  TrendingUp, Award, Sparkles, ChevronDown, X, Instagram, Twitter, Globe
} from 'lucide-react';
import { FadeIn, ScrollReveal, StaggerContainer } from '@/components/animations/PageTransition';
import { ProductCard } from '@/components/products/ProductCard';

const creators = [
  {
    id: '1',
    name: 'Alex Chen',
    handle: '@alexcreates',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    bio: 'Digital artist & product designer creating futuristic tech accessories',
    followers: 12500,
    totalSales: 450,
    rating: 4.9,
    verified: true,
    products: 24,
    social: { instagram: true, twitter: true, website: true },
  },
  {
    id: '2',
    name: 'Sarah Kim',
    handle: '@sarahkdesigns',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    bio: 'Industrial designer focused on sustainable fashion tech',
    followers: 8300,
    totalSales: 320,
    rating: 4.8,
    verified: true,
    products: 18,
    social: { instagram: true, twitter: false, website: true },
  },
  {
    id: '3',
    name: 'Marcus Lee',
    handle: '@marcusprint',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    bio: '3D artist specializing in wearable tech and audio gear',
    followers: 15200,
    totalSales: 680,
    rating: 4.95,
    verified: true,
    products: 32,
    social: { instagram: true, twitter: true, website: false },
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    handle: '@emmatech',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800',
    bio: 'Tech enthusiast creating innovative smart home accessories',
    followers: 9800,
    totalSales: 410,
    rating: 4.85,
    verified: false,
    products: 15,
    social: { instagram: true, twitter: true, website: true },
  },
];

const marketplaceProducts = [
  {
    id: '1',
    name: 'Neon Pulse Headphones',
    slug: 'neon-pulse-headphones',
    description: 'Limited edition creator-designed headphones with RGB lighting',
    price: 249,
    originalPrice: 299,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    rating: 4.9,
    reviews: 128,
    category: 'Audio',
    creatorId: '1',
    creatorName: 'Alex Chen',
    exclusive: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Holographic Smartwatch Band',
    slug: 'holographic-smartwatch-band',
    description: 'Futuristic holographic band compatible with all major smartwatches',
    price: 79,
    originalPrice: 99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    rating: 4.7,
    reviews: 89,
    category: 'Wearables',
    creatorId: '2',
    creatorName: 'Sarah Kim',
    exclusive: false,
    featured: true,
  },
  {
    id: '3',
    name: 'Crystal Clear VR Lens',
    slug: 'crystal-clear-vr-lens',
    description: 'Premium VR lens upgrade for enhanced clarity',
    price: 149,
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400'],
    rating: 4.8,
    reviews: 156,
    category: 'VR/AR',
    creatorId: '3',
    creatorName: 'Marcus Lee',
    exclusive: true,
    featured: false,
  },
  {
    id: '4',
    name: 'Eco-Tech Phone Stand',
    slug: 'eco-tech-phone-stand',
    description: 'Sustainable bamboo phone stand with wireless charging',
    price: 59,
    images: ['https://images.unsplash.com/photo-1586953208270-767889fa9b8d?w=400'],
    rating: 4.6,
    reviews: 67,
    category: 'Accessories',
    creatorId: '4',
    creatorName: 'Emma Rodriguez',
    exclusive: false,
    featured: false,
  },
];

const categories = ['All', 'Audio', 'Wearables', 'VR/AR', 'Accessories', 'Smart Home'];
const sortOptions = ['Trending', 'Newest', 'Best Selling', 'Price: Low to High', 'Price: High to Low'];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'products' | 'creators'>('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = marketplaceProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-neon-pink" />
              <span className="text-sm text-gray-300">Creator Marketplace</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Discover Unique <br />
              <span className="gradient-text">Creator Products</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Shop exclusive products from independent creators and designers. 
              Support the community and own something truly unique.
            </p>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Active Creators', value: '2,500+', icon: Award },
              { label: 'Products Listed', value: '15,000+', icon: ShoppingCart },
              { label: 'Monthly Sales', value: '$2.5M+', icon: TrendingUp },
              { label: 'Happy Customers', value: '50,000+', icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-neon-blue" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'products'
                  ? 'bg-neon-blue text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Products
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('creators')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'creators'
                  ? 'bg-neon-blue text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Creators
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card border-none rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>

          {/* View Mode and Filters */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
              >
                <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-white' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10' : ''}`}
              >
                <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-white' : 'text-gray-400'}`} />
              </button>
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 glass-card rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Filter className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-card p-6 flex flex-wrap items-center gap-6">
                {/* Categories */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-neon-blue text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 glass-card border-none rounded-lg text-white bg-transparent focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option} className="bg-dark-400">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {/* Featured Banner */}
            <ScrollReveal>
              <div className="glass-card overflow-hidden mb-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-transparent to-neon-blue/20" />
                <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <span className="px-3 py-1 text-xs font-medium bg-neon-pink/20 text-neon-pink rounded-full">
                      Featured Creator
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2">
                      Marcus Lee Collection
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Explore the latest drop from one of our top creators. 
                      Limited edition tech gear that sells out fast.
                    </p>
                    <Link
                      href="/marketplace/creators/marcus"
                      className="inline-flex items-center gap-2 btn-primary"
                    >
                      View Collection
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-20 h-20 glass-card rounded-lg overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-155017182738${i}-a83a8bd57fbe?w=100`}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Product Grid */}
            <StaggerContainer className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <div className="glass-card overflow-hidden group">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-dark-300 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.exclusive && (
                        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-neon-purple text-white rounded-full">
                          Exclusive
                        </span>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 glass-card rounded-lg hover:bg-white/20">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 glass-card rounded-lg hover:bg-white/20">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/marketplace/creators/${product.creatorId}`} className="text-sm text-neon-blue hover:underline">
                        by {product.creatorName}
                      </Link>
                      <h3 className="text-lg font-medium text-white mt-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm text-gray-400">{product.rating}</span>
                        </div>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm text-gray-400">{product.reviews} reviews</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-white">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <motion.button
                          className="p-2 bg-neon-blue rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Creators Tab */}
        {activeTab === 'creators' && (
          <div>
            {/* Top Creators Banner */}
            <ScrollReveal>
              <div className="glass-card p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-medium text-white">Top Creators This Month</span>
                </div>
                <div className="flex -space-x-4">
                  {creators.slice(0, 5).map((creator, index) => (
                    <motion.div
                      key={creator.id}
                      className="relative"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full border-2 border-dark-400 object-cover"
                      />
                      {creator.verified && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-blue rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white fill-white" />
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Creator Grid */}
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {filteredCreators.map((creator) => (
                <motion.div
                  key={creator.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <div className="glass-card overflow-hidden group">
                    {/* Cover Image */}
                    <div className="h-32 overflow-hidden">
                      <img
                        src={creator.coverImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Creator Info */}
                    <div className="p-6 -mt-10 relative">
                      <div className="flex items-end gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-20 h-20 rounded-xl border-4 border-dark-400 object-cover"
                          />
                          {creator.verified && (
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white fill-white" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{creator.name}</h3>
                          <p className="text-gray-400 text-sm">{creator.handle}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">{creator.bio}</p>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}K` : creator.followers}
                          </div>
                          <div className="text-xs text-gray-500">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{creator.products}</div>
                          <div className="text-xs text-gray-500">Products</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{creator.totalSales}</div>
                          <div className="text-xs text-gray-500">Sales</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{creator.rating}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {creator.social.instagram && (
                            <a href="#" className="p-2 glass-card rounded-lg hover:bg-white/10">
                              <Instagram className="w-4 h-4 text-gray-400" />
                            </a>
                          )}
                          {creator.social.twitter && (
                            <a href="#" className="p-2 glass-card rounded-lg hover:bg-white/10">
                              <Twitter className="w-4 h-4 text-gray-400" />
                            </a>
                          )}
                          {creator.social.website && (
                            <a href="#" className="p-2 glass-card rounded-lg hover:bg-white/10">
                              <Globe className="w-4 h-4 text-gray-400" />
                            </a>
                          )}
                        </div>
                        <Link
                          href={`/marketplace/creators/${creator.id}`}
                          className="btn-primary text-sm"
                        >
                          View Store
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Become a Creator CTA */}
        <ScrollReveal>
          <div className="mt-16 glass-card p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-blue/10 to-neon-pink/10" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Become a Creator</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Have unique products to sell? Join our creator marketplace and reach thousands of 
                tech-savvy customers. Set your own prices, manage your store, and start earning.
              </p>
              <Link href="/marketplace/apply" className="inline-flex items-center gap-2 btn-gradient">
                <Plus className="w-5 h-5" />
                Apply Now
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
