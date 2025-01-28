import { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

const mongoose = require("mongoose");

// Create the StatusChange model

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

const ripcontentsSchema = new mongoose.Schema({
  eip: {
    type: Number,
  },
  content: { type: String },
});

const rip_contents =
  mongoose.models.rip_contents ||
  mongoose.model("rip_contents3", ripcontentsSchema);

export default async (req: Request, res: Response) => {
  const parts = req.url.split("/");
  const eipNumber = parseInt(parts[4]);

  try {
    const eip = await rip_contents.findOne({ eipNumber });

    if (!eip) {
      return res.status(404).json({ message: "RIP not found" });
    }

    res.json({ ...eip, repo: "rip" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
