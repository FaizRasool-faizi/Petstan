import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Seller } from '@/models/User';
import { Pet } from '@/models/Pet';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, suspendStatus } = await request.json();
    await connectToDatabase();

    const seller = await Seller.findById(params.id);
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    if (action === 'warn') {
      seller.warningCount = (seller.warningCount || 0) + 1;
      await seller.save();
      return NextResponse.json({ message: 'Warning sent', warningCount: seller.warningCount }, { status: 200 });
    }

    if (action === 'suspend') {
      seller.isSuspended = suspendStatus;
      await seller.save();

      // CEO Note Fix: Mark pets as inactive if suspended to prevent new orders
      if (suspendStatus) {
        await Pet.updateMany({ sellerId: seller._id, status: 'active' }, { $set: { status: 'inactive' } });
      }

      return NextResponse.json({ message: `Seller ${suspendStatus ? 'suspended' : 'unsuspended'}` }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Admin Sellers PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
  }
}
