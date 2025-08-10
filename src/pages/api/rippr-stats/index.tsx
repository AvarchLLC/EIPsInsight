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

  // For RIPs
  const repoKind = "rip";
  const collection = "open_rip_pr_snapshots";

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

        // RIP-specific label assignment (customize as needed)
        let assigned: string = "Misc";
        if (labels.includes("Typo Fix")) assigned = "Typo Fix";
        else if (labels.includes("Update")) assigned = "Update";
        else if (labels.includes("New RIP")) assigned = "New RIP";
        else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
        // Add/adjust more label priorities if desired!

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
