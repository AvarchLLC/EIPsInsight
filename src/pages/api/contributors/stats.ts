import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

interface ContributorStats {
  totalContributors: number;
  activeContributors: number;
  totalActivities: number;
  repositoryBreakdown: {
    repository: string;
    contributors: number;
    activities: number;
  }[];
  topContributors: {
    username: string;
    avatarUrl?: string;
    totalScore: number;
    repositories: string[];
  }[];
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContributorStats | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalContributors,
      activeContributors,
      totalActivitiesResult,
      topContributors,
      recentActivity24h,
      recentActivity7d,
      recentActivity30d,
    ] = await Promise.all([
      db.collection("contributors").countDocuments({ isBot: false }),
      db.collection("contributors").countDocuments({
        isBot: false,
        lastActivityAt: { $gte: last30d },
      }),
      db.collection("activities").countDocuments({}),
      db
        .collection("contributors")
        .find({ isBot: false })
        .sort({ totalScore: -1 })
        .limit(10)
        .project({ username: 1, avatarUrl: 1, totalScore: 1, repositories: 1 })
        .toArray(),
      db.collection("activities").countDocuments({ timestamp: { $gte: last24h } }),
      db.collection("activities").countDocuments({ timestamp: { $gte: last7d } }),
      db.collection("activities").countDocuments({ timestamp: { $gte: last30d } }),
    ]);

    const repositories = ["ethereum/EIPs", "ethereum/ERCs", "ethereum/RIPs"];
    const repositoryBreakdown = await Promise.all(
      repositories.map(async (repo) => {
        const [contributors, activities, activityBreakdown] = await Promise.all([
          db.collection("contributors").countDocuments({
            repositories: repo,
            isBot: false,
          }),
          db.collection("activities").countDocuments({ repository: repo }),
          db.collection("activities").find({ repository: repo }).toArray(),
        ]);
        
        // Count activities by type
        let commits = 0;
        let prsOpened = 0;
        let prsMerged = 0;
        let prsClosed = 0;
        let reviews = 0;
        let comments = 0;
        
        activityBreakdown.forEach((activity: any) => {
          switch (activity.activityType) {
            case 'COMMIT':
              commits++;
              break;
            case 'PR_OPENED':
              prsOpened++;
              break;
            case 'PR_MERGED':
              prsMerged++;
              break;
            case 'PR_CLOSED':
              prsClosed++;
              break;
            case 'REVIEW_APPROVED':
            case 'REVIEW_COMMENTED':
            case 'REVIEW_CHANGES_REQUESTED':
              reviews++;
              break;
            case 'ISSUE_COMMENT':
            case 'PR_COMMENT':
              comments++;
              break;
          }
        });
        
        // Calculate total score (same as contributor scoring)
        const totalScore = commits * 10 + (prsOpened + prsMerged + prsClosed) * 20 + reviews * 15 + comments * 5;
        
        return { 
          repository: repo, 
          contributors, 
          activities,
          commits,
          prsOpened,
          prsMerged,
          prsClosed,
          reviews,
          comments,
          totalScore,
        };
      })
    );

    return res.status(200).json({
      totalContributors,
      activeContributors,
      totalActivities: totalActivitiesResult,
      repositoryBreakdown,
      topContributors: topContributors.map((c: any) => ({
        username: c.username,
        avatarUrl: c.avatarUrl,
        totalScore: c.totalScore,
        repositories: c.repositories,
      })),
      recentActivity: {
        last24h: recentActivity24h,
        last7d: recentActivity7d,
        last30d: recentActivity30d,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
