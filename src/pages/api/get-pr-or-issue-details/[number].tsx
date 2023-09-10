import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";

const mongoose = require('mongoose');
import axios from 'axios';

const accessToken = process.env.ACCESS_TOKEN;
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

    const prDetailsSchema = new mongoose.Schema({
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
    
    const PrDetails = mongoose.models.PrDetails ||  mongoose.model('PrDetails', prDetailsSchema);


export default async (req: Request, res: Response) => {
    const parts = req.url.split("/");
    const number = parseInt(parts[3]);

    try {

        // Check if an Issue with the given number exists
        const issueResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/issues/${number}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (issueResponse.status === 200) {
            // Issue exists, process and return Issue details
            const issueDetails = await processIssueDetails(issueResponse.data);
            res.json(issueDetails);
        } else {
            // Neither PR nor Issue exists
            res.status(404).json({ error: 'PR or Issue not found' });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


// Process Issue details
const processIssueDetails = async (issueData: any) => {
    try {
        const comments = await fetchComments(issueData.number);
        const assignees = issueData.assignees.map((assignee:any) => assignee.login);
        const labels = issueData.labels.map((label:any) => label.name);
        const milestones = issueData.milestone ? [issueData.milestone.title] : [];
        const participants = getParticipantsFromComments(comments);

        const issueDetails = {
            issueNumber: issueData.number,
            issueTitle: issueData.title,
            issueDescription: issueData.body,
            comments,
            numComments: comments.length,
            assignees,
            labels,
            milestones,
            participants,
        };

        return issueDetails;
    } catch (error :any) {
        console.log('Error processing Issue:', error.message);
        throw error;
    }
};


// Process Issue details

// Fetch comments for an issue
const fetchComments = async (number: any) => {
    try {
        const commentsResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/issues/${number}/comments`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const comments = commentsResponse.data;
        return comments;
    } catch (error:any) {
        console.log('Error fetching comments:', error.message);
        throw error;
    }
};



// Process PR details
const processPRDetails = async (prData : any ) => {
    try {
        const labels = prData.labels.map((label : any) => label.name);
        const conversations = await fetchConversations(prData.number);
        const participants = getParticipants(conversations);
        const commits = await fetchCommits(prData.number);
        const files = await fetchFilesChanged(prData.number);
        const mergeDate = prData.merged_at ? new Date(prData.merged_at) : null;

        const newPrDetails = new PrDetails({
            prNumber: prData.number,
            prTitle: prData.title,
            prDescription: prData.body,
            labels,
            conversations,
            numConversations: conversations.length,
            participants,
            numParticipants: participants.size,
            commits,
            numCommits: commits.length,
            filesChanged: files,
            numFilesChanged: files.length,
            mergeDate,
        });

        // Save the document to the PrDetails collection
        await newPrDetails.save();

        return newPrDetails;
    } catch (error :any) {
        console.log('Error processing PR:', error.message);
        throw error;
    }
};


// Fetch conversations
const fetchConversations = async (number  : any) => {
    try {
        let page = 1;
        let allConversations: any[] = [];

        while (true) {
            const conversationResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/issues/${number}/comments`, {
                params: {
                    page,
                    per_page: 100,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const conversations = conversationResponse.data;
            allConversations = allConversations.concat(conversations);

            if (conversations.length < 100) {
                break;
            }

            page++;
        }

        return allConversations;
    } catch (error:any) {
        console.log('Error fetching conversations:', error.message);
        throw error;
    }
};

// Get participants from conversations
// Get participants from conversations
const getParticipants = (conversations : any) => {
    const participants = conversations
        .filter((conversation :any) => conversation.user.login !== 'github-actions[bot]')
        .map((conversation: any) => conversation.user.login);

    return participants;
};


// Fetch commits
const fetchCommits = async (number : any) => {
    try {
        const commitsResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${number}/commits`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const commits = commitsResponse.data;
        return commits;
    } catch (error: any) {
        console.log('Error fetching commits:', error.message);
        throw error;
    }
};

// Fetch files changed
const fetchFilesChanged = async (number : any) => {
    try {
        const filesResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${number}/files`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const files = filesResponse.data.map((file:any) => file.filename);
        return files;
    } catch (error: any) {
        console.log('Error fetching files changed:', error.message);
        throw error;
    }
};

// Get participants from comments
const getParticipantsFromComments = (comments : any) => {
    const participants = comments
        .filter((comment:any) => comment.user.login !== 'github-actions[bot]')
        .map((comment:any) => comment.user.login);

    return participants;
};