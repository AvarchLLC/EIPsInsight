import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// Middleware to set SSE headers
const sseHandler = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write('retry: 20000\n\n'); // Reconnect after 20 seconds
  req.on('close', () => res.end());
  next();
};

// API route for live block updates
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  sseHandler(req, res, () => {}); // Set SSE headers

  let timer: NodeJS.Timeout;

  const sendBlockData = async () => {
    try {
      const latestBlock = await provider.getBlock('latest');
      if (!latestBlock) {
        throw new Error('Failed to fetch the latest block');
      }

      const blockReward = ethers.formatEther('2'); // Default block reward (adjust based on your network rules)

      const blockInfo = {
        blockNumber: latestBlock.number,
        miner: latestBlock.miner,
        blockReward: blockReward + ' ETH',
      };

      res.write(`data: ${JSON.stringify(blockInfo)}\n\n`);
    } catch (error: unknown) {
      console.error('Error fetching latest block:', error instanceof Error ? error.message : 'Unknown error');
      res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`);
    }
  };

  // Start polling every 20 seconds
  timer = setInterval(sendBlockData, 12000);

  req.on('close', () => {
    console.log('Client disconnected');
    clearInterval(timer); // Stop the timer when the client disconnects
  });
};

export default handler;
