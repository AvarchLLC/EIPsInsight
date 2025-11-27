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
    const { username, type } = req.query;
    const {
      page = '1',
      limit = '100',
      repo,
      period = 'all',
      sortBy = 'timestamp',
      sortOrder = 'desc',
      format = 'json',
    } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!type || typeof type !== 'string') {
      return res.status(400).json({ error: 'Activity type is required' });
    }

    // Validate activity type
    const validTypes = ['commits', 'prs', 'reviews', 'comments', 'issues'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid activity type' });
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 100, 500); // Max 500 items
    const skip = (pageNum - 1) * limitNum;

    const client = await connectToDatabase();
    const db = client.db();
    const contributors = db.collection('contributors');

    // Find contributor
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

    // Map type to timeline type
    const typeMap: Record<string, string> = {
      commits: 'commit',
      prs: 'pr',
      reviews: 'review',
      comments: 'comment',
      issues: 'issue',
    };

    const timelineType = typeMap[type];

    // Filter timeline
    let timeline = contributor.timeline || [];
    
    // Filter by type
    timeline = timeline.filter((item: any) => item.type === timelineType);
    
    // Filter by period
    if (period === 'weekly' || period === 'monthly') {
      const now = new Date();
      const daysToSubtract = period === 'weekly' ? 7 : 30; // Exact 7 days or 30 days
      const startDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
      
      timeline = timeline.filter((item: any) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= startDate;
      });
    }
    
    // Filter by repo if specified
    if (repo && typeof repo === 'string') {
      timeline = timeline.filter((item: any) => item.repo === repo);
    }

    // Sort
    timeline.sort((a: any, b: any) => {
      const aVal = sortBy === 'timestamp' ? new Date(a.timestamp).getTime() : a[sortBy as string];
      const bVal = sortBy === 'timestamp' ? new Date(b.timestamp).getTime() : b[sortBy as string];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    const total = timeline.length;
    const paginatedTimeline = timeline.slice(skip, skip + limitNum);

    // Calculate stats for this activity type
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: timeline.length,
      thisWeek: timeline.filter((item: any) => new Date(item.timestamp) >= weekAgo).length,
      thisMonth: timeline.filter((item: any) => new Date(item.timestamp) >= monthAgo).length,
      avgPerMonth: timeline.length > 0 ? Math.round(timeline.length / Math.max(1, 
        Math.ceil((now.getTime() - new Date(timeline[timeline.length - 1]?.timestamp || now).getTime()) / (30 * 24 * 60 * 60 * 1000))
      )) : 0,
    };

    // If CSV format requested
    if (format === 'csv') {
      const csv = generateCSV(paginatedTimeline, type, username);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${username}-${type}-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.status(200).send(csv);
    }

    return res.status(200).json({
      username: contributor.githubUsername || contributor.username,
      activityType: type,
      repo: repo || null,
      period: period || 'all',
      data: paginatedTimeline,
      stats,
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
      error: 'Failed to fetch activities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function generateCSV(data: any[], type: string, username: string): string {
  const headers = ['Date', 'Repository', 'Type', 'Number', 'URL', 'Title/Message'];
  const rows = data.map((item: any) => {
    const date = new Date(item.timestamp).toISOString();
    const repo = item.repo || '';
    const itemType = item.type || '';
    const number = item.number || '';
    const url = item.url || '';
    const title = item.metadata?.title || item.metadata?.message || '';
    return [date, repo, itemType, number, url, title].map(escapeCSV).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}
