// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  modelUrl?: string; // 3D model URL
  arEnabled: boolean;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  creatorId: string;
  creator?: Creator;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  aiRecommendations?: string[];
  dynamicPricing?: DynamicPricing;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  value: string;
  priceModifier: number;
  stock: number;
  image?: string;
}

export interface DynamicPricing {
  basePrice: number;
  demandMultiplier: number;
  timeMultiplier: number;
  inventoryMultiplier: number;
  competitorMultiplier: number;
  finalPrice: number;
  factors: PricingFactor[];
}

export interface PricingFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  percentage: number;
  description: string;
}

// User Types
export interface User {
  _id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'creator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

export interface UserPreferences {
  favoriteCategories: string[];
  sizePreferences: Record<string, string>;
  notificationsEnabled: boolean;
  emailUpdates: boolean;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// Creator Types
export interface Creator {
  _id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description: string;
  logo?: string;
  banner?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalRevenue: number;
  products: string[];
  followers: number;
  socialLinks?: SocialLinks;
  stripeAccountId?: string;
  createdAt: Date;
}

export interface SocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariants?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
}

// Order Types
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variants?: Record<string, string>;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded';

// Review Types
export interface Review {
  _id: string;
  productId: string;
  userId: string;
  user?: User;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

// Admin Analytics Types
export interface Analytics {
  revenue: RevenueData;
  users: UserAnalytics;
  products: ProductAnalytics;
  orders: OrderAnalytics;
}

export interface RevenueData {
  total: number;
  growth: number;
  chartData: ChartData[];
  breakdown: RevenueBreakdown[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: string;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface UserAnalytics {
  total: number;
  active: number;
  new: number;
  growth: number;
  chartData: ChartData[];
}

export interface ProductAnalytics {
  total: number;
  active: number;
  outOfStock: number;
  topSelling: Product[];
}

export interface OrderAnalytics {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  averageValue: number;
  chartData: ChartData[];
}

// AI Types
export interface AIRecommendation {
  productId: string;
  product: Product;
  score: number;
  reason: string;
  confidence: number;
}

export interface AIPricingAnalysis {
  productId: string;
  suggestedPrice: number;
  currentPrice: number;
  priceRange: { min: number; max: number };
  factors: PricingFactor[];
  competitorPrices: number[];
  demandTrend: 'rising' | 'stable' | 'falling';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tags?: string[];
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

export type NotificationType =
  | 'order'
  | 'product'
  | 'review'
  | 'promotion'
  | 'system';
