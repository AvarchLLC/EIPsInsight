import Web3 from 'web3';
import axios from 'axios';

const web3 = new Web3('https://ethereum-rpc.publicnode.com');
const sepoliaWeb3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

// Define types for Block and TransactionReceipt
type Block = Awaited<ReturnType<typeof web3.eth.getBlock>>;
type TransactionReceipt = Awaited<ReturnType<typeof web3.eth.getTransactionReceipt>>;

export const getBlock = async (blockNumber: string | number, isSepolia: boolean = false): Promise<Block> => {
  const provider = isSepolia ? sepoliaWeb3 : web3;
  return await provider.eth.getBlock(blockNumber);
};

export const getBlockWithTransactions = async (blockNumber: string | number, isSepolia: boolean = false): Promise<Block> => {
  const provider = isSepolia ? sepoliaWeb3 : web3;
  return await provider.eth.getBlock(blockNumber, true); // Pass `true` to include transactions
};

export const getGasBurnt = (block: Block): bigint => {
  if (!block.baseFeePerGas) {
    return BigInt(0);
  }
  return BigInt(block.gasUsed) * BigInt(block.baseFeePerGas);
};

export const fetchBeaconChainData = async (isSepolia: boolean = false) => {
  const endpoint = isSepolia
    ? 'https://ethereum-sepolia-beacon-api.publicnode.com/eth/v1/beacon/headers/head'
    : 'https://ethereum-beacon-api.publicnode.com/eth/v1/beacon/headers/head';

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

  return {
    epochNumber,
    slotInEpoch,
    validator: beaconData?.data?.header?.message?.proposer_index || block.miner,
    blockNumber: block.number,
    transactions: block.transactions?.length,
    size: `${(Number(block.size) / 1024)?.toFixed(2)} KB`,
    gasUsed: `${(Number(block.gasUsed) / 1e6)?.toFixed(1)}M`,
    gasLimit: `${(Number(block.gasLimit) / 1e6)?.toFixed(1)}M`,
    baseFee: `${Number(web3.utils?.fromWei(block.baseFeePerGas || '0', 'gwei')).toFixed(2)} Gwei`,
    gasBurnt: `${web3.utils?.fromWei(gasBurnt.toString(), 'ether')} ETH`,
  };
};

export const fetchLast7200Blocks = async (isSepolia: boolean = false) => {
  const provider = isSepolia ? sepoliaWeb3 : web3;
  const latestBlock = await provider.eth.getBlockNumber();
  const blockNumbers = Array?.from({ length: 7200 }, (_, i) => Number(latestBlock) - i);

  const batchRequests = blockNumbers?.map((blockNumber, index) => ({
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: [web3.utils.toHex(blockNumber), true],
    id: index + 1,
  }));

  const endpoint = isSepolia ? 'https://ethereum-sepolia-rpc.publicnode.com' : 'https://ethereum-rpc.publicnode.com';
  const response = await axios.post(endpoint, batchRequests);
  return response?.data;
};