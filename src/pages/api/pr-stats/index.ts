import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

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
  // ...other fields as needed
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

    // Find all monthly snapshots, sorted
    const snapshots: SnapshotDoc[] = await Snap.find({}).sort({ month: 1 }).lean();

    type Row = {
      monthYear: string;
      label: string;
      count: number;
      labelType: string;
      prNumbers: number[];
    };

    const rows: Row[] = [];

    for (const snap of snapshots) {
      const month = snap.month;

      // Instead of just label -> count, use label -> array-of-pr-numbers
      const labelToPrs: Record<string, number[]> = {};

      for (const pr of snap.prs ?? []) {
        const labels: string[] = labelType === "customLabels"
          ? pr.customLabels ?? []
          : pr.githubLabels ?? [];

        // Priority assignment (match backend and frontend)
        let assigned = "Misc";
        if (labels.includes("Typo Fix")) assigned = "Typo Fix";
        else if (labels.includes("Status Change")) assigned = "Status Change";
        else if (labels.includes("EIP Update")) assigned = "EIP Update";
        else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
        else if (labels.includes("New EIP")) assigned = "New EIP";
        // ...more if needed

        if (!labelToPrs[assigned]) labelToPrs[assigned] = [];
        labelToPrs[assigned].push(pr.number); // or pr.prId if that is what you want!
      }

      for (const [label, prNumbers] of Object.entries(labelToPrs)) {
        rows.push({
          monthYear: month,
          label,
          count: prNumbers.length,
          labelType: labelType as string,
          prNumbers,
        });
      }
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
