import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useColorModeValue } from "@chakra-ui/react";
import { FiGitCommit, FiGitPullRequest, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp, FiExternalLink } from "react-icons/fi";

interface RecentActivity {
  _id: string;
  username: string;
  repository: string;
  activityType: string;
  timestamp: Date;
  metadata?: {
    number?: number;
    prNumber?: number;
    title?: string;
    message?: string;
    description?: string;
    body?: string;
    state?: string;
    baseBranch?: string;
    headBranch?: string;
    labels?: string[];
    reviewers?: string[];
    association?: string;
    sha?: string;
    htmlUrl?: string;
  };
  avatarUrl?: string;
}

interface RecentActivitiesWidgetProps {
  limit?: number;
}

export const RecentActivitiesWidget: React.FC<RecentActivitiesWidgetProps> = ({ limit = 20 }) => {
  const router = useRouter();
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const selectBg = useColorModeValue("#FFFFFF", "#1F2937");
  const selectBorder = useColorModeValue("#E5E7EB", "#374151");
  const activityBg = useColorModeValue("#F9FAFB", "#1F2937");
  const activityHover = useColorModeValue("#F3F4F6", "#374151");
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

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      COMMIT: 'blue',
      PR_OPENED: 'green',
      PR_MERGED: 'purple',
      PR_CLOSED: 'red',
      REVIEW_APPROVED: 'green',
      REVIEW_COMMENTED: 'gray',
      REVIEW_CHANGES_REQUESTED: 'orange',
      ISSUE_COMMENT: 'cyan',
      PR_COMMENT: 'teal',
    };
    return colors[type] || 'gray';
  };

  const getActivityColorClasses = (type: string) => {
    const classes: Record<string, string> = {
      COMMIT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PR_OPENED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      PR_MERGED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      PR_CLOSED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      REVIEW_APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      REVIEW_COMMENTED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      REVIEW_CHANGES_REQUESTED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ISSUE_COMMENT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      PR_COMMENT: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    };
    return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getGitHubUrl = (activity: RecentActivity) => {
    const { repository, activityType, metadata } = activity;
    const baseUrl = `https://github.com/${repository}`;

    if (metadata?.htmlUrl) {
      return metadata.htmlUrl;
    }

    if (activityType === 'COMMIT' && metadata?.sha) {
      return `${baseUrl}/commit/${metadata.sha}`;
    }

    if (activityType.startsWith('PR_') && (metadata?.number || metadata?.prNumber)) {
      const prNum = metadata.number || metadata.prNumber;
      return `${baseUrl}/pull/${prNum}`;
    }

    if (activityType.startsWith('REVIEW_') && (metadata?.number || metadata?.prNumber)) {
      const prNum = metadata.number || metadata.prNumber;
      return `${baseUrl}/pull/${prNum}`;
    }

    if ((activityType === 'ISSUE_COMMENT' || activityType === 'PR_COMMENT') && (metadata?.number || metadata?.prNumber)) {
      const num = metadata.number || metadata.prNumber;
      return `${baseUrl}/pull/${num}`;
    }

    return baseUrl;
  };

  return (
    <div className="rounded-lg shadow-sm" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Recent Activities</h3>
        <p className="text-xs mt-1" style={{ color: textSecondary }}>Live feed</p>
      </div>

      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          style={{ backgroundColor: selectBg, border: `1px solid ${selectBorder}`, color: textColor }}
        >
          <option value="">All Repositories</option>
          <option value="ethereum/EIPs">ethereum/EIPs</option>
          <option value="ethereum/ERCs">ethereum/ERCs</option>
          <option value="ethereum/RIPs">ethereum/RIPs</option>
        </select>
      </div>

      <div className="max-h-[600px] overflow-y-auto" style={{ borderTop: `1px solid ${borderColor}` }}>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center" style={{ color: textSecondary }}>
            No recent activities found
          </div>
        ) : (
          activities.map((activity) => {
            const isExpanded = expandedId === activity._id;
            const colorClasses = getActivityColorClasses(activity.activityType);
            
            return (
              <div
                key={activity._id}
                className="p-4 transition-colors"
                style={{ backgroundColor: activityBg, borderBottom: `1px solid ${borderColor}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activityHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activityBg}
              >
                <div className="flex gap-4 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.activityType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header with badges and date */}
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${colorClasses}`}>
                          {getActivityLabel(activity.activityType)}
                        </span>
                        <span className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">
                          {activity.repository.split("/")[1]}
                        </span>
                        {activity.metadata?.prNumber && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                            #{activity.metadata.prNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>

                    {/* Title/Message */}
                    {(activity.metadata?.title || activity.metadata?.message) && (
                      <p className={`font-medium text-gray-900 dark:text-white mb-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {activity.metadata.title || activity.metadata.message?.split('\n')[0]}
                      </p>
                    )}

                    {/* Action buttons */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : activity._id);
                      }}
                      className="mt-2 text-xs flex items-center gap-1"
                      style={{ color: textSecondary }}
                    >
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      {isExpanded ? 'Show Less' : 'Show Details'}
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                        {/* Author Info - Always shown */}
                        <div className="text-sm">
                          <span style={{ color: textSecondary }}>By: </span>
                          <button
                            onClick={() => router.push(`/contributors/${activity.username}#activity-timeline`)}
                            className="font-semibold hover:text-blue-600"
                            style={{ color: textColor }}
                          >
                            {activity.username}
                          </button>
                          {activity.metadata?.association && (
                            <span className="ml-2 px-2 py-0.5 rounded text-xs" style={{ border: `1px solid ${borderColor}` }}>
                              {activity.metadata.association}
                            </span>
                          )}
                        </div>

                        {/* Repository Link */}
                        <div className="text-sm">
                          <span style={{ color: textSecondary }}>Repository: </span>
                          <a 
                            href={`https://github.com/${activity.repository}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {activity.repository}
                          </a>
                        </div>

                        {/* View on GitHub Button */}
                        <div>
                          <a 
                            href={getGitHubUrl(activity)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-colors"
                            style={{ backgroundColor: selectBg, color: textColor, border: `1px solid ${selectBorder}` }}
                          >
                            <FiExternalLink />
                            View on GitHub
                          </a>
                        </div>

                        {/* Full Message/Commit Details */}
                        {activity.metadata?.message && (
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: textColor }}>
                              {activity.activityType === 'COMMIT' ? 'Commit Message' : 'Message'}
                            </p>
                            <div className="text-sm p-3 rounded max-h-48 overflow-y-auto whitespace-pre-wrap" style={{ color: textSecondary, backgroundColor: selectBg }}>
                              {activity.metadata.message}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {activity.metadata?.description && (
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: textColor }}>Description</p>
                            <div className="text-sm p-3 rounded max-h-48 overflow-y-auto whitespace-pre-wrap" style={{ color: textSecondary, backgroundColor: selectBg }}>
                              {activity.metadata.description}
                            </div>
                          </div>
                        )}

                        {/* State */}
                        {activity.metadata?.state && (
                          <div>
                            <span className="text-xs mr-2" style={{ color: textSecondary }}>Status:</span>
                            <span className={`px-2 py-1 rounded font-medium uppercase text-xs ${
                              activity.metadata.state === 'merged' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              activity.metadata.state === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {activity.metadata.state}
                            </span>
                          </div>
                        )}

                        {/* Branches */}
                        {(activity.metadata?.headBranch || activity.metadata?.baseBranch) && (
                          <div className="text-sm">
                            <span className="mr-2" style={{ color: textSecondary }}>Branches:</span>
                            <code className="px-2 py-1 rounded text-xs" style={{ backgroundColor: selectBg }}>
                              {activity.metadata.headBranch || 'unknown'}
                            </code>
                            <span className="mx-2" style={{ color: textSecondary }}>→</span>
                            <code className="px-2 py-1 rounded text-xs" style={{ backgroundColor: selectBg }}>
                              {activity.metadata.baseBranch || 'unknown'}
                            </code>
                          </div>
                        )}

                        {/* Labels */}
                        {activity.metadata?.labels && activity.metadata.labels.length > 0 && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: textSecondary }}>Labels:</p>
                            <div className="flex flex-wrap gap-1">
                              {activity.metadata.labels.map((label, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reviewers */}
                        {activity.metadata?.reviewers && activity.metadata.reviewers.length > 0 && (
                          <div className="text-sm">
                            <span style={{ color: textSecondary }}>Reviewers: </span>
                            <span style={{ color: textColor }}>{activity.metadata.reviewers.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
