import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useColorModeValue } from "@chakra-ui/react";
import type { Contributor } from "@/types/contributors";
import AllLayout from "@/components/Layout";
import AnimatedHeader from "@/components/AnimatedHeader";
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
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const cardBg = useColorModeValue("#FFFFFF", "#1A202C");
  const cardBorder = useColorModeValue("#F3F4F6", "#1F2937");
  const cardBorderHover = useColorModeValue("#93C5FD", "#1E40AF");
  const textPrimary = useColorModeValue("#111827", "#F9FAFB");
  const textSecondary = useColorModeValue("#4B5563", "#9CA3AF");
  const textLabel = useColorModeValue("#6B7280", "#9CA3AF");
  const iconBg = useColorModeValue("#DBEAFE", "#1E3A8A33");
  const borderDivider = useColorModeValue("#F3F4F6", "#111827");
  const spinnerColor = useColorModeValue("#111827", "#F3F4F6");
  
  // Tab colors
  const tabBorder = useColorModeValue("#F3F4F6", "#111827");
  const tabActiveBorder = useColorModeValue("#111827", "#F3F4F6");
  const tabActiveText = useColorModeValue("#111827", "#F3F4F6");
  const tabInactiveText = useColorModeValue("#6B7280", "#6B7280");
  const tabHoverText = useColorModeValue("#111827", "#F3F4F6");
  
  // Button colors
  const buttonActiveBg = useColorModeValue("#DBEAFE", "#1E3A8A4D");
  const buttonActiveBorder = useColorModeValue("#93C5FD", "#1E40AF");
  const buttonActiveText = useColorModeValue("#1E3A8A", "#DBEAFE");
  const buttonInactiveBg = useColorModeValue("#FFFFFF", "#1A202C");
  const buttonInactiveBorder = useColorModeValue("#E5E7EB", "#1F2937");
  const buttonInactiveText = useColorModeValue("#4B5563", "#9CA3AF");
  const buttonHoverBorder = useColorModeValue("#93C5FD", "#1E40AF");
  
  // Input colors
  const inputBg = useColorModeValue("#FFFFFF", "#374151");
  const inputBorder = useColorModeValue("#D1D5DB", "#4B5563");
  const inputText = useColorModeValue("#111827", "#FFFFFF");
  
  // Container colors
  const containerBg = useColorModeValue("#FFFFFF", "#1F2937");
  const containerBorder = useColorModeValue("#E5E7EB", "#374151");
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
  const [timelineFilter, setTimelineFilter] = useState<"30d" | "month" | "year" | "all" | "custom">("30d");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, [timelineFilter, customStartDate, customEndDate]);

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
      const params = new URLSearchParams({ timeline: timelineFilter });
      
      if (timelineFilter === "custom" && customStartDate && customEndDate) {
        params.set("startDate", customStartDate);
        params.set("endDate", customEndDate);
      }
      
      const response = await fetch(`/api/contributors/analytics?${params}`);
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

  const faqItems = [
    {
      question: "What is Contributors Analytics?",
      answer: "This dashboard provides comprehensive insights into Ethereum ecosystem contributors, tracking their activities, contributions, and engagement across EIPs, ERCs, and RIPs repositories."
    },
    {
      question: "How are contributor scores calculated?",
      answer: "Scores are weighted based on contribution type: Commits (base points), Pull Requests (higher for merged PRs), Reviews (points for approved reviews and comments), and Comments (engagement points). The scoring system rewards meaningful contributions and active participation."
    },
    {
      question: "What metrics are tracked?",
      answer: "We track various metrics including total contributors, active contributors (last 30 days), activity velocity (daily contributions with 7-day moving average), activity distribution by type, timeline trends, and repository-specific breakdowns."
    },
    {
      question: "How can I explore the data?",
      answer: "Use the tabs to switch between Analytics (charts and visualizations), Rankings (top contributors leaderboard), and Contributors (searchable directory). Filter by repository, sort by different criteria, and click on contributors to view detailed profiles."
    }
  ];

  return (
    <AllLayout>
      <div className="min-h-screen" style={{ backgroundColor: bg }}>
        {/* Animated Header with FAQ */}
        <div className="mx-auto px-8 pt-8">
          <AnimatedHeader
            title="Contributors Analytics"
            description="Comprehensive analysis of contributor activity, rankings, and engagement patterns. Explore activity distributions, velocity trends, and detailed contributor performance metrics."
            faqItems={faqItems}
          />
        </div>

        {/* Stats Cards */}
        <div className="mx-auto px-8 py-8" style={{ borderBottom: `1px solid ${borderDivider}` }}>
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: spinnerColor }}></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative rounded-xl p-6 transition-all shadow-sm hover:shadow-md" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: iconBg }}>
                      <FiUsers className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: textLabel }}>Total Contributors</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>{stats.totalContributors.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: textSecondary }}>Across all repos</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative rounded-xl p-6 transition-all shadow-sm hover:shadow-md" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: iconBg }}>
                      <FiTrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: textLabel }}>Active Contributors</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>{stats.activeContributors.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: textSecondary }}>Last 30 days</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative rounded-xl p-6 transition-all shadow-sm hover:shadow-md" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: iconBg }}>
                      <FiGitBranch className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: textLabel }}>Total Activities</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>{stats.totalActivities.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: textSecondary }}>Commits, PRs, reviews</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative rounded-xl p-6 transition-all shadow-sm hover:shadow-md" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: iconBg }}>
                      <FiActivity className="w-5 h-5 text-pink-600" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: textLabel }}>Recent Activity</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>{stats.recentActivity.last24h.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: textSecondary }}>Last 24 hours</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="mx-auto px-8">
          <div style={{ borderBottom: `1px solid ${tabBorder}` }}>
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("analytics")}
                className="pb-4 text-xs font-semibold uppercase tracking-widest transition-all"
                style={{
                  borderBottom: activeTab === "analytics" ? `2px solid ${tabActiveBorder}` : "2px solid transparent",
                  color: activeTab === "analytics" ? tabActiveText : tabInactiveText
                }}
                onMouseEnter={(e) => activeTab !== "analytics" && (e.currentTarget.style.color = tabHoverText)}
                onMouseLeave={(e) => activeTab !== "analytics" && (e.currentTarget.style.color = tabInactiveText)}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("rankings")}
                className="pb-4 text-xs font-semibold uppercase tracking-widest transition-all"
                style={{
                  borderBottom: activeTab === "rankings" ? `2px solid ${tabActiveBorder}` : "2px solid transparent",
                  color: activeTab === "rankings" ? tabActiveText : tabInactiveText
                }}
                onMouseEnter={(e) => activeTab !== "rankings" && (e.currentTarget.style.color = tabHoverText)}
                onMouseLeave={(e) => activeTab !== "rankings" && (e.currentTarget.style.color = tabInactiveText)}
              >
                Rankings
              </button>
              <button
                onClick={() => setActiveTab("contributors")}
                className="pb-4 text-xs font-semibold uppercase tracking-widest transition-all"
                style={{
                  borderBottom: activeTab === "contributors" ? `2px solid ${tabActiveBorder}` : "2px solid transparent",
                  color: activeTab === "contributors" ? tabActiveText : tabInactiveText
                }}
                onMouseEnter={(e) => activeTab !== "contributors" && (e.currentTarget.style.color = tabHoverText)}
                onMouseLeave={(e) => activeTab !== "contributors" && (e.currentTarget.style.color = tabInactiveText)}
              >
                Contributors
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-16">
            {activeTab === "analytics" && (
              <>
                {/* Timeline Filters */}
                <div className="mx-auto px-8 pt-8 pb-4">
                  <div className="flex flex-col gap-4">
                    {/* Preset Filters */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: textLabel }}>Timeline:</span>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setTimelineFilter("30d")}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-all"
                          style={{
                            backgroundColor: timelineFilter === "30d" ? buttonActiveBg : buttonInactiveBg,
                            border: `2px solid ${timelineFilter === "30d" ? buttonActiveBorder : buttonInactiveBorder}`,
                            color: timelineFilter === "30d" ? buttonActiveText : buttonInactiveText
                          }}
                          onMouseEnter={(e) => timelineFilter !== "30d" && (e.currentTarget.style.borderColor = buttonHoverBorder)}
                          onMouseLeave={(e) => timelineFilter !== "30d" && (e.currentTarget.style.borderColor = buttonInactiveBorder)}
                        >
                          30 Days
                        </button>
                        <button
                          onClick={() => setTimelineFilter("month")}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-all"
                          style={{
                            backgroundColor: timelineFilter === "month" ? buttonActiveBg : buttonInactiveBg,
                            border: `2px solid ${timelineFilter === "month" ? buttonActiveBorder : buttonInactiveBorder}`,
                            color: timelineFilter === "month" ? buttonActiveText : buttonInactiveText
                          }}
                          onMouseEnter={(e) => timelineFilter !== "month" && (e.currentTarget.style.borderColor = buttonHoverBorder)}
                          onMouseLeave={(e) => timelineFilter !== "month" && (e.currentTarget.style.borderColor = buttonInactiveBorder)}
                        >
                          Last Month
                        </button>
                        <button
                          onClick={() => setTimelineFilter("year")}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-all"
                          style={{
                            backgroundColor: timelineFilter === "year" ? buttonActiveBg : buttonInactiveBg,
                            border: `2px solid ${timelineFilter === "year" ? buttonActiveBorder : buttonInactiveBorder}`,
                            color: timelineFilter === "year" ? buttonActiveText : buttonInactiveText
                          }}
                          onMouseEnter={(e) => timelineFilter !== "year" && (e.currentTarget.style.borderColor = buttonHoverBorder)}
                          onMouseLeave={(e) => timelineFilter !== "year" && (e.currentTarget.style.borderColor = buttonInactiveBorder)}
                        >
                          Last Year
                        </button>
                        <button
                          onClick={() => setTimelineFilter("all")}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-all"
                          style={{
                            backgroundColor: timelineFilter === "all" ? buttonActiveBg : buttonInactiveBg,
                            border: `2px solid ${timelineFilter === "all" ? buttonActiveBorder : buttonInactiveBorder}`,
                            color: timelineFilter === "all" ? buttonActiveText : buttonInactiveText
                          }}
                          onMouseEnter={(e) => timelineFilter !== "all" && (e.currentTarget.style.borderColor = buttonHoverBorder)}
                          onMouseLeave={(e) => timelineFilter !== "all" && (e.currentTarget.style.borderColor = buttonInactiveBorder)}
                        >
                          All Time
                        </button>
                        <button
                          onClick={() => setTimelineFilter("custom")}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-all"
                          style={{
                            backgroundColor: timelineFilter === "custom" ? buttonActiveBg : buttonInactiveBg,
                            border: `2px solid ${timelineFilter === "custom" ? buttonActiveBorder : buttonInactiveBorder}`,
                            color: timelineFilter === "custom" ? buttonActiveText : buttonInactiveText
                          }}
                          onMouseEnter={(e) => timelineFilter !== "custom" && (e.currentTarget.style.borderColor = buttonHoverBorder)}
                          onMouseLeave={(e) => timelineFilter !== "custom" && (e.currentTarget.style.borderColor = buttonInactiveBorder)}
                        >
                          Custom Range
                        </button>
                      </div>
                    </div>

                    {/* Custom Date Range Picker */}
                    {timelineFilter === "custom" && (
                      <div className="flex items-center gap-4 pl-24">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textLabel }}>From:</label>
                          <input
                            type="month"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="px-3 py-2 text-sm rounded transition-colors"
                            style={{
                              backgroundColor: inputBg,
                              border: `1px solid ${inputBorder}`,
                              color: inputText
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textLabel }}>To:</label>
                          <input
                            type="month"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="px-3 py-2 text-sm rounded transition-colors"
                            style={{
                              backgroundColor: inputBg,
                              border: `1px solid ${inputBorder}`,
                              color: inputText
                            }}
                          />
                        </div>
                        {customStartDate && customEndDate && (
                          <button
                            onClick={() => fetchAnalytics()}
                            className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors"
                            style={{
                              backgroundColor: buttonActiveBg,
                              border: `2px solid ${buttonActiveBorder}`,
                              color: buttonActiveText
                            }}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    )}

                    {/* Download CSV Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/contributors/export-detailed?timeline=${timelineFilter}`);
                            const data = await response.json();
                            
                            if (!data.activities || data.activities.length === 0) {
                              alert('No activities found for the selected timeline');
                              return;
                            }
                            
                            // Create detailed CSV with essential metadata
                            const headers = [
                              'Activity ID', 'Activity Type', 'Repository', 'Username', 'Contributor Name',
                              'Commit SHA', 'Commit Author Name',
                              'PR Title', 'PR State', 'PR Labels', 'PR Merged At', 'PR Closed At',
                              'Review ID', 'Review URL',
                              'Comment ID', 'Comment URL', 'Comment Created At', 'Comment Updated At'
                            ];
                            
                            const escapeCSV = (value: any) => {
                              if (value === null || value === undefined || value === '') return '';
                              const stringValue = String(value);
                              if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                                return `"${stringValue.replace(/"/g, '""')}"`;
                              }
                              return stringValue;
                            };
                            
                            const rows = data.activities.map((activity: any) => [
                              activity.activityId,
                              activity.activityType,
                              activity.repository,
                              activity.username,
                              activity.contributorName,
                              activity.commitSha,
                              activity.commitAuthorName,
                              activity.prTitle,
                              activity.prState,
                              activity.prLabels,
                              activity.prMergedAt,
                              activity.prClosedAt,
                              activity.reviewId,
                              activity.reviewUrl,
                              activity.commentId,
                              activity.commentUrl,
                              activity.commentCreatedAt,
                              activity.commentUpdatedAt
                            ].map(escapeCSV));
                            
                            const csvContent = [headers.join(','), ...rows.map((row: string[]) => row.join(','))].join('\n');
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `contributors-detailed-activities-${timelineFilter}-${new Date().toISOString().split('T')[0]}.csv`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error('Failed to download CSV:', error);
                            alert('Failed to download CSV. Please try again.');
                          }
                        }}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors"
                        style={{
                          backgroundColor: buttonInactiveBg,
                          border: `2px solid ${buttonInactiveBorder}`,
                          color: textPrimary
                        }}
                      >
                        Download Detailed CSV
                      </button>
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
                      <ActivityTimelineChart 
                        data={analytics.activityTimeline || []} 
                        rawActivities={analytics.rawActivities || []} 
                        timelineLabel={
                          timelineFilter === "30d" ? "Last 30 days" : 
                          timelineFilter === "month" ? "Last month" : 
                          timelineFilter === "year" ? "Last year" : 
                          timelineFilter === "custom" && customStartDate && customEndDate ? 
                            `${customStartDate} to ${customEndDate}` : 
                          "All time"
                        } 
                      />
                      <ActivityDistributionChart 
                        data={analytics.activityDistribution || []} 
                        rawActivities={analytics.rawActivities || []}
                      />
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
                          stats?.topContributors.slice(0, 8).map((c) => ({
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
                {/* Download CSV Button for Rankings */}
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        if (!contributors || contributors.length === 0) {
                          alert('No contributors data available');
                          return;
                        }
                        
                        const escapeCSV = (value: any) => {
                          if (value === null || value === undefined || value === '') return '';
                          const stringValue = String(value);
                          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                            return `"${stringValue.replace(/"/g, '""')}"`;
                          }
                          return stringValue;
                        };
                        
                        // Flatten contributor data with repository stats
                        const detailedRows: string[][] = [];
                        
                        contributors.forEach((contributor: Contributor) => {
                          // For each repository, create a separate row
                          if (contributor.repositoryStats && contributor.repositoryStats.length > 0) {
                            contributor.repositoryStats.forEach((repoStat: any) => {
                              detailedRows.push([
                                contributor.username,
                                contributor.name || '',
                                contributor.company || '',
                                contributor.location || '',
                                contributor.totalScore.toString(),
                                contributor.totalActivities.toString(),
                                contributor.lastActivityAt ? new Date(contributor.lastActivityAt).toISOString() : '',
                                repoStat.repository,
                                `${repoStat.commits || 0} commits`,
                                `${repoStat.prsOpened || 0} opened, ${repoStat.prsMerged || 0} merged, ${repoStat.prsClosed || 0} closed`,
                                `${repoStat.reviews || 0} reviews`,
                                `${repoStat.comments || 0} comments`
                              ].map(escapeCSV));
                            });
                          } else {
                            // Contributor with no repo stats
                            detailedRows.push([
                              contributor.username,
                              contributor.name || '',
                              contributor.company || '',
                              contributor.location || '',
                              contributor.totalScore.toString(),
                              contributor.totalActivities.toString(),
                              contributor.lastActivityAt ? new Date(contributor.lastActivityAt).toISOString() : '',
                              '', 'No commits', 'No PRs', 'No reviews', 'No comments'
                            ].map(escapeCSV));
                          }
                        });
                        
                        const headers = [
                          'Username', 'Name', 'Company', 'Location', 'Total Score', 'Total Activities',
                          'Last Activity', 'Repository', 'Commits', 'Pull Requests', 'Reviews', 'Comments'
                        ];
                        
                        const csvContent = [headers.join(','), ...detailedRows.map((row: string[]) => row.join(','))].join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `contributors-rankings-detailed-${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Failed to download CSV:', error);
                        alert('Failed to download CSV. Please try again.');
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors"
                    style={{
                      backgroundColor: buttonInactiveBg,
                      border: `2px solid ${buttonInactiveBorder}`,
                      color: textPrimary
                    }}
                  >
                    Download Detailed CSV
                  </button>
                </div>
                <ContributorRankings contributors={contributors} />
              </div>
            )}

            {activeTab === "contributors" && (
              <div className="space-y-6 pt-6">
                {/* Search and Filters */}
                <div className="rounded-2xl p-6 shadow-lg" style={{ border: `1px solid ${containerBorder}`, backgroundColor: containerBg }}>
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
                          className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                        />
                      </div>
                    </div>
                    <select
                      value={selectedRepo}
                      onChange={(e) => {
                        setSelectedRepo(e.target.value);
                        setPage(1);
                      }}
                      className="px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
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
                      className="px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Download CSV Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={async () => {
                        try {
                          if (!contributors || contributors.length === 0) {
                            alert('No contributors data available');
                            return;
                          }
                          
                          const escapeCSV = (value: any) => {
                            if (value === null || value === undefined || value === '') return '';
                            const stringValue = String(value);
                            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                              return `"${stringValue.replace(/"/g, '""')}"`;
                            }
                            return stringValue;
                          };
                          
                          // Flatten contributor data with repository stats
                          const detailedRows: string[][] = [];
                          
                          contributors.forEach((contributor: Contributor) => {
                            // For each repository, create a separate row
                            if (contributor.repositoryStats && contributor.repositoryStats.length > 0) {
                              contributor.repositoryStats.forEach((repoStat: any) => {
                                detailedRows.push([
                                  contributor.username,
                                  contributor.name || '',
                                  contributor.company || '',
                                  contributor.location || '',
                                  contributor.bio || '',
                                  contributor.totalScore.toString(),
                                  contributor.totalActivities.toString(),
                                  contributor.lastActivityAt ? new Date(contributor.lastActivityAt).toISOString() : '',
                                  contributor.repositories.join('; '),
                                  repoStat.repository,
                                  `${repoStat.commits || 0} commits`,
                                  `${repoStat.prsOpened || 0} opened, ${repoStat.prsMerged || 0} merged, ${repoStat.prsClosed || 0} closed`,
                                  `${repoStat.reviews || 0} reviews`,
                                  `${repoStat.comments || 0} comments`
                                ].map(escapeCSV));
                              });
                            } else {
                              // Contributor with no repo stats
                              detailedRows.push([
                                contributor.username,
                                contributor.name || '',
                                contributor.company || '',
                                contributor.location || '',
                                contributor.bio || '',
                                contributor.totalScore.toString(),
                                contributor.totalActivities.toString(),
                                contributor.lastActivityAt ? new Date(contributor.lastActivityAt).toISOString() : '',
                                contributor.repositories.join('; '),
                                '', 'No commits', 'No PRs', 'No reviews', 'No comments'
                              ].map(escapeCSV));
                            }
                          });
                          
                          const headers = [
                            'Username', 'Name', 'Company', 'Location', 'Bio', 'Total Score', 'Total Activities',
                            'Last Activity', 'All Repositories', 'Repository', 'Commits', 'Pull Requests', 'Reviews', 'Comments'
                          ];
                          
                          const csvContent = [headers.join(','), ...detailedRows.map((row: string[]) => row.join(','))].join('\n');
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `contributors-list-detailed-${new Date().toISOString().split('T')[0]}.csv`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error('Failed to download CSV:', error);
                          alert('Failed to download CSV. Please try again.');
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors"
                      style={{
                        backgroundColor: buttonInactiveBg,
                        border: `2px solid ${buttonInactiveBorder}`,
                        color: textPrimary
                      }}
                    >
                      Download Detailed CSV
                    </button>
                  </div>
                </div>

                {/* Contributors Grid */}
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  </div>
                ) : contributors.length === 0 ? (
                  <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}>
                    <p style={{ color: textSecondary }}>No contributors found matching your criteria</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                      {contributors.map((contributor) => (
                        <div
                          key={contributor._id}
                          onClick={() => router.push(`/contributors/${contributor.username}`)}
                          className="rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                          style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
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
                                  <h3 className="text-base font-semibold truncate" style={{ color: textPrimary }}>
                                    {contributor.username}
                                  </h3>
                                  {contributor.name && (
                                    <p className="text-xs truncate mt-1" style={{ color: textLabel }}>
                                      {contributor.name}
                                    </p>
                                  )}
                                </div>
                                <span className="text-lg font-bold" style={{ color: textPrimary }}>
                                  {getRepoScore(contributor, selectedRepo)}
                                </span>
                              </div>

                              {contributor.bio && (
                                <p className="text-sm mt-2 line-clamp-2" style={{ color: textSecondary }}>{contributor.bio}</p>
                              )}

                              <div className="flex items-center gap-3 mt-3 text-sm" style={{ color: textSecondary }}>
                                {contributor.company && <span>🏢 {contributor.company}</span>}
                                {contributor.location && <span>📍 {contributor.location}</span>}
                              </div>

                              <div className="flex gap-1 mt-3 flex-wrap">
                                {contributor.repositories.map((repo) => (
                                  <span
                                    key={repo}
                                    className="px-2 py-1 rounded text-xs font-medium"
                                    style={{ backgroundColor: buttonActiveBg, color: buttonActiveText }}
                                  >
                                    {repo.split("/")[1]}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${containerBorder}` }}>
                                <span className="text-sm font-medium" style={{ color: textPrimary }}>
                                  <strong>{contributor.totalActivities}</strong> activities
                                </span>
                                {contributor.lastActivityAt && (
                                  <span className="text-xs" style={{ color: textSecondary }}>
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
                      <span className="font-semibold" style={{ color: textPrimary }}>Page {page}</span>
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r rounded-2xl p-6 text-center" style={{ 
            backgroundImage: useColorModeValue(
              'linear-gradient(to right, #EFF6FF, #FAF5FF)', 
              'linear-gradient(to right, #1E3A8A33, #581C8733)'
            ),
            border: `1px solid ${useColorModeValue('#BFDBFE', '#1E40AF')}`
          }}>
            <p className="text-sm font-medium" style={{ color: useColorModeValue('#374151', '#D1D5DB') }}>
              ⚙️ Contributor data is automatically updated every 24 hours. Activity scores are calculated based on commits, pull requests, reviews, and other contributions across all repositories.
            </p>
          </div>
        </div>
      </div>
    </AllLayout>
  );
}
