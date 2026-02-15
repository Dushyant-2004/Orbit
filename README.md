# Orbit - AI-Powered 3D E-Commerce Platform

A futuristic, next-generation e-commerce platform built with cutting-edge technologies including Next.js 14, Three.js for 3D product visualization, Firebase authentication, MongoDB, and Razorpay payments.

![Orbit E-Commerce](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop)

## ✨ Features

### 🛍️ Shopping Experience
- **3D Product Viewer** - Interactive 360° product visualization with Three.js
- **AR Try-On** - Virtual try-on experience using device camera
- **AI-Powered Recommendations** - Personalized product suggestions
- **Dynamic Pricing** - Smart pricing based on demand, stock, and seasonality
- **Advanced Search & Filters** - Find products quickly with smart filtering

### 🎨 Design & UI
- **Glassmorphism Design** - Modern frosted glass aesthetics
- **Neon Accents** - Vibrant gradient color scheme
- **Framer Motion Animations** - Smooth page transitions and micro-interactions
- **Custom Cursor** - Interactive cursor with magnetic effects
- **Dark Mode** - Sleek dark theme optimized for eye comfort

### 👤 User Features
- **Firebase Authentication** - Secure login with Google & Email
- **Order Tracking** - Real-time order status updates
- **Wishlist** - Save favorite products
- **Profile Management** - Manage addresses and preferences

### 💳 E-Commerce Core
- **Razorpay Integration** - Secure payment processing (UPI, Cards, Net Banking, Wallets)
- **Shopping Cart** - Persistent cart with quantity management
- **Coupon System** - Discount codes and promotions
- **Multiple Shipping Options** - Standard, Express, Overnight

### 🏪 Creator Marketplace
- **Creator Storefronts** - Independent seller profiles
- **Creator Products** - Exclusive creator-designed items
- **Social Integration** - Creator social links

### 📊 Admin Dashboard
- **Sales Analytics** - Revenue charts and trends
- **Order Management** - Track and manage orders
- **Inventory Control** - Stock level monitoring
- **Customer Insights** - User behavior analytics

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **Animations** | Framer Motion |
| **Authentication** | Firebase Auth |
| **Database** | MongoDB with Mongoose |
| **Payments** | Razorpay |
| **State Management** | Zustand, Context API |
| **Charts** | Chart.js |
| **Icons** | Lucide React |

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/orbit-ecommerce.git
   cd orbit-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

   # App
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
orbit/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication pages
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API routes
│   │   ├── ar-tryon/           # AR try-on feature
│   │   ├── checkout/           # Checkout flow
│   │   ├── marketplace/        # Creator marketplace
│   │   ├── orders/             # Order history
│   │   ├── products/           # Product pages
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable components
│   │   ├── animations/         # Animation wrappers
│   │   ├── cart/               # Cart components
│   │   ├── layout/             # Layout components
│   │   ├── products/           # Product components
│   │   ├── three/              # 3D components
│   │   └── ui/                 # UI components
│   ├── lib/                    # Utilities and config
│   ├── providers/              # Context providers
│   └── types/                  # TypeScript definitions
├── public/                     # Static assets
└── ...config files
```

## 🎨 Design System

### Colors
- **Primary**: Electric Blue (#3B82F6)
- **Secondary**: Neon Purple (#8B5CF6)
- **Accent**: Hot Pink (#EC4899)
- **Success**: Neon Green (#22C55E)
- **Warning**: Bright Orange (#F97316)

### Typography
- **Display**: Orbitron (Google Fonts)
- **Body**: System fonts with fallbacks

### Components
All components follow a glassmorphism design pattern with:
- Semi-transparent backgrounds
- Blur effects
- Subtle borders
- Gradient accents

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sync` | POST | Sync Firebase user to MongoDB |
| `/api/products` | GET/POST | Get/Create products |
| `/api/coupons/validate` | POST | Validate discount code |
| `/api/ai/recommendations` | GET/POST | Get AI recommendations |
| `/api/ai/pricing` | POST | Calculate dynamic price |
| `/api/checkout` | POST/PUT/GET | Create Razorpay order, verify payment |
| `/api/webhooks/razorpay` | POST | Handle Razorpay webhooks |

## 🔐 Authentication Flow

1. User clicks Sign In / Sign Up
2. Firebase handles authentication (Google or Email)
3. On success, user data syncs to MongoDB
4. Auth context updates throughout app
5. Protected routes become accessible

## 💰 Payment Flow

1. User adds items to cart
2. Proceeds to checkout
3. Enters shipping info
4. Razorpay order created
5. Razorpay checkout modal opens
6. User pays via UPI/Card/NetBanking/Wallet
7. Payment signature verified
8. Webhook updates order status
9. Confirmation shown to user

## 🧪 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Responsive Design

The platform is fully responsive across:
- Desktop (1200px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Three.js](https://threejs.org/) - 3D Library
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Firebase](https://firebase.google.com/) - Authentication
- [Razorpay](https://razorpay.com/) - Payments
- [Unsplash](https://unsplash.com/) - Stock Images

---

Built with ❤️ by the Orbit Team
# Orbit
# Orbit
