import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.OPENPRS_MONGODB_URI;
const DBNAME = process.env.OPENPRS_DATABASE;

// Contributor schema - matches your scheduler schema
const contributorSchema = new mongoose.Schema({
  login: String,
  id: Number,
  avatar_url: String,
  html_url: String,
  total_commits: Number,
  total_additions: Number,
  total_deletions: Number,
  weeks: [{
    week: Date,
    additions: Number,
    deletions: Number,
    commits: Number
  }],
  repository: String,
  last_updated: Date,
  rank: Number
}, { strict: false });

// Create or get the model
const CONTRIBUTOR = mongoose.models.CONTRIBUTOR || mongoose.model("CONTRIBUTOR", contributorSchema, "contributors");

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

    const { repository, limit, page } = req.query;

    // Build query filter
    let filter = {};
    if (repository && typeof repository === 'string') {
      filter = { repository: repository };
    }

    // Parse pagination parameters
    const limitNum = parseInt(limit as string) || 100;
    const pageNum = parseInt(page as string) || 1;
    const skip = (pageNum - 1) * limitNum;

    // Fetch contributors with pagination
    const contributors = await CONTRIBUTOR
      .find(filter)
      .sort({ total_commits: -1, rank: 1 }) // Sort by commits descending, then by rank
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await CONTRIBUTOR.countDocuments(filter);

    // Transform the data to ensure proper date handling
    const transformedContributors = contributors.map(contributor => ({
      ...contributor,
      weeks: contributor.weeks?.map((week: any) => ({
        ...week,
        week: new Date(week.week).toISOString(),
      })) || [],
      last_updated: new Date(contributor.last_updated).toISOString(),
    }));

    // For the main contributors page, return the data directly
    if (!repository) {
      return res.status(200).json(transformedContributors);
    }

    // For filtered requests, return with metadata
    return res.status(200).json({
      data: transformedContributors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: skip + limitNum < total,
        hasPrevPage: pageNum > 1,
      },
      metadata: {
        fetched_at: new Date().toISOString(),
        repositories: repository || 'all',
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch contributor data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}