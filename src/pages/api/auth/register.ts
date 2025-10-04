import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with complete schema
    const newUser = {
      name,
      email,
      password: hashedPassword,
      image: null,
      walletAddress: null,
      role: 'user',
      tier: 'Free',
      isVerified: false,
      isActive: true,
      profile: {
        bio: '',
        website: '',
        twitter: '',
        github: '',
        linkedin: '',
        location: '',
        company: '',
        isPublic: false,
        joinedAt: new Date(),
        lastActive: new Date()
      },
      stats: {
        blogsCreated: 0,
        feedbackGiven: 0,
        lastLogin: new Date()
      },
      settings: {
        emailNotifications: true,
        theme: 'system' as const,
        language: 'en'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null
    };

    const result = await usersCollection.insertOne(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        ...userWithoutPassword,
        id: result.insertedId.toString()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}