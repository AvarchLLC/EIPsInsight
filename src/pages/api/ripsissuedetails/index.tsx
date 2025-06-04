import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Connect to the MongoDB database
if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
      } else {
        // Handle the case where the environment variable is not defined
        console.error('MONGODB_URI environment variable is not defined');
      }
}

// Define the Issue schema
const IssueDetailsSchema = new mongoose.Schema({
    issueNumber: { type: Number, required: true, unique: true },
    issueTitle: { type: String, required: true },
    issueDescription: { type: String },
    labels: { type: [String] },
    conversations: { type: [Object] },
    numConversations: { type: Number, default: 0 },
    participants: { type: [String] },
    numParticipants: { type: Number, default: 0 },
    state: { type: String, required: true },
    createdAt: { type: Date, required: true },
    closedAt: { type: Date },
    updatedAt: { type: Date, required: true },
    author: { type: String, required: true },
});

// Check if the model exists or create it
const IssueDetails = mongoose.models.AllRipsIssueDetails || mongoose.model('AllRipsIssueDetails', IssueDetailsSchema);

export default async (req: Request, res: Response) => {
    try {
        // Fetch Issue details with selected fields
        const issueDetails = await IssueDetails.find({}).select('issueNumber issueTitle createdAt closedAt state').exec();
        
        // Transform the data to include createdAt, closedAt, and state
        const transformedDetails = issueDetails?.map((issue: any) => {
            const created_at = issue.createdAt;
            const closed_at = issue.closedAt;
            const state = issue.state;

            return {
                repo:'RIPs',
                IssueNumber: issue.issueNumber,
                IssueTitle: issue.issueTitle,
                created_at,
                closed_at,
                state,
            };
        });
        
        // Log the transformed details
        // console.log(transformedDetails);
        
        // Return the Issue details as JSON response
        res.json(transformedDetails);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};