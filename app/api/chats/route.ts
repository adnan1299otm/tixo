import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";

export async function GET() {
  const session: any = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const currentUser = await User.findOne({ email: session.user.email });

  const chats = await Chat.find({ participants: currentUser._id })
    .populate("participants", "name avatar handle")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name" }
    })
    .sort({ updatedAt: -1 });

  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const session: any = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();
  await connectDB();
  const currentUser = await User.findOne({ email: session.user.email });

  // Check existing
  const existingChat = await Chat.findOne({
    participants: { $all: [currentUser._id, targetUserId] }
  });

  if (existingChat) return NextResponse.json(existingChat);

  const newChat = await Chat.create({
    participants: [currentUser._id, targetUserId]
  });

  return NextResponse.json(newChat);
}