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

    // Get contributor details - search by all possible username fields
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

    // Get snapshots for trend analysis (last 90 days)
    const actualUsername = contributor.githubUsername || contributor.username || contributor.login;
    const contributorSnapshots = await snapshots
      .find({ 
        $or: [
          { username: actualUsername },
          { githubUsername: actualUsername },
        ]
      })
      .sort({ date: -1 })
      .limit(90)
      .toArray();

    // Calculate activity score from flat structure
    const activityScore = contributor.totals?.activityScore || (
      (contributor.totalCommits || 0) * 3 +
      (contributor.totalPRs || 0) * 5 +
      (contributor.totalReviews || 0) * 4 +
      (contributor.totalComments || 0) * 2 +
      (contributor.totalIssues || 0) * 3
    );

    // Get rank among all contributors
    const rank = await contributors.countDocuments({
      $or: [
        { 'totals.activityScore': { $gt: activityScore } },
        { 
          $expr: { 
            $gt: [
              { 
                $add: [
                  { $multiply: [{ $ifNull: ['$totalCommits', 0] }, 3] },
                  { $multiply: [{ $ifNull: ['$totalPRs', 0] }, 5] },
                  { $multiply: [{ $ifNull: ['$totalReviews', 0] }, 4] },
                  { $multiply: [{ $ifNull: ['$totalComments', 0] }, 2] },
                  { $multiply: [{ $ifNull: ['$totalIssues', 0] }, 3] },
                ]
              },
              activityScore
            ]
          }
        }
      ]
    }) + 1;

    // Aggregate repo-specific data from timeline
    const timeline = contributor.timeline || [];
    const repoStats: Record<string, any> = {};
    let totalPrsMerged = 0;
    
    timeline.forEach((item: any) => {
      const repo = item.repo || 'Unknown';
      if (!repoStats[repo]) {
        repoStats[repo] = {
          name: repo,
          commits: 0,
          prs: 0,
          prsMerged: 0,
          reviews: 0,
          comments: 0,
          issues: 0,
        };
      }
      
      switch (item.type) {
        case 'commit':
          repoStats[repo].commits++;
          break;
        case 'pr':
          repoStats[repo].prs++;
          // Check if PR is merged
          if (item.metadata?.state === 'merged' || item.metadata?.merged === true || item.state === 'merged') {
            repoStats[repo].prsMerged++;
            totalPrsMerged++;
          }
          break;
        case 'review':
          repoStats[repo].reviews++;
          break;
        case 'comment':
          repoStats[repo].comments++;
          break;
        case 'issue':
          repoStats[repo].issues++;
          break;
      }
    });
    
    const repos = Object.values(repoStats).filter((r: any) => 
      r.commits > 0 || r.prs > 0 || r.reviews > 0 || r.comments > 0 || r.issues > 0
    );

    // Transform to expected format
    const hasFlatStructure = contributor.totalCommits !== undefined;
    
    // Calculate totals from timeline if nested structure
    let calculatedTotals = null;
    if (!hasFlatStructure && contributor.totals) {
      calculatedTotals = {
        ...contributor.totals,
        prsMerged: totalPrsMerged || contributor.totals.prsMerged || 0,
      };
    }
    
    const transformedContributor = {
      username: contributor.githubUsername || contributor.username || contributor.login,
      name: contributor.name || contributor.githubUsername || contributor.username,
      avatarUrl: contributor.avatarUrl || contributor.avatar_url,
      email: contributor.email,
      company: contributor.company,
      bio: contributor.bio,
      totals: hasFlatStructure ? {
        commits: contributor.totalCommits || 0,
        prsOpened: contributor.totalPRs || 0,
        prsMerged: totalPrsMerged || contributor.prsMerged || 0,
        reviews: contributor.totalReviews || 0,
        comments: contributor.totalComments || 0,
        issuesOpened: contributor.totalIssues || 0,
        activityScore,
      } : (calculatedTotals || contributor.totals),
      repos: repos.length > 0 ? repos : (contributor.repos || []),
      activityStatus: contributor.activityStatus || 'Active',
      lastActivityDate: contributor.lastFetchedAt || contributor.lastActivityDate,
      firstContributionDate: contributor.firstContributionDate,
      risingStarIndex: contributor.risingStarIndex,
      expertise: contributor.expertise,
      languageBreakdown: contributor.languageBreakdown,
      avgResponseTime: contributor.avgResponseTime,
      timeline: timeline,
    };

    return res.status(200).json({
      ...transformedContributor,
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
