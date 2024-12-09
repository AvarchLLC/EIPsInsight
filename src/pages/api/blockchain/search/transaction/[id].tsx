// src/pages/api/blockchain/search/transaction/[id].tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // 'id' will be the transaction hash
  
  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Transaction hash must be a string',
    });
  }

  try {
    // Fetch the transaction from the blockchain using the provided transaction hash
    const tx = await provider.getTransaction(id);

    // If the transaction doesn't exist, return an error message
    if (!tx) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Return the transaction data
    res.status(200).json({
      success: true,
      data: tx,
    });
  } catch (error: unknown) {
    // Type assertion for error handling
    if (error instanceof Error) {
      console.error('Error fetching transaction:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching transaction',
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
