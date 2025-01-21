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
    mergeDate: { type: Date },
});

// Define separate models for each collection
const EipPrDetails = mongoose.models.alleipsprdetails || mongoose.model('alleipsprdetails', prDetailsSchema);
const ErcPrDetails = mongoose.models.allercsprdetails || mongoose.model('allercsprdetails', prDetailsSchema);
const RipPrDetails = mongoose.models.allripsprdetails || mongoose.model('allripsprdetails', prDetailsSchema);


export default async (req: Request, res: Response) => {
    try {
        // Retrieve unique PR numbers from each collection with repository information
        const eipPrNumbers = await EipPrDetails.find({}, { prTitle: 1, prNumber: 1, _id: 0 }).lean();
        const ercPrNumbers = await ErcPrDetails.find({}, { prTitle: 1, prNumber: 1, _id: 0 }).lean();
        const ripPrNumbers = await RipPrDetails.find({}, { prTitle: 1, prNumber: 1, _id: 0 }).lean();

        // Add repository information to each PR number
        const formattedPrNumbers = [
            ...eipPrNumbers.map(pr => ({ prNumber: pr.prNumber, prTitle:pr.prTitle, repo: 'EIPs' })),
            ...ercPrNumbers.map(pr => ({ prNumber: pr.prNumber, prTitle:pr.prTitle, repo: 'ERCs' })),
            ...ripPrNumbers.map(pr => ({ prNumber: pr.prNumber, prTitle:pr.prTitle, repo: 'RIPs' })),
        ];

        // Send the consolidated list as a JSON response
        res.json(formattedPrNumbers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
