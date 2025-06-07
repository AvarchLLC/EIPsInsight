import { NextApiRequest, NextApiResponse } from 'next';
import { syncEipChanges } from '@/utils/sync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const token = req.query.token;
  const secret = process.env.CRON_SECRET;

  if (token !== secret) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
    await syncEipChanges();
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
