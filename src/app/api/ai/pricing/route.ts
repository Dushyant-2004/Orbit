import { NextRequest, NextResponse } from 'next/server';

// AI Dynamic Pricing Engine
// In production, this would use ML models analyzing demand, competition, inventory, etc.

interface PricingRequest {
  productId: string;
  basePrice: number;
  category?: string;
  stock?: number;
  demand?: number; // 0-100
  competitorPrices?: number[];
  seasonality?: string;
  userSegment?: string;
}

interface PricingFactors {
  demandFactor: number;
  stockFactor: number;
  competitionFactor: number;
  seasonalityFactor: number;
  timeFactor: number;
}

// Calculate demand-based price adjustment
function getDemandFactor(demand: number = 50): number {
  // Higher demand = higher price
  // demand: 0-100
  if (demand >= 80) return 1.15; // +15%
  if (demand >= 60) return 1.08; // +8%
  if (demand >= 40) return 1.0;  // base price
  if (demand >= 20) return 0.95; // -5%
  return 0.90; // -10%
}

// Calculate stock-based price adjustment
function getStockFactor(stock: number = 50): number {
  // Lower stock = slightly higher price (scarcity)
  if (stock <= 5) return 1.10;  // +10% (very limited)
  if (stock <= 20) return 1.05; // +5%
  if (stock <= 50) return 1.0;  // base price
  if (stock <= 100) return 0.98; // -2%
  return 0.95; // -5% (overstocked)
}

// Calculate competition-based adjustment
function getCompetitionFactor(competitorPrices: number[] = [], basePrice: number): number {
  if (competitorPrices.length === 0) return 1.0;
  
  const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
  const minCompetitorPrice = Math.min(...competitorPrices);
  
  // Stay competitive but not always the cheapest
  if (basePrice > avgCompetitorPrice * 1.2) return 0.95; // We're too expensive
  if (basePrice < minCompetitorPrice * 0.9) return 1.05; // We can raise a bit
  return 1.0;
}

// Calculate seasonal adjustment
function getSeasonalityFactor(seasonality: string = 'normal'): number {
  const seasonFactors: { [key: string]: number } = {
    'holiday': 1.12,      // Black Friday, Christmas, etc.
    'peak': 1.08,         // High season
    'normal': 1.0,        // Regular period
    'off-peak': 0.92,     // Low season
    'clearance': 0.85,    // End of season clearance
  };
  return seasonFactors[seasonality] || 1.0;
}

// Get time-of-day factor (flash deals concept)
function getTimeFactor(): number {
  const hour = new Date().getHours();
  // Slightly lower prices during off-peak hours to drive sales
  if (hour >= 2 && hour <= 6) return 0.97; // Night owls get a discount
  if (hour >= 10 && hour <= 14) return 1.02; // Peak shopping hours
  return 1.0;
}

// POST - Calculate dynamic price
export async function POST(request: NextRequest) {
  try {
    const body: PricingRequest = await request.json();
    const {
      productId,
      basePrice,
      category,
      stock = 50,
      demand = 50,
      competitorPrices = [],
      seasonality = 'normal',
      userSegment,
    } = body;

    if (!productId || !basePrice) {
      return NextResponse.json(
        { error: 'productId and basePrice are required' },
        { status: 400 }
      );
    }

    // Simulate ML model processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Calculate individual factors
    const factors: PricingFactors = {
      demandFactor: getDemandFactor(demand),
      stockFactor: getStockFactor(stock),
      competitionFactor: getCompetitionFactor(competitorPrices, basePrice),
      seasonalityFactor: getSeasonalityFactor(seasonality),
      timeFactor: getTimeFactor(),
    };

    // Calculate combined multiplier
    const combinedMultiplier = 
      factors.demandFactor * 
      factors.stockFactor * 
      factors.competitionFactor * 
      factors.seasonalityFactor * 
      factors.timeFactor;

    // Apply multiplier with bounds (min -20%, max +25%)
    const boundedMultiplier = Math.max(0.80, Math.min(1.25, combinedMultiplier));
    
    const dynamicPrice = Math.round(basePrice * boundedMultiplier * 100) / 100;
    const savings = basePrice > dynamicPrice ? basePrice - dynamicPrice : 0;
    const markup = dynamicPrice > basePrice ? dynamicPrice - basePrice : 0;

    // Generate pricing insights
    const insights: string[] = [];
    
    if (demand >= 70) insights.push('High demand detected');
    if (demand <= 30) insights.push('Lower demand - price adjusted');
    if (stock <= 10) insights.push('Limited stock - act fast!');
    if (seasonality === 'holiday') insights.push('Holiday special pricing');
    if (factors.timeFactor < 1) insights.push('Off-peak time discount');
    if (competitorPrices.length > 0) insights.push('Competitively matched');

    // Determine price trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (boundedMultiplier > 1.05) trend = 'up';
    if (boundedMultiplier < 0.95) trend = 'down';

    return NextResponse.json({
      success: true,
      pricing: {
        productId,
        basePrice,
        dynamicPrice,
        savings: Math.round(savings * 100) / 100,
        markup: Math.round(markup * 100) / 100,
        discountPercentage: savings > 0 ? Math.round((savings / basePrice) * 100) : 0,
        trend,
        confidence: 0.85 + Math.random() * 0.1, // Simulated model confidence
      },
      factors: {
        demand: { value: demand, impact: factors.demandFactor },
        stock: { value: stock, impact: factors.stockFactor },
        competition: { impact: factors.competitionFactor },
        seasonality: { value: seasonality, impact: factors.seasonalityFactor },
        time: { impact: factors.timeFactor },
      },
      insights,
      validUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Price valid for 15 minutes
      meta: {
        algorithm: 'dynamic-pricing-v2',
        version: '2.0',
        computed: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Dynamic pricing error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate dynamic price', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get pricing trends for a category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    // Simulated pricing trends data
    const trends = {
      category,
      averageDiscount: Math.round(Math.random() * 15 + 5), // 5-20%
      priceTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      hotDeals: Math.floor(Math.random() * 20 + 10), // 10-30 deals
      flashSaleActive: Math.random() > 0.7,
      nextSaleIn: Math.floor(Math.random() * 24) + 'h',
      priceHistory: {
        lastWeek: {
          high: Math.round(Math.random() * 100 + 200),
          low: Math.round(Math.random() * 50 + 100),
          average: Math.round(Math.random() * 50 + 150),
        },
      },
      recommendation: Math.random() > 0.5 ? 'buy_now' : 'wait',
      confidence: Math.round((0.7 + Math.random() * 0.25) * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      trends,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Pricing trends error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing trends' },
      { status: 500 }
    );
  }
}
