export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET my seller profile
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const seller = await Seller.findOne({ userId: session.user.id });
    
    if (!seller) {
      return NextResponse.json({ message: 'Seller profile not found' }, { status: 404 });
    }

    const sellerObj: any = seller.toObject();
    sellerObj.id = sellerObj._id.toString();
    delete sellerObj._id;

    return NextResponse.json(sellerObj);
  } catch (error: any) {
    console.error('Error fetching seller profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT my seller profile (Store Settings update)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();
    
    const seller = await Seller.findOne({ userId: session.user.id });
    
    if (!seller) {
      return NextResponse.json({ message: 'Seller profile not found' }, { status: 404 });
    }

    // Assign allowed fields
    if (body.storeName) seller.storeName = body.storeName;
    if (body.storeDescription) seller.storeDescription = body.storeDescription;
    if (body.contactInfo) seller.contactInfo = { ...seller.contactInfo, ...body.contactInfo };
    if (body.bankDetails) seller.bankDetails = { ...seller.bankDetails, ...body.bankDetails };
    if (body.registrationNumber !== undefined) seller.registrationNumber = body.registrationNumber;
    if (body.shopTimings !== undefined) seller.shopTimings = body.shopTimings;
    if (body.logo) seller.logo = body.logo;
    if (body.bannerImage) seller.bannerImage = body.bannerImage;

    await seller.save();

    const sellerObj: any = seller.toObject();
    sellerObj.id = sellerObj._id.toString();

    return NextResponse.json(sellerObj);
  } catch (error: any) {
    console.error('Error updating seller profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
