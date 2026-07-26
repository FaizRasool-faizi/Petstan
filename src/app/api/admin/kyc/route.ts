export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET all pending KYC applications
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find all sellers whose KYC status is pending
    const sellers = await Seller.find({ 'kyc.status': 'pending' })
                                .populate('userId', 'name email avatar')
                                .exec();

    const formattedSellers = sellers.map((seller) => {
      const s: any = seller.toObject();
      s.id = s._id.toString();
      delete s._id;
      return s;
    });

    return NextResponse.json(formattedSellers);
  } catch (error: any) {
    console.error('Error fetching KYC applications:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT approve or reject KYC application
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { sellerId, status } = await req.json(); // status: 'approved' | 'rejected'

    if (!sellerId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    await connectToDatabase();
    
    const seller = await Seller.findById(sellerId);
    
    if (!seller) {
      return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    }

    seller.kyc.status = status;
    seller.isVerified = status === 'approved';

    await seller.save();

    return NextResponse.json({ message: `KYC ${status} successfully` });
  } catch (error: any) {
    console.error('Error updating KYC application:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
