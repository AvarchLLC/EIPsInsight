export enum ActivityType {
  COMMIT = "COMMIT",
  PR_OPENED = "PR_OPENED",
  PR_MERGED = "PR_MERGED",
  PR_CLOSED = "PR_CLOSED",
  REVIEW_APPROVED = "REVIEW_APPROVED",
  REVIEW_COMMENTED = "REVIEW_COMMENTED",
  REVIEW_CHANGES_REQUESTED = "REVIEW_CHANGES_REQUESTED",
  ISSUE_COMMENT = "ISSUE_COMMENT",
  PR_COMMENT = "PR_COMMENT",
}

export interface RepositoryStats {
  repository: string;
  score: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  comments: number;
  lastActivityAt: Date;
}

export interface Contributor {
  _id: string;
  username: string;
  githubId: number;
  name?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
  twitterUsername?: string;
  createdAt: Date;
  lastUpdated: Date;
  isBot: boolean;
  repositories: string[];
  repositoryStats: RepositoryStats[];
  totalScore: number;
  totalActivities: number;
  firstActivityAt?: Date;
  lastActivityAt?: Date;
}

export interface ActivityMetadata {
  // COMMON FIELDS
  url?: string;
  htmlUrl?: string;
  number?: number;
  repositoryFullName?: string;
  authorAssociation?: string;
  
  // COMMIT SPECIFIC
  sha?: string;
  message?: string;
  commitUrl?: string;
  authorName?: string;
  authorEmail?: string;
  committerName?: string;
  committerEmail?: string;
  verified?: boolean;
  
  // PULL REQUEST SPECIFIC
  title?: string;
  body?: string;
  state?: string;
  draft?: boolean;
  labels?: string[];
  assignees?: string[];
  requestedReviewers?: string[];
  baseBranch?: string;
  headBranch?: string;
  mergedAt?: Date;
  mergedBy?: string;
  closedAt?: Date;
  
  // REVIEW SPECIFIC
  reviewId?: number;
  reviewState?: string;
  reviewBody?: string;
  reviewUrl?: string;
  reviewSubmittedAt?: Date;
  
  // COMMENT SPECIFIC
  commentId?: number;
  commentBody?: string;
  commentUrl?: string;
  commentCreatedAt?: Date;
  commentUpdatedAt?: Date;
  isIssueComment?: boolean;
  
  // CODE CHANGES (commits and PRs)
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  totalChanges?: number;
}

export interface Activity {
  _id: string;
  contributorId: string;
  username: string;
  repository: string;
  activityType: ActivityType;
  entityRef: string;
  timestamp: Date;
  metadata: ActivityMetadata;
  createdAt: Date;
}

export interface SyncState {
  _id: string;
  repository: string;
  lastSyncAt?: Date;
  status: "idle" | "running" | "failed";
  activitiesProcessed?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContributorFilters {
  repository?: string;
  search?: string;
  sortBy?: "totalScore" | "totalActivities" | "lastActivityAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ContributorListResponse {
  contributors: Contributor[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ActivityFilters {
  username: string;
  repository?: string;
  activityType?: ActivityType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ActivityTimelineResponse {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
