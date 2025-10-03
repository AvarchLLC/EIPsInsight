import React from 'react';
import {
  Box,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  HStack,
  VStack,
  Badge,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { 
  FaNetworkWired, 
  FaGasPump, 
  FaTachometerAlt, 
  FaDollarSign,
  FaInfoCircle,
  FaSignal
} from 'react-icons/fa';

interface NetworkStatusProps {
  currentBlock: any;
  ethPriceInUSD: number;
  averageGasPrice?: number;
  networkUtilization?: number;
  isConnected: boolean;
}

const NetworkStatus = ({ 
  currentBlock, 
  ethPriceInUSD, 
  averageGasPrice = 0,
  networkUtilization = 0,
  isConnected 
}: NetworkStatusProps) => {
  const cardBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
    'linear-gradient(135deg, rgba(26,32,44,0.9) 0%, rgba(45,55,72,0.8) 100%)'
  );
  const borderColor = useColorModeValue('green.200', 'green.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subColor = useColorModeValue('gray.600', 'gray.400');

  // Calculate network congestion level
  const getNetworkStatus = () => {
    if (!currentBlock) return { level: 'Unknown', color: 'gray', description: 'Loading...' };
    
    const gasUsed = Number(currentBlock.gasUsed || 0);
    const gasLimit = Number(currentBlock.gasLimit || 1);
    const utilization = (gasUsed / gasLimit) * 100;
    
    if (utilization > 95) {
      return { 
        level: 'Very Congested', 
        color: 'red', 
        description: 'Network is very busy. Transactions may be slow and expensive.' 
      };
    } else if (utilization > 80) {
      return { 
        level: 'Congested', 
        color: 'orange', 
        description: 'Network is busy. Expect higher fees and slower confirmations.' 
      };
    } else if (utilization > 50) {
      return { 
        level: 'Moderate', 
        color: 'yellow', 
        description: 'Network has moderate activity. Normal fees expected.' 
      };
    } else {
      return { 
        level: 'Fast', 
        color: 'green', 
        description: 'Network is running smoothly. Low fees and fast transactions.' 
      };
    }
  };

  const networkStatus = getNetworkStatus();
  const gasUsedPercent = currentBlock ? 
    ((Number(currentBlock.gasUsed || 0) / Number(currentBlock.gasLimit || 1)) * 100).toFixed(1) : '0';

  // Estimate transaction cost in USD for a simple transfer
  const estimatedTxCost = currentBlock && ethPriceInUSD ? 
    ((Number(currentBlock.baseFeePerGas || 0) / 1e9) * 21000 * ethPriceInUSD / 1e9).toFixed(2) : '0';

  return (
    <Box
      bg={cardBg}
      backdropFilter="blur(10px)"
      border="2px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      p={6}
      boxShadow={useColorModeValue(
        '0 4px 20px rgba(34, 197, 94, 0.15)',
        '0 4px 20px rgba(34, 197, 94, 0.25)'
      )}
      mb={6}
    >
      {/* Header */}
      <Flex align="center" justify="space-between" mb={6}>
        <HStack spacing={3}>
          <Flex
            w="50px"
            h="50px"
            bg="green.500"
            borderRadius="lg"
            align="center"
            justify="center"
            boxShadow="0 4px 12px rgba(34, 197, 94, 0.3)"
          >
            <Icon as={FaNetworkWired} color="white" boxSize={6} />
          </Flex>
          <VStack align="start" spacing={0}>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Ethereum Network Status
            </Text>
            <Text fontSize="sm" color={subColor}>
              Real-time network health and costs
            </Text>
          </VStack>
        </HStack>
        
        <HStack spacing={2}>
          <Icon 
            as={FaSignal} 
            boxSize={4} 
            color={isConnected ? 'green.400' : 'red.400'} 
          />
          <Badge 
            colorScheme={isConnected ? 'green' : 'red'} 
            variant="solid" 
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </Badge>
        </HStack>
      </Flex>

      {/* Status Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {/* Network Congestion */}
        <Stat
          bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')}
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor={`${networkStatus.color}.200`}
        >
          <HStack spacing={2} mb={1}>
            <Icon as={FaTachometerAlt} color={`${networkStatus.color}.500`} />
            <StatLabel fontSize="xs" color={subColor}>NETWORK SPEED</StatLabel>
            <Tooltip label={networkStatus.description} hasArrow>
              <Icon as={FaInfoCircle} boxSize={3} color={subColor} />
            </Tooltip>
          </HStack>
          <StatNumber fontSize="lg" color={textColor}>
            {networkStatus.level}
          </StatNumber>
          <StatHelpText fontSize="xs">
            {gasUsedPercent}% capacity used
          </StatHelpText>
        </Stat>

        {/* ETH Price */}
        <Stat
          bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')}
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="blue.200"
        >
          <HStack spacing={2} mb={1}>
            <Icon as={FaDollarSign} color="blue.500" />
            <StatLabel fontSize="xs" color={subColor}>ETH PRICE</StatLabel>
            <Tooltip label="Current Ethereum price in USD" hasArrow>
              <Icon as={FaInfoCircle} boxSize={3} color={subColor} />
            </Tooltip>
          </HStack>
          <StatNumber fontSize="lg" color={textColor}>
            ${ethPriceInUSD.toLocaleString()}
          </StatNumber>
          <StatHelpText fontSize="xs">
            Live market price
          </StatHelpText>
        </Stat>

        {/* Gas Price */}
        <Stat
          bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')}
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="orange.200"
        >
          <HStack spacing={2} mb={1}>
            <Icon as={FaGasPump} color="orange.500" />
            <StatLabel fontSize="xs" color={subColor}>BASE GAS FEE</StatLabel>
            <Tooltip label="Minimum fee to send a transaction right now" hasArrow>
              <Icon as={FaInfoCircle} boxSize={3} color={subColor} />
            </Tooltip>
          </HStack>
          <StatNumber fontSize="lg" color={textColor}>
            {currentBlock ? (Number(currentBlock.baseFeePerGas || 0) / 1e9).toFixed(1) : '0'} gwei
          </StatNumber>
          <StatHelpText fontSize="xs">
            Current base fee
          </StatHelpText>
        </Stat>

        {/* Transaction Cost */}
        <Stat
          bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')}
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="purple.200"
        >
          <HStack spacing={2} mb={1}>
            <Icon as={FaDollarSign} color="purple.500" />
            <StatLabel fontSize="xs" color={subColor}>SIMPLE TX COST</StatLabel>
            <Tooltip label="Cost to send ETH to another wallet (21,000 gas)" hasArrow>
              <Icon as={FaInfoCircle} boxSize={3} color={subColor} />
            </Tooltip>
          </HStack>
          <StatNumber fontSize="lg" color={textColor}>
            ~${estimatedTxCost}
          </StatNumber>
          <StatHelpText fontSize="xs">
            ETH transfer estimate
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Network Health Explanation */}
      <Box
        mt={4}
        p={4}
        bg={useColorModeValue(`${networkStatus.color}.50`, `${networkStatus.color}.900`)}
        borderRadius="lg"
        border="1px solid"
        borderColor={`${networkStatus.color}.200`}
      >
        <Text fontSize="sm" color={textColor}>
          <strong>💡 What this means:</strong> {networkStatus.description}
        </Text>
        {networkStatus.level === 'Very Congested' && (
          <Text fontSize="xs" color={subColor} mt={1}>
            💰 Tip: Consider waiting for lower fees or increasing your gas price for faster confirmation.
          </Text>
        )}
        {networkStatus.level === 'Fast' && (
          <Text fontSize="xs" color={subColor} mt={1}>
            ✅ Great time to make transactions! Fees are low and confirmations are fast.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(NetworkStatus);