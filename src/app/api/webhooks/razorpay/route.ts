import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

// Get or create Order model
const getOrderModel = async () => {
  await connectDB();
  
  if (mongoose.models.Order) {
    return mongoose.models.Order;
  }

  const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerEmail: { type: String, required: true },
    customerName: String,
    customerPhone: String,
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    shippingAddress: {
      name: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    billingAddress: {
      name: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: String,
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending' 
    },
    orderStatus: { 
      type: String, 
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending' 
    },
    trackingNumber: String,
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
  });

  orderSchema.index({ orderNumber: 1 });
  orderSchema.index({ customerEmail: 1 });
  orderSchema.index({ razorpayOrderId: 1 });
  orderSchema.index({ createdAt: -1 });

  return mongoose.model('Order', orderSchema);
};

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORB-${timestamp}-${random}`;
}

// Verify Razorpay webhook signature
function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

// Handle Razorpay webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    // Handle different event types
    switch (eventType) {
      case 'payment.captured': {
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      }
      
      case 'payment.failed': {
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      }
      
      case 'order.paid': {
        await handleOrderPaid(event.payload.order.entity, event.payload.payment?.entity);
        break;
      }
      
      case 'refund.created': {
        await handleRefundCreated(event.payload.refund.entity);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

// Handle successful payment capture
async function handlePaymentCaptured(payment: any) {
  try {
    const Order = await getOrderModel() as any;

    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    
    if (order) {
      order.razorpayPaymentId = payment.id;
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.paymentMethod = payment.method;
      order.paidAt = new Date();
      order.updatedAt = new Date();
      await order.save();
      console.log('Order updated after payment capture:', order.orderNumber);
    } else {
      // Create new order if not exists
      const newOrder = await Order.create({
        orderNumber: generateOrderNumber(),
        razorpayOrderId: payment.order_id,
        razorpayPaymentId: payment.id,
        customerEmail: payment.email || 'unknown@email.com',
        customerPhone: payment.contact,
        total: payment.amount / 100,
        currency: payment.currency,
        paymentMethod: payment.method,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paidAt: new Date(),
      });
      console.log('New order created:', newOrder.orderNumber);
    }

    // TODO: Send order confirmation email
    // TODO: Update product inventory

  } catch (error) {
    console.error('Error handling payment capture:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(payment: any) {
  try {
    const Order = await getOrderModel() as any;
    
    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    if (order) {
      order.paymentStatus = 'failed';
      order.updatedAt = new Date();
      order.notes = `Payment failed: ${payment.error_description || 'Unknown error'}`;
      await order.save();
      console.log('Order marked as failed:', order.orderNumber);
    }

    // TODO: Send payment failed notification to customer

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Handle order paid event
async function handleOrderPaid(order: any, payment?: any) {
  try {
    const Order = await getOrderModel() as any;
    
    let dbOrder = await Order.findOne({ razorpayOrderId: order.id });
    
    if (!dbOrder) {
      dbOrder = await Order.create({
        orderNumber: generateOrderNumber(),
        razorpayOrderId: order.id,
        razorpayPaymentId: payment?.id,
        customerEmail: order.notes?.customerEmail || payment?.email || 'unknown@email.com',
        customerName: order.notes?.customerName,
        total: order.amount_paid / 100,
        currency: order.currency,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paidAt: new Date(),
      });
    } else {
      dbOrder.paymentStatus = 'paid';
      dbOrder.orderStatus = 'confirmed';
      dbOrder.paidAt = new Date();
      dbOrder.updatedAt = new Date();
      if (payment?.id) dbOrder.razorpayPaymentId = payment.id;
      await dbOrder.save();
    }

    console.log('Order paid:', dbOrder.orderNumber);

  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

// Handle refund
async function handleRefundCreated(refund: any) {
  try {
    const Order = await getOrderModel() as any;

    const order = await Order.findOne({ razorpayPaymentId: refund.payment_id });

    if (order) {
      order.paymentStatus = 'refunded';
      order.orderStatus = 'cancelled';
      order.updatedAt = new Date();
      order.notes = `Refunded on ${new Date().toISOString()}. Refund ID: ${refund.id}`;
      await order.save();
      console.log('Order refunded:', order.orderNumber);
    }

    // TODO: Send refund confirmation to customer

  } catch (error) {
    console.error('Error handling refund:', error);
  }
}
