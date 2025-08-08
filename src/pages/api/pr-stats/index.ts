import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Document } from "mongoose";

// -- Snapshot model setup

interface SnapshotPR {
  prId: number;
  number: number;
  title: string;
  githubLabels?: string[];
  customLabels?: string[];
  state?: string;
  createdAt?: Date;
  closedAt?: Date;
  // ...add other fields as needed
}

interface SnapshotDoc {
  snapshotDate: string;
  month: string;
  prs: SnapshotPR[];
}

const snapshotSchema = new mongoose.Schema({
  snapshotDate: String,
  month: String,
  prs: [{}] // or [mongoose.Schema.Types.Mixed]
}, { collection: "open_pr_snapshots", strict: false });

const Snap = mongoose.models.Snap || mongoose.model("Snap", snapshotSchema, "open_pr_snapshots");

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.OPENPRS_MONGODB_URI) throw new Error("Define OPENPRS_MONGODB_URI");
  if (!process.env.OPENPRS_DATABASE) throw new Error("Define OPENPRS_DATABASE");
  await mongoose.connect(process.env.OPENPRS_MONGODB_URI, {
    dbName: process.env.OPENPRS_DATABASE,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    // ?labelType=customLabels  (or githubLabels)
    const { labelType = "customLabels" } = req.query;

    // Pull all monthly snapshots, sorted chronologically
    const snapshots: SnapshotDoc[] = await Snap.find({}).sort({ month: 1 }).lean();

    const rows: {
      monthYear: string;
      label: string;
      count: number;
      labelType: string;
    }[] = [];

    for (const snap of snapshots) {
      const month = snap.month;
      const labelCounts: Record<string, number> = {};

      for (const pr of snap.prs ?? []) {
        // Ensure type safety/defaults
        const labels: string[] = labelType === "customLabels"
          ? pr.customLabels ?? []
          : pr.githubLabels ?? [];

        // Priority order
        let assigned = "Misc";
        if (labels.includes("Typo Fix")) assigned = "Typo Fix";
        else if (labels.includes("Status Change")) assigned = "Status Change";
        else if (labels.includes("EIP Update")) assigned = "EIP Update";
        else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
        else if (labels.includes("New EIP")) assigned = "New EIP";
        // ... add more if needed

        labelCounts[assigned] = (labelCounts[assigned] || 0) + 1;
      }

      for (const [label, count] of Object.entries(labelCounts)) {
        rows.push({ monthYear: month, label, count, labelType: labelType as string });
      }
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
