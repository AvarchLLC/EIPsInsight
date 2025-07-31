import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

interface FeedbackData {
  rating: 'positive' | 'neutral' | 'negative';
  comment?: string;
  page: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { rating, comment, page, timestamp }: FeedbackData = req.body;

  // Validate required fields
  if (!rating || !['positive', 'neutral', 'negative'].includes(rating)) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  if (!page || !timestamp) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ message: "MongoDB URI not configured" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test");

    // Store enhanced feedback data
    await db.collection("enhanced_feedbacks").insertOne({
      rating,
      comment: comment || null,
      page,
      timestamp: new Date(timestamp),
      createdAt: new Date(),
      userAgent: req.headers['user-agent'] || null,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
    });

    res.status(201).json({ message: "Feedback recorded successfully" });
  } catch (e) {
    console.error("MongoDB error:", e);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}
