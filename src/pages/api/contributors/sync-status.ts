import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

interface SyncStatusResponse {
  repositories: {
    repository: string;
    lastSyncAt?: string;
    status: string;
    activitiesProcessed?: number;
    error?: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SyncStatusResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");

    const syncStates = await db
      .collection("sync_state")
      .find({})
      .sort({ repository: 1 })
      .toArray();

    return res.status(200).json({
      repositories: syncStates.map((state: any) => ({
        repository: state.repository,
        lastSyncAt: state.lastSyncAt?.toISOString(),
        status: state.status,
        activitiesProcessed: state.activitiesProcessed,
        error: state.error,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching sync status:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
