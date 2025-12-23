import React, { useState, useEffect } from "react";
import { FiActivity, FiGitCommit, FiGitPullRequest, FiMessageSquare } from "react-icons/fi";

interface RecentActivity {
  _id: string;
  username: string;
  repository: string;
  activityType: string;
  timestamp: Date;
  metadata?: {
    prNumber?: number;
    title?: string;
    message?: string;
  };
  avatarUrl?: string;
}

interface RecentActivitiesWidgetProps {
  limit?: number;
}

export const RecentActivitiesWidget: React.FC<RecentActivitiesWidgetProps> = ({ limit = 20 }) => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState("");

  useEffect(() => {
    fetchRecentActivities();
  }, [selectedRepo]);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: limit.toString() });
      if (selectedRepo) params.append("repository", selectedRepo);

      const response = await fetch(`/api/contributors/recent-activities?${params}`);
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    if (type === "COMMIT") return <FiGitCommit className="text-blue-500" />;
    if (type.startsWith("PR_")) return <FiGitPullRequest className="text-purple-500" />;
    if (type.startsWith("REVIEW_")) return <span className="text-green-500">✅</span>;
    return <FiMessageSquare className="text-orange-500" />;
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      COMMIT: "committed",
      PR_OPENED: "opened PR",
      PR_MERGED: "merged PR",
      PR_CLOSED: "closed PR",
      REVIEW_APPROVED: "approved",
      REVIEW_COMMENTED: "reviewed",
      REVIEW_CHANGES_REQUESTED: "requested changes",
      ISSUE_COMMENT: "commented",
      PR_COMMENT: "commented on PR",
    };
    return labels[type] || type;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-orange-50/30 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-orange-200 dark:border-orange-900 bg-orange-100/20 dark:bg-orange-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Recent Activities</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Live feed</p>
      </div>

      <div className="px-8 py-4 border-b border-gray-100 dark:border-gray-800">
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="">All Repositories</option>
          <option value="ethereum/EIPs">ethereum/EIPs</option>
          <option value="ethereum/ERCs">ethereum/ERCs</option>
          <option value="ethereum/RIPs">ethereum/RIPs</option>
        </select>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No recent activities found
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <a
                          href={`/contributors/${activity.username}`}
                          className="font-semibold hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {activity.username}
                        </a>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {getActivityLabel(activity.activityType)}
                        </span>
                      </p>
                      {activity.metadata?.title && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                          {activity.metadata.title}
                        </p>
                      )}
                      {activity.metadata?.message && !activity.metadata?.title && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {activity.metadata.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                          {activity.repository.split("/")[1]}
                        </span>
                        {activity.metadata?.prNumber && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{activity.metadata.prNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
