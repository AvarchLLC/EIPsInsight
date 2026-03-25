// pages/api/unsubscribe.ts
import { connectToDatabase } from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { parseUnsubscribeToken } from '@/utils/subscriptionLinks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    const identity = token ? parseUnsubscribeToken(token) : null;
    if (!identity) {
      return res.status(400).send('Invalid unsubscribe link');
    }

    try {
      const client = await connectToDatabase();
      const db = client.db('eipsinsight');
      await db.collection('subscriptions').deleteOne(identity);
      return res
        .status(200)
        .send('You have been unsubscribed successfully.');
    } catch (err) {
      console.error('❌ Token unsubscribe error:', err);
      return res.status(500).send('Failed to unsubscribe.');
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  if (!email) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { type, id, filter } = req.body;
  const allowedFilters = ['all', 'status', 'content'];
  const allowedTypes = ['eips', 'ercs', 'rips'];

  if (!email || !type || !id || !filter) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type value' });
  }
  if (!allowedFilters.includes(filter)) {
    return res.status(400).json({ error: 'Invalid filter value' });
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
