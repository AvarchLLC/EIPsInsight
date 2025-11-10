import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.OPENPRS_MONGODB_URI || '';
const DB_NAME = process.env.OPENPRS_DATABASE || 'prsdb';

const RAW_LABELS_COLLECTIONS = {
  eip: "eipsRawCharts",
  erc: "ercsRawCharts", 
  rip: "ripsRawCharts",
  all: "allRawCharts",
};

interface RawLabelDataItem {
  _id: string;
  category: string;
  monthYear: string;
  type: string; // The raw GitHub label
  count: number;
}

let client: MongoClient | null = null;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
};

function processRawLabelsData(data: RawLabelDataItem[], monthsWindow: number): RawLabelDataItem[] {
  // If monthsWindow is 0 or not specified, show all historical data without time filtering
  if (monthsWindow === 0) {
    return data.sort((a, b) => {
      if (a.monthYear !== b.monthYear) {
        return a.monthYear.localeCompare(b.monthYear);
      }
      return a.type.localeCompare(b.type);
    });
  }
  
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsWindow);
  const cutoffMonthYear = cutoffDate.toISOString().slice(0, 7); // YYYY-MM format
  
  return data
    .filter(item => item.monthYear >= cutoffMonthYear)
    .sort((a, b) => {
      if (a.monthYear !== b.monthYear) {
        return a.monthYear.localeCompare(b.monthYear);
      }
      return a.type.localeCompare(b.type);
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, limit, months, labels } = req.query;

  if (!name || typeof name !== 'string' || !Object.keys(RAW_LABELS_COLLECTIONS).includes(name)) {
    return res.status(400).json({ error: 'Invalid collection name. Must be: eip, erc, rip, or all' });
  }

  // Ignore limit parameter and always return all data
  let limitNumber = 0; // Always 0, meaning no limit

  // Make months optional - if not provided, get all historical data
  let monthsNumber = 0; // 0 means no time limit
  if (months && typeof months === 'string') {
    monthsNumber = parseInt(months, 10);
    if (isNaN(monthsNumber) || monthsNumber < 1) {
      return res.status(400).json({ error: 'Invalid months. Must be a positive number' });
    }
  }

  try {
    const db = await connectToDatabase();
    const collectionName = RAW_LABELS_COLLECTIONS[name as keyof typeof RAW_LABELS_COLLECTIONS];
    const collection = db.collection(collectionName);

    // Build query filter for specific labels if provided
    let query = {};
    if (labels && typeof labels === 'string') {
      const labelList = labels.split(',').map(l => l.trim());
      query = { type: { $in: labelList } };
    }

    // Always get all data, ignore any limit
    const rawData = await collection.find(query).toArray();
    const labelsData: RawLabelDataItem[] = (rawData as any[]).map((doc: any) => ({
      _id: String(doc._id),
      category: doc.category || '',
      monthYear: doc.monthYear || '',
      type: doc.type || '',
      count: doc.count || 0,
    }));

    const processedData = processRawLabelsData(labelsData, monthsNumber);

    // Get unique labels for frontend filtering
    const uniqueLabels = [...new Set(processedData.map(item => item.type))].sort();

    return res.status(200).json({
      data: processedData,
      metadata: {
        totalRecords: processedData.length,
        limit: limitNumber || 'none',
        monthsWindow: monthsNumber || 'all',
        collection: collectionName,
        uniqueLabels: uniqueLabels,
        dataSource: 'scheduler-generated-raw-labels-charts',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ 
      error: 'Failed to retrieve raw labels chart data from the database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed on app termination");
  }
});