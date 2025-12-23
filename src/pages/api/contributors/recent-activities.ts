import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { limit = "20", repository } = req.query;
    const limitNum = parseInt(limit as string, 10);

    const client = await clientPromise;
    const db = client.db("test");

    const query: any = {};
    if (repository) {
      query.repository = repository as string;
    }

    const activities = await db
      .collection("activities")
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .toArray();

    // Enrich with contributor avatars
    const usernames = [...new Set(activities.map((a: any) => a.username))];
    const contributors = await db
      .collection("contributors")
      .find({ username: { $in: usernames } })
      .project({ username: 1, avatarUrl: 1 })
      .toArray();

    const avatarMap = new Map(
      contributors.map((c: any) => [c.username, c.avatarUrl])
    );

    const enrichedActivities = activities.map((activity: any) => ({
      _id: activity._id.toString(),
      username: activity.username,
      repository: activity.repository,
      activityType: activity.activityType,
      timestamp: activity.timestamp,
      metadata: activity.metadata,
      avatarUrl: avatarMap.get(activity.username),
    }));

    return res.status(200).json({
      activities: enrichedActivities,
      total: enrichedActivities.length,
    });
  } catch (error) {
    console.error("Recent activities error:", error);
    return res.status(500).json({ error: "Failed to fetch recent activities" });
  }
}
