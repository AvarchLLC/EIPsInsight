import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.OPENPRS_MONGODB_URI || '';
const DB_NAME = process.env.OPENPRS_DATABASE || 'prsdb';

/** Graph 2a: Open PRs by category (Process). Graph 2b: Open PRs by subcategory (Participants). Same open PR set as Graph 1 Open. */
const CATEGORY_COLLECTIONS: Record<string, string> = {
  eips: 'eipsCategoryCharts',
  ercs: 'ercsCategoryCharts',
  rips: 'ripsCategoryCharts',
  all: 'allCategoryCharts',
};

const SUBCATEGORY_COLLECTIONS: Record<string, string> = {
  eips: 'eipsSubcategoryCharts',
  ercs: 'ercsSubcategoryCharts',
  rips: 'ripsSubcategoryCharts',
  all: 'allSubcategoryCharts',
};

const SPEC_BY_NAME: Record<string, string> = {
  eips: 'EIP',
  ercs: 'ERC',
  rips: 'RIP',
  all: 'ALL',
};

/** Chart document shape. category = "eips"|"ercs"|"rips"|"all"; type = category or subcategory name. */
export interface ChartDoc {
  _id: string;
  category: string;
  monthYear: string;
  type: string;
  count: number;
}

let client: MongoClient | null = null;

async function getDb() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = typeof req.query.name === 'string' ? req.query.name.toLowerCase() : '';
  const view = typeof req.query.view === 'string' ? req.query.view.toLowerCase() : '';
  const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
  const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;

  const validNames = ['eips', 'ercs', 'rips', 'all'];
  if (!validNames.includes(name)) {
    return res.status(400).json({
      error: 'Invalid name. Use eips, ercs, rips, or all',
    });
  }

  const viewCategory = view !== 'subcategory';
  const viewSubcategory = view !== 'category';

  try {
    const db = await getDb();

    const baseQuery: { category: string; monthYear?: { $gte?: string; $lte?: string } } = {
      category: name === 'all' ? '' : name,
    };
    if (startDate || endDate) {
      baseQuery.monthYear = {};
      if (startDate) baseQuery.monthYear.$gte = startDate;
      if (endDate) baseQuery.monthYear.$lte = endDate;
    }

    const sort = { monthYear: -1, type: 1 };

    const fetchCategory = async (spec: 'eips' | 'ercs' | 'rips') => {
      const q = { ...baseQuery, category: spec };
      const col = db.collection(CATEGORY_COLLECTIONS[spec]);
      return col.find(q).sort(sort).toArray();
    };

    const fetchSubcategory = async (spec: 'eips' | 'ercs' | 'rips') => {
      const q = { ...baseQuery, category: spec };
      const col = db.collection(SUBCATEGORY_COLLECTIONS[spec]);
      return col.find(q).sort(sort).toArray();
    };

    let categoryData: ChartDoc[] = [];
    let subcategoryData: ChartDoc[] = [];

    if (name === 'all') {
      const allCategoryCol = db.collection(CATEGORY_COLLECTIONS.all);
      const allSubcategoryCol = db.collection(SUBCATEGORY_COLLECTIONS.all);
      const allQuery: { category: string; monthYear?: { $gte?: string; $lte?: string } } = { category: 'all' };
      if (startDate || endDate) {
        allQuery.monthYear = {};
        if (startDate) allQuery.monthYear.$gte = startDate;
        if (endDate) allQuery.monthYear.$lte = endDate;
      }
      if (viewCategory) {
        const fromAll = await allCategoryCol.find(allQuery).sort(sort).toArray();
        if (fromAll && fromAll.length > 0) {
          categoryData = (fromAll as any[]).map((d: any) => ({
            _id: String(d._id ?? `${d.monthYear}-${d.type}`),
            category: d.category ?? 'all',
            monthYear: d.monthYear ?? '',
            type: d.type ?? '',
            count: typeof d.count === 'number' ? d.count : 0,
          }));
        } else {
          const [eips, ercs, rips] = await Promise.all([
            fetchCategory('eips'),
            fetchCategory('ercs'),
            fetchCategory('rips'),
          ]);
          const agg = new Map<string, ChartDoc>();
          [...(eips as any[]), ...(ercs as any[]), ...(rips as any[])].forEach((d: any) => {
            const monthYear = d.monthYear || '';
            const type = d.type || '';
            if (!monthYear || !type) return;
            const key = `${monthYear}__${type}`;
            const prev = agg.get(key);
            if (prev) prev.count += d.count || 0;
            else agg.set(key, { _id: `${monthYear}-${type}`, category: 'all', monthYear, type, count: d.count || 0 });
          });
          categoryData = Array.from(agg.values());
        }
      }
      if (viewSubcategory) {
        const fromAll = await allSubcategoryCol.find(allQuery).sort(sort).toArray();
        if (fromAll && fromAll.length > 0) {
          subcategoryData = (fromAll as any[]).map((d: any) => ({
            _id: String(d._id ?? `${d.monthYear}-${d.type}`),
            category: d.category ?? 'all',
            monthYear: d.monthYear ?? '',
            type: d.type ?? '',
            count: typeof d.count === 'number' ? d.count : 0,
          }));
        } else {
          const [eips, ercs, rips] = await Promise.all([
            fetchSubcategory('eips'),
            fetchSubcategory('ercs'),
            fetchSubcategory('rips'),
          ]);
          const agg = new Map<string, ChartDoc>();
          [...(eips as any[]), ...(ercs as any[]), ...(rips as any[])].forEach((d: any) => {
            const monthYear = d.monthYear || '';
            const type = d.type || '';
            if (!monthYear || !type) return;
            const key = `${monthYear}__${type}`;
            const prev = agg.get(key);
            if (prev) prev.count += d.count || 0;
            else agg.set(key, { _id: `${monthYear}-${type}`, category: 'all', monthYear, type, count: d.count || 0 });
          });
          subcategoryData = Array.from(agg.values());
        }
      }
    } else {
      const spec = name as 'eips' | 'ercs' | 'rips';
      if (viewCategory) {
        categoryData = (await fetchCategory(spec)) as ChartDoc[];
      }
      if (viewSubcategory) {
        subcategoryData = (await fetchSubcategory(spec)) as ChartDoc[];
      }
    }

    const normalize = (doc: any): ChartDoc => ({
      _id: String(doc._id ?? `${doc.monthYear}-${doc.type}`),
      category: doc.category ?? name,
      monthYear: doc.monthYear ?? '',
      type: doc.type ?? '',
      count: typeof doc.count === 'number' ? doc.count : 0,
    });

    const response: {
      specType: string;
      data: { category?: ChartDoc[]; subcategory?: ChartDoc[] };
      dateRange: { start: string; end: string };
    } = {
      specType: name === 'all' ? 'ALL' : SPEC_BY_NAME[name] || name,
      data: {},
      dateRange: { start: startDate || 'earliest', end: endDate || 'latest' },
    };

    if (viewCategory && categoryData.length) {
      response.data.category = categoryData.map(normalize);
    }
    if (viewSubcategory && subcategoryData.length) {
      response.data.subcategory = subcategoryData.map(normalize);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Graph 2 API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
