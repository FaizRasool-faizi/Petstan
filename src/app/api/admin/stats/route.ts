export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';
import { Order } from '@/models/Order';
import { Pet } from '@/models/Pet';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [sellersCount, ordersCount, feedCount, revenueAggregation] = await Promise.all([
      Seller.countDocuments(),
      Order.countDocuments(),
      Pet.countDocuments({ category: 'feed' }),
      Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    return NextResponse.json({
      sellersCount,
      ordersCount,
      feedCount,
      totalRevenue
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
