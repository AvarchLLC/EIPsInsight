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
      repo,
      type,
      dateFrom,
      dateTo,
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
        { githubUsername: { $regex: search, $options: 'i' } }, // Current schema
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { login: { $regex: search, $options: 'i' } }, // Old schema field
      ];
    }

    // Repo filter (EIPs, ERCs, RIPs) - filter by timeline.repo
    if (repo && typeof repo === 'string') {
      const repoCondition = { 'timeline.repo': repo };
      
      if (filter.$or) {
        // If we already have a search filter, wrap both in $and
        const searchCondition = { $or: filter.$or };
        delete filter.$or;
        filter.$and = [searchCondition, repoCondition];
      } else {
        // No search filter, just add repo filter
        Object.assign(filter, repoCondition);
      }
    }

    // Activity type filter (commits, prs, reviews, comments, issues)
    if (type && typeof type === 'string') {
      const typeMap: Record<string, string> = {
        commits: 'totals.commits',
        prs: 'totals.prsOpened',
        reviews: 'totals.reviews',
        comments: 'totals.comments',
        issues: 'totals.issuesOpened',
      };
      const field = typeMap[type];
      if (field) {
        filter[field] = { $gt: 0 };
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.lastActivityDate = {};
      if (dateFrom && typeof dateFrom === 'string') {
        filter.lastActivityDate.$gte = new Date(dateFrom);
      }
      if (dateTo && typeof dateTo === 'string') {
        filter.lastActivityDate.$lte = new Date(dateTo);
      }
    }

    // Parse pagination
    const limitNum = parseInt(limit as string) || 100;
    const pageNum = parseInt(page as string) || 1;
    const skip = (pageNum - 1) * limitNum;

    // Build sort - use actual MongoDB field names
    const sortOrder = order === 'asc' ? 1 : -1;
    let sort: any;
    
    if (sortBy === 'commits') {
      sort = { 
        totalCommits: sortOrder,      // Current schema
        'totals.commits': sortOrder,  // Nested schema fallback
        total_commits: sortOrder,     // Old schema fallback
      };
    } else if (sortBy === 'prs') {
      sort = { 
        totalPRs: sortOrder,
        'totals.prsOpened': sortOrder,
      };
    } else if (sortBy === 'reviews') {
      sort = { 
        totalReviews: sortOrder,
        'totals.reviews': sortOrder,
      };
    } else { // activityScore
      sort = { 
        totalCommits: sortOrder,      // Sort by commits as proxy for activity
        'totals.activityScore': sortOrder,
        total_commits: sortOrder,
      };
    }

    // Fetch data
    const [rawData, total] = await Promise.all([
      contributors
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      contributors.countDocuments(filter),
    ]);

    // Transform data to normalize field names
    const data = rawData.map((contributor: any) => {
      // Detect schema type
      const hasGithubUsername = !!contributor.githubUsername;
      const hasUsername = !!contributor.username;
      const hasLogin = !!contributor.login;
      
      // Map to standardized format
      const username = contributor.githubUsername || contributor.username || contributor.login || 'unknown';
      
      // Check if data has flat structure (totalCommits) or nested (totals.commits)
      const hasFlatStructure = contributor.totalCommits !== undefined;
      
      return {
        username,
        name: contributor.name || username,
        avatarUrl: contributor.avatarUrl || contributor.avatar_url || null,
        totals: hasFlatStructure ? {
          commits: contributor.totalCommits || 0,
          prsOpened: contributor.totalPRs || 0,
          prsMerged: 0, // Not in current schema
          reviews: contributor.totalReviews || 0,
          comments: contributor.totalComments || 0,
          issuesOpened: contributor.totalIssues || 0,
          activityScore: (
            (contributor.totalCommits || 0) * 3 +
            (contributor.totalPRs || 0) * 5 +
            (contributor.totalReviews || 0) * 4 +
            (contributor.totalComments || 0) * 2 +
            (contributor.totalIssues || 0) * 3
          ),
        } : (contributor.totals || {
          commits: 0,
          prsOpened: 0,
          prsMerged: 0,
          reviews: 0,
          comments: 0,
          issuesOpened: 0,
          activityScore: 0,
        }),
        repos: contributor.repos || [],
        activityStatus: contributor.activityStatus || 'Active',
        lastActivityDate: contributor.lastFetchedAt || contributor.lastActivityDate || contributor.last_updated || null,
        timeline: contributor.timeline || [],
      };
    });

    // Debug: Log first contributor to see data structure
    if (data.length > 0) {
      console.log('Sample contributor data:', JSON.stringify(data[0], null, 2));
    }

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
