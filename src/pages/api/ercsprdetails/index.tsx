import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connected to the database');
        })
        .catch((error: any) => {
            console.error('Error connecting to the database:', error.message);
        });
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
const PrDetails = mongoose.models.AllErcsPrDetails || mongoose.model('AllErcsPrDetails', prDetailsSchema);

export default async (req: Request, res: Response) => {
    try {
        // Fetch only the required fields for performance optimization
        const prDetails = await PrDetails.find({}).select('prNumber prTitle createdAt closedAt mergedAt').exec();

        // Transform the data to include createdAt, closedAt, and mergedAt
        const transformedDetails = prDetails.map((pr: any) => {
            const { prNumber, prTitle, createdAt: created_at, closedAt: closed_at, mergedAt: merged_at } = pr;

            return {
                prNumber,
                prTitle,
                created_at,
                closed_at,
                merged_at
                // Include other fields as needed
            };
        });

        // Log the transformed details
        console.log(transformedDetails);

        // Return the PR details as a JSON response
        res.json(transformedDetails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
