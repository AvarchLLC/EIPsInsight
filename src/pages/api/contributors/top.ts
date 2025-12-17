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
      repository,
      metric = 'score',
      limit = '10',
    } = req.query;

    const client = await clientPromise;
    const db = client.db('eipsinsight');
    const collection = db.collection('contributors');

    // Build query
    const query: any = { isBot: false };
    
    if (repository && typeof repository === 'string') {
      query.repositories = repository;
    }

    // Determine sort field based on metric
    let sortField = 'totalScore';
    if (metric === 'commits') {
      sortField = 'repositoryStats.commits';
    } else if (metric === 'pullRequests') {
      sortField = 'repositoryStats.pullRequests';
    } else if (metric === 'reviews') {
      sortField = 'repositoryStats.reviews';
    } else if (metric === 'comments') {
      sortField = 'repositoryStats.comments';
    }

    const limitNum = Math.min(parseInt(limit as string, 10), 100);

    // For repository-specific metrics, we need aggregation
    if (repository && metric !== 'score') {
      const contributors = await collection.aggregate([
        { $match: query },
        { $unwind: '$repositoryStats' },
        { $match: { 'repositoryStats.repository': repository } },
        { $sort: { [`repositoryStats.${metric}`]: -1 } },
        { $limit: limitNum },
      ]).toArray();

      return res.status(200).json({
        success: true,
        data: contributors,
      });
    }

    // For overall metrics, simple query
    const contributors = await collection
      .find(query)
      .sort({ [sortField]: -1 })
      .limit(limitNum)
      .toArray();

    return res.status(200).json({
      success: true,
      data: contributors,
    });
  } catch (error: any) {
    console.error('Top contributors API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch top contributors',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
