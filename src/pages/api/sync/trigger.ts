import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { incremental = true } = req.body;

    const client = await clientPromise;
    const db = client.db('eipsinsight');
    const collection = db.collection('sync_state');

    // Update all repositories to 'running' status
    await collection.updateMany(
      {},
      {
        $set: {
          status: 'running',
          updatedAt: new Date(),
        },
      }
    );

    // Note: In a real implementation, this would trigger a background job
    // For now, we just update the status to indicate sync is requested
    // The actual sync would be handled by a separate service/cron job

    return res.status(200).json({
      success: true,
      message: 'Sync triggered successfully',
      data: {
        incremental,
        triggeredAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Trigger sync API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to trigger sync',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
