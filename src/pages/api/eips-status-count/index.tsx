import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";

const mongoose = require('mongoose');

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

    const eipHistorySchema = new mongoose.Schema({
        eip: { type: String } ,
        title: { type: String },
        author: { type: String },
        status: { type: String },
        type: { type: String },
        category: { type: String },
        created: { type: Date }, 
        discussion: { type: String },
        deadline: { type: String },
        requires: { type: String },
        commitSha: { type: String },
        commitDate: { type: Date },
        mergedDate: { type: Date },
        prNumber: { type: Number },
        closedDate: { type: Date },
        changes: { type: Number },
        insertions: { type: Number },
        deletions: { type: Number },
        mergedDay: { type: Number },
        mergedMonth: { type: Number },
        mergedYear: { type: Number },
        // createdDate: { type: Date },
        createdMonth: { type: Number },
        createdYear: { type: Number },
        previousdeadline: { type: String },
        newdeadline: { type: String },
        message: { type: String },
    });
    
    
const EipHistory = mongoose.models.EipHistory ||  mongoose.model('EipHistory3', eipHistorySchema);


export default async (req: Request, res: Response) => {
    try {
        const eipStatusCounts = await EipHistory.aggregate([
            {
                $group: {
                    _id: {
                        year: "$mergedYear", // Use mergedYear as the year field
                        status: "$status"
                    },
                    count: { $sum: 1 }, // Count EIPs by status and year
                    eips: { $addToSet: "$eip" } // Group EIPs by status and year
                }
            },
            {
                $group: {
                    _id: "$_id.year",
                    data: {
                        $push: {
                            status: "$_id.status",
                            count: "$count",
                            eips: "$eips"
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 } // Sort by year in ascending order
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    data: 1
                }
            }
        ]);

        res.json(eipStatusCounts);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


