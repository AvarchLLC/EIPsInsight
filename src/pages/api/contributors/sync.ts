import type { NextApiRequest, NextApiResponse } from "next";
import { ContributorSyncService } from "@/services/ContributorSyncService";

interface SyncResponse {
  success: boolean;
  message: string;
  activitiesProcessed?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SyncResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const apiKey = process.env.CONTRIBUTORS_SYNC_API_KEY;

  if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { repository } = req.body;

    const tokens = (process.env.GITHUB_TOKENS || "").split(",").filter(Boolean);

    if (tokens.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No GitHub tokens configured",
      });
    }

    const logger = {
      info: (msg: string, data?: any) => {
        console.log(`[SYNC INFO] ${msg}`, data || "");
      },
      error: (msg: string, err?: any) => {
        console.error(`[SYNC ERROR] ${msg}`, err || "");
      },
      warn: (msg: string, data?: any) => {
        console.warn(`[SYNC WARN] ${msg}`, data || "");
      },
    };

    const syncService = new ContributorSyncService(tokens, logger);

    if (repository) {
      const activitiesProcessed = await syncService.syncRepository(repository);
      return res.status(200).json({
        success: true,
        message: `Sync completed for ${repository}`,
        activitiesProcessed,
      });
    } else {
      await syncService.syncAllRepositories();
      await syncService.updateActivityTimestamps();
      return res.status(200).json({
        success: true,
        message: "Sync completed for all repositories",
      });
    }
  } catch (error: any) {
    console.error("Sync error:", error);
    return res.status(500).json({
      success: false,
      message: "Sync failed",
      error: error.message,
    });
  }
}
