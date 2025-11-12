import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.CONTRI_URI || process.env.OPENPRS_MONGODB_URI || 'mongodb://localhost:27017/eipsinsight';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client;
    console.log('Connected to MongoDB for contributors');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');

    const {
      limit = '100',
      page = '1',
      sortBy = 'activityScore',
      order = 'desc',
      activityStatus,
      expertise,
      search,
    } = req.query;

    // Build filter query
    const filter: any = {};

    if (activityStatus && typeof activityStatus === 'string') {
      filter.activityStatus = activityStatus;
    }

    if (expertise && typeof expertise === 'string') {
      filter.expertise = expertise;
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Parse pagination
    const limitNum = parseInt(limit as string) || 100;
    const pageNum = parseInt(page as string) || 1;
    const skip = (pageNum - 1) * limitNum;

    // Build sort
    const sortField = sortBy === 'activityScore' ? 'totals.activityScore' : 
                     sortBy === 'commits' ? 'totals.commits' :
                     sortBy === 'prs' ? 'totals.prsOpened' :
                     sortBy === 'reviews' ? 'totals.reviews' :
                     'totals.activityScore';
    
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    // Fetch data
    const [data, total] = await Promise.all([
      contributors
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      contributors.countDocuments(filter),
    ]);

    return res.status(200).json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: skip + limitNum < total,
        hasPrevPage: pageNum > 1,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch contributors',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
