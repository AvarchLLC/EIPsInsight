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
    conversations: { type: Array }, // Contains review details and conversations
    numConversations: { type: Number },
    participants: [String], // GitHub handles of participants/reviewers
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
const PrDetails = mongoose.models.AllEipsPrDetails || mongoose.model('AllEipsPrDetails', prDetailsSchema);

export default async (req: Request, res: Response) => {
    try {
        // GitHub handles to filter by
        const githubHandles = ["axic", "gcolvin", "lightclient", "SamWilsn", "xinbenlv", "g11tech"];

        // Create an object to store the results for each reviewer
        const resultByReviewer: { [key: string]: any[] } = {};

        // Initialize the result object with empty arrays for each reviewer
        githubHandles.forEach(handle => {
            resultByReviewer[handle] = [];
        });

        // Efficient MongoDB query
        const prDetails = await PrDetails.aggregate([
            { $match: { participants: { $in: githubHandles } } },  // Filter by participants first
            { $unwind: "$conversations" },  // Unwind the conversations array
            { $match: { "conversations.user.login": { $in: githubHandles } } }, // Filter based on reviewerLogin after unwind
            {
                $project: {
                    prNumber: 1,
                    prTitle: 1,
                    created_at: "$createdAt",
                    closed_at: "$closedAt",
                    merged_at: "$mergedAt",
                    reviewDate: "$conversations.created_at",
                    conversation: "$conversations.body",
                    reviewerLogin: "$conversations.user.login"
                }
            }
        ]);

        // Group PR details by reviewer
        prDetails.forEach((pr: any) => {
            const { reviewerLogin, prNumber, prTitle, created_at, closed_at, merged_at, reviewDate, conversation } = pr;

            // Add review details to the respective reviewer
            resultByReviewer[reviewerLogin].push({
                prNumber,
                prTitle,
                created_at,
                closed_at,
                merged_at,
                reviewDate,
                conversation
            });
        });

        // Log the grouped details by reviewer
        console.log(resultByReviewer);

        // Return the PR details grouped by each reviewer as JSON response
        res.json(resultByReviewer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
