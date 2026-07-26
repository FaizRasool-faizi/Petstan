import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderIds } = await req.json();

    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json({ message: 'No orders provided' }, { status: 400 });
    }

    await connectToDatabase();

    const orders = await Order.find({ _id: { $in: orderIds }, buyerId: session.user.id });

    if (orders.length !== orderIds.length) {
      return NextResponse.json({ message: 'Some orders not found or unauthorized' }, { status: 404 });
    }

    // Build Stripe Line Items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        lineItems.push({
          price_data: {
            currency: 'pkr',
            product_data: {
              name: item.petName,
              images: [item.petImage],
              metadata: {
                petId: item.petId.toString(),
                orderId: order._id.toString(),
              },
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents/paisa
          },
          quantity: item.quantity,
        });
      });
    });

    const appUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: session.user.email || undefined,
      success_url: `${appUrl}/cart?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart?canceled=true`,
      client_reference_id: session.user.id,
      metadata: {
        orderIds: JSON.stringify(orderIds.map((id: string) => id.toString())),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
