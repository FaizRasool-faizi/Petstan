import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Pet } from '@/models/Pet';
import { Seller } from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectToDatabase();
    
    // Find the admin's seller profile, or create one if it doesn't exist
    let adminSeller = await Seller.findOne({ userId: (session.user as any).id });
    
    if (!adminSeller) {
      adminSeller = new Seller({
        userId: (session.user as any).id,
        storeName: 'Petstan Official Store',
        storeDescription: 'Official Petstan branded feed and supplies.',
        logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=petstan',
        rating: 5.0,
        contactInfo: {
          phone: '111-222-3333',
          email: 'admin@petstan.com',
          address: 'Petstan HQ, Pakistan'
        },
        isVerified: true
      });
      await adminSeller.save();
    }

    const newFeed = new Pet({
      sellerId: adminSeller._id,
      sellerName: adminSeller.storeName,
      sellerLogo: adminSeller.logo,
      name: data.name,
      category: 'feed',
      breed: data.breed || 'N/A', // Using breed field to store 'Feed Type'
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description,
      images: [data.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=800&fit=crop'],
      age: 'N/A',
      healthStatus: 'Nutritionally Certified',
      gender: 'male',
      vaccinated: false,
      trained: false,
      status: 'active',
      isVerified: true
    });

    await newFeed.save();

    return NextResponse.json(newFeed, { status: 201 });
  } catch (error: any) {
    console.error('Admin Feed Error:', error);
    return NextResponse.json({ error: 'Failed to add feed product' }, { status: 500 });
  }
}
