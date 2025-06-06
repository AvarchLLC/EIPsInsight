// src/pages/api/editorsActivity/index.tsx

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
    } else {
        // Handle the case where the environment variable is not defined
        console.error('MONGODB_URI environment variable is not defined');
    }
}

// Define the schema and model
const reviewerSchema = new mongoose.Schema({
  reviewer: String,
  startDate: Date,
  endDate: Date,
});

const Reviewer = mongoose.models.Reviewer || mongoose.model('Reviewer', reviewerSchema);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch all reviewer records from the database
    const reviewers = await Reviewer.find();

    // Format the data as needed
    const formattedData = reviewers?.map(reviewer => ({
      reviewer: reviewer.reviewer,
      startDate: reviewer.startDate?.toISOString(),
      endDate: reviewer.endDate ? reviewer.endDate.toISOString() : null,
    }));

    // Send the formatted data as JSON response
    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
