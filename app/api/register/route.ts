import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, handle } = await req.json();
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      handle: handle || `@${name.replace(/\s+/g, '').toLowerCase()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    });

    return NextResponse.json({ message: "User created successfully", userId: newUser._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}