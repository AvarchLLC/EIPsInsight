import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, password } = req.body;

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection("users");

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    // Update user in database
    await usersCollection.updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    // Force session update by modifying the token
    const token = await getToken({ req });
    if (token) {
      // This will trigger NextAuth to update the session
      token.name = name || token.name;
      token.email = session.user.email;
    }

    return res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}