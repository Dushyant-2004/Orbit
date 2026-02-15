'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { FadeIn, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { Product, ProductFilters } from '@/types';

// Mock products data
const allProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
  _id: String(i + 1),
  name: [
    'Quantum Pro Headphones',
    'Neural Smart Watch',
    'Aura VR Glasses',
    'Nebula Sneakers',
    'Cosmic Backpack',
    'Stellar Sunglasses',
    'Pulse Fitness Band',
    'Echo Smart Speaker',
  ][i % 8],
  slug: `product-${i + 1}`,
  description: 'Premium quality product with advanced features',
  shortDescription: 'Experience excellence',
  price: Math.floor(Math.random() * 500) + 100,
  originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 700) + 200 : undefined,
  category: ['Electronics', 'Fashion', 'Wearables', 'Sports'][i % 4],
  tags: ['premium', 'trending'],
  images: [[
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  ][i % 4]],
  arEnabled: Math.random() > 0.3,
  stock: Math.floor(Math.random() * 100),
  sold: Math.floor(Math.random() * 1000),
  rating: 4 + Math.random(),
  reviewCount: Math.floor(Math.random() * 500),
  creatorId: '1',
  features: [],
  specifications: {},
  dynamicPricing: Math.random() > 0.5 ? {
    basePrice: 100,
    demandMultiplier: 1,
    timeMultiplier: 1,
    inventoryMultiplier: 1,
    competitorMultiplier: 1,
    finalPrice: 100,
    factors: [],
  } : undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const categories = ['All', 'Electronics', 'Fashion', 'Wearables', 'Sports'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: 'newest',
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Filter products based on current filters
  useEffect(() => {
    setLoading(true);
    
    let filtered = [...allProducts];

    // Category filter
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((p) => 
        p.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      default:
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setTimeout(() => {
      setProducts(filtered);
      setLoading(false);
    }, 300);
  }, [filters]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {filters.category && filters.category !== 'All' 
                ? filters.category 
                : 'All Products'}
            </h1>
            <p className="text-gray-400">
              Discover our curated collection of premium products
            </p>
          </div>
        </FadeIn>

        {/* Filters Bar */}
        <FadeIn delay={0.2}>
          <div className="glass-card p-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilters({ 
                      ...filters, 
                      category: category === 'All' ? undefined : category 
                    })}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      (filters.category || 'All') === category
                        ? 'bg-neon-blue text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="appearance-none px-4 py-3 pr-10 bg-dark-200 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-blue/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-neon-blue text-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-neon-blue text-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Advanced Filters */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Min Price</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => setFilters({ 
                          ...filters, 
                          minPrice: e.target.value ? Number(e.target.value) : undefined 
                        })}
                        className="w-full px-4 py-2 bg-dark-200 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Max Price</label>
                      <input
                        type="number"
                        placeholder="1000"
                        value={filters.maxPrice || ''}
                        onChange={(e) => setFilters({ 
                          ...filters, 
                          maxPrice: e.target.value ? Number(e.target.value) : undefined 
                        })}
                        className="w-full px-4 py-2 bg-dark-200 border border-white/10 rounded-lg text-white"
                      />
                    </div>

                    {/* Clear Filters */}
                    <div className="col-span-2 flex items-end">
                      <button
                        onClick={() => setFilters({
                          category: undefined,
                          search: '',
                          sortBy: 'newest',
                          minPrice: undefined,
                          maxPrice: undefined,
                        })}
                        className="px-4 py-2 text-neon-blue hover:text-neon-blue/80 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Results Count */}
        <div className="mb-6 text-gray-400">
          Showing {products.length} products
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton rounded w-1/4" />
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}
            layout
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => setFilters({
                category: undefined,
                search: '',
                sortBy: 'newest',
                minPrice: undefined,
                maxPrice: undefined,
              })}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
