import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Get or create Coupon model
const getCouponModel = async () => {
  await connectDB();
  
  if (mongoose.models.Coupon) {
    return mongoose.models.Coupon;
  }

  const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: Number,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    validFrom: { type: Date, default: Date.now },
    validUntil: Date,
    applicableCategories: [String],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    excludedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    description: String,
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Coupon', couponSchema);
};

// POST - Validate coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, userId, cartItems } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const Coupon = await getCouponModel() as any;

    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid coupon code',
      });
    }

    // Check validity period
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon is not yet active',
      });
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has reached its usage limit',
      });
    }

    // Check minimum order value
    if (subtotal && subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order value of $${coupon.minOrderValue} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal || 0) * (coupon.value / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      },
      discount: Math.round(discount * 100) / 100,
      message: coupon.type === 'percentage' 
        ? `${coupon.value}% discount applied!` 
        : `$${coupon.value} discount applied!`,
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

// Seed some default coupons for testing
export async function GET(request: NextRequest) {
  try {
    const Coupon = await getCouponModel() as any;
    
    // Check if coupons already exist
    const count = await Coupon.countDocuments();
    if (count > 0) {
      const coupons = await Coupon.find({ isActive: true }).select('code type value description');
      return NextResponse.json({
        message: 'Active coupons retrieved',
        coupons,
      });
    }

    // Seed default coupons
    const defaultCoupons = [
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        description: '10% off for new customers',
        minOrderValue: 50,
      },
      {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        description: '20% off on orders over $100',
        minOrderValue: 100,
        maxDiscount: 50,
      },
      {
        code: 'ORBIT25',
        type: 'percentage',
        value: 25,
        description: 'Special 25% discount',
        minOrderValue: 150,
        maxDiscount: 100,
        usageLimit: 100,
      },
      {
        code: 'FLAT20',
        type: 'fixed',
        value: 20,
        description: '$20 off your order',
        minOrderValue: 75,
      },
    ];

    await Coupon.insertMany(defaultCoupons);

    return NextResponse.json({
      message: 'Default coupons created',
      coupons: defaultCoupons.map(c => ({ code: c.code, description: c.description })),
    });
  } catch (error: any) {
    console.error('Coupon seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed coupons' },
      { status: 500 }
    );
  }
}
