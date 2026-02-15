'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Star, Heart, Share2, ShoppingCart, Minus, Plus, 
  Truck, Shield, RotateCcw, Sparkles, Zap, ChevronRight,
  MessageSquare, ThumbsUp
} from 'lucide-react';
import { useCart } from '@/providers/CartProvider';
import { FadeIn, ScrollReveal } from '@/components/animations/PageTransition';
import { ProductCard } from '@/components/products/ProductCard';
import { formatCurrency, cn } from '@/lib/utils';
import { Product } from '@/types';

// Dynamic import for 3D viewer
const Product3DViewer = dynamic(
  () => import('@/components/three/Product3DViewer').then((mod) => mod.Product3DViewer),
  { ssr: false, loading: () => <div className="aspect-square skeleton rounded-2xl" /> }
);

// Mock product data
const mockProduct: Product = {
  _id: '1',
  name: 'Quantum Pro Headphones',
  slug: 'quantum-pro-headphones',
  description: `Experience audio like never before with the Quantum Pro Headphones. Featuring advanced AI-powered noise cancellation, these headphones adapt to your environment in real-time, delivering crystal-clear sound whether you're in a busy office or a quiet studio.

The premium memory foam ear cushions provide all-day comfort, while the lightweight titanium frame ensures durability without the weight. With 40 hours of battery life and quick charge capability, you'll never miss a beat.

Key Features:
• AI-powered adaptive noise cancellation
• Hi-Res Audio certified with custom 40mm drivers
• 40-hour battery life with quick charge
• Multi-device connectivity with seamless switching
• Premium memory foam ear cushions
• Foldable design with premium carrying case`,
  shortDescription: 'Premium wireless headphones with AI noise cancellation',
  price: 299.99,
  originalPrice: 399.99,
  category: 'Electronics',
  subcategory: 'Audio',
  tags: ['wireless', 'premium', 'ai', 'noise-cancellation'],
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800',
    'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=800',
  ],
  modelUrl: '/models/headphones.glb',
  arEnabled: true,
  stock: 50,
  sold: 1200,
  rating: 4.8,
  reviewCount: 342,
  creatorId: '1',
  features: [
    'AI-Powered Noise Cancellation',
    '40-Hour Battery Life',
    'Hi-Res Audio Certified',
    'Multi-Device Connectivity',
    'Premium Comfort Design',
  ],
  specifications: {
    'Driver Size': '40mm',
    'Frequency Response': '4Hz - 40kHz',
    'Impedance': '35Ω',
    'Battery Life': '40 hours',
    'Charging Time': '2.5 hours',
    'Weight': '250g',
    'Connectivity': 'Bluetooth 5.2, 3.5mm',
  },
  variants: [
    {
      id: 'color',
      name: 'Color',
      options: [
        { value: 'Midnight Black', priceModifier: 0, stock: 20 },
        { value: 'Silver White', priceModifier: 0, stock: 15 },
        { value: 'Rose Gold', priceModifier: 20, stock: 15 },
      ],
    },
  ],
  dynamicPricing: {
    basePrice: 299.99,
    demandMultiplier: 1.1,
    timeMultiplier: 0.95,
    inventoryMultiplier: 1.0,
    competitorMultiplier: 0.98,
    finalPrice: 299.99,
    factors: [
      { name: 'High Demand', impact: 'positive', percentage: 10, description: 'Popular item with high demand' },
      { name: 'Flash Sale', impact: 'negative', percentage: -5, description: 'Limited time discount' },
      { name: 'Competitor Match', impact: 'negative', percentage: -2, description: 'Price matched to competitors' },
    ],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock recommendations
const recommendations: Product[] = Array.from({ length: 4 }, (_, i) => ({
  ...mockProduct,
  _id: String(i + 10),
  name: ['Neural Smart Watch', 'Aura VR Glasses', 'Echo Smart Speaker', 'Pulse Fitness Band'][i],
  slug: `product-${i + 10}`,
  price: [449.99, 599.99, 199.99, 149.99][i],
  images: [[
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
  ][i]],
}));

// Mock reviews
const reviews = [
  {
    _id: '1',
    userId: '1',
    user: { displayName: 'John D.', photoURL: null },
    rating: 5,
    title: 'Best headphones I\'ve ever owned!',
    comment: 'The noise cancellation is incredible. I can finally focus on my work without any distractions. Sound quality is top-notch.',
    helpful: 45,
    verified: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: '2',
    userId: '2',
    user: { displayName: 'Sarah M.', photoURL: null },
    rating: 4,
    title: 'Great sound, minor fit issues',
    comment: 'Sound quality is amazing and the battery lasts forever. The fit is a bit tight for me, but overall a great purchase.',
    helpful: 23,
    verified: true,
    createdAt: new Date('2024-01-10'),
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    color: 'Midnight Black',
  });
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const product = mockProduct;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <FadeIn>
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/products" className="hover:text-white transition-colors">Products</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{product.name}</span>
          </nav>
        </FadeIn>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery / 3D Viewer */}
          <FadeIn>
            <div className="space-y-4">
              {/* Main Image / 3D Viewer */}
              <div className="relative aspect-square rounded-2xl overflow-hidden glass-card">
                {show3D ? (
                  <Suspense fallback={<div className="w-full h-full skeleton" />}>
                    <Product3DViewer productName={product.name} />
                  </Suspense>
                ) : (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}

                {/* 3D Toggle */}
                {product.arEnabled && (
                  <button
                    onClick={() => setShow3D(!show3D)}
                    className={cn(
                      'absolute top-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
                      show3D
                        ? 'bg-neon-blue text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                  >
                    {show3D ? 'View Photos' : 'View in 3D'}
                  </button>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-neon-pink text-white text-sm font-medium rounded-full">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {!show3D && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative w-20 h-20 rounded-lg overflow-hidden transition-all',
                        selectedImage === index
                          ? 'ring-2 ring-neon-blue'
                          : 'opacity-60 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Product Info */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              {/* Category */}
              <span className="text-neon-blue text-sm uppercase tracking-wide">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(product.rating)
                          ? 'fill-neon-orange text-neon-orange'
                          : 'text-gray-600'
                      )}
                    />
                  ))}
                  <span className="ml-2 text-white font-medium">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">|</span>
                <a href="#reviews" className="text-gray-400 hover:text-white transition-colors">
                  {product.reviewCount} reviews
                </a>
                <span className="text-gray-400">|</span>
                <span className="text-green-400">{product.sold} sold</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold gradient-text">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* AI Pricing Badge */}
              {product.dynamicPricing && (
                <motion.div
                  className="glass-card p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-neon-green" />
                    <span className="text-white font-medium">AI Dynamic Pricing Active</span>
                  </div>
                  <div className="space-y-1">
                    {product.dynamicPricing.factors.map((factor, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{factor.name}</span>
                        <span className={cn(
                          factor.impact === 'positive' ? 'text-red-400' : 'text-green-400'
                        )}>
                          {factor.percentage > 0 ? '+' : ''}{factor.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Description */}
              <p className="text-gray-400">{product.shortDescription}</p>

              {/* Variants */}
              {product.variants?.map((variant) => (
                <div key={variant.id}>
                  <label className="block text-sm text-gray-400 mb-2">
                    {variant.name}: <span className="text-white">{selectedVariants[variant.id]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedVariants({
                          ...selectedVariants,
                          [variant.id]: option.value,
                        })}
                        className={cn(
                          'px-4 py-2 rounded-lg border transition-colors',
                          selectedVariants[variant.id] === option.value
                            ? 'border-neon-blue bg-neon-blue/20 text-white'
                            : 'border-white/10 text-gray-400 hover:border-white/30'
                        )}
                      >
                        {option.value}
                        {option.priceModifier > 0 && (
                          <span className="ml-1 text-xs text-neon-blue">
                            +{formatCurrency(option.priceModifier)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center glass-card">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-white font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm">{product.stock} in stock</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    'p-4 rounded-xl transition-colors',
                    isLiked
                      ? 'bg-neon-pink text-white'
                      : 'glass-card text-gray-400 hover:text-white'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                </motion.button>
                <motion.button
                  className="p-4 glass-card text-gray-400 hover:text-white rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                  <Truck className="w-5 h-5 text-neon-blue" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="w-5 h-5 text-neon-green" />
                  <span className="text-sm">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <RotateCcw className="w-5 h-5 text-neon-purple" />
                  <span className="text-sm">Easy Returns</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Tabs */}
        <ScrollReveal>
          <div className="glass-card mb-16">
            {/* Tab Headers */}
            <div className="flex border-b border-white/10">
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-1 py-4 text-center transition-colors relative',
                    activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line">{product.description}</p>
                  <h4 className="text-white mt-6 mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <Sparkles className="w-4 h-4 text-neon-blue" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div id="reviews" className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="glass-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center">
                            <span className="text-white font-medium">
                              {review.user?.displayName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {review.user?.displayName}
                              </span>
                              {review.verified && (
                                <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'w-3 h-3',
                                    i < review.rating
                                      ? 'fill-neon-orange text-neon-orange'
                                      : 'text-gray-600'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-white font-medium mb-2">{review.title}</h4>
                      <p className="text-gray-400 mb-4">{review.comment}</p>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* AI Recommendations */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-neon-purple" />
              <h2 className="text-2xl font-display font-bold text-white">
                AI Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
