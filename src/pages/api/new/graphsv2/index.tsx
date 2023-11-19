import { Request, Response } from "express";

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
  mongoose.models.EipStatusChange ||
  mongoose.model("EipStatusChange", statusChangeSchema, "eipstatuschanges");

const ErcStatusChange =
  mongoose.models.ErcStatusChange ||
  mongoose.model("ErcStatusChange", statusChangeSchema, "ercstatuschanges");

export default async (req: Request, res: Response) => {
  try {
    const eipResult = await EipStatusChange.aggregate([
      {
        $group: {
          _id: {
            status: "$status",
            category: "$category",
            changedYear: { $year: "$changeDate" },
            changedMonth: { $month: "$changeDate" },
          },
          count: { $sum: 1 },
          eips: { $push: "$$ROOT" },
        },
      },
      {
        $group: {
          _id: "$_id.status",
          eips: {
            $push: {
              category: "$_id.category",
              changedYear: "$_id.changedYear",
              changedMonth: "$_id.changedMonth",
              count: "$count",
              eips: "$eips",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const formattedResult = eipResult.map(
      (group: { _id: any; eips: any[] }) => ({
        status: group._id,
        eips: group.eips
          .reduce((acc, eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
            });
            return acc;
          }, [])
          .sort((a: { date: number }, b: { date: number }) =>
            a.date > b.date ? 1 : -1
          ),
      })
    );

    const ercResult = await ErcStatusChange.aggregate([
      {
        $group: {
          _id: {
            status: "$status",
            category: "$category",
            changedYear: { $year: "$changeDate" },
            changedMonth: { $month: "$changeDate" },
          },
          count: { $sum: 1 },
          eips: { $push: "$$ROOT" },
        },
      },
      {
        $group: {
          _id: "$_id.status",
          eips: {
            $push: {
              category: "$_id.category",
              changedYear: "$_id.changedYear",
              changedMonth: "$_id.changedMonth",
              count: "$count",
              eips: "$eips",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const ERCformattedResult = ercResult.map(
      (group: { _id: any; eips: any[] }) => ({
        status: group._id,
        eips: group.eips
          .reduce((acc, eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
            });
            return acc;
          }, [])
          .sort((a: { date: number }, b: { date: number }) =>
            a.date > b.date ? 1 : -1
          ),
      })
    );

    res.json({ eip: formattedResult, erc: ERCformattedResult });
  } catch (error: any) {
    console.error("Error retrieving EIPs:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
