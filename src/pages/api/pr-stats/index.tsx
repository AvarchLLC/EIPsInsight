import mongoose, { Schema, Connection, Document } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface Pr {
  number: number;
  customLabels?: string[];
  githubLabels?: string[];
}

interface SnapDoc extends Document {
  month: string;
  prs?: Pr[];
}

interface Row {
  monthYear: string;
  label: string;
  count: number;
  labelType: string;
  prNumbers: number[];
}

const labelGroupMap: { [key: string]: string } = {
  "a-review":      "Author Review",
  "e-review":      "Editor Review",
  "discuss":       "Discuss",
  "on-hold":       "On Hold",
  "final-call":    "Final Call",
  "s-draft":       "Draft",
  "s-final":       "Final",
  "s-review":      "Review",
  "s-stagnant":    "Stagnant",
  "s-withdrawn":   "Withdrawn",
  "s-lastcall":    "Last Call",
  "c-new":         "New",
  "c-update":      "Update",
  "c-status":      "Status Change",
  "bug":           "Bug",
  "enhancement":   "Enhancement",
  "question":      "Question",
  "dependencies":  "Dependencies",
  "r-website":     "Website",
  "r-process":     "Process",
  "r-other":       "Other Resource",
  "r-eips":        "EIPs Resource",
  "r-ci":          "CI Resource",
  "created-by-bot":"Bot",
  "1272989785":    "Bot",
  "javascript":    "JavaScript",
  "ruby":          "Ruby",
  "discussions-to":"Discussions"
  // Add more as needed
};


async function getDbConn({ uri, dbName }: { uri: string; dbName: string }): Promise<Connection> {
  const conn = mongoose.createConnection(uri, {
    dbName,
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
  const mongodbUri = process.env.OPENPRS_MONGODB_URI!;
  const dbName = typeof req.query.db === "string"
    ? req.query.db
    : process.env.OPENPRS_DATABASE || "test";

  // Decide which repo we are querying
  const repoKind = "eip"
  const collection = "open_pr_snapshots";

  // Handle label type
  const rawLabelType: string | undefined = Array.isArray(req.query.labelType)
    ? req.query.labelType[0]
    : req.query.labelType;
  const effectiveLabelType: "githubLabels" | "customLabels" =
    rawLabelType === "githubLabels" ? "githubLabels" : "customLabels";

  let conn: Connection | null = null;

  try {
    conn = await getDbConn({ uri: mongodbUri, dbName });

    const schema = new Schema<SnapDoc>(
      { month: String, prs: [{}] },
      { strict: false }
    );
    const Snap = conn.model<SnapDoc>("Snap", schema, collection);

    const snapshots: SnapDoc[] = await Snap.find({})
      .read("primary")
      .readConcern("majority")
      .sort({ month: 1 })
      .lean();

    console.log(`Repo: ${repoKind}, Snapshots found: ${snapshots.length}`);

    const rows: Row[] = [];

    for (const snap of snapshots) {
      const labelToPrs: Record<string, number[]> = {};

      for (const pr of snap.prs ?? []) {
const labels: string[] =
  effectiveLabelType === "customLabels"
    ? pr.customLabels ?? []
    : pr.githubLabels ?? [];

let assigned: string;

if (effectiveLabelType === "customLabels") {
  assigned = "Misc";
  if (labels.includes("Typo Fix")) assigned = "Typo Fix";
  else if (labels.includes("Status Change")) assigned = "Status Change";
  else if (labels.includes("EIP Update")) assigned = "EIP Update";
  else if (labels.includes("ERC Update")) assigned = "ERC Update";
  else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
  else if (labels.includes("New EIP")) assigned = "New EIP";
  else if (labels.includes("New ERC")) assigned = "New ERC";
} else {
  // githubLabels: map workflow labels to grouped categories
  const lowerLabels = labels.map((l) => l?.toLowerCase?.() ?? "");
  assigned = "Other Labels";
  for (const lbl of lowerLabels) {
      assigned = lbl;
      break; // Pick the first matching group, or continue if you want multi-group
  }
  // assigned is the group/category, e.g., "Editor Review", "Bug", etc.
}

if (!labelToPrs[assigned]) labelToPrs[assigned] = [];
labelToPrs[assigned].push(pr.number);
      }

      for (const [label, prNumbers] of Object.entries(labelToPrs)) {
        rows.push({
          monthYear: snap.month,
          label,
          count: prNumbers.length,
          labelType: effectiveLabelType,
          prNumbers,
        });
      }
    }

    await conn.close();
    res.status(200).json(rows);
  } catch (err: any) {
    if (conn) try { await conn.close(); } catch {}
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message });
  }
}
