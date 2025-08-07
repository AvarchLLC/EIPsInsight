import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Schema, model, models } from 'mongoose';

// Interface representing a PR document
interface PrDocument {
  prId: number;
  number: number;
  title: string;
  author: string;
  prUrl: string;
  customLabels: string[];
  githubLabels: string[];
  state: string;
  mergeable_state?: string | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date | null;
  mergedAt?: Date | null;
  specType: string;
}

// Mongoose schema and model
const prSchema = new Schema<PrDocument>({
  prId: { type: Number, required: true },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  prUrl: { type: String, required: true },
  customLabels: { type: [String], required: true },
  githubLabels: { type: [String], required: true },
  state: { type: String, required: true },
  mergeable_state: { type: String, required: false, default: null },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  closedAt: { type: Date, required: false, default: null },
  mergedAt: { type: Date, required: false, default: null },
  specType: { type: String, required: true },
});

// Adjust collection name accordingly (e.g., 'ercprs' for ERC repo)
const PrModel = models.Pr || model<PrDocument>('Pr', prSchema, 'ercprs');

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.OPENPRS_MONGODB_URI) {
    throw new Error('Please define the OPENPRS_MONGODB_URI environment variable');
  }

  if (!process.env.OPENPRS_DATABASE) {
    throw new Error('Please define the OPENPRS_DATABASE environment variable');
  }

  await mongoose.connect(process.env.OPENPRS_MONGODB_URI!, {
    dbName: process.env.OPENPRS_DATABASE,
  });
}

// API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    // Aggregate counts by month-year and label for both customLabels and githubLabels
    const stats = await PrModel.aggregate([
      {
        $project: {
          monthYear: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          customLabels: 1,
          githubLabels: 1,
        },
      },
      {
        $facet: {
          custom: [
            { $unwind: "$customLabels" },
            {
              $group: {
                _id: { monthYear: "$monthYear", label: "$customLabels" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                monthYear: "$_id.monthYear",
                label: "$_id.label",
                count: 1,
                labelType: { $literal: "customLabels" },
              },
            },
          ],
          github: [
            { $unwind: "$githubLabels" },
            {
              $group: {
                _id: { monthYear: "$monthYear", label: "$githubLabels" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                monthYear: "$_id.monthYear",
                label: "$_id.label",
                count: 1,
                labelType: { $literal: "githubLabels" },
              },
            },
          ],
        },
      },
      {
        $project: {
          combinedLabels: { $concatArrays: ["$custom", "$github"] },
        },
      },
      { $unwind: "$combinedLabels" },
      { $replaceRoot: { newRoot: "$combinedLabels" } },
      { $sort: { monthYear: 1, labelType: 1, label: 1 } },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
