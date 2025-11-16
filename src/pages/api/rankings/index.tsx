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

// Calculate ranking score: commits*3 + PRs*5 + reviews*4 + comments*2 + issues*3
function calculateRankingScore(contributor: any) {
  return (
    (contributor.totalCommits || 0) * 3 +
    (contributor.totalPRs || 0) * 5 +
    (contributor.totalReviews || 0) * 4 +
    (contributor.totalComments || 0) * 2 +
    (contributor.totalIssues || 0) * 3
  );
}

// Transform contributor to standard format
function transformContributor(contributor: any, rank: number) {
  // Handle both aggregated (singular: commit, pr) and flat (plural: totalCommits, totalPRs) formats
  const commits = contributor.totalCommits || contributor.commit || 0;
  const prs = contributor.totalPRs || contributor.pr || 0;
  const reviews = contributor.totalReviews || contributor.review || 0;
  const comments = contributor.totalComments || contributor.comment || 0;
  const issues = contributor.totalIssues || contributor.issue || 0;
  
  return {
    rank,
    username: contributor.githubUsername || contributor.username || contributor.login,
    name: contributor.name || contributor.githubUsername,
    avatarUrl: contributor.avatarUrl || contributor.avatar_url,
    commits,
    prs,
    prsOpened: prs,
    prsMerged: 0,
    reviews,
    comments,
    issues,
    score: calculateRankingScore({ totalCommits: commits, totalPRs: prs, totalReviews: reviews, totalComments: comments, totalIssues: issues }),
    totals: {
      commits,
      prsOpened: prs,
      prsMerged: 0,
      reviews,
      comments,
      issuesOpened: issues,
      activityScore: calculateRankingScore({ totalCommits: commits, totalPRs: prs, totalReviews: reviews, totalComments: comments, totalIssues: issues }),
    },
    activityStatus: contributor.activityStatus || 'Active',
    avgResponseTime: contributor.avgResponseTime,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = '10', period = 'all' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');
    const snapshots = db.collection('contributor_snapshots');

    // For weekly/monthly, we need to aggregate from timeline, not use total counts
    let isTimePeriod = period === 'weekly' || period === 'monthly';
    let startDate: Date | null = null;
    
    if (period === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 90); // Use 90 days for testing
    } else if (period === 'monthly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 120); // Use 120 days for testing
    }

    // Helper to get rankings from aggregated timeline data
    const getTimelineRankings = async (type?: string, repo?: string) => {
      const matchStage: any = {};
      
      if (startDate) {
        // Convert timeline.timestamp string to date for comparison
        matchStage['timeline.timestamp'] = { $gte: startDate.toISOString() };
      }
      if (repo) {
        matchStage['timeline.repo'] = repo;
      }
      
      const pipeline: any[] = [
        { $match: { timeline: { $exists: true, $ne: [] } } },
        { $unwind: '$timeline' },
      ];
      
      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }
      
      const groupStage: any = {
        _id: '$_id',
        githubUsername: { $first: '$githubUsername' },
        username: { $first: '$username' },
        name: { $first: '$name' },
        avatarUrl: { $first: '$avatarUrl' },
        activityStatus: { $first: '$activityStatus' },
        avgResponseTime: { $first: '$avgResponseTime' },
      };
      
      if (type) {
        groupStage[type] = {
          $sum: { $cond: [{ $eq: ['$timeline.type', type] }, 1, 0] }
        };
      } else {
        groupStage.totalCommits = { $sum: { $cond: [{ $eq: ['$timeline.type', 'commit'] }, 1, 0] } };
        groupStage.totalPRs = { $sum: { $cond: [{ $eq: ['$timeline.type', 'pr'] }, 1, 0] } };
        groupStage.totalReviews = { $sum: { $cond: [{ $eq: ['$timeline.type', 'review'] }, 1, 0] } };
        groupStage.totalComments = { $sum: { $cond: [{ $eq: ['$timeline.type', 'comment'] }, 1, 0] } };
        groupStage.totalIssues = { $sum: { $cond: [{ $eq: ['$timeline.type', 'issue'] }, 1, 0] } };
      }
      
      pipeline.push({ $group: groupStage });
      
      const sortField = type || 'totalCommits';
      pipeline.push(
        { $sort: { [sortField]: -1 } },
        { $limit: limitNum }
      );
      
      const results = await contributors.aggregate(pipeline).toArray();
      console.log(`[Rankings] Aggregation for type=${type || 'overall'}, repo=${repo || 'all'}: ${results.length} results`);
      if (results.length > 0) {
        console.log(`[Rankings] Sample result:`, JSON.stringify(results[0], null, 2));
      }
      const transformed = results.map((c: any, index: number) => transformContributor(c, index + 1));
      console.log(`[Rankings] Transformed: ${transformed.length} items`);
      if (transformed.length > 0) {
        console.log(`[Rankings] Sample transformed:`, JSON.stringify(transformed[0], null, 2));
      }
      return transformed;
    };

    console.log(`[Rankings] ============================================`);
    console.log(`[Rankings] Period: ${period}, isTimePeriod: ${isTimePeriod}`);
    console.log(`[Rankings] Start date: ${startDate?.toISOString()}`);
    console.log(`[Rankings] Now: ${new Date().toISOString()}`);
    console.log(`[Rankings] ============================================`);
    
    // Fetch all rankings in parallel
    const [
      overall,
      commits,
      prs,
      reviews,
      comments,
      issues,
      eips,
      ercs,
      rips,
    ] = isTimePeriod ? await Promise.all([
      // Use aggregated timeline data for time periods
      getTimelineRankings(),
      getTimelineRankings('commit'),
      getTimelineRankings('pr'),
      getTimelineRankings('review'),
      getTimelineRankings('comment'),
      getTimelineRankings('issue'),
      getTimelineRankings(undefined, 'EIPs'),
      getTimelineRankings(undefined, 'ERCs'),
      getTimelineRankings(undefined, 'RIPs'),
    ]) : await Promise.all([
      // Overall ranking
      contributors
        .find({})
        .sort({ totalCommits: -1 }) // Sort by commits as proxy for activity
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // Top Committers
      contributors
        .find({})
        .sort({ totalCommits: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // Top PR Contributors
      contributors
        .find({})
        .sort({ totalPRs: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // Top Reviewers
      contributors
        .find({})
        .sort({ totalReviews: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // Top Commenters
      contributors
        .find({})
        .sort({ totalComments: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // Top Issue Creators
      contributors
        .find({})
        .sort({ totalIssues: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // EIPs Contributors
      contributors
        .find({ 'timeline.repo': 'EIPs' })
        .sort({ totalCommits: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // ERCs Contributors
      contributors
        .find({ 'timeline.repo': 'ERCs' })
        .sort({ totalCommits: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),

      // Repository-specific rankings (RIPs)
      contributors
        .find({ 'timeline.repo': 'RIPs' })
        .sort({ totalCommits: -1 })
        .limit(limitNum)
        .toArray()
        .then((data) => data.map((c: any, index: number) => transformContributor(c, index + 1))),
    ]);

    console.log(`[Rankings] Results - Overall: ${overall?.length}, Commits: ${commits?.length}, PRs: ${prs?.length}`);

    return res.status(200).json({
      period,
      rankings: {
        overall,
        commits,
        prs,
        reviews,
        comments,
        issues,
        eips,
        ercs,
        rips,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch rankings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
