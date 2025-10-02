import React, { useMemo } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Icon,
  Tooltip,
  useToast,
  Flex,
  HStack,
  Skeleton,
  Badge
} from '@chakra-ui/react';
import { FaList, FaCopy } from 'react-icons/fa';
import { convertEthToUSD, convertGweiToUSD } from './ethereumService';

interface RecentTransactionsProps {
  transactions: any[];
  ethPriceInUSD: number;
  timestamp: number;          // block timestamp (seconds)
  isLoading?: boolean;
  limit?: number;
}

const nf = (n: number | string, max = 6) =>
  isFinite(Number(n))
    ? Intl.NumberFormat('en-US', {
        maximumFractionDigits: max
      }).format(Number(n))
    : n;

const shorten = (v: string, len = 10) =>
  !v ? '-' : v.length <= len ? v : `${v.slice(0, len)}…`;

const RecentTransactions = ({
  transactions,
  ethPriceInUSD,
  timestamp,
  isLoading = false,
  limit = 15 // Reduced default limit
}: RecentTransactionsProps) => {
  const toast = useToast();

  // Memoize data processing to prevent unnecessary recalculations
  const data = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];
    return transactions.slice(0, limit).filter(tx => tx && tx.hash);
  }, [transactions, limit]);
  
  if (!isLoading && (!data || data.length === 0)) return null;

  const cardBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(245,247,250,0.55) 100%)',
    'linear-gradient(135deg, rgba(30,34,43,0.85) 0%, rgba(20,25,35,0.75) 100%)'
  );
  const headerGradient = useColorModeValue(
    'linear-gradient(90deg,#4f46e5,#6366f1)',
    'linear-gradient(90deg,#4338ca,#6366f1)'
  );
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const headBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.200');
  const rowBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.100');
  const rowHover = useColorModeValue('whiteAlpha.700', 'whiteAlpha.200');
  const textPrimary = useColorModeValue('gray.800', 'gray.100');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const copy = (text: string, label: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() =>
        toast({
          title: 'Copied',
            description: label,
          status: 'success',
          duration: 1600,
          isClosable: true,
          position: 'bottom-right'
        })
      )
      .catch(() =>
        toast({
          title: 'Copy failed',
          status: 'error',
          duration: 1800,
          isClosable: true,
          position: 'bottom-right'
        })
      );

  const ageFromBlock = (blockTsSec: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - blockTsSec;
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const skeletonRows = Array.from({ length: 8 });

  return (
    <Box
      mt={10}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      bg={cardBg}
      backdropFilter="blur(14px)"
      boxShadow={useColorModeValue(
        '0 4px 18px -2px rgba(99,102,241,0.25)',
        '0 4px 22px -4px rgba(99,102,241,0.35)'
      )}
      w="100%"
    >
      <Flex
        px={{ base: 5, md: 7 }}
        py={4}
        bg={headerGradient}
        align="center"
        gap={4}
        color="white"
      >
        <Flex
          w="46px"
          h="46px"
          borderRadius="lg"
          bg="whiteAlpha.300"
          align="center"
          justify="center"
        >
          <Icon as={FaList} boxSize={6} />
        </Flex>
        <Box>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
            Recent Transactions
          </Text>
          <Text fontSize="xs" opacity={0.85}>
            Latest {isLoading ? '' : data.length} (age vs block time)
          </Text>
        </Box>
      </Flex>

      <Box px={{ base: 3, md: 5 }} py={{ base: 4, md: 5 }} overflowX="auto">
        <Table
          size="sm"
          variant="unstyled"
          minW="1000px"
          sx={{ 'th, td': { whiteSpace: 'nowrap' } }}
        >
          <Thead>
            <Tr bg={headBg}>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary}>
                Hash
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary}>
                From
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary}>
                To
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary}>
                Age
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary} textAlign="right">
                Value (ETH)
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary} textAlign="right">
                Value (USD)
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary} textAlign="right">
                Gas Limit
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary} textAlign="right">
                Gas Price (Gwei)
              </Th>
              <Th fontSize="xs" textTransform="uppercase" color={textSecondary} textAlign="right">
                Est. Fee (USD)
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading &&
              skeletonRows.map((_, r) => (
                <Tr key={r}>
                  {Array.from({ length: 9 }).map((__, c) => (
                    <Td key={c} py={3}>
                      <Skeleton h="14px" w={c === 0 ? '80px' : '60px'} borderRadius="md" />
                    </Td>
                  ))}
                </Tr>
              ))}

            {!isLoading &&
              data.map((tx) => {
                // Values may be hex strings
                const hexToDec = (h: any) => {
                  if (!h) return 0;
                  try {
                    return Number(BigInt(h));
                  } catch {
                    return parseInt(h, 16) || 0;
                  }
                };

                const valueWei = hexToDec(tx.value);
                const valueEth = valueWei / 1e18;

                const gasLimit = hexToDec(tx.gas);
                const gasPriceWei = tx.gasPrice ? hexToDec(tx.gasPrice) : 0;
                const gasPriceGwei = gasPriceWei / 1e9;

                // Fee estimation (gasLimit * gasPrice); if actual gasUsed not available
                const estFeeEth = gasLimit && gasPriceWei ? (gasLimit * gasPriceWei) / 1e18 : 0;
                const estFeeUsd = convertEthToUSD(estFeeEth, ethPriceInUSD);

                const age = ageFromBlock(timestamp);

                const usdValue = convertEthToUSD(valueEth, ethPriceInUSD);

                return (
                  <Tr
                    key={tx.hash}
                    bg={rowBg}
                    _hover={{ bg: rowHover }}
                    transition="0.18s"
                  >
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label={tx.hash}>
                          <Text
                            fontWeight="semibold"
                            color="purple.400"
                            cursor="pointer"
                            onClick={() => copy(tx.hash, 'Hash')}
                          >
                            {shorten(tx.hash, 12)}
                          </Text>
                        </Tooltip>
                        <Icon
                          as={FaCopy}
                          boxSize={3.5}
                          color="purple.300"
                          cursor="pointer"
                          onClick={() => copy(tx.hash, 'Hash')}
                        />
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label={tx.from}>
                          <Text
                            fontSize="sm"
                            color={textPrimary}
                            cursor="pointer"
                            onClick={() => copy(tx.from, 'From')}
                          >
                            {shorten(tx.from, 10)}
                          </Text>
                        </Tooltip>
                        <Icon
                          as={FaCopy}
                          boxSize={3}
                          color="gray.400"
                          cursor="pointer"
                          onClick={() => copy(tx.from, 'From')}
                        />
                      </HStack>
                    </Td>
                    <Td>
                      {tx.to ? (
                        <HStack spacing={2}>
                          <Tooltip label={tx.to}>
                            <Text
                              fontSize="sm"
                              color={textPrimary}
                              cursor="pointer"
                              onClick={() => copy(tx.to, 'To')}
                            >
                              {shorten(tx.to, 10)}
                            </Text>
                          </Tooltip>
                          <Icon
                            as={FaCopy}
                            boxSize={3}
                            color="gray.400"
                            cursor="pointer"
                            onClick={() => copy(tx.to, 'To')}
                          />
                        </HStack>
                      ) : (
                        <Badge colorScheme="gray" variant="subtle">
                          Contract Creation
                        </Badge>
                      )}
                    </Td>
                    <Td color={textSecondary} fontSize="sm">
                      {age}
                    </Td>
                    <Td textAlign="right" fontWeight="medium" color={textPrimary}>
                      {nf(valueEth, 6)}
                    </Td>
                    <Td textAlign="right" fontSize="sm" color="green.400" fontWeight="semibold">
                      ${nf(usdValue, 2)}
                    </Td>
                    <Td textAlign="right" color={textPrimary}>
                      {gasLimit ? nf(gasLimit, 0) : '-'}
                    </Td>
                    <Td textAlign="right" color="orange.400" fontWeight="medium">
                      {gasPriceGwei ? nf(gasPriceGwei, 2) : '-'}
                    </Td>
                    <Td textAlign="right" fontSize="sm" color="pink.400" fontWeight="semibold">
                      {estFeeUsd ? `$${nf(estFeeUsd, 2)}` : '-'}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default React.memo(RecentTransactions);