import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';

if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
    } else {
        // Handle the case where the environment variable is not defined
        console.error('MONGODB_URI environment variable is not defined');
    }
}

const prDetailsSchema = new Schema({
    prNumber: { type: Number },
    prTitle: { type: String },
    prDescription: { type: String },
    labels: { type: [String] },
    conversations: { type: [Object] },
    numConversations: { type: Number },
    participants: { type: [String] },
    numParticipants: { type: Number },
    commits: { type: [Object] },
    numCommits: { type: Number },
    filesChanged: { type: [String] },
    numFilesChanged: { type: Number },
    mergedAt: { type: Date },
    closedAt: { type: Date },
});

// Define separate models for each collection
const EipPrDetails = mongoose.models.alleipsprdetails || mongoose.model('alleipsprdetails', prDetailsSchema);
const ErcPrDetails = mongoose.models.allercsprdetails || mongoose.model('allercsprdetails', prDetailsSchema);
const RipPrDetails = mongoose.models.allripsprdetails || mongoose.model('allripsprdetails', prDetailsSchema);

export default async (req: Request, res: Response) => {
    try {
        // Define the date range (September 7, 2022)
        const startDate = new Date('2022-09-07T00:00:00Z');

        // Retrieve PRs that are closed or merged since September 7, 2022
        const eipPrNumbers = await EipPrDetails.find({
            $or: [
                { closedAt: { $gte: startDate } },
                { mergedAt: { $gte: startDate } }
            ]
        }, { prTitle: 1, prNumber: 1, closedAt: 1, mergedAt: 1, _id: 0 }).lean();

        const ercPrNumbers = await ErcPrDetails.find({
            $or: [
                { closedAt: { $gte: startDate } },
                { mergedAt: { $gte: startDate } }
            ]
        }, { prTitle: 1, prNumber: 1, closedAt: 1, mergedAt: 1, _id: 0 }).lean();

        const ripPrNumbers = await RipPrDetails.find({
            $or: [
                { closedAt: { $gte: startDate } },
                { mergedAt: { $gte: startDate } }
            ]
        }, { prTitle: 1, prNumber: 1, closedAt: 1, mergedAt: 1, _id: 0 }).lean();

        // Add repository information to each PR number
        const formattedPrNumbers = [
            ...eipPrNumbers?.map(pr => ({ prNumber: pr.prNumber, prTitle: pr.prTitle, closedAt: pr.closedAt, mergedAt: pr.mergedAt, repo: 'EIPs' })),
            ...ercPrNumbers?.map(pr => ({ prNumber: pr.prNumber, prTitle: pr.prTitle, closedAt: pr.closedAt, mergedAt: pr.mergedAt, repo: 'ERCs' })),
            ...ripPrNumbers?.map(pr => ({ prNumber: pr.prNumber, prTitle: pr.prTitle, closedAt: pr.closedAt, mergedAt: pr.mergedAt, repo: 'RIPs' })),
        ];

        // Send the consolidated list as a JSON response
        res.json(formattedPrNumbers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
