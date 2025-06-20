// pages/api/magicians.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://ethereum-magicians.org/latest.json');
    const data = await response.json();
    res.status(200).json(data); // now with correct CORS from your server
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
}
