import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialize Razorpay to avoid build-time errors
let razorpayInstance: Razorpay | null = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }
  return razorpayInstance;
};

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  metadata?: Record<string, string>;
}

// POST - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, customerName, customerPhone, shippingAddress, metadata, amount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Use the amount passed from frontend (already in paise) or calculate from items
    const amountInPaise = amount || Math.round(items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) * 100);

    // Create Razorpay order
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        itemCount: items.length.toString(),
        ...metadata,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
    });
  } catch (error: any) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Verify payment signature
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign)
      .digest('hex');

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Retrieve order/payment details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');
    const razorpay = getRazorpay();

    if (paymentId) {
      const payment = await razorpay.payments.fetch(paymentId);
      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount ? Number(payment.amount) / 100 : 0,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
        },
      });
    }

    if (orderId) {
      const order = await razorpay.orders.fetch(orderId);
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount ? Number(order.amount) / 100 : 0,
          currency: order.currency,
          status: order.status,
          receipt: order.receipt,
        },
      });
    }

    return NextResponse.json(
      { error: 'Order ID or Payment ID is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Order/Payment retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve details', details: error.message },
      { status: 500 }
    );
  }
}
