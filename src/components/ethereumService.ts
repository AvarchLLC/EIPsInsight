import Web3 from 'web3';
import axios from 'axios';

// Initialize Web3 instances for Mainnet and Sepolia
const web3 = new Web3('https://ethereum-hoodi-rpc.publicnode.com');
const sepoliaWeb3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

// Define types for Block and TransactionReceipt
type Block = Awaited<ReturnType<typeof web3.eth.getBlock>>;
type TransactionReceipt = Awaited<ReturnType<typeof web3.eth.getTransactionReceipt>>;

/**
 * Fetches a block by its number or "latest".
 * @param blockNumber - The block number or "latest".
 * @param isSepolia - Whether to use the Sepolia network.
 * @returns The block data.
 */
export const getBlock = async (blockNumber: string | number, isSepolia: boolean = false): Promise<Block> => {
  const provider = isSepolia ? sepoliaWeb3 : web3;
  return await provider.eth.getBlock(blockNumber);
};

/**
 * Fetches a block with transactions by its number or "latest".
 * @param blockNumber - The block number or "latest".
 * @param isSepolia - Whether to use the Sepolia network.
 * @returns The block data with transactions.
 */
export const getBlockWithTransactions = async (blockNumber: string | number, isSepolia: boolean = false): Promise<Block> => {
  const provider = isSepolia ? sepoliaWeb3 : web3;
  return await provider.eth.getBlock(blockNumber, true); // Pass `true` to include transactions
};

/**
 * Calculates the gas burnt for a block.
 * @param block - The block data.
 * @returns The gas burnt in wei.
 */
export const getGasBurnt = (block: Block): bigint => {
  if (!block.baseFeePerGas) {
    return BigInt(0);
  }
  return BigInt(block.gasUsed) * BigInt(block.baseFeePerGas);
};

/**
 * Fetches Beacon Chain data for the latest finalized block.
 * @param isSepolia - Whether to use the Sepolia network.
 * @returns The Beacon Chain data.
 */
export const fetchBeaconChainData = async (isSepolia: boolean = false) => {
  const endpoint = isSepolia
    ? 'https://ethereum-sepolia-beacon-api.publicnode.com/eth/v1/beacon/headers/head'
    : 'https://ethereum-hoodi-beacon-api.publicnode.com/eth/v1/beacon/headers/head';

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch Beacon Chain data');
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching Beacon Chain data:', err);
    return null;
  }
};

/**
 * Fetches detailed block information, including Beacon Chain data.
 * @param blockNumber - The block number or "latest".
 * @param isSepolia - Whether to use the Sepolia network.
 * @returns The block details.
 */
export const getBlockDetails = async (blockNumber: string | number, isSepolia: boolean = false) => {
  const block = await getBlock(blockNumber, isSepolia);
  const gasBurnt = getGasBurnt(block);

  // Fetch Beacon Chain header data
  const beaconData = await fetchBeaconChainData(isSepolia);

  // Extract slot from the Beacon Chain header
  const slot = beaconData?.data?.header?.message?.slot ? parseInt(beaconData.data.header.message.slot, 10) : null;

  // Calculate epoch and slot in epoch
  const epochNumber = slot !== null ? Math.floor(slot / 32) : 'N/A';
  const slotInEpoch = slot !== null ? `${slot % 32}/32` : 'N/A';

  console.log("block:",block);

  return {
    epochNumber,
    slotInEpoch,
    validator: beaconData?.data?.header?.message?.proposer_index || block.miner,
    blockNumber: block.number,
    transactions: block.transactions?.length,
    size: `${(Number(block.size) / 1024).toFixed(2)} KB`,
    gasUsed: `${(Number(block.gasUsed) / 1e6).toFixed(1)}M`,
    gasLimit: `${(Number(block.gasLimit) / 1e6).toFixed(1)}M`,
    baseFee: `${Number(web3.utils.fromWei(block.baseFeePerGas || '0', 'gwei')).toFixed(2)} Gwei`,
    gasBurnt: `${web3.utils?.fromWei(gasBurnt.toString(), 'ether')} ETH`,
  };
};

/**
 * Fetches the last 7200 blocks using batch requests.
 * @param isSepolia - Whether to use the Sepolia network.
 * @returns The last 7200 blocks.
 */
export const fetchLast10Blocks = async (isSepolia: boolean = false) => {
    const provider = isSepolia ? sepoliaWeb3 : web3;
    const latestBlock = await provider.eth.getBlockNumber();
    const blockNumbers = Array.from({ length: 10 }, (_, i) => Number(latestBlock) - i);
  
    const batchSize = 100; // Number of blocks per batch
    const totalBatches = Math?.ceil(blockNumbers?.length / batchSize); // Total batches (72)
  
    const endpoint = isSepolia ? 'https://ethereum-sepolia-rpc.publicnode.com' : 'https://ethereum-hoodi-rpc.publicnode.com';
  
    const allBlocks: any[] = [];
  
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = start + batchSize;
      const batchBlockNumbers = blockNumbers.slice(start, end);
  
      const batchRequests = batchBlockNumbers?.map((blockNumber, index) => ({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: [web3.utils.toHex(blockNumber), true],
        id: index + 1,
      }));
  
      try {
        const response = await axios.post(endpoint, batchRequests);
        if (response.data && Array.isArray(response.data)) {
          allBlocks.push(...response.data?.map((res: any) => res.result));
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (err) {
        console.error('Error fetching batch:', err);
        throw new Error('Failed to fetch blocks');
      }
    }
  
    return allBlocks;
  };

// services/ethereumService.ts
export const fetchEthPriceInUSD = async (): Promise<number> => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      return response.data.ethereum.usd;
    } catch (err) {
      console.error('Error fetching Ethereum price:', err);
      return 0; // Fallback to 0 if the API fails
    }
  };

// utils/conversion.ts
export const convertEthToUSD = (eth: number, ethPriceInUSD: number): string => {
    return (eth * ethPriceInUSD).toFixed(6);
  };
  
  export const convertGweiToUSD = (gwei: number, ethPriceInUSD: number): string => {
    const eth = gwei / 1e9; // Convert Gwei to ETH
    return (eth * ethPriceInUSD).toFixed(6);
  };
