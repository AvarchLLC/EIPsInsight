import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.OPENPRS_MONGODB_URI || "";
const DB_NAME = process.env.OPENPRS_DATABASE || "prsdb";

/** Same pre-aggregated snapshot collections as Analytics (category-subcategory details). Board uses these so counts match Graph 2 / Graph 3. */
const SNAPSHOT_COLLECTIONS: Record<string, string> = {
  eips: "open_pr_snapshots",
  ercs: "open_erc_pr_snapshots",
  rips: "open_rip_pr_snapshots",
};

const GITHUB_REPOS: Record<string, string> = {
  eips: "ethereum/EIPs",
  ercs: "ethereum/ERCs",
  rips: "ethereum/RIPs",
};

const SPEC_TYPES: Record<string, string> = {
  eips: "EIP",
  ercs: "ERC",
  rips: "RIP",
};

export interface BoardRow {
  index: number;
  number: number;
  title: string;
  author: string;
  createdAt: string;
  waitTimeDays: number | null;
  category: string;
  subcategory: string;
  labels: string[];
  prUrl: string;
  specType: string;
}

function deriveCategory(
  repoKey: string,
  labels: string[],
  _state?: string,
  isPrDraft?: boolean
): string {
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

function deriveSubcategory(
  labels: string[],
  _state?: string,
  isPrDraft?: boolean
): string {
  const all = labels.map((l) => (l || "").toLowerCase()).filter(Boolean);
  // Waiting on Editor: same variants as category-subcategory details (match Graph 2)
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

function getWaitTimeDays(pr: {
  waitingSince?: Date | string;
  updatedAt?: Date | string;
  createdAt?: Date | string;
}): number | null {
  const now = Date.now();
  const date =
    pr.waitingSince != null
      ? new Date(pr.waitingSince).getTime()
      : pr.updatedAt != null
        ? new Date(pr.updatedAt).getTime()
        : pr.createdAt != null
          ? new Date(pr.createdAt).getTime()
          : null;
  if (date == null) return null;
  return Math.floor((now - date) / (24 * 60 * 60 * 1000));
}

let client: MongoClient | null = null;

async function getDb() {
  if (!MONGODB_URI) throw new Error("OPENPRS_MONGODB_URI not set");
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawSpec = req.query.spec;
  let spec = (Array.isArray(rawSpec) ? rawSpec[0] : rawSpec)
    ? String(Array.isArray(rawSpec) ? rawSpec[0] : rawSpec).toLowerCase().trim()
    : "";
  // Fallback: some setups don't put [spec] in req.query; derive from path (e.g. /api/boards/eips)
  if (!spec && typeof req.url === "string") {
    const pathMatch = req.url.match(/\/api\/boards\/([^/?]+)/);
    const fromPath = pathMatch?.[1]?.toLowerCase().trim();
    if (fromPath) spec = fromPath;
  }
  const subcategory = typeof req.query.subcategory === "string" ? req.query.subcategory.trim() : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const rawSort = req.query.sort;
  const sort = typeof rawSort === "string" ? rawSort.toLowerCase().trim() : "waitTime";

  const validSpecs = ["eips", "ercs", "rips"];
  if (!spec || !SNAPSHOT_COLLECTIONS[spec]) {
    return res.status(400).json({
      error: "Invalid spec. Use eips, ercs, or rips.",
      allowed: validSpecs,
      received: rawSpec ?? "(missing)",
    });
  }

  if (sort !== "waittime" && sort !== "created") {
    return res.status(400).json({
      error: "Invalid sort. Use waitTime or created.",
      received: rawSort ?? "(missing)",
    });
  }

  try {
    const db = await getDb();
    const snapColl = db.collection(SNAPSHOT_COLLECTIONS[spec]);
    // Current month snapshot — same open PRs as Graph 3 for this month; Board divides by subcategory dropdown.
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const snap = await snapColl.findOne(
      { month: currentMonth },
      { projection: { month: 1, prs: 1 } }
    );
    const prs: any[] = Array.isArray(snap?.prs) ? snap.prs : [];

    const githubRepo = GITHUB_REPOS[spec];
    const specType = SPEC_TYPES[spec];

    let rows: BoardRow[] = prs.map((pr: any) => {
      const labels = pr.customLabels ?? pr.githubLabels ?? [];
      const isPrDraft = !!pr.draft;
      const cat = deriveCategory(spec, labels, pr.state, isPrDraft);
      const sub = deriveSubcategory(labels, pr.state, isPrDraft);
      const waitDays = getWaitTimeDays(pr);
      const prUrl =
        pr.prUrl ||
        (pr.number ? `https://github.com/${githubRepo}/pull/${pr.number}` : "");
      return {
        index: 0,
        number: pr.number ?? 0,
        title: pr.title ?? "",
        author: pr.author ?? "",
        createdAt: pr.createdAt ? new Date(pr.createdAt).toISOString() : "",
        waitTimeDays: waitDays,
        category: cat,
        subcategory: sub,
        labels: [],
        prUrl,
        specType,
      };
    });

    if (subcategory) {
      rows = rows.filter(
        (r) =>
          r.subcategory.toLowerCase() === subcategory.toLowerCase() ||
          (subcategory === "AWAITED" && r.subcategory === "Awaited") ||
          (subcategory === "Uncategorized" && r.subcategory === "Misc")
      );
    }
    if (category) {
      rows = rows.filter(
        (r) =>
          r.category.toLowerCase() === category.toLowerCase() ||
          (category === "New EIP" && r.category === "NEW EIP")
      );
    }

    if (sort === "created") {
      rows.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      rows.sort((a, b) => {
        const ad = a.waitTimeDays ?? -1;
        const bd = b.waitTimeDays ?? -1;
        return bd - ad;
      });
    }

    rows = rows.map((r, i) => ({ ...r, index: i + 1 }));

    return res.status(200).json(rows);
  } catch (err) {
    console.error("[boards]", err);
    return res.status(500).json({
      error: "Failed to fetch board PRs",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
