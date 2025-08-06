import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.OPENPRS_MONGODB_URI as string;
const dbName = process.env.OPENPRS_DATABASE || 'EIPs';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  if (!uri) throw new Error('MONGODB_URI not set in environment.');
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { db } = await connectToDatabase();
    const prs = await db.collection('eip_prs').find({}).toArray();
    console.log(prs)
    res.status(200).json(prs);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Unable to fetch open PRs' });
  }
}
