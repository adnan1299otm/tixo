import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User"; // Ensure User model is registered
import { getServerSession } from "next-auth";

export async function GET() {
  await connectDB();
  // Populate user details for the feed
  const posts = await Post.find()
    .populate("user", "name handle avatar isVerified")
    .sort({ createdAt: -1 })
    .limit(20);
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session: any = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, image } = await req.json();
  await connectDB();

  // Find user by email to get _id
  const user = await User.findOne({ email: session.user.email });

  const newPost = await Post.create({
    user: user._id,
    content,
    image,
  });

  return NextResponse.json(newPost, { status: 201 });
}