// src/pages/api/blockchain/recent/Blocks.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const latestBlockNumber = await provider.getBlockNumber();

    const blockPromises = [];

    // Fetch the last 10 blocks with transactions
    for (let i = 0; i < 10; i++) {
      blockPromises.push(provider.getBlock(latestBlockNumber - i, true)); // 'true' fetches transactions
    }

    const blocks = await Promise.all(blockPromises);

    // Check if any block is null
    const validBlocks = blocks.filter((block) => block !== null);

    // Create an array to hold the block info (block number, miner, and reward)
    const blockDetails = validBlocks.map((block: any) => {
      const blockReward = ethers.formatEther('2'); // Default block reward (adjust based on your network rules)

      return {
        blockNumber: block.number,
        miner: block.miner,
        blockReward: blockReward + ' ETH',
      };
    });

    res.status(200).json({
      success: true,
      data: blockDetails,
    });
  } catch (error: unknown) {
    // Type assertion to make error of type Error
    if (error instanceof Error) {
      console.error('Error fetching recent blocks:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching recent blocks',
        error: error.message,
      });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({
        success: false,
        message: 'An unknown error occurred',
        error: 'Unknown error',
      });
    }
  }
}
