// pages/api/subscriptions.ts
import { connectToDatabase } from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  if (!email) return res.status(401).json({ error: 'Authentication required' });

  try {
    const client = await connectToDatabase();
    const db = client.db('eipsinsight');

    const subs = await db.collection('subscriptions').find({ email }).toArray();
    return res.status(200).json(subs);
  } catch (err) {
    console.error('❌ Failed to fetch subscriptions:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
