import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Product Schema (will be created if doesn't exist)
const getProductModel = async () => {
  await connectDB();
  
  if (mongoose.models.Product) {
    return mongoose.models.Product;
  }

  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    images: [String],
    model3D: String,
    category: { type: String, required: true },
    subcategory: String,
    tags: [String],
    brand: String,
    sku: { type: String, unique: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    features: [String],
    colors: [{
      name: String,
      hex: String,
      image: String,
    }],
    sizes: [String],
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  productSchema.index({ name: 'text', description: 'text', tags: 'text' });
  productSchema.index({ category: 1 });
  productSchema.index({ price: 1 });
  productSchema.index({ rating: -1 });

  return mongoose.model('Product', productSchema);
};

// GET - Fetch products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');

    const Product = await getProductModel() as any;

    // Build query
    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (onSale === 'true') {
      query.isOnSale = true;
    }

    // Build sort options
    const sortOptions: any = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    // Get available categories for filters
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      filters: {
        categories,
        brands,
      },
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.slug || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, price, category' },
        { status: 400 }
      );
    }

    const Product = await getProductModel() as any;

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug: body.slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    // Generate SKU if not provided
    if (!body.sku) {
      body.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
