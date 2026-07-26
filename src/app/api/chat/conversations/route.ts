import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Conversation } from '@/models/Conversation';
import { User } from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch conversations where the user is a participant
    // Populate the other participant's details
    const conversations = await Conversation.find({
      participants: session.user.id
    })
    .populate({
      path: 'participants',
      model: User,
      select: 'name avatar role',
    })
    .sort({ lastMessageAt: -1 });

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error('Fetch Conversations Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
