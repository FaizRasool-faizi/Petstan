import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';

// GET all sellers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    
    await connectToDatabase();

    let query = Seller.find({ isSuspended: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const sellers = await query.populate('userId', 'name email avatar').exec();

    const formattedSellers = sellers.map((seller) => {
      const s: any = seller.toObject();
      s.id = s._id.toString();
      delete s._id;
      return s;
    });

    return NextResponse.json(formattedSellers);
  } catch (error: any) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
