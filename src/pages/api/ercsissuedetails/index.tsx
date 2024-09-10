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

// Schema for issue details
const IssueDetailsSchema = new mongoose.Schema({
    issueNumber: { type: Number, required: true, unique: true },
    issueTitle: { type: String, required: true },
    issueDescription: { type: String },
    labels: [String],
    conversations: [Object],
    numConversations: { type: Number, default: 0 },
    participants: [String],
    numParticipants: { type: Number, default: 0 },
    state: { type: String, required: true },
    createdAt: { type: Date, required: true },
    closedAt: { type: Date },
    updatedAt: { type: Date, required: true },
    author: { type: String, required: true },
});

// Ensure the model is not recreated if it already exists
const IssueDetails = mongoose.models.AllErcsIssueDetails || mongoose.model('AllErcsIssueDetails', IssueDetailsSchema);

export default async (req: Request, res: Response) => {
    try {
        // Fetch only the required fields for performance optimization
        const details = await IssueDetails.find({}).select('issueNumber issueTitle createdAt closedAt state').exec();
        
        // Transform the data to match the desired structure
        const transformedDetails = details.map((issue: any) => {
            const { issueNumber, issueTitle, createdAt: created_at, closedAt: closed_at, state } = issue;

            return {
                issueNumber,
                issueTitle,
                created_at,
                closed_at,
                state,
                // Include other fields as needed
            };
        });

        // Log the transformed details
        console.log(transformedDetails);

        // Return the issue details as a JSON response
        res.json(transformedDetails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
