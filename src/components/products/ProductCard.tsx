'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { formatCurrency, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        } as any}
        className="relative"
      >
        <Link href={`/products/${product.slug}`}>
          <div className="glass-card overflow-hidden group card-hover">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-400/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discount > 0 && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="px-2 py-1 text-xs font-medium bg-neon-pink text-white rounded-full"
                  >
                    -{discount}%
                  </motion.span>
                )}
                {product.arEnabled && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-2 py-1 text-xs font-medium bg-neon-blue/20 text-neon-blue rounded-full flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    3D
                  </motion.span>
                )}
                {product.dynamicPricing && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-2 py-1 text-xs font-medium bg-neon-green/20 text-neon-green rounded-full flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    AI
                  </motion.span>
                )}
              </div>

              {/* Like Button */}
              <motion.button
                className={cn(
                  'absolute top-3 right-3 p-2 rounded-full transition-colors',
                  isLiked ? 'bg-neon-pink text-white' : 'bg-white/10 text-white hover:bg-white/20'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
              </motion.button>

              {/* Quick Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                className="absolute bottom-3 left-3 right-3 flex gap-2"
              >
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
                {product.modelUrl && (
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              <p className="text-xs text-neon-blue mb-1 uppercase tracking-wide">
                {product.category}
              </p>

              {/* Name */}
              <h3 className="text-white font-medium mb-2 line-clamp-1 group-hover:text-neon-blue transition-colors">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < Math.floor(product.rating)
                          ? 'fill-neon-orange text-neon-orange'
                          : 'text-gray-600'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  ({product.reviewCount})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold gradient-text">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* 3D Shadow Effect */}
        <motion.div
          className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-neon opacity-0 blur-xl"
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
