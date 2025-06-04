import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
      } else {
        // Handle the case where the environment variable is not defined
        console.error('MONGODB_URI environment variable is not defined');
      }
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

// Check if the model already exists
const PrDetails = mongoose.models.AllRipsPrDetails || mongoose.model('AllRipsPrDetails', prDetailsSchema);

export default async (req: Request, res: Response) => {
    try {
        // Fetch only the required fields for performance optimization
        const prDetails = await PrDetails.find({}).select('prNumber prTitle createdAt closedAt mergedAt').exec();

        // Transform the data to include createdAt, closedAt, and mergedAt
        const transformedDetails = prDetails?.map((pr: any) => {
            const { prNumber, prTitle, labels,createdAt: created_at, closedAt: closed_at, mergedAt: merged_at } = pr;

            return {
                repo:'RIPs',
                prNumber,
                prTitle,
                labels,
                created_at,
                closed_at,
                merged_at
                // Include other fields as needed
            };
        });

        // Log the transformed details
        // console.log(transformedDetails);

        // Return the PR details as a JSON response
        res.json(transformedDetails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};