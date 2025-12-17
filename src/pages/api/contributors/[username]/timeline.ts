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
    const {
      repository,
      activityType,
      startDate,
      endDate,
      sortOrder = 'desc',
      page = '1',
      limit = '20',
    } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Username is required', code: 'INVALID_PARAMS' },
      });
    }

    const client = await clientPromise;
    const db = client.db('eipsinsight');
    const collection = db.collection('activities');

    // Build query
    const query: any = {
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    };

    if (repository && typeof repository === 'string') {
      query.repository = repository;
    }

    if (activityType && typeof activityType === 'string') {
      query.activityType = activityType;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate && typeof startDate === 'string') {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate && typeof endDate === 'string') {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Build sort
    const sortDirection: 1 | -1 = sortOrder === 'asc' ? 1 : -1;
    const sort = { timestamp: sortDirection };

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [activities, total] = await Promise.all([
      collection.find(query).sort(sort).skip(skip).limit(limitNum).toArray(),
      collection.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Contributor timeline API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch timeline',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
