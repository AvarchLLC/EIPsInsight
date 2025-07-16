import { addSubscription } from '@/utils/subscriptions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectToDatabase } from '@/lib/mongodb'; // Add this import
import { sendSubscriptionEmail } from '@/utils/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  let { email, type, id, filter } = req.body;

  // Use session email if available
  const userEmail = session?.user?.email || email;

  if (!userEmail || !type || !id || !filter) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if subscription already exists
    const existingSub = await checkExistingSubscription(userEmail, type, id);
    
    if (existingSub) {
      return res.status(409).json({ 
        error: 'You are already subscribed to this item' 
      });
    }

    // Add new subscription
    await addSubscription({ 
      email: userEmail, 
      type, 
      id, 
      filter 
    });

    // Send confirmation email
    await sendSubscriptionEmail(userEmail, id);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ DB error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function checkExistingSubscription(
  email: string, 
  type: string, 
  id: string
) {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  
  return await db.collection('subscriptions').findOne({ 
    email, 
    type, 
    id 
  });
}