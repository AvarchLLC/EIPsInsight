import { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

const mongoose = require("mongoose");

const accessToken = process.env.ACCESS_TOKEN;

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

// Reuse the same schema shape as the monthly statusChanges route
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

// Helper to merge multiple aggregate outputs (same _id/toStatus) into one
const mergeStatusBuckets = (buckets: any[]) => {
  const map: Record<
    string,
    { _id: string; count: number; statusChanges: any[] }
  > = {};

  buckets.forEach((b) => {
    const key = String(b._id);
    if (!map[key]) {
      map[key] = {
        _id: key,
        count: 0,
        statusChanges: [],
      };
    }
    map[key].count += b.count ?? 0;
    if (Array.isArray(b.statusChanges)) {
      map[key].statusChanges.push(...b.statusChanges);
    }
  });

  return Object.values(map);
};

export default async (req: Request, res: Response) => {
  try {
    // URL pattern: /api/new/statusChanges/[year]
    const parts = req.url.split("/");
    const year = parseInt(parts[4], 10);

    if (Number.isNaN(year)) {
      return res.status(400).json({ error: "Invalid year in URL" });
    }

    const yearNum = year;
    const startDate = new Date(yearNum, 0, 1); // Jan 1
    const endDate = new Date(yearNum + 1, 0, 0); // Dec 31

    // --- EIPs (non-ERC) ---
    const eipBuckets = await EipStatusChange.aggregate([
      {
        $match: {
          eip: { $nin: ["7212"] },
          changeDate: { $gte: startDate, $lte: endDate },
          category: { $ne: "ERC" },
        },
      },
      {
        $group: {
          _id: "$toStatus",
          count: { $sum: 1 },
          statusChanges: { $push: "$$ROOT" },
        },
      },
    ]);

    const eipFinal = eipBuckets?.map((item: any) => ({
      ...item,
      repo: "eip",
    }));

    // --- ERCs (data spread across EipStatusChange3 and ErcStatusChange3) ---
    const ercFromEip = await EipStatusChange.aggregate([
      {
        $match: {
          changeDate: { $gte: startDate, $lte: endDate },
          category: { $in: ["ERC", "ERCs", "Standards Track - ERC"] },
        },
      },
      {
        $group: {
          _id: "$toStatus",
          count: { $sum: 1 },
          statusChanges: { $push: "$$ROOT" },
        },
      },
    ]);

    const ercFromErc = await ErcStatusChange.aggregate([
      {
        $match: {
          changeDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$toStatus",
          count: { $sum: 1 },
          statusChanges: { $push: "$$ROOT" },
        },
      },
    ]);

    const mergedErcBuckets = mergeStatusBuckets([
      ...(ercFromEip || []),
      ...(ercFromErc || []),
    ]);

    const ercFinal = mergedErcBuckets?.map((item: any) => ({
      ...item,
      repo: "erc",
    }));

    // --- RIPs ---
    const ripBuckets = await RipStatusChange.aggregate([
      {
        $match: {
          changeDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$toStatus",
          count: { $sum: 1 },
          statusChanges: { $push: "$$ROOT" },
        },
      },
    ]);

    const ripFinal = ripBuckets?.map((item: any) => ({
      ...item,
      repo: "rip",
    }));

    res.json({
      eip: eipFinal,
      erc: ercFinal,
      rip: ripFinal,
    });
  } catch (error) {
    console.error("Error in yearly statusChanges route:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

