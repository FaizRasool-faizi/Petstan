import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';
import { sendOrderConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-06-24.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    } else {
      // In local dev without webhook secret, just parse it
      event = JSON.parse(body);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderIdsStr = session.metadata?.orderIds;

      if (orderIdsStr) {
        const orderIds = JSON.parse(orderIdsStr);
        await connectToDatabase();
        
        await Order.updateMany(
          { _id: { $in: orderIds } },
          { $set: { paymentStatus: 'paid' } }
        );

        console.log(`Successfully marked orders ${orderIdsStr} as paid via Webhook`);
        
        // Send order confirmation emails
        const customerEmail = session.customer_details?.email || session.customer_email;
        if (customerEmail) {
           for (const id of orderIds) {
             // In a real scenario we might pass the exact order amount instead of 0, 
             // but here we just pass the total session amount divided by orders as a fallback, 
             // or just 0 for MVP to keep it simple.
             const amount = session.amount_total ? (session.amount_total / 100) / orderIds.length : 0;
             await sendOrderConfirmation(customerEmail, id, amount);
           }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
