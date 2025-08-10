// models/Snap.ts
import mongoose, { Schema, Model } from "mongoose";

export interface SnapshotPR {
  prId: number;
  number: number;
  title: string;
  githubLabels?: string[];
  customLabels?: string[];
  state?: string;
  createdAt?: Date;
  closedAt?: Date;
}

export interface SnapshotDoc {
  snapshotDate: string;
  month: string;
  prs: SnapshotPR[];
}

const snapshotSchema = new Schema<SnapshotDoc>(
  {
    snapshotDate: String,
    month: String,
    prs: [{}],
  },
  { collection: "open_pr_snapshots", strict: false }
);

// ✅ Prevent model overwrite on HMR
export const Snap: Model<SnapshotDoc> =
  mongoose.models.Snap || mongoose.model<SnapshotDoc>("Snap", snapshotSchema);
