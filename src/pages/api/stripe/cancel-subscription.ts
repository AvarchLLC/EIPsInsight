import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    
    // 1. Find user's Stripe customer ID
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    console.log("user data:",)

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    // 2. Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data?.length === 0) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    const subscription = subscriptions.data[0];

    // 3. Cancel immediately (or set cancel_at_period_end: true for end-of-period)
    const cancelledSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        cancel_at_period_end: true, // Recommended - lets user keep access until period ends
        // metadata: { cancelled_by: user.email }
      }
    );

    // 4. Update user tier in database
    await db.collection('users').updateOne(
      { email: session.user.email },
      { 
        $set: { 
          tier: 'Free',
          subscriptionStatus: 'cancelled',
          subscriptionEndDate: new Date(cancelledSubscription.current_period_end * 1000)
        } 
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Subscription will cancel at period end',
      endDate: cancelledSubscription.current_period_end
    });

  } catch (error) {
    console.error('Cancel error:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}