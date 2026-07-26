import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';
import { Pet } from '@/models/Pet';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET orders for current user (Buyer or Seller)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const query: any = {};
    if (session.user.role === 'seller') {
      query.sellerId = session.user.id;
    } else if (session.user.role === 'buyer') {
      query.buyerId = session.user.id;
    } else if (session.user.role === 'admin') {
      // Admins see all
    } else {
      return NextResponse.json({ message: 'Invalid role' }, { status: 403 });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).exec();

    const formattedOrders = orders.map((order) => {
      const o: any = order.toObject();
      o.id = o._id.toString();
      delete o._id;
      return o;
    });

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only buyers can place orders
    if (!session || session.user.role !== 'buyer') {
      return NextResponse.json({ message: 'Only buyers can place orders' }, { status: 403 });
    }

    const { items, shippingAddress, paymentMethod, notes, buyerName, buyerEmail, buyerPhone } = await req.json();

    if (!items || items.length === 0 || !shippingAddress || !buyerPhone) {
      return NextResponse.json({ message: 'Missing required order fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Group items by sellerId (since a buyer might have items from multiple sellers in cart)
    // For V4 prototype, we assume the frontend sends one order per seller, or we split them here.
    // Let's assume the frontend sends a single seller's items per request, or we split it here.
    // Actually, splitting it into multiple orders is safer.
    
    // Calculate total amount and verify stock
    let totalAmount = 0;
    const sellerId = items[0].sellerId; // Assuming all items are from the same seller for simplicity in this endpoint. 
    // In a real app, you'd iterate and create multiple orders if there are multiple sellers.

    for (const item of items) {
      const pet = await Pet.findById(item.petId);
      if (!pet) {
        return NextResponse.json({ message: `Pet ${item.petName} not found` }, { status: 404 });
      }
      if (pet.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${item.petName}` }, { status: 400 });
      }
      totalAmount += item.price * item.quantity;
      
      // Deduct stock
      pet.stock -= item.quantity;
      if (pet.stock === 0) {
        pet.status = 'sold';
      }
      await pet.save();
    }

    const newOrder = await Order.create({
      buyerId: session.user.id,
      buyerName: buyerName || session.user.name || 'Buyer',
      buyerEmail: buyerEmail || session.user.email || 'guest@petstan.pk',
      buyerPhone: buyerPhone || '0000000000',
      sellerId: sellerId,
      sellerName: items[0].sellerName,
      items: items.map((i: any) => ({
        petId: i.petId,
        petName: i.petName,
        petImage: i.petImage,
        quantity: i.quantity,
        price: i.price
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      notes,
    });

    const oObj: any = newOrder.toObject();
    oObj.id = oObj._id.toString();
    delete oObj._id;

    return NextResponse.json(oObj, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
