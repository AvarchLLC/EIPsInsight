import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'test';
const COLLECTIONS = {
  eips: "eipsPRCharts3",
  ercs: "ercsPRCharts3",
  rips: "ripsPRCharts3",
};

let client: MongoClient | null = null;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string' || !Object.keys(COLLECTIONS).includes(name)) {
    return res.status(400).json({ error: 'Invalid collection name' });
  }

  try {
    const db = await connectToDatabase();
    const collectionName = COLLECTIONS[name as keyof typeof COLLECTIONS];
    const collection = db.collection(collectionName);
    // Convert cursor to an array
    const data = await collection.find({}).toArray();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: 'Failed to retrieve data from the database' });
  }
}

// Optional cleanup for when the server is manually closed
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed on app termination");
  }
});
