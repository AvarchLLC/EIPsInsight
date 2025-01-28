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

const RIPMdFiles =
  mongoose.models.RipMdFiles3 || mongoose.model("RipMdFiles3", mdFilesSchema);

export default async (req: Request, res: Response) => {
  const parts = req.url.split("/");
  const eipNumber = parseInt(parts[3]);

  RIPMdFiles.findOne({ eip: eipNumber })
    .then((eip: any) => {
      if (eip) {
        res.json({ ...eip, repo: "rip" });
      } else {
        res.status(404).json({ error: "EIP not found" });
      }
    })
    .catch((error: any) => {
      console.error("Error retrieving EIP:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};
