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
    const { username } = req.query;
    const {
      page = '1',
      limit = '50',
      type,
      repo,
      dateFrom,
      dateTo,
    } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');
    const snapshots = db.collection('contributor_snapshots');

    // Get contributor - search by all possible username fields
    const contributor = await contributors.findOne({
      $or: [
        { githubUsername: username },
        { username: username },
        { login: username },
      ]
    });

    if (!contributor) {
      return res.status(404).json({ error: 'Contributor not found' });
    }

    // Parse pagination
    const limitNum = parseInt(limit as string) || 50;
    const pageNum = parseInt(page as string) || 1;
    const skip = (pageNum - 1) * limitNum;

    // Get timeline from contributor document (new schema)
    let timeline = contributor.timeline || [];
    
    // Apply filters
    if (type && typeof type === 'string') {
      timeline = timeline.filter((item: any) => item.type === type);
    }
    
    if (repo && typeof repo === 'string') {
      timeline = timeline.filter((item: any) => item.repo === repo);
    }
    
    if (dateFrom || dateTo) {
      timeline = timeline.filter((item: any) => {
        const itemDate = new Date(item.timestamp);
        if (dateFrom && itemDate < new Date(dateFrom as string)) return false;
        if (dateTo && itemDate > new Date(dateTo as string)) return false;
        return true;
      });
    }

    // Sort by timestamp descending
    timeline.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = timeline.length;

    // Paginate timeline
    const paginatedTimeline = timeline.slice(skip, skip + limitNum);

    return res.status(200).json({
      username: contributor.githubUsername || contributor.username || contributor.login,
      timeline: paginatedTimeline,
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
      error: 'Failed to fetch contributor timeline',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
