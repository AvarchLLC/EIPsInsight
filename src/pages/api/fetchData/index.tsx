import { MongoClient } from 'mongodb';
import Web3 from 'web3';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db('test');

    // Fetch base fee data
    const baseFeeData = await db.collection('base_fee').find().sort({ timestamp: -1 }).limit(7200).toArray();
    const fees = baseFeeData.map((data) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      block: Number(data.blockNumber),
      fee: Number(Web3.utils.fromWei(data.baseFeePerGas || '0', 'gwei')), // Convert to Gwei
    }));

    // Fetch gas burnt data
    const gasBurntData = await db.collection('gas_burnt').find().sort({ timestamp: -1 }).limit(7200).toArray();
    const gasBurnt = gasBurntData.map((data) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      block: Number(data.blockNumber),
      gasBurnt: Number(Web3.utils.fromWei(data.gasBurnt || '0', 'gwei')), // Convert to Gwei
    }));

    // Fetch gas used data
    const gasUsedData = await db.collection('gas_used').find().sort({ timestamp: -1 }).limit(7200).toArray();
    const gasUsed = gasUsedData.map((data) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      block: Number(data.blockNumber),
      gasUsed: Number(Web3.utils.fromWei(data.gasUsed || '0', 'gwei')), // Convert to Gwei
    }));

    // Fetch priority fee data
    const priorityFeeData = await db.collection('priority_fee').find().sort({ timestamp: -1 }).limit(7200).toArray();
    const priorityFee = priorityFeeData.map((data) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      block: Number(data.blockNumber),
      priorityFee: Number(Web3.utils.fromWei(data.priorityFeePerGas || '0', 'gwei')), // Convert to Gwei
    }));

    // Fetch all blocks data
    const allBlocks = await db.collection('transaction_types').find().sort({ timestamp: -1 }).limit(7200).toArray();

    res.status(200).json({ fees, gasBurnt, gasUsed, priorityFee, allBlocks });
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ message: 'Failed to fetch data' });
  } finally {
    await client.close();
  }
}