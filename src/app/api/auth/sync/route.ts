import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

// POST - Sync user from Firebase to MongoDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, email' },
        { status: 400 }
      );
    }

    const mongoose = await connectDB();
    
    // Check if User model exists, if not create it
    let User = mongoose.models.User;
    if (!User) {
      const userSchema = new mongoose.Schema({
        firebaseUid: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        name: String,
        avatar: String,
        role: { type: String, enum: ['user', 'admin', 'creator'], default: 'user' },
        preferences: {
          notifications: { type: Boolean, default: true },
          newsletter: { type: Boolean, default: false },
          theme: { type: String, default: 'dark' },
        },
        addresses: [{
          label: String,
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: String,
          isDefault: Boolean,
        }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        lastLoginAt: { type: Date, default: Date.now },
      });
      
      User = mongoose.model('User', userSchema);
    }

    // Find existing user or create new one
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // Update existing user
      user.lastLoginAt = new Date();
      if (displayName) user.name = displayName;
      if (photoURL) user.avatar = photoURL;
      user.updatedAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid: uid,
        email,
        name: displayName || email.split('@')[0],
        avatar: photoURL || null,
        role: 'user',
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (error: any) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', details: error.message },
      { status: 500 }
    );
  }
}
