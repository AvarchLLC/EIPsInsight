import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import type { ContributorListResponse } from "@/types/contributors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContributorListResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      repository,
      search,
      sortBy = "totalScore",
      sortOrder = "desc",
      page = "1",
      limit = "50",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const client = await clientPromise;
    const db = client.db("eipsinsight-contributors");

    const filter: any = { isBot: false };

    if (repository) {
      filter.repositories = repository;
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1;
    let sortField = sortBy as string;

    if (repository && sortBy === "totalScore") {
      const contributors = await db
        .collection("contributors")
        .find(filter)
        .toArray();

      const contributorsWithRepoScore = contributors.map((c: any) => {
        const repoStat = c.repositoryStats?.find(
          (s: any) => s.repository === repository
        );
        return {
          ...c,
          repoScore: repoStat?.score || 0,
          repoLastActivity: repoStat?.lastActivityAt || new Date(0),
        };
      });

      contributorsWithRepoScore.sort((a, b) => {
        const aVal = a.repoScore;
        const bVal = b.repoScore;
        return sortDirection * (aVal - bVal);
      });

      const paginatedContributors = contributorsWithRepoScore.slice(
        offset,
        offset + limitNum
      );

      return res.status(200).json({
        contributors: paginatedContributors.map((c: any) => ({
          ...c,
          _id: c._id.toString(),
        })) as any,
        total: contributorsWithRepoScore.length,
        page: pageNum,
        limit: limitNum,
        hasMore: offset + limitNum < contributorsWithRepoScore.length,
      });
    }

    const total = await db.collection("contributors").countDocuments(filter);

    const contributors = await db
      .collection("contributors")
      .find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(offset)
      .limit(limitNum)
      .toArray();

    return res.status(200).json({
      contributors: contributors.map((c: any) => ({
        ...c,
        _id: c._id.toString(),
      })) as any,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: offset + limitNum < total,
    });
  } catch (error: any) {
    console.error("Error fetching contributors:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
