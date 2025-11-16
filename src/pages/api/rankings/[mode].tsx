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
    const { mode } = req.query;
    const {
      page = '1',
      limit = '50',
      period = 'all',
      repo,
    } = req.query;

    if (!mode || typeof mode !== 'string') {
      return res.status(400).json({ error: 'Mode is required' });
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');

    // For weekly/monthly, we need to aggregate from timeline
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
    const getTimelineRankings = async (typeFilter?: string, repoFilter?: string, sortBy?: string) => {
      const matchStage: any = {};
      
      if (startDate) {
        // Convert timeline.timestamp string to date for comparison
        matchStage['timeline.timestamp'] = { $gte: startDate.toISOString() };
      }
      if (repoFilter) {
        matchStage['timeline.repo'] = repoFilter;
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
        totalCommits: { $sum: { $cond: [{ $eq: ['$timeline.type', 'commit'] }, 1, 0] } },
        totalPRs: { $sum: { $cond: [{ $eq: ['$timeline.type', 'pr'] }, 1, 0] } },
        totalReviews: { $sum: { $cond: [{ $eq: ['$timeline.type', 'review'] }, 1, 0] } },
        totalComments: { $sum: { $cond: [{ $eq: ['$timeline.type', 'comment'] }, 1, 0] } },
        totalIssues: { $sum: { $cond: [{ $eq: ['$timeline.type', 'issue'] }, 1, 0] } },
      };
      
      pipeline.push({ $group: groupStage });
      
      // Add filter for specific activity count if needed
      if (typeFilter && sortBy) {
        pipeline.push({ $match: { [sortBy]: { $gt: 0 } } });
      }
      
      const sortField = sortBy || 'totalCommits';
      pipeline.push(
        { $sort: { [sortField]: -1 } },
        { $skip: skip },
        { $limit: limitNum }
      );
      
      const results = await contributors.aggregate(pipeline).toArray();
      
      // Get total count
      const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip and limit
      const countResult = await contributors.aggregate([...countPipeline, { $count: 'total' }]).toArray();
      const total = countResult.length > 0 ? countResult[0].total : 0;
      
      return [
        results.map((c: any, index: number) => transformContributor(c, skip + index + 1)),
        total
      ];
    };
    
    // Build filter for non-time period queries
    let filter: any = {};
    if (repo && typeof repo === 'string') {
      filter['timeline.repo'] = repo;
    }

    let ranking: any[] = [];
    let total = 0;
    let title = '';
    let description = '';

    switch (mode) {
      case 'overall':
        title = 'Overall Rankings';
        description = 'Top contributors by overall activity score';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings(undefined, repo as string, 'totalCommits');
        } else {
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalCommits: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'commits':
        title = 'Top Committers';
        description = 'Contributors with most commits';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings('commit', repo as string, 'totalCommits');
        } else {
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalCommits: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'prs':
        title = 'Top PR Contributors';
        description = 'Contributors with most pull requests';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings('pr', repo as string, 'totalPRs');
        } else {
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalPRs: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'reviews':
        title = 'Top Reviewers';
        description = 'Contributors with most code reviews';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings('review', repo as string, 'totalReviews');
        } else {
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalReviews: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'comments':
        title = 'Top Commenters';
        description = 'Contributors with most comments';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings('comment', repo as string, 'totalComments');
        } else {
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalComments: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'issues':
        title = 'Top Issue Creators';
        description = 'Contributors with most issues opened';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings('issue', repo as string, 'totalIssues');
        } else {
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalIssues: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'eips':
        title = 'EIPs Contributors';
        description = 'Top contributors to EIPs repository';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings(undefined, 'EIPs', 'totalCommits');
        } else {
          filter['timeline.repo'] = 'EIPs';
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalCommits: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'ercs':
        title = 'ERCs Contributors';
        description = 'Top contributors to ERCs repository';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings(undefined, 'ERCs', 'totalCommits');
        } else {
          filter['timeline.repo'] = 'ERCs';
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalCommits: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'rips':
        title = 'RIPs Contributors';
        description = 'Top contributors to RIPs repository';
        if (isTimePeriod) {
          [ranking, total] = await getTimelineRankings(undefined, 'RIPs', 'totalCommits');
        } else {
          filter['timeline.repo'] = 'RIPs';
          [ranking, total] = await Promise.all([
            contributors
              .find(filter)
              .sort({ totalCommits: -1 })
              .skip(skip)
              .limit(limitNum)
              .toArray()
              .then((data) => data.map((c: any, index: number) => transformContributor(c, skip + index + 1))),
            contributors.countDocuments(filter),
          ]);
        }
        break;

      case 'weekly':
      case 'monthly':
        title = mode === 'weekly' ? 'Weekly Leaders' : 'Monthly Leaders';
        description = `Top contributors in the past ${mode === 'weekly' ? 'week' : 'month'}`;
        // Always use timeline aggregation for weekly/monthly modes
        [ranking, total] = await getTimelineRankings(undefined, repo as string, 'totalCommits');
        break;

      default:
        return res.status(400).json({ error: 'Invalid ranking mode' });
    }

    return res.status(200).json({
      mode,
      period,
      repo: repo || null,
      title,
      description,
      data: ranking,
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
      error: 'Failed to fetch ranking',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
