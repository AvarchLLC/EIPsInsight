import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import type { ActivityTimelineResponse } from "@/types/contributors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivityTimelineResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      username,
      repository,
      activityType,
      startDate,
      endDate,
      page = "1",
      limit = "50",
    } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const client = await clientPromise;
    const db = client.db("eipsinsight-contributors");

    const filter: any = { username };

    if (repository) {
      filter.repository = repository;
    }

    if (activityType) {
      filter.activityType = activityType;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate as string);
      }
    }

    const total = await db.collection("activities").countDocuments(filter);

    const activities = await db
      .collection("activities")
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limitNum)
      .toArray();

    return res.status(200).json({
      activities: activities.map((a: any) => ({
        ...a,
        _id: a._id.toString(),
      })) as any,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: offset + limitNum < total,
    });
  } catch (error: any) {
    console.error("Error fetching timeline:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
