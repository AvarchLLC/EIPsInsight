import { Request, Response } from "express";
import mongoose from "mongoose";

const mongoUri: string = process.env.MONGODB_URI as string;

if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

const dbName = 'test'; // Specify the database name

mongoose
  .connect(mongoUri) // Connect to the specified database
  .then(() => {
    console.log(`Connected to the database`);
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error.message);
  });

const linkSchema = new mongoose.Schema({
  url: { type: String, unique: true },
});

// Models for collections within the same database
const EipBoard = mongoose.models.EipBoard || mongoose.model("EipBoard", linkSchema, 'eip_board');
const ErcBoard = mongoose.models.ErcBoard || mongoose.model("ErcBoard", linkSchema, 'erc_board');
// const RipBoard = mongoose.models.RipBoard || mongoose.model("RipBoard", linkSchema, 'rip_board');

export default async (req: Request, res: Response) => {
  try {
    // Retrieve data from the respective collections
    const [eips, ercs] = await Promise.all([
      EipBoard.find(), // Retrieve EIP data from eip_board
      ErcBoard.find(), // Retrieve ERC data from erc_board
      // RipBoard.find().sort({ _id: 1 }), // Retrieve RIP data from rip_board
    ]);

    // Send the response with the data for eips, ercs, and rips
    res.json({
      eips,
      ercs,
      // rips,
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
