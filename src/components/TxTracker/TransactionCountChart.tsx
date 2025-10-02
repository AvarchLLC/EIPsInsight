import React, { useState, useMemo } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  useColorModeValue,
  HStack,
  Icon,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { MdTimeline } from 'react-icons/md';
import dynamic from 'next/dynamic';

const Column = dynamic(() => import('@ant-design/plots').then(m => m.Column), { ssr: false });

type TransactionType = 'overall' | 'type0' | 'type1' | 'type2' | 'type3' | 'type4' | 'all';

interface TransactionCountChartProps {
  blocks: any[];
}

const TYPE_COLORS: Record<string, string> = {
  type0: '#6366F1',
  type1: '#10B981',
  type2: '#F59E0B',
  type3: '#EF4444',
  type4: '#8B5CF6',
};

const TransactionCountChart = ({ blocks }: TransactionCountChartProps) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('all');
  const [sliderValue, setSliderValue] = useState(0.9);

  const cardBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(245,247,250,0.55) 100%)',
    'linear-gradient(135deg, rgba(31,36,46,0.85) 0%, rgba(21,26,36,0.78) 100%)'
  );
  const headerGradient = useColorModeValue(
    'linear-gradient(90deg,#4f46e5,#6366f1)',
    'linear-gradient(90deg,#4338ca,#6366f1)'
  );
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const btnBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.200');
  const btnActive = useColorModeValue('purple.600', 'purple.500');

  // Normalize & prepare data with performance optimization
  const processed = useMemo(() => {
    if (!Array.isArray(blocks) || blocks.length === 0) return [];
    
    // Limit data points to prevent performance issues
    const maxPoints = 50;
    let processedBlocks = blocks;
    
    if (blocks.length > maxPoints) {
      const step = Math.ceil(blocks.length / maxPoints);
      processedBlocks = blocks.filter((_, index) => index % step === 0);
    }
    
    return processedBlocks
      .map(b => {
        // Defensive timestamp handling (seconds vs ms)
        const ts = Number(b.timestamp);
        if (isNaN(ts)) return null;
        
        const date = new Date(ts < 10_000_000_000 ? ts * 1000 : ts);
        return {
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          blockNumber: b.blockNumber ?? b.number,
          overall: b.total ?? (b.type0 ?? 0) + (b.type1 ?? 0) + (b.type2 ?? 0) + (b.type3 ?? 0) + (b.type4 ?? 0),
          type0: b.type0 ?? 0,
          type1: b.type1 ?? 0,
          type2: b.type2 ?? 0,
          type3: b.type3 ?? 0,
          type4: b.type4 ?? 0,
        };
      })
      .filter(Boolean) // Remove null entries
      .reverse(); // oldest→newest for slider
  }, [blocks]);

  const stackedData = useMemo(
    () =>
      processed.flatMap(p =>
        p
          ? [
              { time: p.time, blockNumber: p.blockNumber, type: 'type0', value: p.type0 },
              { time: p.time, blockNumber: p.blockNumber, type: 'type1', value: p.type1 },
              { time: p.time, blockNumber: p.blockNumber, type: 'type2', value: p.type2 },
              { time: p.time, blockNumber: p.blockNumber, type: 'type3', value: p.type3 },
              { time: p.time, blockNumber: p.blockNumber, type: 'type4', value: p.type4 },
            ]
          : []
      ),
    [processed]
  );

  const palette = transactionType === 'all'
    ? Object.values(TYPE_COLORS)
    : ['#6366F1'];

  const chartConfig: any = useMemo(() => ({
    data: transactionType === 'all' ? stackedData : processed,
    xField: 'time',
    yField: transactionType === 'all' ? 'value' : transactionType,
    seriesField: transactionType === 'all' ? 'type' : undefined,
    isStack: transactionType === 'all',
    color: (item: any) => {
      if (transactionType !== 'all') return '#6366F1';
      return TYPE_COLORS[item.type] || '#6366F1';
    },
    columnStyle: { radius: [2, 2, 0, 0] }, // Reduced radius for better performance
    legend: {
      position: 'top',
      itemName: { style: { fill: useColorModeValue('#1f2937', '#e2e8f0') } }
    },
    animation: false, // Disable animation for better performance
    slider: processed.length > 12 ? {
      start: sliderValue,
      end: 1,
      height: 16,
      trendCfg: { isArea: true },
      onChange: (val: number) => setSliderValue(val)
    } : undefined,
    tooltip: {
      shared: true,
      enterable: true,
      customContent: (title: string, items: any[]) => {
        if (!items?.length) return '';
        const blockNumber = items[0]?.data?.blockNumber ?? '-';
        return `<div style="padding:10px 12px;font-size:12px;">
          <div style="font-weight:600;margin-bottom:4px;">Block ${blockNumber}</div>
          <div style="opacity:.75;margin-bottom:6px;">${title}</div>
          ${items
            .map(
              it =>
                `<div style="display:flex;align-items:center;gap:6px;">
                   <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${it.color};"></span>
                   <span>${it.name || it.data?.type}</span>
                   <span style="margin-left:auto;font-weight:600;">${it.value}</span>
                 </div>`
            )
            .join('')}
        </div>`;
      }
    },
    interactions: [] // Disable interactions for better performance
  }), [transactionType, stackedData, processed, sliderValue]);

  const TYPES: TransactionType[] = ['all', 'overall', 'type0', 'type1', 'type2', 'type3', 'type4'];

  return (
    <Box
      mt={10}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      bg={cardBg}
      backdropFilter="blur(14px)"
      boxShadow={useColorModeValue(
        '0 4px 18px -2px rgba(99,102,241,0.25)',
        '0 4px 22px -4px rgba(99,102,241,0.35)'
      )}
      overflow="hidden"
      w="100%"
      mx="auto"
    >
      <Flex
        px={{ base: 5, md: 8 }}
        py={5}
        bg={headerGradient}
        color="white"
        align="center"
        gap={4}
        flexWrap="wrap"
      >
        <Flex
          w="50px"
          h="50px"
          borderRadius="xl"
          bg="whiteAlpha.300"
          align="center"
          justify="center"
        >
          <Icon as={MdTimeline} boxSize={7} />
        </Flex>
        <Box flex="1 1 auto" minW="220px">
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
            Transactions Trend
          </Text>
          <Text fontSize="xs" opacity={0.85}>
            Per block distribution by EIP‑2718 / EIP‑1559 types
          </Text>
        </Box>
        <HStack spacing={2} flexWrap="wrap">
          {TYPES.map(t => (
            <Tooltip
              key={t}
              label={t === 'all'
                ? 'Stacked view of all types'
                : t === 'overall'
                  ? 'Total transactions per block'
                  : `Only ${t}`}
              hasArrow
            >
              <Button
                size="sm"
                onClick={() => setTransactionType(t)}
                bg={transactionType === t ? btnActive : btnBg}
                color={transactionType === t ? 'white' : textColor}
                _hover={{ bg: transactionType === t ? btnActive : useColorModeValue('whiteAlpha.700','whiteAlpha.300') }}
                fontWeight="semibold"
                px={4}
                borderRadius="full"
                boxShadow={transactionType === t ? '0 0 0 1px rgba(255,255,255,0.25)' : 'none'}
                transition="0.18s"
              >
                {t === 'all'
                  ? 'Stacked'
                  : t === 'overall'
                    ? 'Total'
                    : t.toUpperCase()}
              </Button>
            </Tooltip>
          ))}
        </HStack>
      </Flex>

      <Box px={{ base: 4, md: 6 }} pt={5} pb={6}>
        <Flex align="center" justify="space-between" mb={3}>
          <Text fontSize="sm" color={subColor}>
            Blocks: {processed.length}
          </Text>
          {processed.length > 12 && (
            <Text fontSize="xs" color={subColor}>
              Drag slider below chart to browse history
            </Text>
          )}
        </Flex>
        <Box w="100%" h={{ base: 320, md: 360 }}>
          <Column {...chartConfig} />
        </Box>
        <Divider mt={5} mb={3} opacity={0.5} />
        <Text fontSize="xs" color={subColor}>
          Type0: Legacy | Type1: (Reserved / None) | Type2: EIP‑1559 | Type3/4: Other emerging types (if present)
        </Text>
      </Box>
    </Box>
  );
};

export default React.memo(TransactionCountChart);