// pages/api/magicians.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://ethereum-magicians.org/latest.json');
    const data = await response.json();

    res.status(200).json(data); // Contains topic_list.topics[] and users[]
  } catch (err) {
    console.error('Error fetching topics:', err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
}
