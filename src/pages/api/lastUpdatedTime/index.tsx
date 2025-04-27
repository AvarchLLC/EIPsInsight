import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'test';

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

  console.log(name);

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required as a query parameter' });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('lastUpdated'); // Use the 'lastUpdated' collection

    // Find the document with the specified name
    const document = await collection.findOne({ name });

    if (!document) {
      return res.status(404).json({ error: `Document with name '${name}' not found` });
    }

    const lastUpdatedTime = document.time;
    return res.status(200).json({ lastUpdatedTime });
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