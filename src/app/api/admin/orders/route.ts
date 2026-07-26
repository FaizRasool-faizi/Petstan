export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch the latest 100 orders for the admin panel to prevent overload
    const orders = await Order.find({})
      .sort({ orderDate: -1 })
      .limit(100);

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error('Admin Orders Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
