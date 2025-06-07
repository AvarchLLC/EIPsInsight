import { connectToDatabase } from '@/lib/mongodb';
interface SubscriptionInput {
  email: string;
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
  filter: 'all' | 'status';
}

export async function addSubscription({ email, type, id, filter }: SubscriptionInput) {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  console.log('📬 Writing to DB:', { email, type, id, filter }); // ✅ THIS LOG
  await db.collection('subscriptions').updateOne(
    { email, type, id, filter },
    { $setOnInsert: { email, type, id, filter, createdAt: new Date() } },
    { upsert: true }
  );
}
export async function getAllSubscriptions() {
  const client = await connectToDatabase();
  const db = client.db('eipsinsight');
  const subs = await db.collection('subscriptions').find({}).toArray();
  return subs;
}

// export async function getAllSubscriptions() {
//   return [
//     {
//       email: 'test@example.com',
//       type: 'eips',
//       id: '721',
//       filter: 'status'
//     }
//   ];
// }
