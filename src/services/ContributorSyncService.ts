import { Octokit } from "@octokit/rest";
import type { Db } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { ActivityType } from "@/types/contributors";

interface GitHubTokenConfig {
  tokens: string[];
  currentIndex: number;
  lastRotation: number;
}

interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
}

interface SyncLogger {
  info: (message: string, data?: any) => void;
  error: (message: string, error?: any) => void;
  warn: (message: string, data?: any) => void;
}

const REPOSITORIES = ["ethereum/EIPs", "ethereum/ERCs", "ethereum/RIPs"];
const RATE_LIMIT_THRESHOLD = 100;
const DAYS_TO_SYNC = 365;
const DEFAULT_DB_NAME = "eipsinsight";

const ACTIVITY_WEIGHTS = {
  COMMIT: 3,
  PR_OPENED: 5,
  PR_MERGED: 10,
  PR_CLOSED: 2,
  REVIEW_APPROVED: 8,
  REVIEW_COMMENTED: 4,
  REVIEW_CHANGES_REQUESTED: 6,
  ISSUE_COMMENT: 2,
  PR_COMMENT: 3,
};

export class ContributorSyncService {
  private tokenConfig: GitHubTokenConfig;
  private octokit: Octokit;
  private logger: SyncLogger;
  private db: Db | null = null;

