// /pages/api/feedback/stats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db("test");

    const likeCount = await db.collection("feedbacks").countDocuments({ type: "like" });
    const dislikeCount = await db.collection("feedbacks").countDocuments({ type: "dislike" });

    res.status(200).json({ likes: likeCount, dislikes: dislikeCount });
  } catch (err) {
    console.error("Error fetching feedback stats:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
