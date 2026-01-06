import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Document, WithId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test');

    // Fetch EIP, ERC, and RIP boards from new analysis collections
    const [eipBoards, ercBoards, ripBoards] = await Promise.all([
      db.collection('eip_boards_analysis').find({}).toArray(),
      db.collection('erc_boards_analysis').find({}).toArray(),
      db.collection('rip_boards_analysis').find({}).toArray(),
    ]);

    // Add type field to distinguish between EIP, ERC, and RIP
    const eipData = eipBoards.map((item: WithId<Document>) => ({
      ...item,
      type: 'EIP',
      _id: item._id.toString(),
    }));

    const ercData = ercBoards.map((item: WithId<Document>) => ({
      ...item,
      type: 'ERC',
      _id: item._id.toString(),
    }));

    const ripData = ripBoards.map((item: WithId<Document>) => ({
      ...item,
      type: 'RIP',
      _id: item._id.toString(),
    }));

    // Combine and return
    const allBoards = [...eipData, ...ercData, ...ripData];

    res.status(200).json({
      success: true,
      data: allBoards,
      count: {
        eips: eipData.length,
        ercs: ercData.length,
        rips: ripData.length,
        total: allBoards.length,
      },
    });
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch board data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