  constructor(tokens: string[], logger?: SyncLogger) {
    if (!tokens || tokens.length === 0) {
      throw new Error("At least one GitHub token is required");
    }

    this.tokenConfig = {
      tokens,
      currentIndex: 0,
      lastRotation: Date.now(),
    };

    this.octokit = new Octokit({ auth: tokens[0] });

    this.logger = logger || {
      info: (msg, data) => console.log(`[INFO] ${msg}`, data || ""),
      error: (msg, err) => console.error(`[ERROR] ${msg}`, err || ""),
      warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || ""),
    };
  }

  private async getDb(): Promise<Db> {
    if (!this.db) {
      const client = await clientPromise;
      this.db = client.db(process.env.MONGODB_DB || DEFAULT_DB_NAME);
    }
    return this.db;
  }

  private async rotateToken(): Promise<void> {
    this.tokenConfig.currentIndex =
      (this.tokenConfig.currentIndex + 1) % this.tokenConfig.tokens.length;
    const newToken = this.tokenConfig.tokens[this.tokenConfig.currentIndex];
    this.octokit = new Octokit({ auth: newToken });
    this.tokenConfig.lastRotation = Date.now();

    this.logger.info(
      `Rotated to token ${this.tokenConfig.currentIndex + 1}/${this.tokenConfig.tokens.length}`
    );
  }

  private async checkRateLimit(): Promise<RateLimitInfo> {
    try {
      const { data } = await this.octokit.rateLimit.get();
      const rateLimit = {
        remaining: data.rate.remaining,
        reset: data.rate.reset,
        limit: data.rate.limit,
      };

      this.logger.info(`Rate limit: ${rateLimit.remaining}/${rateLimit.limit}`);

      if (rateLimit.remaining < RATE_LIMIT_THRESHOLD) {
        this.logger.warn(
          `Rate limit low (${rateLimit.remaining}), rotating token`
        );
        await this.rotateToken();
      }

      return rateLimit;
    } catch (error) {
      this.logger.error("Failed to check rate limit", error);
      await this.rotateToken();
      return { remaining: 0, reset: 0, limit: 0 };
    }
  }

  private async updateSyncState(
    repository: string,
    status: "idle" | "running" | "failed",
    activitiesProcessed?: number,
    error?: string
  ): Promise<void> {
    const db = await this.getDb();
    const now = new Date();

    const shouldClearError = status !== "failed" && !error;
    await db.collection("sync_state").updateOne(
      { repository },
      {
        $set: {
          status,
          ...(status === "idle" && { lastSyncAt: now }),
          ...(activitiesProcessed !== undefined && { activitiesProcessed }),
          ...(error && { error }),
          updatedAt: now,
        },
        ...(shouldClearError && { $unset: { error: "" } }),
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  private async fetchUserProfile(username: string): Promise<any> {
    try {
      await this.checkRateLimit();
      const { data } = await this.octokit.users.getByUsername({ username });
      return data;
    } catch (error: any) {
      if (error.status === 404) {
        this.logger.warn(`User not found: ${username}`);
        return null;
      }
      throw error;
    }
  }

  private async upsertContributor(
    username: string,
    repository: string,
    activityCount: {
      commits?: number;
      prs?: number;
      reviewApproved?: number;
      reviewChangesRequested?: number;
      reviewCommented?: number;
      comments?: number;
    }
  ): Promise<string> {
    const db = await this.getDb();
    const profile = await this.fetchUserProfile(username);

    if (!profile) {
      return "";
    }

    const isBot =
      profile.type === "Bot" || username.toLowerCase().includes("bot");

    const score =
      (activityCount.commits || 0) * ACTIVITY_WEIGHTS.COMMIT +
      (activityCount.prs || 0) * ACTIVITY_WEIGHTS.PR_OPENED +
      (activityCount.reviewApproved || 0) * ACTIVITY_WEIGHTS.REVIEW_APPROVED +
      (activityCount.reviewChangesRequested || 0) * ACTIVITY_WEIGHTS.REVIEW_CHANGES_REQUESTED +
      (activityCount.reviewCommented || 0) * ACTIVITY_WEIGHTS.REVIEW_COMMENTED +
      (activityCount.comments || 0) * ACTIVITY_WEIGHTS.ISSUE_COMMENT;

    const repoStats = {
      repository,
      score,
      commits: activityCount.commits || 0,
      pullRequests: activityCount.prs || 0,
      reviews:
        (activityCount.reviewApproved || 0) +
        (activityCount.reviewChangesRequested || 0) +
        (activityCount.reviewCommented || 0),
      comments: activityCount.comments || 0,
      lastActivityAt: new Date(),
    };

    const existingContributor = await db.collection("contributors").findOne({ username });
    
    const updateDoc: any = {
      $set: {
        githubId: profile.id,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        company: profile.company,
        location: profile.location,
        blog: profile.blog,
        twitterUsername: profile.twitter_username,
        lastUpdated: new Date(),
        isBot,
      },
      $setOnInsert: {
        createdAt: new Date(),
        repositories: [],
      },
    };

    if (!existingContributor || !existingContributor.repositories?.includes(repository)) {
      updateDoc.$addToSet = { repositories: repository };
    }

    const result = await db.collection("contributors").findOneAndUpdate(
      { username },
      updateDoc,
      { upsert: true, returnDocument: "after" }
    );

    const contributorDoc: any = result?.value || result;
    const contributorId = contributorDoc?._id?.toString() || "";

    await db.collection("contributors").updateOne(
      { username, "repositoryStats.repository": repository },
      {
        $set: {
          "repositoryStats.$": repoStats,
        },
      }
    );

    const updateResult = await db.collection("contributors").findOne({
      username,
      "repositoryStats.repository": repository,
    });

    if (!updateResult) {
      await db.collection("contributors").updateOne(
        { username },
        {
          $push: {
            repositoryStats: repoStats,
          },
        }
      );
    }

    const contributor = await db.collection("contributors").findOne({ username });
    if (contributor) {
      const totalScore = (contributor.repositoryStats || []).reduce(
        (sum: number, stat: any) => sum + stat.score,
        0
      );
      const totalActivities = (contributor.repositoryStats || []).reduce(
        (sum: number, stat: any) =>
          sum + stat.commits + stat.pullRequests + stat.reviews + stat.comments,
        0
      );

      await db.collection("contributors").updateOne(
        { username },
        {
          $set: {
            totalScore,
            totalActivities,
          },
        }
      );
    }

    return contributorId;
  }

  private async syncCommits(
    owner: string,
    repo: string,
    repository: string
  ): Promise<number> {
    const db = await this.getDb();
    let activitiesAdded = 0;
    const since = new Date();
    since.setDate(since.getDate() - DAYS_TO_SYNC);

    this.logger.info(`Syncing commits for ${repository}`);

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        await this.checkRateLimit();

        const { data: commits } = await this.octokit.repos.listCommits({
          owner,
          repo,
          since: since.toISOString(),
          per_page: 100,
          page,
        });

        if (commits.length === 0) {
          hasMore = false;
          break;
        }

        for (const commit of commits) {
          const username = commit.author?.login || commit.committer?.login;
          if (!username || !commit.commit?.author?.date) continue;

          const entityRef = `commit:${commit.sha}`;

          const existing = await db.collection("activities").findOne({
            entityRef,
            repository,
          });

          if (existing) continue;

          const contributorId = await this.upsertContributor(username, repository, {
            commits: 1,
          });

          if (!contributorId) continue;

          const { data: commitDetails } = await this.octokit.repos.getCommit({
            owner,
            repo,
            ref: commit.sha,
          });

          await db.collection("activities").insertOne({
            contributorId,
            username,
            repository,
            activityType: ActivityType.COMMIT,
            entityRef,
            timestamp: new Date(commit.commit.author.date),
            metadata: {
              url: commit.html_url,
              htmlUrl: commit.html_url,
              repositoryFullName: repository,
              sha: commit.sha,
              message: commit.commit.message,
              commitUrl: commit.html_url,
              authorName: commit.commit.author.name,
              authorEmail: commit.commit.author.email,
              committerName: commit.commit.committer?.name,
              committerEmail: commit.commit.committer?.email,
              verified: commit.commit.verification?.verified,
              changedFiles: commitDetails.files?.length || 0,
              additions: commitDetails.stats?.additions,
              deletions: commitDetails.stats?.deletions,
              totalChanges:
                (commitDetails.stats?.additions || 0) +
                (commitDetails.stats?.deletions || 0),
            },
            createdAt: new Date(),
          });

          activitiesAdded++;
        }

        page++;
        if (commits.length < 100) hasMore = false;
      }

      this.logger.info(`Synced ${activitiesAdded} commits for ${repository}`);
      return activitiesAdded;
    } catch (error) {
      this.logger.error(`Failed to sync commits for ${repository}`, error);
      throw error;
    }
  }

  private async syncPullRequests(
    owner: string,
    repo: string,
    repository: string
  ): Promise<number> {
    const db = await this.getDb();
    let activitiesAdded = 0;
    const since = new Date();
    since.setDate(since.getDate() - DAYS_TO_SYNC);

    this.logger.info(`Syncing pull requests for ${repository}`);

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        await this.checkRateLimit();

        const { data: prs } = await this.octokit.pulls.list({
          owner,
          repo,
          state: "all",
          sort: "updated",
          direction: "desc",
          per_page: 100,
          page,
        }) as any;

        if (prs.length === 0) {
          hasMore = false;
          break;
        }

        let shouldBreak = false;

        for (const pr of prs) {
          if (new Date(pr.updated_at) < since) {
            shouldBreak = true;
            break;
          }

          const username = pr.user?.login;
          if (!username) continue;

          const entityRef = `pr:${pr.number}`;
          const existing = await db.collection("activities").findOne({
            entityRef,
            repository,
          });

          const stateChanged = existing?.metadata?.state !== pr.state;

          const contributorId = await this.upsertContributor(username, repository, {
            prs: 1,
          });

          if (!contributorId) continue;

          let activityType = ActivityType.PR_OPENED;
          if (pr.merged_at) {
            activityType = ActivityType.PR_MERGED;
          } else if (pr.state === "closed") {
            activityType = ActivityType.PR_CLOSED;
          }

          await db.collection("activities").updateOne(
            { entityRef, repository },
            {
              $set: {
                contributorId,
                username,
                repository,
                activityType,
                timestamp: new Date(pr.merged_at || pr.closed_at || pr.created_at),
                metadata: {
                  url: pr.url,
                  htmlUrl: pr.html_url,
                  number: pr.number,
                  repositoryFullName: repository,
                  authorAssociation: pr.author_association,
                  title: pr.title,
                  body: pr.body || "",
                  state: pr.state,
                  draft: pr.draft,
                  labels: pr.labels?.map((l: any) => l.name) || [],
                  assignees: pr.assignees?.map((a: any) => a.login) || [],
                  requestedReviewers: pr.requested_reviewers?.map((r: any) => r.login) || [],
                  baseBranch: pr.base?.ref,
                  headBranch: pr.head?.ref,
                  mergedAt: pr.merged_at ? new Date(pr.merged_at) : undefined,
                  mergedBy: pr.merged_by?.login,
                  closedAt: pr.closed_at ? new Date(pr.closed_at) : undefined,
                  additions: pr.additions,
                  deletions: pr.deletions,
                  changedFiles: pr.changed_files,
                  totalChanges: (pr.additions || 0) + (pr.deletions || 0),
                },
                updatedAt: new Date(),
              },
              $setOnInsert: { createdAt: new Date() },
            },
            { upsert: true }
          );

          if (!existing || stateChanged) {
            activitiesAdded++;
          }
        }

        if (shouldBreak) break;

        page++;
        if (prs.length < 100) hasMore = false;
      }

      this.logger.info(`Synced ${activitiesAdded} pull requests for ${repository}`);
      return activitiesAdded;
    } catch (error) {
      this.logger.error(`Failed to sync pull requests for ${repository}`, error);
      throw error;
    }
  }

  private async syncReviews(
    owner: string,
    repo: string,
    repository: string
  ): Promise<number> {
    const db = await this.getDb();
    let activitiesAdded = 0;
    const since = new Date();
    since.setDate(since.getDate() - DAYS_TO_SYNC);

    this.logger.info(`Syncing reviews for ${repository}`);

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        await this.checkRateLimit();

        const { data: prs } = await this.octokit.pulls.list({
          owner,
          repo,
          state: "all",
          sort: "updated",
          direction: "desc",
          per_page: 50,
          page,
        });

        if (prs.length === 0) break;

        let shouldBreak = false;

        for (const pr of prs) {
          if (new Date(pr.updated_at) < since) {
            shouldBreak = true;
            break;
          }

          await this.checkRateLimit();

          let reviewPage = 1;
          let hasMoreReviews = true;

          while (hasMoreReviews) {
            const { data: reviews } = await this.octokit.pulls.listReviews({
              owner,
              repo,
              pull_number: pr.number,
              per_page: 100,
              page: reviewPage,
            });

            if (reviews.length === 0) {
              hasMoreReviews = false;
              break;
            }

            for (const review of reviews) {
              if (!review.user?.login) continue;

              const username = review.user.login;
              const entityRef = `review:${pr.number}:${review.id}`;

              const existing = await db.collection("activities").findOne({
                entityRef,
                repository,
              });

              if (existing) continue;

              if (
                review.state !== "APPROVED" &&
                review.state !== "CHANGES_REQUESTED" &&
                review.state !== "COMMENTED"
              ) {
                continue;
              }

              const reviewCounts = {
                reviewApproved: review.state === "APPROVED" ? 1 : 0,
                reviewChangesRequested: review.state === "CHANGES_REQUESTED" ? 1 : 0,
                reviewCommented: review.state === "COMMENTED" ? 1 : 0,
              };

              const contributorId = await this.upsertContributor(
                username,
                repository,
                reviewCounts
              );

              if (!contributorId) continue;

              let activityType = ActivityType.REVIEW_COMMENTED;
              if (review.state === "APPROVED") {
                activityType = ActivityType.REVIEW_APPROVED;
              } else if (review.state === "CHANGES_REQUESTED") {
                activityType = ActivityType.REVIEW_CHANGES_REQUESTED;
              }

              await db.collection("activities").insertOne({
                contributorId,
                username,
                repository,
                activityType,
                entityRef,
                timestamp: new Date(review.submitted_at || new Date()),
                metadata: {
                  url: review.html_url,
                  htmlUrl: review.html_url,
                  number: pr.number,
                  repositoryFullName: repository,
                  authorAssociation: review.author_association,
                  title: pr.title,
                  reviewId: review.id,
                  reviewState: review.state,
                  reviewBody: review.body || "",
                  reviewUrl: review.html_url,
                  reviewSubmittedAt: review.submitted_at
                    ? new Date(review.submitted_at)
                    : undefined,
                },
                createdAt: new Date(),
              });

              activitiesAdded++;
            }

            reviewPage++;
            if (reviews.length < 100) hasMoreReviews = false;
          }
        }

        if (shouldBreak) break;

        page++;
        if (prs.length < 50) hasMore = false;
      }

      this.logger.info(`Synced ${activitiesAdded} reviews for ${repository}`);
      return activitiesAdded;
    } catch (error) {
      this.logger.error(`Failed to sync reviews for ${repository}`, error);
      throw error;
    }
  }

  private async syncComments(
    owner: string,
    repo: string,
    repository: string
  ): Promise<number> {
    const db = await this.getDb();
    let activitiesAdded = 0;
    const since = new Date();
    since.setDate(since.getDate() - DAYS_TO_SYNC);

    this.logger.info(`Syncing comments for ${repository}`);

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        await this.checkRateLimit();

        const { data: comments } = await this.octokit.issues.listCommentsForRepo({
          owner,
          repo,
          since: since.toISOString(),
          per_page: 100,
          page,
        });

        if (comments.length === 0) {
          hasMore = false;
          break;
        }

        for (const comment of comments) {
          if (!comment.user?.login) continue;

          const username = comment.user.login;
          const entityRef = `comment:${comment.id}`;

          const existing = await db.collection("activities").findOne({
            entityRef,
            repository,
          });

          if (existing) continue;

          const contributorId = await this.upsertContributor(username, repository, {
            comments: 1,
          });

          if (!contributorId) continue;

          const activityType = comment.html_url.includes("/pull/")
            ? ActivityType.PR_COMMENT
            : ActivityType.ISSUE_COMMENT;

          await db.collection("activities").insertOne({
            contributorId,
            username,
            repository,
            activityType,
            entityRef,
            timestamp: new Date(comment.created_at),
            metadata: {
              url: comment.url,
              htmlUrl: comment.html_url,
              repositoryFullName: repository,
              authorAssociation: comment.author_association,
              commentId: comment.id,
              commentBody: comment.body || "",
              commentUrl: comment.html_url,
              commentCreatedAt: new Date(comment.created_at),
              commentUpdatedAt: comment.updated_at ? new Date(comment.updated_at) : undefined,
              isIssueComment: activityType === ActivityType.ISSUE_COMMENT,
            },
            createdAt: new Date(),
          });

          activitiesAdded++;
        }

        page++;
        if (comments.length < 100) hasMore = false;
      }

      this.logger.info(`Synced ${activitiesAdded} comments for ${repository}`);
      return activitiesAdded;
    } catch (error) {
      this.logger.error(`Failed to sync comments for ${repository}`, error);
      throw error;
    }
  }

  public async syncRepository(repository: string): Promise<number> {
    const [owner, repo] = repository.split("/");
    let totalActivities = 0;

    try {
      this.logger.info(`Starting sync for ${repository}`);
      await this.updateSyncState(repository, "running");

      totalActivities += await this.syncCommits(owner, repo, repository);
      totalActivities += await this.syncPullRequests(owner, repo, repository);
      totalActivities += await this.syncReviews(owner, repo, repository);
      totalActivities += await this.syncComments(owner, repo, repository);

      await this.updateSyncState(repository, "idle", totalActivities);
      this.logger.info(
        `Completed sync for ${repository}: ${totalActivities} activities`
      );

      return totalActivities;
    } catch (error: any) {
      this.logger.error(`Sync failed for ${repository}`, error);
      await this.updateSyncState(repository, "failed", 0, error.message);
      throw error;
    }
  }

  public async syncAllRepositories(): Promise<void> {
    this.logger.info("Starting sync for all repositories");

    for (const repository of REPOSITORIES) {
      try {
        await this.syncRepository(repository);
      } catch (error) {
        this.logger.error(`Failed to sync ${repository}`, error);
      }
    }

    this.logger.info("Completed sync for all repositories");
  }

  public async updateActivityTimestamps(): Promise<void> {
    const db = await this.getDb();

    this.logger.info("Updating contributor activity timestamps");

    const contributors = await db.collection("contributors").find({}).toArray();

    for (const contributor of contributors) {
      const activities = await db
        .collection("activities")
        .find({ username: contributor.username })
        .sort({ timestamp: 1 })
        .toArray();

      if (activities.length > 0) {
        await db.collection("contributors").updateOne(
          { _id: contributor._id },
          {
            $set: {
              firstActivityAt: activities[0].timestamp,
              lastActivityAt: activities[activities.length - 1].timestamp,
            },
          }
        );
      }
    }

    this.logger.info("Updated activity timestamps for all contributors");
  }
}
