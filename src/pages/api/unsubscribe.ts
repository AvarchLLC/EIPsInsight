// pages/api/unsubscribe.ts
import { connectToDatabase } from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, type, id, filter } = req.body;

  if (!email || !type || !id || !filter) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('eipsinsight');

    await db.collection('subscriptions').deleteOne({ email, type, id, filter });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Unsubscribe error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
