import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/userModels/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !password || !confirmPassword)
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });

  if (!isValidEmail(email))
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });

  if (password !== confirmPassword)
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });

  if (password.length < 6)
    return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ message: "User already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      emailVerified: null, // Can be set to new Date() if you consider auto-verification
      tier: "Free",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newUser.save();

    return NextResponse.json({ message: "User created" }, { status: 201 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
