// src/pages/api/blockchain/recent/Transactions.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Geth RPC URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const latestBlockNumber = await provider.getBlockNumber();
    const latestBlock = await provider.getBlock(latestBlockNumber, true); // Fetch block with transactions

    // Check if latestBlock is null or doesn't have transactions
    if (!latestBlock || !latestBlock.transactions || latestBlock.transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found in the latest block',
      });
    }

    const recentTransactions = latestBlock.transactions.slice(-10); // Last 10 transactions

    res.status(200).json({
      success: true,
      data: recentTransactions,
    });
  } catch (error: unknown) {
    // Type assertion to make error of type Error
    if (error instanceof Error) {
      console.error('Error fetching recent transactions:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching recent transactions',
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
