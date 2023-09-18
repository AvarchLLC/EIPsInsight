import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";

const mongoose = require('mongoose');

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
  const parts = req.url.split("/");
  const year = parseInt(parts[3]);
  const month = parseInt(parts[4]);
  try {
    // Convert year and month to numbers
    const yearNum = year;
    const monthNum = month;

    // Get the start and end dates of the specified month and year
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);

    // Query the database for status changes within the specified date range
    const statusChanges = await StatusChange.aggregate([
        { $match: { changeDate: { $gte: startDate, $lte: endDate }, status: { $ne: null } } },
        {
            $group: {
                _id: { status: '$status', month: { $month: '$changeDate' }, year: { $year: '$changeDate' } },
                eips: {
                    $push: {
                        category: '$category',
                        month: { $month: '$changeDate' },
                        year: { $year: '$changeDate' },
                        date: { $concat: [{ $toString: { $year: '$changeDate' } }, '-', { $toString: { $month: '$changeDate' } }] },
                        count: 1,
                        eips: '$$ROOT'
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id.status',
                eips: {
                    $push: {
                        category: '$_id.category',
                        month: '$_id.month',
                        year: '$_id.year',
                        date: { $concat: [{ $toString: '$_id.year' }, '-', { $toString: '$_id.month' }] },
                        count: { $sum: 1 },
                        eips: '$eips'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                status: '$_id',
                eips: 1
            }
        },
        {
            $sort: {
                status: 1
            }
        }
    ]);

    res.json(statusChanges);
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
}
};
