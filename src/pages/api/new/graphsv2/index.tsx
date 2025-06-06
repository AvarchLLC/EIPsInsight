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
  mongoose.models.EipStatusChange3 ||
  mongoose.model("EipStatusChange3", statusChangeSchema, "eipstatuschange3");

const ErcStatusChange =
  mongoose.models.ErcStatusChange3 ||
  mongoose.model("ErcStatusChange3", statusChangeSchema, "ercstatuschange3");

const RipStatusChange =
  mongoose.models.RipStatusChange3 ||
  mongoose.model("RipStatusChange3", statusChangeSchema, "ripstatuschange3");

export default async (req: Request, res: Response) => {
  try {
    const eipResult = await EipStatusChange.aggregate([
      { $match: { category: { $ne: "ERC" } } },
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

    const formattedResult = eipResult?.map(
      (group: { _id: any; eips: any[] }) => ({
        status: group._id,
        eips: group.eips
          ?.reduce((acc, eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: "eip",
            });
            return acc;
          }, [])
          .sort((a: { date: number }, b: { date: number }) =>
            a.date > b.date ? 1 : -1
          ),
      })
    );

    const frozenErcResult = await EipStatusChange.aggregate([
      { $match: { category: "ERC" } },
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

    const formattedFrozenErcResult = frozenErcResult?.map(
      (group: { _id: any; eips: any[] }) => ({
        status: group._id,
        eips: group.eips
          ?.reduce((acc, eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: "erc",
            });
            return acc;
          }, [])
          .sort((a: { date: number }, b: { date: number }) =>
            a.date > b.date ? 1 : -1
          ),
      })
    );

    const ercResult = await ErcStatusChange.aggregate([
      { $match: { changeDate: { $gte: new Date("2023-11-01") } } },
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

    const ERCformattedResult = ercResult?.map(
      (group: { _id: any; eips: any[] }) => ({
        status: group._id,
        eips: group.eips
          ?.reduce((acc, eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: "erc",
            });
            return acc;
          }, [])
          .sort((a: { date: number }, b: { date: number }) =>
            a.date > b.date ? 1 : -1
          ),
      })
    );

    const ripResult = await RipStatusChange.aggregate([
      { $match: { changeDate: { $gte: new Date("2023-11-01") } } },
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

    const RIPformattedResult = ripResult?.map(
      (group: { _id: any; eips: any[] }) => ({
        status: group._id,
        eips: group.eips
          ?.reduce((acc, eipGroup) => {
            const { category,changedYear, changedMonth, count, eips } = eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: "rip",
            });
            return acc;
          }, [])
          .sort((a: { date: number }, b: { date: number }) =>
            a.date > b.date ? 1 : -1
          ),
      })
    );

    res.json({
      eip: formattedResult,
      erc: [...ERCformattedResult, ...formattedFrozenErcResult],
      rip: RIPformattedResult,
    });
  } catch (error: any) {
    console.error("Error retrieving EIPs:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
