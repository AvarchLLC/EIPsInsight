import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const client = await clientPromise;
    const db = client.db('eipsinsight');
    const collection = db.collection('sync_state');

    const syncStates = await collection.find({}).toArray();

    return res.status(200).json({
      success: true,
      data: syncStates,
    });
  } catch (error: any) {
    console.error('Sync status API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch sync status',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
