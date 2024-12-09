import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

// Initialize the provider
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

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
  res.write('retry: 20000\n\n'); // Reconnect every 20 seconds if disconnected

  let timer: NodeJS.Timeout;

  const sendTransactionData = async () => {
    try {
      const latestBlock = await provider.getBlock('latest'); // Fetch only the latest block (no transactions included)

      if (!latestBlock) {
        throw new Error('Latest block is null');
      }

      const transactionsInfo = await Promise.all(
        latestBlock.transactions.slice(0, 10).map(async (txHash) => {
          const tx = await provider.getTransaction(txHash); // Fetch individual transaction details

          if (!tx) {
            throw new Error(`Transaction ${txHash} not found`);
          }

          const valueInEth = tx.value ? ethers.formatEther(tx.value) : '0 ETH';
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: valueInEth,
          };
        })
      );

      res.write(`data: ${JSON.stringify(transactionsInfo)}\n\n`);
    } catch (error) {
      console.error('Error fetching transactions:', error instanceof Error ? error.message : 'Unknown error');
      res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`);
    }
  };

  // Start polling every 20 seconds
  timer = setInterval(sendTransactionData, 12000);

  req.on('close', () => {
    console.log('Client disconnected');
    clearInterval(timer); // Stop the timer when the client disconnects
  });
};

export default handler;
