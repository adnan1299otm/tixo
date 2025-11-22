import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const messages = await Message.find({ chatId: params.chatId })
    .populate("sender", "name avatar")
    .sort({ createdAt: 1 }); // Oldest first for chat history

  return NextResponse.json(messages);
}

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  const session: any = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, mediaUrl } = await req.json();
  await connectDB();
  const currentUser = await User.findOne({ email: session.user.email });

  const newMessage = await Message.create({
    chatId: params.chatId,
    sender: currentUser._id,
    text,
    mediaUrl,
    type: mediaUrl ? 'image' : 'text'
  });

  // Update Chat last message
  await Chat.findByIdAndUpdate(params.chatId, {
    lastMessage: newMessage._id,
    updatedAt: new Date()
  });

  return NextResponse.json(newMessage);
}