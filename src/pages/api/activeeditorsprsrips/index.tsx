import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
    } else {
        // Handle the case where the environment variable is not defined
        console.error('MONGODB_URI environment variable is not defined');
    }
}

const fetchReviewers = async (): Promise<string[]> => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml"
      );
      const text = await response.text();
  
      // Match unique reviewers using a regex to handle YAML structure
      const matches = text.match(/-\s(\w+)/g);
      const reviewers = matches ? Array.from(new Set(matches?.map((m) => m.slice(2)))) : [];
      const additionalReviewers = ["nalepae","SkandaBhat","advaita-saha","jochem-brouwer","Marchhill","bomanaps","daniellehrner","CarlBeek","nconsigny","yoavw", "adietrichs"];

      // Merge the two arrays and ensure uniqueness
      const updatedReviewers = Array.from(new Set([...reviewers, ...additionalReviewers]));

      console.log("updated reviewers:", updatedReviewers);

      return updatedReviewers;
    } catch (error) {
      console.error("Error fetching reviewers:", error);
      return [];
    }
  };
// EIP Review Schema
const ripReviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: true,
    },
    prInfo: {
        prNumber: {
            type: Number,
            required: true,
        },
        prTitle: {
            type: String,
            required: true,
        },
        prDescription: {
            type: String,
        },
        labels: {
            type: [String],
        },
        numCommits: {
            type: Number,
        },
        filesChanged: {
            type: [String],
        },
        numFilesChanged: {
            type: Number,
        },
        mergeDate: {
            type: Date,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        closedAt: {
            type: Date,
        },
        mergedAt: {
            type: Date,
        },
    },
    reviews: [
        {
            review: {
                type: String,
                required: true,
            },
            reviewDate: {
                type: Date,
                required: true,
            },
            reviewComment: {
                type: String,
            },
        },
    ],
});

// Create EIPReviewDetails model
// const EIPReviewDetails = mongoose.model('ERCReviewDetails', ercReviewSchema);
const RIPReviewDetails = mongoose.models.RIPReviewDetails || mongoose.model('RIPReviewDetails', ripReviewSchema);


// Controller logic to fetch and group PR review details by reviewer
export default async (req: Request, res: Response) => {
    try {
        // GitHub handles to filter by
        const githubHandles = await fetchReviewers();
        console.log(githubHandles);

        // Create an object to store the results for each reviewer
        const resultByReviewer: { [key: string]: any[] } = {};

        // Initialize the result object with empty arrays for each reviewer
        githubHandles?.forEach((handle) => {
            resultByReviewer[handle] = [];
        });

        // Efficient MongoDB query to fetch review details
        const eipReviews = await RIPReviewDetails.aggregate([
            { $match: { reviewerName: { $in: githubHandles } } },  // Filter by reviewerName
            { $unwind: "$reviews" },  // Unwind the reviews array
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

        // Group PR details by reviewer
        eipReviews?.forEach((review: any) => {
            const { reviewerName, prNumber, prTitle, created_at, closed_at, merged_at, reviewDate, reviewComment } = review;

            // Add review details to the respective reviewer
            resultByReviewer[reviewerName].push({
                repo:"RIPs",
                prNumber,
                prTitle,
                created_at,
                closed_at,
                merged_at,
                reviewDate,
                reviewComment
            });
        });

        // Log the grouped details by reviewer
        // console.log(resultByReviewer);

        // Return the PR details grouped by each reviewer as a JSON response
        res.json(resultByReviewer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
