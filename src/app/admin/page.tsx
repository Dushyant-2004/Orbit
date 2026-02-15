'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Eye,
  ArrowUpRight,
  Calendar,
  Download,
  Filter,
  MoreHorizontal,
  Bell,
  Settings,
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FadeIn, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/PageTransition';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data
const stats = [
  {
    label: 'Total Revenue',
    value: 285420,
    change: 12.5,
    icon: DollarSign,
    color: 'neon-blue',
    prefix: '$',
  },
  {
    label: 'Total Orders',
    value: 2847,
    change: 8.2,
    icon: ShoppingCart,
    color: 'neon-purple',
  },
  {
    label: 'Active Users',
    value: 15420,
    change: 15.3,
    icon: Users,
    color: 'neon-green',
  },
  {
    label: 'Products',
    value: 1245,
    change: -2.4,
    icon: Package,
    color: 'neon-orange',
  },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', product: 'Quantum Pro Headphones', amount: 299.99, status: 'completed' },
  { id: '#ORD-002', customer: 'Jane Smith', product: 'Neural Smart Watch', amount: 449.99, status: 'processing' },
  { id: '#ORD-003', customer: 'Mike Johnson', product: 'Aura VR Glasses', amount: 599.99, status: 'shipped' },
  { id: '#ORD-004', customer: 'Sarah Williams', product: 'Nebula Sneakers', amount: 189.99, status: 'pending' },
  { id: '#ORD-005', customer: 'Chris Brown', product: 'Echo Smart Speaker', amount: 199.99, status: 'completed' },
];

const topProducts = [
  { name: 'Quantum Pro Headphones', sales: 1200, revenue: 359880, growth: 15.2 },
  { name: 'Neural Smart Watch', sales: 890, revenue: 400505, growth: 12.8 },
  { name: 'Aura VR Glasses', sales: 456, revenue: 273544, growth: 8.4 },
  { name: 'Nebula Sneakers', sales: 2340, revenue: 444660, growth: 22.1 },
];

// Chart data
const revenueChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Revenue',
      data: [30000, 45000, 42000, 55000, 48000, 62000, 58000],
      fill: true,
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      borderColor: '#00d4ff',
      tension: 0.4,
      pointBackgroundColor: '#00d4ff',
      pointBorderColor: '#00d4ff',
    },
  ],
};

const ordersChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Orders',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderRadius: 8,
    },
  ],
};

const categoryChartData = {
  labels: ['Electronics', 'Fashion', 'Home', 'Sports'],
  datasets: [
    {
      data: [35, 25, 22, 18],
      backgroundColor: ['#00d4ff', '#a855f7', '#ec4899', '#22c55e'],
      borderWidth: 0,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
      },
    },
  },
  cutout: '70%',
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="min-h-screen pt-24 pb-12 bg-dark-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center glass-card">
                <button
                  onClick={() => setDateRange('7d')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    dateRange === '7d' ? 'bg-neon-blue text-white' : 'text-gray-400'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setDateRange('30d')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    dateRange === '30d' ? 'bg-neon-blue text-white' : 'text-gray-400'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setDateRange('90d')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    dateRange === '90d' ? 'bg-neon-blue text-white' : 'text-gray-400'
                  }`}
                >
                  90 Days
                </button>
              </div>
              <button className="p-2 glass-card text-gray-400 hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 glass-card text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;
            return (
              <StaggerItem key={stat.label}>
                <motion.div
                  className="glass-card p-6"
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}/20`}>
                      <Icon className={`w-6 h-6 text-${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-white">
                    {stat.prefix || ''}{formatNumber(stat.value)}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <ScrollReveal>
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Revenue Overview</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-80">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </div>
          </ScrollReveal>

          {/* Category Distribution */}
          <ScrollReveal>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Sales by Category</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-80">
                <Doughnut data={categoryChartData} options={doughnutOptions} />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Second Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Orders Chart */}
          <ScrollReveal>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Weekly Orders</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64">
                <Bar data={ordersChartData} options={chartOptions} />
              </div>
            </div>
          </ScrollReveal>

          {/* Top Products */}
          <ScrollReveal>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Top Products</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-sm text-gray-400">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm truncate">{product.name}</h4>
                      <p className="text-gray-500 text-xs">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">{formatCurrency(product.revenue)}</p>
                      <p className="text-green-400 text-xs">+{product.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Recent Orders */}
        <ScrollReveal>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Recent Orders</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                  View All
                </button>
                <button className="p-2 glass-card-dark text-gray-400 hover:text-white transition-colors rounded-lg">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-white">{order.id}</td>
                      <td className="py-4 text-gray-300">{order.customer}</td>
                      <td className="py-4 text-gray-300">{order.product}</td>
                      <td className="py-4 text-white">{formatCurrency(order.amount)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
