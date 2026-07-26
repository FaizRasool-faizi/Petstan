import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User, Seller } from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, password, role, storeName, storeDescription } = body;

    if (!name || !email || !password || !phone || !address || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'seller' && (!storeName || !storeDescription)) {
      return NextResponse.json({ message: 'Store Name and Description required for sellers' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    // If role is seller, create Seller profile
    if (role === 'seller') {
      await Seller.create({
        userId: user._id,
        storeName,
        storeDescription,
        contactInfo: {
          phone,
          email,
          address,
        },
      });
    }

    // Send Welcome Email
    await sendWelcomeEmail(email, name);

    return NextResponse.json({ message: 'User registered successfully', userId: user._id }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'An error occurred during registration', error: error.message }, { status: 500 });
  }
}
