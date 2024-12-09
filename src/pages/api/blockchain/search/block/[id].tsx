// src/pages/api/blockchain/search/block/[id].tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // 'id' will be the block number or block hash
  
  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Block identifier must be a string',
    });
  }

  try {
    // Check if id is a number or block hash, and parse it as needed
    let block;

    // If the id is numeric, use it as a block number
    if (!isNaN(Number(id))) {
      block = await provider.getBlock(Number(id));
    } else {
      // Otherwise, treat it as a block hash
      block = await provider.getBlock(id);
    }

    // If the block doesn't exist, return an error message
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found',
      });
    }

    // Return the block data
    res.status(200).json({
      success: true,
      data: block,
    });
  } catch (error: unknown) {
    // Type assertion for error handling
    if (error instanceof Error) {
      console.error('Error fetching block:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching block',
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
