import { Request, Response } from 'express';
import mongoose from 'mongoose';

if (mongoose.connection.readyState === 0) {
  if (typeof process.env.MONGODB_URI === 'string') {
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    console.error('MONGODB_URI environment variable is not defined');
  }
}

const prDetailsSchema = new mongoose.Schema({
  createdAt: { type: Date },
  closedAt: { type: Date },
  mergedAt: { type: Date },
});

const issueDetailsSchema = new mongoose.Schema({
  createdAt: { type: Date },
  closedAt: { type: Date },
});

const PrModels = {
  EIPs: mongoose.models.AllEipsPrDetails || mongoose.model('AllEipsPrDetails', prDetailsSchema),
  ERCs: mongoose.models.AllErcsPrDetails || mongoose.model('AllErcsPrDetails', prDetailsSchema),
  RIPs: mongoose.models.AllRipsPrDetails || mongoose.model('AllRipsPrDetails', prDetailsSchema),
};

const IssueModels = {
  EIPs: mongoose.models.AllEipsIssueDetails || mongoose.model('AllEipsIssueDetails', issueDetailsSchema),
  ERCs: mongoose.models.AllErcsIssueDetails || mongoose.model('AllErcsIssueDetails', issueDetailsSchema),
  RIPs: mongoose.models.AllRipsIssueDetails || mongoose.model('AllRipsIssueDetails', issueDetailsSchema),
};

const resolveYearMonth = (req: Request) => {
  const now = new Date();
  const yearParam = typeof req.query.year === 'string' ? Number.parseInt(req.query.year, 10) : now.getUTCFullYear();
  const monthParam = typeof req.query.month === 'string' ? Number.parseInt(req.query.month, 10) : now.getUTCMonth() + 1;
  const year = Number.isFinite(yearParam) ? yearParam : now.getUTCFullYear();
  const month = Number.isFinite(monthParam) && monthParam >= 1 && monthParam <= 12 ? monthParam : now.getUTCMonth() + 1;
  return { year, month };
};

const buildPrStats = async (model: mongoose.Model<any>, startDate: Date, endDate: Date) => {
  const [open, created, closed, merged] = await Promise.all([
    model.countDocuments({
      createdAt: { $lt: endDate },
      $or: [
        { closedAt: null },
        { closedAt: { $exists: false } },
        { closedAt: { $gte: startDate } },
      ],
    }),
    model.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } }),
    model.countDocuments({
      closedAt: { $gte: startDate, $lt: endDate },
      $or: [{ mergedAt: null }, { mergedAt: { $exists: false } }],
    }),
    model.countDocuments({ mergedAt: { $gte: startDate, $lt: endDate } }),
  ]);

  return { open, created, closed, merged };
};

const buildIssueStats = async (model: mongoose.Model<any>, startDate: Date, endDate: Date) => {
  const [open, created, closed] = await Promise.all([
    model.countDocuments({
      createdAt: { $lt: endDate },
      $or: [
        { closedAt: null },
        { closedAt: { $exists: false } },
        { closedAt: { $gte: startDate } },
      ],
    }),
    model.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } }),
    model.countDocuments({ closedAt: { $gte: startDate, $lt: endDate } }),
  ]);

  return { open, created, closed, merged: 0 };
};

export default async (req: Request, res: Response) => {
  try {
    const { year, month } = resolveYearMonth(req);
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const [eipsPrs, ercsPrs, ripsPrs, eipsIssues, ercsIssues, ripsIssues] = await Promise.all([
      buildPrStats(PrModels.EIPs, startDate, endDate),
      buildPrStats(PrModels.ERCs, startDate, endDate),
      buildPrStats(PrModels.RIPs, startDate, endDate),
      buildIssueStats(IssueModels.EIPs, startDate, endDate),
      buildIssueStats(IssueModels.ERCs, startDate, endDate),
      buildIssueStats(IssueModels.RIPs, startDate, endDate),
    ]);

    res.json({
      key,
      prs: {
        EIPs: { [key]: eipsPrs },
        ERCs: { [key]: ercsPrs },
        RIPs: { [key]: ripsPrs },
      },
      issues: {
        EIPs: { [key]: eipsIssues },
        ERCs: { [key]: ercsIssues },
        RIPs: { [key]: ripsIssues },
      },
    });
  } catch (error) {
    console.error('Error building insight stats:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
