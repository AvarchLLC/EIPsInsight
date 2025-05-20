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

const IssueDetailsSchema = new Schema({
    issueNumber: { type: Number },
    issueTitle: { type: String },
    IssueDescription: { type: String },
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
const EipIssueDetails = mongoose.models.alleipsissuedetails || mongoose.model('alleipsissuedetails', IssueDetailsSchema);
const ErcIssueDetails = mongoose.models.allercsissuedetails || mongoose.model('allercsissuedetails', IssueDetailsSchema);
const RipIssueDetails = mongoose.models.allripsissuedetails || mongoose.model('allripsissuedetails', IssueDetailsSchema);


export default async (req: Request, res: Response) => {
    try {
        // Retrieve unique Issue numbers from each collection with repository information
        const eipIssueNumbers = await EipIssueDetails.find({}, { issueTitle: 1, issueNumber: 1, _id: 0 }).lean();
        const ercIssueNumbers = await ErcIssueDetails.find({}, { issueTitle: 1, issueNumber: 1, _id: 0 }).lean();
        const ripIssueNumbers = await RipIssueDetails.find({}, { issueTitle: 1, issueNumber: 1, _id: 0 }).lean();

        // Add repository information to each Issue number
        const formattedIssueNumbers = [
            ...eipIssueNumbers?.map(Issue => ({ issueNumber: Issue.issueNumber, issueTitle:Issue.issueTitle, repo: 'EIPs' })),
            ...ercIssueNumbers?.map(Issue => ({ issueNumber: Issue.issueNumber, issueTitle:Issue.issueTitle, repo: 'ERCs' })),
            ...ripIssueNumbers?.map(Issue => ({ issueNumber: Issue.issueNumber, issueTitle:Issue.issueTitle, repo: 'RIPs' })),
        ];

        // Send the consolidated list as a JSON response
        res.json(formattedIssueNumbers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
