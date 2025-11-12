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

    // Get overall statistics
    const [
      totalContributors,
      activeContributors,
      occasionalContributors,
      dormantContributors,
      risingStars,
      mentors,
      topContributors,
      expertiseBreakdown,
      repoStats,
    ] = await Promise.all([
      // Total contributors
      contributors.countDocuments(),
      
      // Active contributors
      contributors.countDocuments({ activityStatus: 'Active' }),
      
      // Occasional contributors
      contributors.countDocuments({ activityStatus: 'Occasional' }),
      
      // Dormant contributors
      contributors.countDocuments({ activityStatus: 'Dormant' }),
      
      // Rising stars
      contributors.countDocuments({ risingStarIndex: { $gt: 0 } }),
      
      // Mentors (5+ reviews)
      contributors.countDocuments({ 'totals.reviews': { $gte: 5 } }),
      
      // Top 10 contributors
      contributors
        .find()
        .sort({ 'totals.activityScore': -1 })
        .limit(10)
        .project({
          username: 1,
          name: 1,
          avatarUrl: 1,
          'totals.activityScore': 1,
          'totals.commits': 1,
          'totals.prsOpened': 1,
          'totals.reviews': 1,
          activityStatus: 1,
        })
        .toArray(),
      
      // Expertise breakdown
      contributors.aggregate([
        { $unwind: '$expertise' },
        { $group: { _id: '$expertise', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      
      // Repository statistics
      contributors.aggregate([
        { $unwind: '$repos' },
        {
          $group: {
            _id: '$repos.name',
            totalContributors: { $sum: 1 },
            totalCommits: { $sum: '$repos.commits' },
            totalPRs: { $sum: '$repos.prs' },
            totalReviews: { $sum: '$repos.reviews' },
          }
        },
        { $sort: { totalContributors: -1 } },
      ]).toArray(),
    ]);

    // Calculate total activity
    const totalStats = await contributors.aggregate([
      {
        $group: {
          _id: null,
          totalCommits: { $sum: '$totals.commits' },
          totalPRs: { $sum: '$totals.prsOpened' },
          totalPRsMerged: { $sum: '$totals.prsMerged' },
          totalReviews: { $sum: '$totals.reviews' },
          totalComments: { $sum: '$totals.comments' },
          totalIssues: { $sum: '$totals.issuesOpened' },
        }
      }
    ]).toArray();

    const stats = totalStats[0] || {};

    return res.status(200).json({
      overview: {
        totalContributors,
        activeContributors,
        occasionalContributors,
        dormantContributors,
        risingStars,
        mentors,
        activityRate: totalContributors > 0 
          ? Math.round((activeContributors / totalContributors) * 100) 
          : 0,
      },
      totals: {
        commits: stats.totalCommits || 0,
        prs: stats.totalPRs || 0,
        prsMerged: stats.totalPRsMerged || 0,
        reviews: stats.totalReviews || 0,
        comments: stats.totalComments || 0,
        issues: stats.totalIssues || 0,
      },
      topContributors,
      expertiseBreakdown: expertiseBreakdown.map((e: any) => ({
        expertise: e._id,
        count: e.count,
      })),
      repoStats: repoStats.map((r: any) => ({
        repo: r._id,
        contributors: r.totalContributors,
        commits: r.totalCommits,
        prs: r.totalPRs,
        reviews: r.totalReviews,
      })),
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
