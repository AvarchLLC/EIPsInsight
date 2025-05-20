import { NextApiRequest, NextApiResponse } from "next";
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error.message);
  });

// Define the StatusChange schema
const statusChangeSchema = new mongoose.Schema({
  eip: {
    type: String,
    required: true,
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

const EipStatusChange =
  mongoose.models.EipStatusChange3 ||
  mongoose.model("EipStatusChange3", statusChangeSchema, "eipstatuschange3");

const ErcStatusChange =
  mongoose.models.ErcStatusChange3 ||
  mongoose.model("ErcStatusChange3", statusChangeSchema, "ercstatuschange3");

const RipStatusChange =
  mongoose.models.RipStatusChange3 ||
  mongoose.model("RipStatusChange3", statusChangeSchema, "ripstatuschange3");

// Define the Next.js API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
        const eipResults = (await EipStatusChange.find({}))?.map((result:any) => ({
            ...result.toObject(),
            repo: "eip",
          }));
    
          const ercResults = (await ErcStatusChange.find({}))?.map((result:any) => ({
            ...result.toObject(),
            repo: "erc",
          }));
    
          const ripResults = (await RipStatusChange.find({}))?.map((result:any) => ({
            ...result.toObject(),
            repo: "rip",
          }));

      // Structure the response in the desired format
      res.status(200).json({
        eip: eipResults,
        erc: ercResults,
        rip: ripResults,
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching status changes" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}