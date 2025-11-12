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

interface TimeRange {
  start: Date;
  end: Date;
  label: string;
}

function getTimeRange(period: string): TimeRange {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  
  let start = new Date(now);
  let label = '';
  
  switch (period) {
    case 'weekly':
      start.setDate(now.getDate() - 7);
      label = 'Last 7 Days';
      break;
    case 'monthly':
      start.setMonth(now.getMonth() - 1);
      label = 'Last 30 Days';
      break;
    case 'yearly':
      start.setFullYear(now.getFullYear() - 1);
      label = 'Last 365 Days';
      break;
    case 'overall':
    default:
      start = new Date(0); // Beginning of time
      label = 'All Time';
      break;
  }
  
  start.setHours(0, 0, 0, 0);
  
  return { start, end, label };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');
    const snapshots = db.collection('contributor_snapshots');

    const {
      period = 'overall', // weekly, monthly, yearly, overall
      metric = 'activityScore', // activityScore, commits, prs, reviews
      limit = '20'
    } = req.query;

    const limitNum = parseInt(limit as string) || 20;
    const timeRange = getTimeRange(period as string);

    let leaderboardData: any[] = [];

    if (period === 'overall') {
      // For overall, use the main contributors collection
      let sortField: string;
      if (metric === 'activityScore') {
        sortField = 'totals.activityScore';
      } else if (metric === 'commits') {
        sortField = 'totals.commits';
      } else if (metric === 'prs') {
        sortField = 'totals.prsMerged';
      } else if (metric === 'reviews') {
        sortField = 'totals.reviews';
      } else {
        sortField = 'totals.activityScore';
      }

      leaderboardData = await contributors
        .find()
        .sort({ [sortField]: -1 } as any)
        .limit(limitNum)
        .project({
          username: 1,
          name: 1,
          avatarUrl: 1,
          company: 1,
          totals: 1,
          activityStatus: 1,
          risingStarIndex: 1,
          expertise: 1,
          repos: 1,
        })
        .toArray();

      // Add rank and value
      leaderboardData = leaderboardData.map((contributor: any, index: number) => {
        let value = 0;
        const totals = contributor.totals || {};
        if (metric === 'activityScore') {
          value = totals.activityScore || 0;
        } else if (metric === 'commits') {
          value = totals.commits || 0;
        } else if (metric === 'prs') {
          value = totals.prsMerged || 0;
        } else if (metric === 'reviews') {
          value = totals.reviews || 0;
        } else {
          value = totals.activityScore || 0;
        }
        
        return {
          ...contributor,
          rank: index + 1,
          value,
        };
      });

    } else {
      // For time-based queries, aggregate from snapshots
      const metricField = metric === 'activityScore' ? '$metrics.activityScore' :
                         metric === 'commits' ? '$totals.commits' :
                         metric === 'prs' ? '$totals.prsMerged' :
                         metric === 'reviews' ? '$totals.reviews' :
                         '$metrics.activityScore';

      // Get snapshots within the time range
      const snapshotsData = await snapshots.aggregate([
        {
          $match: {
            date: { $gte: timeRange.start, $lte: timeRange.end }
          }
        },
        {
          $group: {
            _id: '$username',
            totalActivity: { $sum: metricField },
            latestSnapshot: { $last: '$$ROOT' }
          }
        },
        {
          $sort: { totalActivity: -1 }
        },
        {
          $limit: limitNum
        }
      ]).toArray();

      // Enrich with contributor details
      const usernames = snapshotsData.map(s => s._id);
      const contributorDetails = await contributors
        .find({ username: { $in: usernames } })
        .project({
          username: 1,
          name: 1,
          avatarUrl: 1,
          company: 1,
          activityStatus: 1,
          risingStarIndex: 1,
          expertise: 1,
          repos: 1,
        })
        .toArray();

      const detailsMap = new Map(contributorDetails.map(c => [c.username, c]));

      leaderboardData = snapshotsData.map((snapshot, index) => {
        const details = detailsMap.get(snapshot._id) || {};
        return {
          rank: index + 1,
          username: snapshot._id,
          value: snapshot.totalActivity,
          ...details,
          periodData: {
            activityScore: snapshot.totalActivity,
            commits: snapshot.latestSnapshot?.totals?.commits || 0,
            prs: snapshot.latestSnapshot?.totals?.prsMerged || 0,
            reviews: snapshot.latestSnapshot?.totals?.reviews || 0,
          }
        };
      });
    }

    // Calculate statistics
    const stats = {
      totalContributors: leaderboardData.length,
      topScore: leaderboardData[0]?.value || 0,
      avgScore: leaderboardData.reduce((sum, c) => sum + (c.value || 0), 0) / (leaderboardData.length || 1),
    };

    return res.status(200).json({
      period: period as string,
      metric: metric as string,
      timeRange: {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString(),
        label: timeRange.label,
      },
      leaderboard: leaderboardData,
      stats,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
