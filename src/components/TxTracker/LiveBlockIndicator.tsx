import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Icon,
  Tooltip,
  useColorModeValue,
  Skeleton,
  HStack,
  VStack
} from '@chakra-ui/react';
import { FaCube, FaClock, FaSignal } from 'react-icons/fa';
import { getBlockDetails } from './ethereumService';

interface LiveBlockIndicatorProps {
  network: 'mainnet' | 'sepolia';
  onBlockUpdate?: (blockNumber: number) => void;
}

const LiveBlockIndicator = ({ network, onBlockUpdate }: LiveBlockIndicatorProps) => {
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [blockTime, setBlockTime] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [timeAgo, setTimeAgo] = useState<string>('');

  const cardBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(239,246,255,0.8) 100%)',
    'linear-gradient(135deg, rgba(26,32,44,0.9) 0%, rgba(45,55,72,0.8) 100%)'
  );
  const borderColor = useColorModeValue('blue.200', 'blue.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subColor = useColorModeValue('gray.600', 'gray.400');

  // Fetch latest block number
  const fetchLatestBlock = async () => {
    try {
      const blockData = await getBlockDetails('latest', network === 'sepolia');
      const blockNumber = Number(blockData.blockNumber);
      
      if (blockNumber && blockNumber !== currentBlock) {
        setCurrentBlock(blockNumber);
        setBlockTime(new Date());
        onBlockUpdate?.(blockNumber);
      }
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch latest block:', error);
      setIsConnected(false);
    }
  };

  // Update time ago display
  const updateTimeAgo = () => {
    if (blockTime) {
      const now = new Date();
      const diff = Math.floor((now.getTime() - blockTime.getTime()) / 1000);
      
      if (diff < 60) {
        setTimeAgo(`${diff}s ago`);
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      } else {
        setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
      }
    }
  };

  // Initial fetch and setup intervals
  useEffect(() => {
    fetchLatestBlock();
    
    // Check for new blocks every 12 seconds (Ethereum block time)
    const blockInterval = setInterval(fetchLatestBlock, 12000);
    
    // Update time display every second
    const timeInterval = setInterval(updateTimeAgo, 1000);
    
    return () => {
      clearInterval(blockInterval);
      clearInterval(timeInterval);
    };
  }, [network]);

  // Update time ago when block time changes
  useEffect(() => {
    updateTimeAgo();
  }, [blockTime]);

  if (currentBlock === null) {
    return (
      <Skeleton 
        height="80px" 
        borderRadius="xl" 
        startColor="blue.300" 
        endColor="blue.600" 
      />
    );
  }

  return (
    <Box
      bg={cardBg}
      backdropFilter="blur(10px)"
      border="2px solid"
      borderColor={borderColor}
      borderRadius="xl"
      p={4}
      boxShadow={useColorModeValue(
        '0 4px 12px rgba(59, 130, 246, 0.15)',
        '0 4px 12px rgba(59, 130, 246, 0.25)'
      )}
      position="relative"
      overflow="hidden"
    >
      {/* Connection status indicator */}
      <Box
        position="absolute"
        top={2}
        right={2}
        w={3}
        h={3}
        borderRadius="full"
        bg={isConnected ? 'green.400' : 'red.400'}
        boxShadow={isConnected ? '0 0 8px rgba(34, 197, 94, 0.6)' : '0 0 8px rgba(239, 68, 68, 0.6)'}
      />

      <Flex align="center" justify="space-between">
        <HStack spacing={3}>
          <Flex
            w="50px"
            h="50px"
            bg="blue.500"
            borderRadius="lg"
            align="center"
            justify="center"
            boxShadow="0 4px 12px rgba(59, 130, 246, 0.3)"
          >
            <Icon as={FaCube} color="white" boxSize={6} />
          </Flex>
          
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color={subColor} fontWeight="medium">
              LATEST BLOCK
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={textColor} lineHeight="1">
              #{currentBlock?.toLocaleString()}
            </Text>
            <HStack spacing={2}>
              <Badge 
                colorScheme={network === 'mainnet' ? 'green' : 'orange'} 
                variant="solid" 
                fontSize="0.7rem"
                px={2}
                borderRadius="full"
              >
                {network === 'mainnet' ? 'MAINNET' : 'SEPOLIA'}
              </Badge>
              {timeAgo && (
                <Tooltip 
                  label={`Block mined at ${blockTime?.toLocaleTimeString()}`}
                  hasArrow
                >
                  <HStack spacing={1}>
                    <Icon as={FaClock} boxSize={3} color={subColor} />
                    <Text fontSize="xs" color={subColor}>
                      {timeAgo}
                    </Text>
                  </HStack>
                </Tooltip>
              )}
            </HStack>
          </VStack>
        </HStack>

        <VStack spacing={1} align="end">
          <HStack spacing={1}>
            <Icon 
              as={FaSignal} 
              boxSize={4} 
              color={isConnected ? 'green.400' : 'red.400'} 
            />
            <Text fontSize="xs" color={subColor}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </Text>
          </HStack>
          <Text fontSize="xs" color={subColor} textAlign="right">
            Auto-refresh
            <br />
            every 12s
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default React.memo(LiveBlockIndicator);