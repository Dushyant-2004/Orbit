'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Best Sellers', href: '/products?sort=popular' },
    { name: 'Sale', href: '/products?sale=true' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Sustainability', href: '/sustainability' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Youtube', icon: Youtube, href: 'https://youtube.com' },
  { name: 'Github', icon: Github, href: 'https://github.com' },
];

export function Footer() {
  return (
    <footer className="relative bg-dark-300 border-t border-white/5">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Newsletter Section */}
        <div className="glass-card p-8 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Join the future of shopping
              </h3>
              <p className="text-gray-400">
                Get exclusive access to new products, AI recommendations, and special offers.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1 lg:w-80"
              />
              <motion.button
                type="submit"
                className="btn-primary whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-neon rounded-xl opacity-75" />
                <span className="relative text-2xl font-bold text-white">O</span>
              </div>
              <span className="text-2xl font-display font-bold gradient-text">ORBIT</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Experience the future of e-commerce with AI-powered recommendations and immersive 3D product previews.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neon-blue" />
                <span>San Francisco, CA 94102</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neon-blue" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neon-blue" />
                <span>hello@orbit.store</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ORBIT. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm">Secure payments by</span>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-white/5 rounded text-xs">Stripe</div>
              <div className="px-2 py-1 bg-white/5 rounded text-xs">PayPal</div>
              <div className="px-2 py-1 bg-white/5 rounded text-xs">Apple Pay</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
