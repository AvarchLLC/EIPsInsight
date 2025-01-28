import { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

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

const mdFilesSchema = new mongoose.Schema({
  eip: { type: String, unique: true },
  title: { type: String },
  author: { type: String },
  status: { type: String },
  type: { type: String },
  category: { type: String },
  created: { type: String },
});

const MdFiles =
  mongoose.models.ErcMdFiles || mongoose.model("ErcMdFiles3", mdFilesSchema);

export default async (req: Request, res: Response) => {
  MdFiles.aggregate([
    {
      $sort: {
        _id: 1, // Sort by status in ascending order
      },
    },
  ])
    .then((result: any) => {
      res.json(result);
    })
    .catch((error: any) => {
      console.error("Error retrieving EIPs:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};
