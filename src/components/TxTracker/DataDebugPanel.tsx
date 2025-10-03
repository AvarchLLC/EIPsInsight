import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Code,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { unifiedDataService, type LiveDataStore } from './UnifiedDataService';

const DataDebugPanel = () => {
  const [liveData, setLiveData] = useState<LiveDataStore | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  useEffect(() => {
    const unsubscribe = unifiedDataService.subscribe((data) => {
      setLiveData(data);
    });
    return unsubscribe;
  }, []);

  if (!liveData) return null;

  const debugInfo = {
    lastUpdated: liveData.lastUpdated?.toISOString(),
    isLoading: liveData.isLoading,
    latestBlock: liveData.latestBlock ? {
      blockNumber: liveData.latestBlock.blockNumber,
      baseFeeGwei: liveData.latestBlock.baseFeeGwei,
      gasUsed: liveData.latestBlock.gasUsed,
      gasLimit: liveData.latestBlock.gasLimit,
      timestamp: liveData.latestBlock.timestamp
    } : null,
    ethPrice: liveData.ethPrice,
    recentBlocksCount: liveData.recentBlocks.length
  };

  return (
    <Box mt={4} mb={4}>
      <Accordion allowToggle>
        <AccordionItem border="1px" borderColor="orange.200" borderRadius="lg">
          <AccordionButton 
            bg="orange.100" 
            _hover={{ bg: 'orange.200' }}
            borderRadius="lg"
          >
            <Box flex="1" textAlign="left">
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                🐛 Data Debug Panel 
              </Text>
              <Text fontSize="xs" color="orange.600">
                Check what data is being used across components
              </Text>
            </Box>
            <Badge colorScheme={liveData.isLoading ? 'yellow' : 'green'} mr={2}>
              {liveData.isLoading ? 'Loading' : 'Live'}
            </Badge>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} bg={bg}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
                📊 Current Unified Data:
              </Text>
              <Code 
                display="block" 
                whiteSpace="pre-wrap" 
                fontSize="xs" 
                p={3}
                borderRadius="md"
              >
                {JSON.stringify(debugInfo, null, 2)}
              </Code>
              
              {liveData.latestBlock && (
                <Box mt={4}>
                  <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
                    🔍 Key Values:
                  </Text>
                  <Box fontSize="xs" color={textColor}>
                    <Text>• Block Number: <strong>#{liveData.latestBlock.blockNumber.toLocaleString()}</strong></Text>
                    <Text>• Base Fee: <strong>{liveData.latestBlock.baseFeeGwei.toFixed(2)} gwei</strong></Text>
                    <Text>• Gas Usage: <strong>{((liveData.latestBlock.gasUsed / liveData.latestBlock.gasLimit) * 100).toFixed(1)}%</strong></Text>
                    <Text>• ETH Price: <strong>${liveData.ethPrice.toLocaleString()}</strong></Text>
                    <Text>• Last Update: <strong>{liveData.lastUpdated?.toLocaleTimeString()}</strong></Text>
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default DataDebugPanel;