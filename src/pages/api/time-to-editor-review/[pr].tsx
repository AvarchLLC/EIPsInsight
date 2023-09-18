import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";
const axios = require('axios');
const cheerio = require('cheerio');


const mongoose = require('mongoose');
interface Review {
    state: string;
    user: {
        created_at: string;
    };
    submitted_at: string;
    // Add other properties as needed
}


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

    const mdFilesSchema = new mongoose.Schema({
        eip: { type: String, unique: true },
        title: { type: String },
        author: { type: String },
        status: { type: String },
        type: { type: String },
        category: { type: String },
        created: { type: String },
    });
    
const MdFiles = mongoose.models.MdFiles ||  mongoose.model('MdFiles', mdFilesSchema);


export default async (req: Request, res: Response) => {
    const parts = req.url.split("/");
    const prNumber = parseInt(parts[3]);

    try {
        

        // Fetch PR information from GitHub API
        const response = await axios.get(`https://api.github.com/repos/ethereum/EIPs/pulls/${prNumber}/reviews`);
        const reviews = response.data;

        // Filter reviews to find the first "APPROVED" review
        const editorReview = reviews.find((review: Review) => review.state === 'APPROVED');

        if (!editorReview) {
            return res.status(404).json({ error: 'Editor review not found' });
        }
        const createdAt = new Date(editorReview.user.created_at);
        const submittedAt = new Date(editorReview.submitted_at);

        // Calculate the time difference in milliseconds
        const timeDifference = submittedAt.getTime() - createdAt.getTime();

        // Convert milliseconds to hours
        const hoursToEditorReview = timeDifference / (1000 * 60 * 60);

        res.json({ prNumber, hoursToEditorReview });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};