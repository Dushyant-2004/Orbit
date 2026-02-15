'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, Truck, CheckCircle, Clock, XCircle, 
  ChevronRight, Search, Filter, Eye, RotateCcw
} from 'lucide-react';
import { FadeIn, ScrollReveal, StaggerContainer } from '@/components/animations/PageTransition';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORB-K8X9Y2-ABC',
    date: new Date('2024-01-15'),
    status: 'delivered',
    total: 549.99,
    items: [
      {
        id: '1',
        name: 'Quantum Pro Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
      },
      {
        id: '2',
        name: 'Nova Smart Watch',
        price: 249.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
      },
    ],
    trackingNumber: '1Z999AA10123456784',
    deliveredAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    orderNumber: 'ORB-M3N4P5-DEF',
    date: new Date('2024-01-18'),
    status: 'shipped',
    total: 179.00,
    items: [
      {
        id: '3',
        name: 'Stellar Wireless Earbuds',
        price: 179.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
      },
    ],
    trackingNumber: '1Z999AA10987654321',
    estimatedDelivery: new Date('2024-01-25'),
  },
  {
    id: '3',
    orderNumber: 'ORB-Q7R8S9-GHI',
    date: new Date('2024-01-22'),
    status: 'processing',
    total: 599.00,
    items: [
      {
        id: '4',
        name: 'Aura VR Headset',
        price: 599.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=100',
      },
    ],
  },
  {
    id: '4',
    orderNumber: 'ORB-T1U2V3-JKL',
    date: new Date('2023-12-10'),
    status: 'cancelled',
    total: 129.00,
    items: [
      {
        id: '5',
        name: 'Pulse Fitness Band',
        price: 129.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100',
      },
    ],
    cancelledAt: new Date('2023-12-11'),
    reason: 'Customer requested cancellation',
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Package },
  shipped: { label: 'Shipped', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
};

const filterOptions = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = selectedFilter === 'All' || order.status === selectedFilter.toLowerCase();
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-400">Track and manage your orders</p>
          </div>
        </FadeIn>

        {/* Filters and Search */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-card border-none rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedFilter === filter
                      ? 'bg-neon-blue text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <FadeIn delay={0.2}>
            <div className="glass-card p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : "You haven't placed any orders yet"}
              </p>
              <Link href="/products" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="glass-card overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-6 flex items-center gap-4 hover:bg-white/5 transition-colors"
                  >
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full ${status.bg} flex items-center justify-center flex-shrink-0`}>
                      <status.icon className={`w-6 h-6 ${status.color}`} />
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-medium">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {formatDate(order.date)} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <div className="text-white font-medium">{formatCurrency(order.total)}</div>
                    </div>

                    {/* Expand Arrow */}
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-white/10 pt-6">
                          {/* Items */}
                          <div className="space-y-4 mb-6">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-300">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-medium">{item.name}</h4>
                                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-white">{formatCurrency(item.price)}</div>
                              </div>
                            ))}
                          </div>

                          {/* Tracking Info */}
                          {order.trackingNumber && order.status !== 'cancelled' && (
                            <div className="glass-card-dark p-4 rounded-lg mb-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-gray-400 text-sm">Tracking Number</p>
                                  <p className="text-white font-mono">{order.trackingNumber}</p>
                                </div>
                                <a
                                  href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-ghost text-sm"
                                >
                                  Track
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Status-specific info */}
                          {order.status === 'delivered' && order.deliveredAt && (
                            <p className="text-gray-400 text-sm mb-6">
                              Delivered on {formatDate(order.deliveredAt)}
                            </p>
                          )}

                          {order.status === 'shipped' && order.estimatedDelivery && (
                            <p className="text-gray-400 text-sm mb-6">
                              Estimated delivery: {formatDate(order.estimatedDelivery)}
                            </p>
                          )}

                          {order.status === 'cancelled' && (
                            <div className="glass-card-dark p-4 rounded-lg mb-6 border border-red-500/20">
                              <p className="text-red-400 text-sm">
                                Cancelled on {formatDate(order.cancelledAt!)}
                                {order.reason && ` - ${order.reason}`}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Link
                              href={`/orders/${order.orderNumber}`}
                              className="btn-ghost text-sm flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                            {order.status === 'delivered' && (
                              <button className="btn-ghost text-sm flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Return/Exchange
                              </button>
                            )}
                            {(order.status === 'pending' || order.status === 'processing') && (
                              <button className="btn-ghost text-sm text-red-400 hover:text-red-300">
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </StaggerContainer>
        )}

        {/* Need Help */}
        <ScrollReveal>
          <div className="mt-12 glass-card p-6 text-center">
            <h3 className="text-lg font-medium text-white mb-2">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Our support team is here to assist you with any order-related questions.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact" className="btn-ghost text-sm">
                Contact Support
              </Link>
              <Link href="/faq" className="btn-ghost text-sm">
                View FAQ
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
