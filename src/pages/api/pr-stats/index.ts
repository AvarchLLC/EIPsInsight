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
}

interface SnapshotDoc {
  snapshotDate: string;
  month: string;
  prs: SnapshotPR[];
}

const snapshotSchema = new mongoose.Schema({
  snapshotDate: String,
  month: String,
  prs: [{}]
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
    console.log("[API] /api/pr-stats called at", new Date().toISOString());
    await connectToDatabase();
    console.log("[API] Connected to MongoDB. ReadyState:", mongoose.connection.readyState);

    // ?labelType=customLabels  (or githubLabels)
    const { labelType = "customLabels" } = req.query;
    console.log("[API] labelType param is:", labelType);

    // Count and quick peek at docs
    const collectionCount = await Snap.countDocuments();
    console.log(`[API] Snapshots in collection: ${collectionCount}`);

    // Find all monthly snapshots, sorted
    const snapshots: SnapshotDoc[] = await Snap.find({}).sort({ month: 1 }).lean();
    console.log(`[API] Fetched ${snapshots.length} snapshot docs`);

    console.log("[API] DB Name:", mongoose.connection.name);


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
      const labelToPrs: Record<string, number[]> = {};

      for (const pr of snap.prs ?? []) {
        const labels: string[] = labelType === "customLabels"
          ? pr.customLabels ?? []
          : pr.githubLabels ?? [];

        let assigned = "Misc";
        if (labels.includes("Typo Fix")) assigned = "Typo Fix";
        else if (labels.includes("Status Change")) assigned = "Status Change";
        else if (labels.includes("EIP Update")) assigned = "EIP Update";
        else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
        else if (labels.includes("New EIP")) assigned = "New EIP";
        // ...can add more here as needed

        if (!labelToPrs[assigned]) labelToPrs[assigned] = [];
        labelToPrs[assigned].push(pr.number);
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

    console.log(`[API] Returning ${rows.length} rows`);
    if (rows.length === 0) {
      console.warn("[API] No label analytic data found for requested type. Is the snapshot collection empty?");
    }
    res.status(200).json(rows);

  } catch (error) {
    console.error("[API ERROR]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
