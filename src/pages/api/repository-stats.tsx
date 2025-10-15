import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.OPENPRS_MONGODB_URI;
const DBNAME = process.env.OPENPRS_DATABASE;

// Repository stats schema - matches your scheduler schema
const repoStatsSchema = new mongoose.Schema({
  repository: String,
  total_contributors: Number,
  total_commits: Number,
  total_additions: Number,
  total_deletions: Number,
  top_contributors: [{
    login: String,
    commits: Number,
    additions: Number,
    deletions: Number,
    rank: Number
  }],
  weekly_activity: [{
    week: Date,
    total_commits: Number,
    total_additions: Number,
    total_deletions: Number,
    active_contributors: Number
  }],
  summary_text: String,
  last_updated: Date
}, { strict: false });

// Create or get the model
const REPO_STATS = mongoose.models.REPO_STATS || mongoose.model("REPO_STATS", repoStatsSchema, "repository_stats");

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, { dbName: DBNAME });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { repository } = req.query;

    // Build query filter
    let filter = {};
    if (repository && typeof repository === 'string') {
      filter = { repository: repository };
    }

    // Fetch repository statistics
    const repoStats = await REPO_STATS
      .find(filter)
      .sort({ repository: 1 }) // Sort by repository name
      .lean();

    // Transform the data to ensure proper date handling
    const transformedStats = repoStats.map(stats => ({
      ...stats,
      weekly_activity: stats.weekly_activity?.map((week: any) => ({
        ...week,
        week: new Date(week.week).toISOString(),
      })) || [],
      last_updated: new Date(stats.last_updated).toISOString(),
    }));

    // If requesting a single repository, return just that object
    if (repository && transformedStats.length === 1) {
      return res.status(200).json(transformedStats[0]);
    }

    return res.status(200).json(transformedStats);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch repository statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}