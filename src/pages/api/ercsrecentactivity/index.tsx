import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
  if (typeof process.env.MONGODB_URI === 'string') {
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    console.error('MONGODB_URI environment variable is not defined');
  }
}

interface PR {
  prNumber: number;
  prTitle: string;
  createdAt: Date;
  closedAt?: Date | null;
  mergedAt?: Date | null;
  recentDate: Date;
}

const prDetailsSchema = new mongoose.Schema({
  prNumber: { type: Number, required: true },
  prTitle: { type: String, required: true },
  prDescription: { type: String },
  labels: [String],
  conversations: { type: Array },
  numConversations: { type: Number },
  participants: [String],
  numParticipants: { type: Number },
  commits: { type: Array },
  numCommits: { type: Number },
  filesChanged: [String],
  numFilesChanged: { type: Number },
  mergeDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  mergedAt: { type: Date }
});

const PrDetails = mongoose.models.AllErcsPrDetails || mongoose.model('AllErcsPrDetails', prDetailsSchema);

export default async (req: Request, res: Response) => {
  try {
    // Fetch only required fields
    const prDetails = await PrDetails.find({
      $or: [
        { closedAt: { $ne: null } },
        { mergedAt: { $ne: null } }
      ]
    })
    .select('prNumber prTitle createdAt closedAt mergedAt')
    .lean();

    // Sort by most recent of mergedAt or closedAt
    const sortedPRs: PR[] = (prDetails as any[])
  .map(pr => {
    const recentDate = pr.mergedAt && pr.closedAt
      ? (new Date(pr.mergedAt) > new Date(pr.closedAt) ? pr.mergedAt : pr.closedAt)
      : pr.mergedAt || pr.closedAt;

    return {
      ...pr,
      recentDate,
    } as PR;
  })
  .sort((a, b) => new Date(b.recentDate).getTime() - new Date(a.recentDate).getTime())
  .slice(0, 30);

    // Transform the data
    const transformed = sortedPRs.map(pr => ({
      repo: 'ERCs',
      prNumber: pr.prNumber,
      prTitle: pr.prTitle,
      created_at: pr.createdAt,
      closed_at: pr.closedAt || null,
      merged_at: pr.mergedAt || null,
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
