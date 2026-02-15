import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

// Mock AI-powered recommendation engine
// In production, this would integrate with a real ML service

interface RecommendationRequest {
  userId?: string;
  productId?: string;
  category?: string;
  viewHistory?: string[];
  purchaseHistory?: string[];
  limit?: number;
}

// Simulated product data for recommendations
const mockProducts = [
  {
    id: '1',
    name: 'Quantum Pro Headphones',
    slug: 'quantum-pro-headphones',
    price: 299,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.9,
    score: 0.95,
  },
  {
    id: '2',
    name: 'Nova Smart Watch Ultra',
    slug: 'nova-smart-watch-ultra',
    price: 449,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: 4.8,
    score: 0.92,
  },
  {
    id: '3',
    name: 'Stellar Wireless Earbuds',
    slug: 'stellar-wireless-earbuds',
    price: 179,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    rating: 4.7,
    score: 0.89,
  },
  {
    id: '4',
    name: 'Aura VR Headset',
    slug: 'aura-vr-headset',
    price: 599,
    category: 'VR/AR',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400',
    rating: 4.85,
    score: 0.88,
  },
  {
    id: '5',
    name: 'Pulse Fitness Band',
    slug: 'pulse-fitness-band',
    price: 129,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    rating: 4.6,
    score: 0.85,
  },
  {
    id: '6',
    name: 'Echo Smart Speaker',
    slug: 'echo-smart-speaker',
    price: 199,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    rating: 4.5,
    score: 0.82,
  },
];

// Simulate collaborative filtering
function getCollaborativeRecommendations(
  userId: string | undefined, 
  purchaseHistory: string[] = [],
  limit: number = 4
) {
  // In production, this would use actual user behavior data
  // and ML models to find similar users and their purchases
  
  const scores = mockProducts.map(product => ({
    ...product,
    score: product.score + Math.random() * 0.1 - 0.05, // Add some randomness
  }));
  
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Simulate content-based filtering
function getContentBasedRecommendations(
  productId: string | undefined,
  category: string | undefined,
  limit: number = 4
) {
  // In production, this would analyze product features,
  // descriptions, and attributes to find similar items
  
  let filtered = [...mockProducts];
  
  // Filter by category if provided
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  // Exclude current product
  if (productId) {
    filtered = filtered.filter(p => p.id !== productId);
  }
  
  return filtered
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Get trending products
function getTrendingProducts(limit: number = 4) {
  return mockProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(p => ({ ...p, trending: true }));
}

// POST - Get AI recommendations
export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { 
      userId, 
      productId, 
      category, 
      viewHistory = [], 
      purchaseHistory = [],
      limit = 4 
    } = body;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get different types of recommendations
    const collaborative = getCollaborativeRecommendations(userId, purchaseHistory, limit);
    const contentBased = getContentBasedRecommendations(productId, category, limit);
    const trending = getTrendingProducts(limit);

    // Combine and deduplicate
    const allRecommendations = new Map();
    
    [...collaborative, ...contentBased, ...trending].forEach(product => {
      if (!allRecommendations.has(product.id)) {
        allRecommendations.set(product.id, product);
      }
    });

    const recommendations = Array.from(allRecommendations.values()).slice(0, limit);

    return NextResponse.json({
      success: true,
      recommendations,
      meta: {
        algorithm: 'hybrid',
        version: '1.0',
        personalized: !!userId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get general recommendations (for homepage, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '8');

    let recommendations: any[] = [];

    switch (type) {
      case 'trending':
        recommendations = getTrendingProducts(limit);
        break;
      case 'category':
        recommendations = getContentBasedRecommendations(undefined, category || undefined, limit);
        break;
      case 'featured':
        recommendations = mockProducts
          .filter(p => p.score > 0.85)
          .slice(0, limit);
        break;
      default:
        recommendations = getTrendingProducts(limit);
    }

    return NextResponse.json({
      success: true,
      type,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
