import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

// Initialize the provider
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Update with your node provider

// Live transaction updates endpoint handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Client connected for live transaction updates');

  // Middleware for SSE (Server-Sent Events)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write('retry: 10000\n\n'); // Reconnect every 10 seconds

  const sendTransactionData = async () => {
    try {
      const latestBlock = await provider.getBlock('latest', true); // Fetch full transactions in the block

      if (!latestBlock) {
        throw new Error('Latest block is null');
      }

      // Log the full transactions to debug
      // console.log('Transactions in latest block:', latestBlock.transactions);

      // Fetch full transaction details for each tx hash
      const transactionsInfo = await Promise.all(
        latestBlock.transactions.slice(0, 10).map(async (txHash) => {
          // Fetch the full transaction data using the tx hash
          const tx = await provider.getTransaction(txHash);

          if (!tx) {
            throw new Error(`Transaction ${txHash} not found`);
          }
          const valueInEth = tx.value ? ethers.formatEther(tx.value) : '0 ETH';

          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: valueInEth
          };
        })
      );

      res.write(`data: ${JSON.stringify(transactionsInfo)}\n\n`);
    } catch (error) {
      console.error('Error fetching transactions:', error instanceof Error ? error.message : 'Unknown error');
      res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`);
    }
  };

  provider.on('block', async (blockNumber: number) => {
    await sendTransactionData();
  });

  req.on('close', () => {
    console.log('Client disconnected');
    provider.removeAllListeners('block'); // Removes the listener when the client disconnects
  });
};

export default handler;
