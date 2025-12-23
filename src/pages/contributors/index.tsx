import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { Contributor } from "@/types/contributors";
import AllLayout from "@/components/Layout";
import { ActivityDistributionChart } from "@/components/contributors/ActivityDistributionChart";
import { ActivityTimelineChart } from "@/components/contributors/ActivityTimelineChart";
import RepositoryBreakdownChart from "@/components/contributors/RepositoryBreakdownChart";
import { ContributorRankings } from "@/components/contributors/ContributorRankings";
import { ActivityVelocityChart } from "@/components/contributors/ActivityVelocityChart";
import { TopContributorsChart } from "@/components/contributors/TopContributorsChart";
import { ActivityComparisonChart } from "@/components/contributors/ActivityComparisonChart";
import { RecentActivitiesWidget } from "@/components/contributors/RecentActivitiesWidget";
import { AllTimeChart } from "@/components/contributors/AllTimeChart";
import { FiUsers, FiTrendingUp, FiActivity, FiGitBranch, FiSearch } from "react-icons/fi";

interface ContributorStats {
  totalContributors: number;
  activeContributors: number;
  totalActivities: number;
  repositoryBreakdown: {
    repository: string;
    contributors: number;
    activities: number;
  }[];
  topContributors: any[];
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

const REPOSITORIES = [
  { value: "", label: "All Repositories" },
  { value: "ethereum/EIPs", label: "EIPs" },
  { value: "ethereum/ERCs", label: "ERCs" },
  { value: "ethereum/RIPs", label: "RIPs" },
];

const SORT_OPTIONS = [
  { value: "totalScore", label: "Activity Score" },
  { value: "totalActivities", label: "Total Activities" },
  { value: "lastActivityAt", label: "Recent Activity" },
];

export default function ContributorsPage() {
  const router = useRouter();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [sortBy, setSortBy] = useState("totalScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "rankings" | "contributors">("analytics");
  const [timelineFilter, setTimelineFilter] = useState<"30d" | "month" | "year" | "all">("30d");

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [searchTerm, selectedRepo, sortBy, sortOrder, page]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/contributors/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await fetch("/api/contributors/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedRepo) params.append("repository", selectedRepo);

      const response = await fetch(`/api/contributors/list?${params}`);
      const data = await response.json();

      setContributors(data.contributors || []);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Failed to fetch contributors:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRepoScore = (contributor: Contributor, repo: string) => {
    if (!repo) return contributor.totalScore;
    const repoStat = contributor.repositoryStats?.find(
      (s) => s.repository === repo
    );
    return repoStat?.score || 0;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AllLayout>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="border-b border-gray-100 dark:border-gray-900">
          <div className="max-w-[1600px] mx-auto px-8 py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 uppercase tracking-wide mb-2">Contributors Analytics</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Comprehensive insights into Ethereum ecosystem contributors
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-[1600px] mx-auto px-8 py-12 border-b border-gray-100 dark:border-gray-900">
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="">
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Total Contributors</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{stats.totalContributors}</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Across all repos</p>
              </div>

              <div className="">
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Active Contributors</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{stats.activeContributors}</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Last 30 days</p>
              </div>

              <div className="">
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Total Activities</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{stats.totalActivities.toLocaleString()}</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Commits, PRs, reviews</p>
              </div>

              <div className="">
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Recent Activity</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{stats.recentActivity.last24h}</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Last 24 hours</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="border-b border-gray-100 dark:border-gray-900">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  activeTab === "analytics"
                    ? "border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("rankings")}
                className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  activeTab === "rankings"
                    ? "border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                Rankings
              </button>
              <button
                onClick={() => setActiveTab("contributors")}
                className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  activeTab === "contributors"
                    ? "border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                Contributors
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-950 pb-16">
            {activeTab === "analytics" && (
              <>
                {/* Timeline Filters */}
                <div className="max-w-[1600px] mx-auto px-8 pt-8 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timeline:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTimelineFilter("30d")}
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border-2 rounded transition-all ${
                          timelineFilter === "30d"
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
                            : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        30 Days
                      </button>
                      <button
                        onClick={() => setTimelineFilter("month")}
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border-2 rounded transition-all ${
                          timelineFilter === "month"
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
                            : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        Last Month
                      </button>
                      <button
                        onClick={() => setTimelineFilter("year")}
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border-2 rounded transition-all ${
                          timelineFilter === "year"
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
                            : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        Last Year
                      </button>
                      <button
                        onClick={() => setTimelineFilter("all")}
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border-2 rounded transition-all ${
                          timelineFilter === "all"
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
                            : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        All Time
                      </button>
                    </div>
                    <div className="ml-auto">
                      <select
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-2 border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        onChange={(e) => {
                          if (e.target.value) {
                            // Download logic will go here
                            console.log('Download:', e.target.value);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="">Download Report</option>
                        <option value="current-month">Current Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="current-year">Current Year</option>
                        <option value="all-time">All Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>)}
            {activeTab === "analytics" && (
              <div className="space-y-6 pt-6">
                {analyticsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  </div>
                ) : analytics ? (
                  <>
                    {/* Primary Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ActivityTimelineChart data={analytics.activityTimeline || []} />
                      <ActivityDistributionChart data={analytics.activityDistribution || []} />
                    </div>

                    {/* Full Width Repository Breakdown */}
                    <RepositoryBreakdownChart data={analytics.repositoryBreakdown || []} />

                    {/* Recent Activities Widget */}
                    <RecentActivitiesWidget limit={15} />

                    {/* Secondary Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <ActivityVelocityChart
                        data={
                          analytics.activityTimeline?.map((item: any, index: number, arr: any[]) => ({
                            date: item.date,
                            velocity: item.commits + item.pullRequests + item.reviews + item.comments,
                            movingAverage:
                              index >= 6
                                ? arr
                                    .slice(index - 6, index + 1)
                                    .reduce(
                                      (sum, d) => sum + d.commits + d.pullRequests + d.reviews + d.comments,
                                      0
                                    ) / 7
                                : 0,
                          })) || []
                        }
                      />
                      <TopContributorsChart
                        data={
                          contributors.slice(0, 8).map((c) => ({
                            username: c.username,
                            score: c.totalScore,
                            avatarUrl: c.avatarUrl ?? '',
                          })) || []
                        }
                      />
                      <ActivityComparisonChart
                        data={[
                          {
                            category: "Commits",
                            current: analytics.activityTimeline?.slice(-7).reduce((sum: number, d: any) => sum + d.commits, 0) || 0,
                            previous: analytics.activityTimeline?.slice(-14, -7).reduce((sum: number, d: any) => sum + d.commits, 0) || 0,
                          },
                          {
                            category: "PRs",
                            current: analytics.activityTimeline?.slice(-7).reduce((sum: number, d: any) => sum + d.pullRequests, 0) || 0,
                            previous: analytics.activityTimeline?.slice(-14, -7).reduce((sum: number, d: any) => sum + d.pullRequests, 0) || 0,
                          },
                          {
                            category: "Reviews",
                            current: analytics.activityTimeline?.slice(-7).reduce((sum: number, d: any) => sum + d.reviews, 0) || 0,
                            previous: analytics.activityTimeline?.slice(-14, -7).reduce((sum: number, d: any) => sum + d.reviews, 0) || 0,
                          },
                          {
                            category: "Comments",
                            current: analytics.activityTimeline?.slice(-7).reduce((sum: number, d: any) => sum + d.comments, 0) || 0,
                            previous: analytics.activityTimeline?.slice(-14, -7).reduce((sum: number, d: any) => sum + d.comments, 0) || 0,
                          },
                        ]}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {activeTab === "rankings" && (
              <div className="pt-6">
                <ContributorRankings contributors={contributors} />
              </div>
            )}

            {activeTab === "contributors" && (
              <div className="space-y-6 pt-6">
                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search contributors by username or name..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <select
                      value={selectedRepo}
                      onChange={(e) => {
                        setSelectedRepo(e.target.value);
                        setPage(1);
                      }}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {REPOSITORIES.map((repo) => (
                        <option key={repo.value} value={repo.value}>
                          {repo.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(1);
                      }}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contributors Grid */}
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  </div>
                ) : contributors.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No contributors found matching your criteria</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                      {contributors.map((contributor) => (
                        <div
                          key={contributor._id}
                          onClick={() => router.push(`/contributors/${contributor.username}`)}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={contributor.avatarUrl}
                              alt={contributor.username}
                              className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {contributor.username}
                                  </h3>
                                  {contributor.name && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-1">
                                      {contributor.name}
                                    </p>
                                  )}
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {getRepoScore(contributor, selectedRepo)}
                                </span>
                              </div>

                              {contributor.bio && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{contributor.bio}</p>
                              )}

                              <div className="flex items-center gap-3 mt-3 text-sm text-gray-600 dark:text-gray-400">
                                {contributor.company && <span>🏢 {contributor.company}</span>}
                                {contributor.location && <span>📍 {contributor.location}</span>}
                              </div>

                              <div className="flex gap-1 mt-3 flex-wrap">
                                {contributor.repositories.map((repo) => (
                                  <span
                                    key={repo}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium"
                                  >
                                    {repo.split("/")[1]}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  <strong>{contributor.totalActivities}</strong> activities
                                </span>
                                {contributor.lastActivityAt && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Last: {formatDate(contributor.lastActivityAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">Page {page}</span>
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!hasMore}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              ⚙️ Contributor data is automatically updated every 24 hours. Activity scores are calculated based on commits, pull requests, reviews, and other contributions across all repositories.
            </p>
          </div>
        </div>
      </div>
    </AllLayout>
  );
}
