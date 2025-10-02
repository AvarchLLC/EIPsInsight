import React, { useMemo } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Tooltip,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  Skeleton
} from '@chakra-ui/react';
import {
  FaEthereum,
  FaGasPump,
  FaFire,
  FaList,
  FaCube,
  FaClock,
  FaCoins
} from 'react-icons/fa';
import { convertEthToUSD, convertGweiToUSD } from './ethereumService';

const numberFmt = (v: any) =>
  typeof v === 'number'
    ? Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(v)
    : v;

const chipBg = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'whiteAlpha.700' : 'whiteAlpha.200';

const BlockInfo = ({
  title,
  data,
  ethPriceInUSD,
  isLoading = false
}: {
  title: string;
  data: any;
  ethPriceInUSD: number;
  isLoading?: boolean;
}) => {
  const mode: 'light' | 'dark' = useColorModeValue('light', 'dark') as 'light' | 'dark';

  const cardBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(245,247,250,0.6) 100%)',
    'linear-gradient(135deg, rgba(35,39,47,0.85) 0%, rgba(26,32,44,0.75) 100%)'
  );
  const headerGradient = useColorModeValue(
    'linear-gradient(90deg,#4f46e5,#6366f1)',
    'linear-gradient(90deg,#4338ca,#6366f1)'
  );
  const tileBg = useColorModeValue('whiteAlpha.700', 'whiteAlpha.100');
  const tileBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const iconChipBg = chipBg(mode);
  const shadow = useColorModeValue(
    '0 4px 18px -2px rgba(99,102,241,0.25)',
    '0 4px 22px -4px rgba(99,102,241,0.35)'
  );
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subColor = useColorModeValue('gray.500', 'gray.400');

  const baseFeeNum = data?.baseFee
    ? Number(String(data.baseFee).split(' ')[0])
    : 0;
  const gasBurntNum = data?.gasBurnt
    ? Number(String(data.gasBurnt).split(' ')[0])
    : 0;

  const metrics =
    !data
      ? []
      : [
          {
            key: 'block',
            label: 'Block Number',
            value: numberFmt(Number(data.blockNumber)),
            icon: FaCube
          },
            {
            key: 'epoch',
            label: 'Epoch',
            value: numberFmt(data.epochNumber),
            icon: FaClock
          },
          {
            key: 'slot',
            label: 'Slot (Epoch)',
            value: numberFmt(data.slotInEpoch),
            icon: FaClock,
            help: `Slot within epoch ${data.epochNumber}`
          },
          {
            key: 'baseFee',
            label: 'Base Fee',
            value: `${baseFeeNum} gwei`,
            icon: FaCoins,
            usd: convertGweiToUSD(baseFeeNum, ethPriceInUSD)
          },
          {
            key: 'gasUsed',
            label: 'Gas Used',
            value: numberFmt(data.gasUsed),
            icon: FaGasPump,
            help: 'Total gas consumed'
          },
          {
            key: 'gasLimit',
            label: 'Gas Limit',
            value: numberFmt(data.gasLimit),
            icon: FaGasPump,
            help: 'Block gas target'
          },
          {
            key: 'gasBurnt',
            label: 'Gas Burnt',
            value: `${gasBurntNum} ETH`,
            icon: FaFire,
            usd: convertEthToUSD(gasBurntNum, ethPriceInUSD)
          },
          {
            key: 'txs',
            label: 'Transactions',
            value: numberFmt(data.transactions),
            icon: FaList
          }
        ];

  return (
    <Box
      position="relative"
      borderRadius="2xl"
      p={0}
      overflow="hidden"
      bg={cardBg}
      backdropFilter="blur(14px)"
      border="1px solid"
      borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
      boxShadow={shadow}
      mx="auto"
      w="100%"
      mt={10}
    >
      <Box
        px={{ base: 5, md: 8 }}
        py={5}
        bg={headerGradient}
        color="white"
        display="flex"
        alignItems="center"
        gap={3}
      >
        <Flex
          align="center"
          justify="center"
          w="42px"
          h="42px"
          borderRadius="full"
          bg="whiteAlpha.300"
        >
          <Icon as={FaEthereum} boxSize={6} />
        </Flex>
        <Box>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="xs" opacity={0.85}>
            Real‑time execution layer snapshot
          </Text>
        </Box>
      </Box>

      <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
          spacing={{ base: 4, md: 6 }}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  height="110px"
                  borderRadius="lg"
                  startColor="purple.300"
                  endColor="purple.600"
                  fadeDuration={0.5}
                />
              ))
            : metrics.map((m) => (
                <Stat
                  key={m.key}
                  bg={tileBg}
                  backdropFilter="blur(6px)"
                  border="1px solid"
                  borderColor={tileBorder}
                  borderRadius="lg"
                  p={4}
                  position="relative"
                  _hover={{
                    transform: 'translateY(-4px)',
                    transition: '0.25s',
                    boxShadow: shadow
                  }}
                  transition="0.25s"
                >
                  <HStack spacing={3} mb={1} align="center">
                    <Flex
                      w="38px"
                      h="38px"
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      bg={iconChipBg}
                    >
                      <Icon as={m.icon} color="purple.400" />
                    </Flex>
                    <StatLabel
                      fontSize="sm"
                      color={subColor}
                      lineHeight="1.1"
                      maxW="130px"
                    >
                      {m.label}
                    </StatLabel>
                  </HStack>
                  <StatNumber
                    fontSize="xl"
                    fontWeight="semibold"
                    color={textColor}
                  >
                    {m.value}
                  </StatNumber>
                  {(m.usd !== undefined || m.help) && (
                    <StatHelpText mt={1} fontSize="xs">
                      {m.usd !== undefined && (
                        <Tooltip
                          hasArrow
                          label="Approximate USD (spot)"
                          bg="purple.600"
                          color="white"
                        >
                          <Box as="span" color="purple.400" fontWeight="medium">
                            ${numberFmt(m.usd)}
                          </Box>
                        </Tooltip>
                      )}
                      {m.usd !== undefined && m.help && ' • '}
                      {m.help && <Box as="span">{m.help}</Box>}
                    </StatHelpText>
                  )}
                </Stat>
              ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default React.memo(BlockInfo);