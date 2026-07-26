import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { User, Seller } from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { storeName, storeDescription, phone, address } = body;

    if (!storeName || !storeDescription || !phone || !address) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.role === 'seller') {
      return NextResponse.json({ error: 'User is already a seller' }, { status: 400 });
    }

    // Update user
    user.role = 'seller';
    user.phone = phone;
    user.address = address;
    await user.save();

    // Create Seller document
    await Seller.create({
      userId: user._id,
      storeName,
      storeDescription,
      contactInfo: {
        phone,
        email: user.email,
        address,
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Profile Completion Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
