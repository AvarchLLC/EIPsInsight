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
    const {
      q,
      repository,
      sortBy = 'totalScore',
      sortOrder = 'desc',
      page = '1',
      limit = '20',
    } = req.query;

    const client = await clientPromise;
    const db = client.db('eipsinsight');
    const collection = db.collection('contributors');

    // Build query
    const query: any = { isBot: false };
    
    if (q && typeof q === 'string') {
      query.$or = [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ];
    }

    if (repository && typeof repository === 'string') {
      query.repositories = repository;
    }

    // Build sort
    const sortField = sortBy as string;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortDirection };

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [contributors, total] = await Promise.all([
      collection.find(query).sort(sort).skip(skip).limit(limitNum).toArray(),
      collection.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: contributors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Contributors search API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch contributors',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
