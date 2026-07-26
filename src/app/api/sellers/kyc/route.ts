import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { cnicNumber, cnicFront, cnicBack } = await req.json();

    if (!cnicNumber || !cnicFront || !cnicBack) {
      return NextResponse.json({ message: 'Missing required KYC fields' }, { status: 400 });
    }

    await connectToDatabase();
    
    const seller = await Seller.findOne({ userId: session.user.id });
    
    if (!seller) {
      return NextResponse.json({ message: 'Seller profile not found' }, { status: 404 });
    }

    seller.kyc = {
      cnicNumber,
      cnicFront,
      cnicBack,
      status: 'pending',
    };

    await seller.save();

    return NextResponse.json({ message: 'KYC submitted successfully', status: 'pending' });
  } catch (error: any) {
    console.error('Error submitting KYC:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
