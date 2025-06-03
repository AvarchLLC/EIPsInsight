import { Request, Response } from "express";
// import mongoose from "mongoose";

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

// Define the StatusChange schema
const categoryChangeSchema = new mongoose.Schema({
  eip: { type: String, required: true },
  fromCategory: { type: String, required: true },
  toCategory: { type: String, required: true },
  changeDate: { type: Date, required: true },
  changedDay: { type: Number, required: true },
  changedMonth: { type: Number, required: true },
  changedYear: { type: Number, required: true },
});

const EipCategoryChange =
  mongoose.models.EipCategoryChange ||
  mongoose.model("EipCategoryChange", categoryChangeSchema, "eipcategorychange3");

const ErcCategoryChange =
  mongoose.models.ErcCategoryChange ||
  mongoose.model("ErcCategoryChange", categoryChangeSchema, "erccategorychange3");

const RipCategoryChange =
  mongoose.models.RipCategoryChange ||
  mongoose.model("RipCategoryChange", categoryChangeSchema, "ripcategorychange3");

export default async (req: Request, res: Response) => {
  try {
    // Fetch and log raw data for EIP
    const rawEipData = await EipCategoryChange.find();
    console.log("Raw EIP Data:", rawEipData);

    // Aggregate data for EIP
    const EipfinalCategoryByYear = await EipCategoryChange.aggregate([
      { $match: { eip: { $nin: ["7212"] } } },
      { $sort: { eip: 1, changeDate: 1 } },
      {
        $group: {
          _id: { year: { $year: "$changeDate" }, eip: "$eip" },
          lastCategory: { $last: "$toCategory" },
          eipTitle: { $last: "$title" },
          eipStatus: { $last: "$status" },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          categoryChanges: {
            $push: {
              eip: "$_id.eip",
              lastCategory: "$lastCategory",
              eipTitle: "$eipTitle",
              eipStatus: "$eipStatus",
            },
          },
        },
      },
      { $project: { _id: 0, year: "$_id", categoryChanges: 1 } },
      { $sort: { year: 1 } },
    ]);

    console.log("Processed EIP Data:", EipfinalCategoryByYear);

    // Fetch and log raw data for ERC
    const rawErcData = await ErcCategoryChange.find();
    console.log("Raw ERC Data:", rawErcData);

    // Aggregate data for ERC
    const ErcfinalCategoryByYear = await ErcCategoryChange.aggregate([
      { $match: { changeDate: { $gte: new Date("2023-11-01T00:00:00.000Z") } } },
      { $sort: { eip: 1, changeDate: 1 } },
      {
        $group: {
          _id: { year: { $year: "$changeDate" }, eip: "$eip" },
          lastCategory: { $last: "$toCategory" },
          eipTitle: { $last: "$title" },
          eipStatus: { $last: "$status" },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          categoryChanges: {
            $push: {
              eip: "$_id.eip",
              lastCategory: "$lastCategory",
              eipTitle: "$eipTitle",
              eipStatus: "$eipStatus",
            },
          },
        },
      },
      { $project: { _id: 0, year: "$_id", categoryChanges: 1 } },
      { $sort: { year: 1 } },
    ]);

    console.log("Processed ERC Data:", ErcfinalCategoryByYear);

    // Fetch and log raw data for RIP
    const rawRipData = await RipCategoryChange.find();
    console.log("Raw RIP Data:", rawRipData);

    // Aggregate data for RIP
    const RipfinalCategoryByYear = await RipCategoryChange.aggregate([
      { $match: { changeDate: { $gte: new Date("2023-11-01T00:00:00.000Z") } } },
      { $sort: { eip: 1, changeDate: 1 } },
      {
        $group: {
          _id: { year: { $year: "$changeDate" }, eip: "$eip" },
          lastCategory: { $last: "$toCategory" },
          eipTitle: { $last: "$title" },
          eipStatus: { $last: "$status" },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          categoryChanges: {
            $push: {
              eip: "$_id.eip",
              lastCategory: "$lastCategory",
              eipTitle: "$eipTitle",
              eipStatus: "$eipStatus",
            },
          },
        },
      },
      { $project: { _id: 0, year: "$_id", categoryChanges: 1 } },
      { $sort: { year: 1 } },
    ]);

    console.log("Processed RIP Data:", RipfinalCategoryByYear);

    // Combine and send the response
    const eipFinal = EipfinalCategoryByYear?.map((item: any) => ({ ...item, repo: "eip" }));
    const ercFinal = ErcfinalCategoryByYear?.map((item: any) => ({ ...item, repo: "erc" }));
    const ripFinal = RipfinalCategoryByYear?.map((item: any) => ({ ...item, repo: "rip" }));

    res.json({
      eip: eipFinal,
      erc: ercFinal,
      rip: ripFinal,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
