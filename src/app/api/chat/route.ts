import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { Conversation } from '@/models/Conversation';
import { Message } from '@/models/Message';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the conversation between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [session.user.id, otherUserId] }
    });

    if (!conversation) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch messages
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing receiverId or content' }, { status: 400 });
    }

    await connectToDatabase();

    let conversation = await Conversation.findOne({
      participants: { $all: [session.user.id, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [session.user.id, receiverId]
      });
    }

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: session.user.id,
      receiverId: receiverId,
      content,
      isRead: false
    });

    await newMessage.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
