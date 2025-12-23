import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiGithub, FiTwitter, FiExternalLink, FiArrowLeft, FiTrendingUp, FiActivity, FiCalendar, FiGitCommit, FiGitPullRequest } from "react-icons/fi";
import type { Contributor, Activity } from "@/types/contributors";
import { ActivityCard } from "@/components/ActivityCard";
import AllLayout from "@/components/Layout";
import { ActivityDistributionChart } from "@/components/contributors/ActivityDistributionChart";
import { ActivityTimelineChart } from "@/components/contributors/ActivityTimelineChart";
import RepositoryBreakdownChart from "@/components/contributors/RepositoryBreakdownChart";
import { ContributorHeatmap } from "@/components/contributors/ContributorHeatmap";
import { ActivityVelocityChart } from "@/components/contributors/ActivityVelocityChart";
import { ActivityComparisonChart } from "@/components/contributors/ActivityComparisonChart";

export default function ContributorDetailPage() {
  const router = useRouter();
  const { username } = router.query;

  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [activityType, setActivityType] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "repositories" | "timeline">("analytics");

  useEffect(() => {
    if (username) {
      fetchContributor();
      fetchAnalytics();
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchActivities();
    }
  }, [username, selectedRepo, activityType, page]);

  useEffect(() => {
    if (username && selectedRepo) {
      fetchAnalytics();
    }
  }, [selectedRepo]);

  const fetchContributor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contributors/list?search=${username}&limit=1`);
      const data = await response.json();
      
      if (data.contributors && data.contributors.length > 0) {
        setContributor(data.contributors[0]);
      }
    } catch (error) {
      console.error("Failed to fetch contributor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const params = new URLSearchParams({
        username: username as string,
        page: page.toString(),
        limit: "20",
      });

      if (selectedRepo) params.append("repository", selectedRepo);
      if (activityType) params.append("activityType", activityType);

      const response = await fetch(`/api/contributors/activities?${params}`);
      const data = await response.json();

      setActivities(data.activities || []);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const params = new URLSearchParams({ username: username as string });
      if (selectedRepo) params.append("repository", selectedRepo);

      const response = await fetch(`/api/contributors/analytics?${params}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AllLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </AllLayout>
    );
  }

  if (!contributor) {
    return (
      <AllLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contributor Not Found</h2>
            <button
              onClick={() => router.push("/contributors")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Contributors
            </button>
          </div>
        </div>
      </AllLayout>
    );
  }

  const totalStats = {
    commits: contributor.repositoryStats.reduce((sum, s) => sum + (s.commits || 0), 0),
    pullRequests: contributor.repositoryStats.reduce(
      (sum, s) => sum + (s.prsOpened || 0) + (s.prsMerged || 0) + (s.prsClosed || 0),
      0
    ),
    reviews: contributor.repositoryStats.reduce((sum, s) => sum + (s.reviews || 0), 0),
    comments: contributor.repositoryStats.reduce((sum, s) => sum + (s.comments || 0), 0),
  };

  return (
    <AllLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section with Profile */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => router.push("/contributors")}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft /> Back to Contributors
            </button>

            <div className="flex items-start gap-6 flex-wrap">
              <img
                src={contributor.avatarUrl}
                alt={contributor.username}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{contributor.username}</h1>
                    {contributor.name && (
                      <p className="text-xl text-white/90 mb-3">{contributor.name}</p>
                    )}
                    {contributor.bio && (
                      <p className="text-white/80 max-w-2xl">{contributor.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-white/90">
                      {contributor.company && (
                        <span className="flex items-center gap-2">
                          <span className="text-xl">🏢</span> {contributor.company}
                        </span>
                      )}
                      {contributor.location && (
                        <span className="flex items-center gap-2">
                          <span className="text-xl">📍</span> {contributor.location}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      {contributor.repositories.map((repo) => (
                        <span
                          key={repo}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium"
                        >
                          {repo.split("/")[1]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`https://github.com/${contributor.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <FiGithub /> GitHub
                    </a>
                    {contributor.twitterUsername && (
                      <a
                        href={`https://twitter.com/${contributor.twitterUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        <FiTwitter /> Twitter
                      </a>
                    )}
                    {contributor.blog && (
                      <a
                        href={contributor.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        <FiExternalLink /> Blog
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-t-4 border-purple-500">
              <div className="text-center">
                <FiTrendingUp className="text-3xl text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{contributor.totalScore}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-t-4 border-blue-500">
              <div className="text-center">
                <FiGitCommit className="text-3xl text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Commits</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.commits}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-t-4 border-green-500">
              <div className="text-center">
                <FiGitPullRequest className="text-3xl text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pull Requests</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.pullRequests}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-t-4 border-orange-500">
              <div className="text-center">
                <span className="text-3xl mx-auto mb-2 block">✅</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reviews</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.reviews}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-t-4 border-pink-500">
              <div className="text-center">
                <span className="text-3xl mx-auto mb-2 block">💬</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStats.comments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === "analytics"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setActiveTab("repositories")}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === "repositories"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                📁 Repositories
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === "timeline"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                📅 Activity Timeline
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 dark:bg-gray-900 pb-12">
            {activeTab === "analytics" && (
              <div className="space-y-6 pt-6">
                {analyticsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  </div>
                ) : analytics ? (
                  <>
                    {/* Primary Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ActivityTimelineChart data={analytics.activityTimeline || []} />
                      <ActivityDistributionChart data={analytics.activityDistribution || []} />
                    </div>

                    {/* Heatmap Full Width */}
                    <ContributorHeatmap data={analytics.activityHeatmap || []} />

                    {/* Repository and Additional Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RepositoryBreakdownChart data={analytics.repositoryBreakdown || []} />
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
                    </div>

                    {/* Comparison Chart */}
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
                  </>
                ) : null}
              </div>
            )}

            {activeTab === "repositories" && (
              <div className="space-y-4 pt-6">
                {contributor.repositoryStats.map((stat, index) => {
                  const colors = [
                    { from: "from-blue-500", to: "to-blue-600", bg: "bg-blue-50", dark: "dark:bg-blue-900/20", text: "text-blue-700", darkText: "dark:text-blue-300" },
                    { from: "from-purple-500", to: "to-purple-600", bg: "bg-purple-50", dark: "dark:bg-purple-900/20", text: "text-purple-700", darkText: "dark:text-purple-300" },
                    { from: "from-green-500", to: "to-green-600", bg: "bg-green-50", dark: "dark:bg-green-900/20", text: "text-green-700", darkText: "dark:text-green-300" },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={stat.repository}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
                    >
                      <div className={`bg-gradient-to-r ${color.from} ${color.to} px-6 py-4`}>
                        <h3 className="text-2xl font-bold text-white">{stat.repository}</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                          <div className={`${color.bg} ${color.dark} rounded-xl p-4 text-center`}>
                            <p className={`text-3xl font-bold ${color.text} ${color.darkText}`}>{stat.score}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Score</p>
                          </div>
                          <div className={`${color.bg} ${color.dark} rounded-xl p-4 text-center`}>
                            <p className={`text-3xl font-bold ${color.text} ${color.darkText}`}>{stat.commits}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Commits</p>
                          </div>
                          <div className={`${color.bg} ${color.dark} rounded-xl p-4 text-center`}>
                            <p className={`text-3xl font-bold ${color.text} ${color.darkText}`}>
                              {(stat.prsOpened || 0) + (stat.prsMerged || 0) + (stat.prsClosed || 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pull Requests</p>
                          </div>
                          <div className={`${color.bg} ${color.dark} rounded-xl p-4 text-center`}>
                            <p className={`text-3xl font-bold ${color.text} ${color.darkText}`}>{stat.reviews}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reviews</p>
                          </div>
                          <div className={`${color.bg} ${color.dark} rounded-xl p-4 text-center`}>
                            <p className={`text-3xl font-bold ${color.text} ${color.darkText}`}>{stat.comments}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comments</p>
                          </div>
                        </div>

                        {stat.lastActivityAt && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Last activity: {formatDate(stat.lastActivityAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6 pt-6">
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={selectedRepo}
                      onChange={(e) => {
                        setSelectedRepo(e.target.value);
                        setPage(1);
                      }}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Repositories</option>
                      {contributor.repositories.map((repo) => (
                        <option key={repo} value={repo}>
                          {repo}
                        </option>
                      ))}
                    </select>

                    <select
                      value={activityType}
                      onChange={(e) => {
                        setActivityType(e.target.value);
                        setPage(1);
                      }}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Activities</option>
                      <option value="COMMIT">Commits</option>
                      <option value="PR_OPENED">PR Opened</option>
                      <option value="PR_MERGED">PR Merged</option>
                      <option value="REVIEW_APPROVED">Reviews</option>
                      <option value="ISSUE_COMMENT">Comments</option>
                    </select>
                  </div>
                </div>

                {/* Activities */}
                {activitiesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No activities found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <ActivityCard key={activity._id} activity={activity} />
                      ))}
                    </div>

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
      </div>
    </AllLayout>
  );
}
