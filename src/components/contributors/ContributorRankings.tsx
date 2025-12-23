import React, { useState } from "react";
import { FiAward } from "react-icons/fi";
import type { Contributor } from "@/types/contributors";
import { useRouter } from "next/router";
import Image from "next/image";

interface ContributorRankingsProps {
  contributors: Contributor[];
}

type RankingCriteria =
  | "totalScore"
  | "totalActivities"
  | "commits"
  | "pullRequests"
  | "reviews"
  | "comments";

const RANKING_LABELS: Record<RankingCriteria, string> = {
  totalScore: "Total Score",
  totalActivities: "Total Activities",
  commits: "Most Commits",
  pullRequests: "Most Pull Requests",
  reviews: "Most Reviews",
  comments: "Most Comments",
};

export const ContributorRankings: React.FC<ContributorRankingsProps> = ({
  contributors,
}) => {
  const router = useRouter();
  const [criteria, setCriteria] = useState<RankingCriteria>("totalScore");
  const [limit, setLimit] = useState(10);

  const getRankingValue = (contributor: Contributor, crit: RankingCriteria) => {
    if (crit === "totalScore") return contributor.totalScore;
    if (crit === "totalActivities") return contributor.totalActivities;

    const stats = contributor.repositoryStats.reduce(
      (acc, stat) => {
        if (crit === "commits") acc += stat.commits;
        if (crit === "pullRequests") acc += (stat.prsOpened || 0) + (stat.prsMerged || 0) + (stat.prsClosed || 0);
        if (crit === "reviews") acc += stat.reviews;
        if (crit === "comments") acc += stat.comments;
        return acc;
      },
      0
    );
    return stats;
  };

  const rankedContributors = [...contributors]
    .sort((a, b) => getRankingValue(b, criteria) - getRankingValue(a, criteria))
    .slice(0, limit);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <FiAward className="text-3xl text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">🏆 Contributor Rankings</h3>
            <p className="text-sm text-white/80">Top contributors by {RANKING_LABELS[criteria]}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            value={criteria}
            onChange={(e) => setCriteria(e.target.value as RankingCriteria)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(RANKING_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Rank</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Contributor</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Repositories</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">{RANKING_LABELS[criteria]}</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Total Score</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {rankedContributors.map((contributor, index) => (
                <tr
                  key={contributor._id}
                  onClick={() => router.push(`/contributors/${contributor.username}`)}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-2xl font-bold">{getMedalIcon(index + 1)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={contributor.avatarUrl}
                        alt={contributor.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{contributor.username}</div>
                        {contributor.name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{contributor.name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {contributor.repositories.map((repo) => (
                        <span
                          key={repo}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            repo.includes("EIPs")
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : repo.includes("ERCs")
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {repo.split("/")[1]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-lg font-bold text-lg">
                      {getRankingValue(contributor, criteria)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gray-900 dark:text-white">{contributor.totalScore}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {contributor.lastActivityAt
                        ? new Date(contributor.lastActivityAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rankedContributors.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No contributors found
          </div>
        )}
      </div>
    </div>
  );
};
