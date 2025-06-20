import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
    } else {
        console.error('MONGODB_URI environment variable is not defined');
    }
}

// ERC Review Schema
const ercReviewSchema = new mongoose.Schema({
    reviewerName: { type: String, required: true },
    prInfo: {
        prNumber: Number,
        prTitle: String,
        prDescription: String,
        labels: [String],
        numCommits: Number,
        filesChanged: [String],
        numFilesChanged: Number,
        mergeDate: Date,
        createdAt: { type: Date, default: Date.now },
        closedAt: Date,
        mergedAt: Date,
    },
    reviews: [
        {
            review: { type: String, required: true },
            reviewDate: { type: Date, required: true },
            reviewComment: String,
        },
    ],
});

const ERCReviewDetails = mongoose.models.ERCReviewDetails || mongoose.model('ERCReviewDetails', ercReviewSchema);

export default async (req: Request, res: Response) => {
    try {
        const reviewersList = [
            "lightclient", "SamWilsn", "xinbenlv", "g11tech", "bomanaps", "axic", "gcolvin", "yoavw"
        ];

        const twentyFourHoursAgo = new Date(Date.now() - 1003 * 60 * 60 * 1000);

        const resultByReviewer: { [key: string]: any[] } = {};
        reviewersList.forEach(handle => {
            resultByReviewer[handle] = [];
        });

        const eipReviews = await ERCReviewDetails.aggregate([
            { $match: { reviewerName: { $in: reviewersList } } },
            { $unwind: "$reviews" },
            {
                $match: {
                    "reviews.reviewDate": { $gte: twentyFourHoursAgo }
                }
            },
            {
                $project: {
                    prNumber: "$prInfo.prNumber",
                    prTitle: "$prInfo.prTitle",
                    created_at: "$prInfo.createdAt",
                    closed_at: "$prInfo.closedAt",
                    merged_at: "$prInfo.mergedAt",
                    reviewDate: "$reviews.reviewDate",
                    reviewComment: "$reviews.reviewComment",
                    reviewerName: "$reviewerName"
                }
            }
        ]);

        eipReviews.forEach((review: any) => {
            const { reviewerName, prNumber, prTitle, created_at, closed_at, merged_at, reviewDate, reviewComment } = review;

            resultByReviewer[reviewerName].push({
                repo: "ERCs",
                prNumber,
                prTitle,
                created_at,
                closed_at,
                merged_at,
                reviewDate,
                reviewComment
            });
        });

        res.json(resultByReviewer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
