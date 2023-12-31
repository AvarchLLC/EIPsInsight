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
        const number = req.params.number; // Get the PR or Issue number from the URL parameter

        // Check if a PR with the given number exists
        let prDetails = null;

        try {
            const prResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${number}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(prResponse);


            if (prResponse.status === 200) {
                // PR exists, process and return PR details
                const issueDetails = await processPRDetails(prResponse.data);

                var state = prResponse.data.state;
                console.log(prResponse.data.merged);
                console.log(prResponse.data.state);

                if (state === "closed" && prResponse.data.merged === true) {
                    state = 'merged';
                }

                prDetails = {
                    type: 'Pull Request',
                    title: prResponse.data.title,
                    state: state,
                    url: prResponse.data.html_url,
                    prDetails: issueDetails
                    // Add more PR details as needed
                };
            }
            // console.log(prResponse);
        } catch (prError) {
            // Handle the PR request error (e.g., PR not found)
            console.log('not a pr, now checking for issues')
        }
        // console.log(prDetails)

        // If PR details are not found, check if an Issue with the given number exists
        if (!prDetails) {
            try {
                const issueResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/issues/${number}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(issueResponse)

                if (issueResponse.status === 200) {
                    // Issue exists and is open, process and return Issue details
                    const issueDetails = await processIssueDetails(issueResponse.data);
                    console.log(issueDetails);
                    prDetails = {
                        type: 'Issue',
                        status: "open",
                        title: issueResponse.data.title,
                        url: issueResponse.data.html_url,
                        issueDetails: issueDetails
                        // Add more Issue details as needed
                    };
                }
                // console.log(issueResponse);
            } catch (issueError) {
                // Handle the Issue request error (e.g., Issue not found)
            }
        }

        console.log(prDetails)

        if (prDetails) {
            // Either PR or Issue details were found, return them
            res.json(prDetails);
        } else {
            // Neither PR nor open Issue exists
            res.status(404).json({ error: 'PR or open Issue not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


// Process Issue details
const processIssueDetails = async (issueData:any) => {
    try {
        const comments = await fetchComments(issueData.number);
        const assignees = issueData.assignees.map((assignee: { login: any; }) => assignee.login);
        const labels = issueData.labels.map((label: { name: any; }) => label.name);
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
    } catch (error:any) {
        console.log('Error processing Issue:', error.message);
        throw error;
    }
};


// Process Issue details

// Fetch comments for an issue
const fetchComments = async (number:number) => {
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
const processPRDetails = async (prData:any) => {
    try {
        const labels = prData.labels.map((label: { name: any; }) => label.name);
        const conversations = await fetchConversations(prData.number);
        const commits = await fetchCommits(prData.number);
        const participants = getParticipants(conversations, commits);
        const files = await fetchFilesChanged(prData.number);
        const mergeDate = prData.merged_at ? new Date(prData.merged_at) : null;

        const newPrDetails = new PrDetails({
            prNumber: prData.number,
            state: prData.status,
            prTitle: prData.title,
            prDescription: prData.body,
            labels,
            conversations,
            numConversations: conversations.length,
            participants,
            numParticipants: participants.length,
            commits,
            numCommits: commits.length,
            filesChanged: files,
            numFilesChanged: files.length,
            mergeDate,
        });

        // Save the document to the PrDetails collection
        await newPrDetails.save();

        return newPrDetails;
    } catch (error:any) {
        console.log('Error processing PR:', error.message);
        throw error;
    }
};


// Fetch conversations
const fetchConversations = async (number:number) => {
    try {
        let page = 1;
        let allConversations:any = [];

        while (true) {
            const conversationResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${number}/comments`, {
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
const getParticipants = (conversations: any[], commits: any[]) => {
    const commentParticipants = conversations
        .filter((conversation) => conversation.user.login !== 'github-actions[bot]')
        .map((conversation) => conversation.user.login);

    const commitParticipants = commits
        .map((commit) => commit.committer.login);

    // Combine the arrays and use a Set to ensure uniqueness
    const uniqueParticipants = new Set([...commentParticipants, ...commitParticipants]);

    // Convert the Set back to an array
    return Array.from(uniqueParticipants);
};




// Fetch commits
const fetchCommits = async (number: number) => {
    try {
        const commitsResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${number}/commits`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const commits = commitsResponse.data;
        return commits;
    } catch (error:any) {
        console.log('Error fetching commits:', error.message);
        throw error;
    }
};

// Fetch files changed
const fetchFilesChanged = async (number: number) => {
    try {
        const filesResponse = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${number}/files`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const files = filesResponse.data.map((file: { filename: any; }) => file.filename);
        return files;
    } catch (error:any) {
        console.log('Error fetching files changed:', error.message);
        throw error;
    }
};

// Get participants from comments
const getParticipantsFromComments = (comments:any) => {
    const participants = comments
        .filter((comment: { user: { login: string; }; }) => comment.user.login !== 'github-actions[bot]')
        .map((comment: { user: { login: any; }; }) => comment.user.login);

    return participants;
};