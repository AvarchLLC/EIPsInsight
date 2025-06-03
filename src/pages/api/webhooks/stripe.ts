import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia"
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function sendPremiumConfirmationEmail(email: string) {
  const mailOptions = {
    from: `"EIPsInsight" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Welcome to Premium!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a4a4a;">Welcome to Premium!</h2>
        <p>Thank you for upgrading to EIPsInsight Premium tier. You now have access to all our exclusive features.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br/>EIPsInsight Team</p>
      </div>
       `,
    text: `Welcome to Premium!\n\nThank you for upgrading to EIPsInsight Premium tier. You now have access to all our exclusive features.\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nEIPsInsight Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send confirmation email', error);
    // Don't throw the error as we don't want to fail the webhook because of email
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const rawBody = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      req.on('end', () => {
        const totalLength = chunks?.reduce((sum, chunk) => sum + chunk?.length, 0);
        const combined = Buffer.alloc(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk?.length;
        }
        resolve(combined);
      });
      req.on('error', reject);
    });

    const signature = req.headers['stripe-signature'] as string;
    if (!signature) {
      return res.status(400).json({ error: 'Missing Stripe signature' });
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`🔔 Received event type: ${event.type}`);

    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection('users');

    if (event.type === 'checkout.session.completed' || 
        event.type === 'invoice.payment_succeeded' ||
        event.type === 'customer.subscription.updated') {
      
      let customerEmail: string | undefined;
      let customerId: string | undefined;
      let subscriptionId: string | undefined;

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        customerEmail = session.customer_email || 
                       session.customer_details?.email || 
                       undefined;
        customerId = typeof session.customer === 'string' ? session.customer : undefined;
        subscriptionId = typeof session.subscription === 'string' ? session.subscription : undefined;
      } else {
        const stripeObject = event.data.object as 
      | Stripe.Invoice 
      | Stripe.Subscription;

        customerId = typeof stripeObject.customer === 'string' ? stripeObject.customer : undefined;
        subscriptionId = stripeObject.id;
            
        if (customerId) {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && typeof customer !== 'string' && !customer.deleted) {
            customerEmail = customer.email || undefined;
          }
        }
      }

      if (!customerEmail) {
        console.error('❌ No valid customer email found');
        return res.status(400).json({ error: 'Customer email not found' });
      }

      // Normalize email (case insensitive match)
      const normalizedEmail = customerEmail.trim().toLowerCase();
      
      // Debug: Log what we're trying to update
      console.log(`🔄 Attempting to update user: ${normalizedEmail}`);

      const result = await usersCollection.updateOne(
        { email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } },
        { 
          $set: { 
            tier: 'Premium',
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId
          } 
        }
      );

      // Debug: Log the update result
      console.log('📊 Update result:', {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });

      if (result.matchedCount === 0) {
        console.error(`❌ User not found with email: ${normalizedEmail}`);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`✅ Updated user ${normalizedEmail} to Premium tier`);

      await sendPremiumConfirmationEmail(normalizedEmail);
    }


    // In your existing webhook handler
    if (event.type === 'customer.subscription.deleted' || 
      event.type === 'customer.subscription.updated') {

    const subscription = event.data.object as Stripe.Subscription;

    // Update user tier if subscription fully cancelled
    if (subscription.status === 'canceled') {
      await db.collection('users').updateOne(
        { stripeCustomerId: subscription.customer },
        { $set: { tier: 'Free', subscriptionStatus: 'cancelled' } }
      );
    }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Webhook handler error', err);
    return res.status(400).json({ error: 'Webhook error' });
  }
}