import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

type Counts = {
  eips?: number;
  ercs?: number;
  rips?: number;
  prs?: number;
  openPRs?: number;
  contributors?: number;
  repositories?: number;
  labels?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);

    const maybeCount = async (name: string) => {
      if (!names.includes(name)) return 0;
      try {
        return await db.collection(name).countDocuments();
      } catch (e) {
        return 0;
      }
    };

    const counts: Counts = {
      eips: await maybeCount('eips'),
      ercs: await maybeCount('ercs'),
      rips: await maybeCount('rips'),
      prs: await maybeCount('prs'),
      openPRs: await maybeCount('openprs'),
      contributors: await maybeCount('contributors'),
      repositories: await maybeCount('repositories'),
      labels: await maybeCount('labels'),
    };

    return res.status(200).json({ source: 'db', counts });
  } catch (error) {
    // If DB isn't available, return friendly fallback with nulls
    console.error('Stats API error:', error);
    const counts: Counts = {
      eips: null as any,
      ercs: null as any,
      rips: null as any,
      prs: null as any,
      openPRs: null as any,
      contributors: null as any,
      repositories: null as any,
      labels: null as any,
    };
    return res.status(200).json({ source: 'fallback', counts, message: 'Database unavailable' });
  }
}
