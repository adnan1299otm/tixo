
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET() {
  const session: any = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email })
    .populate('followers', 'name handle avatar')
    .populate('following', 'name handle avatar');

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session: any = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, handle, bio, website, gender, birthday, avatar } = body;
    
    await connectDB();

    // 1. Check if handle is being changed and if it's already taken
    if (handle) {
      const existingHandle = await User.findOne({ 
        handle, 
        email: { $ne: session.user.email } 
      });
      
      if (existingHandle) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
      }
    }

    // 2. Update User
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name, 
        handle, 
        bio, 
        website, 
        gender, 
        birthday,
        avatar // In a real app, this URL comes from Cloudinary/S3 before hitting this API
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ message: "Profile saved.", user: updatedUser });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
