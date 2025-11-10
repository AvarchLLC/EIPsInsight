import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ message: "MongoDB URI not configured" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test");

    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Get enhanced feedback with pagination and sorting (newest first)
    const feedbacks = await db.collection("enhanced_feedbacks")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection("enhanced_feedbacks").countDocuments({});

    // Get summary statistics
    const stats = await db.collection("enhanced_feedbacks").aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const positiveCount = stats.find(s => s._id === "positive")?.count || 0;
    const neutralCount = stats.find(s => s._id === "neutral")?.count || 0;
    const negativeCount = stats.find(s => s._id === "negative")?.count || 0;

    // Calculate satisfaction score (positive = 100%, neutral = 50%, negative = 0%)
    const satisfactionScore = totalCount > 0 ? 
      Math.round(((positiveCount * 100 + neutralCount * 50) / totalCount)) : 0;

    res.status(200).json({
      feedbacks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      },
      stats: {
        total: totalCount,
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        satisfactionScore,
        positivePercentage: totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0,
        neutralPercentage: totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0,
        negativePercentage: totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0
      }
    });
  } catch (e) {
    console.error("MongoDB error:", e);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}