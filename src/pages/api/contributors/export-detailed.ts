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
    const { timeline = "30d", startDate, endDate } = req.query;

    const client = await clientPromise;
    const db = client.db("test");

    // Determine timeline filter
    let queryFilter: any = {};
    const now = new Date();
    
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
      let timelineFilter: Date | undefined;
      
      switch (timeline) {
        case "30d":
          timelineFilter = new Date(now);
          timelineFilter.setDate(timelineFilter.getDate() - 30);
          break;
        case "month":
          timelineFilter = new Date(now);
          timelineFilter.setMonth(timelineFilter.getMonth() - 1);
          break;
        case "year":
          timelineFilter = new Date(now);
          timelineFilter.setFullYear(timelineFilter.getFullYear() - 1);
          break;
        case "all":
          timelineFilter = undefined; // No filter for all time
          break;
        default:
          timelineFilter = new Date(now);
          timelineFilter.setDate(timelineFilter.getDate() - 30);
      }
      
      queryFilter = timelineFilter ? { timestamp: { $gte: timelineFilter } } : {};
    }

    // Fetch all activities with metadata
    const activities = await db
      .collection("activities")
      .find(queryFilter)
      .sort({ timestamp: -1 })
      .toArray();

    // Enrich with contributor data
    const usernames = [...new Set(activities.map((a: any) => a.username))];
    const contributors = await db
      .collection("contributors")
      .find({ username: { $in: usernames } })
      .project({ username: 1, name: 1, avatarUrl: 1, company: 1, location: 1 })
      .toArray();

    const contributorMap = new Map(
      contributors.map((c: any) => [c.username, c])
    );

    // Flatten activities with all metadata for CSV export
    const detailedData = activities.map((activity: any) => {
      const contributor = contributorMap.get(activity.username) || {};
      const metadata = activity.metadata || {};
      
      return {
        // Activity Basic Info
        activityId: activity._id.toString(),
        timestamp: activity.timestamp,
        activityType: activity.activityType,
        repository: activity.repository,
        entityRef: activity.entityRef || "",
        
        // Contributor Info
        username: activity.username,
        contributorName: contributor.name || "",
        company: contributor.company || "",
        location: contributor.location || "",
        avatarUrl: contributor.avatarUrl || "",
        
        // Common Metadata
        url: metadata.url || "",
        htmlUrl: metadata.htmlUrl || "",
        number: metadata.number || metadata.prNumber || "",
        authorAssociation: metadata.authorAssociation || "",
        
        // Commit-Specific Metadata
        commitSha: metadata.sha || "",
        commitMessage: metadata.message || "",
        commitAuthorName: metadata.authorName || "",
        commitAuthorEmail: metadata.authorEmail || "",
        commitCommitterName: metadata.committerName || "",
        commitCommitterEmail: metadata.committerEmail || "",
        commitVerified: metadata.verified ? "Yes" : "No",
        
        // Pull Request-Specific Metadata
        prTitle: metadata.title || "",
        prBody: metadata.body || "",
        prDescription: metadata.description || "",
        prState: metadata.state || "",
        prDraft: metadata.draft ? "Yes" : "No",
        prLabels: Array.isArray(metadata.labels) ? metadata.labels.join("; ") : "",
        prAssignees: Array.isArray(metadata.assignees) ? metadata.assignees.join("; ") : "",
        prRequestedReviewers: Array.isArray(metadata.requestedReviewers) ? metadata.requestedReviewers.join("; ") : "",
        prBaseBranch: metadata.baseBranch || "",
        prHeadBranch: metadata.headBranch || "",
        prMergedAt: metadata.mergedAt || "",
        prMergedBy: metadata.mergedBy || "",
        prClosedAt: metadata.closedAt || "",
        
        // Review-Specific Metadata
        reviewId: metadata.reviewId || "",
        reviewState: metadata.reviewState || "",
        reviewBody: metadata.reviewBody || "",
        reviewUrl: metadata.reviewUrl || "",
        reviewSubmittedAt: metadata.reviewSubmittedAt || "",
        
        // Comment-Specific Metadata
        commentId: metadata.commentId || "",
        commentBody: metadata.commentBody || "",
        commentUrl: metadata.commentUrl || "",
        commentCreatedAt: metadata.commentCreatedAt || "",
        commentUpdatedAt: metadata.commentUpdatedAt || "",
        commentIsIssueComment: metadata.isIssueComment ? "Yes" : "No",
        
        // Code Changes Metadata
        codeAdditions: metadata.additions || 0,
        codeDeletions: metadata.deletions || 0,
        codeChangedFiles: metadata.changedFiles || 0,
        codeTotalChanges: metadata.totalChanges || 0,
      };
    });

    return res.status(200).json({
      activities: detailedData,
      total: detailedData.length,
      timeline: timeline,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Export detailed activities error:", error);
    return res.status(500).json({ error: "Failed to fetch detailed activities" });
  }
}
