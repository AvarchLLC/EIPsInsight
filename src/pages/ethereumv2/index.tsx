import { useState, useEffect } from 'react';
import { Flex, Box, Text, useColorMode, Spinner } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import BlockInfo from '@/components/BlockInfo';
import TransactionFeeChart from '@/components/TransactionFeeChart';
import RecentTransactions from '@/components/RecentTransactions';
import RecentBlocks from '@/components/RecentBlocks';
import { getBlockDetails, fetchLast10Blocks, fetchEthPriceInUSD } from '@/components/ethereumService';
import { RingLoader } from 'react-spinners';
import TransactionCountChart from '@/components/TransactionCountChart';

const EthereumV2 = () => {
  const { colorMode } = useColorMode();
  const [network, setNetwork] = useState<'mainnet' | 'sepolia'>('mainnet');
  const [currentBlock, setCurrentBlock] = useState<any>(null);
  const [last10Blocks, setLast10Blocks] = useState<any[]>([]);
  const [transactionFees, setTransactionFees] = useState<any[]>([]);
  const [allBlocks, setallBlocks] = useState<any[]>([]);
  const [priorityFee, setPriorityFee] = useState<any[]>([]);
  const [gasUsed, setGasUsed] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ethPriceInUSD, setEthPriceInUSD] = useState<number>(0);
  const [gasBurntData, setGasBurntData] = useState<any[]>([]);

  // Function to calculate total gas burnt in the last hour
  const calculateTotalBurntLastHour = (gasBurntData: any[]) => {
    const lastHourData = gasBurntData.slice(0, 7200); // Assuming 5 blocks per minute (300 blocks in 1 hour)
    const totalBurnt = lastHourData.reduce((sum, data) => sum + data.gasBurnt / 1e18, 0); // Convert wei to ether
    return totalBurnt.toFixed(4); // Format to 4 decimal places
  };

  // Fetch data from the API route and fetchLast10Blocks
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch Ethereum price in USD
      const price = await fetchEthPriceInUSD();
      setEthPriceInUSD(price);

      // Fetch data from the API route
      const response = await fetch('/api/fetchData');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const { fees, gasBurnt, gasUsed, priorityFee, allBlocks } = await response.json();

      setTransactionFees(fees);
      setGasBurntData(gasBurnt);
      setallBlocks(allBlocks);
      setPriorityFee(priorityFee);
      setGasUsed(gasUsed);
      // setRecentTransactions(transactions);

      // Fetch last 10 blocks (unchanged logic)
      const blocks = await fetchLast10Blocks(network === 'sepolia');
      setLast10Blocks(blocks);
      setRecentTransactions(blocks[0].transactions.slice(0,10));

      // Fetch current block details (optional, if needed)
      const block = await getBlockDetails('latest', network === 'sepolia');
      setCurrentBlock(block);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [network]);

  return (
    <>
      <Box bg="black">
        <Sidebar />
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
                <TransactionFeeChart
                  data={transactionFees}
                  data1={priorityFee}
                  data2={gasUsed}
                  data3={gasBurntData}
                  // totalBurntLastHour={calculateTotalBurntLastHour(gasBurntData)}
                  // ethPriceInUSD={ethPriceInUSD}
                />
                <TransactionCountChart blocks={allBlocks}/>
                <RecentTransactions transactions={recentTransactions} ethPriceInUSD={ethPriceInUSD} />
                <RecentBlocks blocks={last10Blocks} ethPriceInUSD={ethPriceInUSD} />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default EthereumV2;