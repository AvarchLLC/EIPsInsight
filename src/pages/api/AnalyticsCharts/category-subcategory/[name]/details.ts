/**
 * Category-subcategory details API: table with metadata (per-PR rows).
 *
 * Two modes (same response shape):
 * - default: PR collections (eipprs, ercprs, ripprs) with activity month (createdAt or updatedAt in month).
 * - source=snapshot: snapshot collections (open_*_pr_snapshots) for that month — same PRs the chart counts (hourly pre-aggregation).
 *
 * Query: name=eips|ercs|rips|all, month=YYYY-MM[, source=snapshot]
 * Response: MonthKey, Month, Repo, Process, Participants, PRNumber, PRId, PRLink, Title, Author, State, CreatedAt, ClosedAt, Labels, GitHubRepo.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Schema, Connection } from "mongoose";

const MONGODB_URI = process.env.OPENPRS_MONGODB_URI || "";
const DB_NAME = process.env.OPENPRS_DATABASE || "prsdb";

const PR_COLLECTIONS: Record<string, string> = {
  eips: "eipprs",
  ercs: "ercprs",
  rips: "ripprs",
};

const SNAPSHOT_COLLECTIONS: Record<string, string> = {
  eips: "open_pr_snapshots",
  ercs: "open_erc_pr_snapshots",
  rips: "open_rip_pr_snapshots",
};

const REPO_LABELS: Record<string, string> = {
  eips: "EIP PRs",
  ercs: "ERC PRs",
  rips: "RIP PRs",
};

const GITHUB_REPOS: Record<string, string> = {
  eips: "ethereum/EIPs",
  ercs: "ethereum/ERCs",
  rips: "ethereum/RIPs",
};

interface PRDoc {
  prId?: number;
  number: number;
  title?: string;
  author?: string;
  prUrl?: string;
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
  mergedAt?: Date;
  specType?: string;
  draft?: boolean;
  category?: string;
  subcategory?: string;
  githubLabels?: string[];
}

const prSchema = new Schema<PRDoc>(
  {
    prId: Number,
    number: Number,
    title: String,
    author: String,
    prUrl: String,
    state: String,
    createdAt: Date,
    updatedAt: Date,
    closedAt: Date,
    mergedAt: Date,
    specType: String,
    draft: Boolean,
    category: String,
    subcategory: String,
    githubLabels: [String],
  },
  { strict: false }
);

function inMonth(d: Date | null | undefined, year: number, month: number): boolean {
  if (!d) return false;
  const x = d instanceof Date ? d : new Date(d);
  return x.getFullYear() === year && x.getMonth() === month - 1;
}

async function getConn(): Promise<Connection> {
  const conn = mongoose.createConnection(MONGODB_URI, {
    dbName: DB_NAME,
    readPreference: "primary",
    readConcern: { level: "majority" },
    maxIdleTimeMS: 10000,
  });
  await new Promise<void>((resolve, reject) => {
    conn.once("open", () => resolve());
    conn.once("error", (err) => reject(err));
  });
  return conn;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = req.query.name as string;
  const month = typeof req.query.month === "string" ? req.query.month : "";
  const source = typeof req.query.source === "string" ? req.query.source : "";

  if (!name || !["eips", "ercs", "rips", "all"].includes(name)) {
    return res.status(400).json({ error: "Invalid name. Use eips, ercs, rips, or all." });
  }
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "Invalid month. Use YYYY-MM." });
  }

  const [y, m] = month.split("-").map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  type Row = {
    MonthKey: string;
    Month: string;
    Repo: string;
    Process: string;
    Participants: string;
    PRNumber: number;
    PRId: number;
    PRLink: string;
    Title: string;
    Author: string;
    State: string;
    CreatedAt: string;
    ClosedAt: string;
    Labels: string;
    GitHubRepo: string;
  };

  const repoKeys = name === "all" ? (["eips", "ercs", "rips"] as const) : ([name] as const);

  // source=snapshot: read from open_*_pr_snapshots (same PRs the chart counts; hourly pre-aggregation)
  // Use LATEST snapshot per month only (sort snapshotDate desc, take first) so counts match Graph 2/3 aggregation
  if (source === "snapshot") {
    try {
      const conn = await getConn();
      const snapshotSchema = new Schema({ snapshotDate: String, month: String, prs: [{}] }, { strict: false });
      const rows: Row[] = [];

      for (const repoKey of repoKeys) {
        const coll = SNAPSHOT_COLLECTIONS[repoKey];
        const modelName = `Snap_${repoKey}`;
        const Snap = conn.models[modelName] ?? conn.model(modelName, snapshotSchema, coll);
        const snap = await Snap.findOne({ month }).sort({ snapshotDate: -1, _id: -1 }).lean(); // latest snapshot per month
        const repoLabel = REPO_LABELS[repoKey];
        const githubRepo = GITHUB_REPOS[repoKey];
        if (!snap) continue;

        const prs = (snap as { prs?: unknown[] }).prs ?? [];
        for (const pr of prs) {
          const p = pr as { number?: number; prId?: number; title?: string; author?: string; state?: string; createdAt?: string; closedAt?: string; category?: string; subcategory?: string; githubLabels?: string[]; customLabels?: string[]; prUrl?: string };
          const prNum = p.number ?? 0;
          const labels = Array.isArray(p.githubLabels) ? p.githubLabels : Array.isArray(p.customLabels) ? p.customLabels : [];
          rows.push({
            MonthKey: month,
            Month: monthLabel,
            Repo: repoLabel,
            Process: p.category ?? "Other",
            Participants: p.subcategory ?? "Misc",
            PRNumber: prNum,
            PRId: p.prId ?? prNum,
            PRLink: p.prUrl ?? `https://github.com/${githubRepo}/pull/${prNum}`,
            Title: (p.title ?? "").replace(/"/g, '""'),
            Author: p.author ?? "",
            State: p.state ?? "open",
            CreatedAt: p.createdAt ? new Date(p.createdAt).toISOString() : "",
            ClosedAt: p.closedAt ? new Date(p.closedAt).toISOString() : "",
            Labels: labels.join("; "),
            GitHubRepo: githubRepo,
          });
        }
      }

      await conn.close();
      return res.status(200).json(rows);
    } catch (error) {
      console.error("[category-subcategory details from snapshots]", error);
      return res.status(500).json({
        error: "Failed to fetch PR details from snapshots",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // default: PR collections with activity month (createdAt or updatedAt in month)
  try {
    const conn = await getConn();
    const rows: Row[] = [];

    for (const repoKey of repoKeys) {
      const coll = PR_COLLECTIONS[repoKey];
      const modelName = `PR_${repoKey}`;
      const Model = conn.models[modelName] ?? conn.model<PRDoc>(modelName, prSchema, coll);

      const prs = await Model.find({ state: "open" }).lean();
      const inScope = (prs as unknown as PRDoc[]).filter(
        (pr) => inMonth(pr.createdAt, y, m) || inMonth(pr.updatedAt, y, m)
      );

      const repoLabel = REPO_LABELS[repoKey];
      const githubRepo = GITHUB_REPOS[repoKey];

      for (const pr of inScope) {
        const processVal = pr.category ?? "Other";
        const participantsVal = pr.subcategory ?? "Misc";
        const labels = Array.isArray(pr.githubLabels) ? pr.githubLabels : [];

        rows.push({
          MonthKey: month,
          Month: monthLabel,
          Repo: repoLabel,
          Process: processVal,
          Participants: participantsVal,
          PRNumber: pr.number ?? 0,
          PRId: pr.prId ?? pr.number ?? 0,
          PRLink: pr.prUrl ?? `https://github.com/${githubRepo}/pull/${pr.number}`,
          Title: (pr.title ?? "").replace(/"/g, '""'),
          Author: pr.author ?? "",
          State: pr.state ?? "open",
          CreatedAt: pr.createdAt ? new Date(pr.createdAt).toISOString() : "",
          ClosedAt: pr.closedAt ? new Date(pr.closedAt).toISOString() : "",
          Labels: labels.join("; "),
          GitHubRepo: githubRepo,
        });
      }
    }

    await conn.close();
    return res.status(200).json(rows);
  } catch (error) {
    console.error("[category-subcategory details from PR collections]", error);
    return res.status(500).json({
      error: "Failed to fetch PR details",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
