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

    // Debug mode: return collection names if ?debug=true
    if (req.query.debug === 'true') {
      return res.status(200).json({ collections: names.sort() });
    }

    const maybeCount = async (name: string) => {
      if (!names.includes(name)) return 0;
      try {
        return await db.collection(name).countDocuments();
      } catch (e) {
        return 0;
      }
    };

    // Helper to try multiple collection names
    const tryCollections = async (possibleNames: string[]): Promise<number> => {
      for (const name of possibleNames) {
        const count = await maybeCount(name);
        if (count > 0) return count;
      }
      return 0;
    };

    // Try multiple possible collection names for each category
    const eipsCount = await tryCollections(['eipmdfiles3s', 'eips']);
    const ercsCount = await tryCollections(['ercmdfiles3s', 'ercs']);
    const ripsCount = await tryCollections(['ripmdfiles3s', 'rips']);
    
    // For PRs, sum all PR collections or try single collection
    const alleipsprCount = await maybeCount('alleipsprdetails');
    const allercsprCount = await maybeCount('allercsprdetails');
    const allripsprCount = await maybeCount('allripsprdetails');
    const prsCount = (alleipsprCount + allercsprCount + allripsprCount) || await maybeCount('prs');
    
    const openPRsCount = await tryCollections(['openprs', 'openPRs']);
    const contributorsCount = await tryCollections(['contributors', 'allcontributors']);
    const repositoriesCount = await tryCollections(['repositories', 'repos']) || 3; // Default to 3 (eips, ercs, rips)

    const counts: Counts = {
      eips: eipsCount,
      ercs: ercsCount,
      rips: ripsCount,
      prs: prsCount,
      openPRs: openPRsCount,
      contributors: contributorsCount,
      repositories: repositoriesCount,
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
