import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Pet } from '@/models/Pet';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET all pets with filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort');

    await connectToDatabase();

    const query: any = { status: 'active' };
    if (category && category !== 'all') {
      query.category = category;
    }

    let petsQuery = Pet.find(query);

    if (sort === 'newest') {
      petsQuery = petsQuery.sort({ createdAt: -1 });
    } else if (sort === 'price_asc') {
      petsQuery = petsQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      petsQuery = petsQuery.sort({ price: -1 });
    }

    if (limit) {
      petsQuery = petsQuery.limit(parseInt(limit));
    }

    const pets = await petsQuery.exec();

    // Transform _id to id for frontend compatibility
    const formattedPets = pets.map((pet) => {
      const petObj: any = pet.toObject();
      petObj.id = petObj._id.toString();
      delete petObj._id;
      return petObj;
    });

    return NextResponse.json(formattedPets);
  } catch (error: any) {
    console.error('Error fetching pets:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new pet listing (Sellers only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    if (body.category === 'feed') {
      return NextResponse.json({ message: 'Sellers are not allowed to sell Feed.' }, { status: 403 });
    }

    await connectToDatabase();

    const pet = await Pet.create({
      ...body,
      sellerId: session.user.id,
      // Will inject sellerName and logo properly from Seller profile later,
      // for now assume body contains them or default
      sellerName: body.sellerName || session.user.name,
      views: 0,
      likes: 0,
      status: 'active',
    });

    const petObj: any = pet.toObject();
    petObj.id = petObj._id.toString();
    
    return NextResponse.json(petObj, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pet:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
