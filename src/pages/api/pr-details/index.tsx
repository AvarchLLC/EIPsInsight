import mongoose, { Schema, Connection } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface SnapshotPR {
  prId: number;
  number: number;
  title: string;
  githubLabels?: string[];
  customLabels?: string[];
  state?: string;
  author?: string;
  createdAt?: Date;
  closedAt?: Date;
}

interface SnapshotDoc {
  snapshotDate: string;
  month: string;
  prs: SnapshotPR[];
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

function formatMonthLabel(monthYear: string): string {
  const [year, month] = monthYear.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongodbUri = process.env.OPENPRS_MONGODB_URI!;
  const dbName = typeof req.query.db === "string"
    ? req.query.db
    : process.env.OPENPRS_DATABASE || "test";

  // Determine repo type and config
  const repoParam = (req.query.repo as string) || "eip";
  let repoKind: "eip" | "erc" | "rip" = "eip";
  if (repoParam === "erc") repoKind = "erc";
  else if (repoParam === "rip") repoKind = "rip";

  const collection =
    repoKind === "erc" ? "open_erc_pr_snapshots" :
    repoKind === "rip" ? "open_rip_pr_snapshots" :
    "open_pr_snapshots";

  const repoLabel =
    repoKind === "erc" ? "ERC PRs" :
    repoKind === "rip" ? "RIP PRs" :
    "EIP PRs";

  const prGithubRepo =
    repoKind === "erc" ? "ethereum/ERCs" :
    repoKind === "rip" ? "ethereum/RIPs" :
    "ethereum/EIPs";

  const schema = new Schema<SnapshotDoc>({ snapshotDate: String, month: String, prs: [{}] }, { strict: false });

  const outputMode = req.query.mode === "aggregate" ? "aggregate" : "detail";
  const month = typeof req.query.month === "string" ? req.query.month : "";
  const labelType = req.query.labelType === "githubLabels" ? "githubLabels" : "customLabels";
  const label = typeof req.query.label === "string" ? req.query.label : "";

  let conn: Connection | null = null;
  try {
    conn = await getDbConn({ uri: mongodbUri, dbName });
    const Snap = conn.model<SnapshotDoc>("Snap", schema, collection);

    const matchMonth = month ? { month } : {};
    const snapshots = await Snap.find(matchMonth)
      .read("primary")
      .readConcern("majority")
      .sort({ month: 1 })
      .lean();

    if (outputMode === "detail") {
      const prRows = snapshots.flatMap((snap) =>
        (snap.prs ?? []).filter((pr) => {
          const labels = labelType === "customLabels" ? pr.customLabels ?? [] : pr.githubLabels ?? [];
          return !label || labels.includes(label);
        }).map((pr) => {
          const labels = labelType === "customLabels" ? pr.customLabels ?? [] : pr.githubLabels ?? [];
          const p = pr as any;
          return {
            MonthKey: snap.month,
            Month: formatMonthLabel(snap.month),
            Label: label || labels[0] || "Misc",
            LabelType: labelType,
            Repo: repoLabel,
            PRNumber: pr.number,
            PRId: pr.prId,
            PRLink: `https://github.com/${prGithubRepo}/pull/${pr.number}`,
            Author: pr.author || "",
            Title: pr.title || "",
            Labels: labels.join("; "),
            State: pr.state || "",
            Draft: !!p.draft,
            CreatedAt: pr.createdAt,
            ClosedAt: pr.closedAt,
            Category: p.category ?? undefined,
            Subcategory: p.subcategory ?? undefined,
          };
        })
      );
      await conn.close();
      return res.status(200).json(prRows);
    }

    // --- Aggregation ---
    const rows = snapshots.flatMap((snap) => {
      const labelToPrs: Record<string, number[]> = {};
      for (const pr of snap.prs ?? []) {
        const labels = labelType === "customLabels" ? pr.customLabels ?? [] : pr.githubLabels ?? [];
        let assigned = "Misc";
        if (repoKind === "erc") {
          if (labels.includes("Typo Fix")) assigned = "Typo Fix";
          else if (labels.includes("Status Change")) assigned = "Status Change";
          else if (labels.includes("ERC Update")) assigned = "ERC Update";
          else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
          else if (labels.includes("New ERC")) assigned = "New ERC";
        } else if (repoKind === "rip") {
          if (labels.includes("Typo Fix")) assigned = "Typo Fix";
          else if (labels.includes("Update")) assigned = "Update";
          else if (labels.includes("New RIP")) assigned = "New RIP";
          else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
          // Add/modify more label rules for RIPs as needed!
        } else {
          if (labels.includes("Typo Fix")) assigned = "Typo Fix";
          else if (labels.includes("Status Change")) assigned = "Status Change";
          else if (labels.includes("EIP Update")) assigned = "EIP Update";
          else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
          else if (labels.includes("New EIP")) assigned = "New EIP";
        }
        if (!labelToPrs[assigned]) labelToPrs[assigned] = [];
        labelToPrs[assigned].push(pr.number);
      }
      return Object.entries(labelToPrs).map(([lbl, prNumbers]) => ({
        monthYear: snap.month,
        label: lbl,
        count: prNumbers.length,
        labelType,
        prNumbers,
      }));
    });

    await conn.close();
    res.status(200).json(rows);

  } catch (error) {
    if (conn) try { await conn.close(); } catch {}
    console.error("[pr-analytics API ERROR]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
