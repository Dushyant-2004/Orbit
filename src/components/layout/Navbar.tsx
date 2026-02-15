'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  User, 
  Heart,
  ChevronDown,
  Sparkles,
  Store,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'AR Try-On', href: '/ar-tryon' },
  { name: 'Marketplace', href: '/marketplace' },
];

const categories = [
  { name: 'All Products', href: '/products' },
  { name: 'Electronics', href: '/products?category=electronics' },
  { name: 'Fashion', href: '/products?category=fashion' },
  { name: 'Home & Living', href: '/products?category=home' },
  { name: 'Sports', href: '/products?category=sports' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, signOut } = useAuth();
  const { itemCount, toggleCart, cartOpen } = useCart();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'glass-morphism-dense shadow-lg' : 'bg-transparent'
        )}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="relative w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-neon rounded-xl animate-pulse-glow" />
                <span className="relative text-2xl font-bold text-white">O</span>
              </motion.div>
              <span className="text-2xl font-display font-bold gradient-text">ORBIT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <MagneticButton key={link.name}>
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-neon group-hover:w-full group-hover:left-0 transition-all duration-300" />
                  </Link>
                </MagneticButton>
              ))}

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Categories
                  <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="glass-card p-2 min-w-[200px]">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <MagneticButton>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </MagneticButton>

              {/* Wishlist */}
              <MagneticButton>
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-300 hover:text-white transition-colors hidden sm:block"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              </MagneticButton>

              {/* Cart */}
              <MagneticButton>
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-neon-blue text-white text-xs flex items-center justify-center rounded-full"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </button>
              </MagneticButton>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full ring-2 ring-neon-blue/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center">
                        <span className="text-sm font-medium">{user.displayName?.charAt(0)}</span>
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 glass-card p-2 min-w-[200px]"
                      >
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-white font-medium">{user.displayName}</p>
                          <p className="text-gray-400 text-sm truncate">{user.email}</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors mt-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        
                        {user.role === 'creator' && (
                          <Link
                            href="/dashboard/seller"
                            className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Store className="w-4 h-4 mr-2" />
                            Seller Dashboard
                          </Link>
                        )}
                        
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/login">
                  <motion.button
                    className="btn-primary hidden sm:flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-morphism border-t border-white/10"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="border-t border-white/10 pt-2 mt-2">
                  <p className="px-4 py-2 text-sm text-gray-500">Categories</p>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {!user && (
                  <Link
                    href="/auth/login"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full btn-primary">Sign In</button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-dark-400/80 backdrop-blur-xl"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl glass-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, categories, brands..."
                    className="w-full pl-12 pr-4 py-4 bg-dark-200 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50"
                    autoFocus
                  />
                </div>
              </form>
              <div className="mt-4 text-sm text-gray-500">
                Press <kbd className="px-2 py-1 bg-dark-200 rounded text-gray-400">Enter</kbd> to search
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={toggleCart} />
    </>
  );
}
