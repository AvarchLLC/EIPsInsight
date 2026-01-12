import { connectToDatabase } from '@/lib/mongodb';

export interface SubscriptionInput {
  email: string;
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
  filter: 'all' | 'status' | 'content';
}

export async function addSubscription({ email, type, id, filter }: SubscriptionInput) {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  await db.collection('subscriptions').updateOne(
    { email, type, id, filter },
    { $setOnInsert: { email, type, id, filter, createdAt: new Date() } },
    { upsert: true }
  );
}

export async function getAllSubscriptions() {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  return db.collection('subscriptions').find({}).toArray();
}

export async function checkSubscriptionExists(
  email: string,
  type: string,
  id: string,
  filter: string
) {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  return await db.collection('subscriptions').findOne({ email, type, id, filter });
}

// State tracking (last processed commit per (type,id))
export async function getLastProcessedSha(type: string, id: string | number): Promise<string | null> {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  const doc = await db.collection('change_state').findOne({ type, id: String(id) });
  return doc?.lastSha ?? null;
}

export async function setLastProcessedSha(type: string, id: string | number, lastSha: string) {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  await db.collection('change_state').updateOne(
    { type, id: String(id) },
    { $set: { lastSha, updatedAt: new Date() } },
    { upsert: true }
  );
}
