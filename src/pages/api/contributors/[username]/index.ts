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
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Username is required', code: 'INVALID_PARAMS' },
      });
    }

    const client = await clientPromise;
    const db = client.db('eipsinsight');
    const collection = db.collection('contributors');

    const contributor = await collection.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    });

    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: { message: 'Contributor not found', code: 'NOT_FOUND' },
      });
    }

    return res.status(200).json({
      success: true,
      data: contributor,
    });
  } catch (error: any) {
    console.error('Contributor details API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch contributor',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
