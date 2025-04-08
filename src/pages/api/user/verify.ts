// pages/api/user/verify.ts
import { connectToDatabase } from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    const client = await connectToDatabase();
    const db = client.db();
    
    const user = await db.collection('users').findOne(
      { email: email },
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password:user.password,
      image: user.image,
      tier: user.tier || 'Free',
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}