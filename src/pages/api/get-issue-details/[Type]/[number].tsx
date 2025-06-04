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

const issueDetailsSchema = new mongoose.Schema({
  issueNumber: { type: Number },
  issueTitle: { type: String },
  issueDescription: { type: String },
  labels: { type: [String] },
  conversations: { type: [Object] },
  numConversations: { type: Number },
  participants: { type: [String] },
  numParticipants: { type: Number },
  state: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  closedAt: { type: Date },
});

const IssueDetails = mongoose.models.IssueDetails || mongoose.model('IssueDetails', issueDetailsSchema);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { Type, number } = req.query;
  const typeString = Array.isArray(Type) ? Type[0] : Type || '';

  try {
    console.log('Issue number:', number);
    console.log('Type:', Type);

    // Fetch issue details
    const issueResponse = await axios.get(`https://api.github.com/repos/ethereum/${typeString}/issues/${number}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (issueResponse.status === 200) {
      const issueDetails = await processIssueDetails(issueResponse.data);

      res.json({
        type: 'Issue',
        title: issueDetails.issueTitle,
        state: issueDetails.state,
        url: issueResponse.data.html_url,
        issueDetails,
      });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  } catch (error: any) {
    console.error('Error fetching issue details:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Process issue details
const processIssueDetails = async (issueData: any) => {
  try {
    const labels = issueData.labels?.map((label: { name: any }) => label.name);
    const conversations = await fetchIssueConversations(issueData.number);
    const participants = getParticipants(conversations);

    const issueDetails = new IssueDetails({
      issueNumber: issueData.number,
      issueTitle: issueData.title,
      issueDescription: issueData.body,
      labels,
      conversations,
      numConversations: conversations?.length,
      participants,
      numParticipants: participants?.length,
      state: issueData.state,
      createdAt: new Date(issueData.created_at),
      updatedAt: new Date(issueData.updated_at),
      closedAt: issueData.closed_at ? new Date(issueData.closed_at) : null,
    });

    // Save issue details to the database
    await issueDetails.save();

    return issueDetails;
  } catch (error: any) {
    console.log('Error processing issue:', error.message);
    throw error;
  }
};

// Fetch issue comments
const fetchIssueConversations = async (issueNumber: number) => {
  try {
    let page = 1;
    let allConversations: any = [];

    while (true) {
      const conversationResponse = await axios.get(
        `https://api.github.com/repos/ethereum/EIPs/issues/${issueNumber}/comments`,
        {
          params: { page, per_page: 100 },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const conversations = conversationResponse.data;
      allConversations = allConversations?.concat(conversations);

      if (conversations?.length < 100) {
        break;
      }

      page++;
    }

    return allConversations;
  } catch (error: any) {
    console.log('Error fetching issue conversations:', error.message);
    throw error;
  }
};

// Extract unique participants
const getParticipants = (conversations: any[]) => {
  const commentParticipants = conversations
    ?.filter((conversation) => conversation.user?.login !== 'github-actions[bot]')
    ?.map((conversation) => conversation.user?.login);

  const uniqueParticipants = new Set([...commentParticipants]);

  return Array.from(uniqueParticipants);
};
