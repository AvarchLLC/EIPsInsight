import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Collection mappings (using exact collection names from database)
const PR_COLLECTIONS = {
  eip: 'alleipsprdetails',
  erc: 'allercsprdetails',
  rip: 'allripsprdetails',
};

interface PRDetails {
  MonthKey: string;
  Label: string;
  LabelType: string;
  Repo: string;
  PRNumber: number;
  PRLink: string;
  Author: string;
  Title: string;
  CreatedAt: string;
}

let client: MongoClient | null = null;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, month } = req.query;

  // Validate repo name
  if (!name || typeof name !== 'string' || !Object.keys(PR_COLLECTIONS).includes(name)) {
    return res.status(400).json({ 
      error: 'Invalid repo name. Must be: eip, erc, or rip' 
    });
  }

  // Validate month format (YYYY-MM)
  if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ 
      error: 'Invalid month format. Must be YYYY-MM (e.g., 2024-11)' 
    });
  }

  try {
    const db = await connectToDatabase();
    const collectionName = PR_COLLECTIONS[name as keyof typeof PR_COLLECTIONS];
    const collection = db.collection(collectionName);

    // Parse month to create date range
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Query PRs created in the specified month
    const prsData = await collection.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }, {
      projection: {
        prNumber: 1,
        prTitle: 1,
        labels: 1,
        participants: 1,
        createdAt: 1
      }
    }).toArray();

    // Transform data: expand labels array into individual records
    const detailedData: PRDetails[] = [];
    
    prsData.forEach((pr: any) => {
      const prLabels = pr.labels || [];
      const author = (pr.participants && pr.participants.length > 0) ? pr.participants[0] : 'Unknown';
      const repoName = name.toUpperCase();
      
      // Create a record for each label
      if (prLabels.length > 0) {
        prLabels.forEach((label: string) => {
          detailedData.push({
            MonthKey: month,
            Label: label,
            LabelType: 'githubLabels',
            Repo: repoName,
            PRNumber: pr.prNumber,
            PRLink: `https://github.com/ethereum/${name}s/pull/${pr.prNumber}`,
            Author: author,
            Title: pr.prTitle || '',
            CreatedAt: pr.createdAt ? pr.createdAt.toISOString() : ''
          });
        });
      } else {
        // PRs without labels (optional: include or exclude these)
        detailedData.push({
          MonthKey: month,
          Label: 'no-label',
          LabelType: 'githubLabels',
          Repo: repoName,
          PRNumber: pr.prNumber,
          PRLink: `https://github.com/ethereum/${name}s/pull/${pr.prNumber}`,
          Author: author,
          Title: pr.prTitle || '',
          CreatedAt: pr.createdAt ? pr.createdAt.toISOString() : ''
        });
      }
    });

    return res.status(200).json({
      data: detailedData,
      metadata: {
        totalRecords: detailedData.length,
        totalPRs: prsData.length,
        month: month,
        repo: name,
        collection: collectionName,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve PR details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed on app termination');
  }
});
