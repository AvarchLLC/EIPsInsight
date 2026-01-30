import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Schema, Connection } from "mongoose";

const MONGODB_URI = process.env.OPENPRS_MONGODB_URI || "";
const DB_NAME = process.env.OPENPRS_DATABASE || "prsdb";

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

// Graph 2 Process: PR DRAFT | Typo | NEW EIP | Website | EIP-1 | Tooling | Status Change | Other
function deriveCategory(repoKey: string, labels: string[], state?: string, isPrDraft?: boolean): string {
  const customLabels = labels.map((l) => (l || "").trim()).filter(Boolean);
  if (isPrDraft === true || customLabels.some((l) => l === "PR DRAFT")) return "PR DRAFT";
  if (customLabels.some((l) => /^Typo Fix$/i.test(l))) return "Typo";
  if (customLabels.some((l) => /^Status Change$/i.test(l))) return "Status Change";
  if (repoKey === "ercs" && customLabels.some((l) => /^New ERC$/i.test(l))) return "NEW EIP";
  if (repoKey === "rips" && customLabels.some((l) => /^New RIP$/i.test(l))) return "NEW EIP";
  if (customLabels.some((l) => /^New EIP$/i.test(l))) return "NEW EIP";
  if (customLabels.some((l) => /website|r-website/i.test(l))) return "Website";
  if (customLabels.some((l) => /eip-?1|EIP-?1/i.test(l))) return "EIP-1";
  if (customLabels.some((l) => /tooling|r-ci|r-process/i.test(l))) return "Tooling";
  return "Other";
}

// Participants: must match Graph 2 subcategory logic so board count matches "Waiting on Editor" from Graph 2
function deriveSubcategory(labels: string[], state?: string, isPrDraft?: boolean): string {
  const all = labels.map((l) => (l || "").toLowerCase()).filter(Boolean);
  // Waiting on Editor: all label variants that Graph 2 / ETL may use
  if (
    all.some(
      (l) =>
        l === "e-review" ||
        l === "editor review" ||
        l === "needs-editor-review" ||
        l === "custom:needs-editor-review" ||
        l === "e-consensus" ||
        (l && l.includes("editor") && l.includes("review"))
    )
  )
    return "Waiting on Editor";
  if (all.some((l) => l === "a-review" || l === "author review")) return "Waiting on Author";
  if (all.some((l) => l === "s-stagnant" || l === "stagnant")) return "Stagnant";
  if (isPrDraft === true || labels.some((l) => l === "PR DRAFT")) return "Awaited";
  return "Misc";
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

interface SnapshotDoc {
  month: string;
  prs?: {
    number: number;
    prId?: number;
    title?: string;
    author?: string;
    state?: string;
    createdAt?: Date;
    closedAt?: Date;
    customLabels?: string[];
    githubLabels?: string[];
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = req.query.name as string;
  const month = typeof req.query.month === "string" ? req.query.month : "";

  if (!name || !["eips", "ercs", "rips", "all"].includes(name)) {
    return res.status(400).json({ error: "Invalid name. Use eips, ercs, rips, or all." });
  }
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "Invalid month. Use YYYY-MM." });
  }

  try {
    const conn = await getConn();
    const schema = new Schema<SnapshotDoc>({ month: String, prs: [{}] }, { strict: false });

    const repoKeys = name === "all" ? (["eips", "ercs", "rips"] as const) : ([name] as const);
    const rows: {
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
    }[] = [];

    const [y, m] = month.split("-").map(Number);
    const monthLabel = new Date(y, m - 1, 1).toLocaleString("default", { month: "short", year: "numeric" });

    for (const repoKey of repoKeys) {
      const coll = SNAPSHOT_COLLECTIONS[repoKey];
      const modelName = `Snap_${repoKey}`;
      const Model = conn.models[modelName] ?? conn.model<SnapshotDoc>(modelName, schema, coll);
      const snap = await Model.findOne({ month }).lean();
      if (!snap?.prs?.length) continue;

      const repoLabel = REPO_LABELS[repoKey];
      const githubRepo = GITHUB_REPOS[repoKey];

      for (const pr of snap.prs) {
        const labels = pr.customLabels ?? pr.githubLabels ?? [];
        const isPrDraft = !!(pr as any).draft;
        const processVal = deriveCategory(repoKey, labels, pr.state, isPrDraft);
        const participantsVal = deriveSubcategory(labels, pr.state, isPrDraft);
        rows.push({
          MonthKey: month,
          Month: monthLabel,
          Repo: repoLabel,
          Process: processVal,
          Participants: participantsVal,
          PRNumber: pr.number ?? 0,
          PRId: pr.prId ?? pr.number ?? 0,
          PRLink: `https://github.com/${githubRepo}/pull/${pr.number}`,
          Title: (pr.title ?? "").replace(/"/g, '""'),
          Author: pr.author ?? "",
          State: pr.state ?? "",
          CreatedAt: pr.createdAt ? new Date(pr.createdAt).toISOString() : "",
          ClosedAt: pr.closedAt ? new Date(pr.closedAt).toISOString() : "",
          Labels: (Array.isArray(labels) ? labels : []).join("; "),
          GitHubRepo: githubRepo,
        });
      }
    }

    await conn.close();
    return res.status(200).json(rows);
  } catch (error) {
    console.error("[category-subcategory details]", error);
    return res.status(500).json({
      error: "Failed to fetch PR details",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
