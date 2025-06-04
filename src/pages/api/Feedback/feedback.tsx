import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type } = req.body;

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ message: "MongoDB URI not configured" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test");

    await db.collection("feedbacks").insertOne({
      type,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Feedback recorded" });
  } catch (e) {
    console.error("MongoDB error:", e);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}
