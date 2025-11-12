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
    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');

    const { type = 'overall', limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    let leaderboard: any[] = [];
    let title = '';
    let description = '';

    switch (type) {
      case 'overall':
        title = 'Overall Activity Leaders';
        description = 'Top contributors by activity score';
        leaderboard = await contributors
          .find()
          .sort({ 'totals.activityScore': -1 })
          .limit(limitNum)
          .project({
            username: 1,
            name: 1,
            avatarUrl: 1,
            'totals.activityScore': 1,
            'totals.commits': 1,
            'totals.prsOpened': 1,
            'totals.reviews': 1,
            activityStatus: 1,
            expertise: 1,
          })
          .toArray();
        break;

      case 'commits':
        title = 'Top Committers';
        description = 'Contributors with most commits';
        leaderboard = await contributors
          .find()
          .sort({ 'totals.commits': -1 })
          .limit(limitNum)
          .project({
            username: 1,
            name: 1,
            avatarUrl: 1,
            'totals.commits': 1,
            'totals.activityScore': 1,
            activityStatus: 1,
          })
          .toArray();
        break;

      case 'prs':
        title = 'Top PR Contributors';
        description = 'Contributors with most PRs merged';
        leaderboard = await contributors
          .find()
          .sort({ 'totals.prsMerged': -1 })
          .limit(limitNum)
          .project({
            username: 1,
            name: 1,
            avatarUrl: 1,
            'totals.prsMerged': 1,
            'totals.prsOpened': 1,
            'totals.activityScore': 1,
            activityStatus: 1,
          })
          .toArray();
        break;

      case 'reviews':
        title = 'Top Reviewers';
        description = 'Contributors with most code reviews';
        leaderboard = await contributors
          .find()
          .sort({ 'totals.reviews': -1 })
          .limit(limitNum)
          .project({
            username: 1,
            name: 1,
            avatarUrl: 1,
            'totals.reviews': 1,
            avgResponseTime: 1,
            'totals.activityScore': 1,
            activityStatus: 1,
          })
          .toArray();
        break;

      case 'rising-stars':
        title = 'Rising Stars';
        description = 'New contributors making an impact';
        leaderboard = await contributors
          .find({ risingStarIndex: { $gt: 0 } })
          .sort({ risingStarIndex: -1 })
          .limit(limitNum)
          .project({
            username: 1,
            name: 1,
            avatarUrl: 1,
            risingStarIndex: 1,
            'totals.activityScore': 1,
            firstContributionDate: 1,
            activityStatus: 1,
          })
          .toArray();
        break;

      case 'mentors':
        title = 'Top Mentors';
        description = 'Contributors helping newcomers';
        leaderboard = await contributors
          .find({ 'totals.reviews': { $gte: 5 } })
          .sort({ 'totals.reviews': -1, 'totals.comments': -1 })
          .limit(limitNum)
          .project({
            username: 1,
            name: 1,
            avatarUrl: 1,
            'totals.reviews': 1,
            'totals.comments': 1,
            avgResponseTime: 1,
            activityStatus: 1,
          })
          .toArray();
        break;

      default:
        return res.status(400).json({ error: 'Invalid leaderboard type' });
    }

    return res.status(200).json({
      type,
      title,
      description,
      data: leaderboard,
      count: leaderboard.length,
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch leaderboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
