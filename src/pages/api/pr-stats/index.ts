import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

// -- Snapshot model setup

const snapshotSchema = new mongoose.Schema({
  snapshotDate: String,        // "YYYY-MM-DD"
  month: String,               // "YYYY-MM"
  prs: [mongoose.Schema.Types.Mixed] // Array of PRs for this month-end
}, { collection: "open_pr_snapshots", strict: false }); // strict: false for flexibility

const Snap =
  mongoose.models.Snap || mongoose.model("Snap", snapshotSchema, "open_pr_snapshots");

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.OPENPRS_MONGODB_URI) throw new Error("Define OPENPRS_MONGODB_URI");
  if (!process.env.OPENPRS_DATABASE) throw new Error("Define OPENPRS_DATABASE");
  await mongoose.connect(process.env.OPENPRS_MONGODB_URI, {
    dbName: process.env.OPENPRS_DATABASE,
  });
}

// --- API handler ---

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    // Optionally allow filtering by labelType (customLabels or githubLabels)
    // ?labelType=customLabels  (or githubLabels)
    const { labelType = "customLabels" } = req.query;

    // Pull all monthly snapshots, sorted chronologically (fill gaps in frontend if needed)
    const snapshots = await Snap.find({}).sort({ month: 1 }).lean();

    // Aggregate across all snapshots/months:
    // For each (month, label), count number of PRs with that label in their customLabels or githubLabels array.

    const rows = [];

// In your API handler, pseudocode...
for (const snap of snapshots) {
  const month = snap.month;
  const labelCounts = {};

  for (const pr of snap.prs) {
    const labels = pr.customLabels ?? [];
    // Pick highest-priority label
    let assigned = "Misc";
    if (labels.includes("Typo Fix")) assigned = "Typo Fix";
    else if (labels.includes("Status Change")) assigned = "Status Change";
    else if (labels.includes("EIP Update")) assigned = "EIP Update";
    else if (labels.includes("Created By Bot")) assigned = "Created By Bot";
    else if (labels.includes("New EIP")) assigned = "New EIP";
    // ... priority order, then fallback to "Misc"

    labelCounts[assigned] = (labelCounts[assigned] || 0) + 1;
  }

  for (const [label, count] of Object.entries(labelCounts)) {
    rows.push({ monthYear: month, label, count, labelType: "customLabels" });
  }
}


    res.status(200).json(rows);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
