// pages/api/subscriptions.ts
import { connectToDatabase } from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const client = await connectToDatabase();
    const db = client.db('eipsinsight');

    const subs = await db.collection('subscriptions').find({ email }).toArray();
    return res.status(200).json(subs);
  } catch (err) {
    console.error('❌ Failed to fetch subscriptions:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
