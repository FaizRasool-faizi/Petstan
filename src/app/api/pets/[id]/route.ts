import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Pet } from '@/models/Pet';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET specific pet
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const pet = await Pet.findById(params.id);
    if (!pet) {
      return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
    }
    
    // Increment views
    pet.views += 1;
    await pet.save();

    const petObj: any = pet.toObject();
    petObj.id = petObj._id.toString();
    delete petObj._id;

    return NextResponse.json(petObj);
  } catch (error: any) {
    console.error('Error fetching pet:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT specific pet (Sellers & Admins)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const pet = await Pet.findById(params.id);
    if (!pet) {
      return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
    }

    // Ensure seller owns the listing or user is an admin
    if (session.user.role === 'seller' && pet.sellerId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    if (body.category === 'feed' && session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Sellers are not allowed to sell Feed.' }, { status: 403 });
    }

    Object.assign(pet, body);
    await pet.save();

    const petObj: any = pet.toObject();
    petObj.id = petObj._id.toString();

    return NextResponse.json(petObj);
  } catch (error: any) {
    console.error('Error updating pet:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE specific pet (Sellers & Admins)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const pet = await Pet.findById(params.id);
    if (!pet) {
      return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
    }

    // Ensure seller owns the listing or user is admin
    if (session.user.role === 'seller' && pet.sellerId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await Pet.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Pet deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting pet:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
