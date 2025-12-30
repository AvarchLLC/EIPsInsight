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
    const { username, repository, timeline, startDate, endDate } = req.query;

    const client = await clientPromise;
    const db = client.db("test");

    if (username) {
      const contributor = await db.collection("contributors").findOne({
        username: username as string,
      });

      if (!contributor) {
        return res.status(404).json({ error: "Contributor not found" });
      }

      const activities = await db
        .collection("activities")
        .find({
          username: username as string,
          ...(repository ? { repository: repository as string } : {}),
        })
        .sort({ timestamp: -1 })
        .limit(1000)
        .toArray();

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const activityByType: Record<string, number> = {};
      const activityByDate: Record<string, any> = {};

      activities.forEach((activity: any) => {
        activityByType[activity.activityType] =
          (activityByType[activity.activityType] || 0) + 1;

        const date = new Date(activity.timestamp)
          .toISOString()
          .split("T")[0];
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            commits: 0,
            pullRequests: 0,
            reviews: 0,
            comments: 0,
          };
        }

        if (activity.activityType === "COMMIT") {
          activityByDate[date].commits++;
        } else if (
          activity.activityType.startsWith("PR_") &&
          !activity.activityType.includes("COMMENT")
        ) {
          activityByDate[date].pullRequests++;
        } else if (activity.activityType.startsWith("REVIEW_")) {
          activityByDate[date].reviews++;
        } else if (activity.activityType.includes("COMMENT")) {
          activityByDate[date].comments++;
        }
      });

      const last90Days = new Date();
      last90Days.setDate(last90Days.getDate() - 90);

      const heatmapData: Record<string, number> = {};
      for (let i = 0; i < 84; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        heatmapData[dateStr] = 0;
      }

      activities.forEach((activity: any) => {
        const date = new Date(activity.timestamp)
          .toISOString()
          .split("T")[0];
        if (heatmapData[date] !== undefined) {
          heatmapData[date]++;
        }
      });

      return res.status(200).json({
        activityDistribution: Object.entries(activityByType).map(
          ([activityType, count]) => ({
            activityType,
            count,
          })
        ),
        activityTimeline: Object.values(activityByDate)
          .sort((a: any, b: any) => a.date.localeCompare(b.date))
          .slice(-30),
        activityHeatmap: Object.entries(heatmapData).map(([date, count]) => ({
          date,
          count,
        })),
        repositoryBreakdown: contributor.repositoryStats || [],
      });
    }

    const allContributors = await db
      .collection("contributors")
      .find({})
      .toArray();

    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    const last7d = new Date();
    last7d.setDate(last7d.getDate() - 7);

    const last30d = new Date();
    last30d.setDate(last30d.getDate() - 30);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    // Determine timeline filter
    let timelineFilter: Date | undefined;
    let queryFilter: any = {};
    
    if (timeline === "custom" && startDate && endDate) {
      // Custom date range
      const start = new Date(startDate as string);
      start.setDate(1); // Start of month
      
      const end = new Date(endDate as string);
      end.setMonth(end.getMonth() + 1); // Move to next month
      end.setDate(0); // Last day of the selected month
      end.setHours(23, 59, 59, 999); // End of day
      
      queryFilter = {
        timestamp: {
          $gte: start,
          $lte: end
        }
      };
    } else {
      // Preset timelines
      switch (timeline) {
        case "30d":
          timelineFilter = last30d;
          break;
        case "month":
          timelineFilter = lastMonth;
          break;
        case "year":
          timelineFilter = lastYear;
          break;
        case "all":
          timelineFilter = undefined; // No filter for all time
          break;
        default:
          timelineFilter = last30d;
      }
      
      queryFilter = timelineFilter ? { timestamp: { $gte: timelineFilter } } : {};
    }

    const recentActivities = await db
      .collection("activities")
      .find(queryFilter)
      .toArray();

    const activityByDate: Record<string, any> = {};
    recentActivities.forEach((activity: any) => {
      const date = new Date(activity.timestamp).toISOString().split("T")[0];
      if (!activityByDate[date]) {
        activityByDate[date] = {
          date,
          commits: 0,
          pullRequests: 0,
          reviews: 0,
          comments: 0,
        };
      }

      if (activity.activityType === "COMMIT") {
        activityByDate[date].commits++;
      } else if (
        activity.activityType.startsWith("PR_") &&
        !activity.activityType.includes("COMMENT")
      ) {
        activityByDate[date].pullRequests++;
      } else if (activity.activityType.startsWith("REVIEW_")) {
        activityByDate[date].reviews++;
      } else if (activity.activityType.includes("COMMENT")) {
        activityByDate[date].comments++;
      }
    });

    const repoBreakdown: Record<string, any> = {};
    allContributors.forEach((contributor: any) => {
      contributor.repositoryStats?.forEach((stat: any) => {
        if (!repoBreakdown[stat.repository]) {
          repoBreakdown[stat.repository] = {
            repository: stat.repository,
            contributors: 0,
            totalScore: 0,
            commits: 0,
            prsOpened: 0,
            prsMerged: 0,
            prsClosed: 0,
            pullRequests: 0,
            reviews: 0,
            comments: 0,
          };
        }
        repoBreakdown[stat.repository].contributors++;
        repoBreakdown[stat.repository].totalScore += stat.score || 0;
        repoBreakdown[stat.repository].commits += stat.commits || 0;
        repoBreakdown[stat.repository].prsOpened += stat.prsOpened || 0;
        repoBreakdown[stat.repository].prsMerged += stat.prsMerged || 0;
        repoBreakdown[stat.repository].prsClosed += stat.prsClosed || 0;
        repoBreakdown[stat.repository].pullRequests += 
          (stat.prsOpened || 0) + (stat.prsMerged || 0) + (stat.prsClosed || 0);
        repoBreakdown[stat.repository].reviews += stat.reviews || 0;
        repoBreakdown[stat.repository].comments += stat.comments || 0;
      });
    });

    const activityTypeCount: Record<string, number> = {};
    recentActivities.forEach((activity: any) => {
      activityTypeCount[activity.activityType] =
        (activityTypeCount[activity.activityType] || 0) + 1;
    });

    return res.status(200).json({
      activityTimeline: Object.values(activityByDate).sort((a: any, b: any) =>
        a.date.localeCompare(b.date)
      ),
      repositoryBreakdown: Object.values(repoBreakdown),
      activityDistribution: Object.entries(activityTypeCount).map(
        ([activityType, count]) => ({
          activityType,
          count,
        })
      ),
      rawActivities: recentActivities,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
