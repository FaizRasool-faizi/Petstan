import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Review } from '@/models/Review';
import { Seller } from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET reviews for a seller or pet
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const petId = searchParams.get('petId');
    const limit = searchParams.get('limit') || '10';

    if (!sellerId && !petId) {
      return NextResponse.json({ message: 'Must provide sellerId or petId' }, { status: 400 });
    }

    await connectToDatabase();
    
    const query: any = {};
    if (sellerId) query.sellerId = sellerId;
    if (petId) query.petId = petId;

    const reviews = await Review.find(query)
                                .sort({ createdAt: -1 })
                                .limit(parseInt(limit as string))
                                .exec();

    const formattedReviews = reviews.map((rev) => {
      const r: any = rev.toObject();
      r.id = r._id.toString();
      delete r._id;
      return r;
    });

    return NextResponse.json(formattedReviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new review (Buyers only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only buyers can leave reviews
    if (!session || session.user.role !== 'buyer') {
      return NextResponse.json({ message: 'Only buyers can leave reviews' }, { status: 403 });
    }

    const { sellerId, petId, rating, comment } = await req.json();

    if (!sellerId || !rating || !comment) {
      return NextResponse.json({ message: 'Missing required review fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Check if seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    }

    // Optional: Verify that this buyer has a 'delivered' order with this seller.
    // For V3 prototype, we assume they can review if they are buyers. 
    // Real implementation should check `Order` collection.

    const newReview = await Review.create({
      buyerId: session.user.id,
      buyerName: session.user.name || 'Anonymous Buyer',
      sellerId,
      petId,
      rating,
      comment,
    });

    // Update Seller's average rating
    const allReviews = await Review.find({ sellerId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    seller.rating = totalRating / allReviews.length;
    await seller.save();

    const rObj: any = newReview.toObject();
    rObj.id = rObj._id.toString();
    delete rObj._id;

    return NextResponse.json(rObj, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
