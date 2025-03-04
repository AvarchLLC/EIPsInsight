import { useState, useEffect } from 'react';
import { Flex, Box, Text, useColorMode, Spinner } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import BlockInfo from '@/components/BlockInfo';
import TransactionFeeChart from '@/components/TransactionFeeChart';
import RecentTransactions from '@/components/RecentTransactions';
import RecentBlocks from '@/components/RecentBlocks';
import { getBlockDetails, fetchLast7200Blocks, fetchEthPriceInUSD } from '@/components/ethereumService';
import { RingLoader } from 'react-spinners';
import Web3 from 'web3';
import TransactionCountChart from '@/components/TransactionCountChart';

const EthereumV2 = () => {
  const { colorMode } = useColorMode();
  const [network, setNetwork] = useState<'mainnet' | 'sepolia'>('mainnet');
  const [currentBlock, setCurrentBlock] = useState<any>(null);
  const [last7200Blocks, setLast7200Blocks] = useState<any[]>([]);
  const [transactionFees, setTransactionFees] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ethPriceInUSD, setEthPriceInUSD] = useState<number>(0);

  const calculateTotalBurntLastHour = (blocks: any[]) => {
    const lastHourBlocks = blocks.slice(0, 300); // Assuming 5 blocks per minute (300 blocks in 1 hour)
    const totalBurnt = lastHourBlocks.reduce((sum, block) => {
      const gasBurnt = block.gasUsed * block.baseFeePerGas;
      return sum + Number(Web3.utils.fromWei(gasBurnt.toString(), 'ether'));
    }, 0);
    return totalBurnt.toFixed(4); // Format to 4 decimal places
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Ethereum price in USD
        const price = await fetchEthPriceInUSD();
        setEthPriceInUSD(price);

        // Fetch current block details
        const block = await getBlockDetails('latest', network === 'sepolia');
        setCurrentBlock(block);

        // Fetch last 7200 blocks in batches
        const blocks = await fetchLast7200Blocks(network === 'sepolia');
        setLast7200Blocks(blocks);

        // Process transaction fees for the chart
        const fees = blocks.map((block: any) => ({
          time: new Date(Number(block.timestamp) * 1000).toLocaleTimeString(),
          fee: Number(Web3.utils.fromWei(block.baseFeePerGas || '0', 'gwei')),
        }));
        setTransactionFees(fees);

        // Extract recent transactions
        const transactions = blocks.slice(0, 10).map((block: any) => ({
          hash: block.transactions[0]?.hash || 'N/A',
          value: Number(Web3.utils.fromWei(block.transactions[0]?.value || '0', 'ether')).toFixed(4),
          gas: Number(Web3.utils.fromWei(block.transactions[0]?.gasPrice || '0', 'gwei')).toFixed(2),
        }));
        setRecentTransactions(transactions);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [network]);

  return (
    <>
    <Box bg={"black"}>
    <Sidebar/>  
    <Flex>
      
      <Box flex="1" p={5}>

        {loading ? (
          <Flex justify="center" align="center" height="100vh">
            <RingLoader size={150} color="#be93d4" />
          </Flex>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : (
          <>
            <BlockInfo title="Current Block" data={currentBlock} ethPriceInUSD={ethPriceInUSD} />
            <TransactionFeeChart data={transactionFees} totalBurntLastHour={calculateTotalBurntLastHour(last7200Blocks)} ethPriceInUSD={ethPriceInUSD} />
            <TransactionCountChart blocks={last7200Blocks} />
            <RecentTransactions transactions={recentTransactions} ethPriceInUSD={ethPriceInUSD} />
            <RecentBlocks blocks={last7200Blocks.slice(0, 10)} ethPriceInUSD={ethPriceInUSD} />
          </>
        )}
      </Box>
    </Flex>
    </Box>
    </>
  );
};

export default EthereumV2;