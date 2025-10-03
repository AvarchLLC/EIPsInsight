import { useState, useEffect } from 'react';
import EtherWorldAdCard from "@/components/EtherWorldAdCard";
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useColorModeValue,
  Button,
  HStack,
  VStack,
  Select,
  Icon,
  useToast,
  Skeleton,
  SkeletonText,
  Divider,
  Badge
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { MdNetworkCheck } from 'react-icons/md';
import BlockInfo from '@/components/TxTracker/BlockInfo';
import TransactionFeeChart from '@/components/TxTracker/TransactionFeeChart';
import RecentTransactions from '@/components/TxTracker/RecentTransactions';
import RecentBlocks from '@/components/TxTracker/RecentBlocks';
import LiveBlockIndicator from '@/components/TxTracker/LiveBlockIndicator';
import NetworkStatus from '@/components/TxTracker/NetworkStatus';
import ExplainerPanel from '@/components/TxTracker/ExplainerPanel';
import DataDebugPanel from '@/components/TxTracker/DataDebugPanel';
import { getBlockDetails, fetchLast10Blocks, fetchEthPriceInUSD } from '@/components/TxTracker/ethereumService';
import { RingLoader } from 'react-spinners';
import TransactionCountChart from '@/components/TxTracker/TransactionCountChart';
import AllLayout from '@/components/Layout';
import FeedbackWidget from '@/components/FeedbackWidget';


const REFRESH_INTERVAL_MS = 60_000; // Increased to 1 minute
const MAX_CHART_DATA_POINTS = 50; // Limit chart data points
const MAX_TRANSACTION_HISTORY = 20; // Limit transaction history

