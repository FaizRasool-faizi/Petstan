import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const sellers = await Seller.find({})
      .select('storeName logo rating totalSales warningCount isSuspended contactInfo')
      .sort({ createdAt: -1 });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error: any) {
    console.error('Admin Sellers Error:', error);
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}
