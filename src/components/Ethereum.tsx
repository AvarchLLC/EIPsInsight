import Web3 from 'web3';

const web3 = new Web3('https://ethereum-rpc.publicnode.com');

// Define types for Block and TransactionReceipt
type Block = Awaited<ReturnType<typeof web3.eth.getBlock>>;
type TransactionReceipt = Awaited<ReturnType<typeof web3.eth.getTransactionReceipt>>;

export const getBlock = async (blockNumber: string | number): Promise<Block> => {
  return await web3.eth.getBlock(blockNumber);
};

export const getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> => {
  return await web3.eth.getTransactionReceipt(txHash);
};

export const getBlockWithTransactions = async (blockNumber: string | number): Promise<Block> => {
  const block = await web3.eth.getBlock(blockNumber, true); // Pass `true` to include transactions
  return block;
};

export const getGasBurnt = (block: Block): bigint => {
  if (!block.baseFeePerGas) {
    return BigInt(0); // Use BigInt instead of ethers.BigNumber
  }
  return BigInt(block.gasUsed) * BigInt(block.baseFeePerGas); // Use native BigInt arithmetic
};

const fetchBeaconChainData = async () => {
    try {
      const response = await fetch('https://ethereum-beacon-api.publicnode.com/eth/v1/beacon/headers/head');
      if (!response.ok) {
        throw new Error('Failed to fetch Beacon Chain data');
      }
      const data = await response.json();
      console.log('Beacon Chain API Response:', data); // Log the response for debugging
      return data;
    } catch (err) {
      console.error('Error fetching Beacon Chain data:', err);
      return null;
    }
};

export const getBlockDetails = async (blockNumber: string | number) => {
    const block = await getBlock(blockNumber);
    const gasBurnt = getGasBurnt(block);
  
    // Ensure size is a number before performing arithmetic
    const sizeInBytes = typeof block.size === 'string' ? parseInt(block.size, 10) : Number(block.size);
  
    // Fetch Beacon Chain header data
    const beaconData = await fetchBeaconChainData();
  
    // Extract slot from the Beacon Chain header
    const slot = beaconData?.data?.header?.message?.slot ? parseInt(beaconData.data.header.message.slot, 10) : null;
  
    // Calculate epoch and slot in epoch
    const epochNumber = slot !== null ? Math.floor(slot / 32) : 'N/A';
    const slotInEpoch = slot !== null ? `${slot % 32}/32` : 'N/A';
  
    return {
      epochNumber,
      slotInEpoch,
      validator: beaconData?.data?.header?.message?.proposer_index || block.miner, // Use proposer index from Beacon Chain or fallback to miner
      blockNumber: block.number,
      transactions: block.transactions.length,
      size: `${(sizeInBytes / 1024).toFixed(2)} KB`, // Convert size to KB
      gasUsed: `${(Number(block.gasUsed) / 1e6).toFixed(1)}M`, // Convert gas used to millions
      gasLimit: `${(Number(block.gasLimit) / 1e6).toFixed(1)}M`, // Convert gas limit to millions
      baseFee: `${Number(web3.utils.fromWei(block.baseFeePerGas || '0', 'gwei')).toFixed(2)} Gwei`,
      gasBurnt: `${web3.utils.fromWei(gasBurnt.toString(), 'ether')} ETH`,
    };
  };