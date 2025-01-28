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

const eipcontentsSchema = new mongoose.Schema({
  eip: {
    type: Number,
  },
  content: { type: String },
});

const erc_contents =
  mongoose.models.erc_contents ||
  mongoose.model("erc_contents3", eipcontentsSchema);

export default async (req: Request, res: Response) => {
  const parts = req.url.split("/");
  const eipNumber = parseInt(parts[4]);

  try {
    const erc = await erc_contents.findOne({ eipNumber });

    if (!erc) {
      return res.status(404).json({ message: "EIP not found" });
    }

    res.json({ ...erc, repo: "erc" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
