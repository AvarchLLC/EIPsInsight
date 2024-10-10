import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { Schema, model, models } from "mongoose";

// Connect to MongoDB using the connection string from the environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define a schema for the view counts
const viewCountSchema = new Schema({
  path: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 }, // Default to 1 when first created
});

// Use the schema to create a model
const ViewCount = models.ViewCount || model("ViewCount", viewCountSchema);

// Connect to MongoDB if not already connected
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Already connected
  }
  await mongoose.connect(MONGODB_URI!);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { path } = req.query;

  try {
    // Increment view count for the specific path
    const result = await ViewCount.findOneAndUpdate(
      { path }, 
      { $inc: { count: 1 } }, // Increment count by 1
      { new: true, upsert: true } // Return updated document and upsert if not found
    );

    res.status(200).json({ viewCount: result.count });
  } catch (error) {
    console.error("Error updating view count:", error);
    res.status(500).json({ error: "Error updating view count" });
  }
}
