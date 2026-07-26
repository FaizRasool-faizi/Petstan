import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
       return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      phone: '0000000000',
      address: 'Admin HQ',
      role: 'admin'
    });

    await newAdmin.save();

    return NextResponse.json({ message: 'Admin created successfully', admin: { name, email } }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Register Error:', error);
    return NextResponse.json({ error: 'Failed to register admin' }, { status: 500 });
  }
}
