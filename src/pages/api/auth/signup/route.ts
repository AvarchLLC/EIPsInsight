import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/userModels/user';
import { connectToDatabase } from '@/lib/mongodb'; // Import the function

export async function POST(request: Request) {
    const { name, email, password, confirmPassword } = await request.json();
    const db = "test";

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!name || !email || !password || !confirmPassword) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (confirmPassword !== password) {
        return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    if (password?.length < 6) {
        return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    try {
        await connectToDatabase(); // Call the function
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
        });

        await newUser.save();
        return NextResponse.json({ message: "User created" }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}