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

// Define the StatusChange schema
const statusChangeSchema = new mongoose.Schema({
    eip: {
        type: String,
        required: true
    }, 
    fromStatus: {
        type: String,
        required: true,
    },
    toStatus: {
        type: String,
        required: true,
    },
    changeDate: {
        type: Date,
        required: true,
    },
    changedDay: {
        type: Number,
        required: true,
    },
    changedMonth: {
        type: Number,
        required: true,
    },
    changedYear: {
        type: Number,
        required: true,
    },
});
const StatusChange = mongoose.models.StatusChange || mongoose.model('StatusChange', statusChangeSchema);

export default async (req: Request, res: Response) => {
    StatusChange.aggregate([
        {
            $group: {
                _id: {
                    status: '$status',
                    category: '$category',
                    changedYear: { $year: '$changeDate' },
                    changedMonth: { $month: '$changeDate' }
                },
                count: { $sum: 1 },
                eips: { $push: '$$ROOT' }
            }
        },
        {
            $group: {
                _id: '$_id.status',
                eips: {
                    $push: {
                        category: '$_id.category',
                        changedYear: '$_id.changedYear',
                        changedMonth: '$_id.changedMonth',
                        count: '$count',
                        eips: '$eips'
                    }
                }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }
    ])
        .then((result:any) => {
            const formattedResult = result?.map((group:any) => ({
                status: group._id,
                eips: group.eips?.reduce((acc:any, eipGroup:any) => {
                    const { category, changedYear, changedMonth, count, eips } = eipGroup;
                    acc.push({
                        category,
                        month: changedMonth,
                        year: changedYear,
                        date: `${changedYear}-${changedMonth}`,
                        count
                    });
                    return acc;
                }, []).sort((a:any, b:any) => (a.date > b.date ? 1 : -1))
            }));
            res.json(formattedResult);
        })
        .catch((error:any) => {
            console.error('Error retrieving EIPs:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        });
};
