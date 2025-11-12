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

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');
    const snapshots = db.collection('contributor_snapshots');

    // Get contributor details
    const contributor = await contributors.findOne({ username });

    if (!contributor) {
      return res.status(404).json({ error: 'Contributor not found' });
    }

    // Get snapshots for trend analysis (last 90 days)
    const contributorSnapshots = await snapshots
      .find({ username })
      .sort({ date: -1 })
      .limit(90)
      .toArray();

    // Get rank among all contributors
    const rank = await contributors.countDocuments({
      'totals.activityScore': { $gt: contributor.totals?.activityScore || 0 }
    }) + 1;

    return res.status(200).json({
      ...contributor,
      rank,
      snapshots: contributorSnapshots.reverse(), // Reverse to show oldest first
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch contributor details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
