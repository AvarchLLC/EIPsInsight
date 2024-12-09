// src/pages/api/blockchain/recent/Transactions.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

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

    // Fetch the full transaction details for each transaction in the block
    const transactionsInfo = await Promise.all(
      latestBlock.transactions.slice(0, 10).map(async (txHash) => {
        // Fetch the full transaction data using the tx hash
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
          throw new Error(`Transaction ${txHash} not found`);
        }

        // Convert transaction value to Ether
        const valueInEth = tx.value ? ethers.formatEther(tx.value) : '0 ETH';

        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: valueInEth,
        };
      })
    );

    // Return the last 10 transactions
    const recentTransactions = transactionsInfo.slice(-10);

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
