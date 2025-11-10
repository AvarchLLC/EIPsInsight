import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.OPENPRS_MONGODB_URI || '';
const DB_NAME = process.env.OPENPRS_DATABASE || 'prsdb';

const CHART_COLLECTIONS = {
  eips: "eipsPRCharts",
  ercs: "ercsPRCharts", 
  rips: "ripsPRCharts",
  all: "allPRCharts",
};

interface ChartDataItem {
  _id: string;
  category: string;
  monthYear: string;
  type: "Created" | "Merged" | "Closed" | "Open";
  count: number;
  eips?: number;
  ercs?: number;
  rips?: number;
}

let client: MongoClient | null = null;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
};

function processChartData(data: ChartDataItem[], monthsWindow: number): ChartDataItem[] {
  // If monthsWindow is 0 or not specified, return all data without time filtering
  if (monthsWindow === 0) {
    return data.sort((a, b) => {
      if (a.monthYear !== b.monthYear) {
        return a.monthYear.localeCompare(b.monthYear);
      }
      const typeOrder = ["Created", "Merged", "Closed", "Open"];
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
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
      const typeOrder = ["Created", "Merged", "Closed", "Open"];
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, limit, months } = req.query;

  if (!name || typeof name !== 'string' || !Object.keys(CHART_COLLECTIONS).includes(name)) {
    return res.status(400).json({ error: 'Invalid collection name. Must be: eips, ercs, rips, or all' });
  }

  // Make limit optional - if not provided, get all data
  let limitNumber = 0; // 0 means no limit
  if (limit && typeof limit === 'string') {
    limitNumber = parseInt(limit, 10);
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ error: 'Invalid limit. Must be a positive number' });
    }
  }

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
    const collectionName = CHART_COLLECTIONS[name as keyof typeof CHART_COLLECTIONS];
    const collection = db.collection(collectionName);

    // Apply limit only if specified, otherwise get all data
    let cursor = collection.find({});
    if (limitNumber > 0) {
      cursor = cursor.limit(limitNumber);
    }
    const rawData = await cursor.toArray();
    const chartData: ChartDataItem[] = (rawData as any[]).map((doc: any) => ({
      _id: String(doc._id),
      category: doc.category || '',
      monthYear: doc.monthYear || '',
      type: doc.type as "Created" | "Merged" | "Closed" | "Open",
      count: doc.count || 0,
      eips: doc.eips || 0,
      ercs: doc.ercs || 0,
      rips: doc.rips || 0,
    }));

    const processedData = processChartData(chartData, monthsNumber);

    return res.status(200).json({
      data: processedData,
      metadata: {
        totalRecords: processedData.length,
        limit: limitNumber || 'none',
        monthsWindow: monthsNumber || 'all',
        collection: collectionName,
        dataSource: 'scheduler-generated-charts',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ 
      error: 'Failed to retrieve chart data from the database',
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
