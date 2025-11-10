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

    // Get feedback with pagination and sorting (newest first)
    const feedbacks = await db.collection("feedbacks")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection("feedbacks").countDocuments({});

    // Get summary statistics
    const stats = await db.collection("feedbacks").aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const likesCount = stats.find(s => s._id === "like")?.count || 0;
    const dislikesCount = stats.find(s => s._id === "dislike")?.count || 0;

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
        likes: likesCount,
        dislikes: dislikesCount,
        likePercentage: totalCount > 0 ? Math.round((likesCount / totalCount) * 100) : 0
      }
    });
  } catch (e) {
    console.error("MongoDB error:", e);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}