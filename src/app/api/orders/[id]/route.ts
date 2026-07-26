import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// PUT update order status
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ message: 'Missing status' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Only allow seller to update their own orders (admins can update any)
    if (session.user.role === 'seller' && order.sellerId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.deliveryDate = new Date();
      if (order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid';
      }
    }

    await order.save();

    const oObj: any = order.toObject();
    oObj.id = oObj._id.toString();
    delete oObj._id;

    return NextResponse.json(oObj);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
