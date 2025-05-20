import { NextApiRequest, NextApiResponse } from 'next';

const mongoose = require('mongoose');
import axios from 'axios';

const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
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


export default async (req: NextApiRequest, res: NextApiResponse) => {
    // const parts = req.url.split("/");
    const { Type,number } = req.query;
    const typeString = Array.isArray(Type) ? Type[0] : Type || '';

    try {
        // const number = req.params.number; // Get the PR or Issue number from the URL parameter
        // console.log("number:",number);
        // console.log("Type:", Type);

        // Check if a PR with the given number exists
        let prDetails = null;

        try {
            const prResponse = await axios.get(`https://api.github.com/repos/ethereum/${Type}/pulls/${number}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // console.log(prResponse);


            if (prResponse.status === 200) {
                // PR exists, process and return PR details
                const issueDetails = await processPRDetails(prResponse.data,typeString);

                var state = prResponse.data.state;
                // console.log(prResponse.data.merged);
                // console.log(prResponse.data.state);

                if (state === "closed" && prResponse.data.merged === true) {
                    state = 'merged';
                }

                const commentsResponse = await axios.get(`https://api.github.com/repos/ethereum/${Type}/pulls/${number}/reviews`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                let allConversations2 = commentsResponse.data;
                console.log(commentsResponse.data);

                allConversations2 = allConversations2?.concat(commentsResponse);

                const participants2 = getParticipants2(allConversations2);

                const commitAuthor = issueDetails?.commits[0]?.author?.login;

                // Merge participants, including the commit author if available
                const mergedParticipants = new Set([
                    ...issueDetails.participants,
                    ...participants2,
                    ...(commitAuthor ? [commitAuthor] : [])  // Add commit author if it exists
                ]);

                const uniqueParticipantsArray = Array.from(mergedParticipants);

                issueDetails.participants=uniqueParticipantsArray;
                issueDetails.numParticipants=uniqueParticipantsArray?.length;

                prDetails = {
                    type: 'Pull Request',
                    title: prResponse.data.title,
                    state: state,
                    url: prResponse.data.html_url,
                    prDetails: issueDetails,
                    reviewComments: commentsResponse.data 
                    // Add more PR details as needed
                };
            }
            // console.log(prResponse);
        } catch (prError) {
            // Handle the PR request error (e.g., PR not found)
            console.log(prError)
            console.log('not a pr, now checking for issues')
        }
        // console.log(prDetails)
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


// Process PR details
const processPRDetails = async (prData:any,Type:string) => {
    try {
        const labels = prData.labels?.map((label: { name: any; }) => label.name);
        const conversations = await fetchConversations(Type,prData.number);
        const commits = await fetchCommits(Type,prData.number);
        const participants = getParticipants(conversations, commits);
        const files = await fetchFilesChanged(Type,prData.number);
        const mergeDate = prData.merged_at ? new Date(prData.merged_at) : null;

        const newPrDetails = new PrDetails({
            prNumber: prData.number,
            state: prData.status,
            prTitle: prData.title,
            prDescription: prData.body,
            labels,
            conversations,
            numConversations: conversations?.length,
            participants,
            numParticipants: participants?.length,
            commits,
            numCommits: commits?.length,
            filesChanged: files,
            numFilesChanged: files?.length,
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
const fetchConversations = async (Type:string,number:number) => {
    try {
        let page = 1;
        let allConversations:any = [];

        while (true) {
            const conversationResponse = await axios.get(`https://api.github.com/repos/ethereum/${Type}/pulls/${number}/comments`, {
                params: {
                    page,
                    per_page: 100,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const conversations = conversationResponse.data;
            allConversations = allConversations?.concat(conversations);

            if (conversations?.length < 100) {
                break;
            }

            page++;
        }
        while (true) {
            const conversationResponse = await axios.get(`https://api.github.com/repos/ethereum/${Type}/issues/${number}/comments`, {
                params: {
                    page,
                    per_page: 100,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const conversations = conversationResponse.data;
            allConversations = allConversations?.concat(conversations);

            if (conversations?.length < 100) {
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
        ?.filter((conversation) => conversation.user.login !== 'github-actions[bot]')
        ?.map((conversation) => conversation.user.login);

    const commitParticipants = commits
        ?.map((commit) => commit.committer.login);

    // Combine the arrays and use a Set to ensure uniqueness
    const uniqueParticipants = new Set([...commentParticipants, ...commitParticipants]);

    // Convert the Set back to an array
    return Array.from(uniqueParticipants);
};

const getParticipants2 = (conversations: any[]) => {
    if (conversations?.length === 0) return [];

    const commentParticipants = conversations
        ?.filter((conversation) => conversation.user && conversation.user.login && conversation.user.login !== 'github-actions[bot]')
        ?.map((conversation) => conversation.user.login);

    // Use a Set to ensure uniqueness and convert it back to an array
    const uniqueParticipants = new Set(commentParticipants);
    
    return Array.from(uniqueParticipants);
};





// Fetch commits
const fetchCommits = async (Type:string,number: number) => {
    try {
        const commitsResponse = await axios.get(`https://api.github.com/repos/ethereum/${Type}/pulls/${number}/commits`, {
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
const fetchFilesChanged = async (Type:string,number: number) => {
    try {
        const filesResponse = await axios.get(`https://api.github.com/repos/ethereum/${Type}/pulls/${number}/files`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const files = filesResponse.data?.map((file: { filename: any; }) => file.filename);
        return files;
    } catch (error:any) {
        console.log('Error fetching files changed:', error.message);
        throw error;
    }
};