const EthereumV2 = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [network, setNetwork] = useState<'mainnet' | 'sepolia'>('mainnet');
  const [currentBlock, setCurrentBlock] = useState<any>(null);
  const [last10Blocks, setLast10Blocks] = useState<any[]>([]);
  const [transactionFees, setTransactionFees] = useState<any[]>([]);
  const [allBlocks, setAllBlocks] = useState<any[]>([]);
  const [priorityFee, setPriorityFee] = useState<any[]>([]);
  const [gasUsed, setGasUsed] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [gasBurntData, setGasBurntData] = useState<any[]>([]);
  const [ethPriceInUSD, setEthPriceInUSD] = useState<number>(0);

  // Unified loading flags
  const [loadingBlock, setLoadingBlock] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadingTxs, setLoadingTxs] = useState(true);
  const [loadingBlocksTable, setLoadingBlocksTable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const safeFetchJson = async (url: string, key: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${key} fetch failed`);
    return res.json();
  };

  // Utility to limit array size and prevent memory issues
  const limitArraySize = (arr: any[], maxSize: number) => {
    return arr.slice(-maxSize); // Keep only the latest entries
  };

  const fetchData = async (showToast = false) => {
    if (isRefreshing) return; // Prevent concurrent fetches
    setIsRefreshing(true);
    setError(null);
    
    // Only show loading on initial load
    if (!currentBlock) {
      setLoadingBlock(true);
      setLoadingMetrics(true);
      setLoadingCounts(true);
      setLoadingTxs(true);
      setLoadingBlocksTable(true);
    }
    
    try {
      // Fetch price and current block first (lightweight)
      const [price, block] = await Promise.all([
        fetchEthPriceInUSD(),
        getBlockDetails('latest', network === 'sepolia')
      ]);
      
      setEthPriceInUSD(price);
      setCurrentBlock(block);
      setLoadingBlock(false);

      // Fetch blocks with limited size
      const blocks = await fetchLast10Blocks(network === 'sepolia');
      const limitedBlocks = limitArraySize(blocks, 10);
      setLast10Blocks(limitedBlocks);
      
      // Process transactions from the latest block only to reduce memory usage
      const latestBlockTxs = limitedBlocks[0]?.transactions || [];
      setRecentTransactions(limitArraySize(latestBlockTxs, MAX_TRANSACTION_HISTORY));
      setLoadingTxs(false);
      setLoadingBlocksTable(false);

      // Fetch chart data with timeout and size limits
      const chartDataPromises = [
        safeFetchJson('/api/txtracker/fetchData', 'fees'),
        safeFetchJson('/api/txtracker/fetchData1', 'gasBurnt'),
        safeFetchJson('/api/txtracker/fetchData2', 'gasUsed'),
        safeFetchJson('/api/txtracker/fetchData3', 'priorityFee'),
        safeFetchJson('/api/txtracker/fetchData4', 'allBlocks')
      ];

      const results = await Promise.allSettled(chartDataPromises);
      
      // Process results safely
      const [feesResult, gasBurntResult, gasUsedResult, priorityFeeResult, allBlocksResult] = results;
      
      if (feesResult.status === 'fulfilled') {
        setTransactionFees(limitArraySize(feesResult.value.fees || [], MAX_CHART_DATA_POINTS));
      }
      if (gasBurntResult.status === 'fulfilled') {
        setGasBurntData(limitArraySize(gasBurntResult.value.gasBurnt || [], MAX_CHART_DATA_POINTS));
      }
      if (gasUsedResult.status === 'fulfilled') {
        setGasUsed(limitArraySize(gasUsedResult.value.gasUsed || [], MAX_CHART_DATA_POINTS));
      }
      if (priorityFeeResult.status === 'fulfilled') {
        setPriorityFee(limitArraySize(priorityFeeResult.value.priorityFee || [], MAX_CHART_DATA_POINTS));
      }
      if (allBlocksResult.status === 'fulfilled') {
        setAllBlocks(limitArraySize(allBlocksResult.value.allBlocks || [], MAX_CHART_DATA_POINTS));
      }

      setLoadingMetrics(false);
      setLoadingCounts(false);
      setLastUpdated(new Date());

      if (showToast) {
        toast({
          title: 'Refreshed',
          status: 'success',
          duration: 1400,
          isClosable: true,
          position: 'bottom-right'
        });
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to load data. Retry shortly.');
      setLoadingBlock(false);
      setLoadingMetrics(false);
      setLoadingCounts(false);
      setLoadingTxs(false);
      setLoadingBlocksTable(false);
      toast({
        title: 'Error',
        description: err?.message || 'Fetch failed',
        status: 'error',
        duration: 2500,
        isClosable: true,
        position: 'bottom-right'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial + network change
  useEffect(() => {
    fetchData(); // Still needed for chart data from MongoDB
  }, [network]);

  // Auto refresh with better cleanup
  useEffect(() => {
    const id = setInterval(() => {
      if (!isRefreshing) {
        fetchData();
      }
    }, REFRESH_INTERVAL_MS);
    
    return () => clearInterval(id);
  }, [network, isRefreshing]);

  const headerBar = (
    <Box mb={6} mt={4} px={{ base: 2, md: 0 }}>
      {/* Main Title Section */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
        align="stretch"
      >
        {/* Title and Description */}
        <Box
          flex="2"
          p={6}
          bg={useColorModeValue(
            'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)',
            'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)'
          )}
          borderRadius="2xl"
          border="1px solid"
          borderColor={useColorModeValue('purple.200', 'purple.700')}
        >
          <Flex direction="column" gap={4}>
            <Flex align="center" gap={3} flexWrap="wrap">
              <Icon as={MdNetworkCheck} boxSize={8} color="purple.500" />
              <VStack align="start" spacing={1}>
                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color={useColorModeValue('gray.800', 'gray.100')}>
                  🔍 Ethereum Live Monitor
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                  Track real-time blockchain activity, costs, and network health
                </Text>
              </VStack>
              <Badge colorScheme="green" variant="solid" fontSize=".7rem" px={3} py={1} borderRadius="full">
                ⚡ LIVE DATA
              </Badge>
            </Flex>
            
            <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')} lineHeight="1.6">
              📊 This dashboard shows you <strong>what's happening on Ethereum right now</strong> - 
              how much transactions cost, how busy the network is, and what types of activities are happening. 
              Perfect for understanding blockchain activity in simple terms!
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <Select
                size="sm"
                w="140px"
                value={network}
                onChange={e => setNetwork(e.target.value as any)}
                bg={colorMode === 'light' ? 'whiteAlpha.700' : 'whiteAlpha.200'}
                backdropFilter="blur(6px)"
                borderRadius="lg"
              >
                <option value="mainnet">Mainnet</option>
                <option value="sepolia">Sepolia</option>
              </Select>
              <Button
                size="sm"
                leftIcon={<RepeatIcon />}
                onClick={() => fetchData(true)}
                isLoading={isRefreshing}
                loadingText="Refreshing"
                bg="purple.600"
                _hover={{ bg: 'purple.500' }}
                color="white"
                borderRadius="full"
                isDisabled={isRefreshing}
              >
                Refresh Data
              </Button>
              <Badge
                variant="solid"
                colorScheme="pink"
                fontSize="1rem"
                borderRadius="full"
                px={3}
              >
                ETH ${ethPriceInUSD ? ethPriceInUSD.toFixed(2) : '—'}
              </Badge>
              {lastUpdated && (
                <Badge variant="outline" colorScheme="gray" fontSize="xs" px={2} py={1} borderRadius="md">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </Badge>
              )}
              {isRefreshing && (
                <Badge
                  variant="subtle"
                  colorScheme="blue"
                  fontSize="0.65rem"
                  px={2}
                >
                  🔄 Updating...
                </Badge>
              )}
            </HStack>
          </Flex>
        </Box>

        {/* Live Block Indicator */}
        <Box flex="1" minW="300px">
          <LiveBlockIndicator 
            network={network} 
            onBlockUpdate={(blockNumber) => {
              // Optional: Could trigger a refresh when new block arrives
            }}
          />
        </Box>
      </Flex>
    </Box>
  );

  const blockSkeleton = (
    <Box>
      <Skeleton height="220px" borderRadius="2xl" mb={6} />
      <Skeleton height="360px" borderRadius="2xl" mb={6} />
      <Skeleton height="360px" borderRadius="2xl" mb={6} />
      <Skeleton height="320px" borderRadius="2xl" mb={6} />
      <Skeleton height="320px" borderRadius="2xl" />
    </Box>
  );

  return (
    <>
      <FeedbackWidget />
      <AllLayout>
        <Box
          minH="100vh"
          px={{ base: 3, md: 8 }}
          pb={14}
        >
        
          {/* EtherWorld Advertisement */}
          <Box my={4} width="100%">
            <EtherWorldAdCard />
          </Box>
          
          {headerBar}

          {error && (
            <Box
              mb={6}
              border="1px solid"
              borderColor="red.400"
              bg="red.50"
              color="red.700"
              p={4}
              borderRadius="lg"
            >
              <Text fontWeight="semibold">Error</Text>
              <Text fontSize="sm">{error}</Text>
            </Box>
          )}

          {/* Beginner-Friendly Explanation Panel */}
          <ExplainerPanel />
          
          {/* Debug Panel - Remove this in production */}
          <DataDebugPanel />

          {(loadingBlock && loadingMetrics && loadingCounts && loadingTxs && loadingBlocksTable)
            ? blockSkeleton
            : (
              <Box>
                {/* Network Status Overview */}
                <NetworkStatus 
                  network={network}
                />

                {/* Current Block Info */}
                <BlockInfo
                  title="📦 Current Block Details"
                  data={currentBlock}
                  ethPriceInUSD={ethPriceInUSD}
                  isLoading={loadingBlock}
                />

                {/* Transaction Fee Trends */}
                <TransactionFeeChart
                  data={transactionFees}
                  data1={priorityFee}
                  data2={gasUsed}
                  data3={gasBurntData}
                  ethPriceInUSD={ethPriceInUSD}
                />

                {/* Network Activity Monitor */}
                <TransactionCountChart blocks={allBlocks}/>

                {/* Live Transaction Feed */}
                <RecentTransactions
                  transactions={recentTransactions}
                  timestamp={last10Blocks[0]?.timestamp ?? currentBlock?.timestamp ?? 0}
                  ethPriceInUSD={ethPriceInUSD}
                  isLoading={loadingTxs}
                />

                {/* Recent Blocks Table */}
                <RecentBlocks
                  blocks={last10Blocks}
                  ethPriceInUSD={ethPriceInUSD}
                  isLoading={loadingBlocksTable}
                />
              </Box>
            )}
        </Box>
      </AllLayout>
    </>
  );
};

export default EthereumV2;