// src/pages/api/subscribe.ts
import { addSubscription } from '@/utils/subscriptions';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, type, id, filter } = req.body;

  if (!email || !type || !id || !filter) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await addSubscription({ email, type, id, filter });
    console.log('✅ Subscription inserted:', { email, type, id, filter });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ DB error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
